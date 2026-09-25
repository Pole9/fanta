// Database Turno di Serie A, Probabili Formazioni Gazzetta dello Sport e Consigli Fantagazzetta/Fantacalcio.it
import { INJURY_DATABASE, getInjuryInfo } from './injuryData';
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

export interface PlayerMatchdayEvaluation {
  match: {
    opponent: string;
    isHome: boolean;
    difficulty: number;
    description: string;
  } | null;
  gazzetta: GazzettaPlayerStatus;
  fantagazzetta: FantagazzettaRating;
  tatticoAdvice: string | null;
  injury: {
    infortunio: string;
    rientroPrevisto: string;
    meseRientro: string;
  } | null;
}

// 1. Calendario del prossimo turno di Serie A (Giornata 6)
export const CURRENT_MATCHDAY_NUMBER = 6;
export const CURRENT_MATCHDAY_TITLE = "6ª Giornata Serie A (25-28 Settembre 2026)";

export const CURRENT_SERIE_A_FIXTURES: SerieAMatch[] = [
  {
    id: "m-1",
    homeTeam: "Lecce",
    awayTeam: "Parma",
    date: "Venerdì",
    time: "20:45",
    stadium: "Via del Mare (Lecce)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m-2",
    homeTeam: "Torino",
    awayTeam: "Como",
    date: "Sabato",
    time: "15:00",
    stadium: "Olimpico Grande Torino (Torino)",
    homeDifficulty: 2,
    awayDifficulty: 3
  },
  {
    id: "m-3",
    homeTeam: "Inter",
    awayTeam: "Udinese",
    date: "Sabato",
    time: "18:00",
    stadium: "San Siro (Milano)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m-4",
    homeTeam: "Napoli",
    awayTeam: "Monza",
    date: "Sabato",
    time: "20:45",
    stadium: "Diego Armando Maradona (Napoli)",
    homeDifficulty: 1,
    awayDifficulty: 5
  },
  {
    id: "m-5",
    homeTeam: "Sassuolo",
    awayTeam: "Venezia",
    date: "Domenica",
    time: "12:30",
    stadium: "Mapei Stadium (Reggio Emilia)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m-6",
    homeTeam: "Atalanta",
    awayTeam: "Bologna",
    date: "Domenica",
    time: "15:00",
    stadium: "Gewiss Stadium (Bergamo)",
    homeDifficulty: 2,
    awayDifficulty: 4
  },
  {
    id: "m-7",
    homeTeam: "Frosinone",
    awayTeam: "Fiorentina",
    date: "Domenica",
    time: "15:00",
    stadium: "Benito Stirpe (Frosinone)",
    homeDifficulty: 4,
    awayDifficulty: 2
  },
  {
    id: "m-8",
    homeTeam: "Roma",
    awayTeam: "Juventus",
    date: "Domenica",
    time: "18:00",
    stadium: "Olimpico (Roma)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m-9",
    homeTeam: "Lazio",
    awayTeam: "Milan",
    date: "Domenica",
    time: "20:45",
    stadium: "Olimpico (Roma)",
    homeDifficulty: 3,
    awayDifficulty: 3
  },
  {
    id: "m-10",
    homeTeam: "Cagliari",
    awayTeam: "Genoa",
    date: "Lunedì",
    time: "20:45",
    stadium: "Unipol Domus (Cagliari)",
    homeDifficulty: 3,
    awayDifficulty: 3
  }
];

// Helper per ottenere il match di una squadra
export function getTeamFixture(teamName: string) {
  if (!teamName) return null;
  const match = CURRENT_SERIE_A_FIXTURES.find(
    m => m.homeTeam.toLowerCase() === teamName.toLowerCase() || m.awayTeam.toLowerCase() === teamName.toLowerCase()
  );
  if (!match) return null;
  const isHome = match.homeTeam.toLowerCase() === teamName.toLowerCase();
  return {
    opponent: isHome ? match.awayTeam : match.homeTeam,
    isHome,
    difficulty: isHome ? match.homeDifficulty : match.awayDifficulty,
    description: `${isHome ? 'IN CASA contro ' + match.awayTeam : 'TRASFERTA a ' + match.homeTeam} (${match.date} ${match.time})`
  };
}

// 2. Probabili Formazioni Gazzetta dello Sport (Aggiornate 6ª Giornata)
export const GAZZETTA_LINEUPS: Record<string, Partial<GazzettaPlayerStatus>> = {
  // Top players & starters
  "SVILAR": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Titolare inamovibile con Gasperini, big match all'Olimpico contro la Juventus." },
  "BIJLOW": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Titolare a San Siro contro l'Inter dopo un inizio di stagione molto convincente." },
  "VICARIO": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Spalletti punta su di lui per difendere la porta bianconera all'Olimpico." },
  "CARNESECCHI": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Certezza assoluta dei pali orobici al Gewiss Stadium contro il Bologna." },
  "MAIGNAN": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Titolare all'Olimpico contro la Lazio nel big match domenicale." },
  "DE GEA": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Esperienza europea per blindare i pali della Fiorentina allo Stirpe." },
  "OKOYE": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Trasferta impegnativa a San Siro contro l'Inter, titolarità solida." },
  "BREMER": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Guida la retroguardia bianconera all'Olimpico contro la Roma." },
  "MANCINI": { titolaritaPercent: 95, status: 'titolare', rigorista: false, noteGazzetta: "Perno difensivo e minaccia sui piazzati contro la Juventus." },
  "DIMARCO": { titolaritaPercent: 95, status: 'titolare', piazzati: true, noteGazzetta: "Spinta costante a sinistra e corner a San Siro contro l'Udinese." },
  "RRAHMANI": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Leader della difesa partenopea al Maradona contro il Monza." },
  "CHALOBAH": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Titolare fisso nel Como di Fabregas nella trasferta di Torino." },
  "GILA": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Miglior difensore del Milan per continuità, titolare a Roma con la Lazio." },
  "KALULU": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Braccetto affidabile di Spalletti nella sfida dell'Olimpico." },
  "BARELLA": { titolaritaPercent: 0, status: 'infortunato', noteGazzetta: "Distrazione al retto femorale: assente con l'Udinese, stop di 3 settimane." },
  "CALHANOGLU": { titolaritaPercent: 65, status: 'ballottaggio', ballottaggioCon: "65% Calhanoglu - 35% Asllani", rigorista: true, piazzati: true, noteGazzetta: "Risentimento adduttore smaltito, in ballottaggio per una maglia dall'inizio con l'Udinese." },
  "MERET": { titolaritaPercent: 0, status: 'infortunato', noteGazzetta: "Lesione all'adduttore lungo: assente col Monza. Rientro dopo la sosta." },
  "MILINKOVIC-SAVIC V.": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Titolare tra i pali del Napoli al Maradona contro il Monza stante lo stop di Meret." },
  "MALINOVSKYI": { titolaritaPercent: 0, status: 'infortunato', noteGazzetta: "Grave infortunio alla caviglia destra con frattura del perone: operato, stagione finita." },
  "ORSOLINI": { titolaritaPercent: 85, status: 'titolare', noteGazzetta: "Completamente ristabilito dal problema ai flessori: pronto a colpire a Bergamo." },
  "DOVBYK": { titolaritaPercent: 0, status: 'infortunato', noteGazzetta: "Lesione al bicipite femorale: assente a Bergamo. Titolare Piccoli." },
  "SAELEMAEKERS": { titolaritaPercent: 0, status: 'infortunato', noteGazzetta: "Frattura al malleolo mediale: operato, fuori fino a fine novembre." },
  "VASQUEZ": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Scontato il turno di squalifica: torna titolare nella difesa a 3 del Genoa a Cagliari." },
  "ADAMS C.": { titolaritaPercent: 0, status: 'infortunato', noteGazzetta: "Lesione distrattiva all'adduttore: ancora out col Como. Titolare Simeone." },
  "GUDMUNDSSON": { titolaritaPercent: 85, status: 'titolare', noteGazzetta: "Risentimento al polpaccio superato: convocato e pronto a partire dal 1' a Frosinone." },
  "SPINAZZOLA": { titolaritaPercent: 55, status: 'ballottaggio', ballottaggioCon: "55% Spinazzola - 45% Olivera", noteGazzetta: "Favorito a sinistra nella difesa del Napoli al Maradona contro il Monza." },
  "OLIVERA": { titolaritaPercent: 45, status: 'ballottaggio', ballottaggioCon: "45% Olivera - 55% Spinazzola", noteGazzetta: "Ballottaggio aperto con Spinazzola sulla corsia mancina." },
  "ZORTEA": { titolaritaPercent: 60, status: 'ballottaggio', ballottaggioCon: "60% Zortea - 40% Holm", noteGazzetta: "Fastidio all'anca superato: in leggero vantaggio su Holm per la corsia destra." },
  "HOLM": { titolaritaPercent: 40, status: 'ballottaggio', ballottaggioCon: "40% Holm - 60% Zortea", noteGazzetta: "Pronto ad alternarsi a gara in corso a Bergamo contro l'Atalanta." },
  "NOSLIN": { titolaritaPercent: 55, status: 'ballottaggio', ballottaggioCon: "55% Noslin - 45% Pinamonti", noteGazzetta: "In leggero vantaggio per guidare l'attacco laziale nel big match col Milan." },
  "PINAMONTI": { titolaritaPercent: 45, status: 'ballottaggio', ballottaggioCon: "45% Pinamonti - 55% Noslin", rigorista: true, noteGazzetta: "Ballottaggio serrato con Noslin per la maglia di centravanti contro il Milan." },
  "CANCELLIERI": { titolaritaPercent: 50, status: 'ballottaggio', ballottaggioCon: "50% Cancellieri - 50% Isaksen", noteGazzetta: "Testa a testa aperto sull'out destro della Lazio contro il Milan." },
  "ISAKSEN": { titolaritaPercent: 50, status: 'ballottaggio', ballottaggioCon: "50% Isaksen - 50% Cancellieri", noteGazzetta: "In ballottaggio alla pari con Cancellieri per il tridente biancoceleste." },
  "MCKENNIE": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Uomo di fiducia di Spalletti per la battaglia dell'Olimpico contro la Roma." },
  "SAMARDZIC": { titolaritaPercent: 70, status: 'ballottaggio', ballottaggioCon: "70% Samardzic - 30% Pasalic", piazzati: true, noteGazzetta: "Favorito per inventare calcio tra le linee al Gewiss contro il Bologna." },
  "PASALIC": { titolaritaPercent: 30, status: 'ballottaggio', ballottaggioCon: "30% Pasalic - 70% Samardzic", noteGazzetta: "Inizialmente in panchina, pronto a subentrare a gara in corso." },
  "FRATTESI": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Titolare certo a centrocampo vista l'assenza per infortunio di Barella." },
  "VLASIC": { titolaritaPercent: 90, status: 'titolare', piazzati: true, noteGazzetta: "Faro del Toro in casa contro il Como, in splendida forma." },
  "BERNARDESCHI": { titolaritaPercent: 80, status: 'titolare', piazzati: true, noteGazzetta: "Qualità ed esperienza a Bergamo contro l'Atalanta." },
  "ZANIOLO": { titolaritaPercent: 80, status: 'titolare', noteGazzetta: "Cerca conferme e bonus al Gewiss Stadium." },
  "GONCALVES P.": { titolaritaPercent: 95, status: 'titolare', rigorista: true, noteGazzetta: "Leader tecnico della Fiorentina a Frosinone: bonus alert!" },
  "CALO'": { titolaritaPercent: 90, status: 'titolare', piazzati: true, noteGazzetta: "Regia e calci piazzati del Frosinone in casa con la Viola." },
  "KVERNADZE": { titolaritaPercent: 85, status: 'titolare', noteGazzetta: "Esterno offensivo ciociaro, pronto a colpire in contropiede." },
  "FAZZINI": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Creatività e regia del Cagliari nella sfida salvezza con il Genoa." },
  "DYBALA": { titolaritaPercent: 75, status: 'ballottaggio', ballottaggioCon: "75% Dybala - 25% Soulé", rigorista: true, noteGazzetta: "Fattore decisivo all'Olimpico nel big match con la Juventus." },
  "THURAM": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Titolare inamovibile al centro dell'attacco nerazzurro a San Siro con l'Udinese." },
  "MARTINEZ L.": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Capitano dell'Inter a San Siro contro l'Udinese: fame di gol." },
  "GONCALO RAMOS": { titolaritaPercent: 95, status: 'titolare', rigorista: true, noteGazzetta: "Punta centrale titolare del Milan all'Olimpico contro la Lazio." },
  "HOJLUND": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Centravanti di Allegri al Maradona contro il Monza: prima scelta assoluta." },
  "BETO": { titolaritaPercent: 85, status: 'titolare', noteGazzetta: "Centravanti potente a Frosinone per scardinare la difesa ciociara." },
  "DAVIS": { titolaritaPercent: 90, status: 'titolare', rigorista: true, noteGazzetta: "Perno offensivo dell'Udinese a San Siro contro l'Inter." },
  "COLOMBO": { titolaritaPercent: 85, status: 'titolare', rigorista: true, noteGazzetta: "Rigorista e centravanti del Genoa nella trasferta di Cagliari." },
  "SIMEONE": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Guida l'attacco granata in casa col Como stante l'assenza di Adams C." },
  "PICCOLI": { titolaritaPercent: 90, status: 'titolare', noteGazzetta: "Titolare al Gewiss contro l'Atalanta vista l'indisponibilità di Dovbyk." },
  "PULISIC": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Capitan America nel big match dell'Olimpico con la Lazio." },
  "MCTOMINAY": { titolaritaPercent: 95, status: 'titolare', noteGazzetta: "Incursore totale al Maradona contro il Monza: tra i più attesi." },
  "SCAMACCA": { titolaritaPercent: 0, status: 'infortunato', noteGazzetta: "Crociato anteriore, lungo decorso riabilitativo fino al 2027." },
  "YILDIZ": { titolaritaPercent: 0, status: 'infortunato', noteGazzetta: "Frattura metatarsale, rientro previsto a fine novembre." },
  "KEAN": { titolaritaPercent: 80, status: 'titolare', noteGazzetta: "Centravanti titolare a Torino per la sfida al Toro." }
};

// 3. Consigli e Schierabilità Redazione Fantagazzetta / Fantacalcio.it (Aggiornati 6ª Giornata)
export const FANTAGAZZETTA_ADVICE: Record<string, Partial<FantagazzettaRating>> = {
  "BARELLA": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Fermo per distrazione al retto femorale. Non convocato contro l'Udinese." },
  "MERET": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Indisponibile contro il Monza per lesione muscolare. Gioca Milinkovic-Savic." },
  "MALINOVSKYI": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Grave frattura del perone, stagione finita. Non schierabile." },
  "DOVBYK": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Fermo per noie al flessore. Non rischiatelo contro l'Atalanta." },
  "SAELEMAEKERS": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Fuori per frattura al malleolo. Non convocato con la Juventus." },
  "ADAMS C.": { stars: 1, fascia: 'Sconsigliato', commentoRedazione: "Fuori per lesione all'adduttore. Al suo posto Simeone." },
  "VASQUEZ": { stars: 3, fascia: 'Schierabile', commentoRedazione: "Scontata la squalifica: perno difensivo affidabile per il modificatore a Cagliari." },
  "CALHANOGLU": { stars: 4, fascia: 'Consigliato', commentoRedazione: "In netto miglioramento. Da schierare con copertura: sui rigori è letale." },
  "FRATTESI": { stars: 5, fascia: 'Top di Giornata', commentoRedazione: "Con Barella out gioca dal 1' a San Siro contro l'Udinese: inserimenti da bonus certo!" },
  "MILINKOVIC-SAVIC V.": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Napoli-Monza al Maradona: ottime probabilità di clean sheet e voto alto." },
  "ORSOLINI": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Rientrato in gruppo: a Bergamo può fare male su piazzato e ripartenza." },
  "GUDMUNDSSON": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Recuperato dal problema muscolare: trasferta a Frosinone ghiotta per il bonus." },
  "SIMEONE": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Titolare col Como all'Olimpico di Torino: garanzia di generosità e gol." },
  "PICCOLI": { stars: 3, fascia: 'Scommessa', commentoRedazione: "Occasione dal primo minuto a Bergamo stante lo stop di Dovbyk." },
  "HOJLUND": { stars: 5, fascia: 'Top di Giornata', commentoRedazione: "In casa col Monza è il terminale offensivo di riferimento. Da mettere capitano." },
  "THURAM": { stars: 5, fascia: 'Top di Giornata', commentoRedazione: "San Siro contro l'Udinese è il suo terreno di caccia ideale. Bonus alert!" },
  "MARTINEZ L.": { stars: 5, fascia: 'Top di Giornata', commentoRedazione: "Lautaro in casa contro l'Udinese cerca la doppietta. Prima scelta assoluta." },
  "RAMOS G.": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Big match contro la Lazio all'Olimpico: freddo e cinico in area di rigore." },
  "PULISIC": { stars: 5, fascia: 'Top di Giornata', commentoRedazione: "Lazio-Milan: l'americano accende la luce con strappi e tiri da fuori." },
  "MCTOMINAY": { stars: 5, fascia: 'Top di Giornata', commentoRedazione: "Napoli-Monza è la partita perfetta per i suoi inserimenti aerei in area." },
  "SVILAR": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Contro la Juve serviranno i suoi miracoli: modificatore assicurato." },
  "CARNESECCHI": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Atalanta in casa col Bologna: portiere reattivo e da ottimo voto." },
  "MAIGNAN": { stars: 3, fascia: 'Schierabile', commentoRedazione: "Trasferta dura all'Olimpico, ma Magic Mike nei big match sale di livello." },
  "VLASIC": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Torino-Como: geometrie e conclusioni dal limite. Schieratelo a centrocampo." },
  "COLOMBO": { stars: 4, fascia: 'Scommessa', commentoRedazione: "A Cagliari da rigorista ed ex: partita tesa ma con occasioni da gol." },
  "GONCALVES P.": { stars: 5, fascia: 'Top di Giornata', commentoRedazione: "A Frosinone la Viola ha bisogno della sua classe. Rigori e punizioni sue." },
  "DAVIS": { stars: 3, fascia: 'Schierabile', commentoRedazione: "A San Siro la difesa dell'Inter è tosta, ma su palla inattiva può farsi valere." },
  "KEAN": { stars: 4, fascia: 'Consigliato', commentoRedazione: "Sfida al Torino: fisico e velocità per mettere in crisi i granata." }
};

export interface SyncedOnlinePlayer {
  name: string;
  titolaritaPercent: number;
  status: 'titolare' | 'ballottaggio' | 'panchina' | 'infortunato' | 'squalificato';
  ballottaggioCon?: string | null;
  source: string;
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
  syncedPlayers: Record<string, SyncedOnlinePlayer>
): SyncedOnlinePlayer | null {
  if (!syncedPlayers) return null;
  const norm = cleanPlayerName(playerName);
  if (syncedPlayers[norm]) return syncedPlayers[norm];

  // Alias comuni Fantacalcio / Gazzetta
  if (norm.includes('MARTINEZ L') || norm === 'LAUTARO') {
    if (syncedPlayers['MARTINEZ L'] || syncedPlayers['MARTINEZ']) return syncedPlayers['MARTINEZ L'] || syncedPlayers['MARTINEZ'];
  }
  if (norm.includes('GONCALO RAMOS') || norm === 'RAMOS G') {
    if (syncedPlayers['RAMOS G'] || syncedPlayers['RAMOS']) return syncedPlayers['RAMOS G'] || syncedPlayers['RAMOS'];
  }
  if (norm.includes('PEDRO GONCALVES') || norm === 'GONCALVES P') {
    if (syncedPlayers['GONCALVES P'] || syncedPlayers['GONCALVES']) return syncedPlayers['GONCALVES P'] || syncedPlayers['GONCALVES'];
  }
  if (norm.includes('DAVIS') || norm === 'DAVIS K') {
    if (syncedPlayers['DAVIS K'] || syncedPlayers['DAVIS']) return syncedPlayers['DAVIS K'] || syncedPlayers['DAVIS'];
  }

  const tokens = norm.split(' ').filter(t => t.length > 2);
  for (const [key, val] of Object.entries(syncedPlayers)) {
    if (key === norm) return val;
    if (tokens.some(t => key === t || key.startsWith(t + ' ') || key.endsWith(' ' + t))) {
      return val;
    }
  }
  return null;
}

// Funzione principale che raccoglie tutti i dati per un calciatore
export function getPlayerMatchdayEvaluation(
  playerName: string, 
  teamName: string,
  syncedData?: SyncedOnlineData | null
): PlayerMatchdayEvaluation {
  const normName = playerName.toUpperCase().trim();
  const fixture = getTeamFixture(teamName);
  const injury = getInjuryInfo(normName);

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
    const synced = matchSyncedPlayer(normName, syncedData.players);
    if (synced) {
      gazzetta.titolaritaPercent = synced.titolaritaPercent;
      gazzetta.status = synced.status;
      if (synced.ballottaggioCon) {
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
  } else if (fgCustom) {
    fantagazzetta = {
      stars: fgCustom.stars ?? 3,
      fascia: fgCustom.fascia ?? 'Schierabile',
      commentoRedazione: fgCustom.commentoRedazione || "Buona opzione per completare il reparto."
    };
  } else {
    // Calcolo automatico in base alla difficoltà fixture
    const diff = fixture ? fixture.difficulty : 3;
    const stars: 1 | 2 | 3 | 4 | 5 = diff <= 2 ? 4 : diff === 3 ? 3 : 2;
    const fascia = diff <= 2 ? 'Consigliato' : diff === 3 ? 'Schierabile' : 'Rischioso';
    fantagazzetta = {
      stars,
      fascia,
      commentoRedazione: `Match di difficoltà ${diff}/5 ${fixture?.isHome ? 'in casa' : 'in trasferta'}. Opzione solida di reparto.`
    };
  }

  // Aggiustamento dinamico Fantagazzetta se da live sync emerge un ballottaggio rischioso o panchina certa
  if (syncedData?.players && !injury) {
    const synced = matchSyncedPlayer(normName, syncedData.players);
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
  const tatticoAdvice = getTatticoAdvice(normName);

  return {
    match: fixture,
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
