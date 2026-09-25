import React, { useState, useMemo, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { FastBiddingPanel } from './FastBiddingPanel';
import { StatsCard } from './StatsCard';
import { 
  GOALKEEPER_GRID_TEAMS, 
  getBestPairingsForTeam,
  getGoalkeeperGridMatrix
} from '../data/goalkeeperGrid';
import { Player } from '../types';
import { getInjuryInfo } from '../data/injuryData';
import { FANTAGAZZETTA_ADVICE } from '../data/matchdayData';
import { isTitolarissimo } from '../utils/auctionCalculations';
import { 
  Shield, 
  Sparkles, 
  Search, 
  Table, 
  X, 
  ArrowRightLeft,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Gavel,
  Edit3
} from 'lucide-react';

export const GoalkeepersWarRoom: React.FC = () => {
  const { 
    teams, 
    players, 
    slotConfig, 
    activePlayer, 
    setActivePlayer,
    setCurrentRole,
    selectedTeamFilter,
    setSelectedTeamFilter,
    allSerieATeams,
    selectFirstAvailablePlayer,
    prevAlphabeticalPlayer,
    nextAlphabeticalPlayer,
    updatePlayerNote
  } = useAuction();

  const [selectedGoalkeeper, setSelectedGoalkeeper] = useState<Player | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'starters' | 'available' | 'big' | 'lowcost'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullMatrix, setShowFullMatrix] = useState(false);
  const [startMatchday, setStartMatchday] = useState<6 | 1>(6);
  const [rightPanelView, setRightPanelView] = useState<'pairings' | 'all_players'>('pairings');

  // Tutti i portieri di Serie A per la griglia e titolari delle 20 squadre
  const allSerieAGoalkeepers = useMemo(() => {
    return players
      .filter(p => p.ruolo === 'P')
      .sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
  }, [players]);

  // Tutti i portieri in ordine alfabetico A-Z (filtrati per club se selezionato)
  const allGoalkeepers = useMemo(() => {
    let list = players.filter(p => p.ruolo === 'P');
    if (selectedTeamFilter && selectedTeamFilter !== 'ALL') {
      list = list.filter(p => p.squadra.toLowerCase() === selectedTeamFilter.toLowerCase());
    }
    return list.sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
  }, [players, selectedTeamFilter]);

  // Portiere attualmente in focus: prioritizza la versione aggiornata dal database
  const playerInFocus = useMemo(() => {
    if (activePlayer && activePlayer.ruolo === 'P') {
      const fresh = players.find(p => p.id === activePlayer.id);
      if (fresh) {
        if (selectedTeamFilter === 'ALL' || fresh.squadra.toLowerCase() === selectedTeamFilter.toLowerCase()) {
          return fresh;
        }
      }
    }
    if (selectedGoalkeeper) {
      const fresh = players.find(p => p.id === selectedGoalkeeper.id);
      if (fresh) {
        if (selectedTeamFilter === 'ALL' || fresh.squadra.toLowerCase() === selectedTeamFilter.toLowerCase()) {
          return fresh;
        }
      }
    }
    const sortedAvail = allGoalkeepers.filter(p => {
      if (selectedTeamFilter !== 'ALL') {
        return p.squadra.toLowerCase() === selectedTeamFilter.toLowerCase() && p.status === 'available';
      }
      return p.status === 'available';
    });
    return sortedAvail[0] || allGoalkeepers[0] || null;
  }, [selectedGoalkeeper, activePlayer, allGoalkeepers, selectedTeamFilter, players]);

  const availableGoalkeepersCount = useMemo(() => {
    return allGoalkeepers.filter(p => p.status === 'available').length;
  }, [allGoalkeepers]);

  const activeGoalkeeperIndex = useMemo(() => {
    if (!playerInFocus) return 0;
    const idx = allGoalkeepers.findIndex(p => p.id === playerInFocus.id);
    return idx >= 0 ? idx : 0;
  }, [allGoalkeepers, playerInFocus]);

  const handlePrev = () => {
    setSelectedGoalkeeper(null);
    prevAlphabeticalPlayer();
  };
  const handleNext = () => {
    setSelectedGoalkeeper(null);
    nextAlphabeticalPlayer();
  };
  const handleFirstAvail = () => {
    setSelectedGoalkeeper(null);
    const firstP = allGoalkeepers.find(p => p.status === 'available');
    if (firstP) {
      setActivePlayer(firstP);
      setSelectedGoalkeeper(firstP);
    } else {
      selectFirstAvailablePlayer();
    }
  };

  // All'ingresso nella War Room Portieri, seleziona sempre il primo portiere libero (A-Z)
  useEffect(() => {
    setCurrentRole('P');
    setFilterType('all');
    setSearchQuery('');
    setSelectedGoalkeeper(null);
    const firstP = allGoalkeepers.find(p => p.status === 'available');
    if (firstP) {
      setActivePlayer(firstP);
      setSelectedGoalkeeper(firstP);
    }
  }, []);

  // Se all'apertura activePlayer non è un portiere o non del club selezionato, allinea al primo libero
  useEffect(() => {
    const isMatchingTeam = !activePlayer || selectedTeamFilter === 'ALL' || activePlayer.squadra.toLowerCase() === selectedTeamFilter.toLowerCase();
    const isP = activePlayer && activePlayer.ruolo === 'P';

    if (!isP || !isMatchingTeam) {
      const firstP = allGoalkeepers.find(p => p.status === 'available');
      if (firstP) {
        setActivePlayer(firstP);
        setSelectedGoalkeeper(firstP);
      }
    }
  }, [activePlayer?.id, activePlayer?.ruolo, selectedTeamFilter]);

  // Quando activePlayer cambia (es. con freccia sinistra o destra da tastiera), sincronizza la scheda
  useEffect(() => {
    if (activePlayer && activePlayer.ruolo === 'P') {
      setSelectedGoalkeeper(null);
    }
  }, [activePlayer?.id]);

  // Squadra attualmente in esame per gli incroci
  const currentTeamExamined = selectedTeamFilter !== 'ALL' 
    ? selectedTeamFilter 
    : (playerInFocus ? playerInFocus.squadra : 'Juventus');

  // Migliori abbinamenti per la squadra in esame dalla griglia ufficiale Fantacalcio.it
  const bestPairings = useMemo(() => {
    return getBestPairingsForTeam(currentTeamExamined, startMatchday);
  }, [currentTeamExamined, startMatchday]);

  // Matrice incroci corrente in base alla selezione (MD 6-38 o MD 1-38)
  const currentMatrix = useMemo(() => {
    return getGoalkeeperGridMatrix(startMatchday);
  }, [startMatchday]);

  // Titolare principale di ciascuna squadra di Serie A:
  // Priorità assoluta al titolarissimo (almeno 3/4 o 4/5 gare da titolare); in subordine FVM più alto
  const startersByTeam = useMemo(() => {
    const map = new Map<string, Player>();
    allSerieAGoalkeepers.forEach(p => {
      const current = map.get(p.squadra);
      if (!current) {
        map.set(p.squadra, p);
      } else {
        const pTit = isTitolarissimo(p);
        const curTit = isTitolarissimo(current);
        if (pTit && !curTit) {
          map.set(p.squadra, p);
        } else if (!pTit && curTit) {
          // Mantieni il titolarissimo già identificato
        } else if (p.fvm > current.fvm) {
          map.set(p.squadra, p);
        }
      }
    });
    return map;
  }, [allSerieAGoalkeepers]);

  // Lista portieri filtrata per la colonna laterale (ORDINAMENTO SEMPRE RIGOROSAMENTE ALFABETICO A-Z)
  const filteredGoalkeepers = useMemo(() => {
    const bigTeams = ['Juventus', 'Inter', 'Milan', 'Napoli', 'Roma', 'Atalanta', 'Lazio'];
    return allGoalkeepers.filter(p => {
      // 1. Filtro ricerca testuale
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.nome.toLowerCase().includes(q);
        const matchesTeam = p.squadra.toLowerCase().includes(q);
        if (!matchesName && !matchesTeam) return false;
      }

      // 2. Filtro Squadra Master (passa sopra a tutto)
      if (selectedTeamFilter !== 'ALL') {
        if (p.squadra.toLowerCase() !== selectedTeamFilter.toLowerCase()) return false;
      }

      // 3. Filtro Categoria: 'starters' seleziona i titolarissimi (almeno 3/4 o 4/5 tit.)
      if (filterType === 'available' && p.status !== 'available') return false;
      if (filterType === 'starters') {
        if (!isTitolarissimo(p)) return false;
      }
      if (filterType === 'big') {
        if (!bigTeams.includes(p.squadra)) return false;
      }
      if (filterType === 'lowcost') {
        if (bigTeams.includes(p.squadra)) return false;
      }

      return true;
    }).sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
  }, [allGoalkeepers, filterType, searchQuery, startersByTeam, selectedTeamFilter]);

  // Statistiche generali reparto portieri
  const totalSlotsNeeded = teams.length * slotConfig.P; // 8 * 3 = 24
  const totalSlotsBought = teams.reduce((acc, t) => acc + t.players.filter(p => p.ruolo === 'P').length, 0);
  const totalSlotsRemaining = totalSlotsNeeded - totalSlotsBought;
  const availableStartersCount = Array.from(startersByTeam.values()).filter(p => isTitolarissimo(p) && p.status === 'available').length;

  // Verifica se un calciatore appartiene alla rosa dell'utente (Scarsenal / team-1)
  const isPlayerTakenByMe = (p?: Player | null): boolean => {
    if (!p || p.status !== 'assigned' || !p.assignedTo) return false;
    if (p.assignedTo === 'team-1') return true;
    const t = teams.find(team => team.id === p.assignedTo);
    return !!t && t.name.toLowerCase().includes('scarsenal');
  };

  // Verifica se un calciatore è stato acquistato da un avversario
  const isPlayerTakenByOpponent = (p?: Player | null): boolean => {
    if (!p || p.status !== 'assigned') return false;
    return !isPlayerTakenByMe(p);
  };

  // Tutti i portieri raggruppati per squadra di Serie A
  const teamGoalkeepersMap = useMemo(() => {
    const map = new Map<string, Player[]>();
    allSerieAGoalkeepers.forEach(p => {
      const list = map.get(p.squadra) || [];
      list.push(p);
      map.set(p.squadra, list);
    });
    return map;
  }, [allSerieAGoalkeepers]);

  // Prossimi 2 portieri disponibili in ordine alfabetico (come per l'asta standard)
  const upcomingGoalkeepers = useMemo(() => {
    if (!playerInFocus) {
      return allGoalkeepers.filter(p => p.status === 'available').slice(0, 2);
    }
    const currentIndex = allGoalkeepers.findIndex(p => p.id === playerInFocus.id);
    const after = allGoalkeepers.slice(currentIndex + 1).filter(p => p.status === 'available');
    if (after.length >= 2) return after.slice(0, 2);
    const before = allGoalkeepers.slice(0, currentIndex).filter(p => p.status === 'available');
    return [...after, ...before].slice(0, 2);
  }, [allGoalkeepers, playerInFocus]);

  const handleSelectGoalkeeper = (p: Player) => {
    setCurrentRole('P');
    setActivePlayer(p);
    setSelectedGoalkeeper(p);
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-1 overflow-hidden select-none">
      
      {/* 1. BARRA SUPERIORE WAR ROOM: NAVIGAZIONE A SINISTRA, SCRITTA WAR ROOM A DESTRA */}
      <div className="flex items-center justify-between gap-2 py-0.5 px-1 select-none flex-wrap flex-shrink-0">
        {/* PARTE SINISTRA: BLOCCO NAVIGAZIONE E METRICHE */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* CONTROLLI DI NAVIGAZIONE COMPLETI: [1° Libero] [ < Prec ] 1/65 (X disp.) [ Succ > ] */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={handleFirstAvail}
              className="px-2 py-0.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/70 text-cyan-300 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all active:scale-95 shadow"
              title="Riporta subito al primo portiere non ancora chiamato"
            >
              <span>⏮️ 1° Libero</span>
            </button>

            <button
              onClick={handlePrev}
              className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold flex items-center gap-1 transition-all active:scale-95 text-[11px]"
              title="Portiere precedente"
            >
              <ChevronLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Prec</span>
            </button>

            <div className="font-mono text-xs select-none">
              <span className="text-white font-black">{activeGoalkeeperIndex + 1}</span>
              <span className="text-slate-500">/{allGoalkeepers.length}</span>
              <span className="text-emerald-400 font-bold ml-1.5">({availableGoalkeepersCount} disp.)</span>
            </div>

            <button
              onClick={handleNext}
              className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold flex items-center gap-1 transition-all active:scale-95 text-[11px]"
              title="Portiere successivo"
            >
              <span className="hidden sm:inline">Succ</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono">
            <div className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
              <span className="text-slate-400">Slot P: </span>
              <strong className="text-amber-400">{totalSlotsRemaining}</strong>/{totalSlotsNeeded}
            </div>
            <div className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 hidden sm:block text-[11px]">
              <span className="text-slate-400">Titolarissimi Liberi: </span>
              <strong className="text-emerald-400">{availableStartersCount}</strong>/20
            </div>
          </div>
        </div>

        {/* PARTE DESTRA: MATRICE 20x20 E SCRITTA WAR ROOM PORTIERI */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFullMatrix(true)}
            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-300 border border-amber-400 dark:border-amber-500/40 font-black flex items-center gap-1.5 transition-all active:scale-95 text-[11px] shadow-sm"
            title="Visualizza la matrice incroci 20x20 completa di Fantacalcio.it"
          >
            <Table className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span className="hidden sm:inline">Matrice 20x20</span>
          </button>

          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-500" />
            <h1 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-wide uppercase">
              WAR ROOM PORTIERI
            </h1>
          </div>
        </div>
      </div>

      {/* 2. CORPO PRINCIPALE A 2 COLONNE:
          SINISTRA (col-span-8): SCHEDA PORTIERE + FAST BIDDING
          DESTRA (col-span-4): MIGLIORI ABBINAMENTI IN GROSSO BEN VISIBILE */}
      <div className="grid grid-cols-12 gap-2 items-stretch flex-1 min-h-0 overflow-hidden">
        
        {/* COLONNA SINISTRA: SCHEDA & FAST BIDDING COMPATTI */}
        <div className="col-span-8 flex flex-col justify-between h-full min-h-0 overflow-hidden">
          <div className="flex-shrink-0">
            <StatsCard player={playerInFocus} />
          </div>
          <div className="flex-shrink-0 pt-1">
            <FastBiddingPanel player={playerInFocus} />
          </div>
        </div>

        {/* COLONNA DESTRA: MIGLIORI ABBINAMENTI IN GROSSO BEN VISIBILE (O LISTA A-Z) */}
        <div className="col-span-4 bg-slate-900 border border-amber-500/30 rounded-xl p-2 sm:p-2.5 shadow-xl flex flex-col h-full min-h-0 overflow-hidden">
          
          {/* HEADER DELLA COLONNA DESTRA: TITOLO, SWITCH GIORNATE E TABS VISTA */}
          <div className="pb-1.5 border-b border-slate-800 flex-shrink-0 space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 truncate">
                <ArrowRightLeft className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="truncate">
                  <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-wide truncate">
                    Migliori Abbinamenti
                  </h2>
                  <div className="text-[11px] font-bold text-amber-400 truncate">
                    per <span className="underline decoration-amber-400/50">{currentTeamExamined}</span>
                  </div>
                </div>
              </div>

              {/* CONTROLLI DI FILTRO GIORNATE */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] flex-shrink-0">
                <button
                  onClick={() => setStartMatchday(6)}
                  className={`px-2 py-0.5 rounded font-black transition-all ${
                    startMatchday === 6
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Calcola sui 33 turni rimanenti (6ª-38ª giornata)"
                >
                  6ª-38ª (33)
                </button>
                <button
                  onClick={() => setStartMatchday(1)}
                  className={`px-2 py-0.5 rounded font-black transition-all ${
                    startMatchday === 1
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Calcola su tutte le 38 giornate"
                >
                  1ª-38ª (38)
                </button>
              </div>
            </div>

            {/* SELETTORE VISTA (ABBINAMENTI vs TUTTI I PORTIERI) */}
            <div className="grid grid-cols-2 gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setRightPanelView('pairings')}
                className={`py-1 rounded-md transition-all flex items-center justify-center gap-1 ${
                  rightPanelView === 'pairings'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3 h-3" />
                <span>Abbinamenti ({bestPairings.length})</span>
              </button>
              <button
                onClick={() => setRightPanelView('all_players')}
                className={`py-1 rounded-md transition-all flex items-center justify-center gap-1 ${
                  rightPanelView === 'all_players'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Portieri A-Z ({filteredGoalkeepers.length})</span>
              </button>
            </div>
          </div>

          {/* CONTENUTO VISTA 1: MIGLIORI ABBINAMENTI SCRITTI IN GROSSO BEN VISIBILI */}
          {rightPanelView === 'pairings' ? (
            <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-thin mt-1.5 min-h-0">
              {bestPairings.map((pairing, index) => {
                const partnerStarter = startersByTeam.get(pairing.team);
                const assignedTeam = partnerStarter?.assignedTo ? teams.find(t => t.id === partnerStarter.assignedTo) : null;
                const totalMatches = startMatchday === 6 ? 33 : 38;
                const homeCoverage = pairing.homeMatches;
                const pct = Math.round((homeCoverage / totalMatches) * 100);

                const isTakenByMe = isPlayerTakenByMe(partnerStarter);
                const isTakenByOpponent = isPlayerTakenByOpponent(partnerStarter);
                const isAvailable = partnerStarter && partnerStarter.status === 'available';
                const isSelected = playerInFocus?.squadra === pairing.team;
                const squadKeepers = teamGoalkeepersMap.get(pairing.team) || [];

                return (
                  <div
                    key={pairing.team}
                    onClick={() => partnerStarter && handleSelectGoalkeeper(partnerStarter)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all select-none space-y-1.5 ${
                      isTakenByMe
                        ? 'border-emerald-400 bg-emerald-950/80 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/60 animate-pulse'
                        : isTakenByOpponent
                          ? 'border-slate-800/80 bg-slate-950/60 opacity-60 hover:opacity-90'
                          : isSelected
                            ? 'bg-slate-850 border-amber-400 ring-1 ring-amber-400 shadow-md cursor-pointer'
                            : 'bg-slate-950 border-slate-800 hover:border-amber-400/70 hover:bg-slate-850/80 cursor-pointer shadow-sm'
                    }`}
                  >
                    {/* RIGA 1: NOME SQUADRA IN GROSSO + BADGE PARTITE IN CASA IN GROSSO */}
                    <div className="flex items-center justify-between gap-2 leading-tight">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-mono font-black text-slate-500 flex-shrink-0">
                          #{index + 1}
                        </span>
                        <span className={`font-black text-base sm:text-lg uppercase tracking-wider truncate ${
                          isTakenByMe ? 'text-emerald-300' : isTakenByOpponent ? 'text-slate-400' : 'text-white'
                        }`}>
                          {pairing.team}
                        </span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black flex items-center gap-1 shadow-sm flex-shrink-0 ${
                        pairing.score === 0 
                          ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400' 
                          : pairing.score <= 4 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 font-black' 
                            : pairing.score <= 7 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold' 
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <span className="text-[10px] uppercase font-normal opacity-80">Casa:</span>
                        <strong>{homeCoverage}/{totalMatches}</strong>
                        <span className="text-[10px] font-mono font-semibold">({pct}%)</span>
                      </span>
                    </div>

                    {/* RIGA 2: PORTIERE TITOLARE (BARRATO SE PRESO, VERDE PULSANTE SE MIO, LIBERO SE DISPONIBILE) */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-400 text-xs font-mono font-bold flex-shrink-0">P1:</span>
                        <span className={`font-black text-sm sm:text-base uppercase truncate ${
                          isTakenByMe
                            ? 'text-emerald-200'
                            : isTakenByOpponent
                              ? 'line-through decoration-red-500 decoration-2 text-slate-500'
                              : 'text-white'
                        }`}>
                          {partnerStarter ? partnerStarter.nome : '-'}
                        </span>
                        {partnerStarter && (
                          <div className="flex items-center gap-1.5 text-xs font-mono ml-1 flex-shrink-0">
                            <span>FVM: <strong className="text-amber-400 font-black text-xs sm:text-sm">{partnerStarter.fvm}</strong></span>
                            <span>MV: <strong className="text-emerald-400 font-black text-xs sm:text-sm">{partnerStarter.seasons?.['2026/27']?.mv ? partnerStarter.seasons['2026/27'].mv.toFixed(2) : '-'}</strong></span>
                            <span title="Media Voto Ultimo Anno (2025/26)">MV '26: <strong className="text-cyan-300 font-black text-xs sm:text-sm">{partnerStarter.seasons?.['2025/26']?.mv ? partnerStarter.seasons['2025/26'].mv.toFixed(2) : (partnerStarter.mv ? partnerStarter.mv.toFixed(2) : '-')}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* BADGE DI STATO PROPRIETARIO */}
                      <div className="flex-shrink-0">
                        {isTakenByMe ? (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>PRESO DA TE ({partnerStarter?.price}c)</span>
                          </span>
                        ) : isTakenByOpponent ? (
                          <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-800/80 text-red-400 font-mono text-xs font-bold truncate max-w-[170px]" title={`Assegnato a ${assignedTeam?.name} per ${partnerStarter?.price} crediti`}>
                            {assignedTeam?.name?.slice(0, 9)} ({partnerStarter?.price}c)
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                              Libero
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                partnerStarter && handleSelectGoalkeeper(partnerStarter);
                              }}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-black flex items-center gap-1 transition-all shadow-sm active:scale-95"
                              title="Chiama all'asta questo portiere"
                            >
                              <Gavel className="w-3 h-3" />
                              <span>Chiama</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGA 3: ALTRI PORTIERI DELLA SQUADRA (2° E 3° PORTIERE) */}
                    {squadKeepers.length > 1 && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/70 overflow-x-auto">
                        <span className="text-[10px] text-slate-500 uppercase font-bold flex-shrink-0">Altri:</span>
                        {squadKeepers.filter(p => p.id !== partnerStarter?.id).map(kp => {
                          const kpTakenByMe = isPlayerTakenByMe(kp);
                          const kpTakenByOpp = isPlayerTakenByOpponent(kp);
                          const kpTeam = kp.assignedTo ? teams.find(t => t.id === kp.assignedTo) : null;

                          return (
                            <span
                              key={kp.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectGoalkeeper(kp);
                              }}
                              className={`px-1.5 py-0.2 rounded border cursor-pointer text-[10px] flex items-center gap-1 flex-shrink-0 ${
                                kpTakenByMe
                                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-black animate-pulse'
                                  : kpTakenByOpp
                                    ? 'line-through decoration-red-500 text-slate-500 border-slate-850'
                                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                              }`}
                              title={kpTakenByMe ? `Preso da te (${kp.price}c)` : kpTakenByOpp ? `Assegnato a ${kpTeam?.name} (${kp.price}c)` : `Libero - Qt ${kp.quotazione}`}
                            >
                              {kp.nome} {kp.price ? `(${kp.price}c)` : ''}
                            </span>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            /* CONTENUTO VISTA 2: LISTA COMPLETA PORTIERI A-Z CON RICERCA E FILTRI */
            <div className="flex flex-col flex-1 min-h-0 space-y-1.5 mt-1.5">
              {/* SEARCH BAR */}
              <div className="relative">
                <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cerca portiere..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-lg pl-6 pr-2 py-0.5 text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* DROPDOWN FILTER */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-750 text-amber-300 font-black text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400 cursor-pointer uppercase shadow-sm"
                >
                  <option value="all">Filtro: Tutti i Portieri ({allGoalkeepers.length})</option>
                  <option value="starters">Filtro: Solo i 20 Titolarissimi (≥3/4 o 4/5)</option>
                  <option value="available">Filtro: Solo Liberi / Non Assegnati</option>
                  <option value="big">Filtro: Big 7 (Juve, Inter, Milan, ecc.)</option>
                  <option value="lowcost">Filtro: Low Cost (Altre 13 Squadre)</option>
                </select>
              </div>

              {/* TABS FILTRO RAPIDO */}
              <div className="flex items-center gap-1 text-[10px] font-bold overflow-x-auto pb-0.5">
                {[
                  { id: 'all', label: 'Tutti' },
                  { id: 'starters', label: 'Titolarissimi' },
                  { id: 'available', label: 'Liberi' },
                  { id: 'big', label: 'Big 7' },
                  { id: 'lowcost', label: 'Low Cost' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id as any)}
                    className={`px-2 py-0.5 rounded transition-all whitespace-nowrap active:scale-95 ${
                      filterType === tab.id
                        ? 'bg-amber-500 text-slate-950 font-black shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* LISTA DEI PORTIERI SCORREVOLE */}
              <div className="space-y-1 flex-1 overflow-y-auto pr-0.5 scrollbar-thin min-h-0">
                {filteredGoalkeepers.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs italic">
                    Nessun portiere corrisponde al filtro.
                  </div>
                ) : (
                  filteredGoalkeepers.map(p => {
                    const isSelected = playerInFocus?.id === p.id;
                    const isStarter = isTitolarissimo(p);
                    const topPairing = getBestPairingsForTeam(p.squadra, startMatchday)[0];
                    const assignedTeam = p.assignedTo ? teams.find(t => t.id === p.assignedTo) : null;
                    const pTakenByMe = isPlayerTakenByMe(p);
                    const pTakenByOpp = isPlayerTakenByOpponent(p);

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectGoalkeeper(p)}
                        className={`p-1.5 rounded-xl border text-left cursor-pointer transition-all space-y-0.5 ${
                          pTakenByMe
                            ? 'border-emerald-400 bg-emerald-950/70 ring-2 ring-emerald-400/60 animate-pulse'
                            : pTakenByOpp
                              ? 'border-slate-800/80 bg-slate-950/60 opacity-60 hover:opacity-90'
                              : isSelected
                                ? 'bg-slate-800 border-amber-500 ring-1 ring-amber-500 shadow-md'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        {/* RIGA 1: NOME, SQUADRA, FVM, QT */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className={`font-black text-xs uppercase truncate ${
                              pTakenByMe
                                ? 'text-emerald-300'
                                : pTakenByOpp
                                  ? 'line-through decoration-red-500 text-slate-500'
                                  : 'text-white'
                            }`}>
                              {p.nome}
                            </span>
                            <span className="text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-1 rounded font-bold">
                              {p.squadra}
                            </span>
                            {isStarter ? (
                              <span 
                                className="px-1 py-0.2 rounded bg-emerald-400 text-slate-950 text-[9px] font-black" 
                                title={p.seasons?.['2026/27']?.titolaritaDettaglio || "Titolarissimo (almeno 3/4 o 4/5 gare da titolare)"}
                              >
                                T
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            <span>Qt: <strong className="text-white font-bold">{p.quotazione}</strong></span>
                            <span>FVM: <strong className="text-amber-400 font-black text-xs sm:text-sm">{p.fvm}</strong></span>
                            <span>MV: <strong className="text-emerald-400 font-black text-xs sm:text-sm">{p.seasons?.['2026/27']?.mv ? p.seasons['2026/27'].mv.toFixed(2) : '-'}</strong></span>
                            <span title="Media Voto Ultimo Anno (2025/26)">MV '26: <strong className="text-cyan-300 font-black text-xs sm:text-sm">{p.seasons?.['2025/26']?.mv ? p.seasons['2025/26'].mv.toFixed(2) : (p.mv ? p.mv.toFixed(2) : '-')}</strong></span>
                          </div>
                        </div>

                        {/* RIGA 2: TOP INCROCIO + STATO ASTA */}
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                          {topPairing ? (
                            <span className="flex items-center gap-1 text-slate-300">
                              <span className="text-slate-400">Top Incrocio:</span>
                              <strong className="text-emerald-400">{topPairing.team}</strong>
                              <span className="px-1 rounded text-[9px] bg-slate-850 border border-slate-700 font-bold">
                                {topPairing.homeMatches}/{startMatchday === 6 ? 33 : 38}
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}

                          <div>
                            {pTakenByMe ? (
                              <span className="text-emerald-300 font-black text-[9px] bg-emerald-950 border border-emerald-500/50 px-1.5 py-0.2 rounded">
                                PRESO ({p.price}c)
                              </span>
                            ) : pTakenByOpp ? (
                              <span className="text-slate-400 font-bold text-[9px]">
                                {assignedTeam?.name?.slice(0, 5)} ({p.price}c)
                              </span>
                            ) : p.status === 'skipped' ? (
                              <span className="text-amber-400 font-bold text-[9px]">Invenduto</span>
                            ) : (
                              <span className="text-emerald-400 font-bold text-[9px]">Libero</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 3. RIGA INFERIORE SUL FONDO: PROSSIMI 2 ARRIVI IN ASTA COME PER L'ASTA STANDARD */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-1.5 sm:p-2 shadow-md flex-shrink-0">
        {/* HEADER DELLA SEZIONE PROSSIMI ARRIVI A TUTTA LARGHEZZA */}
        <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-black uppercase text-white tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prossimi Arrivi in Asta (Portieri)</span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({availableGoalkeepersCount} disponibili in coda)
            </span>
          </div>

          <span className="text-[10px] text-slate-400 font-mono">
            {selectedTeamFilter !== 'ALL' ? `${selectedTeamFilter} • P A-Z` : 'Portieri A-Z'}
          </span>
        </div>

        {/* GRIGLIA CARTE PROSSIMI ARRIVI (2 CARTE AFFIANCATE A TUTTA LARGHEZZA) */}
        <div className="grid grid-cols-2 gap-2">
          {upcomingGoalkeepers.length === 0 ? (
            <div className="col-span-2 text-center py-2.5 text-xs text-slate-500 italic bg-slate-950/60 rounded-lg border border-slate-850">
              Tutti i portieri disponibili sono stati chiamati o assegnati!
            </div>
          ) : (
            upcomingGoalkeepers.map((p, idx) => {
              const isSelected = playerInFocus?.id === p.id;
              const isStarter = isTitolarissimo(p);
              const redazioneComment = FANTAGAZZETTA_ADVICE[p.nome.toUpperCase()]?.commentoRedazione;
              const injury = getInjuryInfo(p.nome);

              return (
                <div
                  key={p.id}
                  className={`p-1.5 sm:p-2 rounded-xl border transition-all space-y-1 group ${
                    isSelected 
                      ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* RIGA 1: NUMERO, RUOLO, NOME, SQUADRA, BADGES & TASTO CHIAMA */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div 
                      className="flex items-center gap-1.5 truncate cursor-pointer flex-1 min-w-0"
                      onClick={() => handleSelectGoalkeeper(p)}
                    >
                      <span className="text-xs font-mono text-slate-500 font-black flex-shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="w-4 h-4 rounded text-[9px] font-black flex items-center justify-center flex-shrink-0 bg-amber-500 text-slate-950">
                        P
                      </span>
                      <span className="font-black text-xs sm:text-sm text-white group-hover:text-emerald-300 uppercase truncate">
                        {p.nome}
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded font-bold truncate flex-shrink-0">
                        {p.squadra}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isStarter && (
                        <span 
                          className="px-1.5 py-0.2 rounded bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950 text-[9px] font-black" 
                          title={p.seasons?.['2026/27']?.titolaritaDettaglio || "Titolarissimo (almeno 3/4 o 4/5 gare da titolare)"}
                        >
                          T
                        </span>
                      )}
                      {p.rigorista ? (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[9px] font-black" title="Rigorista">
                          R
                        </span>
                      ) : null}
                      {injury && (
                        <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-black shadow-sm" title={`Infortunato: ${injury.infortunio}`}>
                          🏥 {injury.meseRientro}
                        </span>
                      )}
                      <button
                        onClick={() => handleSelectGoalkeeper(p)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white text-[10px] font-black flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                        title="Chiama subito all'asta"
                      >
                        <Gavel className="w-3 h-3" />
                        <span>Chiama</span>
                      </button>
                    </div>
                  </div>

                  {/* RIGA 2: STATISTICHE (Qt, FVM, MV, MV '26, FM, GS) INGRANDITI */}
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-850 flex-wrap gap-1">
                    <span>Qt: <strong className="text-white text-xs sm:text-sm font-bold">{p.quotazione}</strong></span>
                    <span>FVM: <strong className="text-amber-400 text-sm sm:text-base font-black">{p.fvm}</strong></span>
                    <span>MV: <strong className={(p.seasons?.['2026/27']?.mv ?? p.mv ?? 0) >= 6.0 ? 'text-emerald-400 font-black text-sm sm:text-base' : 'text-slate-200 text-sm sm:text-base font-black'}>{p.seasons?.['2026/27']?.mv ? p.seasons['2026/27'].mv.toFixed(2) : '-'}</strong></span>
                    <span title="Media Voto Ultimo Anno (2025/26)">MV '26: <strong className={(p.seasons?.['2025/26']?.mv ?? p.mv ?? 0) >= 6.0 ? 'text-cyan-300 font-black text-sm sm:text-base' : 'text-slate-300 text-sm sm:text-base font-black'}>{p.seasons?.['2025/26']?.mv ? p.seasons['2025/26'].mv.toFixed(2) : (p.mv ? p.mv.toFixed(2) : '-')}</strong></span>
                    <span>FM: <strong className={(p.fm ?? 0) >= 7.0 ? 'text-indigo-300 font-bold' : 'text-slate-200'}>{p.fm ? p.fm.toFixed(2) : '-'}</strong></span>
                    <span>GS: <strong className="text-white font-bold">{p.gs ?? 0}</strong></span>
                  </div>

                  {/* RIGA 3: NOTE PERSONALI & COMMENTI */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <Edit3 className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder={redazioneComment ? `Commento: ${redazioneComment}` : "Nota / Commento (es. max 18, titolare)..."}
                      value={p.note || ''}
                      onChange={(e) => updatePlayerNote(p.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="w-full bg-slate-900 border border-slate-750 hover:border-slate-600 focus:border-amber-400 rounded-lg px-2 py-0.5 text-xs text-amber-300 placeholder-slate-400/80 focus:outline-none font-medium h-5.5"
                      title={p.note || (redazioneComment ? `Commento redazione: ${redazioneComment}` : undefined)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL MATRICE COMPLETA 20x20 FANTACALCIO.IT */}
      {showFullMatrix && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-4 max-w-5xl w-full max-h-[90vh] flex flex-col justify-between shadow-2xl space-y-3">
            
            {/* HEADER MODAL */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Table className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-black text-white uppercase">
                      Griglia Portieri Serie A
                    </h2>
                    <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      {startMatchday === 6 ? 'Dalla 6ª giornata (33 turni)' : 'Stagione completa (38 turni)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {startMatchday === 6 
                      ? 'Incroci ricalcolati sulle 33 giornate rimanenti (MD 6–38). Valore = trasferte contemporanee (0 = 33/33 in casa).'
                      : 'Incroci sull\'intero campionato (MD 1–38). Valore = trasferte contemporanee (0 = 38/38 in casa).'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setStartMatchday(6)}
                    className={`px-2.5 py-1 rounded font-black transition-all ${
                      startMatchday === 6
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Dalla 6ª (33 gare)
                  </button>
                  <button
                    onClick={() => setStartMatchday(1)}
                    className={`px-2.5 py-1 rounded font-black transition-all ${
                      startMatchday === 1
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tutto (38 gare)
                  </button>
                </div>

                <button
                  onClick={() => setShowFullMatrix(false)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                >
                  ✕ Chiudi
                </button>
              </div>
            </div>

            {/* TABELLA SCROLLABILE 20x20 */}
            <div className="overflow-auto max-h-[65vh] border border-slate-800 rounded-xl scrollbar-thin">
              <table className="w-full text-center text-xs font-mono border-collapse">
                <thead className="bg-slate-950 sticky top-0 z-10 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-1.5 text-left sticky left-0 bg-slate-950 z-20 border-r border-slate-800">
                      Squadra
                    </th>
                    {GOALKEEPER_GRID_TEAMS.map(team => (
                      <th key={team} className="p-1 min-w-[32px] text-center" title={team}>
                        {team.slice(0, 3).toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {GOALKEEPER_GRID_TEAMS.map(rowTeam => (
                    <tr key={rowTeam} className="hover:bg-slate-800/50">
                      <td className="p-1.5 text-left font-black text-white uppercase text-[11px] sticky left-0 bg-slate-900 border-r border-slate-800 whitespace-nowrap">
                        {rowTeam}
                      </td>
                      {GOALKEEPER_GRID_TEAMS.map(colTeam => {
                        const val = currentMatrix[rowTeam]?.[colTeam] ?? 0;
                        const totalRounds = startMatchday === 6 ? 33 : 38;
                        const homeRounds = totalRounds - val;
                        const isSame = rowTeam.toLowerCase() === colTeam.toLowerCase();

                        return (
                          <td 
                            key={colTeam} 
                            className={`p-1 text-[11px] font-bold ${
                              isSame
                                ? 'bg-slate-950 text-slate-600'
                                : val === 0
                                  ? 'bg-emerald-500 text-slate-950 font-black'
                                  : val <= 4
                                    ? 'bg-emerald-600/30 text-emerald-300 font-black'
                                    : val <= 7
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'text-slate-400'
                            }`}
                            title={`${rowTeam} + ${colTeam}: ${val} trasferte contemporanee (${homeRounds}/${totalRounds} in casa)`}
                          >
                            {isSame ? '-' : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* LEGENDA */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> 0 = Perfetto (Mai insieme fuori)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-emerald-600/40 border border-emerald-500 inline-block" /> 1-4 = Ottimo
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500 inline-block" /> 5-7 = Buono
                </span>
              </div>
              <span>Fonte: griglia-portieri ufficiale Fantacalcio.it</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
