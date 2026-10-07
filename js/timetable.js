let myTimetable = []; // [{key, code, courseJp, courseEn, teacher, day, term}]
const TIMETABLE_STORAGE_KEY = 'tenohira-my-timetable'; // 旧版との互換性のためキー名は維持
function cleanStoredText(value, maxLength){
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}
function sanitizeTimetableItem(value){
  if(!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const courseJp = cleanStoredText(value.courseJp, 200);
  const courseEn = cleanStoredText(value.courseEn, 200);
  if(!courseJp && !courseEn) return null;
  const teacher = cleanStoredText(value.teacher, 160);
  const day = cleanStoredText(value.day, 80);
  const term = cleanStoredText(value.term, 40);
  const code = cleanStoredText(value.code, 80);
  const savedRoom = cleanStoredText(value.room, 300);
  const roomCustomized = value.roomCustomized === true;
  const officialRoom = ['Autumn','2nd Half'].includes(term) ? AUTUMN_ROOMS[code] : '';
  // 更新前の自動入力値だけを移行し、利用者が編集した教室メモは維持する。
  const previousRooms = PREVIOUS_AUTUMN_ROOMS[code] || [];
  const room = officialRoom && !roomCustomized && (!savedRoom || previousRooms.includes(savedRoom))
    ? officialRoom : savedRoom;
  const intensiveDates = Array.isArray(value.intensiveDates)
    ? value.intensiveDates.filter(d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0, 40)
    : [];
  return {
    key: sectionKey(code, courseEn, teacher, day),
    courseJp, courseEn, teacher, day, term, code, room, roomCustomized, intensiveDates
  };
}
// 保存はこの端末のブラウザ内（localStorage）だけ。サーバーへ送信する処理は設けていない。
function loadTimetable(){
  let notice = '';
  try{
    const raw = localStorage.getItem(TIMETABLE_STORAGE_KEY);
    if(raw){
      if(raw.length > 250000) throw new Error('Timetable data is too large');
      const parsed = JSON.parse(raw);
      if(!Array.isArray(parsed)) throw new Error('Invalid timetable data');
      if(parsed.length > 150) throw new Error('Timetable data is too large');
      myTimetable = parsed.map(sanitizeTimetableItem).filter(Boolean);
      // 旧版の「科目名＋教員＋曜日」キーを、時間割コード優先のキーへ保存し直す。
      saveTimetable();
      if(myTimetable.length !== parsed.length){
        notice = L('読み取れない保存データを除外して復旧しました。','Unreadable saved items were removed and the timetable was recovered.');
      }
    }
  }catch(e){
    myTimetable = [];
    try{ localStorage.removeItem(TIMETABLE_STORAGE_KEY); }catch(e2){}
    notice = L('保存データを読み取れなかったため、安全な空の時間割に戻しました。','Saved data could not be read, so My Timetable was safely reset.');
  }
  renderTimetable();
  const note = document.getElementById('storageNote');
  if(note && notice) note.textContent = notice;
}
function saveTimetable(){
  try{ localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(myTimetable)); }
  catch(e){ /* 保存できなくても一覧表示自体は続行 */ }
  if(creditGroupingReady)renderCreditSuggestions();
}
function sectionKey(code, en, teacher, day){
  const sectionCode = String(code || '').trim();
  return sectionCode ? 'code:' + sectionCode : 'legacy:' + en + '|' + teacher + '|' + day;
}
function toggleSection(en, jp, teacher, day, term, code, room, datesStr){
  const key = sectionKey(code, en, teacher, day);
  const idx = myTimetable.findIndex(x => x.key === key);
  if(idx === -1){
    const periods=parseDayPeriod(day);const dates=datesStr?datesStr.split(','):[];
    const conflict=myTimetable.find(x=>
      (x.term===term&&periods.some(p=>parseDayPeriod(x.day).some(q=>p.day===q.day&&p.period===q.period)))||
      (dates.length&&Array.isArray(x.intensiveDates)&&dates.some(d=>x.intensiveDates.includes(d)))
    );
    if(conflict){
      const message=L('同じ日時に「'+conflict.courseJp+'」がすでに登録されているため、追加できません。変更する場合は、先に登録済みの授業を時間割から外してください。','A course is already registered at this time: '+conflict.courseEn+'. This course cannot be added. To replace it, remove the existing course first.');
      document.getElementById('planFeedback').textContent=message;
      alert(message);return;
    }
    myTimetable.push({key, courseJp: jp, courseEn: en, teacher, day, term, code, room: room||'', intensiveDates: datesStr ? datesStr.split(',') : []});
  }else{
    myTimetable.splice(idx,1);
  }
  saveTimetable();
  renderTimetable();
  refreshAddButtons();
  document.getElementById('planFeedback').textContent = L(jp,en) + (idx === -1 ? L('をマイ時間割に追加しました。「マイ時間割を見る」で確認できます。',' added. Choose View My Timetable to see your plan.') : L('をマイ時間割から外しました。',' removed from My Timetable.'));
}
function isAdded(code, en, teacher, day){
  return myTimetable.some(x => x.key === sectionKey(code, en, teacher, day));
}
function refreshAddButtons(){
  document.querySelectorAll('.addToggle').forEach(b => {
    const added = isAdded(b.dataset.code, b.dataset.courseEn, b.dataset.teacher, b.dataset.day);
    b.classList.toggle('added', added);
    b.textContent = added ? L('追加済み・外す','Added · Remove') : L('時間割に追加','Add to timetable');
    b.setAttribute('aria-pressed', String(added));
    b.setAttribute('aria-label', added ? L('時間割から外す','Remove from timetable') : L('時間割に追加','Add to timetable'));
  });
}
function parseDayPeriod(day){
  // "月1,水2" → [{day:'月',period:'1'}, {day:'水',period:'2'}]
  if(!day) return [];
  return day.split(',').map(s => s.trim()).filter(Boolean).map(s => {
    const m = s.match(/^([月火水木金土日])(\d+)$/);
    return m ? {day:m[1], period:m[2]} : null;
  }).filter(Boolean);
}
const DAYS = ['月','火','水','木','金'];
let selectedQuarter = null;
let selectedTTDay = null;
function guessCurrentQuarter(){
  const now = new Date();
  const todayISO = now.getFullYear()+'-'+pad2(now.getMonth()+1)+'-'+pad2(now.getDate());
  for(const q of ['Spring','Summer','Autumn','Winter']){
    const [s,e] = quarterRangeFor(q);
    if(todayISO >= s && todayISO <= e) return q;
  }
  // どの学期の期間にも当てはまらない（長期休暇中など）場合は、直近で始まる学期を返す
  const upcoming = ['Spring','Summer','Autumn','Winter'].filter(q => quarterRangeFor(q)[0] >= todayISO);
  return upcoming.length ? upcoming[0] : 'Spring';
}
// 集中講義や1st/2nd Half等、単純な学期名でない項目がどの学期に属するかを判定
// 日程が確定していない集中講義は判定できないため null（＝どの学期タブでも常に表示）を返す
function effectiveQuarter(item){
  if(['Spring','Summer','Autumn','Winter'].includes(item.term)) return item.term;
  if(item.term === '1st Half') return 'Spring';
  if(item.term === '2nd Half') return 'Autumn';
  if(item.term === 'Full-Year') return null;
  if(item.term === 'Intensive' && item.intensiveDates && item.intensiveDates.length){
    const d = item.intensiveDates[0];
    for(const q of ['Spring','Summer','Autumn','Winter']){
      const [s,e] = quarterRangeFor(q);
      if(d >= s && d <= e) return q;
    }
  }
  return null;
}
document.querySelectorAll('#seasonTabs button').forEach(b => {
  b.addEventListener('click', () => {
    selectedQuarter = b.dataset.q;
    renderTimetable();
  });
});
document.querySelectorAll('#ttDayTabs button').forEach(b => {
  b.addEventListener('click', () => {
    selectedTTDay = b.dataset.day;
    renderTimetable();
  });
});

function timetableSyllabusLink(item){
 const name=courseNameForTeachingLanguage(item);
 return `<button type="button" class="ttSyllabusLink" data-syllabus-course="${escapeHTML(name)}" style="font:inherit;color:inherit;text-align:left;background:transparent;border:0;padding:4px 0;text-decoration:underline;text-underline-offset:3px;cursor:pointer;" aria-label="${escapeHTML(L(name+'のシラバスを開く','Open syllabus: '+name))}">${escapeHTML(name)}</button>`;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-syllabus-course]');if(!button)return;
 document.getElementById('weekdayFilter').value='';categoryFilter.value='';windowFilterEl.value='';termFilter.value='';searchInput.value=button.dataset.syllabusCourse;
 renderCourses();document.querySelector('[data-tab="syllabus"]').click();
 const card=courseList.querySelector('.card');if(card){const group=card.closest('details');if(group)group.open=true;card.classList.add('open');card.scrollIntoView({block:'start'});}
});
function renderTimetable(){
  if(!selectedQuarter) selectedQuarter = guessCurrentQuarter();
  document.querySelectorAll('#seasonTabs button').forEach(b => {
    b.classList.toggle('active', b.dataset.q === selectedQuarter);
  });
  if(!selectedTTDay){
    const todayJP = REV_DOW[new Date().getDay()];
    selectedTTDay = (todayJP && DAYS.includes(todayJP)) ? todayJP : '月';
  }
  document.querySelectorAll('#ttDayTabs button').forEach(b => {
    b.classList.toggle('active', b.dataset.day === selectedTTDay);
  });

  const ttGrid = document.getElementById('ttGrid');
  const ttDayList = document.getElementById('ttDayList');
  const ttOther = document.getElementById('ttOther');
  // 選んでいる学期タブに合うものだけを表示（学期が判定できない集中講義は常に表示）
  const visible = myTimetable.filter(x => {
    const eq = effectiveQuarter(x);
    return eq === null || eq === selectedQuarter;
  });
  // 曜日・時限があるものだけ日別リストへ
  const gridded = visible.filter(x => parseDayPeriod(x.day).length);
  const withIntensiveDates = visible.filter(x => x.intensiveDates && x.intensiveDates.length);
  const other = visible.filter(x => !parseDayPeriod(x.day).length && !(x.intensiveDates && x.intensiveDates.length));

  if(!gridded.length && !other.length && !withIntensiveDates.length){
    const emptyMsg = myTimetable.length
      ? `<p class="empty">${L('この学期に登録されている授業はありません。','No courses registered for this quarter.')}</p>`
      : `<p class="empty">${L('まだ何も追加されていません。シラバス検索タブでカードを開き、「＋」ボタンを押してください。','Nothing added yet. Open a card on the Search tab and tap the "+" button.')}</p>`;
    ttGrid.innerHTML = emptyMsg;
    ttDayList.innerHTML = emptyMsg;
    ttOther.innerHTML = '';
    document.getElementById('myIntensiveList').innerHTML = '';
    renderToday();
    return;
  }

  // 時限×曜日のカレンダー表形式で表示（広い画面用）
  let maxPeriod = 6;
  gridded.forEach(x => parseDayPeriod(x.day).forEach(p => { maxPeriod = Math.max(maxPeriod, +p.period); }));
  let html = '<div class="ttCalWrap"><table class="ttCalTable"><tr><th></th>' + DAYS.map(d => `<th>${L(d,DAY_EN[d])}</th>`).join('') + '</tr>';
  for(let p=1; p<=maxPeriod; p++){
    html += `<tr><th>${p}</th>`;
    DAYS.forEach(d => {
      const here = gridded.filter(x => parseDayPeriod(x.day).some(pp => pp.day===d && +pp.period===p));
      html += '<td class="ttCalCell">' + here.map(item => `
        <div class="ttCalCourse">
          <div class="ttCalName">${timetableSyllabusLink(item)}<button type="button" class="rm" data-key="${escapeHTML(item.key)}" aria-label="${L('時間割から外す','Remove from timetable')}">×</button></div>
          ${teamCodeHTML(item.code, true)}
          <input type="text" class="roomInput" maxlength="300" data-key="${escapeHTML(item.key)}" value="${escapeHTML(item.room||'')}" placeholder="${L('教室','Room')}" aria-label="${escapeHTML(L('教室メモ：','Room note: ')+courseNameForTeachingLanguage(item))}">
        </div>`).join('') + '</td>';
    });
    html += '</tr>';
  }
  html += '</table></div>';
  ttGrid.innerHTML = html;
  ttGrid.querySelectorAll('.rm').forEach(el => {
    el.addEventListener('click', () => {
      myTimetable = myTimetable.filter(x => x.key !== el.dataset.key);
      saveTimetable(); renderTimetable(); refreshAddButtons();
    });
  });
  ttGrid.querySelectorAll('.roomInput').forEach(el => {
    el.addEventListener('input', () => {
      const it = myTimetable.find(x => x.key === el.dataset.key);
      if(it){ it.room = cleanStoredText(el.value, 300); it.roomCustomized = true; saveTimetable(); renderToday(); }
    });
  });

  // 狭い画面用：選んだ曜日1日分だけをリスト表示（横スクロール不要）
  const dayHere = [];
  gridded.forEach(x => parseDayPeriod(x.day).forEach(p => {
    if(p.day === selectedTTDay) dayHere.push({item:x, period:+p.period});
  }));
  dayHere.sort((a,b) => a.period - b.period);
  ttDayList.innerHTML = dayHere.length ? dayHere.map(({item,period}) => `
    <div class="ttDayRow">
      <div class="period">${period}</div>
      <div class="info">
        <div class="cname">${timetableSyllabusLink(item)}<button type="button" class="rm" data-key="${escapeHTML(item.key)}" aria-label="${L('時間割から外す','Remove from timetable')}">×</button></div>
        ${teamCodeHTML(item.code, true)}
        <input type="text" class="roomInput" maxlength="300" data-key="${escapeHTML(item.key)}" value="${escapeHTML(item.room||'')}" placeholder="${L('教室','Room')}" aria-label="${escapeHTML(L('教室メモ：','Room note: ')+courseNameForTeachingLanguage(item))}">
      </div>
    </div>`).join('') : `<p class="empty">${L('この曜日に登録されている授業はありません。','No courses on this day.')}</p>`;
  ttDayList.querySelectorAll('.rm').forEach(el => {
    el.addEventListener('click', () => {
      myTimetable = myTimetable.filter(x => x.key !== el.dataset.key);
      saveTimetable(); renderTimetable(); refreshAddButtons();
    });
  });
  ttDayList.querySelectorAll('.roomInput').forEach(el => {
    el.addEventListener('input', () => {
      const it = myTimetable.find(x => x.key === el.dataset.key);
      if(it){ it.room = cleanStoredText(el.value, 300); it.roomCustomized = true; saveTimetable(); renderToday(); }
    });
  });

  ttOther.innerHTML = other.length
    ? `<p style="font-size:13px;color:var(--ink-soft);margin:0 0 8px;">${L('曜日・時限が決まっていない科目（通年など）','Courses without a fixed day/period (full-year, etc.)')}</p>` +
      other.map(x => `<div class="ttOtherItem"><span>${timetableSyllabusLink(x)}（${escapeHTML(x.teacher)} / ${escapeHTML(L(TERM_LABEL[x.term]||x.term, TERM_LABEL_EN[x.term]||x.term))}）${x.room ? '<br><span style="color:var(--ink-soft);font-size:12px;">'+L('教室：','Room: ')+escapeHTML(x.room)+'</span>' : ''}${hasTeamCode(x.code) ? '<br>'+teamCodeHTML(x.code, false) : ''}</span><button type="button" class="rm" data-key="${escapeHTML(x.key)}" aria-label="${L('時間割から外す','Remove from timetable')}">×</button></div>`).join('')
    : '';
  ttOther.querySelectorAll('.rm').forEach(el => {
    el.addEventListener('click', () => {
      myTimetable = myTimetable.filter(x => x.key !== el.dataset.key);
      saveTimetable(); renderTimetable(); refreshAddButtons();
    });
  });

  // ---- 集中講義スケジュール：自分がマイ時間割に追加した科目のうち、日程が確認できているものだけ ----
  const myIntensive = document.getElementById('myIntensiveList');
  const withDates = withIntensiveDates.slice().sort((a,b) => a.intensiveDates[0].localeCompare(b.intensiveDates[0]));
  myIntensive.innerHTML = withDates.length
    ? `<p style="font-size:13px;color:var(--ink-soft);margin:0 0 8px;">${L('集中講義スケジュール（追加した科目のみ）','Intensive Course Schedule (courses you added)')}</p>` +
      withDates.map(x => `<div class="intItem">
        <div class="intDate">${formatIntensiveDates(x.intensiveDates)}</div>
        <div class="intBody">
          <div class="name">${timetableSyllabusLink(x)}</div>
          <div class="meta">${escapeHTML(x.teacher)}${x.room ? ' ・ '+escapeHTML(x.room) : ''}<button type="button" class="rm" data-key="${escapeHTML(x.key)}" aria-label="${L('時間割から外す','Remove from timetable')}">×</button></div>
        </div>
      </div>`).join('')
    : '';
  myIntensive.querySelectorAll('.rm').forEach(el => {
    el.addEventListener('click', () => {
      myTimetable = myTimetable.filter(x => x.key !== el.dataset.key);
      saveTimetable(); renderTimetable(); refreshAddButtons();
    });
  });

  renderToday();
}

// ---- 授業時間 ----
const PERIOD_TIMES = {
  1:['09:00','10:40'],
  2:['10:50','12:30'],
  3:['13:30','15:10'],
  4:['15:20','17:00'],
  5:['17:10','18:50'],
  6:['19:00','20:40']
};
const DAY_EN = {'月':'Mon','火':'Tue','水':'Wed','木':'Thu','金':'Fri','土':'Sat','日':'Sun'};
function pad2(n){ return String(n).padStart(2,'0'); }

// ---- きょうの教室（ページ上部に常時表示） ----
const REV_DOW = {1:'月',2:'火',3:'水',4:'木',5:'金'};
function renderToday(){
  const el = document.getElementById('todayCard');
  const now = new Date();
  const todayISO = now.getFullYear()+'-'+pad2(now.getMonth()+1)+'-'+pad2(now.getDate());
  const todayLabel = REV_DOW[now.getDay()]; // 土日はundefined

  const regularToday = [];
  if(todayLabel){
    myTimetable.forEach(x => {
      const eq = effectiveQuarter(x);
      const inRange = eq === null ? true : (todayISO >= quarterRangeFor(eq)[0] && todayISO <= quarterRangeFor(eq)[1]);
      if(!inRange) return; // 今日がその授業の学期の期間外なら「きょう」には出さない
      parseDayPeriod(x.day).forEach(p => {
        if(p.day === todayLabel) regularToday.push({item:x, period:+p.period});
      });
    });
  }
  regularToday.sort((a,b) => a.period - b.period);

  // 集中講義は曜日に関係なく、今日が開講日そのものなら表示（土日開講もあるため）
  const intensiveToday = myTimetable.filter(x => x.intensiveDates && x.intensiveDates.includes(todayISO));

  const title = todayLabel ? L(`きょう（${todayLabel}曜日）の授業`, `Today's Classes (${DAY_EN[todayLabel]})`) : L('きょうの授業',"Today's Classes");
  if(!regularToday.length && !intensiveToday.length){
    el.innerHTML = `<div class="todayCard"><p class="todayTitle">${title}</p><p class="todayEmpty">${L('マイ時間割に登録されている授業はありません。','No courses registered in My Timetable.')}</p></div>`;
    return;
  }
  let rows = regularToday.map(({item, period}) => {
    const t = PERIOD_TIMES[period];
    const time = t ? `${t[0]}〜${t[1]}` : L(`${period}限`,`Period ${period}`);
    return `<div class="todayRow">
      <div class="todayTime">${time}</div>
      <div>
        <div class="todayCourse">${timetableSyllabusLink(item)}</div>
        <div class="todayMeta">${escapeHTML(item.teacher)}${item.room ? ' ・ ' + escapeHTML(item.room) : ' ・ '+L('教室未入力','room not entered')}</div>
      </div>
    </div>`;
  }).join('');
  rows += intensiveToday.map(item => `<div class="todayRow">
      <div class="todayTime">${L('集中講義','Intensive')}</div>
      <div>
        <div class="todayCourse">${timetableSyllabusLink(item)}</div>
        <div class="todayMeta">${escapeHTML(item.teacher)}${item.room ? ' ・ ' + escapeHTML(item.room) : ' ・ '+L('教室未入力','room not entered')}</div>
      </div>
    </div>`).join('');
  el.innerHTML = `<div class="todayCard"><p class="todayTitle">${title}</p>${rows}</div>`;
}
function quarterRangeFor(term){
  const map = {
    'Spring': ['2026-04-13','2026-06-02'],
    'Summer': ['2026-06-15','2026-08-02'],
    'Autumn': ['2026-10-05','2026-11-22'],
    'Winter': ['2027-01-04','2027-02-22']
  };
  if(map[term]) return map[term];
  if(term === '1st Half'){
    const [s,e] = map['Spring'];
    const mid = new Date((new Date(s+'T00:00:00').getTime()+new Date(e+'T00:00:00').getTime())/2);
    return [s, mid.toISOString().slice(0,10)];
  }
  if(term === '2nd Half'){
    const [s,e] = map['Autumn'];
    const mid = new Date((new Date(s+'T00:00:00').getTime()+new Date(e+'T00:00:00').getTime())/2);
    return [mid.toISOString().slice(0,10), e];
  }
  if(term === 'Full-Year'){ return ['2026-04-13','2027-02-22']; }
  return null; // Intensive など、決まった週内の曜日・時限を持たないもの
}
document.getElementById('clearTimetableBtn').addEventListener('click', () => {
  const note = document.getElementById('storageNote');
  if(!myTimetable.length){
    note.textContent = L('削除する時間割データはありません。','There is no timetable data to delete.');
    return;
  }
  const confirmed = window.confirm(L(
    'マイ時間割の授業と教室メモをすべて削除します。元に戻せません。よろしいですか？',
    'Delete every course and room note in My Timetable? This cannot be undone.'
  ));
  if(!confirmed) return;
  myTimetable = [];
  try{ localStorage.removeItem(TIMETABLE_STORAGE_KEY); }catch(e){}
  renderTimetable();
  refreshAddButtons();
  note.textContent = L('マイ時間割を削除しました。','My Timetable was deleted.');
});

totalCount.textContent = COURSES.length;
