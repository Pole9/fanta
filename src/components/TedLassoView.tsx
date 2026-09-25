import React, { useState, useMemo } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Player, Role } from '../types';
import { 
  TED_FORMATIONS, 
  TedPlayerCard, 
  generateTedLineup, 
  getTedPlayerVerdict, 
  evaluateDefenseModifier,
  TED_LASSO_QUOTES 
} from '../utils/tedLassoAdvisor';
import { 
  CURRENT_MATCHDAY_TITLE, 
  CURRENT_SERIE_A_FIXTURES 
} from '../data/matchdayData';
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
  Trophy, 
  Activity, 
  HelpCircle,
  TrendingUp,
  Calendar,
  RefreshCw,
  Globe,
  CheckCircle
} from 'lucide-react';

export const TedLassoView: React.FC = () => {
  const { 
    teams, 
    myTeamId, 
    players, 
    syncedOnlineData, 
    isSyncingOnline, 
    lastOnlineSyncTime, 
    syncOnlineData 
  } = useAuction();

  // Squadra selezionata (default: Scarsenal / myTeamId)
  const [selectedTeamId, setSelectedTeamId] = useState<string>(myTeamId || 'team-1');
  const [selectedFormationId, setSelectedFormationId] = useState<string>('3-4-3');
  const [selectedPlayerForReport, setSelectedPlayerForReport] = useState<TedPlayerCard | null>(null);
  const [swappingPlayerId, setSwappingPlayerId] = useState<number | null>(null);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [lineupOverrides, setLineupOverrides] = useState<{ starters: number[]; bench: number[] } | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<{ show: boolean; message: string; success: boolean } | null>(null);

  // Squadra corrente
  const activeTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  // Risolvi i giocatori completi della squadra dalle assegnazioni
  const teamFullPlayers = useMemo(() => {
    if (!activeTeam) return [];
    return activeTeam.players
      .map(assign => players.find(p => p.id === assign.playerId))
      .filter((p): p is Player => p !== undefined);
  }, [activeTeam, players]);

  // Calcolo Formazione Ted Lasso di base con dati sincronizzati online
  const baseLineup = useMemo(() => {
    return generateTedLineup(teamFullPlayers, selectedFormationId, syncedOnlineData);
  }, [teamFullPlayers, selectedFormationId, syncedOnlineData]);

  // Gestione Aggiornamento Dati Online
  const handleSyncOnline = async () => {
    const res = await syncOnlineData();
    // Resetta eventuali swap manuali per applicare subito i dati freschi
    setLineupOverrides(null);
    setSwappingPlayerId(null);
    setSyncFeedback({
      show: true,
      message: res.message,
      success: res.success
    });
    setTimeout(() => {
      setSyncFeedback(null);
    }, 7000);
  };

  // Gestione eventuali scambi manuali (Swap) tra titolari e panchina
  const { starters, bench, formation } = useMemo(() => {
    if (!lineupOverrides) return baseLineup;

    const allCards = [...baseLineup.starters, ...baseLineup.bench];
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
    lineupOverrides.bench.forEach((id, idx) => {
      const c = cardMap.get(id);
      if (c) {
        c.isStarter = false;
        c.benchOrder = idx + 1;
        benchCards.push(c);
      }
    });

    return {
      starters: startersCards,
      bench: benchCards,
      formation: baseLineup.formation
    };
  }, [baseLineup, lineupOverrides]);

  // Analisi Modificatore di Difesa
  const defenseModifier = useMemo(() => {
    return evaluateDefenseModifier(starters);
  }, [starters]);

  // Top 3 certezze e scommessa
  const { topPick, scommessa, trappola } = useMemo(() => {
    const sorted = [...starters, ...bench].sort((a, b) => b.tedScore - a.tedScore);
    const top = sorted[0] || null;
    const scomm = sorted.find(c => c.evaluation.fantagazzetta.fascia === 'Scommessa' || c.tedScore >= 70 && c.player.ruolo === 'C') || sorted[1] || null;
    const trap = sorted.find(c => c.evaluation.fantagazzetta.fascia === 'Trappola da Evitare' || (c.tedScore < 60 && c.player.status !== 'assigned')) || null;
    return { topPick: top, scommessa: scomm, trappola: trap };
  }, [starters, bench]);

  // Auto-schiera con Ted (ripristina ottimale)
  const handleAskTed = () => {
    setLineupOverrides(null);
    setSwappingPlayerId(null);
    setQuoteIndex(prev => (prev + 1) % TED_LASSO_QUOTES.length);
  };

  // Esegui scambio tra due giocatori
  const handleSwap = (playerAId: number, playerBId: number) => {
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
    }
    setSwappingPlayerId(null);
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

      {/* 1. TESTATA SUPERIORE DI TED LASSO */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-2 shadow-sm flex-shrink-0">
        
        {/* PARTE SINISTRA: LOGO BELIEVE & TITOLO */}
        <div className="flex items-center gap-2">
          {/* Cartello BELIEVE Iconico */}
          <div 
            onClick={() => setQuoteIndex(prev => (prev + 1) % TED_LASSO_QUOTES.length)}
            className="px-2.5 py-0.5 rounded bg-amber-400 border border-amber-300 text-slate-950 font-black tracking-widest text-[11px] uppercase shadow -rotate-1 hover:rotate-0 transition-transform cursor-pointer"
            title="Clicca per cambiare la citazione del giorno di Ted Lasso"
          >
            BELIEVE
          </div>

          <div>
            <h1 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase flex items-center gap-1.5">
              <span>TED LASSO</span>
              <span className="text-amber-400 text-[11px] font-bold">Assistente Domenicale</span>
            </h1>
            <span className="text-[10px] text-slate-400 hidden sm:inline font-mono">
              {CURRENT_MATCHDAY_TITLE}
            </span>
          </div>
        </div>

        {/* PARTE CENTRALE: SELETTORI SQUADRA, MODULO E PULSANTI AZIONE */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* SELETTORE SQUADRA FANTACALCIO */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Rosa:</span>
            <select
              value={selectedTeamId}
              onChange={(e) => {
                setSelectedTeamId(e.target.value);
                setLineupOverrides(null);
                setSwappingPlayerId(null);
              }}
              className="bg-transparent font-black text-white focus:outline-none cursor-pointer text-xs"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name} ({t.players.length} cal.)
                </option>
              ))}
            </select>
          </div>

          {/* SELETTORE MODULO */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Modulo:</span>
            <select
              value={selectedFormationId}
              onChange={(e) => {
                setSelectedFormationId(e.target.value);
                setLineupOverrides(null);
                setSwappingPlayerId(null);
              }}
              className="bg-transparent font-black text-amber-300 focus:outline-none cursor-pointer text-xs"
            >
              {Object.values(TED_FORMATIONS).map(f => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                  {f.id}
                </option>
              ))}
            </select>
          </div>

          {/* PULSANTE CHIEDI A TED (AUTO-SCHIERA MIGLIOR 11) */}
          <button
            onClick={handleAskTed}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black flex items-center gap-1.5 shadow active:scale-95 transition-all"
            title="Calcola e schiera automaticamente l'11 migliore con la panchina ottimizzata"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span className="hidden md:inline">Chiedi a Ted (Auto-Schiera)</span>
            <span className="md:hidden">Auto-11</span>
          </button>

          {/* PULSANTE AGGIORNA DATI ONLINE */}
          <button
            onClick={handleSyncOnline}
            disabled={isSyncingOnline}
            className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 shadow active:scale-95 transition-all select-none ${
              isSyncingOnline
                ? 'bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
            }`}
            title="Aggiorna online in tempo reale titolarità, ballottaggi e bollettino medico da Fantacalcio.it e Gazzetta dello Sport"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOnline ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isSyncingOnline ? 'Sincronizzazione Live...' : 'Aggiorna Online'}
            </span>
            <span className="sm:hidden">
              {isSyncingOnline ? 'Sync...' : 'Online'}
            </span>
          </button>
        </div>

        {/* PARTE DESTRA: BADGE MODIFICATORE DIFESA & STATO SYNC */}
        <div className="flex items-center gap-1.5">
          {/* Badge Stato Ultimo Aggiornamento Online */}
          {lastOnlineSyncTime ? (
            <div 
              className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
              title={`Dati online aggiornati: ${lastOnlineSyncTime} (${syncedOnlineData?.totalPlayers || 479} giocatori censiti, ${syncedOnlineData?.totalBallots || 44} ballottaggi)`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lastOnlineSyncTime.split('ore')[1] ? `Ore ${lastOnlineSyncTime.split('ore')[1].trim()}` : lastOnlineSyncTime}</span>
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
              <Globe className="w-3 h-3 text-slate-500" />
              <span>Dati Serie A TIM</span>
            </div>
          )}

          <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-black flex items-center gap-1 ${
            defenseModifier.isWorthIt
              ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}
          title={defenseModifier.advice}
          >
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Modificatore: {defenseModifier.expectedBonus}</span>
          </div>
        </div>

      </div>

      {/* 2. AREA PRINCIPALE: CAMPO DA CALCIO A SINISTRA (65%) & LAVAGNA TATTICA A DESTRA (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 flex-1 min-h-0 overflow-hidden">
        
        {/* COLONNA SINISTRA: CAMPO TATTICO VERDE & PANCHINA (Lg: col-span-8) */}
        <div className="lg:col-span-8 flex flex-col justify-between overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-md">
          
          {/* CAMPO DA CALCIO VERDE (GREEN PITCH) */}
          <div className="fanta-pitch relative flex-1 rounded-xl bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 border-2 border-emerald-600/40 shadow-inner overflow-hidden min-h-[360px] sm:min-h-[400px]">
            
            {/* LINEE DEL CAMPO DA CALCIO REGOLAMENTARI */}
            <div className="absolute inset-2 border border-white/20 rounded pointer-events-none" />
            {/* Centrocampo & Cerchio */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-28 h-28 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            {/* Area Rigore Alto (Porta avversaria) */}
            <div className="absolute top-0 left-1/2 w-48 h-16 border-b border-x border-white/20 -translate-x-1/2 pointer-events-none" />
            {/* Area Rigore Basso (Tua Porta) */}
            <div className="absolute bottom-0 left-1/2 w-52 h-20 border-t border-x border-white/20 -translate-x-1/2 pointer-events-none" />

            {/* AVVISO DI SWAP ATTIVO */}
            {swappingPlayerId && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 z-20 animate-bounce">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Clicca su un panchinaro per scambiarlo! (o clicca di nuovo per annullare)</span>
              </div>
            )}

            {/* CALCIATORI TITOLARI POSIZIONATI SUL CAMPO */}
            {starters.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center text-amber-400 mb-2">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-white">Nessun giocatore assegnato a {activeTeam.name}</h3>
                <p className="text-xs text-slate-300 max-w-sm mt-1">
                  Questa squadra non ha ancora calciatori acquistati all'asta. Completa l'asta o seleziona un'altra rosa dal menu in alto.
                </p>
              </div>
            ) : (
              starters.map((card) => {
                const pos = card.pitchPosition || { x: 50, y: 50 };
                const isSelectedForSwap = swappingPlayerId === card.player.id;

                return (
                  <div
                    key={card.player.id}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <div
                      onClick={() => {
                        if (swappingPlayerId) {
                          setSwappingPlayerId(null);
                        } else {
                          setSelectedPlayerForReport(card);
                        }
                      }}
                      className={`group cursor-pointer rounded-lg p-1.5 sm:p-2 bg-slate-950/90 hover:bg-slate-900 border transition-all duration-150 active:scale-95 flex flex-col items-center shadow-lg min-w-[76px] sm:min-w-[92px] max-w-[110px] ${
                        isSelectedForSwap
                          ? 'border-amber-400 ring-2 ring-amber-400 scale-105'
                          : 'border-slate-700/80 hover:border-amber-400/70'
                      }`}
                    >
                      {/* Top Bar: Ruolo + Ted Score */}
                      <div className="w-full flex items-center justify-between gap-1 mb-1">
                        <span className={`w-3.5 h-3.5 rounded text-[9px] font-black flex items-center justify-center ${getRoleBg(card.player.ruolo)}`}>
                          {card.player.ruolo}
                        </span>
                        
                        {/* Ted Score Badge */}
                        <span className={`px-1 py-0.2 rounded text-[9px] font-black border ${getScoreColor(card.tedScore)}`}>
                          {card.tedScore}
                        </span>
                      </div>

                      {/* Nome Calciatore */}
                      <span className="text-[11px] sm:text-xs font-black text-white truncate max-w-[85px] leading-tight text-center">
                        {card.player.nome}
                      </span>

                      {/* Squadra & Avversaria del turno */}
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate max-w-[85px] text-center leading-none">
                        {card.evaluation.match ? (
                          <span className={card.evaluation.match.isHome ? "text-emerald-400" : "text-slate-400"}>
                            {card.evaluation.match.isHome ? "vs " : "@ "}{card.evaluation.match.opponent.slice(0, 4).toUpperCase()}
                          </span>
                        ) : (
                          card.player.squadra.slice(0, 4).toUpperCase()
                        )}
                      </div>

                      {/* Indicatori sintetici: Gazzetta % e Fantagazzetta stelle */}
                      <div className="flex items-center gap-1 mt-1 text-[9px] font-mono leading-none">
                        <span className={`px-1 py-0.2 rounded text-[8px] font-bold ${
                          card.evaluation.gazzetta.titolaritaPercent >= 85 
                            ? 'bg-emerald-950 text-emerald-300' 
                            : 'bg-amber-950 text-amber-300'
                        }`}>
                          {card.evaluation.gazzetta.titolaritaPercent}%
                        </span>
                        <span className="text-amber-400 font-bold">
                          {'★'.repeat(card.evaluation.fantagazzetta.stars)}
                        </span>
                        {card.evaluation.tatticoAdvice && (
                          <span className="text-amber-400 text-[9px]" title="Consigliato dal Tattico">🎯</span>
                        )}
                      </div>

                      {/* Pulsante rapido Scambia */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSwappingPlayerId(isSelectedForSwap ? null : card.player.id);
                        }}
                        className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold text-slate-400 hover:text-amber-300 flex items-center gap-0.5"
                        title="Scambia con un panchinaro"
                      >
                        <ArrowRightLeft className="w-2.5 h-2.5" />
                        <span>Scambia</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

          </div>

          {/* PANCHINA ORDINATA DI TED (BENCH) */}
          <div className="mt-1 bg-slate-950/90 border border-slate-800 rounded-xl px-2 py-1.5 flex-shrink-0">
            <div className="flex items-center justify-between mb-1 text-[11px]">
              <span className="font-black text-slate-300 uppercase flex items-center gap-1.5">
                <span>Panchina Ordinata ({bench.length})</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (1° P, 2 D, 2 C, 2 A ordinati per Ted Score)
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Pronti a subentrare in caso di s.v.
              </span>
            </div>

            {bench.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Nessun giocatore in panchina.</span>
            ) : (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
                {bench.map((card) => {
                  const isTargetForSwap = swappingPlayerId !== null;

                  return (
                    <div
                      key={card.player.id}
                      onClick={() => {
                        if (swappingPlayerId) {
                          handleSwap(swappingPlayerId, card.player.id);
                        } else {
                          setSelectedPlayerForReport(card);
                        }
                      }}
                      className={`px-2 py-1 rounded-lg border text-left cursor-pointer transition-all flex items-center gap-1.5 flex-shrink-0 select-none ${
                        isTargetForSwap
                          ? 'bg-amber-950/40 border-amber-400/80 hover:bg-amber-900/50 scale-102'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                      title={isTargetForSwap ? `Clicca per inserire ${card.player.nome} tra i titolari` : `Vedi scheda di ${card.player.nome}`}
                    >
                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                        {card.benchOrder}°
                      </span>
                      <span className={`w-3 h-3 rounded text-[8px] font-black flex items-center justify-center ${getRoleBg(card.player.ruolo)}`}>
                        {card.player.ruolo}
                      </span>
                      <div className="leading-none">
                        <span className="text-xs font-black text-white block truncate max-w-[80px]">
                          {card.player.nome}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {card.evaluation.match?.opponent ? `@${card.evaluation.match.opponent.slice(0, 3)}` : card.player.squadra.slice(0, 3)}
                        </span>
                      </div>
                      <span className={`px-1 py-0.2 rounded text-[8px] font-black ml-1 border ${getScoreColor(card.tedScore)}`}>
                        {card.tedScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* COLONNA DESTRA: LA LAVAGNA TATTICA DI TED LASSO (Lg: col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-1.5 overflow-y-auto scrollbar-thin">
          
          {/* 1. CITAZIONE ISPIRAZIONALE DI TED LASSO */}
          <div className="bg-slate-900 border border-amber-400/40 rounded-xl p-2.5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-base">👨🏻‍💼</span>
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  Il Consiglio del Mister
                </span>
              </div>
              <button
                onClick={() => setQuoteIndex(prev => (prev + 1) % TED_LASSO_QUOTES.length)}
                className="text-[10px] text-slate-400 hover:text-white font-bold"
                title="Prossima perla di saggezza"
              >
                Cambia ❯
              </button>
            </div>

            <p className="text-xs text-slate-200 italic leading-relaxed font-sans">
              "{TED_LASSO_QUOTES[quoteIndex]}"
            </p>
            <span className="text-[10px] text-amber-400 font-black block mt-1 text-right">
              — Ted Lasso, AFC Richmond
            </span>
          </div>

          {/* 2. VERDETTO MODIFICATORE DIFESA */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-white uppercase flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Analisi Modificatore Difesa</span>
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                defenseModifier.isWorthIt ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {defenseModifier.expectedBonus}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {defenseModifier.advice}
            </p>
          </div>

          {/* 3. LE SCELTE CHIAVE DI GIORNATA */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 shadow-sm space-y-2 flex-1">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Le Scelte Chiave della Domenica
            </span>

            {/* TOP PICK */}
            {topPick && (
              <div 
                onClick={() => setSelectedPlayerForReport(topPick)}
                className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/50 hover:bg-emerald-900/40 cursor-pointer transition-all flex items-start gap-2"
              >
                <div className="w-7 h-7 rounded bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs flex-shrink-0">
                  <Star className="w-4 h-4 fill-slate-950" />
                </div>
                <div className="leading-tight flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{topPick.player.nome}</span>
                    <span className="text-[10px] font-bold text-emerald-400">Score {topPick.tedScore}</span>
                  </div>
                  <span className="text-[10px] text-slate-300 block mt-0.5">
                    {topPick.evaluation.fantagazzetta.commentoRedazione}
                  </span>
                </div>
              </div>
            )}

            {/* LA SCOMMESSA DI TED */}
            {scommessa && (
              <div 
                onClick={() => setSelectedPlayerForReport(scommessa)}
                className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/50 hover:bg-amber-900/40 cursor-pointer transition-all flex items-start gap-2"
              >
                <div className="w-7 h-7 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="leading-tight flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{scommessa.player.nome}</span>
                    <span className="text-[10px] font-bold text-amber-400">Scommessa Ted</span>
                  </div>
                  <span className="text-[10px] text-slate-300 block mt-0.5">
                    {scommessa.evaluation.gazzetta.noteGazzetta}
                  </span>
                </div>
              </div>
            )}

            {/* TRAPPOLA O RISCHIO */}
            {trappola && (
              <div 
                onClick={() => setSelectedPlayerForReport(trappola)}
                className="p-2 rounded-lg bg-red-950/40 border border-red-500/50 hover:bg-red-900/40 cursor-pointer transition-all flex items-start gap-2"
              >
                <div className="w-7 h-7 rounded bg-red-500 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="leading-tight flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{trappola.player.nome}</span>
                    <span className="text-[10px] font-bold text-red-400">Attenzione</span>
                  </div>
                  <span className="text-[10px] text-slate-300 block mt-0.5">
                    {trappola.evaluation.fantagazzetta.commentoRedazione || "Match ad alto rischio o minutaggio ridotto."}
                  </span>
                </div>
              </div>
            )}

            {/* 4. BALLOTTAGGI LIVE SUL CAMPO */}
            {syncedOnlineData?.ballottaggi && syncedOnlineData.ballottaggi.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-1">
                    <span>⚔️</span>
                    <span>Ballottaggi Caldi Live ({syncedOnlineData.ballottaggi.length})</span>
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    Fantacalcio / Gazzetta
                  </span>
                </div>
                <div className="space-y-1 max-h-[145px] overflow-y-auto pr-1 scrollbar-thin">
                  {syncedOnlineData.ballottaggi.slice(0, 6).map((b, idx) => (
                    <div key={idx} className="p-1.5 rounded-md bg-slate-950/90 border border-slate-800 text-[10px] flex items-center justify-between">
                      <div className="flex items-center gap-1 truncate max-w-[45%]">
                        <span className="font-bold text-white truncate">{b.p1}</span>
                        <span className="px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 font-mono font-bold text-[9px]">{b.perc1}%</span>
                      </div>
                      <span className="text-slate-500 font-bold text-[9px]">vs</span>
                      <div className="flex items-center gap-1 truncate max-w-[45%] justify-end">
                        <span className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[9px]">{b.perc2}%</span>
                        <span className="text-slate-300 truncate">{b.p2}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 3. MODALE DETTAGLIO "TED'S MATCH REPORT" */}
      {selectedPlayerForReport && (() => {
        const { player, evaluation, tedScore } = selectedPlayerForReport;
        const verdict = getTedPlayerVerdict(player, tedScore, evaluation);

        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
            <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-3 p-4 select-none">
              
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
                      <span>FVM: <strong className="text-amber-400 text-sm sm:text-base font-black">{player.fvm}</strong></span>
                      <span>•</span>
                      <span>MV: <strong className="text-emerald-400 text-sm sm:text-base font-black">{player.seasons?.['2026/27']?.mv ? player.seasons['2026/27'].mv.toFixed(2) : (player.mv ? player.mv.toFixed(2) : '-')}</strong></span>
                      <span>•</span>
                      <span title="Media Voto Ultimo Anno (2025/26)">MV '26: <strong className="text-cyan-300 text-sm sm:text-base font-black">{player.seasons?.['2025/26']?.mv ? player.seasons['2025/26'].mv.toFixed(2) : (player.mv ? player.mv.toFixed(2) : '-')}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-1 rounded-xl text-xs font-black border ${getScoreColor(tedScore)}`}>
                    Ted Score: {tedScore}/100
                  </div>
                  <button
                    onClick={() => setSelectedPlayerForReport(null)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* CITAZIONE E VERDETTO DI TED LASSO */}
              <div className="bg-amber-950/40 border border-amber-400/50 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-amber-400 uppercase flex items-center gap-1">
                    <span>👨🏻‍💼</span>
                    <span>Verdetto di Ted Lasso: {verdict.badge}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-200 italic font-medium">
                  "{verdict.quote}"
                </p>
                <p className="text-[11px] text-slate-300 font-bold mt-1">
                  {verdict.verdict}
                </p>
              </div>

              {/* SEZIONI ANALITICHE INTEGRATE */}
              <div className="space-y-2 text-xs">
                
                {/* 1. GAZZETTA DELLO SPORT: PROBABILI FORMAZIONI */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-rose-400 uppercase flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Gazzetta dello Sport: Probabili Formazioni</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {syncedOnlineData && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          Live Sync
                        </span>
                      )}
                      <span className="font-mono font-bold text-white">
                        {evaluation.gazzetta.titolaritaPercent}% Titolare
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {evaluation.gazzetta.noteGazzetta}
                  </p>
                  {evaluation.gazzetta.ballottaggioCon && (
                    <div className="text-[10px] text-amber-400 font-mono font-bold">
                      ⚔️ Ballottaggio: {evaluation.gazzetta.ballottaggioCon}
                    </div>
                  )}
                  {evaluation.gazzetta.rigorista && (
                    <div className="text-[10px] text-emerald-400 font-bold">
                      🎯 Designato tra i rigoristi della squadra
                    </div>
                  )}
                </div>

                {/* 2. REDAZIONE FANTAGAZZETTA */}
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

                {/* 3. IL TATTICO LUCA DIDDI (SE CITATO) */}
                {evaluation.tatticoAdvice && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-600/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-amber-300 uppercase flex items-center gap-1">
                        <span>🎖️</span>
                        <span>Consiglio del Tattico Luca Diddi</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-200">
                      {evaluation.tatticoAdvice}
                    </p>
                  </div>
                )}

                {/* 4. MATCH DELLA DOMENICA */}
                {evaluation.match && (
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Partita in programma:</span>
                    <span className="font-bold text-white">
                      {evaluation.match.description}
                    </span>
                  </div>
                )}

              </div>

              {/* FOOTER MODALE */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
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

    </div>
  );
};
