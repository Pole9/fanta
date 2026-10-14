import React, { useEffect, useMemo } from 'react';
import { TedPlayerCard, getTedPlayerVerdict } from '../utils/tedLassoAdvisor';
import { PlayerPerformanceChart } from './PlayerPerformanceChart';
import { getDiddiMatchdayYoutubeAdvice, getFantagazzettaConsigliatoStatus } from '../utils/matchdayAdviceProvider';
import { Role, Team, SeasonStats } from '../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Activity, 
  Calendar, 
  Shield, 
  TrendingUp, 
  Award, 
  MapPin, 
  Clock, 
  Flame, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Minimize2 
} from 'lucide-react';

export interface DesktopPlayerReportModalProps {
  card: TedPlayerCard;
  allCards: TedPlayerCard[];
  onClose: () => void;
  onSelectCard: (card: TedPlayerCard) => void;
  isLight?: boolean;
  roundTitle?: string;
  roundNumber?: number;
  teams?: Team[];
}

const ROLE_NAMES: Record<Role, string> = {
  P: 'Portiere',
  D: 'Difensore',
  C: 'Centrocampista',
  A: 'Attaccante'
};

export const DesktopPlayerReportModal: React.FC<DesktopPlayerReportModalProps> = ({
  card,
  allCards,
  onClose,
  onSelectCard,
  isLight = false,
  roundTitle = '7ª Giornata',
  roundNumber = 7,
  teams = []
}) => {
  const { player, evaluation, tedScore, isStarter, benchOrder } = card;
  const verdict = getTedPlayerVerdict(player, tedScore, evaluation);
  const matchInfo = evaluation.match;
  const diddiYoutube = getDiddiMatchdayYoutubeAdvice(player, roundNumber, evaluation);
  const fgConsigliato = getFantagazzettaConsigliatoStatus(player, evaluation);

  // Squadra d'asta proprietaria o 'FREE' se non appartiene a nessuna rosa
  const ownershipInfo = useMemo(() => {
    for (const t of teams) {
      const pl = t.players.find(p => p.playerId === player.id);
      if (pl) {
        return {
          isOwned: true,
          teamName: t.name,
          teamColor: t.color,
          price: pl.price
        };
      }
      if (player.assignedTo && player.assignedTo === t.id) {
        return {
          isOwned: true,
          teamName: t.name,
          teamColor: t.color,
          price: player.price || null
        };
      }
    }
    return {
      isOwned: false,
      teamName: 'FREE',
      teamColor: null,
      price: null
    };
  }, [teams, player]);

  // Indice corrente nella lista ordinata
  const currentIndex = useMemo(() => {
    return allCards.findIndex(c => c.player.id === player.id);
  }, [allCards, player.id]);

  const hasPrev = allCards.length > 1;
  const hasNext = allCards.length > 1;

  const handlePrev = () => {
    if (!hasPrev) return;
    const prevIdx = (currentIndex - 1 + allCards.length) % allCards.length;
    onSelectCard(allCards[prevIdx]);
  };

  const handleNext = () => {
    if (!hasNext) return;
    const nextIdx = (currentIndex + 1) % allCards.length;
    onSelectCard(allCards[nextIdx]);
  };

  const [isChartExpanded, setIsChartExpanded] = React.useState(false);

  // Listener scorciatoie da tastiera: Freccia Sinistra (Precedente), Freccia Destra (Successivo), ESC (Chiudi o riduci)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isChartExpanded) {
          setIsChartExpanded(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allCards, hasPrev, hasNext, onClose, onSelectCard, isChartExpanded]);

  // Helper stile ruolo
  const getRoleBadgeStyle = (role: Role) => {
    switch (role) {
      case 'P':
        return 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-500/20';
      case 'D':
        return 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20';
      case 'C':
        return 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20';
      case 'A':
        return 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20';
    }
  };

  // Helper stile Ted Score
  const getScoreBadgeStyle = (score: number) => {
    if (score >= 80) {
      return {
        pill: isLight ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
        badge: 'bg-emerald-600 text-white',
        grade: 'TOP DI GIORNATA',
        glow: 'shadow-emerald-500/30'
      };
    }
    if (score >= 70) {
      return {
        pill: isLight ? 'bg-blue-600 text-white border-blue-700' : 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        badge: 'bg-blue-600 text-white',
        grade: 'CONSIGLIATO',
        glow: 'shadow-blue-500/30'
      };
    }
    if (score >= 55) {
      return {
        pill: isLight ? 'bg-amber-400 text-slate-950 border-amber-500' : 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        badge: 'bg-amber-500 text-slate-950',
        grade: 'SCHIERABILE',
        glow: 'shadow-amber-500/30'
      };
    }
    return {
      pill: isLight ? 'bg-rose-600 text-white border-rose-700' : 'bg-rose-500/20 text-rose-400 border-rose-500/50',
      badge: 'bg-rose-600 text-white',
      grade: 'RISCHIO / TRAPPOLA',
      glow: 'shadow-rose-500/30'
    };
  };

  // Helper difficoltà partita (FDR)
  const getFdrBadge = (diff: number) => {
    switch (diff) {
      case 1:
        return {
          label: '1/5 Abbordabile',
          tag: 'MOLTO FAVOREVOLE',
          bg: isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50',
          barColor: 'bg-emerald-500',
          percent: 20
        };
      case 2:
        return {
          label: '2/5 Favorevole',
          tag: 'FAVOREVOLE',
          bg: isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40',
          barColor: 'bg-emerald-400',
          percent: 40
        };
      case 3:
        return {
          label: '3/5 Equilibrata',
          tag: 'MEDIA',
          bg: isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-950/70 text-amber-300 border-amber-500/50',
          barColor: 'bg-amber-400',
          percent: 60
        };
      case 4:
        return {
          label: '4/5 Tosta',
          tag: 'DIFFICILE',
          bg: isLight ? 'bg-orange-100 text-orange-900 border-orange-300' : 'bg-orange-950/70 text-orange-300 border-orange-500/50',
          barColor: 'bg-orange-500',
          percent: 80
        };
      case 5:
      default:
        return {
          label: '5/5 Proibitiva',
          tag: 'DURA',
          bg: isLight ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-rose-950/80 text-rose-300 border-rose-500/60',
          barColor: 'bg-rose-500',
          percent: 100
        };
    }
  };

  const scoreMeta = getScoreBadgeStyle(tedScore);
  const fdrMeta = matchInfo ? getFdrBadge(matchInfo.difficulty) : null;

  // Storico stagioni passate se presente
  const pastSeasonsList = useMemo<SeasonStats[]>(() => {
    if (!player.seasons) return [];
    return (Object.values(player.seasons) as (SeasonStats | undefined)[])
      .filter((s): s is SeasonStats => Boolean(s && s.season && s.season !== '2026/27'))
      .sort((a, b) => b.season.localeCompare(a.season));
  }, [player.seasons]);

  // SE MODALITÀ GRAFICO ESPANSO: APRE LA SCHEDA A SCHERMO INTERO AL POSTO DI QUELLA NORMALE
  // NESSUNA FINESTRA POPUP MESSA SOPRA, ZERO SCROLLBAR, ADATTAMENTO PERFETTO 100VW x 100VH
  if (isChartExpanded) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-slate-950 w-screen h-screen flex flex-col overflow-hidden select-none animate-in fade-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR FULLSCREEN OTTIMIZZATA */}
        <div className={`h-14 px-4 sm:px-6 border-b flex items-center justify-between gap-4 flex-shrink-0 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          {/* SINISTRA: RUOLO, NOME, SQUADRA, SQUADRA FANTA O FREE */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black border shadow-md flex-shrink-0 ${getRoleBadgeStyle(player.ruolo)}`}>
              <span className="text-base leading-none">{player.ruolo}</span>
            </div>
            <div className="flex items-center gap-2.5 min-w-0">
              <h1 className={`text-lg sm:text-xl font-black uppercase tracking-wide truncate ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}>
                {player.nome}
              </h1>
              <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {player.squadra}
              </span>
              {ownershipInfo.isOwned ? (
                <span className={`px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 border shadow-sm ${
                  isLight 
                    ? 'bg-blue-50 text-blue-900 border-blue-300' 
                    : 'bg-blue-950/80 text-blue-300 border-blue-500/50'
                }`}>
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span>{ownershipInfo.teamName}</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                  FREE
                </span>
              )}
            </div>
          </div>

          {/* DESTRA: NAVIGAZIONE PREV/NEXT, TASTO RIDUCI A REPORT, TASTO CHIUDI */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`flex items-center p-0.5 rounded-lg border shadow-inner ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={handlePrev}
                disabled={!hasPrev}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-all disabled:opacity-40 cursor-pointer"
                title="Giocatore precedente (Freccia Sinistra ←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono font-bold text-slate-300">
                {currentIndex + 1} / {allCards.length}
              </span>
              <button
                onClick={handleNext}
                disabled={!hasNext}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-all disabled:opacity-40 cursor-pointer"
                title="Giocatore successivo (Freccia Destra →)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* TASTO RIDUCI: TORNA ALLA SCHEDA NORMALE (AL POSTO DI QUELLA ZUMMATA) */}
            <button
              onClick={() => setIsChartExpanded(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Torna alla scheda report completa (Esc)"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Riduci a report</span>
            </button>

            {/* CHIUDI MODALE COMPLETAMENTE */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Chiudi (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CORPO DEL GRAFICO A TUTTO SCHERMO: OCCUPA L'INTERA ALTEZZA RIMANENTE SENZA SCROLLBAR */}
        <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-hidden flex flex-col">
          <PlayerPerformanceChart 
            player={player} 
            isExpandedMode={true} 
            onToggleExpand={() => setIsChartExpanded(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 xl:p-7 select-none animate-in fade-in duration-150 overflow-hidden"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-6xl xl:max-w-7xl max-h-[95vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isLight 
            ? 'bg-slate-50 border-slate-300 text-slate-900 shadow-slate-400/30' 
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/80'
        }`}
      >
        {/* ========================================================= */}
        {/* HEADER DESKTOP OTTIMIZZATO                                 */}
        {/* ========================================================= */}
        <div className={`p-4 xl:p-5 border-b flex items-center justify-between gap-4 flex-shrink-0 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          {/* SINISTRA: RUOLO, NOME, SQUADRA, QUOTAZIONE, ASSEGNAZIONE */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* BADGE RUOLO */}
            <div className={`w-11 h-11 xl:w-12 xl:h-12 rounded-xl flex flex-col items-center justify-center font-black border shadow-md flex-shrink-0 ${getRoleBadgeStyle(player.ruolo)}`}>
              <span className="text-lg xl:text-xl leading-none">{player.ruolo}</span>
              <span className="text-[9px] uppercase tracking-tighter leading-none mt-0.5 opacity-90">
                {ROLE_NAMES[player.ruolo].slice(0, 3)}
              </span>
            </div>

            {/* IDENTITÀ CALCIATORE */}
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className={`text-xl xl:text-2xl font-black uppercase tracking-wide truncate ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}>
                  {player.nome}
                </h1>

                {/* STATO FORMAZIONE (TITOLARE vs PANCHINA) */}
                <span className={`px-2 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 border shadow-sm ${
                  isStarter
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  {isStarter ? (
                    <>
                      <Star className="w-3 h-3 fill-emerald-400" />
                      <span>11 Titolare</span>
                    </>
                  ) : (
                    <>
                      <span>🛋️</span>
                      <span>{benchOrder ? `${benchOrder}° Panchina` : 'Panchina'}</span>
                    </>
                  )}
                </span>

                {/* PROPRIETÀ SQUADRA FANTA O "FREE" */}
                {ownershipInfo.isOwned ? (
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 border shadow-sm ${
                    isLight 
                      ? 'bg-blue-50 text-blue-900 border-blue-300' 
                      : 'bg-blue-950/80 text-blue-300 border-blue-500/50'
                  }`}>
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span>{ownershipInfo.teamName}</span>
                    {ownershipInfo.price !== null && (
                      <span className="text-amber-400 font-mono font-bold">({ownershipInfo.price} cr.)</span>
                    )}
                  </span>
                ) : (
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5 border shadow-sm ${
                    isLight 
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400' 
                      : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>FREE</span>
                  </span>
                )}
              </div>

              {/* DETTAGLI ECONOMICI & STATISTICI RAPIDI */}
              <div className={`text-xs xl:text-sm font-mono mt-1 flex items-center gap-2.5 flex-wrap ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <span className="font-bold uppercase tracking-wide px-1.5 py-0.2 rounded bg-slate-800/20 text-current">
                  {player.squadra}
                </span>
                <span>•</span>
                <span>Qt: <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white font-bold'}>{player.quotazione}</strong></span>
                <span>•</span>
                <span>FVM: <strong className="text-amber-400 font-black">{player.fvm}</strong></span>
                {player.ruoloMantra && (
                  <>
                    <span>•</span>
                    <span>Mantra: <strong className="text-purple-400 font-bold">{player.ruoloMantra}</strong></span>
                  </>
                )}
                {player.rigorista && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 font-bold inline-flex items-center gap-0.5">
                      <span>🎯</span> Rigorista
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* DESTRA: HERO TED SCORE + CONTROLLI DESKTOP */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* HERO SCORE BADGE */}
            <div className={`px-3 py-1.5 xl:px-4 xl:py-2 rounded-xl border flex items-center gap-2.5 shadow-sm ${scoreMeta.pill}`}>
              <div className="text-right leading-none">
                <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                  Ted Score
                </span>
                <span className="text-[11px] font-black tracking-tight block mt-0.5">
                  {scoreMeta.grade}
                </span>
              </div>
              <div className="text-2xl xl:text-3xl font-black font-mono leading-none tracking-tight">
                {tedScore}
                <span className="text-xs font-bold opacity-60">/100</span>
              </div>
            </div>

            {/* CONTROLLI DI NAVIGAZIONE CON FRECCE E TASTIERA */}
            <div className={`flex items-center p-1 rounded-xl border shadow-inner ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={handlePrev}
                disabled={!hasPrev}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  hasPrev 
                    ? (isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300 hover:text-white') 
                    : 'opacity-40 cursor-not-allowed'
                }`}
                title="Giocatore precedente (Tasto Freccia Sinistra ←)"
              >
                <ChevronLeft className="w-4 h-4 xl:w-5 xl:h-5" />
              </button>

              <div className="px-2 text-center">
                <span className="text-xs font-mono font-bold block leading-none">
                  {currentIndex + 1} / {allCards.length}
                </span>
                <span className="text-[9px] text-slate-400 font-mono tracking-tighter hidden xl:block mt-0.5">
                  [← / →]
                </span>
              </div>

              <button
                onClick={handleNext}
                disabled={!hasNext}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  hasNext 
                    ? (isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300 hover:text-white') 
                    : 'opacity-40 cursor-not-allowed'
                }`}
                title="Giocatore successivo (Tasto Freccia Destra →)"
              >
                <ChevronRight className="w-4 h-4 xl:w-5 xl:h-5" />
              </button>
            </div>

            {/* TASTO CHIUDI */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all border ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="Chiudi Report (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CORPO DEL REPORT: GRIGLIA A 2 COLONNE DESKTOP (7/12 + 5/12) */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 xl:p-5 scrollbar-thin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-5 items-start">
            
            {/* ===================================================== */}
            {/* COLONNA SINISTRA (7 COLS): RENDIMENTO, GRAFICO & FDR  */}
            {/* ===================================================== */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* 1. GRAFICO VOTO E FANTAVOTO FANTACALCIO.IT */}
              <div className="w-full">
                <PlayerPerformanceChart 
                  player={player} 
                  onToggleExpand={() => setIsChartExpanded(true)} 
                />
              </div>

              {/* 2. PROSSIMA GARA & COEFFICIENTE DI DIFFICOLTÀ (FDR) */}
              {matchInfo && (
                <div className={`p-4 rounded-xl border space-y-3 shadow-sm ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between border-b pb-2 border-slate-800/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span className="font-black text-xs uppercase tracking-wide">
                        {matchInfo.matchdayTitle || roundTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider border ${
                        matchInfo.isHome 
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40' 
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}>
                        {matchInfo.isHome ? 'IN CASA' : 'IN TRASFERTA'}
                      </span>
                    </div>
                  </div>

                  {/* SFIDA DIRETTA */}
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black tracking-wide">
                        {matchInfo.isHome ? player.squadra : matchInfo.opponent}
                      </span>
                      <span className="text-xs text-slate-500 font-black">vs</span>
                      <span className="text-base font-black tracking-wide">
                        {matchInfo.isHome ? matchInfo.opponent : player.squadra}
                      </span>
                    </div>

                    <div className="text-right text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{matchInfo.date} • {matchInfo.time}</span>
                      </div>
                      {matchInfo.stadium && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 justify-end mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{matchInfo.stadium}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BARRA FDR DIFFICOLTÀ AVVERSARIO */}
                  {fdrMeta && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Difficoltà Match (FDR Avversario):</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-black border ${fdrMeta.bg}`}>
                          {fdrMeta.label} ({fdrMeta.tag})
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${fdrMeta.barColor} transition-all duration-300 rounded-full`}
                          style={{ width: `${fdrMeta.percent}%` }}
                        />
                      </div>
                    </div>
                  )}


                </div>
              )}

              {/* 3. STORICO STAGIONI PASSATE (SE DISPONIBILI) */}
              {pastSeasonsList.length > 0 && (
                <div className={`p-4 rounded-xl border shadow-sm space-y-2.5 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between border-b pb-2 border-slate-800/50">
                    <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-slate-300">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                      <span>Storico Carriera Pluriennale</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Dati ufficiali Fantacalcio</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-left">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                          <th className="py-1">Stagione</th>
                          <th className="py-1">Squadra</th>
                          <th className="py-1 text-center">Partite</th>
                          <th className="py-1 text-center">{player.ruolo === 'P' ? 'Gol Subiti' : 'Gol'}</th>
                          <th className="py-1 text-center">Assist</th>
                          <th className="py-1 text-center">MV</th>
                          <th className="py-1 text-center">FM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {pastSeasonsList.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-1.5 font-bold text-white">{s.season}</td>
                            <td className="py-1.5 text-slate-300">{s.squadra || player.squadra}</td>
                            <td className="py-1.5 text-center font-bold text-blue-400">{s.pg}</td>
                            <td className="py-1.5 text-center font-bold text-emerald-400">
                              {player.ruolo === 'P' ? s.gs : s.gf}
                            </td>
                            <td className="py-1.5 text-center text-amber-400 font-bold">{s.assist}</td>
                            <td className="py-1.5 text-center font-bold text-slate-200">
                              {s.mv ? s.mv.toFixed(2) : '-'}
                            </td>
                            <td className="py-1.5 text-center font-bold text-amber-300">
                              {s.fm ? s.fm.toFixed(2) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* ===================================================== */}
            {/* COLONNA DESTRA (5 COLS): PARERI ESPERTI, TED & DIDDI  */}
            {/* ===================================================== */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* 1. CITAZIONE & VERDETTO TATTICO COACH TED LASSO */}
              <div className="bg-amber-950/40 border-2 border-amber-400/60 rounded-2xl p-4 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👨🏻‍💼</span>
                    <div>
                      <span className="text-xs font-black uppercase text-amber-400 block leading-tight">
                        Coach Ted Lasso
                      </span>
                      <span className="text-[10px] text-amber-300/80 font-mono">
                        Consiglio Tattico Ufficiale
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                    {verdict.badge}
                  </span>
                </div>

                {/* CITAZIONE ICONICA */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
                  <p className="text-xs text-amber-200 italic font-serif leading-relaxed">
                    "{verdict.quote}"
                  </p>
                </div>

                {/* VERDETTO SULLO SCHIERAMENTO */}
                <div className="text-xs font-bold text-slate-100 bg-amber-900/30 p-2.5 rounded-xl border border-amber-500/30 leading-snug">
                  {verdict.verdict}
                </div>
              </div>

              {/* 2. PROBABILI FORMAZIONI GAZZETTA DELLO SPORT */}
              <div className={`p-4 rounded-xl border space-y-2 shadow-sm ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-rose-400 text-xs uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-500" />
                    <span>Gazzetta dello Sport</span>
                  </span>

                  <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {evaluation.gazzetta.titolaritaPercent}% Titolare
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${evaluation.gazzetta.titolaritaPercent}%` }}
                  />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {evaluation.gazzetta.noteGazzetta}
                </p>

                {evaluation.gazzetta.ballottaggioCon && (
                  <div className="p-2 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
                    ⚔️ Ballottaggio aperto: {evaluation.gazzetta.ballottaggioCon}
                  </div>
                )}
              </div>

              {/* 3. REDAZIONE FANTACALCIO / FANTAGAZZETTA */}
              <div className={`p-4 rounded-xl border space-y-2 shadow-sm ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-blue-400 text-xs uppercase flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                    <span>Redazione Fantagazzetta</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 text-sm tracking-widest font-black">
                      {'★'.repeat(evaluation.fantagazzetta.stars)}
                      <span className="text-slate-600">{'★'.repeat(Math.max(0, 5 - evaluation.fantagazzetta.stars))}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-900/60 text-blue-200 border border-blue-500/30">
                      {evaluation.fantagazzetta.fascia}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {evaluation.fantagazzetta.commentoRedazione}
                </p>
              </div>

              {/* 4. BOX SPECIALE: CONSIGLIATO DI GIORNATA (SE APPLICABILE) */}
              {fgConsigliato.isConsigliato && (
                <div className="p-4 rounded-2xl bg-blue-950/50 border-2 border-blue-500/70 space-y-1.5 shadow-md">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-black text-blue-300 uppercase flex items-center gap-1.5 text-xs">
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{fgConsigliato.titolo}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-[10px] font-mono font-bold">
                      {fgConsigliato.rubrica}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 font-medium leading-relaxed">
                    {fgConsigliato.motivo}
                  </p>
                </div>
              )}

              {/* 5. YOUTUBE LUCA DIDDI (ANALISI TATTICA GIORNATA) */}
              <div className={`p-4 rounded-xl border space-y-2 shadow-sm ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-amber-500/40'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-1 border-b pb-2 border-slate-800/60">
                  <span className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <span className="text-sm">📺</span>
                    <span>{diddiYoutube.title}</span>
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${diddiYoutube.tagColor}`}>
                    {diddiYoutube.tag}
                  </span>
                </div>

                <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Verdetto Diddi: {diddiYoutube.verdict}</span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  "{diddiYoutube.analysis}"
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* FOOTER DESKTOP CON CONTROLLI RAPIDI                       */}
        {/* ========================================================= */}
        <div className={`p-3.5 xl:p-4 border-t flex items-center justify-between gap-3 flex-shrink-0 ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all active:scale-95 ${
                hasPrev 
                  ? (isLight ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700') 
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Precedente</span>
              <kbd className="px-1 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px] font-mono ml-1">←</kbd>
            </button>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all active:scale-95 ${
                hasNext 
                  ? (isLight ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700') 
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <span>Successivo</span>
              <kbd className="px-1 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px] font-mono ml-1">→</kbd>
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-500 font-mono hidden md:inline ml-2">
              (Usa le frecce della tastiera per scorrere i calciatori)
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition-all active:scale-95 shadow border border-slate-700"
          >
            Chiudi Report <kbd className="px-1 py-0.2 rounded bg-slate-950 text-slate-400 text-[10px] font-mono ml-1.5">ESC</kbd>
          </button>
        </div>

      </div>
    </div>
  );
};
