// Database Turno di Serie A, Probabili Formazioni Gazzetta dello Sport e Consigli Fantagazzetta/Fantacalcio.it
import { INJURY_DATABASE, getInjuryInfo, SERIE_A_SHARED_SURNAMES } from './injuryData';
import { getTatticoAdvice } from './tatticoData';

export interface SerieAMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  stadium: string;
  homeDifficulty: number; // 1 (molto facile) a 5 (proibitiva)
  awayDifficulty: number;
}

export interface GazzettaPlayerStatus {
  titolaritaPercent: number; // es. 95 (titolare fisso), 60 (ballottaggio), 20 (panchina)
  status: 'titolare' | 'ballottaggio' | 'panchina' | 'infortunato' | 'squalificato';
  ballottaggioCon?: string;
  rigorista?: boolean;
  piazzati?: boolean;
  noteGazzetta: string;
}

export interface FantagazzettaRating {
  stars: 1 | 2 | 3 | 4 | 5; // Indice schierabilità redazione
  fascia: 'Top di Giornata' | 'Consigliato' | 'Scommessa' | 'Schierabile' | 'Rischioso' | 'Trappola da Evitare' | 'Sconsigliato';
  commentoRedazione: string;
}

export type MatchdayType = 'current' | 'previous' | 'next' | 'next1' | 'next2' | 'next3';

export interface PlayerMatchdayEvaluation {
  match: {
    opponent: string;
    isHome: boolean;
    difficulty: number;
    stadium?: string;
    date?: string;
    time?: string;
    matchdayNumber: number;
    matchdayTitle: string;
    description: string;
  } | null;
  matchdayType: MatchdayType;
  gazzetta: GazzettaPlayerStatus;
  fantagazzetta: FantagazzettaRating;
  tatticoAdvice: string | null;
  injury: {
    infortunio: string;
    rientroPrevisto: string;
    meseRientro: string;
  } | null;
}

export interface MatchdayScheduleRound {
  roundNumber: number;
  title: string;
  shortLabel: string;
  dateRangeLabel: string;
  cutoffIso: string; // ISO string rappresentante Lunedì ore 22:00:00 (es. 2026-10-12T22:00:00+02:00)
  fixtures: SerieAMatch[];
}

// 1. Calendario 5ª Giornata Serie A (2-5 Ottobre 2026 - Conclusa) - Fonte ufficiale Fantacalcio.it
export const ROUND_5_SERIE_A_FIXTURES: SerieAMatch[] = [
  {
    id: "m5-1",
    homeTeam: "Monza",
    awayTeam: "Sassuolo",
    date: "Domenica",
    time: "15:00",
    stadium: "U-Power Stadium (Monza)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m5-2",
    homeTeam: "Bologna",
    awayTeam: "Torino",
    date: "Domenica",
    time: "15:00",
    stadium: "Renato Dall'Ara (Bologna)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m5-3",
    homeTeam: "Udinese",
    awayTeam: "Cagliari",
    date: "Sabato",
    time: "15:00",
    stadium: "Bluenergy Stadium (Udine)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m5-4",
    homeTeam: "Roma",
    awayTeam: "Inter",
    date: "Domenica",
    time: "20:45",
    stadium: "Stadio Olimpico (Roma)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m5-5",
    homeTeam: "Venezia",
    awayTeam: "Lazio",
    date: "Sabato",
    time: "18:00",
    stadium: "Pier Luigi Penzo (Venezia)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m5-6",
    homeTeam: "Fiorentina",
    awayTeam: "Napoli",
    date: "Domenica",
    time: "18:00",
    stadium: "Artemio Franchi (Firenze)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m5-7",
    homeTeam: "Frosinone",
    awayTeam: "Como",
    date: "Venerdì",
    time: "20:45",
    stadium: "Benito Stirpe (Frosinone)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m5-8",
    homeTeam: "Parma",
    awayTeam: "Genoa",
    date: "Sabato",
    time: "20:45",
    stadium: "Ennio Tardini (Parma)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m5-9",
    homeTeam: "Juventus",
    awayTeam: "Atalanta",
    date: "Domenica",
    time: "18:00",
    stadium: "Allianz Stadium (Torino)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m5-10",
    homeTeam: "Milan",
    awayTeam: "Lecce",
    date: "Lunedì",
    time: "20:45",
    stadium: "San Siro (Milano)",
    homeDifficulty: 2,
    awayDifficulty: 4
  }
];

// 2. Calendario 6ª Giornata Serie A (9-12 Ottobre 2026 - IN CORSO ORA) - Fonte ufficiale Fantacalcio.it
export const ROUND_6_SERIE_A_FIXTURES: SerieAMatch[] = [
  {
    id: "m6-1",
    homeTeam: "Genoa",
    awayTeam: "Fiorentina",
    date: "Venerdì 9 Ottobre",
    time: "20:45",
    stadium: "Luigi Ferraris (Genova)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m6-2",
    homeTeam: "Como",
    awayTeam: "Roma",
    date: "Sabato 10 Ottobre",
    time: "15:00",
    stadium: "Giuseppe Sinigaglia (Como)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m6-3",
    homeTeam: "Inter",
    awayTeam: "Parma",
    date: "Sabato 10 Ottobre",
    time: "18:00",
    stadium: "San Siro (Milano)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m6-4",
    homeTeam: "Atalanta",
    awayTeam: "Venezia",
    date: "Sabato 10 Ottobre",
    time: "20:45",
    stadium: "Gewiss Stadium (Bergamo)",
    homeDifficulty: 1,
    awayDifficulty: 5
  },
  {
    id: "m6-5",
    homeTeam: "Sassuolo",
    awayTeam: "Milan",
    date: "Domenica 11 Ottobre",
    time: "12:30",
    stadium: "Mapei Stadium (Reggio Emilia)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m6-6",
    homeTeam: "Lecce",
    awayTeam: "Bologna",
    date: "Domenica 11 Ottobre",
    time: "15:00",
    stadium: "Via del Mare (Lecce)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m6-7",
    homeTeam: "Torino",
    awayTeam: "Udinese",
    date: "Domenica 11 Ottobre",
    time: "15:00",
    stadium: "Olimpico Grande Torino (Torino)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m6-8",
    homeTeam: "Cagliari",
    awayTeam: "Juventus",
    date: "Domenica 11 Ottobre",
    time: "18:00",
    stadium: "Unipol Domus (Cagliari)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m6-9",
    homeTeam: "Lazio",
    awayTeam: "Monza",
    date: "Domenica 11 Ottobre",
    time: "20:45",
    stadium: "Olimpico (Roma)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m6-10",
    homeTeam: "Napoli",
    awayTeam: "Frosinone",
    date: "Lunedì 12 Ottobre",
    time: "20:45",
    stadium: "Diego Armando Maradona (Napoli)",
    homeDifficulty: 1,
    awayDifficulty: 5
  }
];

// 3. Calendario 7ª Giornata Serie A (16-19 Ottobre 2026 - PROSSIMO TURNO) - Fonte ufficiale Fantacalcio.it
export const ROUND_7_SERIE_A_FIXTURES: SerieAMatch[] = [
  {
    id: "m7-1",
    homeTeam: "Frosinone",
    awayTeam: "Sassuolo",
    date: "Venerdì 16 Ottobre",
    time: "20:45",
    stadium: "Benito Stirpe (Frosinone)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m7-2",
    homeTeam: "Venezia",
    awayTeam: "Napoli",
    date: "Sabato 17 Ottobre",
    time: "15:00",
    stadium: "Pier Luigi Penzo (Venezia)",
    homeDifficulty: 5,
    awayDifficulty: 1
  },
  {
    id: "m7-3",
    homeTeam: "Bologna",
    awayTeam: "Inter",
    date: "Sabato 17 Ottobre",
    time: "18:00",
    stadium: "Renato Dall'Ara (Bologna)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m7-4",
    homeTeam: "Roma",
    awayTeam: "Genoa",
    date: "Sabato 17 Ottobre",
    time: "20:45",
    stadium: "Stadio Olimpico (Roma)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m7-5",
    homeTeam: "Udinese",
    awayTeam: "Lecce",
    date: "Domenica 18 Ottobre",
    time: "12:30",
    stadium: "Bluenergy Stadium (Udine)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m7-6",
    homeTeam: "Fiorentina",
    awayTeam: "Como",
    date: "Domenica 18 Ottobre",
    time: "15:00",
    stadium: "Artemio Franchi (Firenze)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m7-7",
    homeTeam: "Monza",
    awayTeam: "Cagliari",
    date: "Domenica 18 Ottobre",
    time: "15:00",
    stadium: "U-Power Stadium (Monza)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m7-8",
    homeTeam: "Parma",
    awayTeam: "Torino",
    date: "Domenica 18 Ottobre",
    time: "18:00",
    stadium: "Ennio Tardini (Parma)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m7-9",
    homeTeam: "Milan",
    awayTeam: "Atalanta",
    date: "Domenica 18 Ottobre",
    time: "20:45",
    stadium: "San Siro (Milano)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m7-10",
    homeTeam: "Juventus",
    awayTeam: "Lazio",
    date: "Lunedì 19 Ottobre",
    time: "20:45",
    stadium: "Allianz Stadium (Torino)",
    homeDifficulty: 3,
    awayDifficulty: 3
  }
];

// 4. Calendario 8ª Giornata Serie A (23-26 Ottobre 2026) - Fonte ufficiale Fantacalcio.it
export const ROUND_8_SERIE_A_FIXTURES: SerieAMatch[] = [
  {
    id: "m8-1",
    homeTeam: "Torino",
    awayTeam: "Monza",
    date: "Venerdì 23 Ottobre",
    time: "20:45",
    stadium: "Olimpico Grande Torino (Torino)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m8-2",
    homeTeam: "Cagliari",
    awayTeam: "Bologna",
    date: "Sabato 24 Ottobre",
    time: "15:00",
    stadium: "Unipol Domus (Cagliari)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m8-3",
    homeTeam: "Como",
    awayTeam: "Sassuolo",
    date: "Sabato 24 Ottobre",
    time: "18:00",
    stadium: "Giuseppe Sinigaglia (Como)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m8-4",
    homeTeam: "Genoa",
    awayTeam: "Venezia",
    date: "Sabato 24 Ottobre",
    time: "20:45",
    stadium: "Luigi Ferraris (Genova)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m8-5",
    homeTeam: "Atalanta",
    awayTeam: "Frosinone",
    date: "Domenica 25 Ottobre",
    time: "12:30",
    stadium: "Gewiss Stadium (Bergamo)",
    homeDifficulty: 1,
    awayDifficulty: 5
  },
  {
    id: "m8-6",
    homeTeam: "Lazio",
    awayTeam: "Parma",
    date: "Domenica 25 Ottobre",
    time: "15:00",
    stadium: "Olimpico (Roma)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m8-7",
    homeTeam: "Udinese",
    awayTeam: "Milan",
    date: "Domenica 25 Ottobre",
    time: "15:00",
    stadium: "Bluenergy Stadium (Udine)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m8-8",
    homeTeam: "Lecce",
    awayTeam: "Juventus",
    date: "Domenica 25 Ottobre",
    time: "18:00",
    stadium: "Via del Mare (Lecce)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m8-9",
    homeTeam: "Inter",
    awayTeam: "Fiorentina",
    date: "Domenica 25 Ottobre",
    time: "20:45",
    stadium: "San Siro (Milano)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m8-10",
    homeTeam: "Napoli",
    awayTeam: "Roma",
    date: "Lunedì 26 Ottobre",
    time: "20:45",
    stadium: "Diego Armando Maradona (Napoli)",
    homeDifficulty: 3,
    awayDifficulty: 3
  }
];



// Calendario 9ª Giornata Serie A - Fonte ufficiale Fantacalcio.it
export const ROUND_9_SERIE_A_FIXTURES: SerieAMatch[] = [
  {
    id: "m9-1",
    homeTeam: "Sassuolo",
    awayTeam: "Lazio",
    date: "Venerdì",
    time: "20:45",
    stadium: "Mapei Stadium (Reggio Emilia)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m9-2",
    homeTeam: "Roma",
    awayTeam: "Cagliari",
    date: "Sabato",
    time: "15:00",
    stadium: "Stadio Olimpico (Roma)",
    homeDifficulty: 1,
    awayDifficulty: 4
  },
  {
    id: "m9-3",
    homeTeam: "Torino",
    awayTeam: "Como",
    date: "Sabato",
    time: "18:00",
    stadium: "Olimpico Grande Torino (Torino)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m9-4",
    homeTeam: "Milan",
    awayTeam: "Bologna",
    date: "Sabato",
    time: "20:45",
    stadium: "San Siro (Milano)",
    homeDifficulty: 3,
    awayDifficulty: 5
  },
  {
    id: "m9-5",
    homeTeam: "Parma",
    awayTeam: "Udinese",
    date: "Domenica",
    time: "12:30",
    stadium: "Ennio Tardini (Parma)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m9-6",
    homeTeam: "Venezia",
    awayTeam: "Inter",
    date: "Domenica",
    time: "15:00",
    stadium: "Pier Luigi Penzo (Venezia)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m9-7",
    homeTeam: "Genoa",
    awayTeam: "Juventus",
    date: "Domenica",
    time: "15:00",
    stadium: "Luigi Ferraris (Genova)",
    homeDifficulty: 4,
    awayDifficulty: 3
  },
  {
    id: "m9-8",
    homeTeam: "Monza",
    awayTeam: "Napoli",
    date: "Domenica",
    time: "18:00",
    stadium: "U-Power Stadium (Monza)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m9-9",
    homeTeam: "Frosinone",
    awayTeam: "Lecce",
    date: "Domenica",
    time: "20:45",
    stadium: "Benito Stirpe (Frosinone)",
    homeDifficulty: 1,
    awayDifficulty: 3
  },
  {
    id: "m9-10",
    homeTeam: "Fiorentina",
    awayTeam: "Atalanta",
    date: "Lunedì",
    time: "20:45",
    stadium: "Artemio Franchi (Firenze)",
    homeDifficulty: 4,
    awayDifficulty: 4
  }
];

// Calendario 10ª Giornata Serie A - Fonte ufficiale Fantacalcio.it
export const ROUND_10_SERIE_A_FIXTURES: SerieAMatch[] = [
  {
    id: "m10-1",
    homeTeam: "Bologna",
    awayTeam: "Monza",
    date: "Venerdì",
    time: "20:45",
    stadium: "Renato Dall'Ara (Bologna)",
    homeDifficulty: 1,
    awayDifficulty: 4
  },
  {
    id: "m10-2",
    homeTeam: "Udinese",
    awayTeam: "Roma",
    date: "Sabato",
    time: "15:00",
    stadium: "Bluenergy Stadium (Udine)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m10-3",
    homeTeam: "Milan",
    awayTeam: "Inter",
    date: "Sabato",
    time: "18:00",
    stadium: "San Siro (Milano)",
    homeDifficulty: 4,
    awayDifficulty: 5
  },
  {
    id: "m10-4",
    homeTeam: "Como",
    awayTeam: "Venezia",
    date: "Sabato",
    time: "20:45",
    stadium: "Giuseppe Sinigaglia (Como)",
    homeDifficulty: 1,
    awayDifficulty: 3
  },
  {
    id: "m10-5",
    homeTeam: "Frosinone",
    awayTeam: "Torino",
    date: "Domenica",
    time: "12:30",
    stadium: "Benito Stirpe (Frosinone)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m10-6",
    homeTeam: "Lazio",
    awayTeam: "Cagliari",
    date: "Domenica",
    time: "15:00",
    stadium: "Olimpico (Roma)",
    homeDifficulty: 1,
    awayDifficulty: 4
  },
  {
    id: "m10-7",
    homeTeam: "Lecce",
    awayTeam: "Genoa",
    date: "Domenica",
    time: "15:00",
    stadium: "Via del Mare (Lecce)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m10-8",
    homeTeam: "Juventus",
    awayTeam: "Napoli",
    date: "Domenica",
    time: "18:00",
    stadium: "Allianz Stadium (Torino)",
    homeDifficulty: 4,
    awayDifficulty: 5
  },
  {
    id: "m10-9",
    homeTeam: "Sassuolo",
    awayTeam: "Fiorentina",
    date: "Domenica",
    time: "20:45",
    stadium: "Mapei Stadium (Reggio Emilia)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m10-10",
    homeTeam: "Atalanta",
    awayTeam: "Parma",
    date: "Lunedì",
    time: "20:45",
    stadium: "Gewiss Stadium (Bergamo)",
    homeDifficulty: 2,
    awayDifficulty: 5
  }
];

// Calendario 11ª Giornata Serie A - Fonte ufficiale Fantacalcio.it
export const ROUND_11_SERIE_A_FIXTURES: SerieAMatch[] = [
  {
    id: "m11-1",
    homeTeam: "Venezia",
    awayTeam: "Udinese",
    date: "Venerdì",
    time: "20:45",
    stadium: "Pier Luigi Penzo (Venezia)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m11-2",
    homeTeam: "Cagliari",
    awayTeam: "Frosinone",
    date: "Sabato",
    time: "15:00",
    stadium: "Unipol Domus (Cagliari)",
    homeDifficulty: 1,
    awayDifficulty: 3
  },
  {
    id: "m11-3",
    homeTeam: "Torino",
    awayTeam: "Lecce",
    date: "Sabato",
    time: "18:00",
    stadium: "Olimpico Grande Torino (Torino)",
    homeDifficulty: 1,
    awayDifficulty: 3
  },
  {
    id: "m11-4",
    homeTeam: "Parma",
    awayTeam: "Bologna",
    date: "Sabato",
    time: "20:45",
    stadium: "Ennio Tardini (Parma)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m11-5",
    homeTeam: "Roma",
    awayTeam: "Sassuolo",
    date: "Domenica",
    time: "12:30",
    stadium: "Stadio Olimpico (Roma)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m11-6",
    homeTeam: "Napoli",
    awayTeam: "Lazio",
    date: "Domenica",
    time: "15:00",
    stadium: "Diego Armando Maradona (Napoli)",
    homeDifficulty: 3,
    awayDifficulty: 5
  },
  {
    id: "m11-7",
    homeTeam: "Genoa",
    awayTeam: "Milan",
    date: "Domenica",
    time: "15:00",
    stadium: "Luigi Ferraris (Genova)",
    homeDifficulty: 4,
    awayDifficulty: 3
  },
  {
    id: "m11-8",
    homeTeam: "Monza",
    awayTeam: "Atalanta",
    date: "Domenica",
    time: "18:00",
    stadium: "U-Power Stadium (Monza)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m11-9",
    homeTeam: "Inter",
    awayTeam: "Como",
    date: "Domenica",
    time: "20:45",
    stadium: "San Siro (Milano)",
    homeDifficulty: 2,
    awayDifficulty: 5
  },
  {
    id: "m11-10",
    homeTeam: "Fiorentina",
    awayTeam: "Juventus",
    date: "Lunedì",
    time: "20:45",
    stadium: "Artemio Franchi (Firenze)",
    homeDifficulty: 4,
    awayDifficulty: 4
  }
];

// Calendario 12ª Giornata Serie A - Fonte ufficiale Fantacalcio.it
export const ROUND_12_SERIE_A_FIXTURES: SerieAMatch[] = [
  {
    id: "m12-1",
    homeTeam: "Como",
    awayTeam: "Cagliari",
    date: "Venerdì",
    time: "20:45",
    stadium: "Giuseppe Sinigaglia (Como)",
    homeDifficulty: 1,
    awayDifficulty: 3
  },
  {
    id: "m12-2",
    homeTeam: "Lazio",
    awayTeam: "Lecce",
    date: "Sabato",
    time: "15:00",
    stadium: "Olimpico (Roma)",
    homeDifficulty: 1,
    awayDifficulty: 4
  },
  {
    id: "m12-3",
    homeTeam: "Parma",
    awayTeam: "Roma",
    date: "Sabato",
    time: "18:00",
    stadium: "Ennio Tardini (Parma)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m12-4",
    homeTeam: "Napoli",
    awayTeam: "Torino",
    date: "Sabato",
    time: "20:45",
    stadium: "Diego Armando Maradona (Napoli)",
    homeDifficulty: 2,
    awayDifficulty: 5
  },
  {
    id: "m12-5",
    homeTeam: "Sassuolo",
    awayTeam: "Genoa",
    date: "Domenica",
    time: "12:30",
    stadium: "Mapei Stadium (Reggio Emilia)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m12-6",
    homeTeam: "Milan",
    awayTeam: "Frosinone",
    date: "Domenica",
    time: "15:00",
    stadium: "San Siro (Milano)",
    homeDifficulty: 1,
    awayDifficulty: 5
  },
  {
    id: "m12-7",
    homeTeam: "Bologna",
    awayTeam: "Udinese",
    date: "Domenica",
    time: "15:00",
    stadium: "Renato Dall'Ara (Bologna)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m12-8",
    homeTeam: "Atalanta",
    awayTeam: "Inter",
    date: "Domenica",
    time: "18:00",
    stadium: "Gewiss Stadium (Bergamo)",
    homeDifficulty: 4,
    awayDifficulty: 5
  },
  {
    id: "m12-9",
    homeTeam: "Monza",
    awayTeam: "Fiorentina",
    date: "Domenica",
    time: "20:45",
    stadium: "U-Power Stadium (Monza)",
    homeDifficulty: 3,
    awayDifficulty: 2
  },
  {
    id: "m12-10",
    homeTeam: "Juventus",
    awayTeam: "Venezia",
    date: "Lunedì",
    time: "20:45",
    stadium: "Allianz Stadium (Torino)",
    homeDifficulty: 1,
    awayDifficulty: 5
  }
];

// Calendario 13ª Giornata Serie A - Fonte ufficiale Fantacalcio.it
export const ROUND_13_SERIE_A_FIXTURES: SerieAMatch[] = [
  {
    id: "m13-1",
    homeTeam: "Venezia",
    awayTeam: "Bologna",
    date: "Venerdì",
    time: "20:45",
    stadium: "Pier Luigi Penzo (Venezia)",
    homeDifficulty: 3,
    awayDifficulty: 2
  },
  {
    id: "m13-2",
    homeTeam: "Frosinone",
    awayTeam: "Parma",
    date: "Sabato",
    time: "15:00",
    stadium: "Benito Stirpe (Frosinone)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m13-3",
    homeTeam: "Torino",
    awayTeam: "Lazio",
    date: "Sabato",
    time: "18:00",
    stadium: "Olimpico Grande Torino (Torino)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m13-4",
    homeTeam: "Inter",
    awayTeam: "Genoa",
    date: "Sabato",
    time: "20:45",
    stadium: "San Siro (Milano)",
    homeDifficulty: 2,
    awayDifficulty: 5
  },
  {
    id: "m13-5",
    homeTeam: "Udinese",
    awayTeam: "Fiorentina",
    date: "Domenica",
    time: "12:30",
    stadium: "Bluenergy Stadium (Udine)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m13-6",
    homeTeam: "Sassuolo",
    awayTeam: "Napoli",
    date: "Domenica",
    time: "15:00",
    stadium: "Mapei Stadium (Reggio Emilia)",
    homeDifficulty: 4,
    awayDifficulty: 3
  },
  {
    id: "m13-7",
    homeTeam: "Roma",
    awayTeam: "Monza",
    date: "Domenica",
    time: "15:00",
    stadium: "Stadio Olimpico (Roma)",
    homeDifficulty: 1,
    awayDifficulty: 4
  },
  {
    id: "m13-8",
    homeTeam: "Como",
    awayTeam: "Juventus",
    date: "Domenica",
    time: "18:00",
    stadium: "Giuseppe Sinigaglia (Como)",
    homeDifficulty: 4,
    awayDifficulty: 3
  },
  {
    id: "m13-9",
    homeTeam: "Lecce",
    awayTeam: "Atalanta",
    date: "Domenica",
    time: "20:45",
    stadium: "Via del Mare (Lecce)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m13-10",
    homeTeam: "Cagliari",
    awayTeam: "Milan",
    date: "Lunedì",
    time: "20:45",
    stadium: "Unipol Domus (Cagliari)",
    homeDifficulty: 4,
    awayDifficulty: 2
  }
];


// CALENDARIO COMPLETO DEI TURNI SERIE A CON CUTOFF RIGOROSO (Lunedì ore 22:00)
export const SERIE_A_ROUNDS_CALENDAR: MatchdayScheduleRound[] = [
  {
    roundNumber: 5,
    title: "5ª Giornata Serie A (2-5 Ottobre 2026)",
    shortLabel: "5ª G.",
    dateRangeLabel: "2-5 Ott",
    cutoffIso: "2026-10-05T22:00:00+02:00",
    fixtures: ROUND_5_SERIE_A_FIXTURES
  },
  {
    roundNumber: 6,
    title: "6ª Giornata Serie A (9-12 Ottobre 2026)",
    shortLabel: "6ª G.",
    dateRangeLabel: "9-12 Ott",
    cutoffIso: "2026-10-12T22:00:00+02:00",
    fixtures: ROUND_6_SERIE_A_FIXTURES
  },
  {
    roundNumber: 7,
    title: "7ª Giornata Serie A (16-19 Ottobre 2026)",
    shortLabel: "7ª G.",
    dateRangeLabel: "16-19 Ott",
    cutoffIso: "2026-10-19T22:00:00+02:00",
    fixtures: ROUND_7_SERIE_A_FIXTURES
  },
  {
    roundNumber: 8,
    title: "8ª Giornata Serie A (23-26 Ottobre 2026)",
    shortLabel: "8ª G.",
    dateRangeLabel: "23-26 Ott",
    cutoffIso: "2026-10-26T22:00:00+02:00",
    fixtures: ROUND_8_SERIE_A_FIXTURES
  },
  {
    roundNumber: 9,
    title: "9ª Giornata Serie A (30 Ottobre - 2 Novembre 2026)",
    shortLabel: "9ª G.",
    dateRangeLabel: "30 Ott - 2 Nov",
    cutoffIso: "2026-11-02T22:00:00+01:00",
    fixtures: ROUND_9_SERIE_A_FIXTURES
  },
  {
    roundNumber: 10,
    title: "10ª Giornata Serie A (6-9 Novembre 2026)",
    shortLabel: "10ª G.",
    dateRangeLabel: "6-9 Nov",
    cutoffIso: "2026-11-09T22:00:00+01:00",
    fixtures: ROUND_10_SERIE_A_FIXTURES
  },
  {
    roundNumber: 11,
    title: "11ª Giornata Serie A (20-23 Novembre 2026)",
    shortLabel: "11ª G.",
    dateRangeLabel: "20-23 Nov",
    cutoffIso: "2026-11-23T22:00:00+01:00",
    fixtures: ROUND_11_SERIE_A_FIXTURES
  },
  {
    roundNumber: 12,
    title: "12ª Giornata Serie A (27-30 Novembre 2026)",
    shortLabel: "12ª G.",
    dateRangeLabel: "27-30 Nov",
    cutoffIso: "2026-11-30T22:00:00+01:00",
    fixtures: ROUND_12_SERIE_A_FIXTURES
  },
  {
    roundNumber: 13,
    title: "13ª Giornata Serie A (4-7 Dicembre 2026)",
    shortLabel: "13ª G.",
    dateRangeLabel: "4-7 Dic",
    cutoffIso: "2026-12-07T22:00:00+01:00",
    fixtures: ROUND_13_SERIE_A_FIXTURES
  }
];

export interface ActiveMatchdaySchedule {
  currentRound: MatchdayScheduleRound;
  previousRound: MatchdayScheduleRound;
  nextRound: MatchdayScheduleRound; // retrocompatibile
  nextRounds: MatchdayScheduleRound[]; // LE TRE GIORNATE SUCCESSIVE (es. N+1, N+2, N+3)
  allRounds: MatchdayScheduleRound[];
}

// Funzione di rotazione automatica del turno:
// Fino a lunedì sera alle 22:00 propone la giornata in corso come "current".
// Dalle 22:00 di lunedì la giornata giocata scala a "previous", la successiva diventa "current",
// e vengono caricate e rese disponibili le tre giornate successive (nextRounds).
export function getActiveMatchdaySchedule(now: Date = new Date()): ActiveMatchdaySchedule {
  const nowMs = now.getTime();
  const currentIndex = SERIE_A_ROUNDS_CALENDAR.findIndex(r => new Date(r.cutoffIso).getTime() > nowMs);

  if (currentIndex === -1) {
    const lastIdx = SERIE_A_ROUNDS_CALENDAR.length - 1;
    const cur = SERIE_A_ROUNDS_CALENDAR[lastIdx];
    const prev = SERIE_A_ROUNDS_CALENDAR[Math.max(0, lastIdx - 1)];
    return {
      currentRound: cur,
      previousRound: prev,
      nextRound: cur,
      nextRounds: [cur, cur, cur],
      allRounds: SERIE_A_ROUNDS_CALENDAR
    };
  }

  const currentRound = SERIE_A_ROUNDS_CALENDAR[currentIndex];
  const previousRound = currentIndex > 0 
    ? SERIE_A_ROUNDS_CALENDAR[currentIndex - 1] 
    : SERIE_A_ROUNDS_CALENDAR[0];

  // Le tre giornate successive (es. se cur è 6 -> [7, 8, 9])
  const nextRounds: MatchdayScheduleRound[] = [];
  for (let i = 1; i <= 3; i++) {
    const idx = currentIndex + i;
    if (idx < SERIE_A_ROUNDS_CALENDAR.length) {
      nextRounds.push(SERIE_A_ROUNDS_CALENDAR[idx]);
    } else {
      nextRounds.push(SERIE_A_ROUNDS_CALENDAR[SERIE_A_ROUNDS_CALENDAR.length - 1]);
    }
  }

  const nextRound = nextRounds[0];

  return {
    currentRound,
    previousRound,
    nextRound,
    nextRounds,
    allRounds: SERIE_A_ROUNDS_CALENDAR
  };
}

// Stato di default calcolato al caricamento
export const DEFAULT_ACTIVE_SCHEDULE = getActiveMatchdaySchedule();

// Costanti retrocompatibili
export const CURRENT_MATCHDAY_NUMBER = DEFAULT_ACTIVE_SCHEDULE.currentRound.roundNumber;
export const CURRENT_MATCHDAY_TITLE = DEFAULT_ACTIVE_SCHEDULE.currentRound.title;
export const CURRENT_SERIE_A_FIXTURES = DEFAULT_ACTIVE_SCHEDULE.currentRound.fixtures;
export const NEXT_MATCHDAY_NUMBER = DEFAULT_ACTIVE_SCHEDULE.nextRound.roundNumber;
export const NEXT_MATCHDAY_TITLE = DEFAULT_ACTIVE_SCHEDULE.nextRound.title;
export const NEXT_SERIE_A_FIXTURES = DEFAULT_ACTIVE_SCHEDULE.nextRound.fixtures;

// Helper per ottenere il match di una squadra per qualsiasi tipo di turno o indice
export function getTeamFixture(teamName: string, matchdayType: MatchdayType = 'current') {
  if (!teamName) return null;
  const schedule = getActiveMatchdaySchedule();
  
  let round = schedule.currentRound;
  if (matchdayType === 'previous') {
    round = schedule.previousRound;
  } else if (matchdayType === 'next' || matchdayType === 'next1') {
    round = schedule.nextRounds[0];
  } else if (matchdayType === 'next2') {
    round = schedule.nextRounds[1];
  } else if (matchdayType === 'next3') {
    round = schedule.nextRounds[2];
  }

  const fixtures = round.fixtures;
  const match = fixtures.find(
    m => m.homeTeam.toLowerCase() === teamName.toLowerCase() || m.awayTeam.toLowerCase() === teamName.toLowerCase()
  );
  if (!match) return null;
  const isHome = match.homeTeam.toLowerCase() === teamName.toLowerCase();
  const difficulty = isHome ? match.homeDifficulty : match.awayDifficulty;

  return {
    opponent: isHome ? match.awayTeam : match.homeTeam,
    isHome,
    difficulty,
    stadium: match.stadium,
    date: match.date,
    time: match.time,
    matchdayNumber: round.roundNumber,
    matchdayTitle: round.title,
    description: `${isHome ? 'IN CASA vs ' + match.awayTeam : 'TRASFERTA @ ' + match.homeTeam} (${match.date} ${match.time})`
  };
}

export interface UpcomingMatchInfo {
  roundNumber: number;
  roundTitle: string;
  shortLabel: string;
  opponent: string;
  isHome: boolean;
  difficulty: number;
  stadium: string;
  date: string;
  time: string;
}

// Restituisce le prossime 3 partite in programma per qualsiasi squadra
export function getTeamUpcomingMatches(teamName: string, count: number = 3): UpcomingMatchInfo[] {
  if (!teamName) return [];
  const schedule = getActiveMatchdaySchedule();
  const results: UpcomingMatchInfo[] = [];
  const targetRounds = schedule.nextRounds.slice(0, count);

  for (const r of targetRounds) {
    const match = r.fixtures.find(
      m => m.homeTeam.toLowerCase() === teamName.toLowerCase() || m.awayTeam.toLowerCase() === teamName.toLowerCase()
    );
    if (match) {
      const isHome = match.homeTeam.toLowerCase() === teamName.toLowerCase();
      results.push({
        roundNumber: r.roundNumber,
        roundTitle: r.title,
        shortLabel: r.shortLabel,
        opponent: isHome ? match.awayTeam : match.homeTeam,
        isHome,
        difficulty: isHome ? match.homeDifficulty : match.awayDifficulty,
        stadium: match.stadium,
        date: match.date,
        time: match.time
      });
    }
  }
  return results;
}


// 2. Probabili Formazioni Gazzetta dello Sport (Aggiornate 6ª Giornata)
export const GAZZETTA_LINEUPS: Record<string, Partial<GazzettaPlayerStatus>> = {
  "SVILAR": {
    "titolaritaPercent": 95,
    "status": "titolare",
    "noteGazzetta": "Titolare inamovibile con Gasperini nel big match all'Olimpico contro l'Inter."
  },
  "BIJLOW": {
    "titolaritaPercent": 95,
    "status": "titolare",
    "noteGazzetta": "Titolare tra i pali del Genoa nella sfida casalinga con il Bologna."
  },
  "VICARIO": {
    "titolaritaPercent": 95,
    "status": "titolare",
    "noteGazzetta": "Perno della retroguardia bianconera all'Allianz Stadium contro la Lazio."
  },
  "CARNESECCHI": {
    "titolaritaPercent": 95,
    "status": "titolare",
    "noteGazzetta": "Certezza assoluta dei pali orobici al Penzo di Venezia."
  },
  "MAIGNAN": {
    "titolaritaPercent": 95,
    "status": "titolare",
    "noteGazzetta": "Titolare a San Siro contro l'Udinese."
  },
  "DE GEA": {
    "titolaritaPercent": 95,
    "status": "titolare",
    "noteGazzetta": "Esperienza europea a difesa dei pali viola a Lecce."
  },
  "OKOYE": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "noteGazzetta": "Trasferta impegnativa a San Siro contro il Milan."
  },
  "BREMER": {
    "titolaritaPercent": 0,
    "status": "infortunato",
    "noteGazzetta": "Rottura del legamento crociato e menisco: operato, stagione finita."
  },
  "ZAPATA": {
    "titolaritaPercent": 0,
    "status": "infortunato",
    "noteGazzetta": "Lesione del legamento crociato anteriore e menisco: stagione finita."
  },
  "MANCINI": {
    "titolaritaPercent": 95,
    "status": "titolare",
    "noteGazzetta": "Leader difensivo all'Olimpico contro l'Inter."
  },
  "DIMARCO": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "piazzati": true,
    "noteGazzetta": "Ristabilito: pronto dal 1' minuto sulla fascia sinistra all'Olimpico con la Roma."
  },
  "CALHANOGLU": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "rigorista": true,
    "piazzati": true,
    "noteGazzetta": "Risentimento adduttore smaltito: titolare in regia all'Olimpico con la Roma."
  },
  "RRAHMANI": {
    "titolaritaPercent": 95,
    "status": "titolare",
    "noteGazzetta": "Leader della retroguardia del Napoli al Castellani contro l'Empoli."
  },
  "CHALOBAH": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "noteGazzetta": "Titolare al centro della difesa del Como contro il Parma."
  },
  "GILA": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "noteGazzetta": "Titolare nella linea difensiva rossonera a San Siro con l'Udinese."
  },
  "KALULU": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "noteGazzetta": "Affidabile braccetto di Spalletti allo Stadium contro la Lazio."
  },
  "BARELLA": {
    "titolaritaPercent": 80,
    "status": "titolare",
    "noteGazzetta": "Rientrato pienamente a disposizione e in gruppo: perno del centrocampo nerazzurro."
  },
  "MERET": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "noteGazzetta": "Lesione adduttore superata: rilanciato titolare a Empoli da mister Allegri."
  },
  "MCTOMINAY": {
    "titolaritaPercent": 75,
    "status": "ballottaggio",
    "noteGazzetta": "Ottenuta idoneità sportiva: convocato per Empoli, pronto a spaccare il match."
  },
  "MALINOVSKYI": {
    "titolaritaPercent": 0,
    "status": "infortunato",
    "noteGazzetta": "Grave frattura del perone, stagione finita."
  },
  "ORSOLINI": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "noteGazzetta": "Pienamente recuperato: titolare nel tridente del Bologna a Genova."
  },
  "BERNABE'": {
    "titolaritaPercent": 85,
    "status": "titolare",
    "noteGazzetta": "Recuperato dal problema muscolare: titolare sulla trequarti ducale a Como."
  },
  "MALEN": {
    "titolaritaPercent": 85,
    "status": "titolare",
    "noteGazzetta": "Recuperato in questa sosta: guida l'attacco della Roma contro l'Inter."
  },
  "WESLEY": {
    "titolaritaPercent": 85,
    "status": "titolare",
    "noteGazzetta": "Recuperato dal guaio fisico: titolare sulla fascia sinistra con l'Inter."
  },
  "KEAN": {
    "titolaritaPercent": 65,
    "status": "ballottaggio",
    "ballottaggioCon": "65% Douvikas - 35% Kean",
    "noteGazzetta": "Recuperato ma Douvikas resta in pole per partire titolare nel Como contro il Parma."
  },
  "CAMBIASO": {
    "titolaritaPercent": 85,
    "status": "titolare",
    "noteGazzetta": "Recuperato: titolare sulla corsia sinistra contro la Lazio."
  },
  "DAVIS": {
    "titolaritaPercent": 85,
    "status": "titolare",
    "rigorista": true,
    "noteGazzetta": "Pienamente recuperato: centravanti titolare dell'Udinese a San Siro col Milan."
  },
  "COLOMBO": {
    "titolaritaPercent": 0,
    "status": "infortunato",
    "noteGazzetta": "Assente per lesione muscolare: in attacco occasione per Vitinha-Osmajic."
  },
  "GUDMUNDSSON": {
    "titolaritaPercent": 0,
    "status": "infortunato",
    "noteGazzetta": "Lesione muscolare: assente contro la Juventus."
  },
  "SAELEMAEKERS": {
    "titolaritaPercent": 0,
    "status": "infortunato",
    "noteGazzetta": "Frattura al malleolo mediale operata, fuori fino a fine novembre."
  },
  "ATTA": {
    "titolaritaPercent": 35,
    "status": "ballottaggio",
    "noteGazzetta": "Sovraccarico all'addome: in forte dubbio a Lecce, Pedro Goncalves titolare."
  },
  "GONCALVES P.": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "rigorista": true,
    "noteGazzetta": "Titolare trequartista a Lecce: attesissimo per bonus."
  },
  "KEVIN CARLOS": {
    "titolaritaPercent": 0,
    "status": "infortunato",
    "noteGazzetta": "Problema muscolare alla gamba sinistra: forfait contro il Torino."
  },
  "DOVBYK": {
    "titolaritaPercent": 30,
    "status": "ballottaggio",
    "noteGazzetta": "Tornato ad allenarsi a parte, convocabile a Genova ma Piccoli in pole."
  },
  "PICCOLI": {
    "titolaritaPercent": 85,
    "status": "titolare",
    "noteGazzetta": "Centravanti titolare a Marassi contro il Genoa."
  },
  "SIMEONE": {
    "titolaritaPercent": 75,
    "status": "ballottaggio",
    "ballottaggioCon": "75% Simeone - 25% Adams",
    "noteGazzetta": "Titolare in attacco a Cagliari, Adams recuperato pronto a subentrare."
  },
  "PULISIC": {
    "titolaritaPercent": 95,
    "status": "titolare",
    "noteGazzetta": "Leader offensivo del Milan a San Siro contro l'Udinese."
  },
  "GONCALO RAMOS": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "rigorista": true,
    "noteGazzetta": "Punta centrale titolare del Milan contro l'Udinese."
  },
  "HOJLUND": {
    "titolaritaPercent": 85,
    "status": "titolare",
    "noteGazzetta": "Centravanti del Napoli a Empoli in pole su Lucca."
  },
  "THURAM": {
    "titolaritaPercent": 90,
    "status": "titolare",
    "noteGazzetta": "Titolare all'Olimpico contro la Roma in coppia con Martinez o Bonny."
  },
  "MARTINEZ L.": {
    "titolaritaPercent": 75,
    "status": "ballottaggio",
    "ballottaggioCon": "75% Martinez L. - 25% Bonny",
    "noteGazzetta": "Valutato per turnover dopo la trasferta transoceanica con l'Argentina."
  }
};

export const FANTAGAZZETTA_ADVICE: Record<string, Partial<FantagazzettaRating>> = {
  "BREMER": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Rottura del legamento crociato e menisco: operato, stagione finita." },
  "ZAPATA": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Lesione del legamento crociato e menisco: stagione finita." },
  "COLOMBO": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Fermo per infortunio muscolare. Assente contro il Bologna." },
  "GUDMUNDSSON": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Out per lesione muscolare per la sfida di Torino contro la Juventus." },
  "BARELLA": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Rientrato dall'infortunio: certezza del centrocampo nerazzurro, da schierare." },
  "SAELEMAEKERS": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Fuori per frattura al malleolo. Non disponibile." },
  "MALINOVSKYI": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Grave frattura del perone, stagione finita. Non schierabile." },
  "CALHANOGLU": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Ristabilito: all'Olimpico contro la Roma guiderà la manovra e calcerà i rigori." },
  "DIMARCO": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Recuperato dal 1': corsia mancina e corner caldissimi all'Olimpico." },
  "MERET": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Rientro tra i pali a Empoli: altissima probabilità di clean sheet." },
  "MCTOMINAY": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Ottenuta idoneità: a Empoli può spaccare la partita anche da subentrato." },
  "ORSOLINI": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Pienamente recuperato: a Genova contro il Grifone può colpire con tiri e rigori." },
  "BERNABE'": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Rientrato in gruppo: a Como sarà il cervello e battitore di piazzati del Parma." },
  "MALEN": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Pienamente recuperato durante la sosta: guida l'attacco della Roma all'Olimpico." },
  "WESLEY": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Recuperato dal problema fisico: spinta continua a sinistra contro l'Inter." },
  "DAVIS": { stars: 3, fascia: 'Scommessa', commentoRedazione: "Rientrato titolare: fisicità importante a San Siro contro il Milan." },
  "PULISIC": { stars: 5, fascia: 'Top di Giornata', commentoRedazione: "A San Siro contro l'Udinese è l'uomo più pericoloso del Milan: schieratelo senza dubbi!" },
  "GONCALO RAMOS": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Terminale offensivo del Milan: rigori e presenza in area contro l'Udinese." },
  "HOJLUND": { stars: 5, fascia: 'Top di Giornata', commentoRedazione: "Al Castellani contro l'Empoli è il riferimento centrale del Napoli: da mettere titolare." },
  "THURAM": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Big match all'Olimpico: strappi in profondità micidiali contro la difesa giallorossa." },
  "GONCALVES P.": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Trequartista titolare a Lecce: qualità, assist e conclusioni da fuori." },
  "PICCOLI": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Titolare d'attacco a Marassi contro il Genoa privo di Colombo: ottima opzione." },
  "SIMEONE": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Titolare a Cagliari in vantaggio su Adams: generosità e conclusioni a rete." },
  "SVILAR": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Contro l'Inter all'Olimpico serviranno i suoi interventi: modificatore affidabile." },
  "CARNESECCHI": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Atalanta in trasferta a Venezia: portiere reattivo e da ottimo voto." },
  "MAIGNAN": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Milan in casa contro l'Udinese: concrete chance di clean sheet." },
  "KEAN": { stars: 4, fascia: 'Consigliato', commentoRedazione: "A Como contro il Parma: se subentra o parte dal 1' ha fame di gol." }
};

export interface SyncedOnlinePlayer {
  name: string;
  titolaritaPercent: number;
  status: 'titolare' | 'ballottaggio' | 'panchina' | 'infortunato' | 'squalificato';
  ballottaggioCon?: string | null;
  source: string;
  note?: string;
}

export interface SyncedOnlineData {
  success: boolean;
  timestamp: string;
  syncedAt: number;
  totalPlayers: number;
  totalBallots: number;
  players: Record<string, SyncedOnlinePlayer>;
  teamComments: Record<string, string>;
  ballottaggi: Array<{
    p1: string;
    perc1: number;
    p2: string;
    perc2: number;
  }>;
}

export function cleanPlayerName(str: string): string {
  if (!str) return '';
  return str
    .toUpperCase()
    .replace(/&#X[0-9A-F]+;/gi, '')
    .replace(/&[A-Z0-9#]+;/gi, '')
    .replace(/[^A-Z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchSyncedPlayer(
  playerName: string,
  syncedPlayers: Record<string, SyncedOnlinePlayer>,
  teamName?: string
): SyncedOnlinePlayer | null {
  if (!syncedPlayers || !playerName) return null;

  // 1. Chiave alfanumerica diretta (es. "ESPOSITO F.P." -> "ESPOSITOFP", "THURAM" -> "THURAM")
  const alphaKey = playerName.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (syncedPlayers[alphaKey]) {
    const candidate = syncedPlayers[alphaKey];
    // Se è specificata la squadra, assicurati che la fonte non indichi una squadra diversa
    if (teamName) {
      const tNorm = teamName.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const srcUpper = (candidate.source || '').toUpperCase();
      const knownClubs = ['INTER', 'JUVENTUS', 'MILAN', 'NAPOLI', 'ROMA', 'LAZIO', 'ATALANTA', 'FIORENTINA', 'BOLOGNA', 'TORINO', 'GENOA', 'MONZA', 'CAGLIARI', 'LECCE', 'PARMA', 'VERONA', 'COMO', 'EMPOLI', 'VENEZIA', 'UDINESE', 'SASSUOLO'];
      for (const club of knownClubs) {
        if (srcUpper.includes(club)) {
          if (!tNorm.includes(club) && !club.includes(tNorm)) {
            // Mismatch di club tra giocatore cercato e candidato
            return null;
          }
        }
      }
    }
    return candidate;
  }

  const norm = cleanPlayerName(playerName);
  if (syncedPlayers[norm]) return syncedPlayers[norm];

  // Alias comuni Fantacalcio / Gazzetta
  if (norm.includes('MARTINEZ L') || norm === 'LAUTARO') {
    if (syncedPlayers['MARTINEZL'] || syncedPlayers['MARTINEZ L'] || syncedPlayers['MARTINEZ']) return syncedPlayers['MARTINEZL'] || syncedPlayers['MARTINEZ L'] || syncedPlayers['MARTINEZ'];
  }
  if (norm.includes('GONCALO RAMOS') || norm === 'RAMOS G') {
    if (syncedPlayers['RAMOSG'] || syncedPlayers['RAMOS G'] || syncedPlayers['RAMOS']) return syncedPlayers['RAMOSG'] || syncedPlayers['RAMOS G'] || syncedPlayers['RAMOS'];
  }
  if (norm.includes('PEDRO GONCALVES') || norm === 'GONCALVES P') {
    if (syncedPlayers['GONCALVESP'] || syncedPlayers['GONCALVES P'] || syncedPlayers['GONCALVES']) return syncedPlayers['GONCALVESP'] || syncedPlayers['GONCALVES P'] || syncedPlayers['GONCALVES'];
  }
  if (norm.includes('DAVIS') || norm === 'DAVIS K') {
    if (syncedPlayers['DAVISK'] || syncedPlayers['DAVIS K'] || syncedPlayers['DAVIS']) return syncedPlayers['DAVISK'] || syncedPlayers['DAVIS K'] || syncedPlayers['DAVIS'];
  }

  const tokens = norm.split(' ').filter(t => t.length > 2);
  for (const [key, val] of Object.entries(syncedPlayers)) {
    const keyAlpha = key.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (keyAlpha === alphaKey) return val;

    const valNorm = cleanPlayerName(val.name);
    const keyTokens = valNorm.split(' ').filter(t => t.length > 2);
    // Se entrambi i nomi hanno più token, controlla corrispondenza completa
    if (tokens.length >= 2 && keyTokens.length >= 2) {
      if (tokens.every(t => keyTokens.includes(t)) || keyTokens.every(kt => tokens.includes(kt))) {
        return val;
      }
    } else if (tokens.length === 1 && keyTokens.length === 1) {
      // Evita match su singoli cognomi di omonimi, fratelli e cognomi condivisi in Serie A
      if (tokens[0] === keyTokens[0] && !SERIE_A_SHARED_SURNAMES.has(tokens[0])) {
        return val;
      }
    } else if (tokens.length >= 2 && keyTokens.length === 1) {
      if (keyTokens[0] === tokens[tokens.length - 1] && !SERIE_A_SHARED_SURNAMES.has(keyTokens[0])) {
        return val;
      }
    }
  }
  return null;
}

// Funzione principale che raccoglie tutti i dati per un calciatore per il turno specificato (in corso, precedente o prossimo)
export function getPlayerMatchdayEvaluation(
  playerName: string, 
  teamName: string,
  syncedData?: SyncedOnlineData | null,
  matchdayType: MatchdayType = 'current'
): PlayerMatchdayEvaluation {
  const normName = playerName.toUpperCase().trim();
  const fixture = getTeamFixture(teamName, matchdayType);
  const injury = getInjuryInfo(normName, teamName);

  // Gazzetta
  const gazzettaCustom = GAZZETTA_LINEUPS[normName];
  let gazzetta: GazzettaPlayerStatus;
  if (injury) {
    gazzetta = {
      titolaritaPercent: 0,
      status: injury.isSqualificato ? 'squalificato' : 'infortunato',
      noteGazzetta: `${injury.infortunio} (Rientro: ${injury.rientroPrevisto})`
    };
  } else if (gazzettaCustom) {
    gazzetta = {
      titolaritaPercent: gazzettaCustom.titolaritaPercent ?? 80,
      status: gazzettaCustom.status ?? 'titolare',
      ballottaggioCon: gazzettaCustom.ballottaggioCon,
      rigorista: Boolean(gazzettaCustom.rigorista),
      piazzati: Boolean(gazzettaCustom.piazzati),
      noteGazzetta: gazzettaCustom.noteGazzetta || "Titolare probabile nelle rifiniture Gazzetta."
    };
  } else {
    // Default ragionevole basato su titolarità standard
    gazzetta = {
      titolaritaPercent: 75,
      status: 'titolare',
      noteGazzetta: "In corsa per una maglia da titolare per questa domenica."
    };
  }

  // Integrazione dati freschi live da sincronizzazione online (se presenti)
  if (syncedData?.players && !injury) {
    const synced = matchSyncedPlayer(normName, syncedData.players, teamName);
    if (synced) {
      gazzetta.titolaritaPercent = synced.titolaritaPercent;
      gazzetta.status = synced.status;
      if (synced.status === 'infortunato') {
        gazzetta.noteGazzetta = `🏥 Infortunato (Fantacalcio.it Infermeria): ${synced.note || 'Indisponibile'}`;
      } else if (synced.status === 'squalificato') {
        gazzetta.noteGazzetta = `🟥 Squalificato (Fantacalcio.it): Non disponibile per questo turno.`;
      } else if (synced.ballottaggioCon) {
        gazzetta.ballottaggioCon = synced.ballottaggioCon;
        gazzetta.noteGazzetta = `⚡ Ballottaggio live: ${synced.ballottaggioCon}`;
      } else if (synced.status === 'titolare') {
        gazzetta.noteGazzetta = `🟢 Titolare confermato nelle ultime probabili formazioni (${synced.titolaritaPercent}%).`;
      } else if (synced.status === 'panchina') {
        gazzetta.noteGazzetta = `⚠️ Destinato alla panchina nelle ultime rifiniture (${synced.titolaritaPercent}%).`;
      }
    }
  }

  // Fantagazzetta
  const fgCustom = FANTAGAZZETTA_ADVICE[normName];
  let fantagazzetta: FantagazzettaRating;
  if (injury) {
    fantagazzetta = {
      stars: 1,
      fascia: 'Sconsigliato',
      commentoRedazione: `Indisponibile per infortunio (${injury.rientroPrevisto}). Non schierabile.`
    };
  } else if (matchdayType === 'current' && fgCustom) {
    // Valutazione specifica turno attuale
    fantagazzetta = {
      stars: fgCustom.stars ?? 3,
      fascia: fgCustom.fascia ?? 'Schierabile',
      commentoRedazione: fgCustom.commentoRedazione || "Buona opzione per completare il reparto."
    };
  } else {
    // Calcolo dinamico in funzione della difficoltà del match e fattore campo
    const diff = fixture ? fixture.difficulty : 3;
    const isHome = fixture ? fixture.isHome : false;
    const opp = fixture ? fixture.opponent : "avversario";

    if (diff === 1) {
      fantagazzetta = {
        stars: 5,
        fascia: 'Top di Giornata',
        commentoRedazione: `Match d'oro ${isHome ? 'in casa' : 'in trasferta'} contro ${opp} (Diff. 1/5). Da mettere assolutamente, altissima probabilità di bonus e voti alti!`
      };
    } else if (diff === 2) {
      fantagazzetta = {
        stars: 4,
        fascia: 'Consigliato',
        commentoRedazione: `Turno favorevole ${isHome ? 'tra le mura amiche' : 'in trasferta'} contro ${opp} (Diff. 2/5). Ottima scelta per il reparto.`
      };
    } else if (diff === 3) {
      fantagazzetta = {
        stars: 3,
        fascia: 'Schierabile',
        commentoRedazione: `Gara equilibrata contro ${opp} (${isHome ? 'in casa' : 'fuori'}). Schierabile titolare con buona fiducia.`
      };
    } else if (diff === 4) {
      fantagazzetta = {
        stars: 2,
        fascia: 'Rischioso',
        commentoRedazione: `Partita insidiosa contro ${opp} (Diff. 4/5). Attenzione ai cartellini e alla pressione difensiva.`
      };
    } else {
      fantagazzetta = {
        stars: 2,
        fascia: 'Trappola da Evitare',
        commentoRedazione: `Match proibitivo ${isHome ? 'in casa' : 'in trasferta'} contro ${opp} (Diff. 5/5): rischio malus elevato, valutare alternative più morbide.`
      };
    }
  }

  // Aggiustamento dinamico Fantagazzetta se da live sync emerge un ballottaggio rischioso o panchina certa
  if (syncedData?.players && !injury) {
    const synced = matchSyncedPlayer(normName, syncedData.players, teamName);
    if (synced) {
      if (synced.titolaritaPercent <= 40 && fantagazzetta.stars > 2) {
        fantagazzetta.stars = 2;
        fantagazzetta.fascia = 'Trappola da Evitare';
        fantagazzetta.commentoRedazione += ` [LIVE ALERT: titolarità crollata al ${synced.titolaritaPercent}%, rischio s.v.]`;
      } else if (synced.status === 'ballottaggio' && synced.ballottaggioCon) {
        fantagazzetta.commentoRedazione += ` [LIVE: ballottaggio ${synced.ballottaggioCon}]`;
      }
    }
  }

  // Tattico Luca Diddi
  const tatticoAdvice = getTatticoAdvice(normName, teamName);

  return {
    match: fixture,
    matchdayType,
    gazzetta,
    fantagazzetta,
    tatticoAdvice,
    injury: injury ? {
      infortunio: injury.infortunio,
      rientroPrevisto: injury.rientroPrevisto,
      meseRientro: injury.meseRientro
    } : null
  };
}
