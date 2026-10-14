const fs = require('fs');
const path = require('path');

const officialFile = fs.readFileSync(path.join(__dirname, '../src/data/officialPlayers.ts'), 'utf8');
const start = officialFile.indexOf('= [') + 2;
const end = officialFile.lastIndexOf(']');
const jsonText = officialFile.substring(start, end + 1);
const players = JSON.parse(jsonText);

const csvData = `Scarsenal,costo,,ABIDJAN,costo,,Gallosballo,costo,,Brancamenta,costo,,Al-Meja,costo,,AC Arbora,costo,,SanZeno,costo,,LONGOBARDA,costo
Svilar,22,,Butez,16,,De Gea,6,,Meret,19,,Maignan,18,,Vicario,19,,Martinez Jo.,25,,Carnesecchi,15
Mandas,15,,Bijlow,1,,Christensen O.,1,,Corvi,2,,Torriani,1,,Caprile,8,,Okoye,9,,Falcone,5
Stankovic F.,1,,Muric,1,,Lezzerini,1,,Perri,1,,Terracciano,1,,Skorupski,1,,Palmisani,2,,Sportiello,1
Solet,8,,Dimarco,30,,Valle,8,,Rrahmani,5,,Bellanova,4,,Bremer,23,,Bisseck,11,,Kalulu,10
Celik,7,,Molina N.,14,,Bastoni,7,,N'Dicka,5,,Diego Carlos,2,,Wesley,19,,Akanji,8,,Pavlovic,5
Gila,4,,Carlos Augusto,9,,Tiago Gabriel,5,,Kristensen T.,4,,Spinazzola,2,,Ramon,8,,Cambiaso,6,,Di Lorenzo,5
Ostigard,4,,Chalobah T.,9,,Hainaut,3,,Comuzzo,3,,Sutalo J.,1,,Hermoso,6,,Kempf,1,,Delprato,3
Tavares N.,3,,Couto,7,,Kaiki,1,,Zortea,3,,Viery,1,,Mancini,6,,Doekhi,1,,Vasquez,3
Zappacosta,2,,Joao Mario,1,,Zè Pedro,1,,Marusic,2,,Marcandalli,1,,Miranda J.,3,,Lucumì,1,,Gatti,2
Mangas,1,,De Winter,1,,Abankwah,1,,Bartesaghi,1,,Doig,1,,Spence,1,,Dodò,1,,Bernasconi,1
Jimenez A.,1,,Mina,1,,Kamara H.,1,,Beukema,1,,Birindelli,1,,Valeri,1,,Balerdi,1,,Ranieri L.,1
Da Cunha,23,,Frattesi,40,,Rabiot,18,,Baturina,27,,Paz N.,43,,Conceicao,11,,Calhanoglu,35,,Ederson D.S.,10
McMcKEnnie,6,,De Bruyne,26,,Vlasic,16,,Zaccagni,25,,Pulisic,36,,Konè M.,7,,McTominay,34,,Kessiè,6
Atta,4,,Mastantuono,20,,Adzic,8,,Orsolini,18,,Gonzalez N.,12,,Alajbegovic,4,,Ekkelenkamp,9,,Politano,3
Sucic P.,3,,Barella,16,,Gudmundsson A.,7,,Zaniolo,7,,Zielinski,7,,Goncalves P.,1,,Cambiaghi,5,,Cristante,2
Schmid,1,,Cissè A.,6,,Diouf,5,,Bernardeschi,3,,Taylor K.,1,,Mora,1,,Casadei,1,,Perrone,1
Njie,1,,Fitz-Jim,1,,Jones C.,4,,Cacciamani,1,,Keita M.,1,,Romano,1,,Ferguson,1,,Koopmeiners,1
Isaksen,1,,Chukwueze,1,,Mandragora,2,,Fagioli,1,,Rowe,1,,Vergara,1,,Elmas,1,,Lobotka,1
Baldanzi,1,,El Shaarawy,1,,Milla,1,,Modric,1,,Moreira,1,,Samardzic,1,,Gaetano,1,,Mkhitaryan,1
Thuram,133,,Dybala,40,,Douvikas,50,,Martinez L.,140,,Kolo Muani,41,,De Ketelaere,80,,Ramos G.,88,,Malen,133
Hojlund,59,,Esposito F.P.,30,,Yildiz,45,,Berardi,23,,Soulè,20,,Scamacca,24,,Laurientè,15,,Kean,45
Noslin,3,,Piccoli,6,,Davis K.,24,,Tourè E.,3,,Maldini,18,,Pellegrino M.,12,,Pinamonti,9,,Krstovic,30
Colombo,2,,Raimondo,5,,Esposito Se.,10,,Vitinha O.,3,,Varela G.,4,,Woltemade,11,,Castro S.,3,,Beto,5
Adams A.,1,,Camarda,1,,Simeone,6,,Yeboah J.,1,,Osmajic,2,,Diao,8,,Neres,1,,Raspadori,5
Santos A.,1,,Kvernadze,1,,Adams C.,3,,Zapata D.,1,,Romero D.,1,,Boga,5,,Bonny,1,,Cutrone,1
totale,307,,totale,284,,totale,234,,totale,300,,totale,221,,totale,262,,totale,270,,totale,295`.replace('McMcKEnnie', 'McKennie');

const lines = csvData.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);

const teamCols = [
  { colName: 0, colCost: 1, name: 'Scarsenal', id: 'team-1', color: '#ef4444' },
  { colName: 3, colCost: 4, name: 'ABIDJAN', id: 'team-2', color: '#3b82f6' },
  { colName: 6, colCost: 7, name: 'Gallosballo', id: 'team-3', color: '#eab308' },
  { colName: 9, colCost: 10, name: 'Brancamenta', id: 'team-4', color: '#f59e0b' },
  { colName: 12, colCost: 13, name: 'Al-Meja', id: 'team-8', color: '#84cc16' },
  { colName: 15, colCost: 16, name: 'AC Arbora', id: 'team-6', color: '#ec4899' },
  { colName: 18, colCost: 19, name: 'SanZeno', id: 'team-7', color: '#8b5cf6' },
  { colName: 21, colCost: 22, name: 'LONGOBARDA', id: 'team-5', color: '#06b6d4' },
];

function cleanName(n) {
  return n.toLowerCase()
    .replace(/[àá]/g, 'a')
    .replace(/[èé]/g, 'e')
    .replace(/[ìí]/g, 'i')
    .replace(/[òó]/g, 'o')
    .replace(/[ùú]/g, 'u')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

const cleanMap = new Map();
players.forEach(p => {
  const c = cleanName(p.nome);
  if (!cleanMap.has(c)) cleanMap.set(c, []);
  cleanMap.get(c).push(p);
});

const ALIASES = {
  'martinez jo': 'MARTINEZ JO.',
  'martinez j': 'MARTINEZ JO.',
  'martinez l': 'LAUTARO',
  'dimarco': 'DIMARCO',
  'esposito fp': 'ESPOSITO F.P.',
  'esposito se': 'ESPOSITO SE.',
  'adams a': 'ADAMS A.',
  'adams c': 'ADAMS C.',
  'ederson ds': 'EDERSON D.S.',
  'sutalo j': 'SUTALO J.',
  'tiago gabriel': 'TIAGO GABRIEL',
  'diego carlos': 'DIEGO CARLOS',
  'molina n': 'MOLINA N.',
  'chalobah t': 'CHALOBAH T.',
  'kristensen t': 'KRISTENSEN T.',
  'carlos augusto': 'CARLOS AUGUSTO',
  'de bruyne': 'DE BRUYNE',
  'da cunha': 'DA CUNHA',
  'paz n': 'PAZ N.',
  'gonzalez n': 'GONZALEZ N.',
  'gudmundsson a': 'GUDMUNDSSON A.',
  'kone m': 'KONE M.',
  'cisse a': 'CISSE A.',
  'fitzjim': 'FITZ-JIM',
  'jones c': 'JONES C.',
  'keita m': 'KEITA M.',
  'taylor k': 'TAYLOR K.',
  'el shaarawy': 'EL SHAARAWY',
  'kolo muani': 'KOLO MUANI',
  'de ketelaere': 'DE KETELAERE',
  'ramos g': 'RAMOS G.',
  'vitinha o': 'VITINHA O.',
  'varela g': 'VARELA G.',
  'yeboah j': 'YEBOAH J.',
  'romero d': 'ROMERO D.',
  'davis k': 'DAVIS K.',
  'toure e': 'TOURE E.',
  'pellegrino m': 'PELLEGRINO M.',
  'sucic p': 'SUCIC P.',
  'tavares n': 'TAVARES N.',
  'stankovic f': 'STANKOVIC F.',
  'christensen o': 'CHRISTENSEN O.',
  'jimenez a': 'JIMENEZ A.',
  'kamara h': 'KAMARA H.',
  'miranda j': 'MIRANDA J.',
  'ranieri l': 'RANIERI L.',
  'goncalves p': 'GONCALVES P.',
  'castro s': 'CASTRO S.',
  'santos a': 'SANTOS A.'
};

function findPlayer(rawName, expectedRole) {
  const cRaw = cleanName(rawName);

  if (ALIASES[cRaw]) {
    const aliasClean = cleanName(ALIASES[cRaw]);
    if (cleanMap.has(aliasClean)) {
      const list = cleanMap.get(aliasClean);
      const roleMatch = list.find(p => p.ruolo === expectedRole);
      if (roleMatch) return roleMatch;
      return list[0];
    }
  }

  if (cleanMap.has(cRaw)) {
    const list = cleanMap.get(cRaw);
    if (list.length === 1) return list[0];
    const roleMatch = list.find(p => p.ruolo === expectedRole);
    if (roleMatch) return roleMatch;
    return list[0];
  }

  const candidates = players.filter(p => {
    if (p.ruolo !== expectedRole) return false;
    const cOfficial = cleanName(p.nome);
    if (cOfficial === cRaw) return true;
    if (cOfficial.startsWith(cRaw) || cRaw.startsWith(cOfficial)) return true;
    const officialSurname = cleanName(p.nome.split(' ')[0]);
    const rawSurname = cleanName(rawName.split(' ')[0]);
    if (officialSurname === rawSurname && officialSurname.length >= 3) return true;
    return false;
  });

  if (candidates.length === 1) return candidates[0];

  if (candidates.length > 1) {
    const exactSurname = candidates.filter(p => cleanName(p.nome.split(' ')[0]) === cleanName(rawName.split(' ')[0]));
    if (exactSurname.length === 1) return exactSurname[0];
    return candidates[0];
  }

  const fallback = players.filter(p => {
    const cOfficial = cleanName(p.nome);
    return cOfficial.includes(cRaw) || cRaw.includes(cOfficial);
  });
  if (fallback.length === 1) return fallback[0];

  return null;
}

const playerRows = lines.slice(1, 26);
const teamsResult = {};

teamCols.forEach(t => {
  teamsResult[t.id] = {
    id: t.id,
    name: t.name,
    color: t.color,
    currentBudget: 0,
    players: [],
    totalCost: 0
  };
});

playerRows.forEach((line, rowIdx) => {
  const parts = line.split(',');
  let expectedRole = 'P';
  if (rowIdx >= 3 && rowIdx < 11) expectedRole = 'D';
  else if (rowIdx >= 11 && rowIdx < 19) expectedRole = 'C';
  else if (rowIdx >= 19) expectedRole = 'A';

  teamCols.forEach(t => {
    const rawName = (parts[t.colName] || '').trim();
    const rawCost = parseInt((parts[t.colCost] || '0').trim(), 10);
    const matched = findPlayer(rawName, expectedRole);

    if (!matched) {
      throw new Error(`Calciatore non trovato: ${rawName} (${expectedRole})`);
    }

    const assignment = {
      playerId: matched.id,
      nome: matched.nome,
      ruolo: matched.ruolo,
      squadra: matched.squadra,
      price: rawCost,
      fvm: matched.fvm,
      mv: matched.mv !== undefined ? matched.mv : null,
      fm: matched.fm !== undefined ? matched.fm : null
    };

    teamsResult[t.id].players.push(assignment);
    teamsResult[t.id].totalCost += rawCost;
  });
});

// Calcola currentBudget (300 - totalCost)
teamCols.forEach(t => {
  const tr = teamsResult[t.id];
  tr.currentBudget = Math.max(0, 300 - tr.totalCost);
  delete tr.totalCost;
});

// Ordine canonico delle squadre: team-1 .. team-8
const orderedTeams = [
  teamsResult['team-1'],
  teamsResult['team-2'],
  teamsResult['team-3'],
  teamsResult['team-4'],
  teamsResult['team-5'],
  teamsResult['team-6'],
  teamsResult['team-7'],
  teamsResult['team-8']
];

const initialEmptyTeams = orderedTeams.map(t => ({
  id: t.id,
  name: t.name,
  color: t.color,
  currentBudget: 300,
  players: []
}));

// Genera codice TypeScript
let tsCode = `import { Team } from '../types';

export const INITIAL_EMPTY_TEAMS: Team[] = ${JSON.stringify(initialEmptyTeams, null, 2)};

export const SIMULATED_TEAMS: Team[] = ${JSON.stringify(orderedTeams, null, 2)};

export const DEFAULT_TEAMS: Team[] = SIMULATED_TEAMS;
`;

const targetPath = path.join(__dirname, '../src/data/defaultPlayers.ts');
fs.writeFileSync(targetPath, tsCode, 'utf8');
console.log(`Aggiornato ${targetPath} con successo!`);
console.log(`8 squadre aggiornate, 25 giocatori ciascuna.`);
