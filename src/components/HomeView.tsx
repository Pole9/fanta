import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { 
  Gavel, 
  Flame, 
  Shield, 
  Users, 
  Table, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  CalendarCheck2,
  Trophy,
  Activity
} from 'lucide-react';
import { CURRENT_MATCHDAY_TITLE } from '../data/matchdayData';

export const HomeView: React.FC = () => {
  const { setActiveView, teams, myTeamId, players, lastOnlineSyncTime, forceLoadCompleteRosters } = useAuction();

  const myTeam = teams.find(t => t.id === myTeamId) || teams[0];
  const assignedPlayersCount = myTeam ? myTeam.players.length : 0;
  const currentBudget = myTeam ? myTeam.currentBudget : 300;

  return (
    <div className="h-full w-full flex flex-col justify-between overflow-y-auto px-2 sm:px-6 py-3 sm:py-6 max-w-[1400px] mx-auto select-none space-y-4 sm:space-y-6 scrollbar-thin">
      
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-1.5 sm:space-y-2 flex-shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>FANTACALCIO SUITE 2026/27 • SERIE A TIM</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
          COSA VUOI FARE OGGI?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium">
          Scegli se gestire la sala d'asta e le rose delle 8 squadre o schierare il miglior 11 con l'assistente tattico domenicale.
        </p>
      </div>

      {/* 2. I DUE MACRO-PULSANTI PRINCIPALI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1 min-h-[300px] items-stretch">
        
        {/* MACRO-PULSANTE 1: ASTA FANTACALCIO & WAR ROOMS */}
        <button
          onClick={() => setActiveView('auction')}
          className="home-macro-card group relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 hover:bg-slate-50 dark:hover:from-slate-850 dark:hover:to-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500/70 text-left transition-all duration-200 active:scale-[0.99] shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between overflow-hidden"
        >
          {/* Sfondo luminoso su hover */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-500/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-md group-hover:scale-105 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 transition-all">
                <Gavel className="w-7 h-7" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-300">
                LIVE AUCTION & WAR ROOMS
              </span>
            </div>

            <h2 className="home-card-title text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors uppercase tracking-wide">
              ASTA FANTACALCIO
            </h2>
            <p className="home-card-desc text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed font-medium">
              Tutte le armi tattiche per dominare l'asta dal vivo: War Room Attaccanti, War Room Portieri con matrice incroci 20x20, pannello di chiamata rapida e Listone ufficiale con i 164 consigli del Tattico Luca Diddi.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
              <span className="home-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Flame className="w-3 h-3 text-rose-500" /> War Room A
              </span>
              <span className="home-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Shield className="w-3 h-3 text-amber-500" /> War Room P
              </span>
              <span className="home-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Table className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Listone & Note
              </span>
              <span className="home-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Users className="w-3 h-3 text-blue-600 dark:text-blue-400" /> 8 Rose & Budget
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between mt-6">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">
              Entra nella sala d'asta
            </span>
            <div className="w-9 h-9 rounded-full bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow transition-all group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* MACRO-PULSANTE 2: TED LASSO - ASSISTENTE FORMAZIONE DOMENICALE */}
        <button
          onClick={() => setActiveView('ted_lasso')}
          className="home-macro-card group relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 hover:bg-slate-50 dark:hover:from-slate-850 dark:hover:to-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400/80 text-left transition-all duration-200 active:scale-[0.99] shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between overflow-hidden"
        >
          {/* Sfondo luminoso su hover */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              {/* Cartello BELIEVE Iconico di Ted */}
              <div className="px-3 py-1.5 rounded bg-amber-400 border border-amber-300 text-slate-950 font-black tracking-widest text-xs uppercase shadow-md -rotate-2 group-hover:rotate-0 transition-transform">
                BELIEVE
              </div>
              <div className="flex items-center gap-1.5">
                {lastOnlineSyncTime && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live {lastOnlineSyncTime.split('ore')[1] ? `ore ${lastOnlineSyncTime.split('ore')[1].trim()}` : ''}</span>
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300">
                  ASSISTENTE SCHIERAMENTO
                </span>
              </div>
            </div>

            <h2 className="home-card-title text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors uppercase tracking-wide flex items-center gap-2">
              <span>TED LASSO</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 font-bold">
                NUOVO
              </span>
            </h2>
            <p className="home-card-desc text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed font-medium">
              Il tuo fidato vice-allenatore per ogni domenica. Sceglie la formazione ideale incrociando statistiche, forma, probabili formazioni della <strong className="text-slate-900 dark:text-slate-300">Gazzetta dello Sport</strong>, valutazioni della redazione <strong className="text-slate-900 dark:text-slate-300">Fantagazzetta</strong> e tattica di <strong className="text-slate-900 dark:text-slate-300">Luca Diddi</strong>.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
              <span className="home-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <CalendarCheck2 className="w-3 h-3 text-amber-500" /> {CURRENT_MATCHDAY_TITLE}
              </span>
              <span className="home-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Titolarità Gazzetta
              </span>
              <span className="home-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Trophy className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Modificatore Difesa
              </span>
              <span className="home-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <TrendingUp className="w-3 h-3 text-rose-500" /> Ted Score 0-100
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between mt-6">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">
              Schiera la tua squadra della domenica
            </span>
            <div className="w-9 h-9 rounded-full bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow transition-all group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

      </div>

      {/* 3. WIDGET DI STATO INFERIORE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <div>
            <span className="text-slate-400 font-medium">La tua squadra: </span>
            <strong className="text-white font-extrabold text-sm">{myTeam.name}</strong>
            <span className="text-slate-500 ml-2 font-mono">
              ({assignedPlayersCount}/25 giocatori • {currentBudget} crediti residui)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {assignedPlayersCount < 25 && (
            <button
              onClick={() => forceLoadCompleteRosters()}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>⚡ Carica Rose Complete (25/25)</span>
            </button>
          )}
          <span className="text-slate-400 font-mono text-[11px]">
            Totale Calciatori nel Database: <strong className="text-amber-400">{players.length}</strong>
          </span>
        </div>
      </div>

    </div>
  );
};
