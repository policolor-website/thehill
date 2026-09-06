// Pre-procesează players.json și adaugă pozițiile din match_sheets.json
// Rezultat: players_enriched.json cu câmpul "positions" (array cu toate pozițiile din meciuri)

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public', 'data');

const players = JSON.parse(fs.readFileSync(path.join(dataDir, 'players.json'), 'utf8'));
const matchSheets = JSON.parse(fs.readFileSync(path.join(dataDir, 'match_sheets.json'), 'utf8'));

// Curăță pozițiile corupte
function cleanPosition(pos) {
  // Map pentru caractere corupte (replacement chars \ufffd)
  const map = {
    'Funda\u00fe central': 'Fundaș central',
    'Funda\u00fe st\u00e2nga': 'Fundaș stânga',
    'Funda\u0219 central': 'Fundaș central',
    'Funda\u0219 st\u00e2nga': 'Fundaș stânga',
    'Mijloca\u00fe central': 'Mijlocaș central',
    'Mijloca\u0219 central': 'Mijlocaș central',
  };
  if (map[pos]) return map[pos];
  if (pos === 'Pozitie') return null; // placeholder din API, ignor
  // Curăță replacement chars \ufffd (65533)
  // Funda\ufffd\ufffd central -> Fundaș central
  // Mijloca\ufffd\ufffd central -> Mijlocaș central
  // Fundaș st\ufffd\ufffdnga -> Fundaș stânga
  if (pos.includes('\ufffd')) {
    // Funda\ufffd\ufffd central -> Fundaș central (fără ș, cu replacement)
    if (pos.startsWith('Funda') && !pos.includes('ș') && pos.includes('central')) return 'Fundaș central';
    // Fundaș st\ufffd\ufffdnga -> Fundaș stânga (are ș, cu replacement în stânga)
    if (pos.includes('ș') && pos.includes('st') && pos.includes('nga')) return 'Fundaș stânga';
    // Mijloca\ufffd\ufffd central -> Mijlocaș central
    if (pos.startsWith('Mijloca') && pos.includes('central')) return 'Mijlocaș central';
  }
  return pos;
}

// Construiește map: nume jucător -> Set de poziții din meciuri
const playerPositions = {};
matchSheets.forEach(m => {
  const key = m.firstName.trim().toLowerCase() + '|' + m.lastName.trim().toLowerCase();
  const pos = cleanPosition(m.position);
  if (!pos) return; // skip null (placeholder 'Pozitie')
  if (!playerPositions[key]) playerPositions[key] = new Set();
  playerPositions[key].add(pos);
});

// Adaugă positions la fiecare jucător
let enriched = 0;
const enrichedPlayers = players.map(p => {
  const key = p.firstName.trim().toLowerCase() + '|' + p.lastName.trim().toLowerCase();
  const positions = playerPositions[key];
  if (positions && positions.size > 0) {
    enriched++;
    return { ...p, positions: [...positions] };
  }
  return { ...p, positions: [cleanPosition(p.position)] };
});

// Filtrează doar juniori
const juniorKeywords = /U\d|Juniori|Junioare|Liga Elitelor|Campionatul Național|Liga de Tineret|Interliga/i;
const juniors = enrichedPlayers.filter(p => juniorKeywords.test(p.competition));

// Deduplikă
const seen = new Set();
const unique = juniors.filter(p => {
  const k = p.firstName.trim() + '|' + p.lastName.trim() + '|' + p.birthDate;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

// Toate pozițiile distincte
const allPositions = new Set();
unique.forEach(p => p.positions.forEach(pos => allPositions.add(pos)));

console.log('Total players original:', players.length);
console.log('Jucători cu poziții din meciuri:', enriched);
console.log('Juniori unici:', unique.length);
console.log('Poziții distincte:', [...allPositions].sort());

// Salvează
fs.writeFileSync(path.join(dataDir, 'players_enriched.json'), JSON.stringify(unique));
console.log('\nSalvat: players_enriched.json (' + unique.length + ' jucători)');
