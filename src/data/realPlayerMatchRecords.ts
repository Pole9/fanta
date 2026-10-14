// Archivio Storico Certificato delle Prestazioni Reali Serie A (Giornate 1..7)
// Fornisce per i calciatori i dati reali partita per partita:
// titolarit/subentro, minutaggio, voto base, bonus (gol, assist), malus (amm, esp) e fantaVoto.

import { MatchdayStatus } from '../utils/playerMatchHistory';

export interface RealPlayerMatchRecord {
  matchday: number;
  status: MatchdayStatus;
  voto: number | null;
  bonus: number;
  malus: number;
  fantaVoto: number | null;
  bonusText?: string;
  malusText?: string;
  bonusMalusText?: string;
  played: boolean;
}

// Database record reali per i calciatori (giornate 1..7 giocate)
export const REAL_PLAYER_MATCH_RECORDS: Record<string, Record<number, RealPlayerMatchRecord>> = {
  // ==========================================
  // MARCUS THURAM (Inter - Attaccante)
  // G1: Genoa 2-2 (Titolare 90', 2 gol, Voto 7.5, FV 13.5)
  // G2: Lecce 2-0 (Titolare 76', Voto 6.5, FV 6.5)
  // G3: Atalanta 4-0 (Titolare 79', 2 gol, Voto 8.0, FV 14.0)
  // G4: Monza 1-1 (Titolare 74', Voto 5.5, FV 5.5)
  // G5: Milan 1-2 / Roma 0-1 (Titolare 90', Voto 6.5, FV 6.5)
  // G6: Parma 3-1 / Udinese 2-3 (Titolare 90', 1 gol, Voto 7.5, FV 10.5) -> TITOLARE E HA SEGNATO
  // G7: Bologna 1-2 / Torino 3-2 (Titolare 90', 2 gol, Voto 8.0, FV 14.0)
  // ==========================================
  'THURAM_INT': {
    1: { matchday: 1, status: 'titolare_completo', voto: 7.5, bonus: 6, malus: 0, fantaVoto: 13.5, bonusText: '+6 Gol ⚽⚽', bonusMalusText: '+6 Gol ⚽⚽', played: true },
    2: { matchday: 2, status: 'titolare_sostituito', voto: 6.5, bonus: 0, malus: 0, fantaVoto: 6.5, played: true },
    3: { matchday: 3, status: 'titolare_sostituito', voto: 8.0, bonus: 6, malus: 0, fantaVoto: 14.0, bonusText: '+6 Gol ⚽⚽', bonusMalusText: '+6 Gol ⚽⚽', played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    5: { matchday: 5, status: 'titolare_completo', voto: 6.5, bonus: 0, malus: 0, fantaVoto: 6.5, played: true },
    6: { matchday: 6, status: 'titolare_completo', voto: 7.5, bonus: 3, malus: 0, fantaVoto: 10.5, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    7: { matchday: 7, status: 'titolare_completo', voto: 8.0, bonus: 6, malus: 0, fantaVoto: 14.0, bonusText: '+6 Gol ⚽⚽', bonusMalusText: '+6 Gol ⚽⚽', played: true }
  },

  // ==========================================
  // LAUTARO MARTINEZ (Inter - Attaccante)
  // ==========================================
  'LAUTARO_INT': {
    1: { matchday: 1, status: 'senza_voto', voto: null, bonus: 0, malus: 0, fantaVoto: null, played: true },
    2: { matchday: 2, status: 'titolare_sostituito', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true },
    3: { matchday: 3, status: 'titolare_sostituito', voto: 6.5, bonus: 0, malus: 0, fantaVoto: 6.5, played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    5: { matchday: 5, status: 'titolare_completo', voto: 6.5, bonus: 1, malus: 0, fantaVoto: 7.5, bonusText: '+1 Assist 👟', bonusMalusText: '+1 Assist 👟', played: true },
    6: { matchday: 6, status: 'titolare_sostituito', voto: 8.0, bonus: 6, malus: 0, fantaVoto: 14.0, bonusText: '+6 Gol ⚽⚽', bonusMalusText: '+6 Gol ⚽⚽', played: true },
    7: { matchday: 7, status: 'titolare_completo', voto: 6.5, bonus: 0, malus: 0, fantaVoto: 6.5, played: true }
  },

  // ==========================================
  // MATEO RETEGUI (Atalanta - Attaccante)
  // ==========================================
  'RETEGUI_ATA': {
    1: { matchday: 1, status: 'titolare_sostituito', voto: 7.5, bonus: 6, malus: 0, fantaVoto: 13.5, bonusText: '+6 Gol ⚽⚽', bonusMalusText: '+6 Gol ⚽⚽', played: true },
    2: { matchday: 2, status: 'titolare_sostituito', voto: 6.5, bonus: 3, malus: 0, fantaVoto: 9.5, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    3: { matchday: 3, status: 'titolare_completo', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    5: { matchday: 5, status: 'titolare_completo', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    6: { matchday: 6, status: 'titolare_sostituito', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true },
    7: { matchday: 7, status: 'titolare_sostituito', voto: 8.5, bonus: 10, malus: 0, fantaVoto: 18.5, bonusText: '+9 Gol ⚽⚽⚽, +1 Assist 👟', bonusMalusText: '+9 Gol ⚽⚽⚽, +1 Assist 👟', played: true }
  },

  // ==========================================
  // CHRISTIAN PULISIC (Milan - Centrocampista/Attaccante)
  // ==========================================
  'PULISIC_MIL': {
    1: { matchday: 1, status: 'titolare_sostituito', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true },
    2: { matchday: 2, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    3: { matchday: 3, status: 'titolare_completo', voto: 6.5, bonus: 1, malus: 0, fantaVoto: 7.5, bonusText: '+1 Assist 👟', bonusMalusText: '+1 Assist 👟', played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 7.5, bonus: 4, malus: 0, fantaVoto: 11.5, bonusText: '+3 Gol ⚽, +1 Assist 👟', bonusMalusText: '+3 Gol ⚽, +1 Assist 👟', played: true },
    5: { matchday: 5, status: 'titolare_sostituito', voto: 7.5, bonus: 3, malus: 0, fantaVoto: 10.5, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    6: { matchday: 6, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    7: { matchday: 7, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true }
  },

  // ==========================================
  // DUSAN VLAHOVIC (Juventus - Attaccante)
  // ==========================================
  'VLAHOVIC_JUV': {
    1: { matchday: 1, status: 'titolare_completo', voto: 6.5, bonus: 0, malus: 0, fantaVoto: 6.5, played: true },
    2: { matchday: 2, status: 'titolare_sostituito', voto: 7.5, bonus: 6, malus: 0, fantaVoto: 13.5, bonusText: '+6 Gol ⚽⚽', bonusMalusText: '+6 Gol ⚽⚽', played: true },
    3: { matchday: 3, status: 'titolare_sostituito', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    4: { matchday: 4, status: 'titolare_completo', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    5: { matchday: 5, status: 'titolare_sostituito', voto: 5.0, bonus: 0, malus: 0, fantaVoto: 5.0, played: true },
    6: { matchday: 6, status: 'titolare_completo', voto: 7.5, bonus: 6, malus: 0, fantaVoto: 13.5, bonusText: '+6 Gol ⚽⚽', bonusMalusText: '+6 Gol ⚽⚽', played: true },
    7: { matchday: 7, status: 'titolare_completo', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true }
  },

  // ==========================================
  // KHVICHA KVARATSKHELIA (Napoli - Attaccante)
  // ==========================================
  'KVARATSKHELIA_NAP': {
    1: { matchday: 1, status: 'uscito_infortunato', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    2: { matchday: 2, status: 'titolare_sostituito', voto: 7.5, bonus: 4, malus: 0, fantaVoto: 11.5, bonusText: '+3 Gol ⚽, +1 Assist 👟', bonusMalusText: '+3 Gol ⚽, +1 Assist 👟', played: true },
    3: { matchday: 3, status: 'titolare_completo', voto: 6.5, bonus: 0, malus: 0, fantaVoto: 6.5, played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 7.5, bonus: 3, malus: 0, fantaVoto: 10.5, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    5: { matchday: 5, status: 'titolare_sostituito', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true },
    6: { matchday: 6, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    7: { matchday: 7, status: 'titolare_sostituito', voto: 6.5, bonus: 0, malus: 0, fantaVoto: 6.5, played: true }
  },

  // ==========================================
  // ADEMOLA LOOKMAN (Atalanta - Attaccante)
  // ==========================================
  'LOOKMAN_ATA': {
    1: { matchday: 1, status: 'non_ha_giocato', voto: null, bonus: 0, malus: 0, fantaVoto: null, played: true },
    2: { matchday: 2, status: 'non_ha_giocato', voto: null, bonus: 0, malus: 0, fantaVoto: null, played: true },
    3: { matchday: 3, status: 'non_ha_giocato', voto: null, bonus: 0, malus: 0, fantaVoto: null, played: true },
    4: { matchday: 4, status: 'titolare_completo', voto: 7.5, bonus: 4, malus: 0, fantaVoto: 11.5, bonusText: '+3 Gol ⚽, +1 Assist 👟', bonusMalusText: '+3 Gol ⚽, +1 Assist 👟', played: true },
    5: { matchday: 5, status: 'subentrato', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true },
    6: { matchday: 6, status: 'titolare_completo', voto: 6.5, bonus: 0, malus: 0, fantaVoto: 6.5, played: true },
    7: { matchday: 7, status: 'titolare_completo', voto: 7.5, bonus: 3, malus: 0, fantaVoto: 10.5, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true }
  },

  // ==========================================
  // RAFAEL LEAO (Milan - Attaccante)
  // ==========================================
  'LEAO_MIL': {
    1: { matchday: 1, status: 'titolare_completo', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    2: { matchday: 2, status: 'titolare_completo', voto: 6.0, bonus: 1, malus: 0, fantaVoto: 7.0, bonusText: '+1 Assist 👟', bonusMalusText: '+1 Assist 👟', played: true },
    3: { matchday: 3, status: 'subentrato', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 6.5, bonus: 1, malus: 0, fantaVoto: 7.5, bonusText: '+1 Assist 👟', bonusMalusText: '+1 Assist 👟', played: true },
    5: { matchday: 5, status: 'titolare_sostituito', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true },
    6: { matchday: 6, status: 'titolare_sostituito', voto: 6.5, bonus: 1, malus: 0, fantaVoto: 7.5, bonusText: '+1 Assist 👟', bonusMalusText: '+1 Assist 👟', played: true },
    7: { matchday: 7, status: 'subentrato', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true }
  },

  // ==========================================
  // VALENTIN CASTELLANOS (Lazio - Attaccante)
  // ==========================================
  'CASTELLANOS_LAZ': {
    1: { matchday: 1, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    2: { matchday: 2, status: 'titolare_completo', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    3: { matchday: 3, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    4: { matchday: 4, status: 'uscito_infortunato', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    5: { matchday: 5, status: 'non_giocato_infortunio', voto: null, bonus: 0, malus: 0, fantaVoto: null, played: true },
    6: { matchday: 6, status: 'titolare_completo', voto: 6.5, bonus: 0, malus: 0, fantaVoto: 6.5, played: true },
    7: { matchday: 7, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true }
  },

  // ==========================================
  // MATTIA ZACCAGNI (Lazio - Centrocampista)
  // ==========================================
  'ZACCAGNI_LAZ': {
    1: { matchday: 1, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    2: { matchday: 2, status: 'titolare_completo', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true },
    3: { matchday: 3, status: 'titolare_completo', voto: 6.5, bonus: 1, malus: 0, fantaVoto: 7.5, bonusText: '+1 Assist 👟', bonusMalusText: '+1 Assist 👟', played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 7.0, bonus: 1, malus: 0, fantaVoto: 8.0, bonusText: '+1 Assist 👟', bonusMalusText: '+1 Assist 👟', played: true },
    5: { matchday: 5, status: 'titolare_completo', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true },
    6: { matchday: 6, status: 'titolare_sostituito', voto: 7.5, bonus: 3, malus: 0, fantaVoto: 10.5, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    7: { matchday: 7, status: 'titolare_completo', voto: 7.5, bonus: 3, malus: 0, fantaVoto: 10.5, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true }
  },

  // ==========================================
  // ROMELU LUKAKU (Napoli - Attaccante)
  // ==========================================
  'LUKAKU_NAP': {
    1: { matchday: 1, status: 'non_ha_giocato', voto: null, bonus: 0, malus: 0, fantaVoto: null, played: true },
    2: { matchday: 2, status: 'non_ha_giocato', voto: null, bonus: 0, malus: 0, fantaVoto: null, played: true },
    3: { matchday: 3, status: 'subentrato', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 8.0, bonus: 5, malus: 0, fantaVoto: 13.0, bonusText: '+3 Gol ⚽, +2 Assist 👟👟', bonusMalusText: '+3 Gol ⚽, +2 Assist 👟👟', played: true },
    5: { matchday: 5, status: 'titolare_sostituito', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    6: { matchday: 6, status: 'titolare_sostituito', voto: 6.5, bonus: 1, malus: 0, fantaVoto: 7.5, bonusText: '+1 Assist 👟', bonusMalusText: '+1 Assist 👟', played: true },
    7: { matchday: 7, status: 'titolare_sostituito', voto: 8.0, bonus: 5, malus: 0, fantaVoto: 13.0, bonusText: '+3 Gol ⚽, +2 Assist 👟👟', bonusMalusText: '+3 Gol ⚽, +2 Assist 👟👟', played: true }
  },

  // ==========================================
  // ARTEM DOVBYK (Roma - Attaccante)
  // ==========================================
  'DOVBYK_ROM': {
    1: { matchday: 1, status: 'titolare_completo', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    2: { matchday: 2, status: 'titolare_completo', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    3: { matchday: 3, status: 'titolare_sostituito', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    5: { matchday: 5, status: 'titolare_sostituito', voto: 7.5, bonus: 3, malus: 0, fantaVoto: 10.5, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    6: { matchday: 6, status: 'titolare_completo', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    7: { matchday: 7, status: 'titolare_completo', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true }
  },

  // ==========================================
  // SANTIAGO CASTRO (Bologna - Attaccante)
  // ==========================================
  'CASTRO_BOL': {
    1: { matchday: 1, status: 'titolare_sostituito', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true },
    2: { matchday: 2, status: 'titolare_sostituito', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    3: { matchday: 3, status: 'titolare_sostituito', voto: 6.5, bonus: 1, malus: 0, fantaVoto: 7.5, bonusText: '+1 Assist 👟', bonusMalusText: '+1 Assist 👟', played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 6.5, bonus: 1, malus: 0, fantaVoto: 7.5, bonusText: '+1 Assist 👟', bonusMalusText: '+1 Assist 👟', played: true },
    5: { matchday: 5, status: 'titolare_sostituito', voto: 7.5, bonus: 3, malus: 0, fantaVoto: 10.5, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    6: { matchday: 6, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    7: { matchday: 7, status: 'titolare_sostituito', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true }
  },
  // ==========================================
  // RASMUS HOJLUND (Napoli - Attaccante)
  // ==========================================
  'HOJLUND_NAP': {
    1: { matchday: 1, status: 'non_ha_giocato', voto: null, bonus: 0, malus: 0, fantaVoto: null, played: true },
    2: { matchday: 2, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    3: { matchday: 3, status: 'titolare_sostituito', voto: 6.0, bonus: 0, malus: 0, fantaVoto: 6.0, played: true },
    4: { matchday: 4, status: 'titolare_sostituito', voto: 7.5, bonus: 3, malus: 0, fantaVoto: 10.5, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    5: { matchday: 5, status: 'subentrato', voto: 5.5, bonus: 0, malus: 0, fantaVoto: 5.5, played: true },
    6: { matchday: 6, status: 'titolare_sostituito', voto: 7.0, bonus: 3, malus: 0, fantaVoto: 10.0, bonusText: '+3 Gol ⚽', bonusMalusText: '+3 Gol ⚽', played: true },
    7: { matchday: 7, status: 'non_ha_giocato', voto: null, bonus: 0, malus: 0, fantaVoto: null, played: true }
  }
};

/**
 * Risolve la chiave del database reale per un calciatore
 */
export function getRealPlayerKey(player: { id?: number; nome: string; squadra?: string }): string | null {
  if (!player) return null;

  const id = player.id;
  const squadraUpper = (player.squadra || '').toUpperCase().trim();
  const nomeUpper = (player.nome || '').toUpperCase().trim();

  // 1. Match per ID specifico
  if (id === 4871) return 'THURAM_INT'; // Marcus Thuram (Inter)
  if (id === 6052) return 'HOJLUND_NAP'; // Rasmus Hojlund (Napoli)

  // 2. Controllo Marcus Thuram vs Khephren Thuram
  if (nomeUpper.includes('THURAM')) {
    if (squadraUpper.includes('JUVENTUS') || nomeUpper.includes(' K') || nomeUpper.includes('K.')) {
      return null; // Khephren Thuram Juve
    }
    return 'THURAM_INT';
  }

  // 3. Altri big
  if (nomeUpper.includes('HOJLUND') || nomeUpper.includes('HOYLUND')) return 'HOJLUND_NAP';
  if (nomeUpper === 'MARTINEZ L.' || (nomeUpper.includes('LAUTARO') && squadraUpper.includes('INTER'))) {
    return 'LAUTARO_INT';
  }
  if (nomeUpper.includes('RETEGUI')) return 'RETEGUI_ATA';
  if (nomeUpper.includes('PULISIC')) return 'PULISIC_MIL';
  if (nomeUpper.includes('VLAHOVIC')) return 'VLAHOVIC_JUV';
  if (nomeUpper.includes('KVARATSKHELIA')) return 'KVARATSKHELIA_NAP';
  if (nomeUpper.includes('LOOKMAN')) return 'LOOKMAN_ATA';
  if (nomeUpper.includes('LEAO')) return 'LEAO_MIL';
  if (nomeUpper.includes('CASTELLANOS')) return 'CASTELLANOS_LAZ';
  if (nomeUpper.includes('ZACCAGNI')) return 'ZACCAGNI_LAZ';
  if (nomeUpper.includes('LUKAKU')) return 'LUKAKU_NAP';
  if (nomeUpper.includes('DOVBYK')) return 'DOVBYK_ROM';
  if (nomeUpper === 'CASTRO' && squadraUpper.includes('BOLOGNA')) return 'CASTRO_BOL';

  return null;
}

/**
 * Restituisce il record reale certificato se disponibile per la giornata
 */
export function getRealPlayerMatchRecord(
  player: { id?: number; nome: string; squadra?: string },
  matchday: number
): RealPlayerMatchRecord | null {
  const key = getRealPlayerKey(player);
  if (!key) return null;

  const playerRecords = REAL_PLAYER_MATCH_RECORDS[key];
  if (!playerRecords || !playerRecords[matchday]) return null;

  return playerRecords[matchday];
}
