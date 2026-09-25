import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Player, Team, Role, RoleFilter, ActiveView, SlotConfig, HistoryAction, PlayerAssignment } from '../types';
import { OFFICIAL_PLAYERS } from '../data/officialPlayers';
import { DEFAULT_TEAMS, INITIAL_EMPTY_TEAMS, SIMULATED_TEAMS } from '../data/defaultPlayers';
import { calculateMaxBid, DEFAULT_SLOT_CONFIG } from '../utils/auctionCalculations';
import { SyncedOnlineData } from '../data/matchdayData';
import { getCachedSyncData, syncOnlineMatchdayData } from '../utils/onlineSyncService';

interface AuctionContextType {
  teams: Team[];
  players: Player[];
  currentRole: RoleFilter;
  activePlayer: Player | null;
  minimumPrice: number;
  initialBudget: number;
  slotConfig: SlotConfig;
  activeView: ActiveView;
  myTeamId: string;
  history: HistoryAction[];
  canUndo: boolean;

  // Navigazione e viste
  setActiveView: (view: ActiveView) => void;
  setCurrentRole: (role: RoleFilter) => void;
  selectedTeamFilter: string | 'ALL';
  setSelectedTeamFilter: (team: string | 'ALL') => void;
  allSerieATeams: string[];
  selectFirstAvailablePlayer: () => Player | null;
  setActivePlayer: (player: Player | null) => void;
  setMyTeamId: (teamId: string) => void;
  setMinimumPrice: (price: number) => void;

  // Azioni d'asta
  assignPlayer: (playerId: number, teamId: string, price: number) => boolean;
  skipPlayer: (playerId: number) => void;
  unassignPlayer: (playerId: number) => void;
  undoLastAction: () => void;
  nextAlphabeticalPlayer: () => void;
  prevAlphabeticalPlayer: () => void;
  jumpToPlayerLetter: (letter: string) => void;

  // Gestione Dati
  importPlayersList: (newPlayers: Player[], mode?: 'merge' | 'replace') => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  togglePlayerTarget: (playerId: number, tier?: 'S' | 'A') => void;
  setPlayerTargetTier: (playerId: number, tier: 'S' | 'A' | null) => void;
  updatePlayerNote: (playerId: number, note: string) => void;
  resetEntireAuction: () => void;
  reloadOfficialData: () => void;
  loadSimulatedAuction: () => void;
  forceLoadCompleteRosters: () => void;
  reloadTatticoNotes: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Dati freschi online Ted Lasso
  syncedOnlineData: SyncedOnlineData | null;
  isSyncingOnline: boolean;
  lastOnlineSyncTime: string | null;
  syncOnlineData: () => Promise<{ success: boolean; message: string; totalPlayers?: number; totalBallots?: number }>;

  // Statistiche derivate
  rolePlayers: Player[];
  activePlayerIndexInRole: number;
}

const STORAGE_KEY = 'fanta_asta_master_v27_giornata6';

// Helper per costruire i giocatori con le assegnazioni iniziali dalle rose ufficiali
const getInitialPlayersWithAssignments = (): Player[] => {
  const assignmentMap = new Map<number, { teamId: string; price: number }>();
  SIMULATED_TEAMS.forEach(team => {
    team.players.forEach(pl => {
      assignmentMap.set(pl.playerId, { teamId: team.id, price: pl.price });
    });
  });

  return OFFICIAL_PLAYERS.map(official => {
    const ass = assignmentMap.get(official.id);
    if (ass) {
      return {
        ...official,
        status: 'assigned' as const,
        assignedTo: ass.teamId,
        price: ass.price
      };
    }
    return official;
  });
};

export const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Caricamento squadre: di base le 8 squadre partono con le rose complete caricate
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_teams`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 8) {
          return parsed;
        }
      }
      return SIMULATED_TEAMS;
    } catch {
      return SIMULATED_TEAMS;
    }
  });

  // Caricamento 533 calciatori: con le assegnazioni delle 8 rose ufficiali
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_players`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === OFFICIAL_PLAYERS.length) {
          const savedMap = new Map(parsed.map((p: any) => [p.id, p]));
          return OFFICIAL_PLAYERS.map(official => {
            const s = savedMap.get(official.id);
            if (!s) return official;
            return {
              ...official,
              status: s.status || 'available',
              assignedTo: s.assignedTo !== undefined ? s.assignedTo : null,
              price: s.price !== undefined ? s.price : null,
              isTarget: Boolean(s.isTarget),
              targetTier: s.targetTier !== undefined ? s.targetTier : official.targetTier,
              note: s.note ? s.note : (official.note || '')
            };
          });
        }
      }
      return getInitialPlayersWithAssignments();
    } catch {
      return getInitialPlayersWithAssignments();
    }
  });

  const [currentRole, setCurrentRoleState] = useState<RoleFilter>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_role`);
      return (saved as RoleFilter) || 'A';
    } catch {
      return 'A';
    }
  });

  const [activePlayerId, setActivePlayerId] = useState<number | null>(() => {
    const initList = getInitialPlayersWithAssignments();
    const firstAvail = initList.find(p => p.status === 'available');
    return firstAvail ? firstAvail.id : null;
  });
  
  // Prezzo minimo di aggiudicazione: 1 credito (come richiesto)
  const [minimumPrice, setMinimumPriceState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_minPrice`);
      const val = saved !== null ? Number(saved) : 1;
      return val > 0 ? val : 1;
    } catch {
      return 1;
    }
  });

  // 6 ATTACCANTI (3P, 8D, 8C, 6A = 25 calciatori in totale)
  const [slotConfig] = useState<SlotConfig>(DEFAULT_SLOT_CONFIG);
  const [initialBudget] = useState<number>(300);
  const [activeView, setActiveViewState] = useState<ActiveView>('home');
  const [myTeamId, setMyTeamId] = useState<string>('team-1');
  const [history, setHistory] = useState<HistoryAction[]>([]);

  // Gestione Tema Chiaro / Scuro
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('fanta_theme');
      if (saved === 'light' || saved === 'dark') {
        if (saved === 'light') {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        }
        return saved;
      }
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fanta_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch (e) {
      console.warn('Errore salvataggio tema', e);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  }, []);

  // Dati freschi online Ted Lasso
  const [syncedOnlineData, setSyncedOnlineData] = useState<SyncedOnlineData | null>(() => {
    return getCachedSyncData();
  });
  const [isSyncingOnline, setIsSyncingOnline] = useState(false);
  const [lastOnlineSyncTime, setLastOnlineSyncTime] = useState<string | null>(() => {
    const cached = getCachedSyncData();
    return cached ? cached.timestamp : null;
  });

  const syncOnlineData = useCallback(async () => {
    setIsSyncingOnline(true);
    try {
      const res = await syncOnlineMatchdayData();
      if (res.success && res.data) {
        setSyncedOnlineData(res.data);
        setLastOnlineSyncTime(res.data.timestamp);
      }
      return res;
    } finally {
      setIsSyncingOnline(false);
    }
  }, []);

  // Ripristino forzato e pulizia vecchie sessioni incomplete per garantire che tutte le 8 rose abbiano 25/25 calciatori
  useEffect(() => {
    // Pulisci vecchie chiavi obsolete per evitare conflitti di cache
    const obsoleteKeys = [
      'fanta_asta_master_v19_audit_perfetto',
      'fanta_asta_master_v18_clean_comments',
      'fanta_asta_master_v10_rose_semicomplete_db',
      'fanta_asta_master_v11_rose_semicomplete_db',
      'fanta_asta_master_v12_rose_complete_db',
      'fanta_asta_master_v13_rose_complete_25_attaccanti',
      'fanta_asta_master_v14_rose_25_complete',
      'fanta_asta_master_v15_rose_25_complete',
      'fanta_asta_master_v16_rose_25_attaccanti_db',
      'fanta_asta_master_v17_giornata_4_stats'
    ];
    obsoleteKeys.forEach(k => {
      try {
        localStorage.removeItem(`${k}_teams`);
        localStorage.removeItem(`${k}_players`);
        localStorage.removeItem(`${k}_role`);
      } catch {}
    });
  }, []);

  // Salvataggio automatico continuo
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(teams));
    } catch (e) {
      console.warn('Errore salvataggio teams in localStorage', e);
    }
  }, [teams]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(players));
    } catch (e) {
      console.warn('Errore salvataggio players in localStorage', e);
    }
  }, [players]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_role`, currentRole);
    } catch (e) {}
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_minPrice`, String(minimumPrice));
    } catch (e) {}
  }, [minimumPrice]);

  // Filtro squadra master (passa sopra a tutto)
  const [selectedTeamFilter, setSelectedTeamFilterState] = useState<string | 'ALL'>('ALL');

  // Tutte le 20 squadre di Serie A uniche
  const allSerieATeams = useMemo(() => {
    const set = new Set<string>();
    players.forEach(p => {
      if (p.squadra) set.add(p.squadra);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }));
  }, [players]);

  // Lista ordinata alfabeticamente filtrata per squadra master e per ruolo
  const rolePlayers = useMemo(() => {
    return players
      .filter(p => {
        const matchesTeam = selectedTeamFilter === 'ALL' || p.squadra.toLowerCase() === selectedTeamFilter.toLowerCase();
        const matchesRole = currentRole === 'ALL' || p.ruolo === currentRole;
        return matchesTeam && matchesRole;
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
  }, [players, currentRole, selectedTeamFilter]);

  // Calcolo del giocatore attivo
  const activePlayer = useMemo(() => {
    if (activePlayerId !== null) {
      const found = players.find(p => p.id === activePlayerId);
      if (found) return found;
    }
    const firstAvailable = rolePlayers.find(p => p.status === 'available');
    return firstAvailable || rolePlayers[0] || null;
  }, [players, activePlayerId, rolePlayers]);

  const activePlayerIndexInRole = useMemo(() => {
    if (!activePlayer) return 0;
    return rolePlayers.findIndex(p => p.id === activePlayer.id);
  }, [rolePlayers, activePlayer]);

  const setSelectedTeamFilter = useCallback((team: string | 'ALL') => {
    setSelectedTeamFilterState(team);
    const sortedFiltered = players
      .filter(p => {
        const matchesTeam = team === 'ALL' || p.squadra.toLowerCase() === team.toLowerCase();
        const matchesRole = currentRole === 'ALL' || p.ruolo === currentRole;
        return matchesTeam && matchesRole && p.status === 'available';
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));

    const sortedRoleOnly = players
      .filter(p => (currentRole === 'ALL' || p.ruolo === currentRole) && p.status === 'available')
      .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));

    const nextFound = sortedFiltered[0] || sortedRoleOnly[0] || null;
    if (nextFound) {
      setActivePlayerId(nextFound.id);
    }
  }, [players, currentRole]);

  // Riporta al primo nome non chiamato della categoria/squadra attiva
  const selectFirstAvailablePlayer = useCallback(() => {
    // 1. Cerca prima tra i giocatori del ruolo corrente disponibili (in ordine alfabetico)
    const inCurrentRole = rolePlayers.find(p => p.status === 'available');
    if (inCurrentRole) {
      setActivePlayerId(inCurrentRole.id);
      return inCurrentRole;
    }
    // 2. Se c'è filtro squadra, cerca tra i disponibili di quel club
    if (selectedTeamFilter !== 'ALL') {
      const inTeam = players
        .filter(p => p.squadra.toLowerCase() === selectedTeamFilter.toLowerCase() && p.status === 'available')
        .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }))[0];
      if (inTeam) {
        if (currentRole !== 'ALL' && inTeam.ruolo !== currentRole) {
          setCurrentRoleState(inTeam.ruolo);
        }
        setActivePlayerId(inTeam.id);
        return inTeam;
      }
    }
    // 3. Fallback: primo giocatore libero assoluto nel listone A-Z
    const anyAvail = players
      .filter(p => p.status === 'available')
      .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }))[0];
    if (anyAvail) {
      if (currentRole !== 'ALL' && anyAvail.ruolo !== currentRole) {
        setCurrentRoleState(anyAvail.ruolo);
      }
      setActivePlayerId(anyAvail.id);
      return anyAvail;
    }
    return null;
  }, [rolePlayers, players, selectedTeamFilter, currentRole]);

  const setActiveView = useCallback((view: ActiveView) => {
    setActiveViewState(view);
    if (view === 'attackers') {
      setCurrentRoleState('A');
      const sortedA = players
        .filter(p => {
          const matchesTeam = selectedTeamFilter === 'ALL' || p.squadra.toLowerCase() === selectedTeamFilter.toLowerCase();
          return matchesTeam && p.ruolo === 'A' && p.status === 'available';
        })
        .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
      const firstA = sortedA[0] || players
        .filter(p => p.ruolo === 'A' && p.status === 'available')
        .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }))[0] || players.find(p => p.ruolo === 'A');
      if (firstA) {
        setActivePlayerId(firstA.id);
      }
    } else if (view === 'goalkeepers') {
      setCurrentRoleState('P');
      const sortedP = players
        .filter(p => {
          const matchesTeam = selectedTeamFilter === 'ALL' || p.squadra.toLowerCase() === selectedTeamFilter.toLowerCase();
          return matchesTeam && p.ruolo === 'P' && p.status === 'available';
        })
        .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
      const firstP = sortedP[0] || players
        .filter(p => p.ruolo === 'P' && p.status === 'available')
        .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }))[0] || players.find(p => p.ruolo === 'P');
      if (firstP) {
        setActivePlayerId(firstP.id);
      }
    } else if (view === 'auction') {
      // In Asta, porta sempre al primo giocatore libero (status === 'available')
      const sortedRoleAvail = players
        .filter(p => {
          const matchesTeam = selectedTeamFilter === 'ALL' || p.squadra.toLowerCase() === selectedTeamFilter.toLowerCase();
          const matchesRole = currentRole === 'ALL' || p.ruolo === currentRole;
          return matchesTeam && matchesRole && p.status === 'available';
        })
        .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
      const firstAvail = sortedRoleAvail[0] || players
        .filter(p => (currentRole === 'ALL' || p.ruolo === currentRole) && p.status === 'available')
        .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }))[0] || players
        .filter(p => p.status === 'available')
        .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }))[0];
      if (firstAvail) {
        if (currentRole !== 'ALL' && firstAvail.ruolo !== currentRole) {
          setCurrentRoleState(firstAvail.ruolo);
        }
        setActivePlayerId(firstAvail.id);
      }
    }
  }, [players, currentRole, selectedTeamFilter]);

  const setCurrentRole = useCallback((role: RoleFilter) => {
    setCurrentRoleState(role);
    const sortedFiltered = players
      .filter(p => {
        const matchesTeam = selectedTeamFilter === 'ALL' || p.squadra.toLowerCase() === selectedTeamFilter.toLowerCase();
        const matchesRole = role === 'ALL' || p.ruolo === role;
        return matchesTeam && matchesRole && p.status === 'available';
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));

    const sortedRoleOnly = players
      .filter(p => (role === 'ALL' || p.ruolo === role) && p.status === 'available')
      .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));

    const nextInRole = sortedFiltered[0] || sortedRoleOnly[0] || null;
    setActivePlayerId(nextInRole ? nextInRole.id : null);
  }, [players, selectedTeamFilter]);

  const setActivePlayer = useCallback((player: Player | null) => {
    setActivePlayerId(player ? player.id : null);
  }, []);

  const setMinimumPrice = useCallback((price: number) => {
    setMinimumPriceState(price);
  }, []);

  const nextAlphabeticalPlayer = useCallback(() => {
    if (rolePlayers.length === 0) return;
    const currentIndex = activePlayer ? rolePlayers.findIndex(p => p.id === activePlayer.id) : -1;
    if (currentIndex + 1 < rolePlayers.length) {
      setActivePlayerId(rolePlayers[currentIndex + 1].id);
    }
  }, [rolePlayers, activePlayer]);

  const prevAlphabeticalPlayer = useCallback(() => {
    if (rolePlayers.length === 0) return;
    const currentIndex = activePlayer ? rolePlayers.findIndex(p => p.id === activePlayer.id) : 0;
    if (currentIndex > 0) {
      setActivePlayerId(rolePlayers[currentIndex - 1].id);
    }
  }, [rolePlayers, activePlayer]);

  // Navigazione globale da tastiera con freccia Sinistra e Destra nella lista alfabetica in ogni area dell'app
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextAlphabeticalPlayer();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevAlphabeticalPlayer();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [nextAlphabeticalPlayer, prevAlphabeticalPlayer]);

  const jumpToPlayerLetter = useCallback((letter: string) => {
    const target = rolePlayers.find(p => p.nome.startsWith(letter.toUpperCase()));
    if (target) {
      setActivePlayerId(target.id);
    }
  }, [rolePlayers]);

  // Assegnazione giocatore
  const assignPlayer = useCallback((playerId: number, teamId: string, price: number): boolean => {
    const targetPlayer = players.find(p => p.id === playerId);
    const targetTeam = teams.find(t => t.id === teamId);

    if (!targetPlayer || !targetTeam) return false;

    const maxAllowed = calculateMaxBid(targetTeam, slotConfig, minimumPrice);
    if (price > maxAllowed) {
      alert(`Offerta non valida! Il rilancio massimo per ${targetTeam.name} è ${maxAllowed} crediti.`);
      return false;
    }

    if (price < minimumPrice) {
      alert(`Il prezzo minimo d'asta è ${minimumPrice} crediti.`);
      return false;
    }

    const historyAction: HistoryAction = {
      id: `action-${Date.now()}`,
      timestamp: Date.now(),
      description: `Assegnato ${targetPlayer.nome} a ${targetTeam.name} per ${price} cr.`,
      type: 'ASSIGN',
      playerId: targetPlayer.id,
      teamId: targetTeam.id,
      price: price,
      previousPlayerState: {
        status: targetPlayer.status,
        assignedTo: targetPlayer.assignedTo,
        price: targetPlayer.price
      },
      previousTeamState: {
        teamId: targetTeam.id,
        budget: targetTeam.currentBudget,
        players: [...targetTeam.players]
      }
    };

    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === playerId
          ? { ...p, status: 'assigned', assignedTo: teamId, price: price }
          : p
      )
    );

    const newAssignment: PlayerAssignment = {
      playerId: targetPlayer.id,
      nome: targetPlayer.nome,
      ruolo: targetPlayer.ruolo,
      squadra: targetPlayer.squadra,
      price: price,
      fvm: targetPlayer.fvm,
      mv: targetPlayer.mv || undefined,
      fm: targetPlayer.fm || undefined
    };

    setTeams(prevTeams =>
      prevTeams.map(t =>
        t.id === teamId
          ? {
              ...t,
              currentBudget: t.currentBudget - price,
              players: [...t.players, newAssignment]
            }
          : t
      )
    );

    setHistory(prev => [historyAction, ...prev]);

    // Avanza automaticamente al prossimo
    const currentIndex = rolePlayers.findIndex(p => p.id === playerId);
    let nextFoundId: number | null = null;
    for (let i = currentIndex + 1; i < rolePlayers.length; i++) {
      if (rolePlayers[i].status === 'available') {
        nextFoundId = rolePlayers[i].id;
        break;
      }
    }
    if (nextFoundId) {
      setActivePlayerId(nextFoundId);
    }

    return true;
  }, [players, teams, slotConfig, minimumPrice, rolePlayers]);

  // Salta giocatore (invenduto a fine ruolo)
  const skipPlayer = useCallback((playerId: number) => {
    const targetPlayer = players.find(p => p.id === playerId);
    if (!targetPlayer) return;

    const historyAction: HistoryAction = {
      id: `action-${Date.now()}`,
      timestamp: Date.now(),
      description: `${targetPlayer.nome} passato/invenduto a fine ruolo`,
      type: 'SKIP',
      playerId: targetPlayer.id,
      previousPlayerState: {
        status: targetPlayer.status,
        assignedTo: targetPlayer.assignedTo,
        price: targetPlayer.price
      }
    };

    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, status: 'skipped' } : p))
    );

    setHistory(prev => [historyAction, ...prev]);

    const currentIndex = rolePlayers.findIndex(p => p.id === playerId);
    let nextFoundId: number | null = null;
    for (let i = currentIndex + 1; i < rolePlayers.length; i++) {
      if (rolePlayers[i].status === 'available') {
        nextFoundId = rolePlayers[i].id;
        break;
      }
    }
    if (nextFoundId) {
      setActivePlayerId(nextFoundId);
    }
  }, [players, rolePlayers]);

  // Svincola giocatore
  const unassignPlayer = useCallback((playerId: number) => {
    const targetPlayer = players.find(p => p.id === playerId);
    if (!targetPlayer || targetPlayer.status !== 'assigned' || !targetPlayer.assignedTo) return;

    const targetTeam = teams.find(t => t.id === targetPlayer.assignedTo);
    const refundPrice = targetPlayer.price || 0;

    const historyAction: HistoryAction = {
      id: `action-${Date.now()}`,
      timestamp: Date.now(),
      description: `Rimosso ${targetPlayer.nome} da ${targetTeam?.name || 'squadra'}`,
      type: 'UNASSIGN',
      playerId: targetPlayer.id,
      teamId: targetPlayer.assignedTo,
      price: refundPrice,
      previousPlayerState: { ...targetPlayer },
      previousTeamState: targetTeam ? {
        teamId: targetTeam.id,
        budget: targetTeam.currentBudget,
        players: [...targetTeam.players]
      } : undefined
    };

    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, status: 'available', assignedTo: null, price: null } : p))
    );

    if (targetTeam) {
      setTeams(prev =>
        prev.map(t =>
          t.id === targetTeam.id
            ? {
                ...t,
                currentBudget: t.currentBudget + refundPrice,
                players: t.players.filter(pl => pl.playerId !== playerId)
              }
            : t
        )
      );
    }

    setHistory(prev => [historyAction, ...prev]);
  }, [players, teams]);

  // Undo
  const undoLastAction = useCallback(() => {
    if (history.length === 0) return;

    const [lastAction, ...remainingHistory] = history;

    if (lastAction.type === 'ASSIGN') {
      setPlayers(prev =>
        prev.map(p =>
          p.id === lastAction.playerId
            ? {
                ...p,
                status: lastAction.previousPlayerState.status || 'available',
                assignedTo: lastAction.previousPlayerState.assignedTo || null,
                price: lastAction.previousPlayerState.price || null
              }
            : p
        )
      );

      if (lastAction.previousTeamState) {
        setTeams(prev =>
          prev.map(t =>
            t.id === lastAction.previousTeamState!.teamId
              ? {
                  ...t,
                  currentBudget: lastAction.previousTeamState!.budget,
                  players: lastAction.previousTeamState!.players
                }
              : t
          )
        );
      }

      setActivePlayerId(lastAction.playerId);
    } else if (lastAction.type === 'SKIP') {
      setPlayers(prev =>
        prev.map(p =>
          p.id === lastAction.playerId
            ? { ...p, status: lastAction.previousPlayerState.status || 'available' }
            : p
        )
      );
      setActivePlayerId(lastAction.playerId);
    } else if (lastAction.type === 'UNASSIGN') {
      if (lastAction.previousTeamState) {
        setTeams(prev =>
          prev.map(t =>
            t.id === lastAction.previousTeamState!.teamId
              ? {
                  ...t,
                  currentBudget: lastAction.previousTeamState!.budget,
                  players: lastAction.previousTeamState!.players
                }
              : t
          )
        );
      }
      setPlayers(prev =>
        prev.map(p => (p.id === lastAction.playerId ? { ...p, ...(lastAction.previousPlayerState as Player) } : p))
      );
    }

    setHistory(remainingHistory);
  }, [history]);

  const importPlayersList = useCallback((newPlayers: Player[], mode: 'merge' | 'replace' = 'merge') => {
    setPlayers(prev => {
      if (mode === 'replace' && newPlayers.length >= 400) {
        return newPlayers;
      }
      
      const prevMap = new Map(prev.map(p => [p.id, p]));
      const prevNameMap = new Map(prev.map(p => [p.nome.trim().toUpperCase(), p]));

      // Aggiorna o unisci
      const merged = newPlayers.map(np => {
        const existing = prevMap.get(np.id) || prevNameMap.get(np.nome.trim().toUpperCase());
        if (!existing) return np;
        return {
          ...existing,
          ...np,
          // Preserva la nota se nel file importato c'è una nota non vuota
          note: np.note !== undefined && np.note !== '' ? np.note : existing.note,
          targetTier: np.targetTier !== undefined ? np.targetTier : existing.targetTier,
          isTarget: np.isTarget !== undefined ? np.isTarget : existing.isTarget,
          status: np.status !== 'available' ? np.status : existing.status,
          price: np.price !== undefined ? np.price : existing.price,
          assignedTo: np.assignedTo !== undefined ? np.assignedTo : existing.assignedTo,
          seasons: existing.seasons || np.seasons,
          threeYearAvg: existing.threeYearAvg || np.threeYearAvg
        };
      });

      // Se il file importato era un sottoinsieme, mantieni tutti i calciatori non menzionati nel file
      const mergedIds = new Set(merged.map(p => p.id));
      prev.forEach(p => {
        if (!mergedIds.has(p.id)) {
          merged.push(p);
        }
      });

      return merged;
    });

    const firstP = newPlayers.find(p => p.ruolo === currentRole && p.status === 'available');
    if (firstP) {
      setActivePlayerId(firstP.id);
    }
  }, [currentRole]);

  const updateTeam = useCallback((teamId: string, updates: Partial<Team>) => {
    setTeams(prev =>
      prev.map(t => (t.id === teamId ? { ...t, ...updates } : t))
    );
  }, []);

  const togglePlayerTarget = useCallback((playerId: number, specificTier?: 'S' | 'A') => {
    setPlayers(prev =>
      prev.map(p => {
        if (p.id !== playerId) return p;
        if (specificTier) {
          const nextTier = p.targetTier === specificTier ? null : specificTier;
          return { ...p, targetTier: nextTier, isTarget: Boolean(nextTier) };
        }
        // Ciclo sequenziale: None -> Tier S -> Tier A -> None
        let nextTier: 'S' | 'A' | null = null;
        if (!p.targetTier && !p.isTarget) {
          nextTier = 'S';
        } else if (p.targetTier === 'S') {
          nextTier = 'A';
        } else {
          nextTier = null;
        }
        return { ...p, targetTier: nextTier, isTarget: Boolean(nextTier) };
      })
    );
  }, []);

  const setPlayerTargetTier = useCallback((playerId: number, tier: 'S' | 'A' | null) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, targetTier: tier, isTarget: Boolean(tier) } : p))
    );
  }, []);

  const updatePlayerNote = useCallback((playerId: number, note: string) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, note } : p))
    );
  }, []);

  const reloadTatticoNotes = useCallback(() => {
    setPlayers(prev =>
      prev.map(p => {
        const off = OFFICIAL_PLAYERS.find(o => o.id === p.id);
        return off?.note ? { ...p, note: off.note } : p;
      })
    );
  }, []);

  const resetEntireAuction = useCallback(() => {
    if (window.confirm('Sei sicuro di voler azzerare tutta l\'asta? Tutti i crediti e le rose verranno ripristinati allo stato iniziale (tutti i 533 calciatori liberi).')) {
      const cleanPlayers = OFFICIAL_PLAYERS.map(p => ({
        ...p,
        status: 'available' as const,
        assignedTo: null,
        price: null
      }));
      setPlayers(cleanPlayers);
      setTeams(INITIAL_EMPTY_TEAMS);
      setHistory([]);
      try {
        localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(INITIAL_EMPTY_TEAMS));
        localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(cleanPlayers));
      } catch (e) {
        console.warn('Errore salvataggio reset:', e);
      }
      const firstAvail = cleanPlayers.find(p => p.status === 'available');
      setActivePlayerId(firstAvail ? firstAvail.id : null);
      alert('Asta azzerata con successo: tutte le 8 rose sono vuote (300 crediti) e tutti i 533 calciatori sono liberi.');
    }
  }, []);

  const reloadOfficialData = useCallback(() => {
    if (window.confirm('Vuoi ricaricare il listone ufficiale da 533 calciatori con statistiche pluriennali (tutti liberi)?')) {
      const cleanPlayers = OFFICIAL_PLAYERS.map(p => ({
        ...p,
        status: 'available' as const,
        assignedTo: null,
        price: null
      }));
      setPlayers(cleanPlayers);
      try {
        localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(cleanPlayers));
      } catch (e) {
        console.warn('Errore salvataggio storage:', e);
      }
      const firstAvail = cleanPlayers.find(p => p.status === 'available');
      setActivePlayerId(firstAvail ? firstAvail.id : null);
      alert('Listone ufficiale ricaricato con successo: 533 calciatori liberi.');
    }
  }, []);

  const forceLoadCompleteRosters = useCallback(() => {
    // Mappa le assegnazioni dalle 8 rose simulate complete (25 calciatori ciascuna)
    const assignmentMap = new Map<number, { teamId: string; price: number }>();
    SIMULATED_TEAMS.forEach(team => {
      team.players.forEach(pl => {
        assignmentMap.set(pl.playerId, { teamId: team.id, price: pl.price });
      });
    });

    const updatedPlayers = OFFICIAL_PLAYERS.map(official => {
      const ass = assignmentMap.get(official.id);
      if (ass) {
        return {
          ...official,
          status: 'assigned' as const,
          assignedTo: ass.teamId,
          price: ass.price
        };
      }
      return {
        ...official,
        status: 'available' as const,
        assignedTo: null,
        price: null
      };
    });

    setTeams(SIMULATED_TEAMS);
    setPlayers(updatedPlayers);
    setCurrentRoleState('A');
    const firstAvailableA = updatedPlayers
      .filter(p => p.ruolo === 'A' && p.status === 'available')
      .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }))[0];
    setActivePlayerId(firstAvailableA ? firstAvailableA.id : null);

    try {
      localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(SIMULATED_TEAMS));
      localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(updatedPlayers));
      localStorage.setItem(`${STORAGE_KEY}_role`, 'A');
    } catch (e) {
      console.warn('Errore salvataggio storage:', e);
    }
  }, []);

  const loadSimulatedAuction = useCallback(() => {
    if (window.confirm('Vuoi caricare la simulazione completa dell\'asta con tutte le 8 rose al 100% (25 calciatori per squadra: P, D, C, A)?')) {
      forceLoadCompleteRosters();
      setActiveView('teams');
      alert('Simulazione caricata con successo: rose da 25 calciatori completate per tutte le 8 squadre.');
    }
  }, [forceLoadCompleteRosters, setActiveView]);

  const value = {
    teams,
    players,
    currentRole,
    activePlayer,
    minimumPrice,
    initialBudget,
    slotConfig,
    activeView,
    myTeamId,
    history,
    canUndo: history.length > 0,
    setActiveView,
    setCurrentRole,
    setActivePlayer,
    setMyTeamId,
    setMinimumPrice,
    assignPlayer,
    skipPlayer,
    unassignPlayer,
    undoLastAction,
    nextAlphabeticalPlayer,
    prevAlphabeticalPlayer,
    jumpToPlayerLetter,
    importPlayersList,
    updateTeam,
    togglePlayerTarget,
    setPlayerTargetTier,
    updatePlayerNote,
    resetEntireAuction,
    reloadOfficialData,
    loadSimulatedAuction,
    forceLoadCompleteRosters,
    reloadTatticoNotes,
    theme,
    toggleTheme,
    setTheme,
    selectedTeamFilter,
    setSelectedTeamFilter,
    allSerieATeams,
    selectFirstAvailablePlayer,
    rolePlayers,
    activePlayerIndexInRole,
    syncedOnlineData,
    isSyncingOnline,
    lastOnlineSyncTime,
    syncOnlineData
  };

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction deve essere utilizzato all\'interno di un AuctionProvider');
  }
  return context;
};
