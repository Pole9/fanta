import React, { useState, useMemo, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { calculateAttackerMetrics } from '../utils/auctionCalculations';
import { FastBiddingPanel } from './FastBiddingPanel';
import { StatsCard } from './StatsCard';
import { 
  Flame, 
  Coins, 
  Target, 
  Trophy, 
  ChevronRight, 
  ChevronLeft,
  Search
} from 'lucide-react';
import { Player } from '../types';
import { getInjuryInfo } from '../data/injuryData';

export const AttackersWarRoom: React.FC = () => {
  const { 
    teams, 
    players, 
    slotConfig, 
    minimumPrice, 
    activePlayer, 
    setActivePlayer,
    setCurrentRole,
    selectedTeamFilter,
    prevAlphabeticalPlayer,
    nextAlphabeticalPlayer,
    selectFirstAvailablePlayer
  } = useAuction();

  const [selectedAttacker, setSelectedAttacker] = useState<Player | null>(null);
  const [marketFilter, setMarketFilter] = useState<'all' | 'top' | 'rigoristi' | 'scommesse'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const attackerMetrics = useMemo(() => {
    return calculateAttackerMetrics(teams, slotConfig, minimumPrice);
  }, [teams, slotConfig, minimumPrice]);

  // Tutti gli attaccanti in ordine alfabetico A-Z
  const allAttackers = useMemo(() => {
    let list = players.filter(p => p.ruolo === 'A');
    if (selectedTeamFilter && selectedTeamFilter !== 'ALL') {
      list = list.filter(p => p.squadra.toLowerCase() === selectedTeamFilter.toLowerCase());
    }
    return list.sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
  }, [players, selectedTeamFilter]);

  // Lista attaccanti disponibili: SEMPRE IN RIGOROSO ORDINE ALFABETICO A-Z
  const availableAttackers = useMemo(() => {
    let list = players.filter(p => p.ruolo === 'A' && p.status === 'available');

    if (selectedTeamFilter && selectedTeamFilter !== 'ALL') {
      list = list.filter(p => p.squadra.toLowerCase() === selectedTeamFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => p.nome.toLowerCase().includes(q) || p.squadra.toLowerCase().includes(q));
    }

    if (marketFilter === 'top') {
      list = list.filter(p => p.fvm >= 80);
    } else if (marketFilter === 'rigoristi') {
      list = list.filter(p => p.rigorista);
    } else if (marketFilter === 'scommesse') {
      list = list.filter(p => p.fvm < 50 && (p.gf ?? 0) >= 5);
    }

    return list.sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
  }, [players, marketFilter, searchQuery, selectedTeamFilter]);

  const totalAttackersNeeded = teams.length * slotConfig.A; // 8 * 6 = 48
  const totalAttackersBought = teams.reduce((acc, t) => acc + t.players.filter(p => p.ruolo === 'A').length, 0);
  const totalAttackersRemaining = totalAttackersNeeded - totalAttackersBought;
  const totalAvailableCreditsForA = attackerMetrics.reduce((acc, m) => acc + m.availableForAttackers, 0);

  // Focus: prioritizza sempre la versione aggiornata dal database
  const playerInFocus = useMemo(() => {
    if (activePlayer && activePlayer.ruolo === 'A') {
      const fresh = players.find(p => p.id === activePlayer.id);
      if (fresh) return fresh;
    }
    if (selectedAttacker) {
      const fresh = players.find(p => p.id === selectedAttacker.id);
      if (fresh) return fresh;
    }
    return availableAttackers[0] || allAttackers.find(p => p.status === 'available') || allAttackers[0] || null;
  }, [activePlayer, selectedAttacker, availableAttackers, allAttackers, players]);

  const startAuctionForPlayer = (player: Player) => {
    setCurrentRole('A');
    setActivePlayer(player);
    setSelectedAttacker(player);
  };

  // All'ingresso nella War Room Attaccanti, seleziona sempre il primo attaccante libero
  useEffect(() => {
    setCurrentRole('A');
    setMarketFilter('all');
    setSearchQuery('');
    const firstA = allAttackers.find(p => p.status === 'available');
    if (firstA) {
      setActivePlayer(firstA);
      setSelectedAttacker(firstA);
    }
  }, []);

  // Se all'apertura activePlayer non è un attaccante, allinea al primo libero
  useEffect(() => {
    if (!activePlayer || activePlayer.ruolo !== 'A') {
      const firstA = allAttackers.find(p => p.status === 'available');
      if (firstA) {
        setActivePlayer(firstA);
        setSelectedAttacker(firstA);
      }
    }
  }, [activePlayer?.id, activePlayer?.ruolo]);

  // Quando activePlayer cambia (es. con freccia sinistra o destra da tastiera), sincronizza la scheda
  useEffect(() => {
    if (activePlayer && activePlayer.ruolo === 'A') {
      setSelectedAttacker(null);
    }
  }, [activePlayer?.id]);

  const availableAttackersCount = useMemo(() => {
    return allAttackers.filter(p => p.status === 'available').length;
  }, [allAttackers]);

  const activeIndex = useMemo(() => {
    if (!playerInFocus) return 0;
    const idx = allAttackers.findIndex(p => p.id === playerInFocus.id);
    return idx >= 0 ? idx : 0;
  }, [allAttackers, playerInFocus]);

  const handlePrev = () => {
    setSelectedAttacker(null);
    prevAlphabeticalPlayer();
  };
  const handleNext = () => {
    setSelectedAttacker(null);
    nextAlphabeticalPlayer();
  };
  const handleFirstAvail = () => {
    setSelectedAttacker(null);
    selectFirstAvailablePlayer();
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-1 overflow-hidden select-none">
      
      {/* BARRA SUPERIORE WAR ROOM: NAVIGAZIONE A SINISTRA, SCRITTA WAR ROOM A DESTRA */}
      <div className="flex items-center justify-between gap-2 py-0.5 px-1 select-none flex-wrap flex-shrink-0">
        {/* BLOCCO NAVIGAZIONE A SINISTRA (1° LIBERO, PREC, SUCC) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleFirstAvail}
            className="px-2 py-0.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/70 text-cyan-300 rounded-lg text-xs font-black flex items-center gap-1 transition-all active:scale-95 shadow"
            title="Riporta subito al primo attaccante non ancora chiamato"
          >
            <span>⏮️ 1° Libero</span>
          </button>

          <button
            onClick={handlePrev}
            className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold flex items-center gap-1 transition-all active:scale-95 text-xs"
            title="Attaccante precedente"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prec</span>
          </button>

          <div className="font-mono text-xs select-none">
            <span className="text-white font-black">{activeIndex + 1}</span>
            <span className="text-slate-500">/{allAttackers.length}</span>
            <span className="text-emerald-400 font-bold ml-1.5">({availableAttackersCount} disp.)</span>
          </div>

          <button
            onClick={handleNext}
            className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold flex items-center gap-1 transition-all active:scale-95 text-xs"
            title="Attaccante successivo"
          >
            <span className="hidden sm:inline">Succ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SCRITTA WAR ROOM ALLINEATA A DESTRA */}
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          <h1 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase">
            WAR ROOM ATTACCANTI
          </h1>
        </div>
      </div>

      {/* RIGA DELLE 8 SQUADRE (VALORI RESIDUI IN GIALLO, MAX > SCARSENAL IN ROSSO, MAX/MIN BUDGET IN EVIDENZA) */}
      <div>
        <div className="grid grid-cols-8 gap-1.5">
          {(() => {
            const scarsenalMetric = attackerMetrics.find(m => m.teamName.toLowerCase().includes('scarsenal'));
            const scarsenalMaxBid = scarsenalMetric ? scarsenalMetric.maxBid : 0;

            const budgets = attackerMetrics.map(m => m.currentBudget);
            const maxBudget = Math.max(...budgets);
            const minBudget = Math.min(...budgets);
            const hasBudgetDiff = maxBudget > minBudget;

            return attackerMetrics.map((teamMetric) => {
              const isScarsenal = teamMetric.teamName.toLowerCase().includes('scarsenal');
              const hasHigherMaxThanScarsenal = !isScarsenal && teamMetric.maxBid > scarsenalMaxBid;
              const isMaxBudget = hasBudgetDiff && teamMetric.currentBudget === maxBudget;
              const isMinBudget = hasBudgetDiff && teamMetric.currentBudget === minBudget;

              const cardClasses = teamMetric.attackersRemaining === 0
                ? 'border-slate-800 opacity-40 bg-slate-950'
                : isMaxBudget
                ? isScarsenal
                  ? 'team-card-max-budget border-2 border-emerald-400 bg-cyan-950/30 shadow-md ring-2 ring-emerald-400/60'
                  : 'team-card-max-budget border-2 border-emerald-500 bg-emerald-950/25 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-500/50'
                : isMinBudget
                ? isScarsenal
                  ? 'team-card-min-budget border-2 border-rose-400 bg-cyan-950/30 shadow-md ring-2 ring-rose-400/60'
                  : 'team-card-min-budget border-2 border-rose-500 bg-rose-950/25 shadow-md shadow-rose-500/20 ring-1 ring-rose-500/50'
                : isScarsenal
                ? 'border-cyan-500/70 bg-cyan-950/20 shadow-sm ring-1 ring-cyan-500/30'
                : hasHigherMaxThanScarsenal
                ? 'border-red-600/80 bg-red-950/25 shadow-sm shadow-red-950/50'
                : 'border-slate-800 bg-slate-900 hover:border-slate-750';

              return (
                <div
                  key={teamMetric.teamId}
                  className={`border rounded-xl px-1 py-1 flex flex-col justify-center select-none transition-all ${cardClasses}`}
                >
                  {/* BADGE DI STATO BUDGET IN EVIDENZA (PIÙ RICCO / MENO SOLDI) */}
                  {isMaxBudget && (
                    <div className="flex justify-center -mt-0.5 mb-0.5">
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                        👑 PIÙ RICCO
                      </span>
                    </div>
                  )}
                  {isMinBudget && (
                    <div className="flex justify-center -mt-0.5 mb-0.5">
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                        📉 MENO SOLDI
                      </span>
                    </div>
                  )}

                  {/* Nome squadra & colore */}
                  <div className="flex items-center justify-center gap-1 mb-0.5 truncate">
                    <span 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: teamMetric.teamColor }}
                    />
                    <span className={`font-extrabold text-[11px] sm:text-xs truncate leading-tight ${isScarsenal ? 'text-cyan-200' : 'text-white'}`}>
                      {teamMetric.teamName}
                    </span>
                  </div>

                  {/* 1. MAX SPENDIBILE IN GROSSO (EVIDENZIATO IN ROSSO SE > SCARSENAL) */}
                  <div className="text-center">
                    <div 
                      className={`text-lg sm:text-xl font-black font-mono leading-none tracking-tight flex items-center justify-center gap-1 ${
                        hasHigherMaxThanScarsenal
                          ? "text-red-400"
                          : isScarsenal
                          ? "text-cyan-300"
                          : "text-slate-200"
                      }`}
                      title={
                        hasHigherMaxThanScarsenal
                          ? `Max offerta ${teamMetric.maxBid} è maggiore di Scarsenal (${scarsenalMaxBid})`
                          : isScarsenal
                          ? `Tua offerta massima di riferimento: ${scarsenalMaxBid}`
                          : `Max offerta ${teamMetric.maxBid}`
                      }
                    >
                      <span className="text-[9px] font-extrabold uppercase tracking-wide text-slate-400">Max</span>
                      <span>{teamMetric.maxBid}</span>
                    </div>

                    {/* 2. TOTALE CREDITI RESIDUI: EVIDENZIATO IN VERDE SE MAX BUDGET, IN ROSA/ROSSO SE MIN BUDGET */}
                    <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-black font-mono leading-tight mt-0.5 whitespace-nowrap">
                      <span 
                        className={`font-bold px-1 rounded transition-all ${
                          isMaxBudget
                            ? "team-budget-max text-emerald-300 bg-emerald-950/80 border border-emerald-500 font-black shadow-sm"
                            : isMinBudget
                            ? "team-budget-min text-rose-300 bg-rose-950/80 border border-rose-500 font-black shadow-sm"
                            : "text-yellow-400"
                        }`}
                        title={
                          isMaxBudget
                            ? `Budget residuo PIÙ ALTO dell'asta: ${teamMetric.currentBudget} crediti`
                            : isMinBudget
                            ? `Budget residuo PIÙ BASSO dell'asta: ${teamMetric.currentBudget} crediti`
                            : "Totale crediti residui"
                        }
                      >
                        {isMaxBudget ? `👑 Tot: ${teamMetric.currentBudget}` : isMinBudget ? `⚠️ Tot: ${teamMetric.currentBudget}` : `Tot: ${teamMetric.currentBudget}`}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span 
                        className={teamMetric.attackersRemaining > 0 ? "text-rose-400 font-extrabold" : "text-slate-500 font-normal"}
                        title={`${teamMetric.attackersRemaining} slot attaccanti ancora liberi`}
                      >
                        {teamMetric.attackersRemaining} lib.
                      </span>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* SEZIONE CENTRALE: SCHEDA CALCIATORE/ASTA + ATTACCANTI LIBERI AFFIANCATI */}
      <div className="grid grid-cols-12 gap-2 items-stretch flex-1 min-h-0 overflow-hidden">
        
        {/* COLONNA SINISTRA: SCHEDA (INTESTAZIONE E NOTA BLOCCATE, TABELLA SCORREVOLE) & FAST BIDDING (SEMPRE ANCORATO IN BASSO) */}
        <div className="col-span-8 flex flex-col justify-between h-full min-h-0 overflow-hidden">
          <div className="flex-shrink-0">
            <StatsCard player={playerInFocus} />
          </div>
          <div className="flex-shrink-0 pt-1">
            <FastBiddingPanel player={playerInFocus} />
          </div>
        </div>

        {/* COLONNA DESTRA: ATTACCANTI LIBERI SUL MERCATO (SEMPRE ALFABETICO, 4 COLONNE) */}
        <div className="col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-2.5 shadow-lg flex flex-col h-full min-h-0 overflow-hidden">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-1.5 flex-shrink-0">
            <span className="text-[11px] font-black uppercase text-white flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Attaccanti Liberi ({availableAttackers.length})</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMarketFilter('all')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${marketFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
              >
                Tutti
              </button>
              <button
                onClick={() => setMarketFilter('top')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${marketFilter === 'top' ? 'bg-red-950 text-red-300' : 'text-slate-500'}`}
              >
                Top
              </button>
              <button
                onClick={() => setMarketFilter('rigoristi')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${marketFilter === 'rigoristi' ? 'bg-indigo-950 text-indigo-300' : 'text-slate-500'}`}
              >
                Rig
              </button>
            </div>
          </div>

          <div className="relative mb-2 flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-2 py-0.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* LISTA ATTACCANTI IN RIGOROSO ORDINE ALFABETICO */}
          <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
            {availableAttackers.map(attacker => {
              const isSelected = playerInFocus?.id === attacker.id;
              const injury = getInjuryInfo(attacker.nome);

              return (
                <div
                  key={attacker.id}
                  className={`p-1.5 rounded-lg border transition-all flex items-center justify-between gap-1 ${
                    isSelected
                      ? 'bg-slate-800 border-red-500 ring-1 ring-red-500'
                      : 'bg-slate-950 border-slate-850 hover:bg-slate-850'
                  }`}
                >
                  <div 
                    className="truncate cursor-pointer flex-1"
                    onClick={() => setSelectedAttacker(attacker)}
                  >
                    <div className="flex items-center gap-1 truncate">
                      {attacker.targetTier === 'S' && (
                        <span className="px-1 rounded bg-amber-400 text-slate-950 font-black text-[9px] shadow-sm">
                          ⭐S
                        </span>
                      )}
                      {attacker.targetTier === 'A' && (
                        <span className="px-1 rounded bg-cyan-400 text-slate-950 font-black text-[9px] shadow-sm">
                          ⭐A
                        </span>
                      )}
                      <span className="font-black text-xs text-white uppercase truncate">
                        {attacker.nome}
                      </span>
                      {attacker.rigorista && (
                        <span className="px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">
                          R
                        </span>
                      )}
                      {injury && (
                        <span 
                          className="px-1 py-0.2 rounded bg-red-600 text-white font-black text-[9px] shadow-sm"
                          title={`Infortunato: ${injury.infortunio} • Rientro: ${injury.rientroPrevisto}`}
                        >
                          🏥 {injury.meseRientro}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-300 font-bold">{attacker.squadra}</span>
                      <span>•</span>
                      <span>FVM: <strong className="text-amber-400 text-sm font-black">{attacker.fvm}</strong></span>
                      <span>•</span>
                      <span>MV: <strong className="text-emerald-400 text-sm font-black">{attacker.seasons?.['2026/27']?.mv ? attacker.seasons['2026/27'].mv.toFixed(2) : '-'}</strong></span>
                      <span>•</span>
                      <span title="Media Voto Ultimo Anno (2025/26)">MV '26: <strong className="text-cyan-300 text-sm font-black">{attacker.seasons?.['2025/26']?.mv ? attacker.seasons['2025/26'].mv.toFixed(2) : (attacker.mv ? attacker.mv.toFixed(2) : '-')}</strong></span>
                      <span>•</span>
                      <span>Gol: <strong className="text-white text-xs font-bold">{attacker.gf ?? 0}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => startAuctionForPlayer(attacker)}
                    className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-black flex items-center gap-0.5 active:scale-95 flex-shrink-0"
                    title="Chiama all'asta"
                  >
                    <span>Chiama</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
