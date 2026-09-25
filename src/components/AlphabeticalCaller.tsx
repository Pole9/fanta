import React, { useState, useMemo, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { StatsCard } from './StatsCard';
import { FastBiddingPanel } from './FastBiddingPanel';
import { TacticalPitch } from './TacticalPitch';
import { RoleFilter, Player } from '../types';
import { FANTAGAZZETTA_ADVICE } from '../data/matchdayData';
import { isTitolarissimo } from '../utils/auctionCalculations';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Clock, 
  X,
  Sparkles,
  ShieldCheck,
  Target,
  Edit3,
  Gavel,
  CheckCircle2,
  TrendingUp,
  Shield,
  Star
} from 'lucide-react';

export const AlphabeticalCaller: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    activePlayer,
    setActivePlayer,
    rolePlayers,
    players,
    teams,
    nextAlphabeticalPlayer,
    prevAlphabeticalPlayer,
    activePlayerIndexInRole,
    updatePlayerNote,
    selectedTeamFilter,
    setSelectedTeamFilter,
    allSerieATeams,
    selectFirstAvailablePlayer
  } = useAuction();

  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlySkipped, setShowOnlySkipped] = useState(false);
  const [skippedSortMode, setSkippedSortMode] = useState<'fvm' | 'titolarita' | 'quotazione' | 'alpha'>('fvm');

  // All'ingresso nell'Area Asta, inizializza se necessario senza saltare durante la digitazione
  useEffect(() => {
    setShowOnlySkipped(false);
    setSearchTerm('');
    if (!activePlayer) {
      selectFirstAvailablePlayer();
    }
  }, []);

  // Prossimi calciatori disponibili in ordine alfabetico
  const upcomingPlayers = useMemo(() => {
    if (!activePlayer) return [];
    const currentIndex = rolePlayers.findIndex(p => p.id === activePlayer.id);
    return rolePlayers
      .slice(currentIndex + 1)
      .filter(p => p.status === 'available');
  }, [rolePlayers, activePlayer]);

  // Invenduti per fine ruolo
  const skippedPlayers = useMemo(() => {
    return rolePlayers.filter(p => p.status === 'skipped');
  }, [rolePlayers]);

  // Ordinamento Invenduti dal migliore al peggiore secondo criterio selezionato
  const sortedSkippedPlayers = useMemo(() => {
    const list = [...skippedPlayers];
    if (skippedSortMode === 'fvm') {
      return list.sort((a, b) => (b.fvm || 0) - (a.fvm || 0) || (b.quotazione || 0) - (a.quotazione || 0) || a.nome.localeCompare(b.nome));
    }
    if (skippedSortMode === 'titolarita') {
      return list.sort((a, b) => {
        const scoreA = isTitolarissimo(a) ? 100 : (a.seasons?.['2026/27']?.partiteTitolare ?? (a.titolarita ?? (a.pg && a.pg >= 20 ? 80 : 30)));
        const scoreB = isTitolarissimo(b) ? 100 : (b.seasons?.['2026/27']?.partiteTitolare ?? (b.titolarita ?? (b.pg && b.pg >= 20 ? 80 : 30)));
        if (scoreB !== scoreA) return scoreB - scoreA;
        return (b.fvm || 0) - (a.fvm || 0);
      });
    }
    if (skippedSortMode === 'quotazione') {
      return list.sort((a, b) => (b.quotazione || 0) - (a.quotazione || 0) || (b.fvm || 0) - (a.fvm || 0));
    }
    return list.sort((a, b) => a.nome.localeCompare(b.nome));
  }, [skippedPlayers, skippedSortMode]);

  // RISULTATI RICERCA: BYPASSA IL FILTRO RUOLO (cerca su tutti i 533 calciatori del listone)
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return players.filter(p => {
      const prevTeam = (p.squadraPrecedente || '').toLowerCase();
      const pName = p.nome.toLowerCase();
      return (
        pName.includes(q) || 
        p.squadra.toLowerCase().includes(q) ||
        prevTeam.includes(q) ||
        // Supporto ricerca per nome per esteso (es. Gonzalo Ramos, Guglielmo Vicario, Nick Woltemade, ecc.)
        (p.id === 6397 && ('gonzalo ramos'.includes(q) || 'goncalo ramos'.includes(q))) ||
        (p.id === 4964 && 'guglielmo vicario'.includes(q)) ||
        (p.id === 6752 && 'nick woltemade'.includes(q)) ||
        (p.id === 4998 && 'nahuel molina'.includes(q)) ||
        (p.id === 7625 && 'pedro goncalves pote'.includes(q)) ||
        (p.id === 7078 && 'franco mastantuono'.includes(q)) ||
        (p.id === 5172 && 'curtis jones'.includes(q)) ||
        (p.id === 1850 && 'franck kessie'.includes(q)) ||
        (p.id === 2514 && 'john stones'.includes(q)) ||
        (p.id === 5641 && 'trevoh chalobah'.includes(q)) ||
        (p.id === 6727 && 'yan couto'.includes(q)) ||
        (p.id === 7623 && 'wilfried gnonto'.includes(q)) ||
        (p.id === 4387 && 'andrea adorante'.includes(q))
      );
    });
  }, [players, searchTerm]);

  const availableCount = rolePlayers.filter(p => p.status === 'available').length;
  const skippedCount = skippedPlayers.length;

  const roleFilterOptions: { role: RoleFilter; label: string; dotColor: string }[] = [
    { role: 'ALL', label: 'TUTTI', dotColor: 'bg-purple-400' },
    { role: 'P', label: 'P', dotColor: 'bg-amber-400' },
    { role: 'D', label: 'D', dotColor: 'bg-emerald-400' },
    { role: 'C', label: 'C', dotColor: 'bg-blue-400' },
    { role: 'A', label: 'A', dotColor: 'bg-red-400' }
  ];

  const roleColors: Record<string, string> = {
    P: 'bg-amber-500 text-slate-950 border-amber-400',
    D: 'bg-emerald-500 text-slate-950 border-emerald-400',
    C: 'bg-blue-500 text-white border-blue-400',
    A: 'bg-red-500 text-white border-red-400'
  };

  return (
    <div className="space-y-1.5">

      {/* BARRA SUPERIORE CONTROLLI RAPIDI */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 shadow-sm text-xs">
        
        {/* PREV / NEXT CON CONTATORE E 1° LIBERO A SINISTRA */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PULSANTE 1° LIBERO (SPOSTATO A SINISTRA COME DA FRECCIA) */}
          <button
            onClick={() => selectFirstAvailablePlayer()}
            className="px-2 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/70 text-cyan-300 rounded-lg text-xs font-black flex items-center gap-1 transition-all active:scale-95 shadow"
            title="Riporta subito al primo calciatore non ancora chiamato di questa categoria e club"
          >
            <span>⏮️ 1° Libero</span>
          </button>

          <button
            onClick={prevAlphabeticalPlayer}
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold flex items-center gap-1 transition-all active:scale-95"
            title="Calciatore precedente"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prec</span>
          </button>

          <div className="font-mono text-xs">
            <span className="text-white font-black">{activePlayerIndexInRole + 1}</span>
            <span className="text-slate-500">/{rolePlayers.length}</span>
            <span className="text-emerald-400 font-bold ml-1.5 hidden md:inline">({availableCount} disp.)</span>
          </div>

          <button
            onClick={nextAlphabeticalPlayer}
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold flex items-center gap-1 transition-all active:scale-95"
            title="Calciatore successivo"
          >
            <span className="hidden sm:inline">Succ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FILTRO SQUADRA & RUOLO */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* SELETTORE CLUB GLOBALE */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 select-none shadow-sm">
            <span className="text-[10px] font-black text-amber-400">CLUB:</span>
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="bg-transparent text-[11px] font-black text-emerald-400 focus:outline-none cursor-pointer uppercase max-w-[110px]"
              title="Filtro squadra: es. Milan + C = centrocampisti del Milan"
            >
              <option value="ALL" className="bg-slate-900 text-white">TUTTI</option>
              {allSerieATeams.map(team => (
                <option key={team} value={team} className="bg-slate-900 text-white">
                  {team.toUpperCase()}
                </option>
              ))}
            </select>
            {selectedTeamFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedTeamFilter('ALL')}
                className="text-slate-400 hover:text-white text-xs font-black"
                title="Azzera filtro club"
              >
                ✕
              </button>
            )}
          </div>

          {/* SELETTORE RUOLO RAPIDO IN ASTA */}
          <div className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
            {roleFilterOptions.map(opt => {
              const isSelected = currentRole === opt.role;
              return (
                <button
                  key={opt.role}
                  onClick={() => setCurrentRole(opt.role)}
                  className={`px-1.5 py-0.5 rounded-md text-[11px] font-black transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={opt.role === 'ALL' ? 'Mostra tutti i calciatori insieme' : `Filtra per ${opt.role}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${opt.dotColor}`} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* INVENDUTI & RICERCA GLOBALE */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnlySkipped(!showOnlySkipped)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all active:scale-95 ${
              showOnlySkipped
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md ring-1 ring-amber-300'
                : 'bg-slate-950 border-slate-800 text-amber-300 hover:bg-slate-800'
            }`}
            title="Visualizza tutti i calciatori invenduti ordinati dal migliore al peggiore"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Invenduti ({skippedCount})</span>
          </button>

          <div className="relative w-44 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca calciatore (tutti i ruoli)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg pl-7 pr-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* PANNELLO RISULTATI RICERCA INGRANDITO E A TUTTI I RUOLI */}
      {searchTerm.trim() && (
        <div className="bg-slate-900/95 backdrop-blur-md border-2 border-emerald-500/80 rounded-2xl p-3.5 shadow-2xl space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="text-xs sm:text-sm font-black text-white">
                Risultati Ricerca: <span className="text-emerald-400">{searchResults.length}</span> calciatori trovati per "{searchTerm}" (TUTTI I RUOLI)
              </span>
            </div>
            <button 
              onClick={() => setSearchTerm('')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
            >
              ✕ Chiudi
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm italic">
              Nessun calciatore trovato per "{searchTerm}". Prova con un'altra parola chiave o club.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {searchResults.map(p => {
                const isSelected = activePlayer?.id === p.id;
                const assignedTeam = p.assignedTo ? teams.find(t => t.id === p.assignedTo) : null;
                const isGoodForMod = p.ruolo === 'D' && ((p.mv ?? 0) >= 6.0 || (p.threeYearAvg && p.threeYearAvg.mv >= 6.0));
                const isStarter = isTitolarissimo(p);

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActivePlayer(p);
                      setSearchTerm('');
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all hover:border-emerald-500 select-none flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:bg-slate-850 shadow'
                    }`}
                  >
                    {/* RIGA 1: RUOLO + NOME IN GRANDE + SQUADRA */}
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center border shadow-sm flex-shrink-0 ${roleColors[p.ruolo] || 'bg-slate-800 text-white'}`}>
                          {p.ruolo}
                        </span>
                        <div className="truncate">
                          <span className="font-black text-sm text-white uppercase block truncate">
                            {p.nome}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {p.squadra}
                          </span>
                        </div>
                      </div>

                      {p.isPrimoAnnoA && p.squadraPrecedente && (
                        <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950 border border-cyan-800 px-1 py-0.5 rounded font-bold truncate max-w-[100px]" title={`Ex: ${p.squadraPrecedente}`}>
                          Ex {p.squadraPrecedente.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    {/* RIGA 2: STATISTICHE CHIAVE BEN VISIBILI (FVM, MV, MV ULTIMO ANNO INGRANDITI) */}
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 flex-wrap gap-1">
                      <span>Qt: <strong className="text-white text-xs sm:text-sm font-black">{p.quotazione}</strong></span>
                      <span>FVM: <strong className="text-amber-400 text-sm sm:text-base font-black">{p.fvm}</strong></span>
                      <span>MV: <strong className={(p.seasons?.['2026/27']?.mv ?? p.mv ?? 0) >= 6.0 ? 'text-emerald-400 font-black text-sm sm:text-base' : 'text-slate-200 text-sm sm:text-base font-black'}>{p.seasons?.['2026/27']?.mv ? p.seasons['2026/27'].mv.toFixed(2) : '-'}</strong></span>
                      <span title="Media Voto Ultimo Anno (2025/26)">MV '26: <strong className={(p.seasons?.['2025/26']?.mv ?? p.mv ?? 0) >= 6.0 ? 'text-cyan-300 font-black text-sm sm:text-base' : 'text-slate-300 text-sm sm:text-base font-black'}>{p.seasons?.['2025/26']?.mv ? p.seasons['2025/26'].mv.toFixed(2) : (p.mv ? p.mv.toFixed(2) : '-')}</strong></span>
                      <span>FM: <strong className={(p.fm ?? 0) >= 7.0 ? 'text-indigo-300 font-bold' : 'text-slate-200 font-bold'}>{p.fm ? p.fm.toFixed(2) : '-'}</strong></span>
                    </div>

                    {/* RIGA 3: BADGES E STATO ASSEGNAZIONE */}
                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <div className="flex items-center gap-1">
                        {p.isPrimoAnnoA && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-black">
                            1° A
                          </span>
                        )}
                        {p.isTq && (
                          <span className="px-1.5 py-0.2 rounded bg-fuchsia-600 text-white font-black">
                            TQ
                          </span>
                        )}
                        {isStarter && (
                          <span 
                            className="px-1.5 py-0.2 rounded bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950 font-black"
                            title={p.seasons?.['2026/27']?.titolaritaDettaglio || "Titolarissimo (almeno 3/4 o 4/5 gare da titolare)"}
                          >
                            T
                          </span>
                        )}
                        {isGoodForMod && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500 font-black">
                            MOD
                          </span>
                        )}
                        {p.rigorista && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white font-black" title="Rigorista">
                            R
                          </span>
                        )}
                      </div>

                      {p.status === 'assigned' ? (
                        <span className="text-emerald-400 font-bold font-mono">
                          Preso: {p.price} ({assignedTeam?.name?.slice(0, 7)})
                        </span>
                      ) : p.status === 'skipped' ? (
                        <span className="text-amber-400 font-bold font-mono">
                          Invenduto
                        </span>
                      ) : (
                        <span className="text-slate-500 font-bold font-mono">
                          Libero
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* POPUP INVENDUTI */}
      {showOnlySkipped && !searchTerm.trim() && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-2xl max-h-60 overflow-y-auto">
          <div className="text-xs font-black uppercase text-slate-400 mb-2 flex items-center justify-between">
            <span>Invenduti per Chiamata Libera ({skippedPlayers.length})</span>
            <button 
              onClick={() => setShowOnlySkipped(false)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕ Chiudi
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {skippedPlayers.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePlayer(p);
                  setShowOnlySkipped(false);
                }}
                className={`p-2 rounded-xl text-left border text-xs truncate transition-all ${
                  activePlayer?.id === p.id 
                    ? 'bg-slate-800 border-emerald-500 text-white' 
                    : 'bg-slate-950 border-slate-850 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1 truncate">
                  <span className={`w-3.5 h-3.5 rounded text-[9px] font-black flex items-center justify-center flex-shrink-0 ${roleColors[p.ruolo] || 'bg-slate-800'}`}>
                    {p.ruolo}
                  </span>
                  <span className="font-bold uppercase truncate">{p.nome}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono block mt-0.5">
                  {p.squadra} • Qt {p.quotazione} • <span className="text-amber-400 font-black text-xs sm:text-sm">FVM {p.fvm}</span> • <span className="text-emerald-400 font-black text-xs sm:text-sm">MV {p.seasons?.['2026/27']?.mv ? p.seasons['2026/27'].mv.toFixed(2) : (p.mv ? p.mv.toFixed(2) : '-')}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CORPO PRINCIPALE A 2 COLONNE AFFIANCATE:
          SINISTRA (col-span-9): NOME/STATISTICHE + PREZZO/8 SQUADRE IN 1 RIGA
      {/* CORPO PRINCIPALE A 2 COLONNE AFFIANCATE */}
      <div className="grid grid-cols-12 gap-2 items-stretch">
        
        {/* COLONNA SINISTRA: SCHEDA (MAX 3 RIGHE) + FAST BIDDING */}
        <div className="col-span-9 space-y-1.5 flex flex-col justify-start">
          <StatsCard player={activePlayer} />
          <FastBiddingPanel player={activePlayer} />
        </div>

        {/* COLONNA DESTRA: CAMPO DA CALCIO TATTICO ALLUNGATO PER RIEMPIRE LO SPAZIO */}
        <div className="col-span-3 flex flex-col justify-stretch h-full">
          <TacticalPitch player={activePlayer} className="h-full" />
        </div>

      </div>

      {/* RIGA INFERIORE A TUTTA LARGHEZZA: SEZIONE PROSSIMI ARRIVI FINO ALLA FINE DELLO SCHERMO A DESTRA */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-1.5 sm:p-2 shadow-md">
        {/* HEADER DELLA SEZIONE PROSSIMI ARRIVI A TUTTA LARGHEZZA */}
        <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-black uppercase text-white tracking-wide">
            {showOnlySkipped ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">Calciatori Invenduti ({sortedSkippedPlayers.length})</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Prossimi Arrivi in Asta</span>
                <span className="text-[10px] text-slate-400 font-mono">({upcomingPlayers.length} in coda)</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* BOTTONI DI ORDINAMENTO PER GLI INVENDUTI */}
            {showOnlySkipped && (
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="text-slate-400 text-[9px] uppercase font-mono">Ordina:</span>
                {[
                  { id: 'fvm', label: '⭐ FVM' },
                  { id: 'titolarita', label: '🛡️ Titolari' },
                  { id: 'quotazione', label: '📈 Qt' },
                  { id: 'alpha', label: '🔤 A-Z' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSkippedSortMode(tab.id as any)}
                    className={`px-1.5 py-0.5 rounded transition-all whitespace-nowrap active:scale-95 ${
                      skippedSortMode === tab.id
                        ? 'bg-amber-500 text-slate-950 font-black shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            <span className="text-[10px] text-slate-400 font-mono">
              {showOnlySkipped ? 'Migliori → Peggiori' : (currentRole === 'ALL' ? 'Tutti A-Z' : `${currentRole} A-Z`)}
            </span>
          </div>
        </div>

        {/* GRIGLIA CARTE PROSSIMI ARRIVI (2 CARTE AFFIANCATE A TUTTA LARGHEZZA) */}
        <div className="grid grid-cols-2 gap-2">
          {(showOnlySkipped ? sortedSkippedPlayers.slice(0, 2) : upcomingPlayers.slice(0, 2)).length === 0 ? (
            <div className="col-span-2 text-center py-3 text-xs text-slate-500 italic bg-slate-950/60 rounded-lg border border-slate-850">
              {showOnlySkipped ? 'Nessun calciatore invenduto finora!' : 'Giro completato per questo reparto!'}
            </div>
          ) : (
            (showOnlySkipped ? sortedSkippedPlayers.slice(0, 2) : upcomingPlayers.slice(0, 2)).map((p, idx) => {
              const isSelected = activePlayer?.id === p.id;
              const isGoodForMod = p.ruolo === 'D' && ((p.mv ?? 0) >= 6.0 || (p.threeYearAvg && p.threeYearAvg.mv >= 6.0));
              const isStarter = isTitolarissimo(p);
              const redazioneComment = FANTAGAZZETTA_ADVICE[p.nome.toUpperCase()]?.commentoRedazione;

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
                      onClick={() => setActivePlayer(p)}
                    >
                      <span className="text-xs font-mono text-slate-500 font-black flex-shrink-0">
                        #{idx + 1}
                      </span>
                      {currentRole === 'ALL' && (
                        <span className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center flex-shrink-0 ${roleColors[p.ruolo] || 'bg-slate-800'}`}>
                          {p.ruolo}
                        </span>
                      )}
                      <span className="font-black text-xs sm:text-sm text-white group-hover:text-emerald-300 uppercase truncate">
                        {p.nome}
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded font-bold truncate flex-shrink-0">
                        {p.squadra}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {p.isTq && (
                        <span className="px-1.5 py-0.2 rounded bg-fuchsia-600 text-white text-[9px] font-black">
                          TQ
                        </span>
                      )}
                      {isStarter && (
                        <span 
                          className="px-1.5 py-0.2 rounded bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950 text-[9px] font-black"
                          title={p.seasons?.['2026/27']?.titolaritaDettaglio || "Titolarissimo (almeno 3/4 o 4/5 gare da titolare)"}
                        >
                          T
                        </span>
                      )}
                      {p.rigorista ? (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[9px] font-black">
                          R
                        </span>
                      ) : null}
                      {isGoodForMod && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-500/25 text-emerald-900 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500 text-[9px] font-black shadow">
                          MOD
                        </span>
                      )}
                      {p.seasons?.['2026/27']?.titolaritaDettaglio && (
                        <span 
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black truncate max-w-[110px] shadow-sm ${
                            p.seasons['2026/27'].motivoTitolarita === 'titolare_rotto'
                              ? 'bg-orange-500 text-slate-950 font-black'
                              : p.seasons['2026/27'].motivoTitolarita === 'fine_mercato'
                              ? 'bg-cyan-500 text-slate-950 font-black'
                              : p.seasons['2026/27'].motivoTitolarita === 'infortunato'
                              ? 'bg-red-600 text-white font-black'
                              : 'bg-emerald-100 dark:bg-emerald-500/25 text-emerald-900 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500/40 font-black'
                          }`}
                          title={p.seasons['2026/27'].titolaritaDettaglio}
                        >
                          {p.seasons['2026/27'].titolaritaDettaglio}
                        </span>
                      )}
                      <button
                        onClick={() => setActivePlayer(p)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white text-[10px] font-black flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                        title="Chiama subito all'asta"
                      >
                        <Gavel className="w-3 h-3" />
                        <span>Chiama</span>
                      </button>
                    </div>
                  </div>

                  {/* RIGA 2: STATISTICHE (Qt, FVM, MV, MV '26, FM, Gol/GS, Ass) INGRANDITI */}
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-850 flex-wrap gap-1">
                    <span>Qt: <strong className="text-white text-xs sm:text-sm font-bold">{p.quotazione}</strong></span>
                    <span>FVM: <strong className="text-amber-400 text-sm sm:text-base font-black">{p.fvm}</strong></span>
                    <span>MV: <strong className={(p.seasons?.['2026/27']?.mv ?? p.mv ?? 0) >= 6.0 ? 'text-emerald-400 font-black text-sm sm:text-base' : 'text-slate-200 text-sm sm:text-base font-black'}>{p.seasons?.['2026/27']?.mv ? p.seasons['2026/27'].mv.toFixed(2) : '-'}</strong></span>
                    <span title="Media Voto Ultimo Anno (2025/26)">MV '26: <strong className={(p.seasons?.['2025/26']?.mv ?? p.mv ?? 0) >= 6.0 ? 'text-cyan-300 font-black text-sm sm:text-base' : 'text-slate-300 text-sm sm:text-base font-black'}>{p.seasons?.['2025/26']?.mv ? p.seasons['2025/26'].mv.toFixed(2) : (p.mv ? p.mv.toFixed(2) : '-')}</strong></span>
                    <span>FM: <strong className={(p.fm ?? 0) >= 7.0 ? 'text-indigo-300 font-bold' : 'text-slate-200'}>{p.fm ? p.fm.toFixed(2) : '-'}</strong></span>
                    <span>{p.ruolo === 'P' ? 'GS' : 'Gol'}: <strong className="text-white font-bold">{p.ruolo === 'P' ? (p.gs ?? 0) : (p.gf ?? 0)}</strong></span>
                    <span>Ass: <strong className="text-slate-200">{p.assist ?? 0}</strong></span>
                  </div>

                  {/* RIGA 3: NOTE PERSONALI & COMMENTI */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <Edit3 className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder={redazioneComment ? `Commento: ${redazioneComment}` : "Nota / Commento (es. max 18, scommessa, titolare)..."}
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

    </div>
  );
};
