// Creează versiuni slim pentru deploy pe Vercel
const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, 'public', 'data');

function cleanPosition(pos) {
  const map = {
    'Funda\u00fe central': 'Fundaș central',
    'Funda\u00fe st\u00e2nga': 'Fundaș stânga',
    'Funda\u0219 central': 'Fundaș central',
    'Funda\u0219 st\u00e2nga': 'Fundaș stânga',
    'Mijloca\u00fe central': 'Mijlocaș central',
    'Mijloca\u0219 central': 'Mijlocaș central',
  };
  if (map[pos]) return map[pos];
  if (pos === 'Pozitie') return null;
  if (pos.includes('\ufffd')) {
    if (pos.startsWith('Funda') && !pos.includes('ș') && pos.includes('central')) return 'Fundaș central';
    if (pos.includes('ș') && pos.includes('st') && pos.includes('nga')) return 'Fundaș stânga';
    if (pos.startsWith('Mijloca') && pos.includes('central')) return 'Mijlocaș central';
  }
  return pos;
}

// 1. players_list.json — slim pentru lista /jucatori
const enriched = JSON.parse(fs.readFileSync(path.join(dataDir, 'players_enriched.json'), 'utf8'));
const slimPlayers = enriched.map(p => ({
  f: p.firstName,
  l: p.lastName,
  c: p.clubName,
  ci: p.clubId,
  b: p.birthDate,
  s: p.shirtNumber,
  p: p.positions?.[0] || p.position,
  ps: p.positions || [p.position],
  co: p.competition,
}));
fs.writeFileSync(path.join(dataDir, 'players_list.json'), JSON.stringify(slimPlayers));
console.log('players_list.json:', (fs.statSync(path.join(dataDir, 'players_list.json')).size / 1024 / 1024).toFixed(1) + 'MB');

// 2. player_stats.json — agregat per jucător din match_sheets
const ms = JSON.parse(fs.readFileSync(path.join(dataDir, 'match_sheets.json'), 'utf8'));
const matches = JSON.parse(fs.readFileSync(path.join(dataDir, 'matches.json'), 'utf8'));

// Încarcă scorurile din scores.json (colectate cu GetFRFMatches)
let scoresData = [];
try {
  scoresData = JSON.parse(fs.readFileSync(path.join(dataDir, 'scores.json'), 'utf8'));
  console.log('scores.json încărcat:', scoresData.length, 'scoruri');
} catch (e) {
  console.log('scores.json nu există — folosim doar scorurile din matches.json');
}

// Normalizează nume club — scoate diacritice, sufixe legale, prescurtări
function normClub(name) {
  return (name || '').trim().toLowerCase()
    .replace(/[ăâ]/g, 'a').replace(/[î]/g, 'i').replace(/[șş]/g, 's').replace(/[țţ]/g, 't')
    .replace(/\b(fc|sc|acs|afc|cs|cfk|fk|lps|fcsa|sa|s\.a)\b/g, '')
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Index scoruri pe dată pentru potrivire flexibilă
const scoresByDate = {};
scoresData.forEach(s => {
  if (!scoresByDate[s.date]) scoresByDate[s.date] = [];
  scoresByDate[s.date].push(s);
});

// Caută scor pentru un meci (din scores.json, match pe dată + nume cluburi normale)
function findScore(date, homeName, awayName) {
  const sameDate = scoresByDate[date] || [];
  const h1 = normClub(homeName), a1 = normClub(awayName);
  const match = sameDate.find(s => {
    const h2 = normClub(s.homeClubName), a2 = normClub(s.awayClubName);
    return (h1 === h2 || h1.includes(h2) || h2.includes(h1)) &&
           (a1 === a2 || a1.includes(a2) || a2.includes(a1));
  });
  if (match) return { homeGoals: match.homeGoals, awayGoals: match.awayGoals };
  return null;
}

// Map meciuri
const matchMap = {};
matches.forEach(m => { matchMap[m.matchId] = m; });

// Statistici reconciliere scoruri
let scoresFromMatches = 0, scoresFromFRF = 0, scoresTotal = 0;

// Agregă per jucător
const byPlayer = {};
ms.forEach(m => {
  const key = m.firstName.trim().toLowerCase() + '|' + m.lastName.trim().toLowerCase();
  if (!byPlayer[key]) {
    byPlayer[key] = {
      f: m.firstName.trim(),
      l: m.lastName.trim(),
      ph: null,
      tm: 0, // total meciuri
      ti: 0, // titular
      re: 0, // rezervă
      cp: 0, // căpitan
      ps: new Set(), // poziții
      co: new Set(), // competiții
      cl: new Set(), // cluburi
      w: 0, d: 0, ls: 0, // wins/draws/losses
      mt: [], // meciuri [{d, co, cs, cn, o, s, r, p, ic}]
    };
  }
  const p = byPlayer[key];
  p.tm++;
  if (m.role === 'titular') p.ti++;
  if (m.role === 'rezervă') p.re++;
  if (m.isCaptain) p.cp++;
  const cleanPos = cleanPosition(m.position);
  if (cleanPos) p.ps.add(cleanPos);
  p.co.add(m.competitionName);
  p.cl.add(m.clubName);
  if (m.photo && m.photo !== 'null' && m.photo.startsWith('http') && !p.ph) {
    p.ph = m.photo;
  }

  // Detalii meci — format compact array [data, competiție, rol, poziție, căpitan, opponent, oppId, scor, rezultat]
  const match = matchMap[m.matchId];
  const opp = match ? (m.clubSide === 'home' ? match.awayClubName : match.homeClubName) : '';
  const oppId = match ? (m.clubSide === 'home' ? match.awayClubId : match.homeClubId) : '';

  // Scor: încearcă matches.json, apoi scores.json (GetFRFMatches)
  let homeGoals = match ? match.homeGoals : null;
  let awayGoals = match ? match.awayGoals : null;
  if ((homeGoals === null || awayGoals === null) && match) {
    const frfScore = findScore(match.date, match.homeClubName, match.awayClubName);
    if (frfScore) {
      homeGoals = frfScore.homeGoals;
      awayGoals = frfScore.awayGoals;
      scoresFromFRF++;
    }
  } else if (homeGoals !== null) {
    scoresFromMatches++;
  }

  const score = homeGoals !== null ? `${homeGoals}-${awayGoals}` : '';
  let result = '';
  if (homeGoals !== null && awayGoals !== null) {
    scoresTotal++;
    const isHome = m.clubSide === 'home';
    const my = isHome ? homeGoals : awayGoals;
    const op = isHome ? awayGoals : homeGoals;
    if (my > op) { p.w++; result = 'W'; }
    else if (my < op) { p.ls++; result = 'L'; }
    else { p.d++; result = 'D'; }
  }

  p.mt.push([m.date, m.competitionName, m.role, cleanPos || '', m.isCaptain ? 1 : 0, opp, oppId, score, result]);
});

// Convert Sets to arrays — cu TOATE meciurile din 2026 incluse
const playerStats = Object.values(byPlayer).map(p => {
  // Sortează descrescător și păstrează doar meciurile din 2026
  const sortedMt = p.mt
    .filter(m => m[0].startsWith('2026'))
    .sort((a, b) => b[0].localeCompare(a[0]));
  return {
    f: p.f,
    l: p.l,
    ph: p.ph,
    tm: p.tm,
    ti: p.ti,
    re: p.re,
    cp: p.cp,
    ps: [...p.ps],
    co: [...p.co],
    cl: [...p.cl],
    w: p.w, dw: p.d, ls: p.ls,
    mt: sortedMt,
  };
});
fs.writeFileSync(path.join(dataDir, 'player_stats.json'), JSON.stringify(playerStats));
console.log('player_stats.json:', (fs.statSync(path.join(dataDir, 'player_stats.json')).size / 1024 / 1024).toFixed(1) + 'MB', playerStats.length, 'jucători');
console.log('Scoruri: din matches.json:', scoresFromMatches, '| din scores.json (FRF):', scoresFromFRF, '| total cu scor:', scoresTotal);

// 3. clubs_slim.json — doar cluburi cu juniori
const clubs = JSON.parse(fs.readFileSync(path.join(dataDir, 'clubs.json'), 'utf8'));
const juniorClubIds = new Set(enriched.map(p => p.clubId));
const slimClubs = clubs
  .filter(c => juniorClubIds.has(c.clubId))
  .map(c => ({
    id: c.clubId,
    n: c.name,
    a: c.abbreviation,
    la: c.lat,
    lo: c.lon,
    co: c.address?.county || '',
    ci: c.address?.city || '',
  }));
fs.writeFileSync(path.join(dataDir, 'clubs_slim.json'), JSON.stringify(slimClubs));
console.log('clubs_slim.json:', (fs.statSync(path.join(dataDir, 'clubs_slim.json')).size / 1024 / 1024).toFixed(1) + 'MB', slimClubs.length, 'cluburi');

// 4. matches.json e deja 0.8MB — ok
console.log('matches.json:', (fs.statSync(path.join(dataDir, 'matches.json')).size / 1024 / 1024).toFixed(1) + 'MB');

// Total
const total = ['players_list.json', 'player_stats.json', 'clubs_slim.json', 'matches.json']
  .reduce((s, f) => s + fs.statSync(path.join(dataDir, f)).size, 0);
console.log('\nTotal slim:', (total / 1024 / 1024).toFixed(1) + 'MB');
