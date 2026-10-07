const calList = document.getElementById('calList');
const today = new Date();
let nextIdx = CALENDAR.findIndex(([iso]) => new Date(iso) >= today);
const QUARTER_ORDER = ['春','夏','秋','冬'];
const QUARTER_EN = {'春':'Spring','夏':'Summer','秋':'Autumn','冬':'Winter'};
const CAL_LABEL_EN = {
  '入学式（春）':'Matriculation Ceremony (Spring)',
  'Jump Start Workshop（春）':'Jump Start Workshop (Spring)',
  '学年別ガイダンス':'Grade-level Guidance',
  '春クォーター授業開始':'Spring Quarter classes begin',
  '昭和の日（授業期間中）':'Showa Day (during class period)',
  '憲法記念日':'Constitution Memorial Day',
  'みどりの日':'Greenery Day',
  'こどもの日':"Children's Day",
  '振替休日':'Substitute Holiday',
  '合同オリエンテーション（仮）':'Joint Orientation (tentative)',
  '期末試験（春クォーター）':'Final Exams (Spring Quarter)',
  'ギャップ期間（SDGs集中講義）':'Gap Period (SDGs Intensive Course)',
  '夏クォーター授業開始':'Summer Quarter classes begin',
  '卒プロ第1回報告会':'Degree Project 1st Reporting Session',
  '海の日（授業期間中）':'Marine Day (during class period)',
  '期末試験（夏クォーター）':'Final Exams (Summer Quarter)',
  '山の日（ギャップ期間中）':'Mountain Day (during gap period)',
  '卒業式【仮】（夏）':'Graduation Ceremony [tentative] (Summer)',
  '敬老の日':'Respect for the Aged Day',
  '国民の休日':'National Holiday',
  '秋分の日':'Autumnal Equinox Day',
  '入学式（秋）【仮】／Jump Start Workshop（秋）':'Matriculation Ceremony (Autumn) [tentative] / Jump Start Workshop (Autumn)',
  'Jump Start Workshop（秋）・PSW（仮）':'Jump Start Workshop (Autumn) · PSW (tentative)',
  '秋クォーター授業開始':'Autumn Quarter classes begin',
  'スポーツの日（授業期間中）':'Sports Day (during class period)',
  '文化の日（授業期間中）':'Culture Day (during class period)',
  '卒プロ第2回報告会':'Degree Project 2nd Reporting Session',
  '期末試験（秋クォーター・11/23は勤労感謝の日）':'Final Exams (Autumn Quarter; Nov 23 is Labor Thanksgiving Day)',
  '年末年始休暇':'Year-end/New Year Holiday',
  '冬クォーター授業開始':'Winter Quarter classes begin',
  '成人の日（授業期間中）':'Coming of Age Day (during class period)',
  '建国記念の日（授業期間中）':'National Foundation Day (during class period)',
  '卒プロ公開プレゼンテーション（仮）':'Degree Project Public Presentation (tentative)',
  '期末試験（冬クォーター・2/23は天皇誕生日）':'Final Exams (Winter Quarter; Feb 23 is the Emperor\'s Birthday)',
  '春分の日':'Vernal Equinox Day',
  '卒業式【仮】':'Graduation Ceremony [tentative]',
  '年度末休暇・学年終了':'Academic Year-End Holiday · End of Academic Year',
  'Evening Lounge：クレシーニ・アン氏（北九州市立大学准教授・言語学者）':'Evening Lounge: Anne Crescini (Associate Professor and Linguist, University of Kitakyushu)',
  'Evening Lounge：内平 直志氏（本学客員教授・北陸先端科学技術大学院大学）':'Evening Lounge: Naoshi Uchihira (Visiting Professor; JAIST)',
  'Evening Lounge：小笠原 舞氏（こどもみらい探求社共同代表）':'Evening Lounge: Mai Ogasawara (Co-representative, Kodomo Mirai Tankyusha)',
  'Evening Lounge：ビール・アリソン氏（本学客員教授）':'Evening Lounge: Alison Beale (Visiting Professor)',
  'Evening Lounge：藤野 英人氏（本学客員教授）':'Evening Lounge: Hifumi Fujino (Visiting Professor)'
};
const CAL_TYPE_EN = {'試験':'Exams','開始':'Start','休日':'Holiday','行事':'Event','イブニングラウンジ':'Evening Lounge'};
function calEventType(label){
  if(label.startsWith('Evening Lounge')) return ['t-lounge','イブニングラウンジ'];
  if(label.includes('試験')) return ['t-exam','試験'];
  if(label.includes('開始')) return ['t-start','開始'];
  if(/休|祝|の日|記念日|振替/.test(label) && !label.includes('報告') && !label.includes('プレゼン')) return ['t-holiday','休日'];
  return ['t-event','行事'];
}
function guessCurrentQuarterJP(){
  const map = {Spring:'春',Summer:'夏',Autumn:'秋',Winter:'冬'};
  return map[guessCurrentQuarter()] || '春';
}
function renderCalendar(){
  calList.innerHTML = '';
  const currentQtrForCal = guessCurrentQuarterJP();
  QUARTER_ORDER.forEach(qtr => {
    const rows = CALENDAR.map((row,i)=>({row,i})).filter(x => x.row[2] === qtr);
    if(!rows.length) return;
    const isCurrent = rows.some(({i}) => i === nextIdx) || qtr === currentQtrForCal;

    const header = document.createElement('div');
    header.className = 'qtrHeader' + (isCurrent ? ' current open' : '');
    header.innerHTML = `<span><span class="qtrName">${L(qtr+'クォーター', QUARTER_EN[qtr])}</span><span class="qtrCount">${rows.length}${L('件','')}</span></span><span class="chev">▶</span>`;
    calList.appendChild(header);

    const body = document.createElement('div');
    body.className = 'qtrBody' + (isCurrent ? ' open' : '');
    rows.forEach(({row:[iso, dateLabel, quarter, label], i}) => {
      const [typeClass, typeLabelJa] = calEventType(label);
      const item = document.createElement('div');
      item.className = 'cal-item' + (i === nextIdx ? ' next' : '');
      item.innerHTML = `
        <div class="cal-date">${escapeHTML(dateLabel)}</div>
        <div class="cal-body">
          <div class="cal-event-title">${escapeHTML(L(label, CAL_LABEL_EN[label] || label))}</div>
          <div class="cal-meta"><span class="cal-type ${typeClass}">${L(typeLabelJa, CAL_TYPE_EN[typeLabelJa])}</span>${i===nextIdx ? `<span class="next-flag">${L('次のイベント','Next up')}</span>` : ''}</div>
        </div>
      `;
      body.appendChild(item);
    });
    calList.appendChild(body);

    header.addEventListener('click', () => {
      header.classList.toggle('open');
      body.classList.toggle('open');
    });
  });
}
