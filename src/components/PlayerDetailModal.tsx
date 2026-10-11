import React, { useEffect, useRef } from 'react';
import { TedPlayerCard, getTedPlayerVerdict } from '../utils/tedLassoAdvisor';
import { PlayerPerformanceChart } from './PlayerPerformanceChart';
import { getDiddiMatchdayYoutubeAdvice, getFantagazzettaConsigliatoStatus } from '../utils/matchdayAdviceProvider';
import { Role } from '../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  Shield,
  Calendar
} from 'lucide-react';

export interface PlayerDetailModalProps {
  card: TedPlayerCard;
  onClose: () => void;
  onPrevPlayer?: () => void;
  onNextPlayer?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  isLight?: boolean;
  matchdayNumber?: number;
  isMyPlayer?: boolean;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  card,
  onClose,
  onPrevPlayer,
  onNextPlayer,
  hasPrev = true,
  hasNext = true,
  isLight = false,
  matchdayNumber = 7,
  isMyPlayer = false
}) => {
  const { player, evaluation, tedScore } = card;
  const verdict = getTedPlayerVerdict(player, tedScore, evaluation);
  const matchInfo = evaluation.match;
  const diddiYoutube = getDiddiMatchdayYoutubeAdvice(player, matchdayNumber, evaluation);
  const fgConsigliato = getFantagazzettaConsigliatoStatus(player, evaluation);

  // Gestione tasto indietro (popstate / browser back)
  useEffect(() => {
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onClose]);

  // Gestione tastiera: ESC per chiudere, frecce per cambiare giocatore
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrevPlayer) onPrevPlayer();
      if (e.key === 'ArrowRight' && onNextPlayer) onNextPlayer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevPlayer, onNextPlayer]);

  // Gestione gesture touch swipe laterale per cambiare giocatore
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0 && onNextPlayer) {
        onNextPlayer();
      } else if (deltaX > 0 && onPrevPlayer) {
        onPrevPlayer();
      }
    }
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
    if (score >= 80) return isLight ? 'text-white bg-emerald-600 border-emerald-700 shadow-sm font-black' : 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50 font-black';
    if (score >= 65) return isLight ? 'text-white bg-blue-600 border-blue-700 shadow-sm font-black' : 'text-blue-400 bg-blue-950/80 border-blue-500/50 font-black';
    if (score >= 50) return isLight ? 'text-slate-950 bg-amber-400 border-amber-500 shadow-sm font-black' : 'text-amber-400 bg-amber-950/80 border-amber-500/50 font-black';
    return isLight ? 'text-white bg-rose-600 border-rose-700 shadow-sm font-black' : 'text-rose-400 bg-rose-950/80 border-rose-500/60 font-black';
  };

  const getDifficultyBadge = (diff: number) => {
    switch (diff) {
      case 1: 
        return { 
          label: '1/5 Facile', 
          tag: 'FACILE', 
          color: isLight ? 'text-emerald-900 bg-emerald-100 border-emerald-400 font-bold' : 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50' 
        };
      case 2: 
        return { 
          label: '2/5 Abbordabile', 
          tag: 'OK', 
          color: isLight ? 'text-emerald-800 bg-emerald-50 border-emerald-300 font-bold' : 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40' 
        };
      case 3: 
        return { 
          label: '3/5 Equilibrata', 
          tag: 'EQUIL.', 
          color: isLight ? 'text-amber-900 bg-amber-100 border-amber-400 font-bold' : 'text-amber-300 bg-amber-950/70 border-amber-500/50' 
        };
      case 4: 
        return { 
          label: '4/5 Tosta', 
          tag: 'DIFF.', 
          color: isLight ? 'text-orange-900 bg-orange-100 border-orange-400 font-bold' : 'text-orange-400 bg-orange-950/70 border-orange-500/50' 
        };
      case 5:
      default: 
        return { 
          label: '5/5 Proibitiva', 
          tag: 'DURA', 
          color: isLight ? 'text-rose-900 bg-rose-100 border-rose-400 font-black' : 'text-rose-400 bg-rose-950/80 border-rose-500/60' 
        };
    }
  };

  const diffBadge = matchInfo ? getDifficultyBadge(matchInfo.difficulty) : null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`w-full max-w-2xl rounded-t-3xl sm:rounded-2xl border shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden transition-colors ${
          isLight 
            ? 'bg-white border-slate-300 text-slate-900' 
            : 'bg-slate-900 border-slate-700 text-slate-100'
        }`}
      >
        {/* HEADER MODALE */}
        <div className={`p-3.5 sm:p-4 border-b flex items-start justify-between gap-2 flex-shrink-0 ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shadow-md flex-shrink-0 ${getRoleBg(player.ruolo)}`}>
              {player.ruolo}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`text-base sm:text-lg font-black uppercase tracking-wide truncate ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}>
                  {player.nome}
                </h2>
                {isMyPlayer && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider inline-flex items-center gap-0.5 shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-slate-950" />
                    <span>IN ROSA</span>
                  </span>
                )}
              </div>
              <div className={`text-xs font-mono mt-0.5 flex items-center gap-2 flex-wrap ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <span className="font-bold">{player.squadra}</span>
                <span>•</span>
                <span>Qt: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{player.quotazione}</strong></span>
                <span>•</span>
                <span>FVM: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{player.fvm}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* TED SCORE BADGE */}
            <div className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-black border shadow-sm ${getScoreColor(tedScore)}`}>
              Score: {tedScore}
            </div>

            {/* FRECCE PREV / NEXT GIOCATORE */}
            {(onPrevPlayer || onNextPlayer) && (
              <div className={`flex items-center rounded-lg border p-0.5 ${
                isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
              }`}>
                <button
                  onClick={onPrevPlayer}
                  disabled={!hasPrev}
                  className={`p-1.5 rounded transition-all ${
                    hasPrev 
                      ? (isLight ? 'text-slate-700 hover:bg-slate-100 active:scale-95' : 'text-slate-300 hover:bg-slate-800 active:scale-95') 
                      : 'opacity-30 cursor-not-allowed text-slate-500'
                  }`}
                  title="Giocatore precedente (Freccia Sinistra o Swipe)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={onNextPlayer}
                  disabled={!hasNext}
                  className={`p-1.5 rounded transition-all ${
                    hasNext 
                      ? (isLight ? 'text-slate-700 hover:bg-slate-100 active:scale-95' : 'text-slate-300 hover:bg-slate-800 active:scale-95') 
                      : 'opacity-30 cursor-not-allowed text-slate-500'
                  }`}
                  title="Giocatore successivo (Freccia Destra o Swipe)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TASTO CHIUDI */}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-all ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Chiudi scheda (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CORPO MODALE: SCROLLABILE */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
          
          {/* 1. GRAFICO STORICO VOTI E KPI FANTACALCIO */}
          <div className={`p-3 rounded-2xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-slate-900' : 'text-slate-200'
              }`}>
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <span>Rendimento & Storico Voti Reali</span>
              </span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Ultime giornate Serie A
              </span>
            </div>
            <PlayerPerformanceChart player={player} />
          </div>

          {/* 2. MATCH DEL TURNO & DIFFICOLTÀ AVVERSARIO (FDR) */}
          {matchInfo && (
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs flex-wrap ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-500 uppercase">{matchInfo.matchdayTitle}</span>
                  <span className={`px-1.5 py-0.2 rounded font-black text-[9px] uppercase ${
                    matchInfo.isHome 
                      ? (isLight ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40')
                      : (isLight ? 'bg-slate-200 text-slate-900 border border-slate-300' : 'bg-slate-900 text-slate-300 border border-slate-700')
                  }`}>
                    {matchInfo.isHome ? 'IN CASA' : 'IN TRASFERTA'}
                  </span>
                </div>
                <div className={`font-mono text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {matchInfo.isHome ? `${player.squadra} vs ${matchInfo.opponent}` : `${matchInfo.opponent} vs ${player.squadra}`}
                </div>
              </div>

              {diffBadge && (
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-xs border ${diffBadge.color}`}>
                    {diffBadge.label}
                  </span>
                  <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Difficoltà FDR
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 3. VERDETTO & CITAZIONE TED LASSO */}
          <div className="bg-amber-950/40 border border-amber-400/50 rounded-2xl p-3.5 space-y-1.5 text-xs shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-400 uppercase flex items-center gap-1.5 text-xs">
                <span>👨🏻‍💼</span>
                <span>Verdetto Ted Lasso: {verdict.badge}</span>
              </span>
            </div>
            <p className="text-xs text-slate-200 italic font-medium leading-relaxed">
              "{verdict.quote}"
            </p>
            <p className="text-[11px] text-amber-200 font-bold mt-1">
              {verdict.verdict}
            </p>
          </div>

          {/* 4. PROBABILI FORMAZIONI GAZZETTA DELLO SPORT */}
          <div className={`p-3 rounded-2xl border space-y-1.5 text-xs ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-black text-rose-500 uppercase flex items-center gap-1.5 text-xs">
                <Activity className="w-3.5 h-3.5" />
                <span>Probabili Formazioni Gazzetta</span>
              </span>
              <span className={`px-2 py-0.5 rounded font-black text-xs font-mono border ${
                evaluation.gazzetta.titolaritaPercent >= 80 
                  ? (isLight ? 'bg-emerald-100 text-emerald-950 border-emerald-400' : 'bg-emerald-950 text-emerald-300 border-emerald-500/40')
                  : (isLight ? 'bg-amber-100 text-amber-950 border-amber-400' : 'bg-amber-950 text-amber-300 border-amber-500/40')
              }`}>
                {evaluation.gazzetta.titolaritaPercent}% Titolare
              </span>
            </div>

            <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {evaluation.gazzetta.noteGazzetta}
            </p>

            {evaluation.gazzetta.ballottaggioCon && (
              <div className="text-[11px] text-amber-400 font-mono font-bold pt-0.5">
                ⚔️ Ballottaggio: {evaluation.gazzetta.ballottaggioCon}
              </div>
            )}

            {evaluation.injury && (
              <div className="text-[11px] text-rose-400 font-bold flex items-center gap-1 pt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Infortunio: {evaluation.injury.infortunio} (Rientro: {evaluation.injury.rientroPrevisto})</span>
              </div>
            )}
          </div>

          {/* 5. REDAZIONE FANTAGAZZETTA */}
          <div className={`p-3 rounded-2xl border space-y-1.5 text-xs ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-black text-blue-500 uppercase flex items-center gap-1.5 text-xs">
                <Star className="w-3.5 h-3.5 fill-blue-500" />
                <span>Redazione Fantagazzetta</span>
              </span>
              <span className="font-bold text-amber-400 font-mono text-xs">
                {'★'.repeat(evaluation.fantagazzetta.stars)} ({evaluation.fantagazzetta.fascia})
              </span>
            </div>
            <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {evaluation.fantagazzetta.commentoRedazione}
            </p>
          </div>

          {/* 6. CONSIGLIATO DI GIORNATA SE ATTIVO */}
          {fgConsigliato.isConsigliato && (
            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/60 space-y-1 shadow-sm text-xs">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-black text-blue-300 uppercase flex items-center gap-1.5">
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

          {/* 7. YOUTUBE LUCA DIDDI */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/50 space-y-1.5 shadow-sm text-xs">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="font-black text-amber-400 uppercase flex items-center gap-1.5">
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
            <p className="text-[11px] text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              "{diddiYoutube.analysis}"
            </p>
          </div>

        </div>

        {/* FOOTER MODALE: CHIUDI */}
        <div className={`p-3 border-t flex items-center justify-between gap-2 flex-shrink-0 ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950'
        }`}>
          <div className={`text-[11px] font-mono hidden sm:inline ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            💡 Swipe orizzontale o frecce per passare al giocatore successivo
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition-all active:scale-95 text-center shadow-md ml-auto"
          >
            Chiudi Scheda
          </button>
        </div>

      </div>
    </div>
  );
};
