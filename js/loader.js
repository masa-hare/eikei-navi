(() => {
  const dataFiles = {
    courses: 'data/courses.json',
    syllabi: 'data/syllabi.json',
    calendar: 'data/calendar.json',
    graduation: 'data/graduation-requirements.json'
  };
  const scripts = ['core', 'search', 'timetable', 'share', 'calendar', 'credits', 'app'];
  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src; script.async = false; script.onload = resolve; script.onerror = reject;
    document.head.append(script);
  });
  Promise.all(Object.entries(dataFiles).map(async ([key, url]) => {
    const response = await fetch(url, {cache:'no-cache'});
    if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + url);
    return [key, await response.json()];
  })).then(async entries => {
    globalThis.EIKEI_DATA = Object.fromEntries(entries);
    await Promise.all(scripts.map(name => loadScript('js/' + name + '.js')));
  }).catch(error => {
    console.error(error);
    const message = document.createElement('p');
    message.className = 'empty'; message.setAttribute('role', 'alert');
    message.textContent = 'データを読み込めませんでした。ページを再読み込みしてください。 / Could not load data. Please reload.';
    document.querySelector('.wrap')?.prepend(message);
  });
})();
