import React, { useState, useMemo, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Player, Role } from '../types';
import { 
  TED_FORMATIONS, 
  TedPlayerCard, 
  generateTedLineup, 
  getTedPlayerVerdict, 
  evaluateDefenseModifier,
  assignPitchCoordinates,
  TED_LASSO_QUOTES 
} from '../utils/tedLassoAdvisor';

const ROLE_NAMES: Record<Role, string> = {
  P: 'Portiere',
  D: 'Difensore',
  C: 'Centrocampista',
  A: 'Attaccante'
};
import { 
  CURRENT_MATCHDAY_NUMBER,
  CURRENT_MATCHDAY_TITLE, 
  CURRENT_SERIE_A_FIXTURES,
  NEXT_MATCHDAY_NUMBER,
  NEXT_MATCHDAY_TITLE,
  NEXT_SERIE_A_FIXTURES,
  cleanPlayerName
} from '../data/matchdayData';
import { PlayerPerformanceChart } from './PlayerPerformanceChart';
import { getDiddiMatchdayYoutubeAdvice, getFantagazzettaConsigliatoStatus } from '../utils/matchdayAdviceProvider';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRightLeft, 
  Flame, 
  Star, 
  X, 
  Activity, 
  HelpCircle,
  Calendar,
  RefreshCw,
  Globe,
  CheckCircle,
  Copy,
  Save,
  Check,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Info,
  Home,
  Settings
} from 'lucide-react';

export const TedLassoView: React.FC = () => {
  const { 
    teams, 
    myTeamId, 
    players, 
    syncedOnlineData, 
    isSyncingOnline, 
    lastOnlineSyncTime, 
    syncOnlineData,
    setActiveView
  } = useAuction();

  // 1. SELEZIONE SEZIONE / TAB: 'next' (Schiera Prossima Gara) o 'current' (Partita in Corso)
  const [activeTab, setActiveTab] = useState<'next' | 'current'>('next');

  // Squadra selezionata (default: Scarsenal / myTeamId)
  const [selectedTeamId, setSelectedTeamId] = useState<string>(myTeamId || 'team-1');
  const [selectedFormationId, setSelectedFormationId] = useState<string>('3-4-3');
  const [selectedPlayerForReport, setSelectedPlayerForReport] = useState<TedPlayerCard | null>(null);
  const [swappingPlayerId, setSwappingPlayerId] = useState<number | null>(null);
  const [swapWarning, setSwapWarning] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [lineupOverrides, setLineupOverrides] = useState<{ starters: number[]; bench: number[] } | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<{ show: boolean; message: string; success: boolean } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [saveFeedback, setSaveFeedback] = useState<boolean>(false);
  const [showFixturesModal, setShowFixturesModal] = useState<boolean>(false);

  // Squadra corrente
  const activeTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  // Risolvi i giocatori completi della squadra dalle assegnazioni
  const teamFullPlayers = useMemo(() => {
    if (!activeTeam) return [];
    return activeTeam.players
      .map(assign => players.find(p => p.id === assign.playerId))
      .filter((p): p is Player => p !== undefined);
  }, [activeTeam, players]);

  // Calcolo Formazione Ted Lasso in funzione della giornata selezionata ('next' o 'current')
  const baseLineup = useMemo(() => {
    return generateTedLineup(teamFullPlayers, selectedFormationId, syncedOnlineData, activeTab);
  }, [teamFullPlayers, selectedFormationId, syncedOnlineData, activeTab]);

  // Carica eventuale formazione salvata per il tab corrente validandone l'integrità dei ruoli
  useEffect(() => {
    const saved = localStorage.getItem(`fanta_lineup_${activeTab}_${selectedTeamId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.starters && parsed.bench && parsed.formationId) {
          const expectedSlots = (TED_FORMATIONS[parsed.formationId] || TED_FORMATIONS['3-4-3']).slots;
          const startersIds = Array.isArray(parsed.starters) ? (parsed.starters as number[]) : [];
          const starterCards = startersIds
            .map((id: number) => teamFullPlayers.find((p: Player) => p.id === id))
            .filter((p: Player | undefined): p is Player => p !== undefined);

          const pCount = starterCards.filter((p: Player) => p.ruolo === 'P').length;
          const dCount = starterCards.filter((p: Player) => p.ruolo === 'D').length;
          const cCount = starterCards.filter((p: Player) => p.ruolo === 'C').length;
          const aCount = starterCards.filter((p: Player) => p.ruolo === 'A').length;

          const isValid = starterCards.length === 11 &&
            pCount === expectedSlots.P &&
            dCount === expectedSlots.D &&
            cCount === expectedSlots.C &&
            aCount === expectedSlots.A;

          if (isValid) {
            setSelectedFormationId(parsed.formationId);
            setLineupOverrides({ starters: parsed.starters, bench: parsed.bench });
          } else {
            console.warn('Formazione salvata non coerente con i ruoli di formazione, ripristino default');
            localStorage.removeItem(`fanta_lineup_${activeTab}_${selectedTeamId}`);
            setLineupOverrides(null);
          }
        }
      } catch (e) {
        console.warn('Errore lettura formazione salvata', e);
        setLineupOverrides(null);
      }
    } else {
      setLineupOverrides(null);
    }
  }, [activeTab, selectedTeamId, teamFullPlayers]);

  // Gestione Aggiornamento Dati Online
  const handleSyncOnline = async () => {
    const res = await syncOnlineData();
    setLineupOverrides(null);
    setSwappingPlayerId(null);
    setSwapWarning(null);
    setSyncFeedback({
      show: true,
      message: res.message,
      success: res.success
    });
    setTimeout(() => {
      setSyncFeedback(null);
    }, 7000);
  };

  // Gestione scambi manuali (Swap) tra titolari e panchina con ricalcolo esatto delle coordinate del campo
  const { starters, bench, formation } = useMemo(() => {
    if (!lineupOverrides) return baseLineup;

    // Crea copie degli elementi senza coordinate pregresse per evitare salti o sovrapposizioni
    const allCards = [...baseLineup.starters, ...baseLineup.bench].map(c => ({
      ...c,
      pitchPosition: undefined
    }));
    const cardMap = new Map(allCards.map(c => [c.player.id, c]));

    const startersCards: TedPlayerCard[] = [];
    lineupOverrides.starters.forEach(id => {
      const c = cardMap.get(id);
      if (c) {
        c.isStarter = true;
        startersCards.push(c);
      }
    });

    const benchCards: TedPlayerCard[] = [];
    lineupOverrides.bench.forEach((id) => {
      const c = cardMap.get(id);
      if (c) {
        c.isStarter = false;
        benchCards.push(c);
      }
    });

    // Riordina la panchina nel classico ordine Fanta: 1 P, 2 D, 2 C, 2 A ordinati per score decrescente
    const benchP = benchCards.filter(b => b.player.ruolo === 'P').sort((a, b) => b.tedScore - a.tedScore);
    const benchD = benchCards.filter(b => b.player.ruolo === 'D').sort((a, b) => b.tedScore - a.tedScore);
    const benchC = benchCards.filter(b => b.player.ruolo === 'C').sort((a, b) => b.tedScore - a.tedScore);
    const benchA = benchCards.filter(b => b.player.ruolo === 'A').sort((a, b) => b.tedScore - a.tedScore);

    const orderedBench: TedPlayerCard[] = [];
    let benchIndex = 1;
    [...benchP, ...benchD, ...benchC, ...benchA].forEach(card => {
      card.benchOrder = benchIndex++;
      orderedBench.push(card);
    });

    // Ricalcola SEMPRE le coordinate visive del campo tattico per i titolari in base al loro ruolo
    assignPitchCoordinates(startersCards, baseLineup.formation);

    return {
      starters: startersCards,
      bench: orderedBench,
      formation: baseLineup.formation
    };
  }, [baseLineup, lineupOverrides]);

  // Giocatore attualmente selezionato per la sostituzione (se presente)
  const swappingPlayerCard = useMemo(() => {
    if (!swappingPlayerId) return null;
    return [...starters, ...bench].find(c => c.player.id === swappingPlayerId) || null;
  }, [swappingPlayerId, starters, bench]);

  // Analisi Modificatore di Difesa
  const defenseModifier = useMemo(() => {
    return evaluateDefenseModifier(starters);
  }, [starters]);

  // Top pick, scommessa e trappola
  const { topPick, scommessa, trappola } = useMemo(() => {
    const sorted = [...starters, ...bench].sort((a, b) => b.tedScore - a.tedScore);
    const top = sorted[0] || null;
    const scomm = sorted.find(c => c.evaluation.fantagazzetta.fascia === 'Scommessa' || c.tedScore >= 70 && c.player.ruolo === 'C') || sorted[1] || null;
    const trap = sorted.find(c => c.evaluation.fantagazzetta.fascia === 'Trappola da Evitare' || (c.evaluation.match && c.evaluation.match.difficulty >= 4 && c.tedScore < 65)) || sorted[sorted.length - 1] || null;
    return { topPick: top, scommessa: scomm, trappola: trap };
  }, [starters, bench]);

  // Lista ordinata di tutti i calciatori della formazione (titolari + panchina) per navigazione modale
  const allReportCards = useMemo(() => {
    return [...starters, ...bench];
  }, [starters, bench]);

  // Navigazione tra calciatori con frecce (tastiera e pulsanti)
  const handlePrevPlayer = () => {
    if (!selectedPlayerForReport || allReportCards.length === 0) return;
    const currentIndex = allReportCards.findIndex(c => c.player.id === selectedPlayerForReport.player.id);
    const prevIndex = (currentIndex - 1 + allReportCards.length) % allReportCards.length;
    setSelectedPlayerForReport(allReportCards[prevIndex]);
  };

  const handleNextPlayer = () => {
    if (!selectedPlayerForReport || allReportCards.length === 0) return;
    const currentIndex = allReportCards.findIndex(c => c.player.id === selectedPlayerForReport.player.id);
    const nextIndex = (currentIndex + 1) % allReportCards.length;
    setSelectedPlayerForReport(allReportCards[nextIndex]);
  };

  // Listener da tastiera per navigare con freccia sinistra e freccia destra
  useEffect(() => {
    if (!selectedPlayerForReport) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPlayer();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPlayer();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedPlayerForReport(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlayerForReport, allReportCards]);

  // Set normalizzato dei nomi dei calciatori appartenenti alla rosa dell'utente
  const squadPlayerCleanNames = useMemo(() => {
    return new Set(teamFullPlayers.map(p => cleanPlayerName(p.nome)));
  }, [teamFullPlayers]);

  // Ballottaggi live filtrati rigorosamente SOLO per i calciatori presenti nella rosa dell'utente
  const squadBallottaggi = useMemo(() => {
    if (!syncedOnlineData?.ballottaggi || teamFullPlayers.length === 0) return [];

    const isMatch = (ballotName: string) => {
      const cleanB = cleanPlayerName(ballotName);
      if (!cleanB) return false;
      for (const uName of squadPlayerCleanNames) {
        if (uName === cleanB) return true;
        const uParts = uName.split(' ');
        const bParts = cleanB.split(' ');
        if (uParts[0] === bParts[0] && uParts[0].length >= 4) return true;
        if (cleanB.includes(uName) || uName.includes(cleanB)) return true;
      }
      return false;
    };

    return syncedOnlineData.ballottaggi.filter(b => isMatch(b.p1) || isMatch(b.p2));
  }, [syncedOnlineData, teamFullPlayers, squadPlayerCleanNames]);

  // Auto-schiera con Ted (ripristina ottimale)
  const handleAskTed = () => {
    setLineupOverrides(null);
    setSwappingPlayerId(null);
    setSwapWarning(null);
    setQuoteIndex(prev => (prev + 1) % TED_LASSO_QUOTES.length);
  };

  // Salva Formazione
  const handleSaveLineup = () => {
    const key = `fanta_lineup_${activeTab}_${selectedTeamId}`;
    const payload = {
      starters: starters.map(s => s.player.id),
      bench: bench.map(b => b.player.id),
      formationId: selectedFormationId,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(payload));
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
  };

  // Copia Formazione formattata per WhatsApp / Gruppo Fantacalcio
  const handleCopyLineup = () => {
    const title = activeTab === 'next' ? NEXT_MATCHDAY_TITLE : CURRENT_MATCHDAY_TITLE;
    const p = starters.filter(s => s.player.ruolo === 'P').map(s => `${s.player.nome} (${s.evaluation.match ? (s.evaluation.match.isHome ? 'vs ' : '@ ') + s.evaluation.match.opponent : s.player.squadra})`).join(', ');
    const d = starters.filter(s => s.player.ruolo === 'D').map(s => `${s.player.nome} (${s.evaluation.match ? (s.evaluation.match.isHome ? 'vs ' : '@ ') + s.evaluation.match.opponent : s.player.squadra})`).join(', ');
    const c = starters.filter(s => s.player.ruolo === 'C').map(s => `${s.player.nome} (${s.evaluation.match ? (s.evaluation.match.isHome ? 'vs ' : '@ ') + s.evaluation.match.opponent : s.player.squadra})`).join(', ');
    const a = starters.filter(s => s.player.ruolo === 'A').map(s => `${s.player.nome} (${s.evaluation.match ? (s.evaluation.match.isHome ? 'vs ' : '@ ') + s.evaluation.match.opponent : s.player.squadra})`).join(', ');
    
    const benchText = bench.slice(0, 7).map(b => `${b.benchOrder}° ${b.player.nome} [${b.player.ruolo}]`).join(', ');
    
    const text = `⚽ FORMAZIONE ${activeTeam.name.toUpperCase()} - ${title}
Modulo: ${formation.id}

TITOLARI:
P: ${p}
D: ${d}
C: ${c}
A: ${a}

PANCHINA:
${benchText}

🛡️ Modificatore Difesa: ${defenseModifier.expectedBonus} (${defenseModifier.advice})
👨🏻‍💼 Ted Lasso: "${TED_LASSO_QUOTES[quoteIndex]}"`;

    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 3000);
  };

  // Esegui scambio tra due giocatori con rigoroso controllo di compatibilità del ruolo (P con P, D con D, C con C, A con A)
  const handleSwap = (playerAId: number, playerBId: number) => {
    if (playerAId === playerBId) {
      setSwappingPlayerId(null);
      return;
    }

    const allCards = [...starters, ...bench];
    const cardA = allCards.find(c => c.player.id === playerAId);
    const cardB = allCards.find(c => c.player.id === playerBId);

    if (!cardA || !cardB) {
      setSwappingPlayerId(null);
      return;
    }

    // Regola imprescindibile del Fantacalcio: i cambi possono avvenire solo tra calciatori dello STESSO RUOLO!
    if (cardA.player.ruolo !== cardB.player.ruolo) {
      setSwapWarning(
        `Scambio non valido: puoi sostituire un ${ROLE_NAMES[cardA.player.ruolo]} solo con un altro ${ROLE_NAMES[cardA.player.ruolo]}. Hai selezionato ${cardB.player.nome} (${ROLE_NAMES[cardB.player.ruolo]}).`
      );
      setTimeout(() => setSwapWarning(null), 4500);
      return;
    }

    const currentStarterIds = starters.map(s => s.player.id);
    const currentBenchIds = bench.map(b => b.player.id);

    const isAStarter = currentStarterIds.includes(playerAId);
    const isBStarter = currentStarterIds.includes(playerBId);

    if (isAStarter && !isBStarter) {
      const newStarters = currentStarterIds.map(id => id === playerAId ? playerBId : id);
      const newBench = currentBenchIds.map(id => id === playerBId ? playerAId : id);
      setLineupOverrides({ starters: newStarters, bench: newBench });
    } else if (!isAStarter && isBStarter) {
      const newStarters = currentStarterIds.map(id => id === playerBId ? playerAId : id);
      const newBench = currentBenchIds.map(id => id === playerAId ? playerBId : id);
      setLineupOverrides({ starters: newStarters, bench: newBench });
    } else if (isAStarter && isBStarter) {
      // Due titolari dello stesso ruolo
      const newStarters = [...currentStarterIds];
      const idxA = newStarters.indexOf(playerAId);
      const idxB = newStarters.indexOf(playerBId);
      if (idxA !== -1 && idxB !== -1) {
        newStarters[idxA] = playerBId;
        newStarters[idxB] = playerAId;
        setLineupOverrides({ starters: newStarters, bench: currentBenchIds });
      }
    }

    setSwappingPlayerId(null);
    setSwapWarning(null);
  };

  // Colore del badge Ted Score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 text-slate-950 border-emerald-400 ring-emerald-400/50';
    if (score >= 70) return 'bg-blue-500 text-white border-blue-400 ring-blue-400/50';
    if (score >= 55) return 'bg-amber-500 text-slate-950 border-amber-400 ring-amber-400/50';
    return 'bg-red-500 text-white border-red-400 ring-red-400/50';
  };

  const getRoleBg = (role: Role) => {
    switch (role) {
      case 'P': return 'bg-amber-500 text-slate-950';
      case 'D': return 'bg-emerald-500 text-slate-950';
      case 'C': return 'bg-blue-500 text-white';
      case 'A': return 'bg-red-500 text-white';
    }
  };

  // Helper badge difficoltà visiva (FDR - Fixture Difficulty Rating)
  const getDifficultyBadge = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return {
          label: '1/5 Facile',
          tag: 'FACILE',
          color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50',
          dot: 'bg-emerald-400'
        };
      case 2:
        return {
          label: '2/5 Favorevole',
          tag: 'FAVOREVOLE',
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
          dot: 'bg-emerald-500'
        };
      case 3:
        return {
          label: '3/5 Media',
          tag: 'MEDIA',
          color: 'text-amber-300 bg-amber-950/70 border-amber-500/50',
          dot: 'bg-amber-400'
        };
      case 4:
        return {
          label: '4/5 Tosta',
          tag: 'DIFF.',
          color: 'text-orange-400 bg-orange-950/70 border-orange-500/50',
          dot: 'bg-orange-500'
        };
      case 5:
      default:
        return {
          label: '5/5 Proibitiva',
          tag: 'DURA',
          color: 'text-rose-400 bg-rose-950/80 border-rose-500/60',
          dot: 'bg-rose-500'
        };
    }
  };

  const currentFixtures = activeTab === 'next' ? NEXT_SERIE_A_FIXTURES : CURRENT_SERIE_A_FIXTURES;
  const currentTitle = activeTab === 'next' ? NEXT_MATCHDAY_TITLE : CURRENT_MATCHDAY_TITLE;

  return (
    <div className="h-full w-full flex flex-col justify-between overflow-hidden select-none space-y-1 relative">
      
      {/* NOTIFICA TOAST AGGIORNAMENTO DATI ONLINE */}
      {syncFeedback && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-emerald-500/70 shadow-2xl text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="flex-1 leading-tight">
            <span className="font-black text-white block">Informazioni Online Aggiornate!</span>
            <span className="text-[11px] text-slate-300 block">{syncFeedback.message}</span>
          </div>
          <button 
            onClick={() => setSyncFeedback(null)} 
            className="text-slate-400 hover:text-white p-1 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. TESTATA SUPERIORE CON SELETTORE DELLE 2 SEZIONI: PROSSIMA GARA VS PARTITA IN CORSO */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between gap-2.5 shadow-sm flex-shrink-0 flex-wrap">
        
        {/* PARTE SINISTRA: HOME & LOGO BELIEVE & TITOLO */}
        <div className="flex items-center gap-2">
          {/* Tasto Home per tornare alla Home / Dashboard principale */}
          <button
            onClick={() => setActiveView('home')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Torna al pannello Home"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Cartello BELIEVE Iconico */}
          <div 
            onClick={() => setQuoteIndex(prev => (prev + 1) % TED_LASSO_QUOTES.length)}
            className="px-3 py-1 rounded bg-amber-400 border border-amber-300 text-slate-950 font-black tracking-widest text-xs uppercase shadow -rotate-1 hover:rotate-0 transition-transform cursor-pointer select-none"
            title="Clicca per cambiare la citazione del giorno di Ted Lasso"
          >
            BELIEVE
          </div>

          <div>
            <h1 className="text-sm sm:text-base font-black text-white tracking-wide uppercase flex items-center gap-2">
              <span>TED LASSO</span>
              <span className="text-amber-400 text-xs sm:text-sm font-bold">Consigli Schieramento</span>
            </h1>
            <span className="text-xs text-slate-400 hidden sm:inline font-mono">
              {currentTitle}
            </span>
          </div>
        </div>

        {/* 2 GRANDI TAB DI SELEZIONE: PROSSIMA GARA VS PARTITA IN CORSO */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
          {/* TAB 1: SCHIERA PROSSIMA GARA */}
          <button
            onClick={() => {
              setActiveTab('next');
              setSwappingPlayerId(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-black flex items-center gap-2 transition-all select-none ${
              activeTab === 'next'
                ? 'bg-amber-400 text-slate-950 shadow-md ring-1 ring-amber-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Schiera la formazione per la prossima giornata (7ª Giornata, 2-5 Ottobre 2026)"
          >
            <Calendar className="w-4 h-4" />
            <span>Schiera Prossima Gara (7ª G.)</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              activeTab === 'next' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
            }`}>
              2-5 Ott
            </span>
          </button>

          {/* TAB 2: PARTITA IN CORSO */}
          <button
            onClick={() => {
              setActiveTab('current');
              setSwappingPlayerId(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-black flex items-center gap-2 transition-all select-none ${
              activeTab === 'current'
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-1 ring-emerald-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Visualizza la partita e la formazione del turno attualmente in corso (6ª Giornata)"
          >
            <Activity className="w-4 h-4" />
            <span>Partita in Corso (6ª G.)</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              activeTab === 'current' ? 'bg-slate-950 text-emerald-300 animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              LIVE
            </span>
          </button>
        </div>

        {/* PARTE DESTRA: MODULO & PULSANTI AZIONE */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* SELETTORE MODULO */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs sm:text-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Modulo:</span>
            <select
              value={selectedFormationId}
              onChange={(e) => {
                setSelectedFormationId(e.target.value);
                setLineupOverrides(null);
                setSwappingPlayerId(null);
              }}
              className="bg-transparent font-black text-amber-300 focus:outline-none cursor-pointer text-xs sm:text-sm"
            >
              {Object.values(TED_FORMATIONS).map(f => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                  {f.id}
                </option>
              ))}
            </select>
          </div>

          {/* PULSANTE CHIEDI A TED (AUTO-SCHIERA) */}
          <button
            onClick={handleAskTed}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs sm:text-sm font-black flex items-center gap-1.5 shadow active:scale-95 transition-all"
            title="Calcola e schiera automaticamente l'11 migliore considerando difficoltà avversaria e fattore campo"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span className="hidden xl:inline">Chiedi a Ted (Auto-Schiera)</span>
            <span className="xl:hidden">Auto-11</span>
          </button>

          {/* PULSANTE SALVA FORMAZIONE */}
          <button
            onClick={handleSaveLineup}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black flex items-center gap-1.5 shadow active:scale-95 transition-all ${
              saveFeedback 
                ? 'bg-emerald-600 text-white ring-1 ring-emerald-400' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
            title="Salva la formazione schierata nel browser per non perderla"
          >
            {saveFeedback ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4 text-slate-300" />}
            <span className="hidden sm:inline">{saveFeedback ? 'Salvata!' : 'Salva'}</span>
          </button>

          {/* PULSANTE COPIA WHATSAPP */}
          <button
            onClick={handleCopyLineup}
            className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-black flex items-center gap-1.5 shadow active:scale-95 transition-all ${
              copyFeedback 
                ? 'bg-emerald-600 text-white ring-1 ring-emerald-400' 
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
            }`}
            title="Copia la formazione formattata negli appunti per inviarla al gruppo WhatsApp del Fantacalcio"
          >
            {copyFeedback ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copyFeedback ? 'Copiata!' : 'Copia'}</span>
          </button>

          {/* PULSANTE AGGIORNA DATI ONLINE */}
          <button
            onClick={handleSyncOnline}
            disabled={isSyncingOnline}
            className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-black flex items-center gap-1.5 shadow active:scale-95 transition-all select-none ${
              isSyncingOnline
                ? 'bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title="Aggiorna online in tempo reale titolarità e probabili formazioni"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingOnline ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">{isSyncingOnline ? 'Sync...' : 'Sync Live'}</span>
          </button>

          {/* PULSANTE GITHUB */}
          <a
            href="https://github.com/Pole9/fanta"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 w-8 rounded-lg flex items-center justify-center transition-all border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-500 shadow-sm active:scale-95"
            title="Repository GitHub (Pole9/fanta)"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* PULSANTE OPZIONI */}
          <button
            onClick={() => setActiveView('settings')}
            className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all border border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 hover:border-slate-500 shadow-sm active:scale-95"
            title="Opzioni e Impostazioni"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Opzioni</span>
          </button>
        </div>

      </div>

      {/* BANNER INFORMATIVO DI SEZIONE CON FOCALIZZAZIONE AVVERSARI */}
      <div className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-2 border flex-shrink-0 ${
        activeTab === 'next' 
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
          : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="font-black uppercase tracking-wider text-[11px] sm:text-xs px-2 py-0.5 rounded bg-slate-900 border border-current">
            {activeTab === 'next' ? 'PROSSIMA GARA (7ª G.)' : 'PARTITA IN CORSO (6ª G.)'}
          </span>
          <span className="text-xs sm:text-sm hidden sm:inline">
            {activeTab === 'next' 
              ? '🎯 Gli avversari, i punteggi Ted Score e i consigli sono calcolati sulla 7ª Giornata (difficoltà squadra avversaria + fattore casa/trasferta).' 
              : '⚡ Formazione e gare del turno attualmente in corso. Visualizza lo stato della squadra per la 6ª giornata.'}
          </span>
        </div>

        <button 
          onClick={() => setShowFixturesModal(true)}
          className="text-xs sm:text-sm font-bold underline hover:text-white flex items-center gap-1.5 flex-shrink-0"
        >
          <span>Vedi Calendario ({currentFixtures.length} gare)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. AREA PRINCIPALE: 3 COLONNE (PANCHINA A SINISTRA, CAMPO AL CENTRO, LAVAGNA A DESTRA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 flex-1 min-h-0 overflow-hidden">
        
        {/* COLONNA 1: PANCHINA ORDINATA DI TED (A SINISTRA DEL CAMPO - Lg: col-span-3) */}
        <div className="order-2 lg:order-1 lg:col-span-3 xl:col-span-3 2xl:col-span-3 flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-2.5 shadow-md overflow-hidden min-h-0">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">🪑</span>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>Panchina Ordinata</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 font-mono text-xs">
                    {bench.length}
                  </span>
                </h2>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono block">
                  1° P, 2 D, 2 C, 2 A per Ted Score
                </span>
              </div>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono hidden sm:inline">
              {activeTab === 'next' ? '7ª G.' : '6ª G.'}
            </span>
          </div>

          {bench.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4 text-center">
              <span className="text-xs sm:text-sm text-slate-500 italic">Nessun giocatore in panchina.</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
              {bench.map((card) => {
                const isSelectedForSwap = swappingPlayerId === card.player.id;
                const isTargetForSwap = swappingPlayerCard !== null && swappingPlayerCard.isStarter && swappingPlayerCard.player.ruolo === card.player.ruolo;
                const isIncompatibleForSwap = swappingPlayerCard !== null && (
                  (swappingPlayerCard.isStarter && swappingPlayerCard.player.ruolo !== card.player.ruolo) ||
                  (!swappingPlayerCard.isStarter && !isSelectedForSwap)
                );
                const matchInfo = card.evaluation.match;
                const diffBadge = matchInfo ? getDifficultyBadge(matchInfo.difficulty) : null;

                return (
                  <div
                    key={card.player.id}
                    onClick={() => {
                      if (swappingPlayerId) {
                        if (isSelectedForSwap) {
                          setSwappingPlayerId(null);
                        } else if (isTargetForSwap) {
                          handleSwap(swappingPlayerId, card.player.id);
                        } else if (swappingPlayerCard && swappingPlayerCard.isStarter) {
                          handleSwap(swappingPlayerId, card.player.id);
                        } else {
                          setSwappingPlayerId(card.player.id);
                        }
                      } else {
                        setSelectedPlayerForReport(card);
                      }
                    }}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2 select-none ${
                      isSelectedForSwap
                        ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-400 shadow-lg scale-[1.02]'
                        : isTargetForSwap
                          ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-400 animate-pulse shadow-lg scale-[1.02]'
                          : isIncompatibleForSwap
                            ? 'bg-slate-900/40 border-slate-800/60 opacity-35 grayscale-[50%] cursor-not-allowed'
                            : 'bg-slate-950/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700 shadow-sm'
                    }`}
                    title={
                      isTargetForSwap 
                        ? `Clicca per inserire ${card.player.nome} tra i titolari` 
                        : isIncompatibleForSwap 
                          ? `Ruolo ${card.player.ruolo} incompatibile con la selezione corrente` 
                          : `Vedi scheda di ${card.player.nome}`
                    }
                  >
                    {/* Sinistra: Ordine panchina + Ruolo */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="w-5 text-xs font-mono font-black text-slate-400 text-center">
                        {card.benchOrder}°
                      </span>
                      <span className={`w-5 h-5 rounded text-xs font-black flex items-center justify-center shadow ${getRoleBg(card.player.ruolo)}`}>
                        {card.player.ruolo}
                      </span>
                    </div>

                    {/* Centro: Nome + Partita + Difficoltà */}
                    <div className="flex-1 min-w-0 leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-black text-white truncate">
                          {card.player.nome}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {card.player.squadra.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {matchInfo ? (
                          <>
                            <span className={`px-1 py-0.2 rounded font-black text-[8px] sm:text-[9px] uppercase ${
                              matchInfo.isHome 
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                                : 'bg-slate-900 text-slate-300 border border-slate-700'
                            }`}>
                              {matchInfo.isHome ? 'CASA' : 'FUORI'}
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-amber-300">
                              {matchInfo.isHome ? 'vs ' : '@ '}{matchInfo.opponent.slice(0, 4).toUpperCase()}
                            </span>
                            {diffBadge && (
                              <span className={`px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-bold border leading-none ${diffBadge.color}`}>
                                {diffBadge.tag}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400">{card.player.squadra}</span>
                        )}
                      </div>
                    </div>

                    {/* Destra: Ted Score + Pulsante Scambia */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`px-1.5 py-0.5 rounded-lg text-xs font-black border shadow-sm ${getScoreColor(card.tedScore)}`}>
                        {card.tedScore}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelectedForSwap) {
                            setSwappingPlayerId(null);
                          } else if (isTargetForSwap) {
                            handleSwap(swappingPlayerId!, card.player.id);
                          } else {
                            setSwappingPlayerId(card.player.id);
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-all ${
                          isSelectedForSwap
                            ? 'text-slate-950 bg-amber-400 font-bold'
                            : isTargetForSwap
                              ? 'text-slate-950 bg-emerald-400 font-bold animate-pulse'
                              : 'bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-700'
                        }`}
                        title={isSelectedForSwap ? "Annulla selezione" : isTargetForSwap ? `Inserisci ${card.player.nome}` : `Sostituisci un titolare con ${card.player.nome}`}
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLONNA 2: CAMPO DA CALCIO VERDE (AL CENTRO - Lg: col-span-6) */}
        <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-6 2xl:col-span-6 flex flex-col justify-between overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-md min-h-0">
          
          {/* CAMPO DA CALCIO VERDE (GREEN PITCH) */}
          <div className="fanta-pitch relative flex-1 rounded-xl bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 border-2 border-emerald-600/40 shadow-inner overflow-hidden min-h-[480px] lg:min-h-0">
            
            {/* LINEE DEL CAMPO DA CALCIO */}
            <div className="absolute inset-2 border border-white/20 rounded pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-0 left-1/2 w-52 h-20 border-b border-x border-white/20 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 w-56 h-24 border-t border-x border-white/20 -translate-x-1/2 pointer-events-none" />

            {/* AVVISO DI SWAP ATTIVO */}
            {swappingPlayerCard && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-amber-400 text-slate-950 rounded-full text-xs sm:text-sm font-black shadow-xl flex items-center gap-2 z-30 animate-bounce max-w-[95%]">
                <ArrowRightLeft className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {swappingPlayerCard.isStarter
                    ? `Sostituzione: seleziona un ${ROLE_NAMES[swappingPlayerCard.player.ruolo]} in panchina per ${swappingPlayerCard.player.nome}`
                    : `Inserimento: seleziona il ${ROLE_NAMES[swappingPlayerCard.player.ruolo]} titolare da sostituire con ${swappingPlayerCard.player.nome}`
                  }
                </span>
                <button
                  onClick={() => setSwappingPlayerId(null)}
                  className="w-4 h-4 rounded-full bg-slate-950 text-white flex items-center justify-center hover:bg-slate-800 text-[10px] font-bold flex-shrink-0"
                  title="Annulla sostituzione"
                >
                  ✕
                </button>
              </div>
            )}

            {/* AVVISO ERRORE RUOLO SWAP */}
            {swapWarning && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-red-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 z-30 border border-red-400 max-w-[95%]">
                <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span className="truncate">{swapWarning}</span>
                <button
                  onClick={() => setSwapWarning(null)}
                  className="text-red-200 hover:text-white flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* CALCIATORI TITOLARI POSIZIONATI SUL CAMPO */}
            {starters.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div className="w-14 h-14 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center text-amber-400 mb-2">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-white">Nessun giocatore assegnato a {activeTeam.name}</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mt-1">
                  Questa squadra non ha ancora calciatori acquistati all'asta. Completa l'asta o seleziona un'altra rosa dal menu in alto.
                </p>
              </div>
            ) : (
              starters.map((card) => {
                const pos = card.pitchPosition || { x: 50, y: 50 };
                const isSelectedForSwap = swappingPlayerId === card.player.id;
                const isTargetForSwap = swappingPlayerCard !== null && !swappingPlayerCard.isStarter && swappingPlayerCard.player.ruolo === card.player.ruolo;
                const isIncompatibleForSwap = swappingPlayerCard !== null && (
                  (!swappingPlayerCard.isStarter && swappingPlayerCard.player.ruolo !== card.player.ruolo) ||
                  (swappingPlayerCard.isStarter && !isSelectedForSwap)
                );
                const matchInfo = card.evaluation.match;
                const diffBadge = matchInfo ? getDifficultyBadge(matchInfo.difficulty) : null;

                return (
                  <div
                    key={card.player.id}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <div
                      onClick={() => {
                        if (swappingPlayerId) {
                          if (isSelectedForSwap) {
                            setSwappingPlayerId(null);
                          } else if (isTargetForSwap) {
                            handleSwap(swappingPlayerId, card.player.id);
                          } else if (swappingPlayerCard && !swappingPlayerCard.isStarter) {
                            handleSwap(swappingPlayerId, card.player.id);
                          } else {
                            setSwappingPlayerId(card.player.id);
                          }
                        } else {
                          setSelectedPlayerForReport(card);
                        }
                      }}
                      className={`group cursor-pointer rounded-xl p-2 sm:p-2.5 bg-slate-950/94 hover:bg-slate-900 border transition-all duration-150 active:scale-95 flex flex-col items-center shadow-2xl min-w-[98px] sm:min-w-[118px] xl:min-w-[134px] 2xl:min-w-[145px] max-w-[155px] ${
                        isSelectedForSwap
                          ? 'border-amber-400 ring-2 ring-amber-400 scale-105 bg-amber-950/40'
                          : isTargetForSwap
                            ? 'border-emerald-400 ring-2 ring-emerald-400 scale-105 bg-emerald-950/50 animate-pulse'
                            : isIncompatibleForSwap
                              ? 'border-slate-800 opacity-40 grayscale-[40%]'
                              : 'border-slate-700/80 hover:border-amber-400/80'
                      }`}
                    >
                      {/* Top Bar: Ruolo + Ted Score */}
                      <div className="w-full flex items-center justify-between gap-1 mb-1">
                        <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded text-[10px] sm:text-xs font-black flex items-center justify-center shadow ${getRoleBg(card.player.ruolo)}`}>
                          {card.player.ruolo}
                        </span>
                        
                        {/* Ted Score Badge */}
                        <span className={`px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md text-[10px] sm:text-xs font-black border shadow-sm ${getScoreColor(card.tedScore)}`}>
                          {card.tedScore}
                        </span>
                      </div>

                      {/* Nome Calciatore */}
                      <span className="text-xs sm:text-sm font-black text-white truncate max-w-[95px] sm:max-w-[120px] leading-tight text-center">
                        {card.player.nome}
                      </span>

                      {/* Squadra & Avversaria del turno con FDR e Home/Away */}
                      <div className="text-[10px] sm:text-[11px] font-mono mt-1 w-full text-center leading-tight">
                        {matchInfo ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="flex items-center justify-center gap-1">
                              <span className={`px-1 py-0.2 rounded font-black text-[8px] sm:text-[9px] uppercase ${
                                matchInfo.isHome 
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                                  : 'bg-slate-900 text-slate-300 border border-slate-700'
                              }`}>
                                {matchInfo.isHome ? 'CASA' : 'FUORI'}
                              </span>
                              <span className="font-bold text-amber-300 truncate max-w-[65px] sm:max-w-[80px]">
                                {matchInfo.isHome ? 'vs ' : '@ '}{matchInfo.opponent.slice(0, 4).toUpperCase()}
                              </span>
                            </div>

                            {/* Badge Difficoltà Squadra Avversaria (FDR) */}
                            {diffBadge && (
                              <span className={`px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-bold border leading-none ${diffBadge.color}`} title={`Difficoltà partita: ${diffBadge.label}`}>
                                {diffBadge.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-bold">{card.player.squadra.slice(0, 5).toUpperCase()}</span>
                        )}
                      </div>

                      {/* Indicatori sintetici: Gazzetta % e Fantagazzetta stelle */}
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-[11px] font-mono leading-none">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-bold ${
                          card.evaluation.gazzetta.titolaritaPercent >= 85 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}>
                          {card.evaluation.gazzetta.titolaritaPercent}%
                        </span>
                        <span className="text-amber-400 font-bold text-[10px] sm:text-xs">
                          {'★'.repeat(card.evaluation.fantagazzetta.stars)}
                        </span>
                      </div>

                      {/* Pulsante rapido Scambia */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelectedForSwap) {
                            setSwappingPlayerId(null);
                          } else if (isTargetForSwap) {
                            handleSwap(swappingPlayerId!, card.player.id);
                          } else {
                            setSwappingPlayerId(card.player.id);
                          }
                        }}
                        className={`mt-1.5 py-0.5 px-1.5 rounded transition-all text-[9px] sm:text-[10px] font-bold flex items-center gap-1 ${
                          isSelectedForSwap
                            ? 'opacity-100 bg-amber-400 text-slate-950 font-black'
                            : isTargetForSwap
                              ? 'opacity-100 bg-emerald-400 text-slate-950 font-black animate-pulse'
                              : 'opacity-0 group-hover:opacity-100 bg-slate-800 text-slate-300 hover:text-amber-300'
                        }`}
                        title={isSelectedForSwap ? "Annulla selezione" : isTargetForSwap ? "Sostituisci questo titolare" : "Scambia con un panchinaro"}
                      >
                        <ArrowRightLeft className="w-3 h-3" />
                        <span>{isSelectedForSwap ? 'Annulla' : isTargetForSwap ? 'Sostituisci' : 'Scambia'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

          </div>

        </div>

        {/* COLONNA 3: LA LAVAGNA TATTICA DI TED LASSO (A DESTRA - Lg: col-span-3) */}
        <div className="order-3 lg:order-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3 flex flex-col gap-2.5 overflow-y-auto pr-1 scrollbar-thin min-h-0">
          
          {/* 1. VERDETTO MODIFICATORE DIFESA */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-3.5 shadow-sm space-y-1.5 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black text-white uppercase flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Modificatore Difesa</span>
              </span>
              <span className={`px-2 py-0.5 rounded-md text-xs sm:text-sm font-black shadow-sm ${
                defenseModifier.isWorthIt ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {defenseModifier.expectedBonus}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {defenseModifier.advice}
            </p>
          </div>

          {/* 2. LE SCELTE CHIAVE DI GIORNATA */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-3.5 shadow-sm space-y-2.5 flex-1">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider block">
                Scelte Chiave ({activeTab === 'next' ? '7ª G.' : '6ª G.'})
              </span>
              <span className="text-[11px] text-slate-400 font-mono">FDR & Casa/Fuori</span>
            </div>

            {/* TOP PICK */}
            {topPick && (
              <div 
                onClick={() => setSelectedPlayerForReport(topPick)}
                className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 hover:bg-emerald-900/40 cursor-pointer transition-all flex items-start gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm flex-shrink-0 shadow">
                  <Star className="w-4 h-4 fill-slate-950" />
                </div>
                <div className="leading-tight flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-white">{topPick.player.nome}</span>
                    <span className="text-xs font-black text-emerald-400">Score {topPick.tedScore}</span>
                  </div>
                  <span className="text-xs text-slate-300 block mt-1 leading-snug">
                    {topPick.evaluation.fantagazzetta.commentoRedazione}
                  </span>
                </div>
              </div>
            )}

            {/* LA SCOMMESSA DI TED */}
            {scommessa && (
              <div 
                onClick={() => setSelectedPlayerForReport(scommessa)}
                className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 hover:bg-amber-900/40 cursor-pointer transition-all flex items-start gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm flex-shrink-0 shadow">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="leading-tight flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-white">{scommessa.player.nome}</span>
                    <span className="text-xs font-black text-amber-400">Scommessa Ted</span>
                  </div>
                  <span className="text-xs text-slate-300 block mt-1 leading-snug">
                    {scommessa.evaluation.gazzetta.noteGazzetta}
                  </span>
                </div>
              </div>
            )}

            {/* TRAPPOLA O RISCHIO */}
            {trappola && (
              <div 
                onClick={() => setSelectedPlayerForReport(trappola)}
                className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/50 hover:bg-red-900/40 cursor-pointer transition-all flex items-start gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="leading-tight flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-white">{trappola.player.nome}</span>
                    <span className="text-xs font-black text-red-400">Attenzione</span>
                  </div>
                  <span className="text-xs text-slate-300 block mt-1 leading-snug">
                    {trappola.evaluation.fantagazzetta.commentoRedazione || "Match ad alto coefficiente di difficoltà o minutaggio a rischio."}
                  </span>
                </div>
              </div>
            )}

            {/* BALLOTTAGGI LIVE (FILTRATI RIGOROSAMENTE PER I GIOCATORI DELLA PROPRIA ROSA) */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black uppercase text-amber-400 flex items-center gap-1.5">
                  <span>⚔️</span>
                  <span>Ballottaggi Rosa ({squadBallottaggi.length})</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Gazzetta / Fantacalcio
                </span>
              </div>

              {squadBallottaggi.length > 0 ? (
                <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                  {squadBallottaggi.map((b, idx) => {
                    const cleanP1 = cleanPlayerName(b.p1);
                    const cleanP2 = cleanPlayerName(b.p2);
                    const isP1InSquad = Array.from(squadPlayerCleanNames).some(u => 
                      u === cleanP1 || cleanP1.includes(u) || u.includes(cleanP1) || (u.split(' ')[0] === cleanP1.split(' ')[0] && u.split(' ')[0].length >= 4)
                    );
                    const isP2InSquad = Array.from(squadPlayerCleanNames).some(u => 
                      u === cleanP2 || cleanP2.includes(u) || u.includes(cleanP2) || (u.split(' ')[0] === cleanP2.split(' ')[0] && u.split(' ')[0].length >= 4)
                    );

                    return (
                      <div key={idx} className="p-2 rounded-lg bg-slate-950/90 border border-slate-800 text-xs flex items-center justify-between gap-1 shadow-sm">
                        <div className={`flex items-center gap-1.5 truncate max-w-[46%] px-1.5 py-0.5 rounded ${
                          isP1InSquad ? 'bg-amber-950/70 border border-amber-500/40' : ''
                        }`}>
                          <span className={`font-black truncate ${isP1InSquad ? 'text-amber-300' : 'text-slate-200'}`}>
                            {b.p1}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-mono font-bold text-[10px]">
                            {b.perc1}%
                          </span>
                        </div>

                        <span className="text-slate-500 font-bold text-xs flex-shrink-0">vs</span>

                        <div className={`flex items-center gap-1.5 truncate max-w-[46%] justify-end px-1.5 py-0.5 rounded ${
                          isP2InSquad ? 'bg-amber-950/70 border border-amber-500/40' : ''
                        }`}>
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[10px]">
                            {b.perc2}%
                          </span>
                          <span className={`font-black truncate ${isP2InSquad ? 'text-amber-300' : 'text-slate-300'}`}>
                            {b.p2}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 text-center space-y-1">
                  <span className="block font-bold text-emerald-400 text-xs">Nessun ballottaggio attivo</span>
                  <span className="block text-[11px] text-slate-400 leading-tight">I calciatori della tua rosa hanno ruoli e titolarità delineati per questo turno.</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 3. MODALE DETTAGLIO "TED'S MATCH REPORT" */}
      {selectedPlayerForReport && (() => {
        const { player, evaluation, tedScore } = selectedPlayerForReport;
        const verdict = getTedPlayerVerdict(player, tedScore, evaluation);
        const matchInfo = evaluation.match;
        const diffBadge = matchInfo ? getDifficultyBadge(matchInfo.difficulty) : null;
        const currentMatchdayNum = activeTab === 'next' ? NEXT_MATCHDAY_NUMBER : CURRENT_MATCHDAY_NUMBER;
        const diddiYoutube = getDiddiMatchdayYoutubeAdvice(player, currentMatchdayNum, evaluation);
        const fgConsigliato = getFantagazzettaConsigliatoStatus(player, evaluation);

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-3 animate-in fade-in duration-150">
            <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-3 p-3.5 sm:p-4 select-none max-h-[95vh] overflow-y-auto scrollbar-thin">
              
              {/* TESTATA MODALE CALCIATORE */}
              <div className="flex items-start justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center ${getRoleBg(player.ruolo)}`}>
                    {player.ruolo}
                  </span>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase leading-tight">
                      {player.nome}
                    </h2>
                    <div className="text-xs sm:text-sm text-slate-300 font-mono flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-slate-400 font-bold">{player.squadra}</span>
                      <span>•</span>
                      <span>Qt: <strong className="text-white font-bold">{player.quotazione}</strong></span>
                      <span>•</span>
                      <span>FVM: <strong className="text-amber-400 font-black">{player.fvm}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-1 rounded-xl text-xs font-black border ${getScoreColor(tedScore)}`}>
                    Ted Score: {tedScore}/100
                  </div>

                  {/* NAVIGAZIONE TRA CALCIATORI CON FRECCE */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 shadow-sm">
                    <button
                      onClick={handlePrevPlayer}
                      className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Giocatore precedente (Freccia Sinistra ←)"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <span className="px-1.5 text-[10px] font-mono font-bold text-slate-400">
                      {allReportCards.findIndex(c => c.player.id === player.id) + 1}/{allReportCards.length}
                    </span>

                    <button
                      onClick={handleNextPlayer}
                      className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Giocatore successivo (Freccia Destra →)"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedPlayerForReport(null)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Chiudi Report (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 1. ALL'INIZIO DEL REPORT: GRAFICO VOTO E FANTAVOTO CON KPI (FANTACALCIO.IT) */}
              <PlayerPerformanceChart player={player} />

              {/* 2. BOX MATCH PREVISTO CON COEFFICIENTE DI DIFFICOLTÀ E FATTORE CAMPO */}
              {matchInfo && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-amber-400 uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{matchInfo.matchdayTitle}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                      matchInfo.isHome 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-slate-900 text-slate-300 border border-slate-700'
                    }`}>
                      {matchInfo.isHome ? 'IN CASA' : 'IN TRASFERTA'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">
                      {matchInfo.isHome ? `${player.squadra} vs ${matchInfo.opponent}` : `${matchInfo.opponent} vs ${player.squadra}`}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {matchInfo.date} {matchInfo.time}
                    </span>
                  </div>

                  {diffBadge && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                      <span className="text-[11px] text-slate-400">Difficoltà Avversario (FDR):</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${diffBadge.color}`}>
                        {diffBadge.label}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 3. CITAZIONE E VERDETTO DI TED LASSO */}
              <div className="bg-amber-950/40 border border-amber-400/50 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-amber-400 uppercase flex items-center gap-1">
                    <span>👨🏻‍💼</span>
                    <span>Verdetto Ted Lasso: {verdict.badge}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-200 italic font-medium">
                  "{verdict.quote}"
                </p>
                <p className="text-[11px] text-slate-300 font-bold mt-1">
                  {verdict.verdict}
                </p>
              </div>

              {/* 4. SEZIONI ANALITICHE INTEGRATE */}
              <div className="space-y-2 text-xs">
                
                {/* A. GAZZETTA DELLO SPORT */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-rose-400 uppercase flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Probabili Formazioni Gazzetta</span>
                    </span>
                    <span className="font-mono font-bold text-white">
                      {evaluation.gazzetta.titolaritaPercent}% Titolare
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {evaluation.gazzetta.noteGazzetta}
                  </p>
                  {evaluation.gazzetta.ballottaggioCon && (
                    <div className="text-[10px] text-amber-400 font-mono font-bold">
                      ⚔️ Ballottaggio: {evaluation.gazzetta.ballottaggioCon}
                    </div>
                  )}
                </div>

                {/* B. REDAZIONE FANTAGAZZETTA */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-400 uppercase flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-blue-400" />
                      <span>Redazione Fantagazzetta</span>
                    </span>
                    <span className="font-bold text-amber-400">
                      {'★'.repeat(evaluation.fantagazzetta.stars)} ({evaluation.fantagazzetta.fascia})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {evaluation.fantagazzetta.commentoRedazione}
                  </p>
                </div>

                {/* C. ULTERIORE RIQUADRO FANTAGAZZETTA: CONSIGLIATO DI GIORNATA */}
                {fgConsigliato.isConsigliato && (
                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/60 space-y-1 shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-black text-blue-300 uppercase flex items-center gap-1.5 text-xs">
                        <span>🔥</span>
                        <span>{fgConsigliato.titolo}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 text-[10px] font-mono font-bold">
                        {fgConsigliato.rubrica}
                      </span>
                    </div>
                    <p className="text-xs text-blue-100 font-medium">
                      {fgConsigliato.motivo}
                    </p>
                  </div>
                )}

                {/* D. SUL FONDO: YOUTUBE LUCA DIDDI (CHI SCHIERARE ALLA Xª GIORNATA) */}
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/50 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-black text-amber-400 uppercase flex items-center gap-1.5 text-xs">
                      <span>📺</span>
                      <span>{diddiYoutube.title}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase ${diddiYoutube.tagColor}`}>
                      {diddiYoutube.tag}
                    </span>
                  </div>

                  <div className="text-xs text-amber-200 font-bold">
                    🎯 Verdetto Diddi: {diddiYoutube.verdict}
                  </div>

                  <p className="text-[11px] text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    "{diddiYoutube.analysis}"
                  </p>
                </div>

              </div>

              {/* FOOTER MODALE CON NAVIGAZIONE FRECCE */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevPlayer}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                    title="Tasto Freccia Sinistra ←"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Precedente</span>
                  </button>
                  <button
                    onClick={handleNextPlayer}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                    title="Tasto Freccia Destra →"
                  >
                    <span className="hidden sm:inline">Successivo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-slate-500 font-mono hidden md:inline ml-1">
                    (Scorri con ← → da tastiera)
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPlayerForReport(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition-all active:scale-95"
                >
                  Chiudi Report
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 4. MODALE CALENDARIO COMPLETO TURNO (6ª O 7ª GIORNATA) */}
      {showFixturesModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-4 select-none space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white uppercase">{currentTitle}</h3>
              </div>
              <button 
                onClick={() => setShowFixturesModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
              {currentFixtures.map(m => (
                <div key={m.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 w-14">{m.date} {m.time}</span>
                    <span className="font-bold text-white w-24 text-right">{m.homeTeam}</span>
                    <span className="text-slate-500 font-bold text-[10px]">vs</span>
                    <span className="font-bold text-white w-24">{m.awayTeam}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{m.stadium}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-900 text-amber-300 border border-slate-750">
                      Diff. H:{m.homeDifficulty} / A:{m.awayDifficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => setShowFixturesModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
              >
                Chiudi Calendario
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
