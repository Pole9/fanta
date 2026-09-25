import { Role, SlotConfig, PlayerAssignment } from '../types';

export const SCARSENAL_STORAGE_KEY = 'fanta_scarsenal_slot_targets_v1';

// Mappa predefinita con totale di 300 crediti
// 3 P: 20 + 2 + 1 = 23
// 8 D: 18 + 15 + 10 + 8 + 4 + 3 + 2 + 1 = 61
// 8 C: 35 + 28 + 25 + 8 + 4 + 3 + 1 + 1 = 105
// 6 A: 90 + 12 + 5 + 2 + 1 + 1 = 111
// Totale: 23 + 61 + 105 + 111 = 300 crediti
export const DEFAULT_SCARSENAL_SLOT_TARGETS: Record<string, number> = {
  // Portieri (3)
  'P-0': 20,
  'P-1': 2,
  'P-2': 1,

  // Difensori (8)
  'D-0': 18,
  'D-1': 15,
  'D-2': 10,
  'D-3': 8,
  'D-4': 4,
  'D-5': 3,
  'D-6': 2,
  'D-7': 1,

  // Centrocampisti (8)
  'C-0': 35,
  'C-1': 28,
  'C-2': 25,
  'C-3': 8,
  'C-4': 4,
  'C-5': 3,
  'C-6': 1,
  'C-7': 1,

  // Attaccanti (6)
  'A-0': 90,
  'A-1': 12,
  'A-2': 5,
  'A-3': 2,
  'A-4': 1,
  'A-5': 1,
};

export function getSlotKey(role: Role, index: number): string {
  return `${role}-${index}`;
}

export function getSlotLabel(role: Role, index: number): string {
  return `${role}${index + 1}`;
}

export function loadScarsenalSlotTargets(): Record<string, number> {
  try {
    const saved = localStorage.getItem(SCARSENAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object' && parsed !== null) {
        return { ...DEFAULT_SCARSENAL_SLOT_TARGETS, ...parsed };
      }
    }
  } catch (e) {
    console.warn('Errore lettura slot targets di Scarsenal', e);
  }
  return { ...DEFAULT_SCARSENAL_SLOT_TARGETS };
}

export function saveScarsenalSlotTargets(targets: Record<string, number>): void {
  try {
    localStorage.setItem(SCARSENAL_STORAGE_KEY, JSON.stringify(targets));
  } catch (e) {
    console.warn('Errore salvataggio slot targets di Scarsenal', e);
  }
}

export interface SlotRowData {
  slotKey: string;
  slotLabel: string;
  role: Role;
  slotIndex: number;
  player: PlayerAssignment | null;
  maxTheoretical: number;
  actualPrice: number | null;
  delta: number | null;
}

export interface RoleSubtotal {
  role: Role;
  budgetTotal: number;
  realTotal: number;
  deltaTotal: number;
  boughtCount: number;
  totalSlots: number;
}

export interface ScarsenalBudgetSummary {
  totalBudget: number;
  totalReal: number;
  totalDelta: number;
  totalTheoretical: number; // alias
  totalActualSpent: number; // alias
  cumulativeDelta: number; // alias
  remainingTheoretical: number;
  filledSlotsCount: number;
  totalSlotsCount: number;
}

export function calculateScarsenalSummary(
  targets: Record<string, number>,
  assignedPlayers: PlayerAssignment[],
  slotConfig: SlotConfig,
  sortMode: 'price_desc' | 'natural' = 'price_desc'
): { 
  rowsByRole: Record<Role, SlotRowData[]>; 
  allRows: SlotRowData[];
  subtotalsByRole: Record<Role, RoleSubtotal>;
  summary: ScarsenalBudgetSummary 
} {
  const roles: Role[] = ['P', 'D', 'C', 'A'];
  const rowsByRole: Record<Role, SlotRowData[]> = {
    P: [],
    D: [],
    C: [],
    A: [],
  };
  const allRows: SlotRowData[] = [];
  const subtotalsByRole: Record<Role, RoleSubtotal> = {
    P: { role: 'P', budgetTotal: 0, realTotal: 0, deltaTotal: 0, boughtCount: 0, totalSlots: slotConfig.P || 3 },
    D: { role: 'D', budgetTotal: 0, realTotal: 0, deltaTotal: 0, boughtCount: 0, totalSlots: slotConfig.D || 8 },
    C: { role: 'C', budgetTotal: 0, realTotal: 0, deltaTotal: 0, boughtCount: 0, totalSlots: slotConfig.C || 8 },
    A: { role: 'A', budgetTotal: 0, realTotal: 0, deltaTotal: 0, boughtCount: 0, totalSlots: slotConfig.A || 6 },
  };

  let totalBudget = 0;
  let totalReal = 0;
  let totalDelta = 0;
  let remainingTheoretical = 0;
  let filledSlotsCount = 0;
  let totalSlotsCount = 0;

  roles.forEach(role => {
    const maxSlots = slotConfig[role] || 0;
    const playersInRole = assignedPlayers.filter(p => p.ruolo === role);

    const sortedPlayers = sortMode === 'price_desc'
      ? [...playersInRole].sort((a, b) => b.price - a.price)
      : [...playersInRole];

    for (let i = 0; i < maxSlots; i++) {
      totalSlotsCount++;
      const slotKey = getSlotKey(role, i);
      const slotLabel = getSlotLabel(role, i);
      const player = sortedPlayers[i] || null;
      const maxTheoretical = Number(targets[slotKey] ?? DEFAULT_SCARSENAL_SLOT_TARGETS[slotKey] ?? 0);

      totalBudget += maxTheoretical;
      subtotalsByRole[role].budgetTotal += maxTheoretical;

      let actualPrice: number | null = null;
      let delta: number | null = null;

      if (player) {
        filledSlotsCount++;
        actualPrice = player.price;
        delta = maxTheoretical - actualPrice;

        totalReal += actualPrice;
        totalDelta += delta;

        subtotalsByRole[role].realTotal += actualPrice;
        subtotalsByRole[role].deltaTotal += delta;
        subtotalsByRole[role].boughtCount++;
      } else {
        remainingTheoretical += maxTheoretical;
      }

      const rowData: SlotRowData = {
        slotKey,
        slotLabel,
        role,
        slotIndex: i,
        player,
        maxTheoretical,
        actualPrice,
        delta,
      };

      rowsByRole[role].push(rowData);
      allRows.push(rowData);
    }
  });

  return {
    rowsByRole,
    allRows,
    subtotalsByRole,
    summary: {
      totalBudget,
      totalReal,
      totalDelta,
      totalTheoretical: totalBudget,
      totalActualSpent: totalReal,
      cumulativeDelta: totalDelta,
      remainingTheoretical,
      filledSlotsCount,
      totalSlotsCount,
    },
  };
}
