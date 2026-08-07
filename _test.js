const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('/sessions/admiring-determined-hopper/mnt/outputs/poker_cash_tracker.html', 'utf8');

const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'http://localhost/' });
const { window } = dom;

setTimeout(() => {
  const doc = window.document;

  window.applyLanguage('ru');
  console.log('LANG RU title:', doc.querySelector('h1').textContent);
  window.applyLanguage('en');
  console.log('LANG EN title:', doc.querySelector('h1').textContent);
  window.applyLanguage('es');
  console.log('LANG ES title:', doc.querySelector('h1').textContent);

  doc.getElementById('newPlayerName').value = 'Felipe';
  window.addPlayer();
  doc.getElementById('newPlayerName').value = 'Ana';
  window.addPlayer();
  console.log('players table:', doc.getElementById('playersBody').textContent.replace(/\s+/g,' ').trim());

  window.switchTab('nueva');
  const container = doc.getElementById('entriesContainer');
  container.innerHTML = '';
  window.addEntryRow('Felipe');
  window.addEntryRow('Ana');

  const rows = doc.querySelectorAll('#entriesContainer .players-entry');
  const felipeRow = rows[0];
  felipeRow.querySelector('.buyin-amount').value = 100;
  window.updateEntryNet(felipeRow.querySelector('.buyin-amount'));
  const addRebuyBtn = felipeRow.querySelector('.entry-buyins-col button');
  window.addBuyinLine(addRebuyBtn);
  const felipeBuyinInputs = felipeRow.querySelectorAll('.buyin-amount');
  felipeBuyinInputs[1].value = 50;
  window.updateEntryNet(felipeBuyinInputs[1]);
  felipeRow.querySelector('.entry-cashout').value = 200;
  window.updateEntryNet(felipeRow.querySelector('.entry-cashout'));
  console.log('Felipe net display (expect $50):', felipeRow.querySelector('.entry-net').textContent);
  console.log('Felipe buyin badge (expect $150):', felipeRow.querySelector('.buyin-total-badge').textContent);

  const anaRow = rows[1];
  anaRow.querySelector('.buyin-amount').value = 100;
  window.updateEntryNet(anaRow.querySelector('.buyin-amount'));
  anaRow.querySelector('.entry-cashout').value = 60;
  window.updateEntryNet(anaRow.querySelector('.entry-cashout'));
  console.log('Ana net display (expect -$40):', anaRow.querySelector('.entry-net').textContent);

  doc.getElementById('sessionDate').value = '2026-08-03';
  doc.getElementById('sessionBlinds').value = '1/2';
  window.saveSession();

  window.switchTab('historial');
  console.log('historial:', doc.getElementById('historialContainer').textContent.replace(/\s+/g,' ').trim());

  window.switchTab('stats');
  window.renderStats();
  console.log('stats body:', doc.getElementById('statsBody').textContent.replace(/\s+/g,' ').trim());
  console.log('blinds body:', doc.getElementById('blindsBody').textContent.replace(/\s+/g,' ').trim());

  const oldEntry = { player: 'X', buyIn: 80, cashOut: 120 };
  const oldData = { players: ['X'], sessions: [{ id:'a', date:'2026-01-01', blinds:'1/3', location:'', entries:[oldEntry] }] };
  window.migrateData(oldData);
  console.log('migrated entry:', JSON.stringify(oldData.sessions[0].entries[0]));
  console.log('entryBuyInTotal after migration (expect 80):', window.entryBuyInTotal(oldData.sessions[0].entries[0]));

  console.log('ALL TESTS DONE - NO ERRORS');
}, 300);
