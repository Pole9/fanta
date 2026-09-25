import { Team, Role, SlotConfig, Player } from '../types';

export const DEFAULT_SLOT_CONFIG: SlotConfig = { P: 3, D: 8, C: 8, A: 6 };

/**
 * Calcola l'offerta massima consentita per una squadra.
 * Formula: BudgetResiduo - (SlotRimanentiTotali - 1) * PrezzoMinimo
 */
export function calculateMaxBid(
  team: Team,
  slotConfig: SlotConfig = DEFAULT_SLOT_CONFIG,
  minimumPrice: number = 1
): number {
  const totalSlotsNeeded = slotConfig.P + slotConfig.D + slotConfig.C + slotConfig.A;
  const currentSlotsFilled = team.players.length;
  const remainingSlots = Math.max(0, totalSlotsNeeded - currentSlotsFilled);

  if (remainingSlots <= 0) return 0;
  if (team.currentBudget < minimumPrice) return 0;

  if (remainingSlots === 1) {
    return team.currentBudget;
  }

  // Riserva almeno minimumPrice per ciascuno degli altri slot mancanti
  const reservedForOthers = (remainingSlots - 1) * minimumPrice;
  const maxBid = team.currentBudget - reservedForOthers;

  return Math.max(minimumPrice, maxBid);
}

/**
 * Restituisce il conteggio degli slot per ciascun ruolo in una squadra
 */
export function getTeamRoleCounts(team: Team): Record<Role, number> {
  const counts: Record<Role, number> = { P: 0, D: 0, C: 0, A: 0 };
  for (const player of team.players) {
    if (counts[player.ruolo] !== undefined) {
      counts[player.ruolo]++;
    }
  }
  return counts;
}

/**
 * Calcola gli slot mancanti per un dato ruolo
 */
export function getRemainingRoleSlots(team: Team, role: Role, slotConfig: SlotConfig = DEFAULT_SLOT_CONFIG): number {
  const counts = getTeamRoleCounts(team);
  return Math.max(0, slotConfig[role] - counts[role]);
}

/**
 * Verifica se la squadra può acquistare un calciatore del ruolo specificato
 */
export function canTeamBidOnRole(
  team: Team,
  role: Role,
  slotConfig: SlotConfig = DEFAULT_SLOT_CONFIG,
  minimumPrice: number = 1
): { canBid: boolean; reason?: string } {
  const remainingRoleSlots = getRemainingRoleSlots(team, role, slotConfig);
  if (remainingRoleSlots <= 0) {
    return { canBid: false, reason: `Slot per ${role} completati (${slotConfig[role]}/${slotConfig[role]})` };
  }

  const maxBid = calculateMaxBid(team, slotConfig, minimumPrice);
  if (maxBid < minimumPrice) {
    return { canBid: false, reason: `Budget insufficiente per ulteriori acquisti` };
  }

  return { canBid: true };
}

/**
 * Metriche specifiche per la War Room Attaccanti (con 6 attaccanti)
 */
export interface AttackerMetrics {
  teamId: string;
  teamName: string;
  teamColor: string;
  currentBudget: number;
  attackersBought: number;
  attackersRemaining: number;
  otherSlotsRemaining: number;
  maxBid: number;
  availableForAttackers: number;
  avgPerAttacker: number;
  canBuy: boolean;
}

export function calculateAttackerMetrics(
  teams: Team[],
  slotConfig: SlotConfig = DEFAULT_SLOT_CONFIG,
  minimumPrice: number = 1
): AttackerMetrics[] {
  return teams.map(team => {
    const roleCounts = getTeamRoleCounts(team);
    const attackersBought = roleCounts.A;
    const attackersRemaining = Math.max(0, slotConfig.A - attackersBought);

    const remainingP = Math.max(0, slotConfig.P - roleCounts.P);
    const remainingD = Math.max(0, slotConfig.D - roleCounts.D);
    const remainingC = Math.max(0, slotConfig.C - roleCounts.C);
    const otherSlotsRemaining = remainingP + remainingD + remainingC;

    const maxBid = calculateMaxBid(team, slotConfig, minimumPrice);

    // Budget riservato per gli slot non attaccanti mancanti
    const reservedForNonAttackers = otherSlotsRemaining * minimumPrice;
    const availableForAttackers = Math.max(0, team.currentBudget - reservedForNonAttackers);

    const avgPerAttacker = attackersRemaining > 0
      ? Math.round((availableForAttackers / attackersRemaining) * 10) / 10
      : 0;

    return {
      teamId: team.id,
      teamName: team.name,
      teamColor: team.color,
      currentBudget: team.currentBudget,
      attackersBought,
      attackersRemaining,
      otherSlotsRemaining,
      maxBid,
      availableForAttackers,
      avgPerAttacker,
      canBuy: attackersRemaining > 0 && maxBid >= minimumPrice
    };
  });
}

export interface RolePercentileResult {
  percentile: number; // 0 to 99
  comment: string; // e.g. "Top 2%", "Top 10%", "Fascia Media", "Fascia Bassa", "Fondo Lista"
  categoryName: string;
  totalInCategory: number;
  containerClass: string;
  percentileClass: string;
  commentClass: string;
  badgeClass: string;
  tooltip: string;
}

/**
 * Calcola in modo statisticamente rigoroso il percentile e il relativo commento qualitativo
 * all'interno del proprio ruolo di Serie A.
 * Risolve definitivamente anomalie da ex-aequo al minimo (es. FVM=1 allo 0° percentile non è mai 'Top X%').
 */
export function calculatePlayerPercentile(
  playerFvm: number | null | undefined,
  allFvmsInRole: number[],
  role: Role | string = ''
): RolePercentileResult {
  const categoryNames: Record<string, string> = {
    P: 'Portieri',
    D: 'Difensori',
    C: 'Centrocampisti',
    A: 'Attaccanti'
  };
  const categoryName = categoryNames[role] || (role ? `Ruolo ${role}` : 'Categoria');
  const totalInCategory = allFvmsInRole.length;

  if (totalInCategory === 0) {
    return {
      percentile: 0,
      comment: 'Fondo Lista',
      categoryName,
      totalInCategory: 0,
      containerClass: 'bg-slate-950 border-slate-800 text-slate-400',
      percentileClass: 'text-slate-400 font-extrabold',
      commentClass: 'text-slate-500 font-bold',
      badgeClass: 'text-slate-500',
      tooltip: `0° percentile`
    };
  }

  const fvm = Number(playerFvm) || 0;
  const lowerCount = allFvmsInRole.filter(f => (Number(f) || 0) < fvm).length;
  const rawPercentile = Math.round((lowerCount / totalInCategory) * 100);
  const percentile = Math.min(99, Math.max(0, rawPercentile));

  let comment = '';
  let containerClass = '';
  let percentileClass = '';
  let commentClass = '';
  let badgeClass = '';
  let tooltip = '';

  if (percentile >= 95) {
    const topVal = Math.max(1, 100 - percentile);
    comment = `Top ${topVal}%`;
    containerClass = 'bg-amber-100 dark:bg-amber-950/80 border-amber-400 dark:border-amber-500/80 text-amber-950 dark:text-amber-200';
    percentileClass = 'text-amber-950 dark:text-amber-300 font-black';
    commentClass = 'text-amber-800 dark:text-amber-400 font-extrabold';
    badgeClass = 'bg-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-500/40 font-black';
    tooltip = `Valutazione FVM: ${fvm} • ${percentile}° percentile (${comment}) tra i ${totalInCategory} ${categoryName} (supera il ${percentile}% del reparto)`;
  } else if (percentile >= 85) {
    const topVal = 100 - percentile;
    comment = `Top ${topVal}%`;
    containerClass = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-500/80 text-emerald-950 dark:text-emerald-200';
    percentileClass = 'text-emerald-950 dark:text-emerald-300 font-black';
    commentClass = 'text-emerald-800 dark:text-emerald-400 font-extrabold';
    badgeClass = 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500/40 font-bold';
    tooltip = `Valutazione FVM: ${fvm} • ${percentile}° percentile (${comment}) tra i ${totalInCategory} ${categoryName} (supera il ${percentile}% del reparto)`;
  } else if (percentile >= 75) {
    const topVal = 100 - percentile;
    comment = `Top ${topVal}%`;
    containerClass = 'bg-sky-100 dark:bg-cyan-950/80 border-sky-400 dark:border-cyan-500/80 text-sky-950 dark:text-cyan-200';
    percentileClass = 'text-sky-950 dark:text-cyan-300 font-black';
    commentClass = 'text-sky-800 dark:text-cyan-400 font-extrabold';
    badgeClass = 'bg-sky-100 dark:bg-cyan-500/20 text-sky-950 dark:text-cyan-300 border border-sky-400 dark:border-cyan-500/40 font-bold';
    tooltip = `Valutazione FVM: ${fvm} • ${percentile}° percentile (${comment}) tra i ${totalInCategory} ${categoryName} (supera il ${percentile}% del reparto)`;
  } else if (percentile >= 50) {
    comment = 'Fascia Media';
    containerClass = 'bg-blue-100 dark:bg-blue-950/70 border-blue-400 dark:border-blue-600/60 text-blue-950 dark:text-blue-200';
    percentileClass = 'text-blue-950 dark:text-blue-300 font-black';
    commentClass = 'text-blue-800 dark:text-blue-400 font-extrabold';
    badgeClass = 'bg-blue-100 dark:bg-blue-500/20 text-blue-950 dark:text-blue-300 border border-blue-400 dark:border-blue-500/40 font-medium';
    tooltip = `Valutazione FVM: ${fvm} • ${percentile}° percentile (${comment}) tra i ${totalInCategory} ${categoryName} (metà classifica, supera il ${percentile}% del reparto)`;
  } else if (percentile >= 25) {
    comment = 'Fascia Medio-Bassa';
    containerClass = 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300';
    percentileClass = 'text-slate-900 dark:text-slate-300 font-black';
    commentClass = 'text-slate-700 dark:text-slate-400 font-bold';
    badgeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400 font-medium border border-slate-200 dark:border-slate-700';
    tooltip = `Valutazione FVM: ${fvm} • ${percentile}° percentile (${comment}) tra i ${totalInCategory} ${categoryName}`;
  } else if (percentile > 0) {
    comment = 'Fascia Bassa';
    containerClass = 'bg-slate-100 dark:bg-slate-900/90 border-slate-300 dark:border-slate-700/70 text-slate-700 dark:text-slate-400';
    percentileClass = 'text-slate-800 dark:text-slate-400 font-black';
    commentClass = 'text-slate-600 dark:text-slate-500 font-bold';
    badgeClass = 'text-slate-600 dark:text-slate-400/90';
    tooltip = `Valutazione FVM: ${fvm} • ${percentile}° percentile (${comment}) tra i ${totalInCategory} ${categoryName} (riserva o minutaggio ridotto)`;
  } else {
    comment = 'Fondo Lista';
    containerClass = 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400';
    percentileClass = 'text-slate-800 dark:text-slate-400 font-black';
    commentClass = 'text-slate-600 dark:text-slate-500 font-bold';
    badgeClass = 'text-slate-500 font-normal';
    tooltip = `Valutazione FVM: ${fvm} • 0° percentile (${comment}) tra i ${totalInCategory} ${categoryName} (valutazione minima di listone)`;
  }

  return {
    percentile,
    comment,
    categoryName,
    totalInCategory,
    containerClass,
    percentileClass,
    commentClass,
    badgeClass,
    tooltip
  };
}

/**
 * Verifica se un calciatore è considerato "titolarissimo".
 * Criterio utente: partito titolare almeno in 3/4 o 4/5 delle gare disputate.
 */
export function isTitolarissimo(player: Player | null | undefined): boolean {
  if (!player) return false;

  const s27 = player.seasons?.['2026/27'];
  if (s27) {
    const pt = s27.partiteTitolare ?? (s27.isTitolare ? (s27.pg ?? 0) : 0);
    const matchdaysPlayed = (s27.pg !== undefined && s27.pg !== null) ? Math.max(s27.pg, pt) : 4;

    // Titolarissimo = partito titolare in TUTTE le partite disputate (4/4, 5/5, ecc.)
    return pt > 0 && pt >= matchdaysPlayed;
  }

  // Fallback: nessun dato 2026/27 → non titolarissimo
  return false;
}
