// 初期表示は、すべての関数と定数がそろってから一度だけ行う。
loadLang();
// 旧版のチームコード解除用データは、保護機能の廃止に伴い削除する。
try{ localStorage.removeItem('eikei-navi-team-key-v1'); }catch(e){}
applyStaticLang();
populateFilters();
renderCourses();
renderCalendar();
loadTimetable();
renderRegistrationSchedule();
document.getElementById('registrationCohort')?.addEventListener('change', renderRegistrationSchedule);

// ---- tabs ----
document.querySelectorAll('nav.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav.tabs button').forEach(b => {
      b.classList.remove('active');
      b.removeAttribute('aria-current');
    });
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-current','page');
    const panel=document.getElementById('panel-' + btn.dataset.tab);
    panel.classList.add('active');
    panel.tabIndex=-1;
    panel.focus({preventScroll:true});
  });
});

// ---- 言語切り替え ----
document.getElementById('langToggle').addEventListener('click', () => {
  LANG = LANG === 'ja' ? 'en' : 'ja';
  saveLang();
  applyStaticLang();
  populateFilters();
  renderCourses();
  renderTimetable();
  renderCalendar();
  renderRegistrationSchedule();
  renderCreditList();
  renderCreditResults();
  translateCreditUI();
});

// ---- PWA：オフライン対応・ホーム画面追加用のService Worker登録 ----
// sw.js が同じ場所に無い環境（アーティファクトとして開いた場合など）では静かに失敗するだけで、他の機能には影響しない
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* 未対応環境は無視 */ });
  });
}
