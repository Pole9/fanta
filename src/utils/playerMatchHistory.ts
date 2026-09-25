import { Player } from '../types';

export type MatchdayStatus = 
  | 'titolare_completo'    // 1) Partito titolare e non sostituito -> verde chiaro
  | 'titolare_sostituito'  // 2) Partito titolare e sostituito -> verde chiaro a righe diagonali
  | 'subentrato'           // 3) Entrato da panchina -> giallo
  | 'senza_voto'           // 4) Entrato senza voto -> SV
  | 'uscito_infortunato'   // 5) Uscito per infortunio -> viola
  | 'non_ha_giocato'       // Non sceso in campo
  | 'futura';              // Giornate non ancora giocate

export interface MatchdayHistoryItem {
  matchday: number;
  status: MatchdayStatus;
  voto: number | null;
  fantaVoto: number | null;
  opponent?: string;
  isHome?: boolean;
}

export interface PlayerHistoryKPIs {
  partiteAVoto: number;
  gol: number;
  assist: number;
  mediaVoto: number | null;
  fantaMediaVoto: number | null;
  golCasa: number;
  golTrasferta: number;
  ammonizioni: number;
  espulsioni: number;
  rigoriSegnati: number;
  rigoriTotali: number;
  autoreti: number;
}

/**
 * Genera la cronistoria delle 38 giornate e i KPI per il calciatore
 * coerente con i dati reali della stagione in corso (2026/27)
 */
export function getPlayerPerformanceHistory(player: Player, playedMatchdaysCount: number = 5): {
  history: MatchdayHistoryItem[];
  kpis: PlayerHistoryKPIs;
} {
  const s26 = player.seasons?.['2026/27'];

  const pg = s26?.pg !== undefined ? s26.pg : (player.pg && player.pg <= playedMatchdaysCount ? player.pg : Math.min(playedMatchdaysCount, 5));
  const titolari = s26?.partiteTitolare !== undefined ? s26.partiteTitolare : Math.min(pg, 4);
  const mv = s26?.mv !== undefined && s26.mv !== null ? s26.mv : (player.mv ? player.mv : 6.0);
  const fm = s26?.fm !== undefined && s26.fm !== null ? s26.fm : (player.fm ? player.fm : mv);
  const gf = s26?.gf !== undefined ? s26.gf : (player.gf !== undefined && player.gf <= 10 ? player.gf : 0);
  const assist = s26?.assist !== undefined ? s26.assist : (player.assist !== undefined && player.assist <= 10 ? player.assist : 0);
  const amm = s26?.amm !== undefined ? s26.amm : (player.amm !== undefined && player.amm <= 5 ? player.amm : 0);
  const esp = s26?.esp !== undefined ? s26.esp : (player.esp !== undefined && player.esp <= 2 ? player.esp : 0);
  const rSegnati = s26?.rSegnati || (player.rSegnati || 0);
  const rc = s26?.rc || (player.rc || 0);
  const au = s26?.au || (player.au || 0);

  // Suddivisione gol casa/trasferta
  const golCasa = Math.ceil(gf / 2);
  const golTrasferta = gf - golCasa;

  const kpis: PlayerHistoryKPIs = {
    partiteAVoto: pg,
    gol: gf,
    assist,
    mediaVoto: mv,
    fantaMediaVoto: fm,
    golCasa,
    golTrasferta,
    ammonizioni: amm,
    espulsioni: esp,
    rigoriSegnati: rSegnati,
    rigoriTotali: rc,
    autoreti: au
  };

  // Generatore deterministico per le prime giornate basato sull'ID del calciatore
  const history: MatchdayHistoryItem[] = [];

  // Variabilità realistica attorno alla media voto
  const seed = (player.id || 100) * 17;
  const pseudoRandom = (n: number) => {
    const x = Math.sin(seed + n * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  // Se il calciatore ha subito infortuni recenti
  const hasInjury = !!s26?.motivoTitolarita && (s26.motivoTitolarita === 'titolare_rotto' || s26.motivoTitolarita === 'infortunato');

  for (let m = 1; m <= 38; m++) {
    if (m > playedMatchdaysCount) {
      history.push({
        matchday: m,
        status: 'futura',
        voto: null,
        fantaVoto: null
      });
      continue;
    }

    // Per le giornate disputate (1..playedMatchdaysCount)
    if (m <= pg) {
      let status: MatchdayStatus = 'titolare_completo';
      
      if (m <= titolari) {
        // Titolare: decidiamo se sostituito o intera gara
        const isSubbed = (pseudoRandom(m * 3) > 0.65) && player.ruolo !== 'P';
        status = isSubbed ? 'titolare_sostituito' : 'titolare_completo';
      } else {
        // Entrato da panchina
        status = 'subentrato';
      }

      // Se infortunato in una specifica giornata
      if (hasInjury && m === pg && player.ruolo !== 'P') {
        status = 'uscito_infortunato';
      }

      // Voto realistico attorno a mv
      const delta = (pseudoRandom(m * 7) - 0.5) * 1.0; // tra -0.5 e +0.5
      let calculatedVote = Math.round((mv + delta) * 2) / 2;
      calculatedVote = Math.max(4.5, Math.min(8.5, calculatedVote));

      // FantaVoto (aggiunge bonus gol/assist o malus ammonizione per quella giornata)
      let bonusMalus = 0;
      if (gf > 0 && m === 1 + (player.id % pg)) bonusMalus += 3;
      if (assist > 0 && m === 1 + ((player.id + 2) % pg)) bonusMalus += 1;
      if (amm > 0 && m === 1 + ((player.id + 1) % pg)) bonusMalus -= 0.5;
      if (esp > 0 && m === pg) bonusMalus -= 1;

      const fantaVoto = Math.max(3.0, calculatedVote + bonusMalus);

      history.push({
        matchday: m,
        status,
        voto: calculatedVote,
        fantaVoto: fantaVoto
      });
    } else {
      // Giornata disputata in cui non ha preso voto
      const isSV = pseudoRandom(m * 11) > 0.5;
      history.push({
        matchday: m,
        status: isSV ? 'senza_voto' : 'non_ha_giocato',
        voto: null,
        fantaVoto: null
      });
    }
  }

  return { history, kpis };
}
