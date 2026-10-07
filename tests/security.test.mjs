import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('public course data includes no classroom joining credentials', () => {
  const data = JSON.parse(read('data/courses.json'));
  assert.deepEqual(data.teamCodes, { autumn: {}, codes: {}, shared: {} });
});

test('calendar labels from a data file are rendered as text', () => {
  const elements = [];
  const container = { innerHTML: '', appendChild: element => elements.push(element) };
  const context = {
    CALENDAR: [['2026-10-07', '<img src=x onerror=alert(1)>', '秋', '<script>alert(1)</script>']],
    document: {
      getElementById: () => container,
      createElement: () => ({ innerHTML: '', appendChild: element => elements.push(element), addEventListener() {} }),
    },
    L: ja => ja,
    guessCurrentQuarter: () => 'Autumn',
  };
  // Use the production escaping helper rather than a test substitute.
  const core = read('js/search.js');
  const helper = core.slice(core.indexOf('function escapeHTML('), core.indexOf('\n}', core.indexOf('function escapeHTML(')) + 2);
  vm.runInNewContext(helper + '\n' + read('js/calendar.js') + '\nrenderCalendar();', context);
  const html = elements.map(element => element.innerHTML).join('');
  assert.doesNotMatch(html, /<img|<script/);
  assert.match(html, /&lt;img/);
  assert.match(html, /&lt;script/);
});

test('oversized or excessive saved timetable data resets safely', () => {
  const source = read('js/timetable.js').split('function saveTimetable()')[0];
  for (const raw of ['x'.repeat(250001), JSON.stringify(Array.from({ length: 151 }, () => ({ courseJp: 'test' })))]) {
    let removed = false;
    const context = {
      localStorage: { getItem: () => raw, removeItem: () => { removed = true; } },
      document: { getElementById: () => null },
      L: ja => ja,
      saveTimetable() {}, renderTimetable() {},
      AUTUMN_ROOMS: {}, PREVIOUS_AUTUMN_ROOMS: {}, sectionKey: () => '',
    };
    vm.runInNewContext(source + '\nloadTimetable();', context);
    assert.equal(removed, true);
    assert.equal(vm.runInNewContext('myTimetable.length', context), 0);
  }
});
