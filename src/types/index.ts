export type Role = 'P' | 'D' | 'C' | 'A';
export type RoleFilter = Role | 'ALL';

export interface SeasonStats {
  season: string; // '2026/27' | '2025/26' | '2024/25' | '2023/24' | '2022/23'
  squadra?: string; // Squadra in cui militava in quella stagione
  isTitolare?: boolean; // Se era normalmente titolare (T)
  partiteTitolare?: number; // Quante partite da titolare nelle prime giornate (es. 2 o 1 o 0 su 2)
  titolaritaDettaglio?: string; // Dettaglio esplicativo es. "2/2 Tit. (Titolare fisso)", "1/2 Tit. (Arrivato fine mercato)", "2/2 Tit. (Sost. titolare rotto)"
  motivoTitolarita?: 'titolare_fisso' | 'titolare_rotto' | 'fine_mercato' | 'infortunato' | 'rientro_infortunio' | 'rotazione' | 'subentrato' | 'riserva';
  pg: number; // Partite giocate / presenze a voto (Pv)
  mv?: number | null; // Media voto
  fm?: number | null; // Fantamedia
  gf: number; // Gol fatti
  gs: number; // Gol subiti (per portieri)
  rp?: number | null; // Rigori parati
  rc?: number | null; // Rigori calciati
  rSegnati?: number | null; // Rigori segnati (R+)
  rSbagliati?: number | null; // Rigori sbagliati (R-)
  assist: number; // Assist
  amm: number; // Ammonizioni
  esp: number; // Espulsioni
  au?: number; // Autogol
  isPrecedenteEstero?: boolean; // Dati della precedente squadra estera o Serie B/C
}

export interface Player {
  id: number;
  nome: string;
  ruolo: Role;
  squadra: string;
  squadraPrecedente?: string; // Squadra di provenienza per i nuovi arrivati in Serie A
  isPrimoAnnoA?: boolean; // Se è al primo anno di Serie A
  quotazione: number;
  fvm: number;
  
  // Dettagli stagione in corso 2026/27
  titolarita2026_27?: string;
  motivo2026_27?: string;
  
  // Statistiche stagione più recente o predefinite
  pg?: number;
  mv?: number | null;
  fm?: number | null;
  gf?: number;
  gs?: number;
  rp?: number;
  rc?: number;
  rSegnati?: number;
  rSbagliati?: number;
  assist?: number;
  amm?: number;
  esp?: number;
  au?: number;
  titolarita?: number;
  rigorista?: boolean | number;
  consigliatoModificatore?: boolean;
  ruoloMantra?: string; // Ruolo mantra ufficiale (es. T;A, W;A, E;M)
  isTq?: boolean; // Se centrocampista offensivo (Trequartista, Tornante o Attaccante esterno)

  // Storico Statistico Pluriennale (2026/27, 2025/26, 2024/25, 2023/24, 2022/23)
  seasons?: {
    '2026/27'?: SeasonStats | null;
    '2025/26'?: SeasonStats | null;
    '2024/25'?: SeasonStats | null;
    '2023/24'?: SeasonStats | null;
    '2022/23'?: SeasonStats | null;
    [key: string]: SeasonStats | null | undefined;
  };

  threeYearAvg?: {
    mv: number;
    fm: number;
    totalGf: number;
    totalGs: number;
    totalAssist: number;
    totalPg: number;
    seasonsCount: number;
  };

  // Stato Asta
  status: 'available' | 'assigned' | 'skipped';
  assignedTo?: string | null; // Team ID
  price?: number | null;
  isTarget?: boolean;
  targetTier?: 'S' | 'A' | null;
  targetBudget?: number;
  note?: string;
}

export interface PlayerAssignment {
  playerId: number;
  nome: string;
  ruolo: Role;
  squadra: string;
  price: number;
  fvm?: number;
  mv?: number | null;
  fm?: number | null;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  currentBudget: number;
  players: PlayerAssignment[];
}

export interface SlotConfig {
  P: number;
  D: number;
  C: number;
  A: number;
}

export interface HistoryAction {
  id: string;
  timestamp: number;
  description: string;
  type: 'ASSIGN' | 'SKIP' | 'RESET' | 'UNASSIGN';
  playerId: number;
  teamId?: string;
  price?: number;
  previousPlayerState: Partial<Player>;
  previousTeamState?: {
    teamId: string;
    budget: number;
    players: PlayerAssignment[];
  };
}

export type ActiveView = 'home' | 'ted_lasso' | 'goalkeepers' | 'auction' | 'attackers' | 'teams' | 'listone' | 'settings';
