CALENDAR.sort((a,b) => a[0].localeCompare(b[0]));

// ---- render: syllabus ----
const courseList = document.getElementById('courseList');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const termFilter = document.getElementById('termFilter');
const resultCount = document.getElementById('resultCount');
const totalCount = document.getElementById('totalCount');
const emptyState = document.getElementById('emptyState');

// ---- マイ時間割：この端末だけに保存（他の人には見えません） ----
const CATEGORY_EN = {
  'IEP':'IEP',
  '実践英語（基盤科目）':'Practical English (Foundation)',
  'ICT・データサイエンス':'ICT / Data Science','思考系':'Thinking Skills',
  'リベラルアーツ（人）':'Liberal Arts (Humanities)','リベラルアーツ（社会）':'Liberal Arts (Social Science)',
  'リベラルアーツ（自然）':'Liberal Arts (Natural Science)',
  '実践科目':'Capstone Course','体験・実践プログラム':'Experiential Programs','日本語':'Japanese Language',
  '課題解決演習':'Project-Based Learning','卒業プロジェクト':'Degree Project'
};
const WINDOW_LABELS = {
  identity:['アイデンティティデザイン','Identity Design'],
  business:['ビジネスデザイン','Business Design'],
  ecosystem:['エコシステムデザイン','Ecosystem Design']
};
const LIBERAL_ARTS_FIELD_LABELS = {
  '人':['人','Humanities'],
  '社会':['社会','Social Science'],
  '自然':['自然','Natural Science']
};
// 2026年度の公式カリキュラムに記載されたリベラルアーツ発展科目のウィンドウ区分。
// 入門・基盤科目はウィンドウ対象ではないため、ここには含めない。

const windowFilterEl = document.getElementById('windowFilter');
const TERM_ORDER = ['Spring','Summer','Autumn','Winter','Intensive'];
const TERM_LABEL = {Spring:'春（Spring）',Summer:'夏（Summer）',Autumn:'秋（Autumn）',Winter:'冬（Winter）',Intensive:'集中'};
const TERM_LABEL_EN = {Spring:'Spring',Summer:'Summer',Autumn:'Autumn',Winter:'Winter',Intensive:'Intensive'};
function populateFilters(){
  const catVal = categoryFilter.value, termVal = termFilter.value;
  categoryFilter.innerHTML = `<option value="">${L('すべての区分','All categories')}</option>`;
  [...new Set(COURSES.map(c => c[2]))].forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat; opt.textContent = L(cat, CATEGORY_EN[cat] || cat);
    categoryFilter.appendChild(opt);
  });
  categoryFilter.value = catVal;
  termFilter.innerHTML = `<option value="">${L('すべての学期','All quarters')}</option>`;
  TERM_ORDER.filter(t => SECTIONS.some(s => s[4]===t)).forEach(t => {
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = L(TERM_LABEL[t] || t, TERM_LABEL_EN[t] || t);
    termFilter.appendChild(opt);
  });
  termFilter.value = termVal;
}
// ---- あいまい検索：全角/半角の揺れを吸収し、複数キーワードはAND、多少のタイプミスも許容 ----
function normalizeQuery(s){
  return s
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)) // 全角英数を半角に
    .replace(/　/g, ' ') // 全角スペースを半角に
    .toLowerCase();
}
function levenshtein(a, b){
  const dp = Array(b.length+1).fill(0).map((_,i)=>i);
  for(let i=1;i<=a.length;i++){
    let prev = dp[0]; dp[0] = i;
    for(let j=1;j<=b.length;j++){
      const tmp = dp[j];
      dp[j] = a[i-1]===b[j-1] ? prev : 1 + Math.min(prev, dp[j], dp[j-1]);
      prev = tmp;
    }
  }
  return dp[b.length];
}
function fuzzyIncludes(haystack, term){
  if(!term) return true;
  if(haystack.includes(term)) return true;
  if(term.length < 3) return false; // 短すぎる語は誤爆を避けるため厳密一致のみ
  for(let i=0; i<=haystack.length - (term.length-1); i++){
    for(let w=-1; w<=1; w++){
      const len = term.length + w;
      if(len < 2) continue;
      const chunk = haystack.substr(i, len);
      if(chunk && levenshtein(chunk, term) <= 1) return true;
    }
  }
  return false;
}
function matchesSearch(hay, terms){
  return terms.every(t => fuzzyIncludes(hay, t)); // すべてのキーワードを含めばヒット（AND検索）
}

function courseSchedulePreviewHTML(sections){
  const dayOrder = ['月','火','水','木','金','土','日'];
  const patterns = [];
  const seen = new Set();
  sections.forEach(section => {
    const slots = parseDayPeriod(section.day);
    let pattern = '';
    if(slots.length){
      const periodsByDay = new Map(dayOrder.map(day => [day,new Set()]));
      slots.forEach(({day,period}) => periodsByDay.get(day)?.add(Number(period)));
      pattern = dayOrder.flatMap(day => {
        const periods = [...periodsByDay.get(day)].sort((a,b) => a-b);
        return periods.length ? [`${L(day,DAY_EN[day])}${periods.join('・')}`] : [];
      }).join('・');
    } else if(section.term === 'Intensive'){
      pattern = L('集中','Intensive');
    }
    if(pattern && !seen.has(pattern)){
      seen.add(pattern);
      patterns.push(pattern);
    }
  });
  if(!patterns.length) patterns.push(L('日時未定','Schedule TBA'));
  const maxVisible = 3;
  const extra = patterns.length - maxVisible;
  const visibleText = patterns.slice(0,maxVisible).join(' ／ ') + (extra > 0 ? L(` ／ ほか${extra}`,` / +${extra} more`) : '');
  const fullText = patterns.join(' ／ ');
  return `<div class="schedulePreview" title="${escapeHTML(fullText)}"><span class="schedulePreviewLabel">${L('曜日・時限','Day / period')}</span><span class="schedulePreviewValue">${escapeHTML(visibleText)}</span></div>`;
}

function escapeHTML(str){
  if(str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function highlight(text, q){
  if(!q) return escapeHTML(text);
  const firstTerm = normalizeQuery(q).split(/\s+/).filter(Boolean)[0] || '';
  const idx = normalizeQuery(text).indexOf(firstTerm);
  if(idx === -1) return escapeHTML(text);
  const before = text.slice(0,idx), mid = text.slice(idx, idx+firstTerm.length), after = text.slice(idx+firstTerm.length);
  return escapeHTML(before) + '<mark>' + escapeHTML(mid) + '</mark>' + escapeHTML(after);
}

const COURSE_SEARCH_INDEX_CACHE = new Map();
let creditGroupingReady = false;
function renderCourses(){
  const earnedWasOpen = !!courseList.querySelector('#earnedCourses[open]');
  const openCourseNames = new Set(Array.from(courseList.querySelectorAll('.card.open')).map(card => card.dataset.courseName));
  const q = searchInput.value.trim();
  const queryTerms = normalizeQuery(q).split(/\s+/).filter(Boolean);
  const cat = categoryFilter.value;
  const term = termFilter.value;
  const selectedWindow = windowFilterEl.value;
  const filtered = COURSES.filter(([en, jp, category, summary, teacher]) => {
    const matchesCat = !cat || category === cat;
    const courseWindow = COURSE_WINDOWS[jp] || '';
    const matchesWindow = !selectedWindow || courseWindow === selectedWindow;
    const offeredSections = findSections(en, jp);
    const weekday=document.getElementById('weekdayFilter').value;
    const matchesTerm = offeredSections.some(s => (!term||s.term===term)&&(!weekday||parseDayPeriod(s.day).some(p=>p.day===weekday)))||(!term&&!weekday);
    let hay = COURSE_SEARCH_INDEX_CACHE.get(en);
    if(!hay){
      const syllabusText = offeredSections.map(s => s.syllabus ? Object.values(s.syllabus).join(' ') : '').join(' ');
      const sectionText = offeredSections.map(s => `${s.code} ${s.day} ${s.teacher} ${s.language.ja} ${s.language.en}`).join(' ');
      const windowLabels = courseWindow ? WINDOW_LABELS[courseWindow].join(' ') : '';
      hay = normalizeQuery(en + jp + summary + teacher + syllabusText + sectionText + windowLabels);
      COURSE_SEARCH_INDEX_CACHE.set(en, hay);
    }
    const matchesQ = matchesSearch(hay, queryTerms);
    return matchesCat && matchesWindow && matchesTerm && matchesQ;
  });
  resultCount.textContent = filtered.length;
  courseList.innerHTML = '';
  emptyState.style.display = filtered.length ? 'none' : 'block';
  filtered.forEach(([en, jp, category, summary, teacher]) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.courseName = en;
    if(openCourseNames.has(en)) card.classList.add('open');
    const sections = findSections(en, jp);
    const languageCodes = [...new Set(sections.map(s => s.language.code).filter(Boolean))];
    const languageSummaryHTML = languageCodes.length
      ? languageCodes.map(code => languageBadgeHTML(`A000${code}`, false)).join('')
      : `<span class="languageBadge unknown">${L('開講言語未確認','Language not confirmed')}</span>`;
    const courseWindow = COURSE_WINDOWS[jp] || '';
    const fieldMatch = category.match(/^リベラルアーツ（(.+)）$/);
    const fieldLabels = fieldMatch ? LIBERAL_ARTS_FIELD_LABELS[fieldMatch[1]] : null;
    const categoryTagText = fieldLabels
      ? L(`分野：${fieldLabels[0]}`,`Field: ${fieldLabels[1]}`)
      : L(category, CATEGORY_EN[category] || category);
    const windowTagHTML = courseWindow
      ? `<div class="windowMarker">${escapeHTML(L(...WINDOW_LABELS[courseWindow]))}</div>`
      : '';
    const scheduleSections = term
      ? sections.filter(section => section.term === term)
      : sections;
    const schedulePreviewHTML = courseSchedulePreviewHTML(scheduleSections);
    let sectionsHTML;
    if(sections.length){
      sectionsHTML = `<p style="margin:0 0 6px;font-size:12px;color:var(--ink-soft);">${L('2026年度 開講セクション','2026 Offered Sections')}</p>` +
        sections.map(s => `
          <div class="sectionRow">
            <div class="sectionInfo">
              <span class="sTeacher">${highlight(s.teacher,q)}</span>
              ${languageBadgeHTML(s.code, true)}
              <span class="sMeta">${s.day ? escapeHTML(s.day)+' ・ '+escapeHTML(L(TERM_LABEL[s.term]||s.term, TERM_LABEL_EN[s.term]||s.term)) : escapeHTML(L(TERM_LABEL[s.term]||s.term, TERM_LABEL_EN[s.term]||s.term))} ・ ${escapeHTML(s.code)}${s.supported ? `<span class="supportedBadge">Supported</span>` : ''}${AUTUMN_NOTES[s.code]?'<br>'+escapeHTML(L(...AUTUMN_NOTES[s.code])):''}</span>
              ${teamCodeHTML(s.code, false)}
              ${(s.room || (s.dates && s.dates.length) || s.roomNote) ? `<span class="sMeta">${s.room ? L('教室：','Room: ')+escapeHTML(s.room) : ''}${s.dates && s.dates.length ? (s.room ? '（'+formatIntensiveDates(s.dates)+'）' : L('日程：','Dates: ')+formatIntensiveDates(s.dates)) : ''}${s.roomNote ? ((s.room || (s.dates && s.dates.length)) ? '／' : '')+escapeHTML(s.roomNote) : ''}</span>` : ''}
              ${renderSyllabusDetail(s.syllabus,s.syllabusSourceCode)}
            </div>
            <button class="addToggle" data-course-en="${escapeHTML(en)}" data-teacher="${escapeHTML(s.teacher)}" data-day="${escapeHTML(s.day)}" data-term="${escapeHTML(s.term)}" data-code="${escapeHTML(s.code)}" data-room="${escapeHTML(s.room||'')}" data-dates="${s.dates?escapeHTML(s.dates.join(',')):''}" aria-label="${L('時間割に追加','Add to timetable')}">＋</button>
          </div>
        `).join('');
    } else if(teacher){
      sectionsHTML = `<p style="margin:0;font-size:12.5px;color:var(--ink-soft);">${L('担当：','Instructor: ')}${highlight(teacher,q)}</p>`;
    } else {
      sectionsHTML = `<p style="margin:0;font-size:12.5px;color:var(--ink-soft);">${L('担当教員：2026年度の開講一覧（Spring/Summer/Autumn/Winter）には見当たりません。','Instructor: not found in the 2026 offering list (Spring/Summer/Autumn/Winter).')}<a class="facultyLink" href="${FACULTY_URL}" target="_blank" rel="noopener noreferrer">${L('教員紹介一覧を見る','View faculty list')}</a></p>`;
    }
    const primaryName = L(jp, en), secondaryName = L(en, jp);
    card.innerHTML = `
      <div class="row1">
        <div class="courseHeading">
          <div class="name">${highlight(primaryName,q)}<span class="en">${highlight(secondaryName,q)}</span></div>
          ${windowTagHTML}
        </div>
        <div class="tagStack">
          <div class="tag">${escapeHTML(categoryTagText)}</div>
          <div class="languageSummary" aria-label="${L('2026年度の開講言語','Teaching languages in 2026')}">${languageSummaryHTML}</div>
        </div>
      </div>
      ${schedulePreviewHTML}
      <div class="summary">
        <p style="margin:0 0 10px;">${highlight(summary,q)}${LANG==='en' ? ' <em style="color:var(--ink-soft);font-size:11.5px;">('+L('','Description available in Japanese only')+')</em>' : ''}</p>
        ${sectionsHTML}
      </div>
    `;
    card.addEventListener('click', (e) => {
      const interactive=e.target.closest('button, a, details, summary, input, select');
      if(interactive&&card.contains(interactive)) return; // カード内部の操作部品だけは開閉に使わない
      card.classList.toggle('open');
    });
    card.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', e => e.stopPropagation());
    });
    card.querySelectorAll('.addToggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSection(btn.dataset.courseEn, jp, btn.dataset.teacher, btn.dataset.day, btn.dataset.term, btn.dataset.code, btn.dataset.room, btn.dataset.dates);
      });
    });
    courseList.appendChild(card);
  });
  if(creditGroupingReady){
    const earnedCards=[...courseList.querySelectorAll('.card')].filter(card=>creditCatalog.some(c=>c.en===card.dataset.courseName&&creditState.has(c.jp)));
    if(earnedCards.length){
      const group=document.createElement('details');group.id='earnedCourses';group.open=earnedWasOpen;
      group.style.cssText='margin-top:24px;padding:16px;background:#f0f5ef;border:1px solid #a9bcae;border-radius:14px;';
      const summary=document.createElement('summary');summary.style.cssText='cursor:pointer;font-weight:700;padding:8px 0;';
      summary.textContent=L('修得済み科目（'+earnedCards.length+'科目）— 押して表示','Completed courses ('+earnedCards.length+') — Open to view');
      group.append(summary,...earnedCards);courseList.append(group);
    }
  }
  refreshAddButtons();
}
let searchDebounceTimer = null;
searchInput.addEventListener('input', () => {
  window.clearTimeout(searchDebounceTimer);
  searchDebounceTimer = window.setTimeout(renderCourses, 100);
});
categoryFilter.addEventListener('change', renderCourses);
termFilter.addEventListener('change', renderCourses);
document.getElementById('weekdayFilter').addEventListener('change',renderCourses);
windowFilterEl.addEventListener('change', renderCourses);
// ---- render: calendar（学期ごとにアコーディオンで表示、現在の学期だけ自動で開く） ----
