// Schemi tattici ufficiali per ogni squadra di Serie A e mappatura posizioni in campo
import { Role } from '../types';

export interface TacticalSlot {
  id: string;
  code: string;
  name: string;
  description: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  classicRole: Role;
  mantraRoles: string[];
}

export interface TeamTactics {
  team: string;
  formation: string; // es. '3-5-2', '3-4-2-1', '4-2-3-1', '4-3-3'
  coach: string;
  slots: TacticalSlot[];
}

// 1. SLOTS PER DIFESA A 3 CON 2 PUNTE (3-5-2 - Inter, Torino, Genoa, Cagliari, Udinese)
export const SLOTS_3_5_2: TacticalSlot[] = [
  // ATTACCO A 2
  {
    id: 'sp',
    code: 'SP',
    name: 'Seconda Punta',
    description: 'Seconda Punta / Raccordo • Movimento tra le linee, rifinitura e attacco della profondità',
    x: 36,
    y: 20,
    classicRole: 'A',
    mantraRoles: ['A', 'W', 'PC']
  },
  {
    id: 'pc',
    code: 'PC',
    name: 'Punta Centrale',
    description: 'Punta Centrale • Riferimento d\'area, finalizzazione e duelli aerei',
    x: 64,
    y: 16,
    classicRole: 'A',
    mantraRoles: ['PC']
  },

  // CENTROCAMPO A 5
  {
    id: 'e_sx',
    code: 'ES',
    name: 'Esterno Sinistro',
    description: 'Esterno a Tutta Fascia • Spinta continua sulla corsia mancina, cross e ripiegamento a 5',
    x: 12,
    y: 48,
    classicRole: 'C',
    mantraRoles: ['E', 'DS', 'W']
  },
  {
    id: 'cc_sx',
    code: 'CS',
    name: 'Mezzala Sinistra',
    description: 'Mezzala Sinistra • Inserimento in area avversaria, rifinitura interna e pressing',
    x: 33,
    y: 53,
    classicRole: 'C',
    mantraRoles: ['C', 'T']
  },
  {
    id: 'reg',
    code: 'REG',
    name: 'Regista / Mediano',
    description: 'Regista Basso • Primo costruttore di gioco, schermo protettivo e regia sui piazzati',
    x: 50,
    y: 62,
    classicRole: 'C',
    mantraRoles: ['M', 'C']
  },
  {
    id: 'cc_dx',
    code: 'CD',
    name: 'Mezzala Destra',
    description: 'Mezzala Destra • Box-to-box dinamico, ribaltamento dell\'azione e tiri da fuori',
    x: 67,
    y: 53,
    classicRole: 'C',
    mantraRoles: ['C', 'T']
  },
  {
    id: 'e_dx',
    code: 'ED',
    name: 'Esterno Destro',
    description: 'Esterno a Tutta Fascia • Ampiezza laterale, uno contro uno e diagonali difensive a 5',
    x: 88,
    y: 48,
    classicRole: 'C',
    mantraRoles: ['E', 'DD', 'W']
  },

  // DIFESA A 3
  {
    id: 'b_sx',
    code: 'BS',
    name: 'Braccetto Sinistro',
    description: 'Braccetto Sinistro (Difesa a 3) • Marcatura, uscita palla al piede e sovrapposizione offensiva',
    x: 24,
    y: 77,
    classicRole: 'D',
    mantraRoles: ['B', 'DC', 'DS']
  },
  {
    id: 'dc',
    code: 'DC',
    name: 'Centrale Difensivo',
    description: 'Centrale / Libero Moderno • Perno della difesa a 3, contrasti aerei e guida del reparto',
    x: 50,
    y: 79,
    classicRole: 'D',
    mantraRoles: ['DC', 'B']
  },
  {
    id: 'b_dx',
    code: 'BD',
    name: 'Braccetto Destro',
    description: 'Braccetto Destro (Difesa a 3) • Anticipo, marcatura preventiva e conduzione palla',
    x: 76,
    y: 77,
    classicRole: 'D',
    mantraRoles: ['B', 'DC', 'DD']
  },

  // PORTIERE
  {
    id: 'por',
    code: 'POR',
    name: 'Portiere',
    description: 'Portiere • Presidio dello specchio, uscite alte e prima impostazione dal basso',
    x: 50,
    y: 90,
    classicRole: 'P',
    mantraRoles: ['POR']
  },
];

// 2. SLOTS PER DIFESA A 3 CON 2 TREQUARTISTI (3-4-2-1 - Atalanta, Napoli, Roma, Fiorentina, Monza, Empoli, Venezia)
export const SLOTS_3_4_2_1: TacticalSlot[] = [
  // PUNTA UNICA
  {
    id: 'pc',
    code: 'PC',
    name: 'Punta Centrale',
    description: 'Centravanti • Finalizzazione, protezione palla spalle alla porta e profondità',
    x: 50,
    y: 15,
    classicRole: 'A',
    mantraRoles: ['PC']
  },

  // 2 TREQUARTISTI
  {
    id: 'trq_sx',
    code: 'TQS',
    name: 'Trequartista Sinistro',
    description: 'Trequartista / Ala Interna SX • Dribbling, tiro a giro e assistenza al centravanti',
    x: 32,
    y: 32,
    classicRole: 'C',
    mantraRoles: ['T', 'A', 'W']
  },
  {
    id: 'trq_dx',
    code: 'TQD',
    name: 'Trequartista Destro',
    description: 'Trequartista / Ala Interna DX • Fantasia tra le linee, ultimo passaggio e inserimenti',
    x: 68,
    y: 32,
    classicRole: 'C',
    mantraRoles: ['T', 'A', 'W']
  },

  // CENTROCAMPO A 4
  {
    id: 'e_sx',
    code: 'ES',
    name: 'Esterno Sinistro',
    description: 'Esterno a Tutta Fascia • Spinta continua sul binario mancino, cross e ripiegamento a 5',
    x: 12,
    y: 52,
    classicRole: 'C',
    mantraRoles: ['E', 'DS', 'W']
  },
  {
    id: 'med_sx',
    code: 'MS',
    name: 'Mediano Sinistro',
    description: 'Centrocampista di Manovra • Interdizione, equilibrio e ribaltamento dell\'azione',
    x: 37,
    y: 58,
    classicRole: 'C',
    mantraRoles: ['M', 'C']
  },
  {
    id: 'med_dx',
    code: 'MD',
    name: 'Mediano Destro',
    description: 'Mediano di Rottura • Contrasti, recupero palloni e schermo davanti alla difesa',
    x: 63,
    y: 58,
    classicRole: 'C',
    mantraRoles: ['M', 'C']
  },
  {
    id: 'e_dx',
    code: 'ED',
    name: 'Esterno Destro',
    description: 'Esterno a Tutta Fascia • Uno contro uno, arrivo sul fondo e diagonale difensiva a 5',
    x: 88,
    y: 52,
    classicRole: 'C',
    mantraRoles: ['E', 'DD', 'W']
  },

  // DIFESA A 3
  {
    id: 'b_sx',
    code: 'BS',
    name: 'Braccetto Sinistro',
    description: 'Braccetto Sinistro (Difesa a 3) • Marcatura dell\'ala avversaria e costruzione palla al piede',
    x: 24,
    y: 77,
    classicRole: 'D',
    mantraRoles: ['B', 'DC', 'DS']
  },
  {
    id: 'dc',
    code: 'DC',
    name: 'Centrale Difensivo',
    description: 'Centrale della Difesa a 3 • Baluardo dell\'area, leadership difensiva e contrasti aerei',
    x: 50,
    y: 79,
    classicRole: 'D',
    mantraRoles: ['DC', 'B']
  },
  {
    id: 'b_dx',
    code: 'BD',
    name: 'Braccetto Destro',
    description: 'Braccetto Destro (Difesa a 3) • Marcatura, anticipo sull\'attaccante e spinta in catena',
    x: 76,
    y: 77,
    classicRole: 'D',
    mantraRoles: ['B', 'DC', 'DD']
  },

  // PORTIERE
  {
    id: 'por',
    code: 'POR',
    name: 'Portiere',
    description: 'Portiere • Presidio dello specchio, uscite e prima impostazione dal basso',
    x: 50,
    y: 90,
    classicRole: 'P',
    mantraRoles: ['POR']
  },
];

// 3. SLOTS PER DIFESA A 4 CON DOPPIO MEDIANO E 3 TREQUARTISTI (4-2-3-1 - Juventus, Milan, Lazio, Bologna, Como, Parma, Lecce, Verona)
export const SLOTS_4_2_3_1: TacticalSlot[] = [
  // PUNTA CENTRALE
  {
    id: 'pc',
    code: 'PC',
    name: 'Punta Centrale',
    description: 'Centravanti • Finalizzazione, attacco al primo palo e riferimento offensivo',
    x: 50,
    y: 15,
    classicRole: 'A',
    mantraRoles: ['PC']
  },

  // LINEA DEI TREQUARTISTI
  {
    id: 'as',
    code: 'AS',
    name: 'Ala Sinistra',
    description: 'Esterno Offensivo Mancino • Dribbling, convergenza verso il centro e tiro a rete',
    x: 18,
    y: 36,
    classicRole: 'A',
    mantraRoles: ['W', 'A']
  },
  {
    id: 'trq',
    code: 'TRQ',
    name: 'Trequartista Centrale',
    description: 'Fantasista / Incursore • Visione di gioco, inserimenti a rimorchio e rifinitura',
    x: 50,
    y: 36,
    classicRole: 'C',
    mantraRoles: ['T', 'C']
  },
  {
    id: 'ad',
    code: 'AD',
    name: 'Ala Destra',
    description: 'Esterno Offensivo Destro • Rapidità, uno contro uno, cross e assist',
    x: 82,
    y: 36,
    classicRole: 'A',
    mantraRoles: ['W', 'A']
  },

  // DOPPIO MEDIANO
  {
    id: 'med_sx',
    code: 'MS',
    name: 'Mediano Sinistro',
    description: 'Mediano / Centrocampista • Equilibrio, doppia fase e filtro a centrocampo',
    x: 36,
    y: 59,
    classicRole: 'C',
    mantraRoles: ['M', 'C']
  },
  {
    id: 'med_dx',
    code: 'MD',
    name: 'Mediano Destro',
    description: 'Mediano / Regista • Smistamento del pallone e protezione della retroguardia',
    x: 64,
    y: 59,
    classicRole: 'C',
    mantraRoles: ['M', 'C']
  },

  // DIFESA A 4
  {
    id: 'ts',
    code: 'TS',
    name: 'Terzino Sinistro',
    description: 'Terzino Sinistro (Difesa a 4) • Diagonale difensiva e sovrapposizione sul binario mancino',
    x: 15,
    y: 76,
    classicRole: 'D',
    mantraRoles: ['DS', 'B']
  },
  {
    id: 'dc_sx',
    code: 'DC',
    name: 'Centrale Sinistro',
    description: 'Difensore Centrale Sinistro (Difesa a 4) • Chiusure interne, contrasti e marcatura a zona',
    x: 38,
    y: 78,
    classicRole: 'D',
    mantraRoles: ['DC', 'B']
  },
  {
    id: 'dc_dx',
    code: 'DC',
    name: 'Centrale Destro',
    description: 'Difensore Centrale Destro (Difesa a 4) • Anticipo, marcatura sull\'uomo e impatto aereo',
    x: 62,
    y: 78,
    classicRole: 'D',
    mantraRoles: ['DC', 'B']
  },
  {
    id: 'td',
    code: 'TD',
    name: 'Terzino Destro',
    description: 'Terzino Destro (Difesa a 4) • Copertura laterale, duelli sull\'esterno e spinta offensiva',
    x: 85,
    y: 76,
    classicRole: 'D',
    mantraRoles: ['DD', 'B']
  },

  // PORTIERE
  {
    id: 'por',
    code: 'POR',
    name: 'Portiere',
    description: 'Portiere • Presidio dello specchio e gestione della linea difensiva',
    x: 50,
    y: 90,
    classicRole: 'P',
    mantraRoles: ['POR']
  },
];

// 4. SLOTS PER DIFESA A 4 CON CENTROCAMPO A 3 (4-3-3 - Sassuolo, varianti)
export const SLOTS_4_3_3: TacticalSlot[] = [
  // TRIDENTE ATTACCO
  {
    id: 'as',
    code: 'AS',
    name: 'Ala Sinistra',
    description: 'Attaccante Esterno SX • Attacco del secondo palo, dribbling e rifinitura',
    x: 20,
    y: 22,
    classicRole: 'A',
    mantraRoles: ['W', 'A']
  },
  {
    id: 'pc',
    code: 'PC',
    name: 'Punta Centrale',
    description: 'Centravanti • Finalizzazione e terminale d\'attacco',
    x: 50,
    y: 15,
    classicRole: 'A',
    mantraRoles: ['PC']
  },
  {
    id: 'ad',
    code: 'AD',
    name: 'Ala Destra',
    description: 'Attaccante Esterno DX • Ampiezza, uno contro uno e cross dal fondo',
    x: 80,
    y: 22,
    classicRole: 'A',
    mantraRoles: ['W', 'A']
  },

  // CENTROCAMPO A 3
  {
    id: 'cc_sx',
    code: 'CS',
    name: 'Mezzala Sinistra',
    description: 'Mezzala Sinistra • Incursore e raccordo con l\'ala',
    x: 33,
    y: 49,
    classicRole: 'C',
    mantraRoles: ['C', 'T']
  },
  {
    id: 'reg',
    code: 'REG',
    name: 'Regista Basso',
    description: 'Vertice Basso di Centrocampo • Geometrie, regia e filtro difensivo',
    x: 50,
    y: 60,
    classicRole: 'C',
    mantraRoles: ['M', 'C']
  },
  {
    id: 'cc_dx',
    code: 'CD',
    name: 'Mezzala Destra',
    description: 'Mezzala Destra • Inserimento senza palla e tiro da fuori',
    x: 67,
    y: 49,
    classicRole: 'C',
    mantraRoles: ['C', 'T']
  },

  // DIFESA A 4
  {
    id: 'ts',
    code: 'TS',
    name: 'Terzino Sinistro',
    description: 'Terzino Sinistro • Copertura e catena laterale mancina',
    x: 15,
    y: 76,
    classicRole: 'D',
    mantraRoles: ['DS', 'B']
  },
  {
    id: 'dc_sx',
    code: 'DC',
    name: 'Centrale Sinistro',
    description: 'Centrale Sinistro (Difesa a 4) • Marcatura, uscite palla al piede e chiusure',
    x: 38,
    y: 78,
    classicRole: 'D',
    mantraRoles: ['DC', 'B']
  },
  {
    id: 'dc_dx',
    code: 'DC',
    name: 'Centrale Destro',
    description: 'Centrale Destro (Difesa a 4) • Anticipo, marcatura sull\'uomo e duelli aerei',
    x: 62,
    y: 78,
    classicRole: 'D',
    mantraRoles: ['DC', 'B']
  },
  {
    id: 'td',
    code: 'TD',
    name: 'Terzino Destro',
    description: 'Terzino Destro • Diagonali e spinta a destra',
    x: 85,
    y: 76,
    classicRole: 'D',
    mantraRoles: ['DD', 'B']
  },

  // PORTIERE
  {
    id: 'por',
    code: 'POR',
    name: 'Portiere',
    description: 'Portiere • Presidio dello specchio e gestione della linea',
    x: 50,
    y: 90,
    classicRole: 'P',
    mantraRoles: ['POR']
  },
];

// 5. DATABASE DEGLI SCHEMI TATTICI DI OGNI SQUADRA DI SERIE A (STAGIONE 2026/2027)
export const TEAM_TACTICS_DATABASE: Record<string, TeamTactics> = {
  'Napoli': {
    team: 'Napoli',
    formation: '4-3-3',
    coach: 'Massimiliano Allegri',
    slots: SLOTS_4_3_3
  },
  'Inter': {
    team: 'Inter',
    formation: '3-5-2',
    coach: 'Cristian Chivu',
    slots: SLOTS_3_5_2
  },
  'Juventus': {
    team: 'Juventus',
    formation: '4-3-3',
    coach: 'Luciano Spalletti',
    slots: SLOTS_4_3_3
  },
  'Milan': {
    team: 'Milan',
    formation: '3-4-2-1',
    coach: 'Rúben Amorim',
    slots: SLOTS_3_4_2_1
  },
  'Atalanta': {
    team: 'Atalanta',
    formation: '4-3-3',
    coach: 'Maurizio Sarri',
    slots: SLOTS_4_3_3
  },
  'Roma': {
    team: 'Roma',
    formation: '3-4-2-1',
    coach: 'Gian Piero Gasperini',
    slots: SLOTS_3_4_2_1
  },
  'Lazio': {
    team: 'Lazio',
    formation: '4-3-3',
    coach: 'Gennaro Gattuso',
    slots: SLOTS_4_3_3
  },
  'Bologna': {
    team: 'Bologna',
    formation: '4-2-3-1',
    coach: 'Domenico Tedesco',
    slots: SLOTS_4_2_3_1
  },
  'Fiorentina': {
    team: 'Fiorentina',
    formation: '4-2-3-1',
    coach: 'Fabio Grosso',
    slots: SLOTS_4_2_3_1
  },
  'Torino': {
    team: 'Torino',
    formation: '3-5-2',
    coach: 'Ignazio Abate',
    slots: SLOTS_3_5_2
  },
  'Genoa': {
    team: 'Genoa',
    formation: '3-5-2',
    coach: 'Daniele De Rossi',
    slots: SLOTS_3_5_2
  },
  'Cagliari': {
    team: 'Cagliari',
    formation: '3-5-2',
    coach: 'Fabio Pisacane',
    slots: SLOTS_3_5_2
  },
  'Monza': {
    team: 'Monza',
    formation: '3-4-2-1',
    coach: 'Ivan Jurić',
    slots: SLOTS_3_4_2_1
  },
  'Como': {
    team: 'Como',
    formation: '4-2-3-1',
    coach: 'Cesc Fàbregas',
    slots: SLOTS_4_2_3_1
  },
  'Lecce': {
    team: 'Lecce',
    formation: '4-3-3',
    coach: 'Eusebio Di Francesco',
    slots: SLOTS_4_3_3
  },
  'Parma': {
    team: 'Parma',
    formation: '4-2-3-1',
    coach: 'Carlos Cuesta',
    slots: SLOTS_4_2_3_1
  },
  'Udinese': {
    team: 'Udinese',
    formation: '3-5-2',
    coach: 'Kosta Runjaić',
    slots: SLOTS_3_5_2
  },
  'Venezia': {
    team: 'Venezia',
    formation: '3-5-2',
    coach: 'Giovanni Stroppa',
    slots: SLOTS_3_5_2
  },
  'Empoli': {
    team: 'Empoli',
    formation: '3-4-2-1',
    coach: 'Roberto D\'Aversa',
    slots: SLOTS_3_4_2_1
  },
  'Verona': {
    team: 'Verona',
    formation: '4-2-3-1',
    coach: 'Paolo Zanetti',
    slots: SLOTS_4_2_3_1
  },
  'Hellas Verona': {
    team: 'Hellas Verona',
    formation: '4-2-3-1',
    coach: 'Paolo Zanetti',
    slots: SLOTS_4_2_3_1
  },
  'Sassuolo': {
    team: 'Sassuolo',
    formation: '4-3-3',
    coach: 'Alberto Aquilani',
    slots: SLOTS_4_3_3
  },
  'Frosinone': {
    team: 'Frosinone',
    formation: '3-4-2-1',
    coach: 'Massimiliano Alvini',
    slots: SLOTS_3_4_2_1
  },
  'Cremonese': {
    team: 'Cremonese',
    formation: '3-5-2',
    coach: 'Davide Nicola',
    slots: SLOTS_3_5_2
  }
};

// Funzione di lookup della tattica di squadra
export function getTeamTactics(teamName: string | undefined): TeamTactics {
  if (!teamName) {
    return TEAM_TACTICS_DATABASE['Inter'];
  }

  // Corrispondenza diretta
  if (TEAM_TACTICS_DATABASE[teamName]) {
    return TEAM_TACTICS_DATABASE[teamName];
  }

  // Ricerca fuzzy o parziale
  const clean = teamName.toLowerCase().trim();
  for (const [key, val] of Object.entries(TEAM_TACTICS_DATABASE)) {
    if (clean.includes(key.toLowerCase()) || key.toLowerCase().includes(clean)) {
      return val;
    }
  }

  // Default a 4-2-3-1 se non trovata
  return {
    team: teamName,
    formation: '4-2-3-1',
    coach: 'Allenatore',
    slots: SLOTS_4_2_3_1
  };
}

// 6. ASSEGNAZIONI SPECIFICHE DEI CALCIATORI AI POSTI IN CAMPO
// Mappatura puntuale dei calciatori di Serie A allo slot corretto del loro schema
export const PLAYER_SPECIFIC_SLOTS: Record<string, string> = {
  // === INTER (3-5-2) ===
  'BASTONI': 'b_sx', // BRACCETTO SINISTRO (esplicitamente richiesto dall'utente)
  'CARLOS AUGUSTO': 'b_sx',
  'PAVARD': 'b_dx', // Braccetto destro
  'BISSECK': 'b_dx', // Braccetto destro
  'ACERBI': 'dc', // Difensore centrale
  'DE VRIJ': 'dc', // Difensore centrale
  'DIMARCO': 'e_sx', // Esterno sinistro
  'DUMFRIES': 'e_dx', // Esterno destro
  'DARMIAN': 'e_dx', // Esterno destro / braccetto destro
  'CALHANOGLU': 'reg', // Regista
  'ASLLANI': 'reg', // Regista
  'BARELLA': 'cc_dx', // Mezzala destra
  'FRATTESI': 'cc_dx', // Mezzala destra
  'MKHITARYAN': 'cc_sx', // Mezzala sinistra
  'ZIELINSKI': 'cc_sx', // Mezzala sinistra
  'THURAM': 'sp', // Seconda punta
  'LAUTARO MARTINEZ': 'pc', // Punta centrale
  'LAUTARO': 'pc',
  'TAREMI': 'pc',
  'ARNAUTOVIC': 'pc',
  'SOMMER': 'por',
  'MARTINEZ JOSEP': 'por',

  // === ATALANTA (4-3-3 - All. Maurizio Sarri) ===
  'KOLASINAC': 'dc_sx', // Centrale sinistro a 4
  'GODFREY': 'dc_sx',
  'HIEN': 'dc_sx',
  'DJIMSITI': 'dc_dx', // Centrale destro a 4
  'KOSSOUNOU': 'dc_dx',
  'TOLOI': 'dc_dx',
  'SCALVINI': 'dc_dx',
  'BELLANOVA': 'td', // Terzino destro a 4
  'ZAPPACOSTA': 'td',
  'PALESTRA': 'td',
  'RUGGERI': 'ts', // Terzino sinistro a 4
  'EDERSON': 'cc_sx', // Mezzala sinistra
  'DE ROON': 'reg', // Regista vertice basso
  'PASALIC': 'cc_dx', // Mezzala destra
  'SAMARDZIC': 'cc_dx',
  'BRESCIANINI': 'cc_sx',
  'SULEMANA': 'cc_dx',
  'LOOKMAN': 'as', // Ala sinistra nel tridente
  'DE KETELAERE': 'ad', // Ala destra nel tridente
  'ZANIOLO': 'ad',
  'CUADRADO': 'ad',
  'RETEGUI': 'pc', // Centravanti
  'SCAMACCA': 'pc',
  'CARNESECCHI': 'por',
  'RUI PATRICIO': 'por',

  // === NAPOLI (4-3-3 - All. Massimiliano Allegri) ===
  'BUONGIORNO': 'dc_sx', // Centrale sinistro difesa a 4
  'JUAN JESUS': 'dc_sx',
  'BADIASHILE': 'dc_sx', // Centrale sinistro difesa a 4
  'RRAHMANI': 'dc_dx', // Centrale destro difesa a 4
  'MARIN RAFA': 'dc_dx',
  'RAFA MARIN': 'dc_dx',
  'DI LORENZO': 'td', // Terzino destro a 4
  'MAZZOCCHI': 'td',
  'SPINAZZOLA': 'ts', // Terzino sinistro a 4
  'OLIVERA': 'ts',
  'MARIO RUI': 'ts',
  'ANGUISSA': 'cc_sx', // Mezzala sinistra
  'LOBOTKA': 'reg', // Regista basso
  'GILMOUR': 'reg',
  'MCTOMINAY': 'cc_dx', // Mezzala destra box-to-box
  'FOLORUNSHO': 'cc_dx',
  'POLITANO': 'ad', // Ala destra
  'NERES': 'ad',
  'NGONGE': 'ad',
  'KVARATSKHELIA': 'as', // Ala sinistra
  'RASPADORI': 'as',
  'LUKAKU': 'pc', // Centravanti
  'HOJLUND': 'pc',
  'SIMEONE': 'pc',
  'MERET': 'por',
  'CAPRILE': 'por',

  // === ROMA (3-4-2-1 - All. Gian Piero Gasperini) ===
  'ANGELINO': 'b_sx', // Braccetto sinistro
  'HERMOSO': 'b_sx', // Braccetto sinistro
  'NDICKA': 'dc', // Centrale difensivo
  'HUMMELS': 'dc', // Centrale difensivo
  'MANCINI': 'b_dx', // Braccetto destro
  'CELIK': 'e_dx',
  'SAELEMAEKERS': 'e_dx',
  'EL SHAARAWY': 'e_sx',
  'ZALEWSKI': 'e_sx',
  'DAHL': 'e_sx',
  'KONE': 'med_dx',
  'KONE M.': 'med_dx',
  'CRISTANTE': 'med_sx',
  'PAREDES': 'med_sx',
  'LE FEE': 'med_dx',
  'PISILLI': 'trq_sx',
  'PELLEGRINI': 'trq_sx',
  'DYBALA': 'trq_dx',
  'BALDANZI': 'trq_dx',
  'SOULE': 'trq_dx',
  'DOVBYK': 'pc',
  'SHOMURODOV': 'pc',
  'SVILAR': 'por',
  'RYAN': 'por',

  // === JUVENTUS (4-3-3 - All. Luciano Spalletti) ===
  'BREMER': 'dc_sx', // Centrale sinistro a 4
  'GATTI': 'dc_dx', // Centrale destro a 4
  'KALULU': 'dc_dx', // Centrale destro / terzino
  'DANILO': 'td', // Terzino destro
  'SAVONA': 'td', // Terzino destro
  'CAMBIASO': 'ts', // Terzino sinistro
  'CABAL': 'ts', // Terzino sinistro
  'ROUHI': 'ts',
  'LOCATELLI': 'reg', // Regista basso
  'FAGIOLI': 'reg',
  'THURAM K.': 'cc_sx', // Mezzala sinistra
  'DOUGLAS LUIZ': 'cc_dx', // Mezzala destra
  'MCKENNIE': 'cc_dx',
  'KOOPMEINERS': 'cc_sx', // Mezzala offensiva
  'ADZIC': 'cc_sx',
  'CONCEICAO': 'ad', // Ala destra
  'GONZALEZ N.': 'ad',
  'NICO GONZALEZ': 'ad',
  'WEAH': 'ad',
  'MBANGULA': 'as', // Ala sinistra
  'YILDIZ': 'as',
  'VLAHOVIC': 'pc', // Centravanti
  'MILIK': 'pc',
  'DI GREGORIO': 'por',
  'PERIN': 'por',

  // === MILAN (3-4-2-1 - All. Rúben Amorim) ===
  'PAVLOVIC': 'b_sx', // Braccetto sinistro
  'THIAW': 'b_sx',
  'TOMORI': 'dc', // Centrale difensivo a 3
  'GABBIA': 'dc',
  'CALABRIA': 'b_dx', // Braccetto destro
  'EMERSON ROYAL': 'e_dx', // Esterno a tutta fascia
  'TERRACCIANO': 'e_dx',
  'HERNANDEZ THEO': 'e_sx', // Esterno a tutta fascia mancino
  'THEO HERNANDEZ': 'e_sx',
  'JIMENEZ': 'e_sx',
  'FOFANA': 'med_sx', // Mediano
  'REIJNDERS': 'med_dx', // Mediano di costruzione
  'BENNACER': 'med_sx',
  'MUSAH': 'med_dx',
  'LOFTUS-CHEEK': 'trq_dx', // Trequartista destro
  'PULISIC': 'trq_dx',
  'CHUKWUEZE': 'trq_dx',
  'LEAO': 'trq_sx', // Trequartista sinistro / ala interna
  'OKAFOR': 'trq_sx',
  'MORATA': 'pc', // Centravanti
  'ABRAHAM': 'pc',
  'JOVIC': 'pc',
  'CAMARDA': 'pc',
  'MAIGNAN': 'por',
  'TORRIANI': 'por',

  // === LAZIO (4-3-3 - All. Gennaro Gattuso) ===
  'ROMAGNOLI': 'dc_sx', // Centrale sinistro a 4
  'GIGOT': 'dc_sx',
  'GILA': 'dc_dx', // Centrale destro a 4
  'PATRIC': 'dc_dx',
  'TAVARES N.': 'ts', // Terzino sinistro
  'NUNO TAVARES': 'ts',
  'PELLEGRINI LU.': 'ts',
  'LAZZARI': 'td', // Terzino destro
  'MARUSIC': 'td',
  'HYSAJ': 'td',
  'ROVELLA': 'reg', // Regista basso
  'GUENDOUZI': 'cc_dx', // Mezzala destra
  'VECINO': 'cc_sx', // Mezzala sinistra
  'CASTROVILLI': 'cc_sx',
  'DELE-BASHIRU': 'cc_dx',
  'ISAKSEN': 'ad', // Ala destra
  'TCHAOUNA': 'ad',
  'ZACCAGNI': 'as', // Ala sinistra
  'PEDRO': 'as',
  'NOSLIN': 'as',
  'DIA': 'pc', // Punta centrale
  'CASTELLANOS': 'pc',
  'PROVEDEL': 'por',
  'MANDAS': 'por',

  // === FIORENTINA (4-2-3-1 - All. Fabio Grosso) ===
  'RANIERI L.': 'dc_sx', // Centrale sinistro a 4
  'RANIERI': 'dc_sx',
  'BIRAGHI': 'ts', // Terzino sinistro
  'PONGRAČIĆ': 'dc_dx', // Centrale destro a 4
  'PONGRACIC': 'dc_dx',
  'COMUZZO': 'dc_dx',
  'MARTINEZ QUARTA': 'dc_dx',
  'QUARTA': 'dc_dx',
  'MORENO M.': 'dc_dx',
  'DODO': 'td', // Terzino destro
  'KAYODE': 'td',
  'GOSENS': 'ts', // Terzino sinistro
  'PARISI': 'ts',
  'CATALDI': 'med_sx',
  'MANDRAGORA': 'med_dx',
  'ADLI': 'med_dx',
  'RICHARDSON': 'med_sx',
  'BOVE': 'trq',
  'COLPANI': 'ad',
  'IKONE': 'ad',
  'SOTTIL': 'as',
  'GUDMUNDSSON': 'trq',
  'BELTRAN': 'trq',
  'KEAN': 'pc',
  'KOUAME': 'pc',
  'DE GEA': 'por',
  'TERRACCIANO P.': 'por',

  // === TORINO (3-5-2) ===
  'MASINA': 'b_sx', // Braccetto sinistro
  'COCO': 'dc', // Centrale difensivo
  'MARIPAN': 'dc',
  'VOJVODA': 'b_dx', // Braccetto destro
  'WALUKIEWICZ': 'b_dx',
  'DEMBELE': 'b_dx',
  'LAZARO': 'e_dx',
  'PEDERSEN': 'e_dx',
  'SOSA B.': 'e_sx',
  'BORNA SOSA': 'e_sx',
  'RICCI S.': 'reg',
  'RICCI': 'reg',
  'TAMEZE': 'cc_dx',
  'LINETTY': 'cc_dx',
  'ILIC': 'cc_sx',
  'GINEITIS': 'cc_sx',
  'VLASIC': 'sp',
  'KARAMOH': 'sp',
  'ADAMS C.': 'sp',
  'CHE ADAMS': 'sp',
  'SANABRIA': 'sp',
  'ZAPATA D.': 'pc',
  'DUVAN ZAPATA': 'pc',
  'MILINKOVIC-SAVIC V.': 'por',
  'PALEARI': 'por',

  // === BOLOGNA (4-2-3-1) ===
  'LUCUMI': 'dc_sx',
  'CASALE': 'dc_sx',
  'BEUKEMA': 'dc_dx',
  'ERLIC': 'dc_dx',
  'MIRANDA J.': 'ts',
  'LYKOGIANNIS': 'ts',
  'POSCH': 'td',
  'HOLM': 'td',
  'FREULER': 'med_sx',
  'AEBISCHER': 'med_dx',
  'POBEGA': 'med_sx',
  'MORO N.': 'med_dx',
  'FERGUSON': 'trq',
  'FABBIAN': 'trq',
  'URBANSKI': 'trq',
  'ORSOLINI': 'ad',
  'ILING-JUNIOR': 'ad',
  'NDOYE': 'as',
  'KARLSSON': 'as',
  'DOMINGUEZ B.': 'as',
  'ODGAARD': 'trq',
  'CASTRO S.': 'pc',
  'DALLINGA': 'pc',
  'SKORUPSKI': 'por',
  'RAVAGLIA F.': 'por',

  // === UDINESE (3-5-2) ===
  'GIANNETTI': 'b_sx', // Braccetto sinistro
  'TOURE I.': 'b_sx',
  'BIJOL': 'dc', // Centrale difensivo
  'KRISTENSEN T.': 'b_dx', // Braccetto destro
  'KABASELE': 'b_dx',
  'KAMARA H.': 'e_sx',
  'ZEMURA': 'e_sx',
  'EHIZIBUE': 'e_dx',
  'RUI MODESTO': 'e_dx',
  'KARLSTROM': 'reg',
  'LOVRIC': 'cc_sx',
  'PAYERO': 'cc_dx',
  'ZARRAGA': 'cc_dx',
  'EKKELENKAMP': 'sp',
  'THAUVIN': 'sp',
  'BRAVO I.': 'sp',
  'LUCCA': 'pc',
  'DAVIS K.': 'pc',
  'OKOYE': 'por',
  'SAVA': 'por',

  // === GENOA (3-5-2) ===
  'VASQUEZ': 'b_sx', // Braccetto sinistro
  'MATTURRO': 'b_sx',
  'BANI': 'dc', // Centrale difensivo
  'VOGLIACCO': 'b_dx', // Braccetto destro
  'DE WINTER': 'b_dx',
  'MARTIN A.': 'e_sx',
  'AARON MARTIN': 'e_sx',
  'SABELLI': 'e_dx',
  'ZANOLI': 'e_dx',
  'NORTON-CUFFY': 'e_dx',
  'BADELJ': 'reg',
  'FRENDRUP': 'cc_dx',
  'THORSBY': 'cc_dx',
  'MIRETTI': 'cc_sx',
  'MALINOVSKYI': 'cc_sx',
  'BOHINEN': 'reg',
  'VITINHA': 'sp',
  'EKUBAN': 'sp',
  'PINAMONTI': 'pc',
  'GOLLINI': 'por',
  'LEALI': 'por',

  // === CAGLIARI (3-5-2) ===
  'LUPERTO': 'b_sx', // Braccetto sinistro
  'OBERT': 'b_sx',
  'MINA': 'dc', // Centrale difensivo
  'PALOMINO': 'dc',
  'WIETESKA': 'dc',
  'ZAPPA': 'b_dx', // Braccetto destro
  'AUGELLO': 'e_sx',
  'AZZI': 'e_sx',
  'ZORTEA': 'e_dx',
  'FELICI': 'e_dx',
  'MARIN': 'reg',
  'PRATI': 'reg',
  'MAKOUMBOU': 'cc_dx',
  'ADOPO': 'cc_dx',
  'DEIOLA': 'cc_sx',
  'JANKTO': 'cc_sx',
  'GAETANO': 'sp',
  'VIOLA': 'sp',
  'LUVUMBO': 'sp',
  'PICCOLI': 'pc',
  'LAPADULA': 'pc',
  'PAVOLETTI': 'pc',
  'SCUFFET': 'por',
  'SHERRI': 'por',

  // === EMPOLI (3-4-2-1) ===
  'VITI': 'b_sx', // Braccetto sinistro
  'CACACE': 'b_sx',
  'ISMAJLI': 'dc', // Centrale difensivo
  'GOGLICHIDZE': 'b_dx', // Braccetto destro
  'MARIANUCCI': 'b_dx',
  'PEZZELLA GIU.': 'e_sx',
  'GYASI': 'e_dx',
  'SAMBIA': 'e_dx',
  'GRASSI': 'med_sx',
  'HENDERSON L.': 'med_dx',
  'MALEH': 'med_sx',
  'ANJORIN': 'med_dx',
  'HAAS': 'med_sx',
  'FAZZINI': 'trq_sx',
  'ESPOSITO SEB.': 'trq_dx',
  'ZURKOWSKI': 'trq_dx',
  'SOLBAKKEN': 'trq_dx',
  'COLOMBO': 'pc',
  'PELLEGRI': 'pc',
  'VASQUEZ D.': 'por',
  'SEGAHETTI': 'por',

  // === MONZA (3-4-2-1) ===
  'CARBONI A.': 'b_sx', // Braccetto sinistro
  'CALDIROLA': 'b_sx',
  'MARI PABLO': 'dc', // Centrale difensivo
  'PABLO MARI': 'dc',
  'IZZO': 'b_dx', // Braccetto destro
  'D\'AMBROSIO': 'b_dx',
  'KYRIAKOPOULOS': 'e_sx',
  'PEDRO PEREIRA': 'e_dx',
  'BIRINDELLI': 'e_dx',
  'PESSINA': 'med_sx',
  'BONDO': 'med_dx',
  'BIANCO': 'med_sx',
  'SENSI': 'med_sx',
  'VALOTI': 'trq_dx',
  'MALDINI D.': 'trq_sx',
  'CAPRARI': 'trq_dx',
  'CIURRIA': 'trq_dx',
  'VIGNATO S.': 'trq_sx',
  'FORSON': 'trq_dx',
  'DJURIC': 'pc',
  'PETAGNA': 'pc',
  'MARIC': 'pc',
  'TURATI': 'por',
  'PIZZIGNACCO': 'por',

  // === VENEZIA (3-5-2 - All. Giovanni Stroppa) ===
  'SVERKO': 'b_sx', // Braccetto sinistro
  'CARBONI F.': 'b_sx',
  'SVOBODA': 'dc', // Centrale difensivo
  'ALTENBURGER': 'dc',
  'IDZES': 'b_dx', // Braccetto destro
  'SCHINGTIENNE': 'b_dx',
  'ZAMPANO': 'e_sx',
  'HAPS': 'e_sx',
  'CANDELA': 'e_dx',
  'SAGRADO': 'e_dx',
  'DUNCAN': 'cc_sx', // Mezzala sinistra
  'NICOLUSSI CAVIGLIA': 'reg', // Regista basso
  'ANDERSEN M.': 'cc_dx', // Mezzala destra
  'BUSIO': 'cc_sx',
  'ELLERTSSON': 'cc_sx',
  'BJARKASON': 'cc_dx',
  'ORISTANIO': 'sp', // Seconda punta
  'YEBOAH J.': 'sp',
  'POHJANPALO': 'pc', // Centravanti
  'GYTKJAER': 'pc',
  'RAIMONDO': 'pc',
  'JORONEN': 'por',
  'STANKOVIC F.': 'por',

  // === COMO (4-2-3-1) ===
  'KEMPF': 'dc_sx',
  'BARBA': 'dc_sx',
  'DOSSENA': 'dc_dx',
  'GOLDANIGA': 'dc_dx',
  'MORENO AL.': 'ts',
  'SALA M.': 'ts',
  'VAN DER BREMPT': 'td',
  'IOVINE': 'td',
  'SERGI ROBERTO': 'med_sx',
  'PERRONE': 'med_dx',
  'MAZZITELLI': 'med_sx',
  'BASSELLI': 'med_dx',
  'ENGELHARDT': 'med_dx',
  'FADERA': 'as',
  'DA CUNHA': 'as',
  'PAZ N.': 'trq',
  'NICO PAZ': 'trq',
  'VERDI': 'trq',
  'STREFEZZA': 'ad',
  'CUTRONE': 'pc',
  'BELOTTI': 'pc',
  'CERRI': 'pc',
  'AUDERO': 'por',
  'REINA': 'por',

  // === PARMA (4-2-3-1) ===
  'CIRCATI': 'dc_sx',
  'OSORIO': 'dc_sx',
  'VALENTI': 'dc_sx',
  'BALOGH': 'dc_dx',
  'LEONI': 'dc_dx',
  'VALERI': 'ts',
  'COULIBALY W.': 'ts',
  'DELPRATO': 'td',
  'HAINAUT': 'td',
  'BERNABE': 'med_sx',
  'KEITA M.': 'med_dx',
  'ESTEVEZ': 'med_dx',
  'HERNANI': 'med_sx',
  'SOHM': 'trq',
  'CAMARA D.': 'trq',
  'MIHAILA': 'as',
  'CANCELLIERI': 'as',
  'MAN': 'ad',
  'ALMQVIST': 'ad',
  'BONNY': 'pc',
  'BENEDYCZAK': 'pc',
  'CHARPENTIER': 'pc',
  'SUZUKI': 'por',
  'CHICHIZOLA': 'por',

  // === LECCE (4-3-3 - All. Eusebio Di Francesco) ===
  'GASPAR K.': 'dc_sx',
  'JEAN': 'dc_sx',
  'BASCHIROTTO': 'dc_dx',
  'BONIFAZI': 'dc_dx',
  'GALLO': 'ts',
  'DORGU': 'ad', // Ala destra nel tridente
  'GUILBERT': 'td',
  'PELMARD': 'td',
  'RAMADANI': 'reg', // Regista vertice basso
  'PIERRET': 'cc_dx', // Mezzala destra
  'COULIBALY L.': 'cc_sx', // Mezzala sinistra
  'KABA': 'cc_dx',
  'MARCHWINSKI': 'cc_sx',
  'RAFIA': 'cc_sx',
  'HELGAZON': 'cc_sx',
  'BANDA': 'as', // Ala sinistra
  'MORENTE T.': 'as',
  'OUDIN': 'ad', // Ala destra
  'PIEROTTI': 'ad',
  'KRSTOVIC': 'pc', // Centravanti
  'REBIC': 'pc',
  'BURNETE': 'pc',
  'FALCONE': 'por',
  'FRUCHTL': 'por',

  // === HELLAS VERONA (4-2-3-1) ===
  'COPPOLA D.': 'dc_sx',
  'DANILIUC': 'dc_sx',
  'DAWIDOWICZ': 'dc_dx',
  'MAGNANI': 'dc_dx',
  'GHILARDI': 'dc_dx',
  'FRESE': 'ts',
  'BRADARIC': 'ts',
  'TCHATCHOUA': 'td',
  'FARAONI': 'td',
  'BELAHYANE': 'med_sx',
  'DUDA': 'med_dx',
  'SERDAR': 'med_sx',
  'SILVA D.': 'med_dx',
  'SUSLOV': 'trq',
  'KASTANOS': 'trq',
  'HARROUI': 'trq',
  'LAZOVIC': 'as',
  'LIVRAMENTO': 'ad',
  'SARR A.': 'ad',
  'TENGSTEDT': 'pc',
  'MOSQUERA': 'pc',
  'MONTIPO': 'por',
  'BERARDI A.': 'por'
};

// Funzione per normalizzare un id slot all'interno della formazione della squadra se necessario
export function normalizeSlotForFormation(slotId: string, targetSlots: TacticalSlot[]): string | null {
  if (targetSlots.some(s => s.id === slotId)) {
    return slotId;
  }

  // Se lo slot cercato non esiste nella formazione (es. slot di difesa a 3 in formazione a 4 o viceversa)
  const mapping: Record<string, string[]> = {
    // Difesa a 3 -> Difesa a 4
    'b_sx': ['dc_sx', 'ts'],
    'b_dx': ['dc_dx', 'td'],
    'dc': ['dc_dx', 'dc_sx'],
    'e_sx': ['ts', 'as'],
    'e_dx': ['td', 'ad'],
    // Difesa a 4 -> Difesa a 3
    'dc_sx': ['b_sx', 'dc'],
    'dc_dx': ['b_dx', 'dc'],
    'ts': ['e_sx', 'b_sx'],
    'td': ['e_dx', 'b_dx'],
    // Centrocampo & Trequarti
    'med_sx': ['cc_sx', 'reg'],
    'med_dx': ['cc_dx', 'reg'],
    'reg': ['med_dx', 'med_sx', 'cc_sx'],
    'cc_sx': ['med_sx', 'trq_sx', 'reg'],
    'cc_dx': ['med_dx', 'trq_dx', 'reg'],
    'trq': ['trq_sx', 'trq_dx', 'cc_sx', 'as'],
    'trq_sx': ['as', 'trq', 'cc_sx', 'sp'],
    'trq_dx': ['ad', 'trq', 'cc_dx', 'sp'],
    'sp': ['pc', 'trq_sx', 'as'],
    'as': ['trq_sx', 'sp', 'pc'],
    'ad': ['trq_dx', 'sp', 'pc'],
  };

  const alternatives = mapping[slotId];
  if (alternatives) {
    for (const alt of alternatives) {
      if (targetSlots.some(s => s.id === alt)) {
        return alt;
      }
    }
  }

  return targetSlots[0]?.id || null;
}

// 7. FUNZIONE CHE DETERMINA LO SLOT ATTIVO PER UN DATO CALCIATORE
export function getPlayerSlotId(
  playerName: string | undefined,
  playerSquadra: string | undefined,
  playerRuolo: Role | undefined,
  playerRuoloMantra?: string,
  isTq?: boolean
): string | null {
  if (!playerName) return null;

  const teamTactics = getTeamTactics(playerSquadra);
  const upperName = playerName.toUpperCase().trim();

  let rawSlotId: string | null = null;

  // 1. Lookup diretto nome calciatore (es. BASTONI -> 'b_sx')
  if (PLAYER_SPECIFIC_SLOTS[upperName]) {
    rawSlotId = PLAYER_SPECIFIC_SLOTS[upperName];
  } else {
    // 2. Lookup per cognome con protezione anti-falsi-positivi
    // Richiede: entrambi >= 5 caratteri e il più corto sia almeno il 70% del più lungo
    // per evitare match spuri (es. "DIA" dentro "BADIASHILE", "MAN" dentro "MANCINI")
    for (const [key, slot] of Object.entries(PLAYER_SPECIFIC_SLOTS)) {
      if (key.length < 5 || upperName.length < 5) continue;
      if (upperName.includes(key) || key.includes(upperName)) {
        const shorter = Math.min(key.length, upperName.length);
        const longer = Math.max(key.length, upperName.length);
        if (shorter / longer >= 0.7) {
          rawSlotId = slot;
          break;
        }
      }
    }
  }

  // Se trovato lo slot specifico, normalizzalo rispetto ai moduli della squadra attuale
  if (rawSlotId) {
    return normalizeSlotForFormation(rawSlotId, teamTactics.slots);
  }

  // 3. Fallback intelligente basato sullo schema della squadra
  const isBack3 = teamTactics.formation.startsWith('3-');
  const is433 = teamTactics.formation === '4-3-3';
  const mantraList = (playerRuoloMantra || '')
    .toUpperCase()
    .split(/[/;, ]+/)
    .map(s => s.trim())
    .filter(Boolean);

  // Portiere
  if (playerRuolo === 'P' || mantraList.includes('POR')) {
    return 'por';
  }

  // Difensori
  if (playerRuolo === 'D' || mantraList.some(m => ['DC', 'B', 'DD', 'DS'].includes(m))) {
    if (isBack3) {
      if (mantraList.includes('DS')) return 'b_sx';
      if (mantraList.includes('DD')) return 'b_dx';
      if (mantraList.includes('B')) return 'b_sx';
      return 'dc'; // Default centrale
    } else {
      if (mantraList.includes('DS')) return 'ts';
      if (mantraList.includes('DD')) return 'td';
      return 'dc_dx'; // Default centrale destro a 4
    }
  }

  // Centrocampisti
  if (playerRuolo === 'C' || mantraList.some(m => ['C', 'M', 'E', 'T'].includes(m))) {
    if (isBack3) {
      if (mantraList.includes('E')) return 'e_sx';
      if (mantraList.includes('M')) return teamTactics.formation === '3-5-2' ? 'reg' : 'med_sx';
      if (mantraList.includes('T') || isTq) return teamTactics.formation === '3-4-2-1' ? 'trq_sx' : 'cc_sx';
      return 'cc_dx';
    } else if (is433) {
      if (mantraList.includes('M')) return 'reg';
      if (mantraList.includes('T') || isTq) return 'cc_sx';
      return 'cc_dx';
    } else {
      if (mantraList.includes('T') || isTq) return 'trq';
      if (mantraList.includes('M')) return 'med_sx';
      return 'med_dx';
    }
  }

  // Attaccanti
  if (playerRuolo === 'A' || mantraList.some(m => ['PC', 'A', 'W'].includes(m))) {
    if (mantraList.includes('PC')) return 'pc';
    if (isBack3) {
      return teamTactics.formation === '3-5-2' ? 'sp' : 'trq_sx';
    } else if (is433) {
      if (mantraList.includes('W') || mantraList.includes('A')) return 'ad';
      return 'as';
    } else {
      return 'as';
    }
  }

  return null;
}
