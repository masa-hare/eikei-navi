"""公開前の簡単な確認。標準ライブラリだけで動く（追加の依存なし）。

- index.html のタグの開け閉めがそろっているか
- CSP の meta が、外部ファイルの読み込みより前にあり、既定拒否になっているか
- インラインスクリプト・イベント属性・javascript: URL がないか
- 外部から読むスクリプトや CSS に integrity と crossorigin があるか
- target="_blank" のリンクに rel="noopener noreferrer" があるか（HTML と js/*.js）
- sw.js がキャッシュするファイルがすべて存在するか
"""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "source", "track", "wbr"}
errors = []


def error(msg):
    errors.append(msg)


class Checker(HTMLParser):
    def __init__(self, name):
        super().__init__(convert_charrefs=True)
        self.name = name
        self.stack = []
        self.csp = None
        self.referrer = None
        self.loaded_before_csp = []
        self.in_script = False

    def where(self):
        return f"{self.name}:{self.getpos()[0]}"

    def handle_starttag(self, tag, attrs):
        a = {k: (v or "") for k, v in attrs}
        for k, v in a.items():
            if k.startswith("on"):
                error(f"{self.where()}: イベント属性 {k} があります（CSP で止まります）")
            if k in ("href", "src", "action", "formaction") and v.strip().lower().startswith("javascript:"):
                error(f"{self.where()}: javascript: URL があります")
        if tag == "meta" and a.get("http-equiv", "").lower() == "content-security-policy":
            self.csp = a.get("content", "")
        if tag == "meta" and a.get("name", "").lower() == "referrer":
            self.referrer = a.get("content", "")
        if tag in ("script", "link", "img", "iframe", "style") and self.csp is None:
            self.loaded_before_csp.append(f"{self.where()} <{tag}>")
        external = lambda u: u.startswith(("http:", "https:", "//"))
        is_stylesheet = tag == "link" and "stylesheet" in a.get("rel", "").lower().split()
        if (tag == "script" and external(a.get("src", ""))) or (is_stylesheet and external(a.get("href", ""))):
            if not a.get("integrity", "").startswith(("sha256-", "sha384-", "sha512-")):
                error(f"{self.where()}: 外部の <{tag}> に integrity がありません")
            if a.get("crossorigin") != "anonymous":
                error(f"{self.where()}: 外部の <{tag}> に crossorigin=\"anonymous\" がありません")
        if tag == "a" and a.get("target", "").lower() == "_blank":
            rel = a.get("rel", "").lower().split()
            if "noopener" not in rel or "noreferrer" not in rel:
                error(f"{self.where()}: target=\"_blank\" に rel=\"noopener noreferrer\" がありません")
        if tag == "script":
            self.in_script = True
        if tag not in VOID:
            self.stack.append((tag, self.getpos()[0]))

    def handle_startendtag(self, tag, attrs):
        # <br/> のような書き方。開け閉めの数には入れない。
        before = len(self.stack)
        self.handle_starttag(tag, attrs)
        if len(self.stack) > before:
            self.stack.pop()
        self.in_script = False

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_script = False
        if tag in VOID:
            return
        if not self.stack:
            error(f"{self.where()}: 対応する開始タグのない </{tag}>")
            return
        open_tag, line = self.stack[-1]
        if open_tag == tag:
            self.stack.pop()
        elif any(t == tag for t, _ in self.stack):
            while self.stack and self.stack[-1][0] != tag:
                t, l = self.stack.pop()
                error(f"{self.name}:{l}: <{t}> が閉じられていません")
            self.stack.pop()
        else:
            error(f"{self.where()}: 対応する開始タグのない </{tag}>")

    def handle_data(self, data):
        if self.in_script and data.strip():
            error(f"{self.where()}: インラインスクリプトがあります（CSP で止まります）")


def check_csp(name, csp):
    if csp is None:
        error(f"{name}: Content-Security-Policy の meta がありません")
        return
    d = {}
    for part in csp.split(";"):
        bits = part.split()
        if bits:
            d[bits[0].lower()] = bits[1:]
    if d.get("default-src") != ["'none'"]:
        error(f"{name}: CSP の default-src が 'none' ではありません")
    for key in ("script-src", "script-src-attr"):
        for bad in ("'unsafe-inline'", "'unsafe-eval'", "*", "http:", "https:", "data:"):
            if bad in d.get(key, []):
                error(f"{name}: CSP の {key} に {bad} があります")
    for key in ("object-src", "base-uri", "form-action"):
        if d.get(key) != ["'none'"]:
            error(f"{name}: CSP の {key} が 'none' ではありません")
    if "frame-ancestors" in d:
        error(f"{name}: frame-ancestors は meta では効きません")


for html in sorted(ROOT.glob("*.html")):
    c = Checker(html.name)
    c.feed(html.read_text(encoding="utf-8"))
    c.close()
    for tag, line in c.stack:
        if tag not in ("html", "body", "head"):
            error(f"{html.name}:{line}: <{tag}> が閉じられていません")
    check_csp(html.name, c.csp)
    for item in c.loaded_before_csp:
        error(f"{item} が CSP の meta より前にあります")
    if c.referrer != "no-referrer" and c.referrer != "strict-origin-when-cross-origin":
        error(f"{html.name}: referrer の meta がないか、緩すぎます")

# JS が組み立てる HTML の中の target="_blank"
for js in sorted((ROOT / "js").glob("*.js")):
    for no, line in enumerate(js.read_text(encoding="utf-8").splitlines(), 1):
        for m in re.finditer(r"<a\b[^>]*target=[\"']?_blank[^>]*>", line):
            rel = re.search(r"rel=[\"']([^\"']*)", m.group(0))
            words = rel.group(1).lower().split() if rel else []
            if "noopener" not in words or "noreferrer" not in words:
                error(f"js/{js.name}:{no}: target=\"_blank\" に rel=\"noopener noreferrer\" がありません")

# sw.js がキャッシュするファイル
sw = (ROOT / "sw.js").read_text(encoding="utf-8")
shell = re.search(r"APP_SHELL\s*=\s*\[(.*?)\]", sw, re.S)
if not shell:
    error("sw.js: APP_SHELL が見つかりません")
else:
    for path in re.findall(r"['\"]([^'\"]+)['\"]", shell.group(1)):
        if path.startswith(("http:", "https:", "//")):
            error(f"sw.js: 別オリジンのファイル {path} をキャッシュしようとしています")
        elif not (ROOT / path).resolve().is_file():
            error(f"sw.js: キャッシュ対象 {path} がありません")

if errors:
    for e in errors:
        print(f"::error::{e}")
    sys.exit(1)
print("OK: HTML・CSP・リンク・Service Worker のキャッシュ対象を確認しました")
