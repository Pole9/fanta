const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const readStats = (filePath) => {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets['Tutti'];
  return XLSX.utils.sheet_to_json(ws, { range: 1 });
};

const listoneWb = XLSX.readFile('./DatiFanta/listone.xlsx');
const listoneRaw = XLSX.utils.sheet_to_json(listoneWb.Sheets['Tutti']);

const s2526Raw = readStats('./DatiFanta/Statistiche_Fantacalcio_Stagione_2025_26.xlsx');
const s2425Raw = readStats('./DatiFanta/Statistiche_Fantacalcio_Stagione_2024_25.xlsx');
const s2324Raw = readStats('./DatiFanta/Statistiche_Fantacalcio_Stagione_2023_24.xlsx');

const map2526 = new Map(s2526Raw.map(p => [Number(p.Id), p]));
const map2425 = new Map(s2425Raw.map(p => [Number(p.Id), p]));
const map2324 = new Map(s2324Raw.map(p => [Number(p.Id), p]));

const formatSeason = (seasonLabel, raw) => {
  if (!raw) return null;
  return {
    season: seasonLabel,
    pg: Number(raw.Pv) || 0,
    mv: raw.Mv ? parseFloat(String(raw.Mv).replace(',', '.')) : 0,
    fm: raw.Fm ? parseFloat(String(raw.Fm).replace(',', '.')) : 0,
    gf: Number(raw.Gf) || 0,
    gs: Number(raw.Gs) || 0,
    rp: Number(raw.Rp) || 0,
    rc: Number(raw.Rc) || 0,
    rSegnati: Number(raw['R+']) || 0,
    rSbagliati: Number(raw['R-']) || 0,
    assist: Number(raw.Ass) || 0,
    amm: Number(raw.Amm) || 0,
    esp: Number(raw.Esp) || 0,
    au: Number(raw.Au) || 0
  };
};

const players = listoneRaw.map(p => {
  const id = Number(p.Id);
  const rawRole = String(p.R || '').trim().toUpperCase();
  const role = rawRole === 'POR' || rawRole === 'P' ? 'P'
             : rawRole === 'D' ? 'D'
             : rawRole === 'A' || rawRole === 'PC' ? 'A' : 'C';

  const st25 = formatSeason('2025/26', map2526.get(id));
  const st24 = formatSeason('2024/25', map2425.get(id));
  const st23 = formatSeason('2023/24', map2324.get(id));

  // Determina la stagione più recente disponibile
  const latest = st25 || st24 || st23;

  // Calcola aggregato pluriennale
  const validSeasons = [st25, st24, st23].filter(Boolean);
  let threeYearMvAvg = 0;
  let threeYearFmAvg = 0;
  let totalGf = 0;
  let totalGs = 0;
  let totalAssist = 0;
  let totalPg = 0;

  if (validSeasons.length > 0) {
    const seasonsWithMv = validSeasons.filter(s => s.mv > 0);
    threeYearMvAvg = seasonsWithMv.length > 0
      ? Math.round((seasonsWithMv.reduce((a, b) => a + b.mv, 0) / seasonsWithMv.length) * 100) / 100
      : 0;

    const seasonsWithFm = validSeasons.filter(s => s.fm > 0);
    threeYearFmAvg = seasonsWithFm.length > 0
      ? Math.round((seasonsWithFm.reduce((a, b) => a + b.fm, 0) / seasonsWithFm.length) * 100) / 100
      : 0;

    totalGf = validSeasons.reduce((a, b) => a + b.gf, 0);
    totalGs = validSeasons.reduce((a, b) => a + b.gs, 0);
    totalAssist = validSeasons.reduce((a, b) => a + b.assist, 0);
    totalPg = validSeasons.reduce((a, b) => a + b.pg, 0);
  }

  // Modificatore di difesa: MV >= 6.0 nella stagione più recente o media triennale >= 6.0
  const isGoodForMod = role === 'D' && ((latest && latest.mv >= 6.0) || threeYearMvAvg >= 6.0);

  // Rigorista
  const isRigorista = (latest && latest.rc >= 2) || (validSeasons.some(s => s.rc >= 2));

  return {
    id,
    nome: String(p.Nome || '').trim().toUpperCase(),
    ruolo: role,
    squadra: String(p.Squadra || '').trim(),
    quotazione: Number(p['Qt.A']) || Number(p['Qt.I']) || 1,
    fvm: Number(p.FVM) || 1,
    pg: latest ? latest.pg : 0,
    mv: latest ? latest.mv : 0,
    fm: latest ? latest.fm : 0,
    gf: latest ? latest.gf : 0,
    gs: latest ? latest.gs : 0,
    rp: latest ? latest.rp : 0,
    rc: latest ? latest.rc : 0,
    rSegnati: latest ? latest.rSegnati : 0,
    rSbagliati: latest ? latest.rSbagliati : 0,
    assist: latest ? latest.assist : 0,
    amm: latest ? latest.amm : 0,
    esp: latest ? latest.esp : 0,
    rigorista: isRigorista,
    consigliatoModificatore: isGoodForMod,
    status: 'available',
    seasons: {
      '2025/26': st25,
      '2024/25': st24,
      '2023/24': st23
    },
    threeYearAvg: {
      mv: threeYearMvAvg,
      fm: threeYearFmAvg,
      totalGf,
      totalGs,
      totalAssist,
      totalPg,
      seasonsCount: validSeasons.length
    }
  };
});

const fileContent = `import { Player } from '../types';

export const OFFICIAL_PLAYERS: Player[] = ${JSON.stringify(players, null, 2)};
`;

fs.writeFileSync('./src/data/officialPlayers.ts', fileContent, 'utf-8');
console.log('Successfully generated src/data/officialPlayers.ts with', players.length, 'players.');
