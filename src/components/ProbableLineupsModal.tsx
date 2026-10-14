import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  SerieAMatch, 
  SyncedOnlineData, 
  cleanPlayerName, 
  matchSyncedPlayer, 
  MatchdayType,
  getPlayerMatchdayEvaluation 
} from '../data/matchdayData';
import { getTeamTactics, TacticalSlot, getPlayerSlotId } from '../data/teamTactics';
import { getInjuryInfo } from '../data/injuryData';
import { Player, Role } from '../types';
import { TedPlayerCard, calculateTedScore } from '../utils/tedLassoAdvisor';
import { PlayerDetailModal } from './PlayerDetailModal';
import { useAuction } from '../context/AuctionContext';
import { 
  X, 
  Star, 
  Calendar, 
  MapPin, 
  ChevronRight,
  ChevronLeft,
  Activity,
  Flame
} from 'lucide-react';

export type EnrichedProbablePlayer = Omit<Player, 'status'> & {
  rawPlayer: Player;
  titolaritaPercent: number;
  status: 'titolare' | 'ballottaggio' | 'panchina' | 'infortunato';
  ballottaggioCon: string | null;
  ballottaggioPerc: number | null;
  isMyPlayer: boolean;
  injuryInfo: string | null;
  assignedSlotId: string | null;
};

export interface ProbablePlayerSlot {
  slot: TacticalSlot;
  player: EnrichedProbablePlayer;
}

interface ProbableLineupsModalProps {
  match: SerieAMatch;
  fixtures?: SerieAMatch[];
  onClose: () => void;
  allPlayers: Player[];
  syncedOnlineData: SyncedOnlineData | null;
  myTeamPlayerIds: Set<number>;
  isLight: boolean;
  activeTab?: MatchdayType;
  roundTitle?: string;
  onMatchChange?: (match: SerieAMatch) => void;
}

export const ProbableLineupsModal: React.FC<ProbableLineupsModalProps> = ({
  match,
  fixtures = [],
  onClose,
  allPlayers,
  syncedOnlineData,
  myTeamPlayerIds,
  isLight,
  activeTab = 'current',
  roundTitle,
  onMatchChange
}) => {
  const { teams } = useAuction();

  // Gestione partita corrente tra quelle della giornata (swipe / frecce)
  const [currentMatchId, setCurrentMatchId] = useState<string>(match.id);

  useEffect(() => {
    setCurrentMatchId(match.id);
  }, [match.id]);

  const matchList = useMemo(() => {
    return fixtures.length > 0 ? fixtures : [match];
  }, [fixtures, match]);

  const currentMatch = useMemo(() => {
    return matchList.find(m => m.id === currentMatchId) || match;
  }, [matchList, currentMatchId, match]);

  const currentIndex = useMemo(() => {
    return matchList.findIndex(m => m.id === currentMatch.id);
  }, [matchList, currentMatch.id]);

  // Navigazione tra le partite della giornata
  const goToPrevMatch = useCallback(() => {
    if (matchList.length <= 1) return;
    const prevIdx = (currentIndex - 1 + matchList.length) % matchList.length;
    const prevMatch = matchList[prevIdx];
    setCurrentMatchId(prevMatch.id);
    onMatchChange?.(prevMatch);
  }, [matchList, currentIndex, onMatchChange]);

  const goToNextMatch = useCallback(() => {
    if (matchList.length <= 1) return;
    const nextIdx = (currentIndex + 1) % matchList.length;
    const nextMatch = matchList[nextIdx];
    setCurrentMatchId(nextMatch.id);
    onMatchChange?.(nextMatch);
  }, [matchList, currentIndex, onMatchChange]);

  // Switch tra Squadra Casa e Squadra Trasferta per visualizzazione campo tattico
  const [selectedTeamTab, setSelectedTeamTab] = useState<'home' | 'away'>('home');
  // Switch tra Vista Campo Tattico e Vista Elenco Completo
  const [viewMode, setViewMode] = useState<'pitch' | 'list'>('pitch');

  // Stato per scheda personale dettagliata del singolo calciatore (apribile per qualsiasi calciatore)
  const [selectedPlayerCard, setSelectedPlayerCard] = useState<TedPlayerCard | null>(null);
  const [selectedPlayerList, setSelectedPlayerList] = useState<TedPlayerCard[]>([]);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number>(0);

  // Gestione tasto indietro (popstate) per chiudere modali
  useEffect(() => {
    const handlePopState = () => {
      if (selectedPlayerCard) {
        setSelectedPlayerCard(null);
        return;
      }
      onClose();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedPlayerCard, onClose]);

  // Gestione tastiera desktop: ESC chiude, freccia sx/dx cambia partita (se la scheda giocatore non è aperta)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPlayerCard) return; // Se la scheda giocatore è aperta, le frecce servono a navigare tra i giocatori
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevMatch();
      } else if (e.key === 'ArrowRight') {
        goToNextMatch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlayerCard, onClose, goToPrevMatch, goToNextMatch]);

  // Gestione SWIPE laterale touch tra le partite della giornata
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Non gestire lo swipe partita se la scheda singolo giocatore è aperta
    if (selectedPlayerCard) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || selectedPlayerCard) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Riconoscimento swipe orizzontale netto: minimo 50px e prevalenza orizzontale
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        goToNextMatch();
      } else {
        goToPrevMatch();
      }
    }
  };

  // Tattiche e schemi ufficiali per entrambe le squadre del match corrente
  const homeTactics = useMemo(() => getTeamTactics(currentMatch.homeTeam), [currentMatch.homeTeam]);
  const awayTactics = useMemo(() => getTeamTactics(currentMatch.awayTeam), [currentMatch.awayTeam]);

  // Calcolo probabili formazioni per una squadra
  const computeTeamLineup = useCallback((teamName: string, tactics: ReturnType<typeof getTeamTactics>) => {
    const teamNorm = teamName.toUpperCase().trim();
    // Giocatori della squadra
    const teamSquad = allPlayers.filter(p => {
      const pSquadNorm = p.squadra.toUpperCase().trim();
      return pSquadNorm === teamNorm || pSquadNorm.includes(teamNorm) || teamNorm.includes(pSquadNorm);
    });

    // Mappatura titolarità da SyncedOnlineData e Injury Database
    const enrichedPlayers: EnrichedProbablePlayer[] = teamSquad.map(p => {
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
        rawPlayer: p,
        titolaritaPercent,
        status,
        ballottaggioCon,
        ballottaggioPerc,
        isMyPlayer,
        injuryInfo: injury ? `${injury.infortunio} (${injury.rientroPrevisto})` : null,
        assignedSlotId
      };
    });

    // Assegna gli 11 titolari
    const remainingSlots = [...tactics.slots];
    const startersList: ProbablePlayerSlot[] = [];
    const usedPlayerIds = new Set<number>();

    for (const slot of remainingSlots) {
      const candidates = enrichedPlayers.filter(p => 
        !usedPlayerIds.has(p.id) && 
        p.status !== 'infortunato' && 
        (p.assignedSlotId === slot.id || p.ruolo === slot.classicRole)
      ).sort((a, b) => {
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

    const benchList = enrichedPlayers.filter(p => !usedPlayerIds.has(p.id));

    return {
      teamName,
      tactics,
      starters: startersList,
      bench: benchList,
      myPlayers: enrichedPlayers.filter(p => p.isMyPlayer)
    };
  }, [allPlayers, syncedOnlineData, myTeamPlayerIds]);

  const homeLineup = useMemo(() => computeTeamLineup(currentMatch.homeTeam, homeTactics), [computeTeamLineup, currentMatch.homeTeam, homeTactics]);
  const awayLineup = useMemo(() => computeTeamLineup(currentMatch.awayTeam, awayTactics), [computeTeamLineup, currentMatch.awayTeam, awayTactics]);

  const activeLineup = selectedTeamTab === 'home' ? homeLineup : awayLineup;
  const allMyPlayersInMatch = [...homeLineup.myPlayers, ...awayLineup.myPlayers];

  // Apertura scheda statistica dettagliata per qualsiasi calciatore
  const openPlayerStats = useCallback((rawPlayer: Player) => {
    const evalData = getPlayerMatchdayEvaluation(
      rawPlayer.nome, 
      rawPlayer.squadra, 
      syncedOnlineData, 
      activeTab
    );
    const score = calculateTedScore(rawPlayer, evalData);
    const isStarter = activeLineup.starters.some(s => s.player.id === rawPlayer.id);

    // Costruisci lista di tutti i giocatori della partita per scorrere tra di loro
    const allEnrichedInMatch: EnrichedProbablePlayer[] = [
      ...homeLineup.starters.map(s => s.player),
      ...awayLineup.starters.map(s => s.player),
      ...homeLineup.bench,
      ...awayLineup.bench
    ];

    const allCards: TedPlayerCard[] = allEnrichedInMatch.map(p => {
      const e = getPlayerMatchdayEvaluation(p.nome, p.squadra, syncedOnlineData, activeTab);
      return {
        player: p.rawPlayer || p,
        evaluation: e,
        tedScore: calculateTedScore(p.rawPlayer || p, e),
        isStarter: homeLineup.starters.some(s => s.player.id === p.id) || awayLineup.starters.some(s => s.player.id === p.id)
      };
    });

    const targetCard: TedPlayerCard = {
      player: rawPlayer,
      evaluation: evalData,
      tedScore: score,
      isStarter
    };

    const targetIdx = allCards.findIndex(c => c.player.id === rawPlayer.id);
    setSelectedPlayerList(allCards);
    setSelectedPlayerIndex(targetIdx >= 0 ? targetIdx : 0);
    setSelectedPlayerCard(targetCard);

    window.history.pushState({ modal: 'probablePlayerReport', playerId: rawPlayer.id }, '');
  }, [syncedOnlineData, activeTab, activeLineup.starters, homeLineup, awayLineup]);

  const handlePrevPlayer = () => {
    if (selectedPlayerList.length === 0) return;
    const prevIdx = (selectedPlayerIndex - 1 + selectedPlayerList.length) % selectedPlayerList.length;
    setSelectedPlayerIndex(prevIdx);
    setSelectedPlayerCard(selectedPlayerList[prevIdx]);
  };

  const handleNextPlayer = () => {
    if (selectedPlayerList.length === 0) return;
    const nextIdx = (selectedPlayerIndex + 1) % selectedPlayerList.length;
    setSelectedPlayerIndex(nextIdx);
    setSelectedPlayerCard(selectedPlayerList[nextIdx]);
  };

  // Helper stile ruoli
  const getRoleBg = (role: Role) => {
    switch (role) {
      case 'P': return 'bg-amber-400 text-slate-950 font-black';
      case 'D': return 'bg-emerald-600 text-white font-black';
      case 'C': return 'bg-blue-600 text-white font-black';
      case 'A': return 'bg-rose-600 text-white font-black';
    }
  };

  const prevMatchItem = matchList.length > 1 ? matchList[(currentIndex - 1 + matchList.length) % matchList.length] : null;
  const nextMatchItem = matchList.length > 1 ? matchList[(currentIndex + 1) % matchList.length] : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[96vh] my-auto transition-colors ${
          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* HEADER MODAL */}
        <div className={`p-3 sm:p-4 border-b flex flex-col gap-2.5 flex-shrink-0 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/90 border-slate-800'
        }`}>
          {/* BARRA SUPERIORE CON CONTATORE PARTITA E TASTO CHIUDI */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>PROBABILI FORMAZIONI</span>
              </span>
              {roundTitle && (
                <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  isLight ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  {roundTitle}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* CONTATORE PARTITA */}
              {matchList.length > 1 && (
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                  isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  Gara {currentIndex + 1} di {matchList.length}
                </span>
              )}

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
          </div>

          {/* BARRA NAVIGAZIONE TRA PARTITE (PULSANTI FRECCIA E TITOLO MATCH) */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {/* TASTO PARTITA PRECEDENTE */}
            {prevMatchItem ? (
              <button
                onClick={goToPrevMatch}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1 transition-all active:scale-95 flex-shrink-0 ${
                  isLight 
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm' 
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
                title={`Partita precedente: ${prevMatchItem.homeTeam} vs ${prevMatchItem.awayTeam}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] truncate max-w-[100px]">{prevMatchItem.homeTeam.slice(0, 3)} - {prevMatchItem.awayTeam.slice(0, 3)}</span>
                <span className="sm:hidden text-[11px]">Prec.</span>
              </button>
            ) : <div className="w-8" />}

            {/* TITOLO PARTITA AL CENTRO */}
            <div className="text-center min-w-0 flex-1">
              <h2 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 truncate">
                <span className={selectedTeamTab === 'home' ? 'text-amber-500' : ''}>{currentMatch.homeTeam}</span>
                <span className="text-xs text-slate-400 font-normal">vs</span>
                <span className={selectedTeamTab === 'away' ? 'text-amber-500' : ''}>{currentMatch.awayTeam}</span>
              </h2>
              <div className={`flex items-center justify-center gap-3 text-xs font-mono mt-0.5 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentMatch.date} {currentMatch.time}</span>
                </span>
                <span className="flex items-center gap-1 hidden md:inline-flex">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{currentMatch.stadium}</span>
                </span>
              </div>
            </div>

            {/* TASTO PARTITA SUCCESSIVA */}
            {nextMatchItem ? (
              <button
                onClick={goToNextMatch}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1 transition-all active:scale-95 flex-shrink-0 ${
                  isLight 
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm' 
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
                title={`Partita successiva: ${nextMatchItem.homeTeam} vs ${nextMatchItem.awayTeam}`}
              >
                <span className="hidden sm:inline text-[11px] truncate max-w-[100px]">{nextMatchItem.homeTeam.slice(0, 3)} - {nextMatchItem.awayTeam.slice(0, 3)}</span>
                <span className="sm:hidden text-[11px]">Succ.</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : <div className="w-8" />}
          </div>

          {/* AVVISO SWIPE LATERALE & CLICK SU GIOCATORE */}
          <div className="flex items-center justify-between text-[11px] px-1 text-slate-400 font-mono">
            <span>👉 Swipe orizzontale per cambiare partita</span>
            <span className="text-amber-400 font-bold hidden sm:inline">👆 Tocca un calciatore per la scheda personale</span>
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

          {/* TAB SELETTORE SQUADRA CASA / TRASFERTA & VISTA CAMPO / LISTA */}
          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
            <div className="grid grid-cols-2 gap-2 flex-1 min-w-[240px]">
              <button
                onClick={() => setSelectedTeamTab('home')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  selectedTeamTab === 'home'
                    ? (isLight ? 'bg-white border-blue-600 ring-2 ring-blue-500 text-slate-950 shadow-md font-black' : 'bg-slate-850 border-amber-400 ring-2 ring-amber-400 text-white shadow-md font-black')
                    : (isLight ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850')
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black">{currentMatch.homeTeam} (Casa)</span>
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
                  <span className="text-xs uppercase font-black">{currentMatch.awayTeam} (Fuori)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-blue-500/20 text-blue-400 font-bold">
                    {awayTactics.formation}
                  </span>
                </div>
                <span className="text-[10px] block opacity-80 mt-0.5 font-mono">
                  All. {awayTactics.coach}
                </span>
              </button>
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

                {/* 11 TITOLARI SCHIERATI NELLE POSIZIONI GAZZETTA - CLICCABILI PER SCHEDA PERSONALE */}
                {activeLineup.starters.map(({ slot, player }) => {
                  return (
                    <div
                      key={slot.id}
                      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                      <div 
                        onClick={() => openPlayerStats(player.rawPlayer || player)}
                        className={`rounded-xl p-1.5 sm:p-2 border transition-all flex flex-col items-center shadow-xl min-w-[84px] sm:min-w-[105px] max-w-[115px] cursor-pointer hover:scale-105 active:scale-95 group ${
                          player.isMyPlayer
                            ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-950/85 scale-105 shadow-amber-500/20'
                            : isLight
                              ? 'bg-white/95 text-slate-950 border-slate-300 shadow-md hover:border-blue-500'
                              : 'bg-slate-950/95 text-white border-slate-800 hover:border-amber-400/60'
                        }`}
                        title={`Tocca per visualizzare la scheda personale e statistiche di ${player.nome}`}
                      >
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

                        {/* Titolarità Gazzetta % e Slot Tattico */}
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

                        {/* Micro icona indicatore scheda */}
                        <div className="mt-0.5 text-[8px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          📊 Scheda
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PANCHINA PROBABILE SOTTO IL CAMPO - CLICCABILE PER SCHEDA PERSONALE */}
              <div className={`p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span>🪑</span>
                    <span>Panchina & Ballottaggi {activeLineup.teamName} ({activeLineup.bench.length})</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Tocca per scheda statistica
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {activeLineup.bench.map(bp => (
                    <div 
                      key={bp.id} 
                      onClick={() => openPlayerStats(bp.rawPlayer || bp)}
                      className={`px-2 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        bp.isMyPlayer 
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-black ring-1 ring-amber-400' 
                          : isLight ? 'bg-white border-slate-300 text-slate-800 hover:border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                      title={`Tocca per visualizzare la scheda personale di ${bp.nome}`}
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
            /* VISTA 2: LISTA COMPLETA AFFIANCATA ENTRAMBE LE SQUADRE - CLICCABILI PER SCHEDA PERSONALE */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Squadra Casa */}
              <div className={`p-3 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase">{currentMatch.homeTeam} ({homeTactics.formation})</h4>
                  <span className="text-[10px] font-mono text-slate-400">All. {homeTactics.coach}</span>
                </div>
                <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                  {homeLineup.starters.map(({ slot, player }) => (
                    <div 
                      key={slot.id} 
                      onClick={() => openPlayerStats(player.rawPlayer || player)}
                      className={`p-1.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] active:scale-95 ${
                        player.isMyPlayer 
                          ? 'bg-amber-400/20 border-amber-400 font-black ring-1 ring-amber-400' 
                          : isLight ? 'bg-white border-slate-200 text-slate-900 hover:border-blue-400' : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                      }`}
                      title={`Tocca per aprire le statistiche di ${player.nome}`}
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
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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
                  <h4 className="text-xs font-black uppercase">{currentMatch.awayTeam} ({awayTactics.formation})</h4>
                  <span className="text-[10px] font-mono text-slate-400">All. {awayTactics.coach}</span>
                </div>
                <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                  {awayLineup.starters.map(({ slot, player }) => (
                    <div 
                      key={slot.id} 
                      onClick={() => openPlayerStats(player.rawPlayer || player)}
                      className={`p-1.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] active:scale-95 ${
                        player.isMyPlayer 
                          ? 'bg-amber-400/20 border-amber-400 font-black ring-1 ring-amber-400' 
                          : isLight ? 'bg-white border-slate-200 text-slate-900 hover:border-blue-400' : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                      }`}
                      title={`Tocca per aprire le statistiche di ${player.nome}`}
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
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className={`p-3 border-t flex items-center justify-between gap-2 flex-shrink-0 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 truncate">
            <span>Fonte: Probabili Formazioni Gazzetta & Fantacalcio.it</span>
          </div>

          <div className="flex items-center gap-2">
            {matchList.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrevMatch}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                    isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Partita precedente (Swipe Destra)"
                >
                  ← Prec
                </button>
                <button
                  onClick={goToNextMatch}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                    isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Partita successiva (Swipe Sinistra)"
                >
                  Succ →
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className={`px-4 py-1.5 rounded-xl font-black text-xs transition-colors shadow-sm ${
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

      {/* SCHEDA PERSONALE CALCIATORE (APRIBILE PER OGNI CALCIATORE DI SERIE A) */}
      {selectedPlayerCard && (
        <PlayerDetailModal
          card={selectedPlayerCard}
          onClose={() => setSelectedPlayerCard(null)}
          onPrevPlayer={handlePrevPlayer}
          onNextPlayer={handleNextPlayer}
          hasPrev={selectedPlayerList.length > 1}
          hasNext={selectedPlayerList.length > 1}
          isLight={isLight}
          matchdayNumber={currentMatch ? 7 : 7}
          isMyPlayer={myTeamPlayerIds.has(selectedPlayerCard.player.id)}
          teams={teams}
        />
      )}
    </div>
  );
};
