// Manual credit prototype. Memory only; independent from the persisted timetable.
const creditTranslations = {
 ' / Finance（旧ファイナンス論・同一科目）':' / Finance (former name; count once)',
 '① 修得済みを入力 → ② 不足を確認して時間割へ追加':'1. Enter passed courses → 2. Check gaps and plan courses',
 '選択はこのブラウザに保存されます。外部送信・端末間の同期はしません。共用端末では利用後に入力を消去してください。':'Selections are saved in this browser only, with no transmission or device sync. Clear them after use on shared devices.',
 '① 修得済みを入力':'1. Enter passed courses','② 不足・追加候補を見る':'2. Check gaps and courses',
 '合格・認定済みの科目だけ、実際に修得した言語（日・英）を選んでください。':'Select only passed or credited courses, using their actual teaching language (JA / EN).',
 '2026年度の開講情報から、未選択科目を候補表示します。入力漏れも未修得として扱うため、修得済み科目を先に選んでください。履修条件・時間の重複は授業の詳細で確認してください。':'Suggestions use AY2026 offerings and exclude selected courses. Enter all passed courses first. Check prerequisites and schedule conflicts in the course details.',
 '出典：学生便覧の入学年度別教育課程表。数学入門・健康学入門は入門の選択科目で、基盤・発展科目の条件には算入しません。表にない認定単位・編入、修業年限・海外免除・履修開始条件は個別確認が必要で、正式な卒業判定は行いません。':'Source: admission-year curriculum tables in the student handbook. Mathematics and Health Science are introductory electives, not foundation or advanced courses. Transfer credits, residence requirements, exemptions and prerequisites require individual confirmation. This is not an official graduation decision.',
 '課題解決入門・ⅠA・ⅠB・Ⅱの計9単位を一括選択します。日英が混在する場合は選択後に各科目を直してください。卒業プロジェクトは含みません。':'Select all four PBL courses (9 credits). Adjust individual languages if needed. Degree Project is not included.',
 '数学入門・健康学入門は選択科目。入門必修13単位と実践科目2単位で必修15単位です。在学期間・認定・免除は個別確認が必要です。':'Mathematics and Health Science are electives. Required Liberal Arts credits consist of 13 introductory credits and the 2-credit capstone. Residence requirements, recognized credits and exemptions require individual confirmation.',
 '全ウィンドウを満たす必要はありません。区分・分野の不足は重なるため、表示された不足単位を足し合わせないでください。':'Only one window must meet the requirements. Gaps overlap; do not add the missing credits together.',
 '発展科目：少なくとも1つのウィンドウで14単位、かつその中で人・社会・自然を各2単位。':'Advanced courses: 14 credits in at least one window, including 2 credits each in Humanities, Social Science and Natural Science.',
 '時間割から候補を表示中。合格済みの科目だけ、修得言語を選択してください。':'Showing courses from My Timetable. Select a language only for courses already passed.',
 '合格済みの科目を選択してください。同じ科目の日・英は一方だけ数えます。':'Select passed courses. Japanese and English versions count as one course.',
 '該当する科目がありません。検索や候補表示を解除してください。':'No courses match. Clear the search or timetable filter.',
 '選択した学期に該当する候補はありません。他の学期も確認してください。':'No suggestions for this quarter. Check another quarter.',
 '（2026年度以降は経済学に読替・同一科目として選択）':' (renamed Economics from AY2026; count once)',
 'リベラルアーツ・入門選択':'Liberal Arts · Introductory electives','リベラルアーツ・入門必修':'Liberal Arts · Required introductory courses','リベラルアーツ・基盤':'Liberal Arts · Foundation',
 '入門必修（入門選択は別途確認）':'Required introductory courses',
 '海外プログラム（免除は個別確認）':'Overseas programs (check exemptions)',
 '入力した内容で不足・追加候補を見る':'Check gaps and course suggestions',
 '単位チェックの入力をすべて消去':'Clear all credit selections','修得済み科目をすべて入力しました':'I have entered all my passed courses',
 '時間割の科目に絞り込み中・解除する':'Timetable filter active · Clear filter','マイ時間割の科目だけ表示':'Show only My Timetable courses',
 'IEP全10科目が合格済み：まとめて選択':'All 10 IEP courses passed: select all','すべて日で修得済み':'All passed in Japanese','すべて英で修得済み':'All passed in English',
 '入力完了としての参考集計':'Reference totals: input marked complete','入力途中：選択済み科目のみの集計':'In progress: selected courses only',
 '区分別：あと何単位？':'Credits still needed by category','不足を埋める今学期の候補':'Courses to fill your gaps',
 '春入学・IEP履修':'Spring entry · IEP','秋入学・IEP非履修':'Autumn entry · No IEP','2024年度以前':'2024 or earlier',
 '履修を考える学期':'Planning quarter','目指すウィンドウ':'Target window','入学年度':'Admission year','入学区分':'Entry type',
 '選択済みだけ表示':'Show selected only','科目を探す':'Find a course','判定の範囲・出典':'Scope and sources',
 '授業を見て時間割へ':'View course and plan','英で修得すると英語単位に算入':'English section contributes to English credits',
 '基本ツール選択の不足':'Tool elective gap','リベラルアーツ全体の不足':'Liberal Arts total gap','実践英語の不足':'Practical English gap','体験・実践の不足':'Experiential program gap',
 'リベラルアーツ合計':'Liberal Arts total','リベラルアーツ選択':'Liberal Arts electives','基本ツール合計':'Tools total','基本ツール必修':'Required tools','基本ツール選択':'Tool electives',
 '実践英語・基盤':'Practical English foundation','実践科目・必修':'Required capstone','入門必修':'Required introductory','基盤科目':'Foundation courses','体験・実践':'Experiential programs',
 '合格':'Pass','すべて選択済み':'All selected','選択済み':'Selected','未選択':'Not selected','日で修得':'Passed in JA','英で修得':'Passed in EN',
 '分野別の不足':'Missing by field','あと最低':'At least ','の未修得科目':' not yet selected','の不足':' gap','英語開講':'English-taught','科目を見る':' more courses','科目':' courses','単位':' credits','修得':'Earned ','あと':'Remaining ','充足':'Met','基盤・':'Foundation · ','合計':'Total','年度入学':' entry','年度':' entry year','入学／':' entry /','ほか':'Show ',
 '人':'Humanities','社会':'Social Science','自然':'Natural Science','春':'Spring','夏':'Summer','秋':'Autumn','冬':'Winter','集中講義':'Intensive'
};
const creditTextCache=new WeakMap();
function translateCreditUI(){
 const entries=[...Object.entries(creditTranslations),...COURSES.map(c=>[c[1],c[0]]),...Object.entries(CATEGORY_EN),...Object.values(WINDOW_LABELS)].sort((a,b)=>b[0].length-a[0].length);
 const pattern=new RegExp(entries.map(([s])=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');const dict=new Map(entries);
 const walker=document.createTreeWalker(creditEl('panel-credits'),NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){let saved=creditTextCache.get(node);if(!saved||node.nodeValue!==saved.shown)saved={original:node.nodeValue};saved.shown=LANG==='en'?saved.original.replace(pattern,s=>dict.get(s)):saved.original;node.nodeValue=saved.shown;creditTextCache.set(node,saved);}
 creditEl('creditSearch').placeholder=L('科目名の一部・英語名','Course name or keyword');
}
const creditState = new Map();
let creditCandidates = false;



const creditEl = id => document.getElementById(id);
const creditCatalog = COURSES.filter(c => c[2] !== '日本語').map(([en,jp,category]) => {
  const units = COURSE_CREDITS.overrides[jp] ?? COURSE_CREDITS.default;
  const group = creditIntro.includes(jp) ? 'リベラルアーツ・入門必修' : ['数学入門','健康学入門'].includes(jp) ? 'リベラルアーツ・入門選択' : creditFoundation.includes(jp) ? 'リベラルアーツ・基盤' : COURSE_WINDOWS[jp] ? WINDOW_LABELS[COURSE_WINDOWS[jp]][0] : category;
  let field = category.match(/（(人|社会|自然)）/)?.[1] || '';
  if(['生命倫理学概論','人工知能概論','数学的思考法'].includes(jp)) field='自然';
  if(['公共芸術論','社会心理学概論','文化人類学概論'].includes(jp)) field='人';
  if(['フィールドワーク研究','環境経済学'].includes(jp)) field='社会';
  return {en,jp,category,units,group,field,window:COURSE_WINDOWS[jp],englishOnly:category==='IEP'||category==='実践英語（基盤科目）'||jp.startsWith('海外'),japaneseOnly:jp==='日本語アカデミックライティング'};
});
function creditSummary(state=creditState){
  const selected=creditCatalog.filter(c=>state.has(c.jp));
  const sum=fn=>selected.filter(fn).reduce((n,c)=>n+c.units,0);
  const spring=creditEl('creditEntry').value==='spring';
  const r=CREDIT_REQUIREMENTS;
  const checks=[['合計',sum(()=>true),r.total],['英語開講',sum(c=>state.get(c.jp)==='en'),r.englishTaught]];
  if(spring) checks.push(['IEP',sum(c=>c.category==='IEP'),r.iepSpringEntry]);
  checks.push(['実践英語・基盤',sum(c=>c.category==='実践英語（基盤科目）'),spring?r.practicalEnglish.springEntry:r.practicalEnglish.autumnEntry],['基本ツール合計',sum(c=>['ICT・データサイエンス','思考系'].includes(c.category)),r.tools.total],['基本ツール必修',sum(c=>creditToolRequired.includes(c.jp)),r.tools.required],['基本ツール選択',sum(c=>['ICT・データサイエンス','思考系'].includes(c.category)&&!creditToolRequired.includes(c.jp)),r.tools.elective],['リベラルアーツ合計',sum(c=>c.category.startsWith('リベラルアーツ')||c.category==='実践科目'),r.liberalArts.total],['入門必修',sum(c=>creditIntro.includes(c.jp)),r.liberalArts.introRequired],['基盤科目',sum(c=>creditFoundation.includes(c.jp)),r.liberalArts.foundation]);
  for(const f of ['人','社会','自然']) checks.push(['基盤・'+f,sum(c=>creditFoundation.includes(c.jp)&&c.field===f),r.liberalArts.foundationPerField]);
  checks.push(['体験・実践',sum(c=>c.category==='体験・実践プログラム'),r.experiential.total],['海外プログラム（免除は個別確認）',sum(c=>c.category==='体験・実践プログラム'&&c.jp.startsWith('海外')),r.experiential.overseas],['課題解決演習',sum(c=>c.category==='課題解決演習'),r.projectBasedLearning],['卒業プロジェクト',sum(c=>c.category==='卒業プロジェクト'),r.degreeProject]);
  checks.push(['実践科目・必修',sum(c=>c.category==='実践科目'),r.capstone],['リベラルアーツ選択',sum(c=>c.category.startsWith('リベラルアーツ')&&!creditIntro.includes(c.jp)),r.liberalArts.elective]);
  const windows=Object.keys(WINDOW_LABELS).map(w=>({name:WINDOW_LABELS[w][0],units:sum(c=>c.window===w),fields:['人','社会','自然'].map(f=>sum(c=>c.window===w&&c.field===f))}));
  return {selected,checks,windows};
}
function renderCreditResults(){
  saveCreditSelections();
  const {selected,checks,windows}=creditSummary();
  const root=creditEl('creditResults'); root.replaceChildren();
  let target=root;
  const line=t=>{const p=document.createElement('p');p.textContent=t;target.append(p);};
  line((creditEl('creditYear').value==='2024'?'2024年度以前':creditEl('creditYear').value+'年度')+'入学／'+(creditEl('creditComplete').checked?'入力完了としての参考集計':'入力途中：選択済み科目のみの集計')+' · '+selected.length+'科目');
  const makeCard=(container,name,n,required,missing=Math.max(0,required-n))=>{
    const card=document.createElement('div');card.className='creditResultCard';
    const title=document.createElement('strong');title.textContent=name+'：'+n+' / '+required+'単位';
    const badge=document.createElement('span');badge.className='creditVerdict'+(missing===0?' pass':'');badge.textContent=missing===0?L('合格','Pass'):L('あと'+missing+'単位',missing+' credits needed');
    card.append(title,badge);container.append(card);return card;
  };
  line(L('修得済みだけの判定（履修中・予定は含みません）','Earned-only results (excluding in-progress / planned courses)'));
  const totals=document.createElement('div');totals.className='creditResultGrid';root.append(totals);
  for(const [name,n,required] of checks.slice(0,2))makeCard(totals,name,n,required);
  const detail=document.createElement('details');const heading=document.createElement('summary');heading.textContent='区分別：あと何単位？';detail.append(heading);root.append(detail);target=detail;
  const grid=document.createElement('div');grid.className='creditResultGrid';detail.append(grid);
  let experienceCard;
  for(const [name,n,required] of checks.slice(2)){
    if(name.startsWith('海外プログラム')){
      const child=makeCard(experienceCard||grid,L('うち海外（免除は個別確認）','Of which overseas (exemptions require confirmation)'),n,required);
      child.style.background='#f3f0e7';
      const note=document.createElement('small');note.textContent=L('体験・実践4単位の内数です（4＋2ではありません）。','Included in the 4 experiential credits, not an additional 2.');child.append(note);
    }else{const card=makeCard(grid,name,n,required);if(name==='体験・実践')experienceCard=card;}
  }
  line('発展科目：少なくとも1つのウィンドウで14単位、かつその中で人・社会・自然を各2単位。');
  for(const w of windows){
    const fieldMinimum=CREDIT_REQUIREMENTS.advancedWindow.perField;
    const windowMinimum=CREDIT_REQUIREMENTS.advancedWindow.total;
    const fieldMissing=w.fields.map(n=>Math.max(0,fieldMinimum-n));
    const missing=Math.max(0,windowMinimum-w.units,fieldMissing.reduce((a,b)=>a+b,0));
    const card=makeCard(detail,w.name,w.units,windowMinimum,missing);card.style.margin='10px 0';
    const fields=document.createElement('div');fields.className='creditFieldRow';
    ['人','社会','自然'].forEach((f,i)=>{const chip=document.createElement('span');chip.textContent=f+' '+w.fields[i]+'/2';fields.append(chip);});card.append(fields);
  }
  line('全ウィンドウを満たす必要はありません。区分・分野の不足は重なるため、表示された不足単位を足し合わせないでください。');
  line('数学入門・健康学入門は選択科目。入門必修13単位と実践科目2単位で必修15単位です。在学期間・認定・免除は個別確認が必要です。');
  line(L('「合格」は入力された単位条件の判定です。正式な卒業判定ではありません。','“Pass” refers to the entered credit requirement only, not an official graduation decision.'));
  renderPersonalCreditOverview();
  renderCreditSuggestions();
  translateCreditUI();
}
function plannedCreditState(){
 const projected=new Map(creditState);
 for(const item of myTimetable){
  const course=creditCatalog.find(c=>c.jp===item.courseJp||c.en===item.courseEn);
  if(!course||projected.has(course.jp))continue;
  const code=String(item.code||'').match(/^[A-Z]\d{3}([JE])/);
  projected.set(course.jp,code?.[1]==='E'?'en':'ja');
 }
 return projected;
}
function renderPersonalCreditOverview(){
 let root=creditEl('personalCreditOverview');
 if(!root){root=document.createElement('div');root.id='personalCreditOverview';creditEl('creditResults').prepend(root);}
 root.replaceChildren();
 const earned=creditSummary(),projectedState=plannedCreditState(),projected=creditSummary(projectedState);
 const title=document.createElement('h3');title.textContent=L('自分の修得済み・履修中／予定','Your earned and in-progress / planned credits');root.append(title);
 const note=document.createElement('p');note.textContent=L('単位チェックの選択＝修得済み、マイ時間割の未修得科目＝履修中／予定として集計します。正式な履修登録とは連動しません。同じ科目は日英・学期をまたいでも1回だけ数え、修得済みを優先します。','Credit checker selections are earned; uncompleted My Timetable courses are in progress / planned. This is not linked to official registration. Each course is counted once across languages and quarters, with earned status taking priority.');root.append(note);
 const totals=document.createElement('p');totals.textContent=L('合計：','Total: ')+earned.checks[0][1]+' + '+(projected.checks[0][1]-earned.checks[0][1])+' = '+projected.checks[0][1]+' / '+CREDIT_REQUIREMENTS.total+' '+L('単位（修得済み＋履修中／予定＝全科目合格時）','credits (earned + in progress / planned = if all passed)');root.append(totals);
 const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent=L('区分別の修得済み・履修中・見込みを確認','View earned, planned and projected credits by category');details.append(summary);root.append(details);
 const wrap=document.createElement('div');wrap.style.overflowX='auto';wrap.tabIndex=0;const table=document.createElement('table');table.style.cssText='width:100%;min-width:540px;border-collapse:collapse;';wrap.append(table);details.append(wrap);
 const addRow=(values,header=false)=>{const tr=document.createElement('tr');values.forEach((value,i)=>{const cell=document.createElement(header||i===0?'th':'td');cell.textContent=String(value);cell.style.cssText='padding:10px 6px;text-align:left;border-bottom:1px solid #c9c2ad;';if(header)cell.scope='col';else if(i===0)cell.scope='row';tr.append(cell);});table.append(tr);};
 addRow([L('区分','Category'),L('下限','Minimum'),L('修得済み','Earned'),L('履修中／予定','In progress / planned'),L('見込み','Projected'),L('見込み不足','Projected shortfall')],true);
 earned.checks.forEach(([name,n,min],i)=>{const p=projected.checks[i][1];addRow([name.startsWith('海外プログラム')?L('　└ うち海外','  └ Of which overseas'):name,min,n,p-n,p,Math.max(0,min-p)]);});
 earned.windows.forEach((w,i)=>{const p=projected.windows[i],minimum=CREDIT_REQUIREMENTS.advancedWindow.total,fieldMinimum=CREDIT_REQUIREMENTS.advancedWindow.perField;addRow([w.name,minimum,w.units,p.units-w.units,p.units,Math.max(0,minimum-p.units)]);['人','社会','自然'].forEach((f,j)=>addRow(['　'+f,fieldMinimum,w.fields[j],p.fields[j]-w.fields[j],p.fields[j],Math.max(0,fieldMinimum-p.fields[j])]));});
 const caution=document.createElement('p');caution.textContent=L('ウィンドウは1つで14単位かつ人・社会・自然を各2単位。全ウィンドウの充足は不要です。見込みは合格を保証せず、正式な卒業判定ではありません。','One window needs 14 credits including 2 each in Humanities, Society and Nature; not all windows are required. Projections do not guarantee passing or graduation.');details.append(caution);
 for(const [label,courses,state] of [[L('修得済み科目','Earned courses'),earned.selected,creditState],[L('履修中／予定の科目','In-progress / planned courses'),projected.selected.filter(c=>!creditState.has(c.jp)),projectedState]]){
  const list=document.createElement('details'),head=document.createElement('summary');head.textContent=label+' ('+courses.length+')';list.append(head);
  for(const c of courses){
   const p=document.createElement('p');
   const terms=state===creditState?[]:[...new Set(myTimetable.filter(item=>item.courseJp===c.jp||item.courseEn===c.en).map(item=>L(TERM_LABEL[item.term]||item.term,TERM_LABEL_EN[item.term]||item.term)))];
   p.textContent=L(c.jp,c.en)+' · '+c.units+' '+L('単位','credits')+' · '+(state.get(c.jp)==='en'?L('英語','English'):L('日本語','Japanese'))+(terms.length?' · '+terms.join(' / ')+' · '+L('履修中／予定','In progress / planned'):'');list.append(p);
  }root.append(list);
 }
}
function renderCreditSuggestions(){
  if(creditEl('personalCreditOverview'))renderPersonalCreditOverview();
  const root=creditEl('creditSuggestions');root.replaceChildren();
  const projected=new Map(creditState);
  for(const item of myTimetable){
    const course=creditCatalog.find(c=>c.jp===item.courseJp||c.en===item.courseEn);
    if(!course||projected.has(course.jp))continue;
    const code=String(item.code||'').match(/^[A-Z]\d{3}([JE])/);
    projected.set(course.jp,code?.[1]==='E'?'en':'ja');
  }
  const planned=projected.size-creditState.size;
  const note=document.createElement('p');note.textContent=L('マイ時間割の未修得'+planned+'科目を履修予定として反映。すべて修得した場合にも不足する区分を優先します。修得済み単位には加算しません。','Includes '+planned+' planned, uncompleted courses from My Timetable. Priorities reflect gaps remaining if you pass them all. Earned credit totals are unchanged.');root.append(note);
  const {checks,windows}=creditSummary(projected);const remaining=name=>{const row=checks.find(r=>r[0]===name);return row?Math.max(0,row[2]-row[1]):0;};
  const w=creditEl('creditWindow').value;const ws=windows[Object.keys(WINDOW_LABELS).indexOf(w)];
  const windowNeeds=ws.units<CREDIT_REQUIREMENTS.advancedWindow.total||ws.fields.some(n=>n<CREDIT_REQUIREMENTS.advancedWindow.perField);
  const suggestions=[];
  for(const c of creditCatalog){
    if(projected.has(c.jp))continue;
    const sections=findSections(c.en,c.jp).filter(s=>s.term===creditEl('creditTerm').value);
    if(!sections.length)continue;
    const reasons=[];
    if(creditIntro.includes(c.jp))reasons.push('入門必修');
    if(c.category==='実践科目')reasons.push('実践科目・必修');
    if(creditToolRequired.includes(c.jp))reasons.push('基本ツール必修');
    if(['ICT・データサイエンス','思考系'].includes(c.category)&&!creditToolRequired.includes(c.jp)&&remaining('基本ツール選択'))reasons.push('基本ツール選択の不足');
    if(creditFoundation.includes(c.jp)&&(remaining('基盤科目')||remaining('基盤・'+c.field)))reasons.push('基盤科目'+(remaining('基盤・'+c.field)?'・'+c.field+'の不足':''));
    if(c.window===w&&windowNeeds)reasons.push(WINDOW_LABELS[w][0]+(ws.fields[['人','社会','自然'].indexOf(c.field)]<CREDIT_REQUIREMENTS.advancedWindow.perField?'・'+c.field+'の不足':'の不足'));
    if(remaining('リベラルアーツ合計')&&(c.category.startsWith('リベラルアーツ')||c.category==='実践科目'))reasons.push('リベラルアーツ全体の不足');
    if(c.category==='実践英語（基盤科目）'&&remaining('実践英語・基盤'))reasons.push('実践英語の不足');
    if(c.category==='課題解決演習'||c.category==='卒業プロジェクト')reasons.push(c.category+'の未修得科目');
    if(c.category==='体験・実践プログラム'&&(remaining('体験・実践')||(c.jp.startsWith('海外')&&remaining('海外プログラム（免除は個別確認）'))))reasons.push('体験・実践の不足');
    if(remaining('英語開講')&&sections.some(s=>s.language.code==='E'))reasons.push('英で修得すると英語単位に算入');
    if(reasons.length)suggestions.push({c,reasons});
  }
  if(!suggestions.length){const empty=document.createElement('p');empty.textContent='選択した学期に該当する候補はありません。他の学期も確認してください。';root.append(empty);translateCreditUI();return;}
  const score=({c})=>{
    let n=0;
    if(creditIntro.includes(c.jp)||creditToolRequired.includes(c.jp)||['課題解決演習','卒業プロジェクト','実践科目'].includes(c.category))n+=100;
    if(creditFoundation.includes(c.jp)&&(remaining('基盤科目')||remaining('基盤・'+c.field)))n+=80+(remaining('基盤・'+c.field)?15:0);
    if(c.window===w&&windowNeeds)n+=70+(ws.fields[['人','社会','自然'].indexOf(c.field)]<CREDIT_REQUIREMENTS.advancedWindow.perField?15:0);
    if(c.category==='実践英語（基盤科目）'&&remaining('実践英語・基盤'))n+=80;
    if(['ICT・データサイエンス','思考系'].includes(c.category)&&remaining('基本ツール選択')&&!creditToolRequired.includes(c.jp))n+=80;
    if(c.category==='体験・実践プログラム'&&remaining('体験・実践'))n+=80;
    if(c.jp.startsWith('海外')&&remaining('海外プログラム（免除は個別確認）'))n+=85;
    if(c.category.startsWith('リベラルアーツ')&&remaining('リベラルアーツ合計'))n+=20;
    return n;
  };
  suggestions.sort((a,b)=>score(b)-score(a)||b.reasons.length-a.reasons.length);
  let suggestionIndex=0;
  for(const {c,reasons} of suggestions){
    const row=document.createElement('div');row.className='creditRow';if(suggestionIndex++>=5)row.style.display='none';const label=document.createElement('span');label.textContent=c.jp+'（'+c.units+'単位）';const note=document.createElement('small');note.textContent=reasons.join('／');label.append(note);
    const button=document.createElement('button');button.className='pillBtn';button.textContent='授業を見て時間割へ';button.addEventListener('click',()=>{document.getElementById('weekdayFilter').value='';categoryFilter.value='';windowFilterEl.value='';termFilter.value=creditEl('creditTerm').value;searchInput.value=c.jp;renderCourses();document.querySelector('[data-tab="syllabus"]').click();const card=courseList.querySelector('.card');if(card){card.classList.add('open');card.scrollIntoView({block:'start'});}});row.append(label,button);root.append(row);
  }
  if(suggestions.length>5){const more=document.createElement('button');more.className='pillBtn';more.textContent='ほか'+(suggestions.length-5)+'科目を見る';more.addEventListener('click',()=>{root.querySelectorAll('.creditRow').forEach(r=>r.style.display='');more.remove();});root.append(more);}
  translateCreditUI();
}
function renderCreditList(){
  creditEl('creditPlanCandidates').setAttribute('aria-pressed',String(creditCandidates));
  creditEl('creditPlanCandidates').textContent=creditCandidates?'時間割の科目に絞り込み中・解除する':'マイ時間割の科目だけ表示';
  const root=creditEl('creditList'); const open=new Set([...root.querySelectorAll('details[open]')].map(d=>d.dataset.group)); root.replaceChildren();
  const q=creditEl('creditSearch').value.trim().toLowerCase();
  const items=creditCatalog.filter(c=>(!q||(c.jp+' '+c.en+(c.jp==='経済学'?' Finance ファイナンス論':'')).toLowerCase().includes(q))&&(!creditEl('creditSelectedOnly').checked||creditState.has(c.jp))&&(!creditCandidates||myTimetable.some(t=>t.courseJp===c.jp||t.courseEn===c.en)));
  creditEl('creditCandidateNote').textContent=creditCandidates?'時間割から候補を表示中。合格済みの科目だけ、修得言語を選択してください。':'合格済みの科目を選択してください。同じ科目の日・英は一方だけ数えます。';
  if(!items.length){root.textContent='該当する科目がありません。検索や候補表示を解除してください。';translateCreditUI();return;}
  const groups=[...new Set(items.map(c=>c.group))];
  const elective=groups.indexOf('リベラルアーツ・入門選択');const required=groups.indexOf('リベラルアーツ・入門必修');
  if(elective>=0&&required>=0){groups.splice(elective,1);groups.splice(groups.indexOf('リベラルアーツ・入門必修')+1,0,'リベラルアーツ・入門選択');}
  for(const group of groups){
    const ds=document.createElement('details');ds.dataset.group=group;ds.open=!!q||creditCandidates||creditEl('creditSelectedOnly').checked||open.has(group);
    const title=document.createElement('summary');title.textContent=group;ds.append(title);
    const status=document.createElement('span');status.className='creditGroupStatus';title.append(status);
    const updateGroup=()=>{const all=creditCatalog.filter(c=>c.group===group);const chosen=all.filter(c=>creditState.has(c.jp));const complete=chosen.length===all.length;ds.classList.toggle('creditCompleteGroup',complete);status.textContent=(complete?'すべて選択済み':'選択済み '+chosen.length+' / '+all.length+'科目')+' · '+chosen.reduce((n,c)=>n+c.units,0)+'単位';};
    updateGroup();
    const members=items.filter(c=>c.group===group);
    if(group==='リベラルアーツ・入門必修'){
      const hint=document.createElement('p');hint.textContent=L('入門必修の全7科目・13単位を選択します。入門選択・実践科目は含みません。日英が混在する場合は、選択後に各科目の言語を修正してください。','Select all 7 required introductory courses (13 credits), excluding introductory electives and the capstone. Adjust individual languages afterwards if needed.');ds.append(hint);
      const controls=document.createElement('div');controls.className='creditControls';ds.append(controls);
      for(const [lang,label] of [['ja','すべて日で修得済み'],['en','すべて英で修得済み']]){
        const b=document.createElement('button');b.type='button';b.className='pillBtn';b.textContent=label;
        b.addEventListener('click',()=>{for(const c of creditCatalog.filter(c=>creditIntro.includes(c.jp)))creditState.set(c.jp,lang);creditEl('creditComplete').checked=false;renderCreditList();renderCreditResults();});controls.append(b);
      }
    }
    if(group==='課題解決演習'){
      const hint=document.createElement('p');hint.textContent='課題解決入門・ⅠA・ⅠB・Ⅱの計9単位を一括選択します。日英が混在する場合は選択後に各科目を直してください。卒業プロジェクトは含みません。';ds.append(hint);
      for(const [lang,label] of [['ja','すべて日で修得済み'],['en','すべて英で修得済み']]){
        const b=document.createElement('button');b.className='pillBtn';b.textContent=label;
        b.addEventListener('click',()=>{for(const c of creditCatalog.filter(c=>c.category==='課題解決演習'))creditState.set(c.jp,lang);creditEl('creditComplete').checked=false;renderCreditList();renderCreditResults();});ds.append(b);
      }
    }
    if(group==='IEP'){
      const b=document.createElement('button');b.className='pillBtn';b.textContent='IEP全10科目が合格済み：まとめて選択';
      b.addEventListener('click',()=>{for(const c of creditCatalog.filter(c=>c.category==='IEP'))creditState.set(c.jp,'en');creditEl('creditComplete').checked=false;renderCreditList();renderCreditResults();});ds.append(b);
    }
    for(const c of members){
      const row=document.createElement('label');row.className='creditRow';const name=document.createElement('span');
      name.textContent=c.jp+(c.jp==='経済学'?' / Finance（旧ファイナンス論・同一科目）':'');
      const sub=document.createElement('small');sub.textContent=c.en+' · '+c.units+'単位'+(c.field?' · '+c.field:'');name.append(sub);
      const select=document.createElement('select');select.setAttribute('aria-label',c.jp+'の修得状況');
      for(const [v,t] of [['','未選択'],...(!c.englishOnly?[['ja','日で修得']]:[]),...(!c.japaneseOnly?[['en','英で修得']]:[])]){const opt=document.createElement('option');opt.value=v;opt.textContent=t;select.append(opt);}
      select.value=creditState.get(c.jp)||'';row.classList.toggle('creditChosen',creditState.has(c.jp));select.addEventListener('change',()=>{if(select.value)creditState.set(c.jp,select.value);else creditState.delete(c.jp);row.classList.toggle('creditChosen',creditState.has(c.jp));updateGroup();creditEl('creditComplete').checked=false;renderCreditResults();if(creditEl('creditSelectedOnly').checked)renderCreditList();});
      row.append(name,select);ds.append(row);
    }root.append(ds);
  }
  translateCreditUI();
}
for(const id of ['creditSearch','creditSelectedOnly'])creditEl(id).addEventListener('input',renderCreditList);
for(const id of ['creditYear','creditEntry'])creditEl(id).addEventListener('change',()=>{creditEl('creditComplete').checked=false;renderCreditList();renderCreditResults();});
creditEl('creditComplete').addEventListener('change',renderCreditResults);
document.getElementById('langToggle').addEventListener('click',()=>{renderCreditList();renderCreditResults();translateCreditUI();});
for(const id of ['creditTerm','creditWindow'])creditEl(id).addEventListener('change',renderCreditSuggestions);
function showCreditStep(output){
  creditEl('creditOutputStep').hidden=!output;
  creditEl('creditEntryStep').hidden=output;
  creditEl('creditSettings').hidden=output;
  creditEl('creditInputStep').setAttribute('aria-pressed',String(!output));
  creditEl('creditResultStep').setAttribute('aria-pressed',String(output));
  if(output)renderCreditResults();
  creditEl('panel-credits').scrollIntoView({block:'start'});
}
creditEl('creditInputStep').addEventListener('click',()=>showCreditStep(false));
creditEl('creditResultStep').addEventListener('click',()=>showCreditStep(true));
creditEl('creditNext').addEventListener('click',()=>showCreditStep(true));
document.querySelector('[data-tab="credits"]').addEventListener('click',renderCreditSuggestions);
creditEl('creditPlanCandidates').addEventListener('click',()=>{creditCandidates=!creditCandidates;creditEl('creditSearch').value='';creditEl('creditSelectedOnly').checked=false;renderCreditList();});
creditEl('creditClear').addEventListener('click',()=>{creditState.clear();creditCandidates=false;creditEl('creditComplete').checked=false;creditEl('creditSelectedOnly').checked=false;creditEl('creditSearch').value='';renderCreditList();renderCreditResults();});
creditEl('viewPlan').addEventListener('click',()=>document.querySelector('[data-tab="timetable"]').click());
creditEl('findPlanCourses').addEventListener('click',()=>document.querySelector('[data-tab="syllabus"]').click());
const CREDIT_STORAGE_KEY='eikei-navi-earned-credits-v1';
function saveCreditSelections(){
  try{
    if(!creditState.size)localStorage.removeItem(CREDIT_STORAGE_KEY);
    else localStorage.setItem(CREDIT_STORAGE_KEY,JSON.stringify({version:1,year:creditEl('creditYear').value,entry:creditEl('creditEntry').value,courses:[...creditState]}));
    creditEl('creditStorageNote').textContent='';
  }catch{creditEl('creditStorageNote').textContent=L('このブラウザでは保存できません。再読み込みすると入力が消えます。','Storage unavailable. Reloading will clear your selections.');}
  if(creditGroupingReady)renderCourses();
}
try{
  const raw=localStorage.getItem(CREDIT_STORAGE_KEY);
  if(raw&&raw.length<30000){const data=JSON.parse(raw);
    if(data.version===1&&Array.isArray(data.courses)&&data.courses.length<=creditCatalog.length){
      for(const row of data.courses){if(!Array.isArray(row)||row.length!==2)continue;const c=creditCatalog.find(c=>c.jp===row[0]);if(c&&['ja','en'].includes(row[1])&&!(c.englishOnly&&row[1]==='ja')&&!(c.japaneseOnly&&row[1]==='en'))creditState.set(row[0],row[1]);}
      if(['2024','2025','2026'].includes(data.year))creditEl('creditYear').value=data.year;
      if(['spring','autumn'].includes(data.entry))creditEl('creditEntry').value=data.entry;
    }
  }
}catch{ /* Invalid saved input is not interpreted as code or HTML. */ }
creditGroupingReady=true;
renderCreditList();renderCreditResults();
