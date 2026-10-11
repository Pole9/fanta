import React, { useState, useMemo, useEffect } from 'react';
import { SerieAMatch, SyncedOnlineData, cleanPlayerName, matchSyncedPlayer } from '../data/matchdayData';
import { getTeamTactics, TacticalSlot, getPlayerSlotId } from '../data/teamTactics';
import { INJURY_DATABASE, getInjuryInfo } from '../data/injuryData';
import { Player, Role } from '../types';
import { 
  X, 
  Shield, 
  Users, 
  Star, 
  ArrowRightLeft, 
  Sparkles, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight,
  Info
} from 'lucide-react';

export interface ProbablePlayerSlot {
  slot: TacticalSlot;
  player: {
    id?: number;
    nome: string;
    ruolo: Role;
    squadra: string;
    quotazione?: number;
    titolaritaPercent: number;
    status: 'titolare' | 'ballottaggio' | 'panchina' | 'infortunato';
    ballottaggioCon?: string | null;
    ballottaggioPerc?: number | null;
    isMyPlayer: boolean;
    rigorista?: boolean | number;
    injuryInfo?: string | null;
  };
}

interface ProbableLineupsModalProps {
  match: SerieAMatch;
  onClose: () => void;
  allPlayers: Player[];
  syncedOnlineData: SyncedOnlineData | null;
  myTeamPlayerIds: Set<number>;
  isLight: boolean;
}

export const ProbableLineupsModal: React.FC<ProbableLineupsModalProps> = ({
  match,
  onClose,
  allPlayers,
  syncedOnlineData,
  myTeamPlayerIds,
  isLight
}) => {
  // Switch tra Squadra Casa e Squadra Trasferta per visualizzazione campo tattico
  const [selectedTeamTab, setSelectedTeamTab] = useState<'home' | 'away'>('home');
  // Switch tra Vista Campo Tattico e Vista Elenco Completo
  const [viewMode, setViewMode] = useState<'pitch' | 'list'>('pitch');

  // Gestione tasto indietro (popstate) per chiudere il modal
  useEffect(() => {
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  // Tattiche e schemi ufficiali per entrambe le squadre
  const homeTactics = useMemo(() => getTeamTactics(match.homeTeam), [match.homeTeam]);
  const awayTactics = useMemo(() => getTeamTactics(match.awayTeam), [match.awayTeam]);

  // Helper per calcolare probabili formazioni per una squadra
  const computeTeamLineup = (teamName: string, tactics: ReturnType<typeof getTeamTactics>) => {
    const teamNorm = teamName.toUpperCase().trim();
    // Giocatori della squadra
    const teamSquad = allPlayers.filter(p => {
      const pSquadNorm = p.squadra.toUpperCase().trim();
      return pSquadNorm === teamNorm || pSquadNorm.includes(teamNorm) || teamNorm.includes(pSquadNorm);
    });

    // Mappatura titolarità da SyncedOnlineData e Injury Database
    const enrichedPlayers = teamSquad.map(p => {
      const isMyPlayer = myTeamPlayerIds.has(p.id);
      const injury = getInjuryInfo(p.nome, p.squadra);
      const synced = syncedOnlineData ? matchSyncedPlayer(p.nome, syncedOnlineData.players, p.squadra) : null;

      let titolaritaPercent = 40;
      let status: 'titolare' | 'ballottaggio' | 'panchina' | 'infortunato' = 'panchina';
      let ballottaggioCon: string | null = null;
      let ballottaggioPerc: number | null = null;

      if (injury) {
        status = 'infortunato';
        titolaritaPercent = 0;
      } else if (synced) {
        titolaritaPercent = synced.titolaritaPercent;
        status = synced.status === 'infortunato' ? 'infortunato' : synced.titolaritaPercent >= 70 ? 'titolare' : synced.titolaritaPercent >= 45 ? 'ballottaggio' : 'panchina';
        ballottaggioCon = synced.ballottaggioCon || null;
      } else {
        // Fallback per giocatori con alta quotazione/ruolo
        if (p.quotazione >= 15) {
          titolaritaPercent = 85;
          status = 'titolare';
        } else if (p.quotazione >= 8) {
          titolaritaPercent = 65;
          status = 'ballottaggio';
        }
      }

      // Controllo ballottaggi diretti
      if (syncedOnlineData?.ballottaggi) {
        const cleanP = cleanPlayerName(p.nome);
        for (const b of syncedOnlineData.ballottaggi) {
          const c1 = cleanPlayerName(b.p1);
          const c2 = cleanPlayerName(b.p2);
          if (c1 === cleanP || cleanP.includes(c1) || c1.includes(cleanP)) {
            ballottaggioCon = b.p2;
            ballottaggioPerc = b.perc2;
            titolaritaPercent = b.perc1;
            status = 'ballottaggio';
            break;
          } else if (c2 === cleanP || cleanP.includes(c2) || c2.includes(cleanP)) {
            ballottaggioCon = b.p1;
            ballottaggioPerc = b.perc1;
            titolaritaPercent = b.perc2;
            status = 'ballottaggio';
            break;
          }
        }
      }

      const assignedSlotId = getPlayerSlotId(p.nome, p.squadra, p.ruolo, p.ruoloMantra, p.isTq);

      return {
        ...p,
        titolaritaPercent,
        status,
        ballottaggioCon,
        ballottaggioPerc,
        isMyPlayer,
        injuryInfo: injury ? `${injury.infortunio} (${injury.rientroPrevisto})` : null,
        assignedSlotId
      };
    });

    // Seleziona gli 11 titolari distribuendoli nei rispettivi slot tattici
    const remainingSlots = [...tactics.slots];
    const startersList: ProbablePlayerSlot[] = [];
    const usedPlayerIds = new Set<number>();

    // 1. Assegna slot prioritari esatti (P, D, C, A) per titolari confermati
    for (const slot of remainingSlots) {
      // Cerca il miglior giocatore disponibile per questo slot
      const candidates = enrichedPlayers.filter(p => 
        !usedPlayerIds.has(p.id) && 
        p.status !== 'infortunato' && 
        (p.assignedSlotId === slot.id || p.ruolo === slot.classicRole)
      ).sort((a, b) => {
        // Preferisci match esatto slot
        const aExact = a.assignedSlotId === slot.id ? 1 : 0;
        const bExact = b.assignedSlotId === slot.id ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        return b.titolaritaPercent - a.titolaritaPercent;
      });

      if (candidates.length > 0) {
        const chosen = candidates[0];
        usedPlayerIds.add(chosen.id);
        startersList.push({
          slot,
          player: chosen
        });
      }
    }

    // Riserve / Panchina
    const benchList = enrichedPlayers.filter(p => !usedPlayerIds.has(p.id));

    return {
      teamName,
      tactics,
      starters: startersList,
      bench: benchList,
      myPlayers: enrichedPlayers.filter(p => p.isMyPlayer)
    };
  };

  const homeLineup = useMemo(() => computeTeamLineup(match.homeTeam, homeTactics), [match.homeTeam, homeTactics, allPlayers, syncedOnlineData, myTeamPlayerIds]);
  const awayLineup = useMemo(() => computeTeamLineup(match.awayTeam, awayTactics), [match.awayTeam, awayTactics, allPlayers, syncedOnlineData, myTeamPlayerIds]);

  const activeLineup = selectedTeamTab === 'home' ? homeLineup : awayLineup;
  const allMyPlayersInMatch = [...homeLineup.myPlayers, ...awayLineup.myPlayers];

  // Helper stile ruoli
  const getRoleBg = (role: Role) => {
    switch (role) {
      case 'P': return 'bg-amber-400 text-slate-950 font-black';
      case 'D': return 'bg-emerald-600 text-white font-black';
      case 'C': return 'bg-blue-600 text-white font-black';
      case 'A': return 'bg-rose-600 text-white font-black';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto transition-colors ${
          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className={`p-3 sm:p-4 border-b flex flex-col gap-2.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                PROBABILI FORMAZIONI
              </span>
              <span className={`text-[11px] font-mono font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Gazzetta dello Sport • Fantacalcio.it
              </span>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-all ${
                isLight 
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Chiudi (oppure premi Indietro)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* TITOLO PARTITA: SQUADRA CASA VS SQUADRA TRASFERTA */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base sm:text-xl font-black uppercase tracking-wide flex items-center gap-2">
                <span className={selectedTeamTab === 'home' ? 'text-amber-500' : ''}>{match.homeTeam}</span>
                <span className="text-xs text-slate-400 font-normal">vs</span>
                <span className={selectedTeamTab === 'away' ? 'text-amber-500' : ''}>{match.awayTeam}</span>
              </h2>
              <div className={`flex items-center gap-3 text-xs font-mono mt-0.5 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{match.date} {match.time}</span>
                </span>
                <span className="flex items-center gap-1 hidden sm:inline-flex">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{match.stadium}</span>
                </span>
              </div>
            </div>

            {/* SELETTORE VISTA CAMPO / ELENCO */}
            <div className={`flex items-center p-0.5 rounded-lg border text-xs font-bold ${
              isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'
            }`}>
              <button
                onClick={() => setViewMode('pitch')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'pitch'
                    ? (isLight ? 'bg-white text-slate-950 shadow-sm font-black' : 'bg-slate-800 text-amber-400 shadow-sm font-black')
                    : (isLight ? 'text-slate-600' : 'text-slate-400')
                }`}
              >
                Campo Tattico
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'list'
                    ? (isLight ? 'bg-white text-slate-950 shadow-sm font-black' : 'bg-slate-800 text-amber-400 shadow-sm font-black')
                    : (isLight ? 'text-slate-600' : 'text-slate-400')
                }`}
              >
                Lista & Ballottaggi
              </button>
            </div>
          </div>

          {/* BANNER GIOCATORI DELLA PROPRIA ROSA PRESENTI NEL MATCH */}
          <div className={`px-3 py-1.5 rounded-xl border flex items-center justify-between text-xs gap-2 flex-wrap ${
            allMyPlayersInMatch.length > 0
              ? (isLight ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' : 'bg-amber-950/40 border-amber-500/50 text-amber-300 font-bold')
              : (isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400')
          }`}>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500 flex-shrink-0" />
              <span>
                {allMyPlayersInMatch.length > 0 ? (
                  <>
                    <span>I tuoi giocatori in questo match ({allMyPlayersInMatch.length}): </span>
                    <strong className="underline decoration-amber-400">
                      {allMyPlayersInMatch.map(p => `${p.nome} (${p.squadra})`).join(', ')}
                    </strong>
                  </>
                ) : (
                  <span>Nessun calciatore della tua rosa schierabile in questa partita.</span>
                )}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-mono opacity-80">
              Evidenziati in oro ⭐
            </span>
          </div>

          {/* TAB SELETTORE SQUADRA CASA / TRASFERTA */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setSelectedTeamTab('home')}
              className={`p-2 rounded-xl border text-left transition-all ${
                selectedTeamTab === 'home'
                  ? (isLight ? 'bg-white border-blue-600 ring-2 ring-blue-500 text-slate-950 shadow-md font-black' : 'bg-slate-850 border-amber-400 ring-2 ring-amber-400 text-white shadow-md font-black')
                  : (isLight ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850')
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black">{match.homeTeam} (Casa)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/20 text-emerald-400 font-bold">
                  {homeTactics.formation}
                </span>
              </div>
              <span className="text-[10px] block opacity-80 mt-0.5 font-mono">
                All. {homeTactics.coach}
              </span>
            </button>

            <button
              onClick={() => setSelectedTeamTab('away')}
              className={`p-2 rounded-xl border text-left transition-all ${
                selectedTeamTab === 'away'
                  ? (isLight ? 'bg-white border-blue-600 ring-2 ring-blue-500 text-slate-950 shadow-md font-black' : 'bg-slate-850 border-amber-400 ring-2 ring-amber-400 text-white shadow-md font-black')
                  : (isLight ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850')
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black">{match.awayTeam} (Fuori)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-blue-500/20 text-blue-400 font-bold">
                  {awayTactics.formation}
                </span>
              </div>
              <span className="text-[10px] block opacity-80 mt-0.5 font-mono">
                All. {awayTactics.coach}
              </span>
            </button>
          </div>
        </div>

        {/* CORPO CONTENUTO: CAMPO TATTICO O LISTA COMPLETA */}
        <div className="flex-1 p-3 overflow-y-auto min-h-0">
          {viewMode === 'pitch' ? (
            /* VISTA 1: CAMPO DA CALCIO CON DISPOSIZIONE TATTICA GAZZETTA */
            <div className="space-y-3">
              <div className={`relative rounded-2xl border-2 shadow-2xl overflow-hidden min-h-[460px] sm:min-h-[500px] w-full select-none ${
                isLight 
                  ? 'bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 border-emerald-500' 
                  : 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 border-emerald-600/50'
              }`}>
                {/* LINEE DEL CAMPO DA CALCIO */}
                <div className={`absolute inset-2 border rounded-xl pointer-events-none ${isLight ? 'border-white/50' : 'border-white/20'}`} />
                <div className={`absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 pointer-events-none ${isLight ? 'bg-white/50' : 'bg-white/20'}`} />
                <div className={`absolute top-1/2 left-1/2 w-28 h-28 border rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none ${isLight ? 'border-white/50' : 'border-white/20'}`} />
                <div className={`absolute top-0 left-1/2 w-44 h-16 border-b border-x -translate-x-1/2 pointer-events-none ${isLight ? 'border-white/50' : 'border-white/20'}`} />
                <div className={`absolute bottom-0 left-1/2 w-48 h-20 border-t border-x -translate-x-1/2 pointer-events-none ${isLight ? 'border-white/50' : 'border-white/20'}`} />

                {/* 11 TITOLARI SCHIERATI NELLE POSIZIONI GAZZETTA */}
                {activeLineup.starters.map(({ slot, player }) => {
                  return (
                    <div
                      key={slot.id}
                      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                      <div className={`rounded-xl p-1.5 sm:p-2 border transition-all flex flex-col items-center shadow-xl min-w-[84px] sm:min-w-[105px] max-w-[115px] ${
                        player.isMyPlayer
                          ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-950/80 scale-105 shadow-amber-500/20'
                          : isLight
                            ? 'bg-white/95 text-slate-950 border-slate-300 shadow-md'
                            : 'bg-slate-950/95 text-white border-slate-800'
                      }`}>
                        {/* Indicatore "Tuo Giocatore" */}
                        {player.isMyPlayer && (
                          <div className="w-full text-center mb-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[8px] uppercase tracking-wider inline-flex items-center gap-0.5 shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-slate-950" />
                              <span>IN ROSA</span>
                            </span>
                          </div>
                        )}

                        {/* Ruolo + Nome Calciatore */}
                        <div className="flex items-center gap-1 w-full justify-center">
                          <span className={`w-4 h-4 rounded text-[9px] font-black inline-flex items-center justify-center shadow-sm ${getRoleBg(player.ruolo)}`}>
                            {player.ruolo}
                          </span>
                          <span className={`font-black text-[11px] sm:text-xs truncate max-w-[65px] sm:max-w-[75px] uppercase ${
                            player.isMyPlayer
                              ? 'text-amber-300 font-black'
                              : isLight ? 'text-slate-950' : 'text-white'
                          }`}>
                            {player.nome}
                          </span>
                        </div>

                        {/* Titolarità Gazzetta % e Ballottaggio */}
                        <div className="flex items-center gap-1 mt-1 text-[9px] font-mono font-bold">
                          <span className={`px-1 py-0.2 rounded border ${
                            player.titolaritaPercent >= 80 
                              ? (isLight ? 'bg-emerald-100 text-emerald-950 border-emerald-400' : 'bg-emerald-950 text-emerald-300 border-emerald-500/40')
                              : (isLight ? 'bg-amber-100 text-amber-950 border-amber-400' : 'bg-amber-950 text-amber-300 border-amber-500/40')
                          }`}>
                            {player.titolaritaPercent}%
                          </span>
                          <span className={isLight ? 'text-slate-600 font-bold' : 'text-slate-400'}>
                            {slot.code}
                          </span>
                        </div>

                        {/* Ballottaggio specifico */}
                        {player.ballottaggioCon && (
                          <div className={`text-[8px] font-bold mt-0.5 truncate max-w-[90px] ${
                            isLight ? 'text-amber-800' : 'text-amber-400'
                          }`} title={`Ballottaggio con ${player.ballottaggioCon}`}>
                            ⚔️ vs {player.ballottaggioCon.slice(0, 6)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PANCHINA PROBABILE SOTTO IL CAMPO */}
              <div className={`p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <h4 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>🪑</span>
                  <span>Panchina & Ballottaggi {activeLineup.teamName} ({activeLineup.bench.length})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeLineup.bench.map(bp => (
                    <div 
                      key={bp.id} 
                      className={`px-2 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                        bp.isMyPlayer 
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-black ring-1 ring-amber-400' 
                          : isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded text-[8px] font-black inline-flex items-center justify-center ${getRoleBg(bp.ruolo)}`}>
                        {bp.ruolo}
                      </span>
                      <span className="font-bold">{bp.nome}</span>
                      <span className={`text-[10px] font-mono px-1 rounded ${
                        bp.status === 'infortunato' ? 'bg-rose-950 text-rose-300 font-bold' : 'text-slate-400'
                      }`}>
                        {bp.status === 'infortunato' ? 'Infort.' : `${bp.titolaritaPercent}%`}
                      </span>
                      {bp.isMyPlayer && <Star className="w-3 h-3 fill-amber-400 text-amber-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* VISTA 2: LISTA COMPLETA AFFIANCATA ENTRAMBE LE SQUADRE */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Squadra Casa */}
              <div className={`p-3 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase">{match.homeTeam} ({homeTactics.formation})</h4>
                  <span className="text-[10px] font-mono text-slate-400">All. {homeTactics.coach}</span>
                </div>
                <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                  {homeLineup.starters.map(({ slot, player }) => (
                    <div 
                      key={slot.id} 
                      className={`p-1.5 rounded-lg border text-xs flex items-center justify-between ${
                        player.isMyPlayer 
                          ? 'bg-amber-400/20 border-amber-400 font-black ring-1 ring-amber-400' 
                          : isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded text-[9px] font-black inline-flex items-center justify-center ${getRoleBg(player.ruolo)}`}>
                          {player.ruolo}
                        </span>
                        <span className="font-bold">{player.nome}</span>
                        {player.isMyPlayer && <span className="text-[9px] px-1 rounded bg-amber-400 text-slate-950 font-black">IN ROSA</span>}
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="font-black text-emerald-500">{player.titolaritaPercent}%</span>
                        <span className="text-slate-400 text-[10px]">{slot.code}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Squadra Trasferta */}
              <div className={`p-3 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase">{match.awayTeam} ({awayTactics.formation})</h4>
                  <span className="text-[10px] font-mono text-slate-400">All. {awayTactics.coach}</span>
                </div>
                <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                  {awayLineup.starters.map(({ slot, player }) => (
                    <div 
                      key={slot.id} 
                      className={`p-1.5 rounded-lg border text-xs flex items-center justify-between ${
                        player.isMyPlayer 
                          ? 'bg-amber-400/20 border-amber-400 font-black ring-1 ring-amber-400' 
                          : isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded text-[9px] font-black inline-flex items-center justify-center ${getRoleBg(player.ruolo)}`}>
                          {player.ruolo}
                        </span>
                        <span className="font-bold">{player.nome}</span>
                        {player.isMyPlayer && <span className="text-[9px] px-1 rounded bg-amber-400 text-slate-950 font-black">IN ROSA</span>}
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="font-black text-blue-400">{player.titolaritaPercent}%</span>
                        <span className="text-slate-400 text-[10px]">{slot.code}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className={`p-3 border-t flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="text-[11px] font-mono text-slate-400">
            Fonte: Probabili Formazioni Gazzetta & Fantacalcio.it
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl font-black text-xs transition-colors ${
              isLight 
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-900' 
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
