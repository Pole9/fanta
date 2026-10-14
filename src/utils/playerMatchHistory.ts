import { Player } from '../types';
import { getInjuryInfo } from '../data/injuryData';
import { getMatchdayResultForTeam, TeamMatchResult } from '../data/serieACalendarResults';
import { getRealPlayerMatchRecord, getRealPlayerKey } from '../data/realPlayerMatchRecords';

export type MatchdayStatus = 
  | 'titolare_completo'      // 1) Partito titolare e non sostituito -> verde chiaro
  | 'titolare_sostituito'    // 2) Partito titolare e sostituito -> verde chiaro a righe diagonali
  | 'subentrato'             // 3) Entrato da panchina -> giallo
  | 'senza_voto'             // 4) Entrato senza voto -> SV
  | 'uscito_infortunato'     // 5) Uscito per infortunio -> viola
  | 'non_giocato_infortunio' // 6) Non ha giocato per infortunio -> sigla INF
  | 'non_ha_giocato'         // Non sceso in campo
  | 'futura';                // Giornate non ancora giocate

export interface MatchdayHistoryItem {
  matchday: number;
  status: MatchdayStatus;
  voto: number | null;
  bonus: number;            // Somma punti bonus (es. +3 gol, +1 assist)
  malus: number;            // Somma punti malus (es. 0.5 amm, 1 esp)
  fantaVoto: number | null;
  opponent: string;
  opponentAbbr: string;
  teamAbbr: string;
  isHome: boolean;
  matchScore: string;       // ES. "MIL-LAZ 3-2" o "MIL-JUV"
  score: string | null;     // ES. "3-2"
  bonusMalusText?: string;  // ES. "+3 Gol, -0.5 Amm."
  bonusText?: string;       // ES. "+3 Gol"
  malusText?: string;       // ES. "-0.5 Amm."
  played: boolean;
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
 * Genera la cronistoria delle 38 giornate e i KPI per il calciatore.
 * Se disponibile, utilizza i dati storici reali certificati (giornate 1..7).
 * Altrimenti distribuisce accuratamente TUTTI i gol, assist e presenze della stagione.
 */
export function getPlayerPerformanceHistory(player: Player, playedMatchdaysCount: number = 7): {
  history: MatchdayHistoryItem[];
  kpis: PlayerHistoryKPIs;
  isEstimatedSeasonSplit: boolean;
} {
  const s26 = player.seasons?.['2026/27'];

  // Statistiche target per la stagione in corso
  const targetPg = s26?.pg !== undefined ? s26.pg : (player.pg && player.pg <= playedMatchdaysCount ? player.pg : Math.min(playedMatchdaysCount, 5));
  const pg = Math.max(0, Math.min(playedMatchdaysCount, targetPg));

  const isFisso = s26?.motivoTitolarita === 'titolare_fisso' || 
                  player.motivo2026_27 === 'titolare_fisso' || 
                  (s26?.titolaritaDettaglio && s26.titolaritaDettaglio.includes('Titolare')) ||
                  s26?.isTitolare === true;

  const rawTitolari = s26?.partiteTitolare !== undefined ? s26.partiteTitolare : (isFisso ? pg : Math.min(pg, 4));
  const titolari = Math.max(0, Math.min(pg, rawTitolari));

  const mv = s26?.mv !== undefined && s26.mv !== null && s26.mv > 0 ? s26.mv : (player.mv ? player.mv : 6.0);
  const fm = s26?.fm !== undefined && s26.fm !== null && s26.fm > 0 ? s26.fm : (player.fm ? player.fm : mv);
  const gf = s26?.gf !== undefined ? s26.gf : (player.gf !== undefined && player.gf <= 25 ? player.gf : 0);
  const assist = s26?.assist !== undefined ? s26.assist : (player.assist !== undefined && player.assist <= 15 ? player.assist : 0);
  const amm = s26?.amm !== undefined ? s26.amm : (player.amm !== undefined && player.amm <= 10 ? player.amm : 0);
  const esp = s26?.esp !== undefined ? s26.esp : (player.esp !== undefined && player.esp <= 5 ? player.esp : 0);
  const rSegnati = s26?.rSegnati || (player.rSegnati || 0);
  const rc = s26?.rc || (player.rc || 0);
  const au = s26?.au || (player.au || 0);
  const gs = s26?.gs !== undefined ? s26.gs : (player.ruolo === 'P' && player.gs ? player.gs : 0);

  // Verifica infortunio
  const injuryInfo = getInjuryInfo(player.nome, player.squadra);
  const hasInjury = !!injuryInfo || 
    (!!s26?.motivoTitolarita && (s26.motivoTitolarita === 'titolare_rotto' || s26.motivoTitolarita === 'infortunato')) || 
    player.motivo2026_27 === 'titolare_rotto' || 
    player.motivo2026_27 === 'infortunato';

  // Verifica se esiste un profilo reale certificato per questo calciatore
  const hasCertifiedProfile = !!getRealPlayerKey(player);

  const history: MatchdayHistoryItem[] = [];

  // Seed per variabilità deterministica e coerente
  const seed = (player.id || 100) * 17;
  const pseudoRandom = (n: number) => {
    const x = Math.sin(seed + n * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  // Se NON abbiamo profilo certificato, prepariamo la distribuzione esatta di tutti i bonus e presenze
  // 1. Identificazione delle giornate giocate (esattamente pg giornate su playedMatchdaysCount)
  const playedMatchdaysSet = new Set<number>();
  if (pg >= playedMatchdaysCount) {
    for (let m = 1; m <= playedMatchdaysCount; m++) playedMatchdaysSet.add(m);
  } else {
    // Se ha infortunio, salta le giornate più recenti
    const candidateDays: { m: number; priority: number }[] = [];
    for (let m = 1; m <= playedMatchdaysCount; m++) {
      let priority = (player.id * 13 + m * 7) % 100;
      if (hasInjury && m > pg) {
        priority -= 1000; // Penalizza le ultime se rotto
      }
      candidateDays.push({ m, priority });
    }
    candidateDays.sort((a, b) => b.priority - a.priority);
    for (let i = 0; i < pg; i++) {
      if (candidateDays[i]) playedMatchdaysSet.add(candidateDays[i].m);
    }
  }

  // 2. Identificazione delle giornate da titolare (esattamente titolari su pg)
  const starterMatchdaysSet = new Set<number>();
  if (isFisso || titolari >= pg) {
    playedMatchdaysSet.forEach(m => starterMatchdaysSet.add(m));
  } else {
    const playedArray = Array.from(playedMatchdaysSet);
    playedArray.sort((a, b) => {
      const scoreA = (player.id * 19 + a * 11) % 100;
      const scoreB = (player.id * 19 + b * 11) % 100;
      return scoreB - scoreA;
    });
    for (let i = 0; i < titolari; i++) {
      if (playedArray[i]) starterMatchdaysSet.add(playedArray[i]);
    }
  }

  // 3. Distribuzione di TUTTI i gol (gf) nelle giornate giocate
  // Privilegia le partite in cui la squadra ha segnato gol reali
  const goalsByMatchday: Record<number, number> = {};
  const assistsByMatchday: Record<number, number> = {};
  const ammByMatchday: Record<number, number> = {};
  const espByMatchday: Record<number, number> = {};
  const gsByMatchday: Record<number, number> = {};

  for (let m = 1; m <= playedMatchdaysCount; m++) {
    goalsByMatchday[m] = 0;
    assistsByMatchday[m] = 0;
    ammByMatchday[m] = 0;
    espByMatchday[m] = 0;
    gsByMatchday[m] = 0;
  }

  if (!hasCertifiedProfile && pg > 0) {
    // Ranking delle giornate per gol: dove la squadra ha segnato di più
    const playedDays = Array.from(playedMatchdaysSet);
    const dayGoalPotentials = playedDays.map(m => {
      const matchRes = getMatchdayResultForTeam(player.squadra, m);
      let teamGoals = 0;
      if (matchRes.score) {
        const parts = matchRes.score.split('-').map(p => parseInt(p.trim(), 10));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          teamGoals = matchRes.isHome ? parts[0] : parts[1];
        }
      }
      const isStarter = starterMatchdaysSet.has(m) ? 1 : 0;
      const hash = ((player.id * 31 + m * 23) % 100) / 100;
      const score = teamGoals * 10 + isStarter * 5 + hash * 3;
      return { m, teamGoals, score };
    });

    dayGoalPotentials.sort((a, b) => b.score - a.score);

    // Distribuzione esatta di tutti i gf gol
    let remainingGf = gf;
    let roundIndex = 0;
    while (remainingGf > 0 && dayGoalPotentials.length > 0) {
      const item = dayGoalPotentials[roundIndex % dayGoalPotentials.length];
      goalsByMatchday[item.m] = (goalsByMatchday[item.m] || 0) + 1;
      remainingGf--;
      roundIndex++;
    }

    // Distribuzione esatta di tutti gli assist
    let remainingAssist = assist;
    const dayAssistPotentials = dayGoalPotentials.map(d => ({
      ...d,
      score: d.teamGoals * 10 - (goalsByMatchday[d.m] || 0) * 8 + ((player.id * 17 + d.m * 29) % 100) / 100
    }));
    dayAssistPotentials.sort((a, b) => b.score - a.score);

    let assistIndex = 0;
    while (remainingAssist > 0 && dayAssistPotentials.length > 0) {
      const item = dayAssistPotentials[assistIndex % dayAssistPotentials.length];
      assistsByMatchday[item.m] = (assistsByMatchday[item.m] || 0) + 1;
      remainingAssist--;
      assistIndex++;
    }

    // Distribuzione esatta ammonizioni
    let remainingAmm = amm;
    let ammIndex = 0;
    while (remainingAmm > 0 && playedDays.length > 0) {
      const day = playedDays[(player.id + ammIndex * 3) % playedDays.length];
      ammByMatchday[day] = (ammByMatchday[day] || 0) + 1;
      remainingAmm--;
      ammIndex++;
    }

    // Distribuzione esatta espulsioni
    let remainingEsp = esp;
    let espIndex = 0;
    while (remainingEsp > 0 && playedDays.length > 0) {
      const day = playedDays[(player.id + espIndex * 5 + 1) % playedDays.length];
      espByMatchday[day] = (espByMatchday[day] || 0) + 1;
      remainingEsp--;
      espIndex++;
    }

    // Se portiere, distribuzione gol subiti
    if (player.ruolo === 'P') {
      let remainingGs = gs;
      let gsIndex = 0;
      while (remainingGs > 0 && playedDays.length > 0) {
        const day = playedDays[gsIndex % playedDays.length];
        gsByMatchday[day] = (gsByMatchday[day] || 0) + 1;
        remainingGs--;
        gsIndex++;
      }
    }
  }

  // Costruzione delle 38 giornate
  for (let m = 1; m <= 38; m++) {
    const matchRes = getMatchdayResultForTeam(player.squadra, m);

    // Giornate non ancora disputate (8..38)
    if (m > playedMatchdaysCount) {
      history.push({
        matchday: m,
        status: 'futura',
        voto: null,
        bonus: 0,
        malus: 0,
        fantaVoto: null,
        opponent: matchRes.opponent,
        opponentAbbr: matchRes.opponentAbbr,
        teamAbbr: matchRes.isHome ? matchRes.homeAbbr : matchRes.awayAbbr,
        isHome: matchRes.isHome,
        matchScore: matchRes.matchScore,
        score: null,
        played: false
      });
      continue;
    }

    // Controlla se per questa giornata esiste un record certificato
    const realRec = getRealPlayerMatchRecord(player, m);
    if (realRec) {
      history.push({
        matchday: m,
        status: realRec.status,
        voto: realRec.voto,
        bonus: realRec.bonus,
        malus: realRec.malus,
        fantaVoto: realRec.fantaVoto,
        opponent: matchRes.opponent,
        opponentAbbr: matchRes.opponentAbbr,
        teamAbbr: matchRes.isHome ? matchRes.homeAbbr : matchRes.awayAbbr,
        isHome: matchRes.isHome,
        matchScore: matchRes.matchScore,
        score: matchRes.score,
        bonusText: realRec.bonusText,
        malusText: realRec.malusText,
        bonusMalusText: realRec.bonusMalusText,
        played: realRec.played
      });
      continue;
    }

    // Giornata disputata senza record certificato
    const hasPlayedThisMatch = playedMatchdaysSet.has(m);

    if (hasPlayedThisMatch) {
      const isStarter = starterMatchdaysSet.has(m);
      let status: MatchdayStatus = 'titolare_completo';

      if (isStarter) {
        const isSubbed = pseudoRandom(m * 3) > 0.65 && player.ruolo !== 'P';
        status = isSubbed ? 'titolare_sostituito' : 'titolare_completo';
      } else {
        status = 'subentrato';
      }

      // Se infortunato e uscito durante l'ultima gara giocata
      if (hasInjury && m === pg && player.ruolo !== 'P' && pg < playedMatchdaysCount) {
        status = 'uscito_infortunato';
      }

      const matchGoals = goalsByMatchday[m] || 0;
      const matchAssists = assistsByMatchday[m] || 0;
      const matchAmm = ammByMatchday[m] || 0;
      const matchEsp = espByMatchday[m] || 0;
      const matchGs = gsByMatchday[m] || 0;

      // Bonus
      const bonusTotal = matchGoals * 3 + matchAssists * 1;
      const bonusParts: string[] = [];
      if (matchGoals > 0) {
        const balls = '⚽'.repeat(Math.min(matchGoals, 3));
        bonusParts.push(`+${matchGoals * 3} Gol ${balls}`);
      }
      if (matchAssists > 0) {
        const shoes = '👟'.repeat(Math.min(matchAssists, 2));
        bonusParts.push(`+${matchAssists} Assist ${shoes}`);
      }

      // Malus
      const malusTotal = matchAmm * 0.5 + matchEsp * 1.0 + (player.ruolo === 'P' ? matchGs * 1.0 : 0);
      const malusParts: string[] = [];
      if (matchAmm > 0) malusParts.push(`-${matchAmm * 0.5} Amm. 🟨`);
      if (matchEsp > 0) malusParts.push(`-${matchEsp * 1.0} Esp. 🟥`);
      if (player.ruolo === 'P' && matchGs > 0) malusParts.push(`-${matchGs} Gol Subito 🥅`);

      // Voto base proporzionato alla prestazione e coerente con mv
      let baseDelta = (pseudoRandom(m * 7) - 0.5) * 0.6;
      if (matchGoals > 0) baseDelta += Math.min(1.5, matchGoals * 0.5);
      if (matchAssists > 0) baseDelta += 0.3;
      if (matchEsp > 0) baseDelta -= 1.0;
      if (matchAmm > 0) baseDelta -= 0.3;

      let calculatedVote = Math.round((mv + baseDelta) * 2) / 2;
      calculatedVote = Math.max(4.5, Math.min(8.5, calculatedVote));

      const fantaVoto = Math.max(1.0, calculatedVote + bonusTotal - malusTotal);

      const allParts = [...bonusParts, ...malusParts];
      const bonusMalusText = allParts.length > 0 ? allParts.join(', ') : undefined;
      const bonusText = bonusParts.length > 0 ? bonusParts.join(', ') : undefined;
      const malusText = malusParts.length > 0 ? malusParts.join(', ') : undefined;

      history.push({
        matchday: m,
        status,
        voto: calculatedVote,
        bonus: bonusTotal,
        malus: malusTotal,
        fantaVoto,
        opponent: matchRes.opponent,
        opponentAbbr: matchRes.opponentAbbr,
        teamAbbr: matchRes.isHome ? matchRes.homeAbbr : matchRes.awayAbbr,
        isHome: matchRes.isHome,
        matchScore: matchRes.matchScore,
        score: matchRes.score,
        bonusMalusText,
        bonusText,
        malusText,
        played: true
      });
    } else {
      // Giornata disputata senza voto
      if (hasInjury) {
        history.push({
          matchday: m,
          status: 'non_giocato_infortunio',
          voto: null,
          bonus: 0,
          malus: 0,
          fantaVoto: null,
          opponent: matchRes.opponent,
          opponentAbbr: matchRes.opponentAbbr,
          teamAbbr: matchRes.isHome ? matchRes.homeAbbr : matchRes.awayAbbr,
          isHome: matchRes.isHome,
          matchScore: matchRes.matchScore,
          score: matchRes.score,
          played: true
        });
      } else {
        const isSV = pseudoRandom(m * 11) > 0.6;
        history.push({
          matchday: m,
          status: isSV ? 'senza_voto' : 'non_ha_giocato',
          voto: null,
          bonus: 0,
          malus: 0,
          fantaVoto: null,
          opponent: matchRes.opponent,
          opponentAbbr: matchRes.opponentAbbr,
          teamAbbr: matchRes.isHome ? matchRes.homeAbbr : matchRes.awayAbbr,
          isHome: matchRes.isHome,
          matchScore: matchRes.matchScore,
          score: matchRes.score,
          played: true
        });
      }
    }
  }

  // Calcolo KPI rigorosamente allineati alla cronistoria effettiva dell'istogramma
  const playedMatchesWithVote = history.filter(h => h.played && h.voto !== null);
  const partiteAVoto = playedMatchesWithVote.length;

  let totalGoals = 0;
  let homeGoals = 0;
  let awayGoals = 0;
  let totalAssists = 0;
  let totalAmm = 0;
  let totalEsp = 0;
  let sumVoto = 0;
  let sumFantaVoto = 0;

  playedMatchesWithVote.forEach(item => {
    sumVoto += item.voto || 0;
    sumFantaVoto += item.fantaVoto || 0;

    // Estrazione gol dai bonus text o match
    if (item.bonusText && item.bonusText.includes('Gol')) {
      const match = item.bonusText.match(/\+(\d+)\s*Gol/);
      const pts = match ? parseInt(match[1], 10) : 0;
      const numG = Math.round(pts / 3);
      totalGoals += numG;
      if (item.isHome) homeGoals += numG;
      else awayGoals += numG;
    }
    if (item.bonusText && item.bonusText.includes('Assist')) {
      const match = item.bonusText.match(/\+(\d+)\s*Assist/);
      totalAssists += match ? parseInt(match[1], 10) : 1;
    }
    if (item.malusText && item.malusText.includes('Amm')) {
      totalAmm += 1;
    }
    if (item.malusText && item.malusText.includes('Esp')) {
      totalEsp += 1;
    }
  });

  // Se i record certificati hanno kpi esatti, li usiamo, altrimenti calcoliamo la media reale dalle barre
  const mediaVoto = partiteAVoto > 0 
    ? Math.round((sumVoto / partiteAVoto) * 100) / 100 
    : (mv || null);

  const fantaMediaVoto = partiteAVoto > 0 
    ? Math.round((sumFantaVoto / partiteAVoto) * 100) / 100 
    : (fm || null);

  const kpis: PlayerHistoryKPIs = {
    partiteAVoto: partiteAVoto > 0 ? partiteAVoto : pg,
    gol: totalGoals > 0 ? totalGoals : gf,
    assist: totalAssists > 0 ? totalAssists : assist,
    mediaVoto,
    fantaMediaVoto,
    golCasa: homeGoals,
    golTrasferta: totalGoals > 0 ? (totalGoals - homeGoals) : (gf - Math.ceil(gf / 2)),
    ammonizioni: totalAmm > 0 ? totalAmm : amm,
    espulsioni: totalEsp > 0 ? totalEsp : esp,
    rigoriSegnati: rSegnati,
    rigoriTotali: rc,
    autoreti: au
  };

  return {
    history,
    kpis,
    isEstimatedSeasonSplit: !hasCertifiedProfile
  };
}
