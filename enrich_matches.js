// Enrich matches.json cu scoruri din scores.json
// Match pe dată + nume club normalizat

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public', 'data');

const matches = JSON.parse(fs.readFileSync(path.join(dataDir, 'matches.json'), 'utf8'));
const scores = JSON.parse(fs.readFileSync(path.join(dataDir, 'scores.json'), 'utf8'));

function normClub(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[ăâ]/g, 'a')
    .replace(/[î]/g, 'i')
    .replace(/[şș]/g, 's')
    .replace(/[ţț]/g, 't')
    .replace(/\b(fc|sc|acs|asc|cs|afc|cf|suporter club)\b/g, '')
    .replace(/\b19\d{2}\b|\b20\d{2}\b/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Index scoruri pe dată
const scoresByDate = {};
scores.forEach((s) => {
  if (!scoresByDate[s.date]) scoresByDate[s.date] = [];
  scoresByDate[s.date].push(s);
});

function findScore(date, homeName, awayName) {
  const sameDate = scoresByDate[date] || [];
  const h1 = normClub(homeName);
  const a1 = normClub(awayName);
  return sameDate.find((s) => {
    const h2 = normClub(s.homeClubName);
    const a2 = normClub(s.awayClubName);
    return (
      (h1 === h2 || h1.includes(h2) || h2.includes(h1)) &&
      (a1 === a2 || a1.includes(a2) || a2.includes(a1))
    );
  });
}

let alreadyHad = 0;
let enriched = 0;
let stillMissing = 0;

matches.forEach((m) => {
  if (m.homeGoals !== null && m.awayGoals !== null) {
    alreadyHad++;
    return;
  }
  const found = findScore(m.date, m.homeClubName, m.awayClubName);
  if (found) {
    m.homeGoals = found.homeGoals;
    m.awayGoals = found.awayGoals;
    enriched++;
  } else {
    stillMissing++;
  }
});

fs.writeFileSync(
  path.join(dataDir, 'matches.json'),
  JSON.stringify(matches)
);

console.log('Total meciuri:', matches.length);
console.log('Aveau deja scor:', alreadyHad);
console.log('Enrichuite din scores.json:', enriched);
console.log('Fără scor (nepotrivite):', stillMissing);
console.log('Total cu scor acum:', alreadyHad + enriched);
console.log(
  'matches.json rescris:',
  (fs.statSync(path.join(dataDir, 'matches.json')).size / 1024 / 1024).toFixed(1) + 'MB'
);
