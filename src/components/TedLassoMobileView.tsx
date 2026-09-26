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
  Star, 
  X, 
  Activity, 
  Calendar, 
  RefreshCw, 
  Copy, 
  Save, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  ArrowRightLeft,
  Monitor,
  AlertTriangle,
  HelpCircle,
  Users
} from 'lucide-react';

const ROLE_NAMES: Record<Role, string> = {
  P: 'Portiere',
  D: 'Difensore',
  C: 'Centrocampista',
  A: 'Attaccante'
};

export const TedLassoMobileView: React.FC = () => {
  const { 
    teams, 
    myTeamId, 
    players, 
    syncedOnlineData, 
    isSyncingOnline, 
    syncOnlineData 
  } = useAuction();

  // Tab Giornata: 'next' (7ª G.) o 'current' (6ª G. LIVE)
  const [activeTab, setActiveTab] = useState<'next' | 'current'>('next');

  // Tab di navigazione mobile: 'pitch' (Campo) | 'bench' (Panchina) | 'tactics' (Lavagna) | 'fixtures' (Calendario)
  const [mobileSection, setMobileSection] = useState<'pitch' | 'bench' | 'tactics' | 'fixtures'>('pitch');

  const [selectedTeamId] = useState<string>(myTeamId || 'team-1');
  const [selectedFormationId, setSelectedFormationId] = useState<string>('3-4-3');
  const [selectedPlayerForReport, setSelectedPlayerForReport] = useState<TedPlayerCard | null>(null);
  const [swappingPlayerId, setSwappingPlayerId] = useState<number | null>(null);
  const [swapWarning, setSwapWarning] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [lineupOverrides, setLineupOverrides] = useState<{ starters: number[]; bench: number[] } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [saveFeedback, setSaveFeedback] = useState<boolean>(false);

  // Squadra corrente dell'utente
  const activeTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  const teamFullPlayers = useMemo(() => {
    if (!activeTeam) return [];
    return activeTeam.players
      .map(assign => players.find(p => p.id === assign.playerId))
      .filter((p): p is Player => p !== undefined);
  }, [activeTeam, players]);

  // Calcolo Formazione Ted Lasso
  const baseLineup = useMemo(() => {
    return generateTedLineup(teamFullPlayers, selectedFormationId, syncedOnlineData, activeTab);
  }, [teamFullPlayers, selectedFormationId, syncedOnlineData, activeTab]);

  // Caricamento formazione salvata
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
            .filter((p): p is Player => p !== undefined);

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
            setLineupOverrides(null);
          }
        }
      } catch {
        setLineupOverrides(null);
      }
    } else {
      setLineupOverrides(null);
    }
  }, [activeTab, selectedTeamId, teamFullPlayers]);

  // Sostituzioni manuali
  const { starters, bench, formation } = useMemo(() => {
    if (!lineupOverrides) return baseLineup;

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

    assignPitchCoordinates(startersCards, baseLineup.formation);

    return {
      starters: startersCards,
      bench: orderedBench,
      formation: baseLineup.formation
    };
  }, [baseLineup, lineupOverrides]);

  const allReportCards = useMemo(() => {
    return [...starters, ...bench];
  }, [starters, bench]);

  const swappingPlayerCard = useMemo(() => {
    if (!swappingPlayerId) return null;
    return allReportCards.find(c => c.player.id === swappingPlayerId) || null;
  }, [swappingPlayerId, allReportCards]);

  const defenseModifier = useMemo(() => {
    return evaluateDefenseModifier(starters);
  }, [starters]);

  const { topPick, scommessa, trappola } = useMemo(() => {
    const sorted = [...starters, ...bench].sort((a, b) => b.tedScore - a.tedScore);
    const top = sorted[0] || null;
    const scomm = sorted.find(c => c.evaluation.fantagazzetta.fascia === 'Scommessa' || c.tedScore >= 70 && c.player.ruolo === 'C') || sorted[1] || null;
    const trap = sorted.find(c => c.evaluation.fantagazzetta.fascia === 'Trappola da Evitare' || (c.evaluation.match && c.evaluation.match.difficulty >= 4 && c.tedScore < 65)) || sorted[sorted.length - 1] || null;
    return { topPick: top, scommessa: scomm, trappola: trap };
  }, [starters, bench]);

  const squadPlayerCleanNames = useMemo(() => {
    return new Set(teamFullPlayers.map(p => cleanPlayerName(p.nome)));
  }, [teamFullPlayers]);

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

  // Azioni Formazione
  const handleAskTed = () => {
    setLineupOverrides(null);
    setSwappingPlayerId(null);
    setSwapWarning(null);
    setQuoteIndex(prev => (prev + 1) % TED_LASSO_QUOTES.length);
  };

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
    setTimeout(() => setSaveFeedback(false), 2500);
  };

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
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handleSwap = (playerAId: number, playerBId: number) => {
    if (playerAId === playerBId) {
      setSwappingPlayerId(null);
      return;
    }

    const cardA = allReportCards.find(c => c.player.id === playerAId);
    const cardB = allReportCards.find(c => c.player.id === playerBId);

    if (!cardA || !cardB) {
      setSwappingPlayerId(null);
      return;
    }

    if (cardA.player.ruolo !== cardB.player.ruolo) {
      setSwapWarning(`Puoi scambiare solo giocatori dello stesso ruolo (${ROLE_NAMES[cardA.player.ruolo]}).`);
      setTimeout(() => setSwapWarning(null), 3500);
      return;
    }

    let newStartersIds = starters.map(s => s.player.id);
    let newBenchIds = bench.map(b => b.player.id);

    const aIsStarter = newStartersIds.includes(playerAId);
    const bIsStarter = newStartersIds.includes(playerBId);

    if (aIsStarter && !bIsStarter) {
      newStartersIds = newStartersIds.map(id => id === playerAId ? playerBId : id);
      newBenchIds = newBenchIds.map(id => id === playerBId ? playerAId : id);
    } else if (!aIsStarter && bIsStarter) {
      newStartersIds = newStartersIds.map(id => id === playerBId ? playerAId : id);
      newBenchIds = newBenchIds.map(id => id === playerAId ? playerBId : id);
    }

    setLineupOverrides({ starters: newStartersIds, bench: newBenchIds });
    setSwappingPlayerId(null);
    setSwapWarning(null);
  };

  // Navigazione frecce Report
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

  // Helper grafici
  const getRoleBg = (role: Role) => {
    switch (role) {
      case 'P': return 'bg-amber-500 text-slate-950 font-black';
      case 'D': return 'bg-emerald-600 text-white font-black';
      case 'C': return 'bg-blue-600 text-white font-black';
      case 'A': return 'bg-rose-600 text-white font-black';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50';
    if (score >= 65) return 'text-blue-400 bg-blue-950/80 border-blue-500/50';
    if (score >= 50) return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
    return 'text-rose-400 bg-rose-950/80 border-rose-500/50';
  };

  const getDifficultyBadge = (diff: number) => {
    switch (diff) {
      case 1: return { label: '1/5 Facile', tag: 'EASY', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50' };
      case 2: return { label: '2/5 Abbordabile', tag: 'OK', color: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40' };
      case 3: return { label: '3/5 Equilibrata', tag: 'EQUIL.', color: 'text-amber-300 bg-amber-950/70 border-amber-500/50' };
      case 4: return { label: '4/5 Tosta', tag: 'DIFF.', color: 'text-orange-400 bg-orange-950/70 border-orange-500/50' };
      case 5:
      default: return { label: '5/5 Proibitiva', tag: 'DURA', color: 'text-rose-400 bg-rose-950/80 border-rose-500/60' };
    }
  };

  const currentFixtures = activeTab === 'next' ? NEXT_SERIE_A_FIXTURES : CURRENT_SERIE_A_FIXTURES;
  const currentTitle = activeTab === 'next' ? NEXT_MATCHDAY_TITLE : CURRENT_MATCHDAY_TITLE;

  const navigateToDesktop = () => {
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pb-16 select-none relative font-sans">
      
      {/* 1. TOP HEADER FISSO MOBILE */}
      <header className="bg-slate-900 border-b border-slate-800 p-2.5 sticky top-0 z-40 shadow-md flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              onClick={() => setQuoteIndex(prev => (prev + 1) % TED_LASSO_QUOTES.length)}
              className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black tracking-widest text-[10px] uppercase shadow -rotate-1 active:rotate-0 cursor-pointer"
            >
              BELIEVE
            </div>
            <div>
              <h1 className="text-xs font-black text-white uppercase flex items-center gap-1.5 leading-none">
                <span>TED LASSO</span>
                <span className="text-amber-400 text-[10px] px-1 py-0.2 rounded bg-amber-950 border border-amber-500/40">MOBILE</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                {activeTeam.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Tasto passa alla versione Desktop */}
            <button
              onClick={navigateToDesktop}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-[11px] flex items-center gap-1 border border-slate-700 shadow-sm active:scale-95"
              title="Passa alla versione completa per PC Desktop"
            >
              <Monitor className="w-3.5 h-3.5 text-blue-400" />
              <span>Desktop</span>
            </button>
          </div>
        </div>

        {/* SELETTORE GIORNATA (PROSSIMA GARA VS PARTITA IN CORSO) */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              setActiveTab('next');
              setSwappingPlayerId(null);
            }}
            className={`py-1.5 rounded-lg font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'next'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7ª Prossima</span>
            <span className={`text-[9px] px-1 rounded font-mono ${activeTab === 'next' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800'}`}>
              2-5 Ott
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('current');
              setSwappingPlayerId(null);
            }}
            className={`py-1.5 rounded-lg font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'current'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>6ª In Corso</span>
            <span className={`text-[9px] px-1 rounded font-mono ${activeTab === 'current' ? 'bg-slate-950 text-emerald-300 animate-pulse' : 'bg-slate-800'}`}>
              LIVE
            </span>
          </button>
        </div>

        {/* BARRA COMANDI RAPIDI MOBILE: MODULO, AUTO-11, SALVA, WHATSAPP, SYNC */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-0.5 scrollbar-none text-xs">
          {/* Modulo */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 flex-shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Mod:</span>
            <select
              value={selectedFormationId}
              onChange={(e) => {
                setSelectedFormationId(e.target.value);
                setLineupOverrides(null);
                setSwappingPlayerId(null);
              }}
              className="bg-transparent font-black text-amber-400 text-xs focus:outline-none cursor-pointer"
            >
              {Object.values(TED_FORMATIONS).map(f => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                  {f.id}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-11 */}
          <button
            onClick={handleAskTed}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-black text-xs flex items-center gap-1 shadow active:scale-95 flex-shrink-0"
            title="Auto-schiera l'11 migliore"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Auto-11</span>
          </button>

          {/* Salva */}
          <button
            onClick={handleSaveLineup}
            className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 shadow active:scale-95 flex-shrink-0 ${
              saveFeedback 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-800 text-white border border-slate-700'
            }`}
          >
            {saveFeedback ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Save className="w-3.5 h-3.5 text-slate-300" />}
            <span>{saveFeedback ? 'OK' : 'Salva'}</span>
          </button>

          {/* Copia WhatsApp */}
          <button
            onClick={handleCopyLineup}
            className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 shadow active:scale-95 flex-shrink-0 ${
              copyFeedback 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-800 text-emerald-400 border border-slate-700'
            }`}
            title="Copia per WhatsApp"
          >
            {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copyFeedback ? 'Copiata' : 'WhatsApp'}</span>
          </button>

          {/* Sync Live */}
          <button
            onClick={() => syncOnlineData()}
            disabled={isSyncingOnline}
            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 flex-shrink-0 active:scale-95"
            title="Aggiorna online"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOnline ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* 2. CORPO CONTENUTI MOBILE (IN BASE AL TAB ATTIVO) */}
      <main className="flex-1 p-2 space-y-2.5 overflow-y-auto">
        
        {/* BANNER NOTIFICA SWAP ATTIVO */}
        {swappingPlayerCard && (
          <div className="sticky top-2 z-30 px-3 py-2 bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-xl flex items-center justify-between gap-2 animate-bounce">
            <div className="flex items-center gap-1.5 truncate">
              <ArrowRightLeft className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {swappingPlayerCard.isStarter
                  ? `Sostituisci ${swappingPlayerCard.player.nome} (${ROLE_NAMES[swappingPlayerCard.player.ruolo]}): tocca la riserva`
                  : `Inserisci ${swappingPlayerCard.player.nome}: tocca il ${ROLE_NAMES[swappingPlayerCard.player.ruolo]} titolare`
                }
              </span>
            </div>
            <button
              onClick={() => setSwappingPlayerId(null)}
              className="px-2 py-0.5 rounded bg-slate-950 text-white font-bold text-[10px]"
            >
              Annulla
            </button>
          </div>
        )}

        {/* BANNER ERRORE SWAP */}
        {swapWarning && (
          <div className="p-2.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-between gap-2 border border-red-400">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span>{swapWarning}</span>
            </div>
            <button onClick={() => setSwapWarning(null)}>✕</button>
          </div>
        )}

        {/* SEZIONE 1: IL CAMPO DA CALCIO MOBILE (TITOLARI) */}
        {mobileSection === 'pitch' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="font-black text-amber-400 uppercase flex items-center gap-1">
                <span>🏟️</span>
                <span>11 Titolari ({formation.id})</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Tocca un calciatore per dettagli o scambi
              </span>
            </div>

            {/* CAMPO DA CALCIO VERDE OTTIMIZZATO MOBILE */}
            <div className="relative rounded-2xl bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 border-2 border-emerald-600/50 shadow-2xl overflow-hidden min-h-[540px] w-full select-none">
              
              {/* LINEE DEL CAMPO */}
              <div className="absolute inset-2 border border-white/20 rounded-xl pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 -translate-y-1/2 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 w-28 h-28 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute top-0 left-1/2 w-44 h-16 border-b border-x border-white/20 -translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 w-48 h-20 border-t border-x border-white/20 -translate-x-1/2 pointer-events-none" />

              {/* TITOLARI SUL CAMPO */}
              {starters.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <HelpCircle className="w-8 h-8 text-amber-400 mb-2" />
                  <span className="font-bold text-white text-xs">Nessun titolare assegnato</span>
                </div>
              ) : (
                starters.map((card) => {
                  const pos = card.pitchPosition || { x: 50, y: 50 };
                  const isSelectedForSwap = swappingPlayerId === card.player.id;
                  const isTargetForSwap = swappingPlayerCard !== null && !swappingPlayerCard.isStarter && swappingPlayerCard.player.ruolo === card.player.ruolo;
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
                            } else {
                              handleSwap(swappingPlayerId, card.player.id);
                            }
                          } else {
                            setSelectedPlayerForReport(card);
                          }
                        }}
                        className={`rounded-xl p-1.5 bg-slate-950/95 border transition-all active:scale-95 flex flex-col items-center shadow-xl w-[86px] sm:w-[94px] cursor-pointer ${
                          isSelectedForSwap
                            ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-950/80 scale-105'
                            : isTargetForSwap
                              ? 'border-emerald-400 ring-2 ring-emerald-400 bg-emerald-950/80 animate-pulse scale-105'
                              : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Ruolo + Nome */}
                        <div className="flex items-center gap-1 w-full justify-center">
                          <span className={`w-3.5 h-3.5 rounded text-[8px] font-black flex items-center justify-center ${getRoleBg(card.player.ruolo)}`}>
                            {card.player.ruolo}
                          </span>
                          <span className="font-black text-white text-[10px] truncate max-w-[55px]">
                            {card.player.nome}
                          </span>
                        </div>

                        {/* Avversario + FDR */}
                        <div className="flex items-center justify-center gap-1 w-full mt-0.5">
                          {matchInfo ? (
                            <span className="text-[8.5px] font-bold text-amber-300 truncate">
                              {matchInfo.isHome ? 'vs ' : '@ '}{matchInfo.opponent.slice(0, 3).toUpperCase()}
                            </span>
                          ) : (
                            <span className="text-[8px] text-slate-400">{card.player.squadra.slice(0, 3)}</span>
                          )}
                          {diffBadge && (
                            <span className={`px-0.5 text-[7px] font-black rounded border ${diffBadge.color}`}>
                              {diffBadge.tag}
                            </span>
                          )}
                        </div>

                        {/* Score Badge + Tasto Scambia */}
                        <div className="flex items-center justify-between w-full mt-1 pt-0.5 border-t border-slate-800">
                          <span className={`px-1 rounded text-[8.5px] font-black border ${getScoreColor(card.tedScore)}`}>
                            {card.tedScore}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isSelectedForSwap) {
                                setSwappingPlayerId(null);
                              } else {
                                setSwappingPlayerId(card.player.id);
                              }
                            }}
                            className={`p-0.5 rounded ${
                              isSelectedForSwap ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                            }`}
                            title="Scambia con riserva"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* BARRA RAPIDA MODIFICATORE SOTTO IL CAMPO */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-white">Modificatore:</span>
                <span className="text-slate-300 text-[11px] truncate max-w-[180px]">{defenseModifier.advice}</span>
              </div>
              <span className={`px-2 py-0.5 rounded font-black text-xs ${
                defenseModifier.isWorthIt ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {defenseModifier.expectedBonus}
              </span>
            </div>
          </div>
        )}

        {/* SEZIONE 2: LA PANCHINA MOBILE (14 RISERVE ORDINATE) */}
        {mobileSection === 'bench' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="font-black text-white uppercase flex items-center gap-1">
                <span>🪑</span>
                <span>Panchina ({bench.length} Riserve)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">1 P • 2 D • 2 C • 2 A</span>
            </div>

            <div className="space-y-1.5">
              {bench.map((card) => {
                const isSelectedForSwap = swappingPlayerId === card.player.id;
                const isTargetForSwap = swappingPlayerCard !== null && swappingPlayerCard.isStarter && swappingPlayerCard.player.ruolo === card.player.ruolo;
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
                        } else {
                          setSwappingPlayerId(card.player.id);
                        }
                      } else {
                        setSelectedPlayerForReport(card);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelectedForSwap
                        ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-400'
                        : isTargetForSwap
                          ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-400 animate-pulse'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Ruolo + Ordine */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[11px] font-mono font-black text-slate-400 w-4">
                        {card.benchOrder}°
                      </span>
                      <span className={`w-5 h-5 rounded text-[10px] font-black flex items-center justify-center ${getRoleBg(card.player.ruolo)}`}>
                        {card.player.ruolo}
                      </span>
                    </div>

                    {/* Dettagli Nome & Match */}
                    <div className="flex-1 min-w-0 leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-white text-xs truncate">{card.player.nome}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{card.player.squadra.slice(0, 3)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {matchInfo && (
                          <span className="text-[10px] font-bold text-amber-300">
                            {matchInfo.isHome ? 'vs ' : '@ '}{matchInfo.opponent.slice(0, 4)}
                          </span>
                        )}
                        {diffBadge && (
                          <span className={`px-1 py-0.2 rounded text-[8px] font-bold border ${diffBadge.color}`}>
                            {diffBadge.tag}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {card.evaluation.gazzetta.titolaritaPercent}% Tit.
                        </span>
                      </div>
                    </div>

                    {/* Score + Tasto Scambia */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${getScoreColor(card.tedScore)}`}>
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
                        className={`p-1.5 rounded-lg font-bold ${
                          isSelectedForSwap
                            ? 'bg-amber-400 text-slate-950'
                            : isTargetForSwap
                              ? 'bg-emerald-400 text-slate-950 animate-pulse'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                        title="Scambia con titolare"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SEZIONE 3: TATTICA, SCELTE CHIAVE & BALLOTTAGGI ROSA */}
        {mobileSection === 'tactics' && (
          <div className="space-y-3">
            {/* MODIFICATORE DIFESA */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-white text-xs uppercase flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Modificatore Difesa</span>
                </span>
                <span className={`px-2 py-0.5 rounded font-black text-xs ${
                  defenseModifier.isWorthIt ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {defenseModifier.expectedBonus}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {defenseModifier.advice}
              </p>
            </div>

            {/* SCELTE CHIAVE */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-black text-white uppercase tracking-wider block pb-1 border-b border-slate-800">
                Scelte Chiave ({activeTab === 'next' ? '7ª G.' : '6ª G.'})
              </span>

              {/* TOP PICK */}
              {topPick && (
                <div 
                  onClick={() => setSelectedPlayerForReport(topPick)}
                  className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-start gap-2.5 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black flex-shrink-0">
                    <Star className="w-4 h-4 fill-slate-950" />
                  </div>
                  <div className="flex-1 leading-tight">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{topPick.player.nome}</span>
                      <span className="text-xs font-black text-emerald-400">Score {topPick.tedScore}</span>
                    </div>
                    <span className="text-[11px] text-slate-300 block mt-1">
                      {topPick.evaluation.fantagazzetta.commentoRedazione}
                    </span>
                  </div>
                </div>
              )}

              {/* SCOMMESSA */}
              {scommessa && (
                <div 
                  onClick={() => setSelectedPlayerForReport(scommessa)}
                  className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-2.5 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 leading-tight">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{scommessa.player.nome}</span>
                      <span className="text-xs font-black text-amber-400">Scommessa Ted</span>
                    </div>
                    <span className="text-[11px] text-slate-300 block mt-1">
                      {scommessa.evaluation.gazzetta.noteGazzetta}
                    </span>
                  </div>
                </div>
              )}

              {/* TRAPPOLA */}
              {trappola && (
                <div 
                  onClick={() => setSelectedPlayerForReport(trappola)}
                  className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start gap-2.5 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center font-black flex-shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 leading-tight">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{trappola.player.nome}</span>
                      <span className="text-xs font-black text-red-400">Attenzione</span>
                    </div>
                    <span className="text-[11px] text-slate-300 block mt-1">
                      {trappola.evaluation.fantagazzetta.commentoRedazione || "Partita ad alto coefficiente di difficoltà."}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* BALLOTTAGGI DELLA ROSA */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span className="text-xs font-black text-amber-400 uppercase flex items-center gap-1.5">
                  <span>⚔️</span>
                  <span>Ballottaggi della Rosa ({squadBallottaggi.length})</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Gazzetta</span>
              </div>

              {squadBallottaggi.length > 0 ? (
                <div className="space-y-1.5">
                  {squadBallottaggi.map((b, idx) => {
                    const cleanP1 = cleanPlayerName(b.p1);
                    const cleanP2 = cleanPlayerName(b.p2);
                    const isP1InSquad = Array.from(squadPlayerCleanNames).some(u => 
                      u === cleanP1 || cleanP1.includes(u) || u.includes(cleanP1)
                    );
                    const isP2InSquad = Array.from(squadPlayerCleanNames).some(u => 
                      u === cleanP2 || cleanP2.includes(u) || u.includes(cleanP2)
                    );

                    return (
                      <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-1">
                        <div className={`flex items-center gap-1 truncate max-w-[46%] px-1.5 py-0.5 rounded ${
                          isP1InSquad ? 'bg-amber-950/70 border border-amber-500/40 text-amber-300 font-bold' : 'text-slate-300'
                        }`}>
                          <span className="truncate">{b.p1}</span>
                          <span className="text-[10px] font-mono text-emerald-400">{b.perc1}%</span>
                        </div>
                        <span className="text-slate-500 font-bold text-[10px]">vs</span>
                        <div className={`flex items-center gap-1 truncate max-w-[46%] justify-end px-1.5 py-0.5 rounded ${
                          isP2InSquad ? 'bg-amber-950/70 border border-amber-500/40 text-amber-300 font-bold' : 'text-slate-300'
                        }`}>
                          <span className="text-[10px] font-mono text-slate-400">{b.perc2}%</span>
                          <span className="truncate">{b.p2}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-950/70 text-center text-xs text-slate-400">
                  Nessun ballottaggio attivo per i calciatori della tua rosa
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEZIONE 4: CALENDARIO TURNO COMPLETO */}
        {mobileSection === 'fixtures' && (
          <div className="space-y-2">
            <span className="text-xs font-black text-amber-400 uppercase flex items-center gap-1 px-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentTitle}</span>
            </span>

            <div className="space-y-1.5">
              {currentFixtures.map(m => (
                <div key={m.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 w-12">{m.date.slice(0, 3)} {m.time}</span>
                    <span className="font-bold text-white w-20 text-right truncate">{m.homeTeam}</span>
                    <span className="text-slate-500 text-[10px]">vs</span>
                    <span className="font-bold text-white w-20 truncate">{m.awayTeam}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-950 text-amber-300 border border-slate-800">
                    H:{m.homeDifficulty} / A:{m.awayDifficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 3. BOTTOM NAVIGATION BAR FISSA MOBILE (TIPO APP NATIVA) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur-md border-t border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setMobileSection('pitch')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all ${
            mobileSection === 'pitch' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-base leading-none">🏟️</span>
          <span className="text-[10px] font-bold">Campo (11)</span>
        </button>

        <button
          onClick={() => setMobileSection('bench')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all ${
            mobileSection === 'bench' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-base leading-none">🪑</span>
          <span className="text-[10px] font-bold">Panchina ({bench.length})</span>
        </button>

        <button
          onClick={() => setMobileSection('tactics')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all ${
            mobileSection === 'tactics' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-base leading-none">📋</span>
          <span className="text-[10px] font-bold">Tattica</span>
        </button>

        <button
          onClick={() => setMobileSection('fixtures')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all ${
            mobileSection === 'fixtures' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-base leading-none">📅</span>
          <span className="text-[10px] font-bold">Gare</span>
        </button>
      </nav>

      {/* 4. MODALE DETTAGLI MATCH REPORT PER SMARTPHONE */}
      {selectedPlayerForReport && (() => {
        const { player, evaluation, tedScore } = selectedPlayerForReport;
        const verdict = getTedPlayerVerdict(player, tedScore, evaluation);
        const matchInfo = evaluation.match;
        const diffBadge = matchInfo ? getDifficultyBadge(matchInfo.difficulty) : null;
        const currentMatchdayNum = activeTab === 'next' ? NEXT_MATCHDAY_NUMBER : CURRENT_MATCHDAY_NUMBER;
        const diddiYoutube = getDiddiMatchdayYoutubeAdvice(player, currentMatchdayNum, evaluation);
        const fgConsigliato = getFantagazzettaConsigliatoStatus(player, evaluation);

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-3 animate-in fade-in duration-150">
            <div className="bg-slate-900 border-t-2 sm:border-2 border-slate-700 rounded-t-3xl sm:rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-3 p-3.5 select-none max-h-[92vh] overflow-y-auto scrollbar-thin">
              
              {/* HEADER MODALE MOBILE */}
              <div className="flex items-start justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center ${getRoleBg(player.ruolo)}`}>
                    {player.ruolo}
                  </span>
                  <div>
                    <h2 className="text-base font-black text-white uppercase leading-tight">
                      {player.nome}
                    </h2>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {player.squadra} • Qt: {player.quotazione} • FVM: {player.fvm}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className={`px-2 py-0.5 rounded-lg text-xs font-black border ${getScoreColor(tedScore)}`}>
                    Score: {tedScore}
                  </div>

                  {/* Frecce navigazione calciatori */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={handlePrevPlayer}
                      className="p-1 rounded hover:bg-slate-800 text-slate-300"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextPlayer}
                      className="p-1 rounded hover:bg-slate-800 text-slate-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedPlayerForReport(null)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* GRAFICO E KPI FANTACALCIO */}
              <PlayerPerformanceChart player={player} />

              {/* MATCH & FDR */}
              {matchInfo && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">{matchInfo.matchdayTitle}</span>
                    <span className="px-1.5 py-0.2 rounded font-black text-[9px] bg-slate-800 text-slate-300">
                      {matchInfo.isHome ? 'IN CASA' : 'IN TRASFERTA'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                    <span>{matchInfo.isHome ? `${player.squadra} vs ${matchInfo.opponent}` : `${matchInfo.opponent} vs ${player.squadra}`}</span>
                    {diffBadge && (
                      <span className={`px-1.5 py-0.2 rounded font-black border text-[9px] ${diffBadge.color}`}>
                        {diffBadge.label}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* VERDETTO TED LASSO */}
              <div className="bg-amber-950/40 border border-amber-400/50 rounded-xl p-2.5 space-y-1 text-xs">
                <span className="font-black text-amber-400 uppercase text-[11px] block">
                  👨🏻‍💼 Verdetto Ted: {verdict.badge}
                </span>
                <p className="text-[11px] text-slate-200 italic">"{verdict.quote}"</p>
                <p className="text-[10px] text-slate-300 font-bold">{verdict.verdict}</p>
              </div>

              {/* SCHEDA CONSIGLIATO FANTAGAZZETTA SE PRESENTE */}
              {fgConsigliato.isConsigliato && (
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/60 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-300 text-[11px]">🔥 {fgConsigliato.titolo}</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-900/80 text-blue-200 text-[9px] font-mono">
                      {fgConsigliato.rubrica}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100">{fgConsigliato.motivo}</p>
                </div>
              )}

              {/* YOUTUBE LUCA DIDDI */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/50 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-400 text-[11px]">📺 {diddiYoutube.title}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-black border uppercase ${diddiYoutube.tagColor}`}>
                    {diddiYoutube.tag}
                  </span>
                </div>
                <div className="text-[11px] text-amber-200 font-bold">
                  🎯 Verdetto Diddi: {diddiYoutube.verdict}
                </div>
                <p className="text-[11px] text-slate-200 bg-slate-900/80 p-2 rounded-lg border border-slate-800 leading-snug">
                  "{diddiYoutube.analysis}"
                </p>
              </div>

              {/* CHIUDI REPORT */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
                <button
                  onClick={() => setSelectedPlayerForReport(null)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition-all active:scale-95 text-center"
                >
                  Chiudi Scheda
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
