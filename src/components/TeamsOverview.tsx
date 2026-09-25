import React, { useState, useMemo } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Team, Role } from '../types';
import { getTeamRoleCounts, calculateMaxBid } from '../utils/auctionCalculations';
import {
  DEFAULT_SCARSENAL_SLOT_TARGETS,
  loadScarsenalSlotTargets,
  saveScarsenalSlotTargets,
  calculateScarsenalSummary,
  getSlotKey
} from '../utils/scarsenalBudget';
import * as XLSX from 'xlsx';
import { 
  Users, 
  Trash2, 
  ShieldCheck, 
  FileSpreadsheet,
  Zap,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  Columns
} from 'lucide-react';

export const TeamsOverview: React.FC = () => {
  const { teams, myTeamId, slotConfig, minimumPrice, unassignPlayer, forceLoadCompleteRosters } = useAuction();

  // Target di spesa teorica per i 25 slot di Scarsenal
  const [scarsenalTargets, setScarsenalTargets] = useState<Record<string, number>>(() => loadScarsenalSlotTargets());

  // Modalità di visualizzazione: 'split' (Scarsenal colonna sinistra + 7 Avversari), 'scarsenal_only', 'opponents_only'
  const [viewFilter, setViewFilter] = useState<'split' | 'scarsenal_only' | 'opponents_only'>('split');

  // Modalità di ordinamento dei calciatori per Scarsenal (Prezzo decrescente vs Ordine d'acquisto)
  const [sortMode, setSortMode] = useState<'price_desc' | 'natural'>('price_desc');

  const rolesOrder: Role[] = ['P', 'D', 'C', 'A'];

  // Gestione modifica input Budget (Massimo Teorico)
  const handleTargetChange = (slotKey: string, rawValue: string) => {
    const val = rawValue === '' ? 0 : Math.max(0, parseInt(rawValue, 10) || 0);
    const updated = { ...scarsenalTargets, [slotKey]: val };
    setScarsenalTargets(updated);
    saveScarsenalSlotTargets(updated);
  };

  // Ripristino valori di default (300 crediti bilanciati)
  const handleResetDefaults = () => {
    if (window.confirm('Ripristinare il budget teorico predefinito di Scarsenal (somma 300 crediti)?')) {
      setScarsenalTargets({ ...DEFAULT_SCARSENAL_SLOT_TARGETS });
      saveScarsenalSlotTargets({ ...DEFAULT_SCARSENAL_SLOT_TARGETS });
    }
  };

  // Azzera tutti i budget teorici a 0
  const handleClearAllTargets = () => {
    if (window.confirm('Azzerare tutti i valori della colonna Budget di Scarsenal?')) {
      const cleared: Record<string, number> = {};
      rolesOrder.forEach(r => {
        for (let i = 0; i < (slotConfig[r] || 8); i++) {
          cleared[getSlotKey(r, i)] = 0;
        }
      });
      setScarsenalTargets(cleared);
      saveScarsenalSlotTargets(cleared);
    }
  };

  // Squadra Scarsenal
  const scarsenalTeam = useMemo(() => {
    return teams.find(t => t.id === myTeamId || t.name.toLowerCase().includes('scarsenal')) || teams[0];
  }, [teams, myTeamId]);

  // Le altre 7 squadre avversarie
  const opponentTeams = useMemo(() => {
    return teams.filter(t => t.id !== scarsenalTeam?.id);
  }, [teams, scarsenalTeam]);

  // Calcolo dati budget Scarsenal (singola colonna con 25 slot e subtotali/totali)
  const scarsenalData = useMemo(() => {
    if (!scarsenalTeam) return null;
    return calculateScarsenalSummary(scarsenalTargets, scarsenalTeam.players, slotConfig, sortMode);
  }, [scarsenalTeam, scarsenalTargets, slotConfig, sortMode]);

  // Esportazione in file Excel (.xlsx) per Leghe Fantacalcio
  const exportToExcel = () => {
    try {
      const rows: any[] = [];
      teams.forEach(team => {
        team.players.forEach(p => {
          rows.push({
            SquadraFanta: team.name,
            Ruolo: p.ruolo,
            Calciatore: p.nome,
            Club: p.squadra,
            Prezzo: p.price,
            MV: p.mv || '',
            FM: p.fm || '',
            FVM: p.fvm || ''
          });
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Rose_Fantacalcio');

      // Foglio riassunto bilanci
      const summaryRows = teams.map(t => ({
        Squadra: t.name,
        CreditiResidui: t.currentBudget,
        CreditiSpesi: 300 - t.currentBudget,
        GiocatoriAcquistati: t.players.length,
        SlotTotali: slotConfig.P + slotConfig.D + slotConfig.C + slotConfig.A
      }));
      const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Riepilogo_Bilanci');

      // Foglio dedicato Scarsenal con colonne Budget, Real e Delta
      if (scarsenalData) {
        const scarsenalRows: any[] = [];
        rolesOrder.forEach(role => {
          scarsenalData.rowsByRole[role].forEach(row => {
            scarsenalRows.push({
              Slot: row.slotLabel,
              Ruolo: role,
              Calciatore: row.player ? row.player.nome : '(Slot Libero)',
              Club: row.player ? row.player.squadra : '',
              Budget: row.maxTheoretical,
              Real: row.actualPrice !== null ? row.actualPrice : '',
              Delta: row.delta !== null ? row.delta : '',
              Stato: row.player ? 'Acquistato' : 'In attesa'
            });
          });
        });

        // Riga Totali in Excel
        scarsenalRows.push({
          Slot: 'TOTALI',
          Ruolo: 'TUTTI',
          Calciatore: `Totale Acquisti: ${scarsenalData.summary.filledSlotsCount}/25`,
          Club: '',
          Budget: scarsenalData.summary.totalBudget,
          Real: scarsenalData.summary.totalReal,
          Delta: scarsenalData.summary.totalDelta,
          Stato: `Residuo in Cassa: ${scarsenalTeam.currentBudget} cr`
        });

        const scarsenalSheet = XLSX.utils.json_to_sheet(scarsenalRows);
        XLSX.utils.book_append_sheet(workbook, scarsenalSheet, 'Scarsenal_Budget_Real_Delta');
      }

      XLSX.writeFile(workbook, `Asta_Fantacalcio_Rose_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (e: any) {
      alert(`Errore esportazione Excel: ${e?.message}`);
    }
  };

  // Helper per il badge del ruolo
  const getRoleBadgeClass = (r: Role) => {
    switch (r) {
      case 'P': return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'D': return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'C': return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'A': return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-75px)] pr-2 pb-16 scrollbar-thin">
      
      {/* HEADER DELLA VISTA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Rose e Bilanci • Focus Scarsenal</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Scarsenal in colonna unica dedicata con 25 slot, colonne <strong>Budget</strong>, <strong>Real</strong>, <strong>Delta</strong> e riga totali calcolati.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Selettore Viste */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs shadow-inner">
            <button
              onClick={() => setViewFilter('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewFilter === 'split' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Scarsenal a sinistra e le altre 7 squadre a destra"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Scarsenal + Avversari</span>
            </button>
            <button
              onClick={() => setViewFilter('scarsenal_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewFilter === 'scarsenal_only' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualizza unicamente Scarsenal in colonna singola"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Solo Scarsenal</span>
            </button>
            <button
              onClick={() => setViewFilter('opponents_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewFilter === 'opponents_only' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualizza solo le 7 squadre avversarie"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Solo Avversari (7)</span>
            </button>
          </div>

          <button
            onClick={() => forceLoadCompleteRosters()}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
            title="Ricarica le 8 rose simulate da 25/25 calciatori"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>⚡ Ricarica 25/25</span>
          </button>

          <button
            onClick={exportToExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Esporta Excel</span>
          </button>
        </div>
      </div>

      {/* CORPO PRINCIPALE: LAYOUT SCARSENAL + AVVERSARI */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        
        {/* ======================================================== */}
        {/* COLONNA UNICA SCARSENAL (STANDALONE DA SOLA)            */}
        {/* ======================================================== */}
        {(viewFilter === 'split' || viewFilter === 'scarsenal_only') && scarsenalTeam && scarsenalData && (
          <div className={`${
            viewFilter === 'scarsenal_only'
              ? 'col-span-1 xl:col-span-8 xl:col-start-3 mx-auto w-full max-w-4xl'
              : 'col-span-1 xl:col-span-6 2xl:col-span-5'
          }`}>
            <div className="bg-slate-900 border-2 border-cyan-500/70 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-cyan-500/20">
              
              {/* HEADER CARD SCARSENAL */}
              <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-b border-slate-800">
                <div className="flex items-center justify-between gap-2 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-cyan-400 shadow-md flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-lg sm:text-xl text-white">
                          {scarsenalTeam.name}
                        </h3>
                        <span className="text-xs uppercase font-black px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                          Tua Squadra
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono font-bold text-slate-200 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      {scarsenalData.summary.filledSlotsCount}/25 Slot
                    </span>
                  </div>
                </div>

                {/* SINTESI FINANZIARIA SCARSENAL */}
                <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-mono">
                  <div className="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Residuo Reale</span>
                    <span className="text-base sm:text-lg font-black text-emerald-400">
                      {scarsenalTeam.currentBudget} <span className="text-xs text-slate-500 font-normal">cr</span>
                    </span>
                  </div>
                  <div className="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Max Rilancio</span>
                    <span className="text-base sm:text-lg font-black text-amber-300">
                      {calculateMaxBid(scarsenalTeam, slotConfig, minimumPrice)} <span className="text-xs text-slate-500 font-normal">cr</span>
                    </span>
                  </div>
                  <div className="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Delta Risparmio</span>
                    <span className={`text-base sm:text-lg font-black ${
                      scarsenalData.summary.totalDelta > 0 ? 'text-emerald-400' :
                      scarsenalData.summary.totalDelta < 0 ? 'text-rose-400' : 'text-slate-300'
                    }`}>
                      {scarsenalData.summary.totalDelta > 0 ? `+${scarsenalData.summary.totalDelta}` : scarsenalData.summary.totalDelta} <span className="text-xs text-slate-500 font-normal">cr</span>
                    </span>
                  </div>
                </div>

                {/* CONTROLLI TABELLA: ORDINAMENTO E RESET */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                    <button
                      onClick={() => setSortMode('price_desc')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                        sortMode === 'price_desc' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Ordina per prezzo decrescente (Slot 1 = acquisto top)"
                    >
                      Prezzo ↓
                    </button>
                    <button
                      onClick={() => setSortMode('natural')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                        sortMode === 'natural' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Ordina per ordine cronologico di chiamata nell'asta"
                    >
                      Chiamata
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetDefaults}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                      title="Ripristina la colonna Budget con i 300 crediti strategici di default"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset 300cr</span>
                    </button>
                    <button
                      onClick={handleClearAllTargets}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-300 rounded-lg border border-slate-800 text-xs font-bold transition-all"
                      title="Azzera tutti i valori della colonna Budget"
                    >
                      Azzera
                    </button>
                  </div>
                </div>
              </div>

              {/* INTESTAZIONE COLONNE DELLA TABELLA UNICA */}
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs uppercase font-black text-slate-400">
                <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                  <span className="w-11 text-center font-bold">Slot</span>
                  <span className="font-bold">Calciatore</span>
                </div>
                <div className="flex items-center gap-2 font-mono flex-shrink-0">
                  <span className="w-20 text-center text-amber-300 font-bold" title="Massimo teorico programmato">Budget</span>
                  <span className="w-16 text-right text-white font-bold" title="Valore effettivo pagato">Real</span>
                  <span className="w-16 text-right text-cyan-300 font-bold" title="Delta: Budget - Real">Delta</span>
                  <span className="w-8 text-center"></span>
                </div>
              </div>

              {/* LISTA DEI 25 SLOT IN COLONNA UNICA SUDDIVISA PER RUOLO */}
              <div className="divide-y divide-slate-850">
                {rolesOrder.map(role => {
                  const rows = scarsenalData.rowsByRole[role];
                  const sub = scarsenalData.subtotalsByRole[role];
                  const roleTitle = role === 'P' ? 'Portieri' : role === 'D' ? 'Difensori' : role === 'C' ? 'Centrocampisti' : 'Attaccanti';

                  return (
                    <div key={role} className="bg-slate-900/60">
                      {/* INTESTAZIONE RUOLO */}
                      <div className="px-4 py-2 bg-slate-950/80 flex items-center justify-between border-b border-slate-850">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono text-xs font-black border ${getRoleBadgeClass(role)}`}>
                            {role}
                          </span>
                          <span className="text-sm font-black text-white uppercase tracking-wider">
                            {roleTitle}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-slate-300 font-bold">
                          {sub.boughtCount}/{sub.totalSlots} acquistati
                        </span>
                      </div>

                      {/* RIGHE DEI CALCIATORI / SLOT VUOTI */}
                      <div className="divide-y divide-slate-850/50">
                        {rows.map(row => (
                          <div
                            key={row.slotKey}
                            className={`px-4 py-2 flex items-center justify-between text-sm transition-colors group ${
                              row.player
                                ? 'bg-slate-900/90 hover:bg-slate-850'
                                : 'bg-slate-950/40 hover:bg-slate-950/70'
                            }`}
                          >
                            {/* Slot Badge + Calciatore */}
                            <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                              <span className={`w-11 py-1 rounded text-center font-mono text-xs font-black border flex-shrink-0 ${
                                row.player ? getRoleBadgeClass(role) : 'bg-slate-900 text-slate-500 border-slate-800'
                              }`}>
                                {row.slotLabel}
                              </span>

                              {row.player ? (
                                  <div className="truncate flex-1 min-w-0">
                                    <span className="font-black text-white uppercase text-sm truncate block leading-snug">
                                      {row.player.nome}
                                    </span>
                                    <div className="text-xs text-slate-400 font-mono truncate flex items-center gap-1.5 flex-wrap">
                                      <span className="text-slate-300 font-bold">{row.player.squadra}</span>
                                      {row.player.fvm ? (
                                        <span>• FVM: <strong className="text-amber-400 font-black text-xs sm:text-sm">{row.player.fvm}</strong></span>
                                      ) : null}
                                      {row.player.mv ? (
                                        <span>• MV: <strong className="text-emerald-400 font-black text-xs sm:text-sm">{row.player.mv.toFixed(2)}</strong></span>
                                      ) : null}
                                    </div>
                                  </div>
                              ) : (
                                <span className="text-slate-500 italic text-sm truncate">
                                  — Slot libero —
                                </span>
                              )}
                            </div>

                            {/* Colonne Budget, Real, Delta & Azione */}
                            <div className="flex items-center gap-2 font-mono flex-shrink-0">
                              {/* 1. COLONNA BUDGET (Input editabile ingrandito) */}
                              <div className="w-20 flex justify-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="300"
                                  value={row.maxTheoretical === 0 ? '' : row.maxTheoretical}
                                  placeholder="0"
                                  onChange={(e) => handleTargetChange(row.slotKey, e.target.value)}
                                  className="w-16 h-8 text-center font-mono font-black text-sm bg-slate-950 border border-slate-700 focus:border-cyan-400 text-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-inner"
                                  title={`Modifica budget teorico programmato per ${row.slotLabel}`}
                                />
                              </div>

                              {/* 2. COLONNA REAL (Valore effettivo una volta preso ingrandito) */}
                              <div className="w-16 text-right">
                                {row.actualPrice !== null ? (
                                  <span className="font-mono font-black text-sm text-white">
                                    {row.actualPrice} <span className="text-xs text-slate-400 font-normal">cr</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-600 font-mono text-sm">—</span>
                                )}
                              </div>

                              {/* 3. COLONNA DELTA (Badge ingrandito) */}
                              <div className="w-16 text-right">
                                {row.delta !== null ? (
                                  <span className={`inline-block px-2 py-0.5 rounded font-mono font-black text-xs sm:text-sm border ${
                                    row.delta > 0
                                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                                      : row.delta < 0
                                      ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                                      : 'bg-slate-900 text-slate-400 border-slate-800'
                                  }`}>
                                    {row.delta > 0 ? `+${row.delta}` : row.delta}
                                  </span>
                                ) : (
                                  <span className="text-slate-600 font-mono text-sm pr-1">—</span>
                                )}
                              </div>

                              {/* Azione Rimozione */}
                              <div className="w-8 flex justify-center">
                                {row.player ? (
                                  <button
                                    onClick={() => unassignPlayer(row.player!.playerId)}
                                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                    title={`Rimuovi ${row.player.nome}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <span className="w-4" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* SUBTOTALE RUOLO */}
                      <div className="px-4 py-2 bg-slate-950/95 border-t border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
                        <span className="font-extrabold uppercase text-slate-300 text-xs">
                          Subtotale {roleTitle} ({sub.boughtCount}/{sub.totalSlots})
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="w-20 text-center font-black text-amber-300 text-sm" title={`Totale budget ${roleTitle}`}>
                            {sub.budgetTotal} cr
                          </span>
                          <span className="w-16 text-right font-black text-white text-sm" title={`Totale spesa reale ${roleTitle}`}>
                            {sub.boughtCount > 0 ? `${sub.realTotal} cr` : '—'}
                          </span>
                          <span className={`w-16 text-right font-black text-sm ${
                            sub.boughtCount === 0 ? 'text-slate-600' :
                            sub.deltaTotal > 0 ? 'text-emerald-400' :
                            sub.deltaTotal < 0 ? 'text-rose-400' : 'text-slate-300'
                          }`} title={`Delta ${roleTitle}`}>
                            {sub.boughtCount > 0 ? (sub.deltaTotal > 0 ? `+${sub.deltaTotal}` : sub.deltaTotal) : '—'}
                          </span>
                          <span className="w-8"></span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* ======================================================== */}
              {/* RIGA TOTALI CALCOLATI PER BUDGET, REAL E DELTA            */}
              {/* ======================================================== */}
              <div className="p-4 bg-slate-950 border-t-2 border-cyan-500 flex items-center justify-between text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black uppercase text-white tracking-wider text-sm sm:text-base">
                      TOTALE ROSA (25 SLOT)
                    </span>
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md border ${
                      scarsenalData.summary.totalBudget === 300
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                        : 'bg-amber-950 text-amber-400 border-amber-500/40'
                    }`}>
                      {scarsenalData.summary.totalBudget === 300 ? '✓ Budget 300' : `${scarsenalData.summary.totalBudget}/300`}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block font-mono mt-1">
                    Acquistati: <strong className="text-white">{scarsenalData.summary.filledSlotsCount}/25</strong> • Cassa reale: <strong className="text-emerald-400 text-sm">{scarsenalTeam.currentBudget} cr</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  {/* Totale Colonna Budget */}
                  <div className="w-20 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Tot Budget</span>
                    <span className="font-mono font-black text-base sm:text-lg text-amber-300">
                      {scarsenalData.summary.totalBudget} <span className="text-xs text-slate-500 font-normal">cr</span>
                    </span>
                  </div>

                  {/* Totale Colonna Real */}
                  <div className="w-16 text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Tot Real</span>
                    <span className="font-mono font-black text-base sm:text-lg text-white">
                      {scarsenalData.summary.totalReal} <span className="text-xs text-slate-500 font-normal">cr</span>
                    </span>
                  </div>

                  {/* Totale Colonna Delta */}
                  <div className="w-16 text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Tot Delta</span>
                    <span className={`font-mono font-black text-base sm:text-lg ${
                      scarsenalData.summary.filledSlotsCount === 0 ? 'text-slate-500' :
                      scarsenalData.summary.totalDelta > 0 ? 'text-emerald-400' :
                      scarsenalData.summary.totalDelta < 0 ? 'text-rose-400' : 'text-slate-300'
                    }`}>
                      {scarsenalData.summary.filledSlotsCount > 0
                        ? (scarsenalData.summary.totalDelta > 0 ? `+${scarsenalData.summary.totalDelta}` : scarsenalData.summary.totalDelta)
                        : '0'}
                    </span>
                  </div>

                  <span className="w-8"></span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LE ALTRE 7 SQUADRE AVVERSARIE (25 SLOT PREDISPOSTI)     */}
        {/* ======================================================== */}
        {(viewFilter === 'split' || viewFilter === 'opponents_only') && (
          <div className={`${
            viewFilter === 'opponents_only'
              ? 'col-span-1 xl:col-span-12'
              : 'col-span-1 xl:col-span-6 2xl:col-span-7'
          } space-y-3`}>
            
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Le altre 7 Squadre (Avversari)</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {opponentTeams.length} squadre monitorate
              </span>
            </div>

            <div className={`grid gap-3 ${
              viewFilter === 'opponents_only'
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3'
            }`}>
              {opponentTeams.map((team) => {
                const counts = getTeamRoleCounts(team);
                const maxBid = calculateMaxBid(team, slotConfig, minimumPrice);
                const totalBought = team.players.length;
                const totalSlots = slotConfig.P + slotConfig.D + slotConfig.C + slotConfig.A;

                const teamDefenders = team.players.filter(p => p.ruolo === 'D');
                const modDefenders = teamDefenders.filter(d => (d.mv ?? 0) >= 6.0);

                return (
                  <div
                    key={team.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Intestazione Squadra */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 truncate">
                          <span 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: team.color }}
                          />
                          <h4 className="font-black text-sm text-white truncate">
                            {team.name}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {totalBought}/{totalSlots}
                        </span>
                      </div>

                      {/* Bilancio Squadra */}
                      <div className="grid grid-cols-2 gap-2 my-2 text-center">
                        <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-850">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Residuo</span>
                          <span className="text-sm font-black font-mono text-emerald-400">
                            {team.currentBudget} <span className="text-[9px] text-slate-500 font-normal">cr</span>
                          </span>
                        </div>
                        <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-850">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Max Rilancio</span>
                          <span className="text-sm font-black font-mono text-amber-300">
                            {maxBid} <span className="text-[9px] text-slate-500 font-normal">cr</span>
                          </span>
                        </div>
                      </div>

                      {/* Modificatore Difesa */}
                      {modDefenders.length > 0 && (
                        <div className="mb-2 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-[9px] font-bold text-emerald-300 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Modificatore (MV ≥ 6.0):</span>
                          </span>
                          <strong className="font-mono text-white">{modDefenders.length}</strong>
                        </div>
                      )}

                      {/* Sintesi Slot Ruolo */}
                      <div className="grid grid-cols-4 gap-1 mb-2 text-center">
                        {rolesOrder.map(r => (
                          <div key={r} className="bg-slate-950/60 p-1 rounded border border-slate-800/80">
                            <span className={`text-[9px] font-black ${
                              r === 'P' ? 'text-amber-400' :
                              r === 'D' ? 'text-emerald-400' :
                              r === 'C' ? 'text-blue-400' : 'text-rose-400'
                            }`}>
                              {r}
                            </span>
                            <div className="text-[10px] font-mono font-bold text-slate-200">
                              {counts[r]}/{slotConfig[r]}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 25 Slot della Squadra Avversaria */}
                      <div className="space-y-2">
                        {rolesOrder.map(role => {
                          const totalSlotsInRole = Math.max(slotConfig[role] || 0, team.players.filter(p => p.ruolo === role).length);
                          const playersInRole = team.players
                            .filter(p => p.ruolo === role)
                            .sort((a, b) => b.price - a.price);

                          const roleTitle = role === 'P' ? 'Portieri' : role === 'D' ? 'Difensori' : role === 'C' ? 'Centrocampisti' : 'Attaccanti';

                          const slots = [];
                          for (let i = 0; i < totalSlotsInRole; i++) {
                            const player = playersInRole[i] || null;
                            const slotLabel = `${role}${i + 1}`;
                            slots.push({ i, player, slotLabel });
                          }

                          return (
                            <div key={role} className="space-y-1">
                              <div className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                                <span>{roleTitle}</span>
                                <span className="font-mono text-slate-500">
                                  {playersInRole.length}/{slotConfig[role]}
                                </span>
                              </div>

                              <div className="space-y-0.5">
                                {slots.map(({ i, player, slotLabel }) => (
                                  <div
                                    key={player ? player.playerId : `empty-${role}-${i}`}
                                    className={`px-2 py-1 rounded border flex items-center justify-between text-xs group transition-all ${
                                      player
                                        ? 'bg-slate-950/70 border-slate-850 hover:border-slate-800'
                                        : 'bg-slate-950/25 border-dashed border-slate-850/60'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 truncate pr-1">
                                      <span className={`px-1 py-0.2 rounded font-mono text-[9px] font-black border flex-shrink-0 ${
                                        player ? getRoleBadgeClass(role) : 'bg-slate-900 text-slate-500 border-slate-800'
                                      }`}>
                                        {slotLabel}
                                      </span>

                                      {player ? (
                                        <div className="truncate">
                                          <span className="font-bold text-white uppercase text-[10px] truncate block leading-tight">
                                            {player.nome}
                                          </span>
                                          <div className="text-[10px] text-slate-400 font-mono truncate flex items-center gap-1">
                                            <span>{player.squadra}</span>
                                            {player.fvm ? (
                                              <span>• FVM: <strong className="text-amber-400 font-black text-[11px]">{player.fvm}</strong></span>
                                            ) : null}
                                            {player.mv ? (
                                              <span>• MV: <strong className="text-emerald-400 font-black text-[11px]">{player.mv.toFixed(2)}</strong></span>
                                            ) : null}
                                          </div>
                                        </div>
                                      ) : (
                                        <span className="text-slate-500 italic text-[10px]">
                                          Slot libero
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      {player ? (
                                        <>
                                          <span className="font-black font-mono text-amber-300 text-[10px]">
                                            {player.price}cr
                                          </span>
                                          <button
                                            onClick={() => unassignPlayer(player.playerId)}
                                            className="p-0.5 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Rimuovi calciatore dalla rosa"
                                          >
                                            <Trash2 className="w-2.5 h-2.5" />
                                          </button>
                                        </>
                                      ) : (
                                        <span className="font-mono text-slate-600 text-[10px]">—</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
