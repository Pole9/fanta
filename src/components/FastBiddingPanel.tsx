import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Player, Team } from '../types';
import { 
  calculateMaxBid, 
  getTeamRoleCounts, 
  canTeamBidOnRole 
} from '../utils/auctionCalculations';
import { 
  RotateCcw, 
  CheckCircle, 
  Ban, 
  FastForward
} from 'lucide-react';

interface FastBiddingPanelProps {
  player: Player | null;
}

export const FastBiddingPanel: React.FC<FastBiddingPanelProps> = ({ player }) => {
  const { 
    teams, 
    minimumPrice, 
    slotConfig, 
    assignPlayer, 
    skipPlayer,
    unassignPlayer 
  } = useAuction();

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(minimumPrice);

  useEffect(() => {
    if (player) {
      if (player.status === 'assigned' && player.price !== undefined && player.price !== null) {
        setCurrentPrice(player.price);
        setSelectedTeamId(player.assignedTo || null);
      } else {
        setCurrentPrice(minimumPrice);
        setSelectedTeamId(null);
      }
    }
  }, [player, minimumPrice]);

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  const addPrice = (delta: number) => {
    setCurrentPrice(prev => Math.max(minimumPrice, prev + delta));
  };

  const handleAssign = () => {
    if (!player || !selectedTeamId) {
      alert('Seleziona prima la squadra vincitrice dell\'asta!');
      return;
    }
    const success = assignPlayer(player.id, selectedTeamId, currentPrice);
    if (success) {
      setSelectedTeamId(null);
      setCurrentPrice(minimumPrice);
    }
  };

  const handleSkip = () => {
    if (!player) return;
    skipPlayer(player.id);
    setSelectedTeamId(null);
    setCurrentPrice(minimumPrice);
  };

  const handleUnassign = () => {
    if (!player) return;
    if (window.confirm(`Vuoi annullare l'assegnazione di ${player.nome}?`)) {
      unassignPlayer(player.id);
    }
  };

  // Scorciatoie da tastiera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const num = parseInt(e.key);
      if (num >= 1 && num <= 8 && teams[num - 1] && player) {
        const team = teams[num - 1];
        const check = canTeamBidOnRole(team, player.ruolo, slotConfig, minimumPrice);
        if (check.canBid) setSelectedTeamId(team.id);
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        addPrice(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        addPrice(-1);
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        addPrice(5);
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        addPrice(-5);
      } else if (e.key === 'Enter' && selectedTeamId && player && player.status !== 'assigned') {
        e.preventDefault();
        handleAssign();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [teams, player, selectedTeamId, currentPrice, minimumPrice, slotConfig]);

  if (!player) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-lg space-y-1.5">
      
      {/* RIGA 1: PREZZO DI AGGIUDICAZIONE + PULSANTI INCREMENTO COMPATTI */}
      <div className="flex items-center justify-between gap-2 px-2 py-1 bg-slate-950/80 border border-slate-800 rounded-lg">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
            Prezzo:
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={minimumPrice}
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Math.max(minimumPrice, parseInt(e.target.value) || minimumPrice))}
              className="w-16 sm:w-20 h-8 text-center text-lg sm:text-xl font-black font-mono bg-slate-900 border border-emerald-500 rounded-lg px-1 text-emerald-300 focus:outline-none shadow-inner"
            />
          </div>
        </div>

        {/* BOTTONI INCREMENTO COMPATTI */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end min-w-0">
          <button
            onClick={() => addPrice(-1)}
            className="h-8 flex-1 min-w-[48px] max-w-[85px] px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-black border border-slate-700 active:scale-95 shadow-sm transition-all flex items-center justify-center select-none"
          >
            -1
          </button>
          <button
            onClick={() => addPrice(1)}
            className="h-8 flex-1 min-w-[56px] max-w-[100px] px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm sm:text-base font-black border border-emerald-400 active:scale-95 shadow ring-1 ring-emerald-400/50 transition-all flex items-center justify-center select-none"
          >
            +1
          </button>
          <button
            onClick={() => addPrice(2)}
            className="h-8 flex-1 min-w-[48px] max-w-[85px] px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-black border border-slate-700 active:scale-95 shadow-sm transition-all flex items-center justify-center select-none"
          >
            +2
          </button>
          <button
            onClick={() => addPrice(5)}
            className="h-8 flex-1 min-w-[50px] max-w-[90px] px-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg text-sm font-black border border-indigo-500 active:scale-95 shadow transition-all flex items-center justify-center select-none"
          >
            +5
          </button>
          <button
            onClick={() => addPrice(10)}
            className="h-8 flex-1 min-w-[52px] max-w-[95px] px-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-sm font-black border border-purple-500 active:scale-95 shadow transition-all flex items-center justify-center select-none"
          >
            +10
          </button>
          <button
            onClick={() => setCurrentPrice(minimumPrice)}
            className="h-8 w-8 min-w-[32px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 active:scale-95 shadow-sm transition-all flex items-center justify-center flex-shrink-0"
            title="Azzera a prezzo minimo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* RIGA 2: TUTTE LE 8 SQUADRE AFFIANCATE (COMPATTE A 1 RIGA: SOLO NOME, SENZA VALORE DEI CREDITI) */}
      <div>
        <div className="grid grid-cols-8 gap-0.5 sm:gap-1">
          {(() => {
            const budgets = teams.map(t => t.currentBudget);
            const maxBudget = Math.max(...budgets);
            const minBudget = Math.min(...budgets);
            const hasBudgetDiff = maxBudget > minBudget;

            return teams.map((team, idx) => {
              const isSelected = selectedTeamId === team.id;
              const { canBid } = canTeamBidOnRole(team, player.ruolo, slotConfig, minimumPrice);
              const isAssignedToThis = player.status === 'assigned' && player.assignedTo === team.id;
              const isMaxBudget = hasBudgetDiff && team.currentBudget === maxBudget;
              const isMinBudget = hasBudgetDiff && team.currentBudget === minBudget;

              return (
                <button
                  key={team.id}
                  disabled={!canBid && !isAssignedToThis}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`py-1 px-0.5 sm:px-1 rounded-lg border text-center transition-all flex items-center justify-center select-none h-7 sm:h-8 ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500 shadow-lg'
                      : isMaxBudget && canBid
                      ? 'team-card-max-budget bg-emerald-950/20 border-emerald-500/80 ring-1 ring-emerald-500/40 hover:bg-emerald-900/30'
                      : isMinBudget && canBid
                      ? 'team-card-min-budget bg-rose-950/20 border-rose-500/80 ring-1 ring-rose-500/40 hover:bg-rose-900/30'
                      : canBid
                      ? 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-850 active:scale-95'
                      : 'bg-slate-950/40 border-slate-900 opacity-35 cursor-not-allowed'
                  }`}
                  title={`${team.name} • ${team.currentBudget} crediti residui`}
                >
                  {/* Nome squadra & dot colore (senza riga crediti per recuperare spazio verticale) */}
                  <div className="flex items-center justify-center gap-1 min-w-0 w-full overflow-hidden px-0.5">
                    <span 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="font-extrabold text-[10px] sm:text-[11px] text-white truncate leading-tight tracking-tight">
                      {idx + 1}. {team.name}
                    </span>
                  </div>
                </button>
              );
            });
          })()}
        </div>
      </div>

      {/* RIGA 3: PULSANTI AZIONE COMPATTI */}
      <div className="flex items-center gap-2">
        {player.status === 'assigned' ? (
          <div className="w-full flex gap-2">
            <button
              onClick={handleUnassign}
              className="flex-1 h-8 sm:h-9 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-98 transition-all"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Svincola / Annulla Assegnazione</span>
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedTeamId}
              className="flex-1 h-8 sm:h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Modifica Prezzo / Squadra</span>
            </button>
          </div>
        ) : (
          <>
            {/* ASSEGNA */}
            <button
              onClick={handleAssign}
              disabled={!selectedTeamId}
              className={`flex-1 h-8 sm:h-9 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 select-none ${
                selectedTeamId
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 shadow-emerald-950 cursor-pointer'
                  : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {selectedTeamId
                  ? `ASSEGNA A ${selectedTeam?.name.toUpperCase()} PER ${currentPrice}`
                  : 'SELEZIONA UNA SQUADRA (O PREMI 1-8 DA TASTIERA)'}
              </span>
            </button>

            {/* PULSANTE NEXT COMPATTO */}
            <button
              onClick={handleSkip}
              className="px-4 h-8 sm:h-9 rounded-lg bg-slate-800 hover:bg-amber-950/80 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-amber-300 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
              title="Passa al prossimo calciatore"
            >
              <FastForward className="w-3.5 h-3.5 text-amber-400" />
              <span>Next</span>
            </button>
          </>
        )}
      </div>

    </div>
  );
};
