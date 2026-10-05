// ---- 言語設定 ----
let LANG = 'ja';
function L(ja, en){ return LANG === 'ja' ? ja : en; }
// 保存は常にこの端末のブラウザ内（localStorage）だけで完結させる。サーバーへの送信処理は一切ない。
function loadLang(){
  try{ const v = localStorage.getItem('tenohira-lang'); if(v) LANG = v; }catch(e){ /* 保存先が使えない環境では既定言語のまま */ }
}
function saveLang(){
  try{ localStorage.setItem('tenohira-lang', LANG); }catch(e){ /* 保存できなくても表示は続行 */ }
}
function applyStaticLang(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-en]').forEach(el => {
    if(LANG === 'en'){
      if(el.dataset.jaCache === undefined) el.dataset.jaCache = el.innerHTML;
      el.innerHTML = el.dataset.en;
    } else if(el.dataset.jaCache !== undefined){
      el.innerHTML = el.dataset.jaCache;
    }
  });
  document.querySelectorAll('[data-en-placeholder]').forEach(el => {
    if(LANG === 'en'){
      if(el.dataset.jaPlaceholder === undefined) el.dataset.jaPlaceholder = el.placeholder;
      el.placeholder = el.dataset.enPlaceholder;
    } else if(el.dataset.jaPlaceholder !== undefined){
      el.placeholder = el.dataset.jaPlaceholder;
    }
  });
  document.querySelectorAll('[data-en-aria-label]').forEach(el => {
    if(LANG === 'en'){
      if(el.dataset.jaAriaLabel === undefined) el.dataset.jaAriaLabel = el.getAttribute('aria-label') || '';
      el.setAttribute('aria-label',el.dataset.enAriaLabel);
    } else if(el.dataset.jaAriaLabel !== undefined){
      el.setAttribute('aria-label',el.dataset.jaAriaLabel);
    }
  });
  const btn = document.getElementById('langToggle');
  if(btn) btn.textContent = LANG === 'ja' ? 'English' : '日本語';
}

function renderRegistrationSchedule(){
  const select = document.getElementById('registrationCohort');
  const hint = document.getElementById('registrationCohortHint');
  if(!select || !hint) return;
  let visibleCount = 0;
  document.querySelectorAll('[data-registration-cohorts]').forEach(row => {
    const visible = row.dataset.registrationCohorts.split(/\s+/).includes(select.value);
    row.hidden = !visible;
    if(visible) visibleCount++;
  });
  const cohortLabel = select.options[select.selectedIndex]?.textContent.trim() || '';
  hint.textContent = LANG === 'ja'
    ? `${cohortLabel}向けの予定を${visibleCount}件表示しています。`
    : `Showing ${visibleCount} schedule entries for ${cohortLabel}.`;
}

// ---- data: course summaries (paraphrased from the public "授業科目の概要【全科目】" PDF) ----
// 各エントリ: [英語名, 日本語名, 区分, 内容（要約・パラフレーズ）, 担当教員(判明分のみ)]

const APP_DATA = globalThis.EIKEI_DATA;
const COURSES = APP_DATA.courses.courses;
const FACULTY_URL = APP_DATA.courses.facultyUrl;
const SECTIONS = APP_DATA.courses.sections;
const AUTUMN_ROOMS = APP_DATA.courses.autumnRooms;
const PREVIOUS_AUTUMN_ROOMS = APP_DATA.courses.previousAutumnRooms || {};
const AUTUMN_NOTES = APP_DATA.courses.autumnNotes;
const SUPPORTED_CODES = new Set(APP_DATA.courses.supportedCodes);
const TEAM_CODE_DATA = Object.freeze(APP_DATA.courses.teamCodes);
const SYLLABUS_DETAILS = APP_DATA.syllabi.details;
const INTENSIVE_INFO = APP_DATA.syllabi.intensiveInfo;
const CALENDAR = APP_DATA.calendar.events;
const COURSE_WINDOWS = APP_DATA.graduation.courseWindows;
const CREDIT_REQUIREMENTS = APP_DATA.graduation.minimumCredits;
const COURSE_CREDITS = APP_DATA.graduation.courseCredits;
const creditIntro = APP_DATA.graduation.classifications.introRequired;
const creditFoundation = APP_DATA.graduation.classifications.foundation;
const creditToolRequired = APP_DATA.graduation.classifications.toolRequired;

function normalizeName(s){
  return String(s || '')
    .replace(/[（(][^）)]*[）)]/g,'')
    .replace(/[／/].*/,'')
    .replace(/[〜～]/g,'~')
    .replace(/\bVI\b/g,'Ⅵ').replace(/\bV\b/g,'Ⅴ').replace(/\bIV\b/g,'Ⅳ')
    .replace(/\bIII\b/g,'Ⅲ').replace(/\bII\b/g,'Ⅱ').replace(/\bI\b/g,'Ⅰ')
    .replace(/\s+/g,'')
    .toLowerCase();
}

function teamCodeFor(code){
  if(TEAM_CODE_DATA.autumn[code]) return TEAM_CODE_DATA.autumn[code];
  if(TEAM_CODE_DATA.codes[code]) return TEAM_CODE_DATA.codes[code];
  if(/^P401[JE](?:-|$)/.test(code)) return TEAM_CODE_DATA.shared.p401 || '';
  if(/^A20[123][JE]-1S$/.test(code)) return TEAM_CODE_DATA.shared.a201_203 || '';
  if(/^A20[456]E(?:-|$)/.test(code)) return TEAM_CODE_DATA.shared.a204_206 || '';
  return '';
}
function hasTeamCode(code){
  return Boolean(teamCodeFor(code));
}
function teamCodeHTML(code, block){
  const value = teamCodeFor(code);
  if(!value) return '';
  const tag = block ? 'div' : 'span';
  return `<${tag} class="sMeta">${L('チームコード：','Team code: ')}<code class="teamCode">${escapeHTML(value)}</code><button type="button" class="copyTeamCode" data-team-code="${escapeHTML(value)}" aria-label="${escapeHTML(L('チームコード '+value+' をコピー','Copy team code '+value))}"></button></${tag}>`;
}
async function copyTeamCode(value){
  if(!/^[a-z0-9]{7}$/.test(value))return false;
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return true;}}catch{}
  const input=document.createElement('textarea');input.value=value;input.readOnly=true;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();
  let copied=false;try{copied=document.execCommand('copy');}catch{}input.remove();return copied;
}
document.addEventListener('click',async event=>{
  const button=event.target.closest('.copyTeamCode');if(!button)return;
  const ok=await copyTeamCode(button.dataset.teamCode||'');
  button.classList.toggle('isCopied',ok);
  button.setAttribute('aria-label',ok?L('コピーしました','Copied'):L('コピーできません','Copy failed'));setTimeout(()=>{if(button.isConnected){button.classList.remove('isCopied');button.setAttribute('aria-label',L('チームコード '+button.dataset.teamCode+' をコピー','Copy team code '+button.dataset.teamCode));}},1800);
});
// 公式時間割のコード末尾 J/E は、そのセクションの授業言語を表す。
// 科目単位で決め打ちせず、同一科目の日本語・英語セクションを個別に表示する。
function languageForCode(code){
  const match = String(code || '').match(/^[A-Z]\d{3}([JE])(?:-|$)/);
  if(match && match[1] === 'J') return {code:'J', ja:'日本語', en:'Japanese', className:'ja'};
  if(match && match[1] === 'E') return {code:'E', ja:'英語', en:'English', className:'en'};
  return {code:'', ja:'言語未確認', en:'Language not confirmed', className:'unknown'};
}
function languageBadgeHTML(code, offeredLabel){
  const language = languageForCode(code);
  const fullJa = language.code ? language.ja + (offeredLabel ? '開講' : '') : language.ja;
  const fullEn = language.code ? (offeredLabel ? 'Taught in ' : '') + language.en : language.en;
  const shortLabel = language.code === 'J' ? L('日','JA') : language.code === 'E' ? L('英','EN') : '?';
  const accessibleLabel = L(fullJa,fullEn);
  return `<span class="languageBadge ${language.className}" title="${escapeHTML(accessibleLabel)}" aria-label="${escapeHTML(accessibleLabel)}">${shortLabel}</span>`;
}
// マイ時間割では画面の表示言語ではなく、選択したセクションの開講言語で科目名を表示する。
function courseNameForTeachingLanguage(item){
  const language = languageForCode(item && item.code).code;
  if(language === 'E') return item.courseEn || item.courseJp || '';
  if(language === 'J') return item.courseJp || item.courseEn || '';
  return L(item.courseJp || item.courseEn || '', item.courseEn || item.courseJp || '');
}
const SECTIONS_BY_NORM = {};
SECTIONS.forEach(([code, name, teacher, day, term, room]) => {
  const key = normalizeName(name);
  if(!SECTIONS_BY_NORM[key]) SECTIONS_BY_NORM[key] = [];
  SECTIONS_BY_NORM[key].push({code, teacher, day, term, room: room || '', language: languageForCode(code), supported: SUPPORTED_CODES.has(code), syllabus: SYLLABUS_DETAILS[code] || null});
});

// 同一科目の日英セクションは、固有PDFがない側でも反対言語版の共通内容を参照できる。
// PBL・卒業プロジェクトは原則として同じ担当教員の場合だけ流用する。
// 課題解決演習ⅠAは教員別5 PDFの詳細が一致し、ⅠBはP202J-01のPDFが複数担当教員を
// 列記した科目共通シラバスのため、教員・開講言語が異なる各クラスでも共通内容を参照する。
const SHARED_SYLLABUS_BY_CODE = {};
const teacherKey = value => String(value || '').replace(/[\s　]+/g,'').toLowerCase();
const hasCourseWideSyllabus = code => /^P20[12][JE](?:-|$)/.test(String(code || ''));
COURSES.forEach(([en, jp]) => {
  const seen = new Set();
  const sections = [
    ...(SECTIONS_BY_NORM[normalizeName(en)] || []),
    ...(SECTIONS_BY_NORM[normalizeName(jp)] || [])
  ].filter(section => !seen.has(section.code) && seen.add(section.code));
  sections.forEach(section => {
    if(section.syllabus || !section.language.code) return;
    const teacherSpecific = /^P\d{3}/.test(section.code);
    const courseWideSyllabus = hasCourseWideSyllabus(section.code);
    const candidates = sections.filter(candidate =>
      candidate.syllabus &&
      !candidate.syllabusSourceCode &&
      candidate.language.code &&
      (courseWideSyllabus || candidate.language.code !== section.language.code) &&
      (!teacherSpecific || courseWideSyllabus || teacherKey(candidate.teacher) === teacherKey(section.teacher))
    );
    if(!candidates.length) return;
    candidates.sort((a,b) => {
      const score = candidate =>
        (teacherKey(candidate.teacher) === teacherKey(section.teacher) ? 4 : 0) +
        (candidate.term === section.term ? 2 : 0);
      return score(b) - score(a) || a.code.localeCompare(b.code);
    });
    const source = candidates[0];
    section.syllabus = source.syllabus;
    section.syllabusSourceCode = source.code;
    SHARED_SYLLABUS_BY_CODE[section.code] = source.code;
  });
});

// ---- 集中講義の教室・日程（公式PDF「2026年度集中講義」2026/7/1版より） ----

function formatIntensiveDates(dates){
  // 連続する日付は「M/D〜M/D」にまとめ、飛び飛びの日付は「・」区切りで並べる
  const fmt = d => { const dt = new Date(d+'T00:00:00'); return (dt.getMonth()+1)+'/'+dt.getDate(); };
  const sorted = dates.slice().sort();
  const runs = [];
  let runStart = sorted[0], prev = sorted[0];
  for(let i=1; i<=sorted.length; i++){
    const cur = sorted[i];
    const prevDate = new Date(prev+'T00:00:00');
    const nextDay = new Date(prevDate); nextDay.setDate(nextDay.getDate()+1);
    const nextDayStr = nextDay.getFullYear()+'-'+String(nextDay.getMonth()+1).padStart(2,'0')+'-'+String(nextDay.getDate()).padStart(2,'0');
    if(cur !== nextDayStr){
      runs.push(runStart === prev ? fmt(runStart) : fmt(runStart)+'〜'+fmt(prev));
      runStart = cur;
    }
    prev = cur;
  }
  return runs.join('・');
}
const SECTION_LOOKUP_CACHE = new Map();
function findSections(en, jp){
  const cacheKey = en + '\u0000' + jp;
  if(SECTION_LOOKUP_CACHE.has(cacheKey)) return SECTION_LOOKUP_CACHE.get(cacheKey);
  const a = SECTIONS_BY_NORM[normalizeName(en)] || [];
  const b = SECTIONS_BY_NORM[normalizeName(jp)] || [];
  // 英語名・日本語名のどちらか一方だけを採用すると、言語別セクションが欠けるため統合する
  const seen = new Set();
  const list = [...a, ...b].filter(s => !seen.has(s.code) && seen.add(s.code));
  const result = list.map(s => {
    const info = INTENSIVE_INFO[s.code];
    return info ? {...s, room: info.room, dates: info.dates, roomNote: info.note} : s;
  });
  SECTION_LOOKUP_CACHE.set(cacheKey, result);
  return result;
}
function renderSyllabusDetail(d, sourceCode){
  if(!d) return `<div class="syllabusUnavailable" role="note"><b>${L('シラバス未収録：','Syllabus not included: ')}</b>${L('このサイトには該当する詳細がありません。履修判断には2026年公式シラバスと大学の最新案内を確認してください。','No matching details are available on this site. Check the official 2026 syllabus and the latest university notices before making registration decisions.')}</div>`;
  const compactText = value => String(value || '').replace(/[\s\u3000。、，,.・:：;；()（）\[\]「」『』]/g,'').toLowerCase();
  const sourceLanguage = value => {
    const text = String(value || '');
    const hasJapanese = /[ぁ-んァ-ヶ一-龠々〆ヵヶ]/.test(text);
    const hasLatin = /[A-Za-z]/.test(text);
    if(hasJapanese && hasLatin) return 'mixed';
    if(hasJapanese) return 'ja';
    if(hasLatin) return 'en';
    return '';
  };
  const sourceBadge = kind => {
    if(!kind) return '';
    const labels = {
      ja:['日本語原文','Japanese original'],
      en:['英語原文','English original'],
      mixed:['日英併記の原文','Bilingual original']
    };
    return `<span class="sourceLanguageBadge">${escapeHTML(L(labels[kind][0],labels[kind][1]))}</span>`;
  };
  const field = (jaLabel,enLabel,jaValue,enValue) => {
    const selected = L(jaValue,enValue);
    const sameSource = compactText(jaValue) && compactText(jaValue) === compactText(enValue);
    const detected = sourceLanguage(selected);
    let badge = '';
    if(sameSource) badge = sourceBadge(detected);
    else if(LANG === 'ja' && detected === 'en') badge = sourceBadge('en');
    else if(LANG === 'en' && detected === 'ja') badge = sourceBadge('ja');
    return `<p><b>${L(jaLabel,enLabel)}</b>${badge}${escapeHTML(selected)}</p>`;
  };
  return `<details class="syllabusDetail">
    <summary>${sourceCode ? L('共通シラバス詳細','Shared syllabus details') : L('公式シラバス詳細','Official syllabus details')}</summary>
    <div class="syllabusDetailBody">
      ${sourceCode ? `<p class="ruleNote">${L('この時間割コード固有のPDFがないため、同一科目の共通内容として ','No PDF was found for this timetable code, so the shared content for the same course from ')}<b>${escapeHTML(sourceCode)}</b>${L(' のPDFを参照しています。',' is shown.')}</p>` : ''}
      <div class="syllabusFacts">
        <span>${escapeHTML(d.credits)}${L('単位',' credits')}</span>
        <span>${escapeHTML(L(d.requirementJa,d.requirementEn))}</span>
        <span>${L('対象学年：','Years: ')}${escapeHTML(d.years)}</span>
        ${d.categoryJa ? `<span>${escapeHTML(L(d.categoryJa,d.categoryEn))}</span>` : ''}
      </div>
      ${field('授業概要：','Description: ',d.descriptionJa,d.descriptionEn)}
      ${field('到達目標：','Aim: ',d.aimJa,d.aimEn)}
      ${field('履修条件：','Prerequisites: ',d.prerequisiteJa,d.prerequisiteEn)}
      ${field('教科書：','Textbook: ',d.textbookJa,d.textbookEn)}
      ${field('成績評価：','Assessment: ',d.assessmentJa,d.assessmentEn)}
      ${field('授業計画：','Course plan: ',d.planJa,d.planEn)}
      <p class="ruleNote">${L('出典：2026年公式シラバス（内容は読みやすく要約）','Source: Official 2026 syllabus (content summarized for readability)')}</p>
    </div>
  </details>`;
}

// ---- data: 2026年度 学年暦（公式キャンパスカレンダーより） ----
