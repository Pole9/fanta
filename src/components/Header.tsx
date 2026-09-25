import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { Role, RoleFilter } from '../types';
import { 
  Gavel, 
  Flame, 
  Shield,
  Users, 
  Table, 
  Settings, 
  Undo2, 
  Coins,
  Sun,
  Moon,
  Home
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    history,
    canUndo,
    undoLastAction,
    players,
    teams,
    theme,
    toggleTheme,
    selectedTeamFilter,
    setSelectedTeamFilter,
    allSerieATeams,
    selectFirstAvailablePlayer
  } = useAuction();

  const roles: { role: RoleFilter; label: string; text: string }[] = [
    { role: 'ALL', label: 'Tutti', text: 'text-purple-300' },
    { role: 'P', label: 'Portieri', text: 'text-amber-400' },
    { role: 'D', label: 'Difensori', text: 'text-emerald-400' },
    { role: 'C', label: 'Centrocampisti', text: 'text-blue-400' },
    { role: 'A', label: 'Attaccanti', text: 'text-red-400' },
  ];

  const getRoleStats = (r: RoleFilter) => {
    const rolePlayers = r === 'ALL' ? players : players.filter(p => p.ruolo === r);
    const assigned = rolePlayers.filter(p => p.status === 'assigned').length;
    return { assigned, total: rolePlayers.length };
  };

  const totalSpent = teams.reduce((acc, t) => acc + (300 - t.currentBudget), 0);
  const totalBudget = teams.length * 300;

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-2 py-0.5 shadow-md flex-shrink-0">
      <div className="w-full flex items-center justify-between gap-1 text-xs">
        
        {/* FILTRI RUOLO E SQUADRA MASTER (COMPATTI, NESSUN OVERFLOW) */}
        <div className="flex items-center gap-1">


          {/* FILTRO SQUADRA GLOBALE (COMPATTO) */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-750 rounded-md px-1.5 py-0.5 h-6 select-none shadow-sm">
            <span className="text-[10px] font-black text-amber-400">CLUB:</span>
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="bg-transparent text-[11px] font-black text-emerald-400 focus:outline-none cursor-pointer uppercase max-w-[105px]"
              title="Filtro squadra globale"
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
                className="text-slate-400 hover:text-white ml-0.5 text-xs font-black"
                title="Azzera filtro club"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* VISTE PRINCIPALI (STRETTE IN ALTEZZA A H-6 PER RISPARMIARE SPAZIO) */}
        <div className="flex items-center gap-1">
          {/* PULSANTE HOME */}
          <button
            onClick={() => setActiveView('home')}
            className={`px-2 py-0.5 h-6 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all border ${
              activeView === 'home'
                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow ring-1 ring-amber-200'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
            title="Torna alla Home Page principale"
          >
            <Home className="w-3 h-3" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setCurrentRole('P');
              setActiveView('goalkeepers');
            }}
            className={`px-2 py-0.5 h-6 rounded-md text-[11px] font-black flex items-center gap-1 transition-all border ${
              activeView === 'goalkeepers'
                ? 'bg-amber-500 border-amber-400 text-slate-950 shadow ring-1 ring-amber-300'
                : 'bg-amber-950/40 border-amber-900/50 text-amber-300 hover:bg-amber-900/30'
            }`}
            title="War Room Portieri"
          >
            <Shield className="w-3 h-3" />
            <span>War Room P</span>
          </button>

          <button
            onClick={() => setActiveView('auction')}
            className={`px-2 py-0.5 h-6 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all border ${
              activeView === 'auction'
                ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            title="Chiamata Asta dal vivo"
          >
            <Gavel className="w-3 h-3" />
            <span>Asta</span>
          </button>

          <button
            onClick={() => {
              setCurrentRole('A');
              setActiveView('attackers');
            }}
            className={`px-2 py-0.5 h-6 rounded-md text-[11px] font-black flex items-center gap-1 transition-all border ${
              activeView === 'attackers'
                ? 'bg-red-600 border-red-500 text-white shadow ring-1 ring-rose-400'
                : 'bg-red-950/40 border-red-900/50 text-red-300 hover:bg-red-900/30'
            }`}
            title="War Room Attaccanti"
          >
            <Flame className={`w-3 h-3 ${activeView === 'attackers' ? 'text-white' : 'text-rose-400'} animate-pulse`} />
            <span>War Room A</span>
          </button>

          <button
            onClick={() => setActiveView('teams')}
            className={`px-2 py-0.5 h-6 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all border ${
              activeView === 'teams'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            title="Panoramica Rose"
          >
            <Users className="w-3 h-3" />
            <span>Rose</span>
          </button>

          <button
            onClick={() => setActiveView('listone')}
            className={`px-2 py-0.5 h-6 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all border ${
              activeView === 'listone'
                ? 'bg-purple-600 border-purple-500 text-white shadow ring-1 ring-purple-300'
                : 'bg-purple-950/40 border-purple-900/50 text-purple-300 hover:bg-purple-900/30'
            }`}
            title="Listone Completo con Statistiche e Note"
          >
            <Table className="w-3 h-3" />
            <span>Listone</span>
          </button>

          {/* TAB TED LASSO */}
          <button
            onClick={() => setActiveView('ted_lasso')}
            className={`px-2 py-0.5 h-6 rounded-md text-[11px] font-black flex items-center gap-1 transition-all border ${
              activeView === 'ted_lasso'
                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow ring-1 ring-amber-200'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
            }`}
            title="Ted Lasso - Assistente Schieramento Formazione"
          >
            <span className="px-1 py-0.2 rounded bg-amber-400 text-slate-950 text-[8px] font-black tracking-wider leading-none">
              BELIEVE
            </span>
            <span>Ted Lasso</span>
          </button>

          {/* PULSANTE TEMA CHIARO / SCURO */}
          <button
            onClick={toggleTheme}
            className={`p-1 h-6 w-6 rounded-md text-[11px] font-bold flex items-center justify-center transition-all border shadow-sm active:scale-95 ${
              theme === 'light'
                ? 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200'
                : 'bg-slate-950 border-slate-800 text-amber-400 hover:bg-slate-850'
            }`}
            title={theme === 'light' ? 'Passa al Tema Scuro' : 'Passa al Tema Chiaro'}
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* PARTE DESTRA: ANNULLA E PULSANTE OPZIONI TUTTO A DESTRA (INGRANDITO) */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={undoLastAction}
            disabled={!canUndo}
            title={canUndo ? `Annulla: ${history[0]?.description} (Ctrl+Z)` : 'Nessuna azione'}
            className={`px-1.5 py-0.5 h-6 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all border select-none ${
              canUndo
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3 h-3" />
            <span className="hidden sm:inline">Annulla</span>
            {canUndo && (
              <span className="px-1 bg-amber-400/30 text-amber-200 text-[9px] rounded font-mono">
                {history.length}
              </span>
            )}
          </button>

          {/* PULSANTE OPZIONI: TUTTO A DESTRA E PIÙ GROSSO */}
          <button
            onClick={() => setActiveView('settings')}
            className={`h-7 px-2.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all border shadow-sm active:scale-95 ${
              activeView === 'settings'
                ? 'bg-slate-700 border-slate-500 text-white shadow ring-1 ring-slate-400'
                : 'bg-slate-950 border-slate-750 text-slate-200 hover:text-white hover:bg-slate-800 hover:border-slate-600'
            }`}
            title="Opzioni e Impostazioni Asta"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="font-extrabold text-[11px]">Opzioni</span>
          </button>
        </div>

      </div>
    </header>
  );
};
