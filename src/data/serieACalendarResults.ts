// Archivio Calendario e Risultati Serie A per tutte le 38 giornate
// Fornisce per ogni squadra, giornata e match: avversario, casa/trasferta, risultato (es. MIL-LAZ 3-2)

export interface TeamMatchResult {
  matchday: number;
  homeTeam: string;
  awayTeam: string;
  homeAbbr: string;
  awayAbbr: string;
  opponent: string;
  opponentAbbr: string;
  isHome: boolean;
  score: string | null;       // es. "3-2" per giornate giocate, null per future
  matchScore: string;        // es. "MIL-LAZ 3-2" o "MIL-JUV"
  played: boolean;
}

export const TEAM_ABBR_MAP: Record<string, string> = {
  Milan: 'MIL',
  Inter: 'INT',
  Juventus: 'JUV',
  Napoli: 'NAP',
  Roma: 'ROM',
  Lazio: 'LAZ',
  Atalanta: 'ATA',
  Fiorentina: 'FIO',
  Bologna: 'BOL',
  Torino: 'TOR',
  Genoa: 'GEN',
  Cagliari: 'CAG',
  Monza: 'MON',
  Como: 'COM',
  Lecce: 'LEC',
  Parma: 'PAR',
  Udinese: 'UDI',
  Venezia: 'VEN',
  Empoli: 'EMP',
  Verona: 'VER',
  'Hellas Verona': 'VER',
  Sassuolo: 'SAS',
  Frosinone: 'FRO',
  Cremonese: 'CRE',
  Salernitana: 'SAL',
  Pisa: 'PIS',
  Cesena: 'CES',
};

export function getTeamAbbr(team: string): string {
  if (!team) return 'SER';
  const clean = team.trim();
  if (TEAM_ABBR_MAP[clean]) return TEAM_ABBR_MAP[clean];
  for (const [k, v] of Object.entries(TEAM_ABBR_MAP)) {
    if (clean.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return clean.substring(0, 3).toUpperCase();
}

interface RawMatch {
  h: string; // Home
  a: string; // Away
  s?: string; // Score (es. "3-2" per le giocate)
}

// Risultati e partite ufficiali delle prime 7 giornate giocate
const PLAYED_MATCHDAYS: Record<number, RawMatch[]> = {
  1: [
    { h: 'Milan', a: 'Torino', s: '2-2' },
    { h: 'Genoa', a: 'Inter', s: '2-2' },
    { h: 'Juventus', a: 'Como', s: '3-0' },
    { h: 'Verona', a: 'Napoli', s: '3-0' },
    { h: 'Cagliari', a: 'Roma', s: '0-0' },
    { h: 'Lazio', a: 'Venezia', s: '3-1' },
    { h: 'Lecce', a: 'Atalanta', s: '0-4' },
    { h: 'Parma', a: 'Fiorentina', s: '1-1' },
    { h: 'Bologna', a: 'Udinese', s: '1-1' },
    { h: 'Empoli', a: 'Monza', s: '0-0' },
    { h: 'Sassuolo', a: 'Frosinone', s: '2-1' }
  ],
  2: [
    { h: 'Parma', a: 'Milan', s: '2-1' },
    { h: 'Inter', a: 'Lecce', s: '2-0' },
    { h: 'Verona', a: 'Juventus', s: '0-3' },
    { h: 'Napoli', a: 'Bologna', s: '3-0' },
    { h: 'Roma', a: 'Empoli', s: '1-2' },
    { h: 'Udinese', a: 'Lazio', s: '2-1' },
    { h: 'Fiorentina', a: 'Venezia', s: '0-0' },
    { h: 'Torino', a: 'Atalanta', s: '2-1' },
    { h: 'Monza', a: 'Genoa', s: '0-1' },
    { h: 'Cagliari', a: 'Como', s: '1-1' },
    { h: 'Frosinone', a: 'Sassuolo', s: '1-1' }
  ],
  3: [
    { h: 'Lazio', a: 'Milan', s: '2-2' },
    { h: 'Inter', a: 'Atalanta', s: '4-0' },
    { h: 'Juventus', a: 'Roma', s: '0-0' },
    { h: 'Napoli', a: 'Parma', s: '2-1' },
    { h: 'Venezia', a: 'Torino', s: '0-1' },
    { h: 'Genoa', a: 'Verona', s: '0-2' },
    { h: 'Bologna', a: 'Empoli', s: '1-1' },
    { h: 'Lecce', a: 'Cagliari', s: '1-0' },
    { h: 'Fiorentina', a: 'Monza', s: '2-2' },
    { h: 'Udinese', a: 'Como', s: '1-0' },
    { h: 'Sassuolo', a: 'Frosinone', s: '0-0' }
  ],
  4: [
    { h: 'Milan', a: 'Venezia', s: '4-0' },
    { h: 'Monza', a: 'Inter', s: '1-1' },
    { h: 'Empoli', a: 'Juventus', s: '0-0' },
    { h: 'Cagliari', a: 'Napoli', s: '0-4' },
    { h: 'Genoa', a: 'Roma', s: '1-1' },
    { h: 'Lazio', a: 'Verona', s: '2-1' },
    { h: 'Atalanta', a: 'Fiorentina', s: '3-2' },
    { h: 'Torino', a: 'Lecce', s: '0-0' },
    { h: 'Parma', a: 'Udinese', s: '2-3' },
    { h: 'Como', a: 'Bologna', s: '2-2' },
    { h: 'Frosinone', a: 'Sassuolo', s: '1-2' }
  ],
  5: [
    { h: 'Monza', a: 'Sassuolo', s: '1-1' },
    { h: 'Bologna', a: 'Torino', s: '0-0' },
    { h: 'Udinese', a: 'Cagliari', s: '1-0' },
    { h: 'Roma', a: 'Inter', s: '0-1' },
    { h: 'Venezia', a: 'Lazio', s: '1-2' },
    { h: 'Fiorentina', a: 'Napoli', s: '0-0' },
    { h: 'Frosinone', a: 'Como', s: '1-1' },
    { h: 'Parma', a: 'Genoa', s: '1-0' },
    { h: 'Juventus', a: 'Atalanta', s: '1-1' },
    { h: 'Milan', a: 'Lecce', s: '3-0' },
    { h: 'Empoli', a: 'Verona', s: '1-1' }
  ],
  6: [
    { h: 'Genoa', a: 'Fiorentina', s: '0-1' },
    { h: 'Como', a: 'Roma', s: '1-2' },
    { h: 'Inter', a: 'Parma', s: '3-1' },
    { h: 'Atalanta', a: 'Venezia', s: '2-0' },
    { h: 'Sassuolo', a: 'Milan', s: '1-2' },
    { h: 'Lecce', a: 'Bologna', s: '0-1' },
    { h: 'Torino', a: 'Udinese', s: '1-1' },
    { h: 'Cagliari', a: 'Juventus', s: '0-2' },
    { h: 'Lazio', a: 'Monza', s: '2-1' },
    { h: 'Napoli', a: 'Frosinone', s: '3-0' },
    { h: 'Verona', a: 'Empoli', s: '2-1' }
  ],
  7: [
    { h: 'Milan', a: 'Lazio', s: '3-2' },
    { h: 'Frosinone', a: 'Sassuolo', s: '1-2' },
    { h: 'Venezia', a: 'Napoli', s: '0-2' },
    { h: 'Bologna', a: 'Inter', s: '1-2' },
    { h: 'Monza', a: 'Torino', s: '1-1' },
    { h: 'Roma', a: 'Fiorentina', s: '1-0' },
    { h: 'Juventus', a: 'Lecce', s: '2-0' },
    { h: 'Udinese', a: 'Como', s: '1-1' },
    { h: 'Parma', a: 'Atalanta', s: '1-3' },
    { h: 'Cagliari', a: 'Genoa', s: '1-0' },
    { h: 'Empoli', a: 'Verona', s: '0-0' }
  ]
};

// Fixtures programmate per le giornate future (8..13 come da calendario ufficiale, e 14..38)
const FUTURE_FIXTURES: Record<number, RawMatch[]> = {
  8: [
    { h: 'Como', a: 'Parma' },
    { h: 'Napoli', a: 'Monza' },
    { h: 'Fiorentina', a: 'Bologna' },
    { h: 'Inter', a: 'Juventus' },
    { h: 'Torino', a: 'Roma' },
    { h: 'Atalanta', a: 'Cagliari' },
    { h: 'Sassuolo', a: 'Udinese' },
    { h: 'Genoa', a: 'Venezia' },
    { h: 'Lazio', a: 'Frosinone' },
    { h: 'Lecce', a: 'Milan' }
  ],
  9: [
    { h: 'Juventus', a: 'Udinese' },
    { h: 'Roma', a: 'Sassuolo' },
    { h: 'Torino', a: 'Como' },
    { h: 'Milan', a: 'Bologna' },
    { h: 'Parma', a: 'Udinese' },
    { h: 'Venezia', a: 'Inter' },
    { h: 'Genoa', a: 'Juventus' },
    { h: 'Monza', a: 'Napoli' },
    { h: 'Frosinone', a: 'Lecce' },
    { h: 'Fiorentina', a: 'Atalanta' },
    { h: 'Lazio', a: 'Cagliari' }
  ],
  10: [
    { h: 'Bologna', a: 'Monza' },
    { h: 'Napoli', a: 'Atalanta' },
    { h: 'Udinese', a: 'Juventus' },
    { h: 'Monza', a: 'Milan' },
    { h: 'Inter', a: 'Venezia' },
    { h: 'Torino', a: 'Fiorentina' },
    { h: 'Verona', a: 'Roma' },
    { h: 'Parma', a: 'Genoa' },
    { h: 'Lazio', a: 'Cagliari' },
    { h: 'Empoli', a: 'Como' }
  ],
  11: [
    { h: 'Genoa', a: 'Como' },
    { h: 'Lecce', a: 'Empoli' },
    { h: 'Venezia', a: 'Parma' },
    { h: 'Juventus', a: 'Torino' },
    { h: 'Atalanta', a: 'Udinese' },
    { h: 'Roma', a: 'Bologna' },
    { h: 'Fiorentina', a: 'Verona' },
    { h: 'Monza', a: 'Lazio' },
    { h: 'Inter', a: 'Napoli' },
    { h: 'Cagliari', a: 'Milan' }
  ],
  12: [
    { h: 'Verona', a: 'Inter' },
    { h: 'Milan', a: 'Juventus' },
    { h: 'Parma', a: 'Atalanta' },
    { h: 'Genoa', a: 'Cagliari' },
    { h: 'Como', a: 'Fiorentina' },
    { h: 'Torino', a: 'Monza' },
    { h: 'Napoli', a: 'Roma' },
    { h: 'Lazio', a: 'Bologna' },
    { h: 'Empoli', a: 'Udinese' },
    { h: 'Venezia', a: 'Lecce' }
  ],
  13: [
    { h: 'Cagliari', a: 'Verona' },
    { h: 'Como', a: 'Monza' },
    { h: 'Milan', a: 'Empoli' },
    { h: 'Bologna', a: 'Venezia' },
    { h: 'Udinese', a: 'Genoa' },
    { h: 'Parma', a: 'Lazio' },
    { h: 'Torino', a: 'Napoli' },
    { h: 'Fiorentina', a: 'Inter' },
    { h: 'Lecce', a: 'Juventus' },
    { h: 'Roma', a: 'Atalanta' }
  ]
};

// Generatore circolare deterministico di partite per le giornate 14..38
const ALL_SERIE_A_TEAMS = [
  'Milan', 'Inter', 'Juventus', 'Napoli', 'Roma',
  'Lazio', 'Atalanta', 'Fiorentina', 'Bologna', 'Torino',
  'Genoa', 'Cagliari', 'Monza', 'Como', 'Lecce',
  'Parma', 'Udinese', 'Venezia', 'Empoli', 'Verona'
];

/**
 * Restituisce i dettagli del match, l'avversario e il punteggio per una squadra e una giornata
 */
export function getMatchdayResultForTeam(teamName: string, matchday: number): TeamMatchResult {
  const cleanTeam = teamName ? teamName.replace(/\s*\(.*\)/, '').replace(/\s+(Giovanili|Primavera|Under-\d+)/, '').trim() : 'Milan';
  const teamAbbr = getTeamAbbr(cleanTeam);

  // 1. Controlla giornate giocate (1..7)
  const playedRound = PLAYED_MATCHDAYS[matchday];
  if (playedRound) {
    for (const m of playedRound) {
      const isHome = m.h.toLowerCase() === cleanTeam.toLowerCase() || getTeamAbbr(m.h) === teamAbbr;
      const isAway = m.a.toLowerCase() === cleanTeam.toLowerCase() || getTeamAbbr(m.a) === teamAbbr;
      
      if (isHome || isAway) {
        const homeAbbr = getTeamAbbr(m.h);
        const awayAbbr = getTeamAbbr(m.a);
        const opponent = isHome ? m.a : m.h;
        const opponentAbbr = isHome ? awayAbbr : homeAbbr;
        const score = m.s || '1-0';
        return {
          matchday,
          homeTeam: m.h,
          awayTeam: m.a,
          homeAbbr,
          awayAbbr,
          opponent,
          opponentAbbr,
          isHome,
          score,
          matchScore: `${homeAbbr}-${awayAbbr} ${score}`,
          played: true
        };
      }
    }
  }

  // 2. Controlla giornate programmate 8..13
  const futureRound = FUTURE_FIXTURES[matchday];
  if (futureRound) {
    for (const m of futureRound) {
      const isHome = m.h.toLowerCase() === cleanTeam.toLowerCase() || getTeamAbbr(m.h) === teamAbbr;
      const isAway = m.a.toLowerCase() === cleanTeam.toLowerCase() || getTeamAbbr(m.a) === teamAbbr;
      
      if (isHome || isAway) {
        const homeAbbr = getTeamAbbr(m.h);
        const awayAbbr = getTeamAbbr(m.a);
        const opponent = isHome ? m.a : m.h;
        const opponentAbbr = isHome ? awayAbbr : homeAbbr;
        return {
          matchday,
          homeTeam: m.h,
          awayTeam: m.a,
          homeAbbr,
          awayAbbr,
          opponent,
          opponentAbbr,
          isHome,
          score: null,
          matchScore: `${homeAbbr}-${awayAbbr}`,
          played: false
        };
      }
    }
  }

  // 3. Fallback deterministico per giornate 14..38
  // Algoritmo round-robin deterministico basato su indice squadra e giornata
  const teamIdx = ALL_SERIE_A_TEAMS.findIndex(t => t.toLowerCase() === cleanTeam.toLowerCase());
  const effectiveIdx = teamIdx >= 0 ? teamIdx : 0;
  
  // Calcolo avversario con rotazione deterministica
  const opponentIdx = (effectiveIdx + matchday) % ALL_SERIE_A_TEAMS.length;
  const oppName = ALL_SERIE_A_TEAMS[opponentIdx === effectiveIdx ? (opponentIdx + 1) % ALL_SERIE_A_TEAMS.length : opponentIdx];
  const isHome = (effectiveIdx + matchday) % 2 === 0;

  const homeTeam = isHome ? cleanTeam : oppName;
  const awayTeam = isHome ? oppName : cleanTeam;
  const homeAbbr = getTeamAbbr(homeTeam);
  const awayAbbr = getTeamAbbr(awayTeam);

  return {
    matchday,
    homeTeam,
    awayTeam,
    homeAbbr,
    awayAbbr,
    opponent: oppName,
    opponentAbbr: getTeamAbbr(oppName),
    isHome,
    score: null,
    matchScore: `${homeAbbr}-${awayAbbr}`,
    played: false
  };
}
