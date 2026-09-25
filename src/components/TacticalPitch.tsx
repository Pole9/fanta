import React from 'react';
import { Player, Role } from '../types';
import { getTeamTactics, getPlayerSlotId, TacticalSlot, SLOTS_3_5_2 } from '../data/teamTactics';
import { CURRENT_MATCHDAY_NUMBER } from '../data/matchdayData';
import { isTitolarissimo as checkIsTitolarissimo } from '../utils/auctionCalculations';
import { OFFICIAL_PLAYERS } from '../data/officialPlayers';

export type PitchPosition = TacticalSlot;

export const TACTICAL_POSITIONS: TacticalSlot[] = SLOTS_3_5_2;

const roleColors: Record<Role, string> = {
  P: 'bg-amber-500 text-slate-950 font-black',
  D: 'bg-emerald-600 text-white font-black',
  C: 'bg-blue-600 text-white font-black',
  A: 'bg-red-600 text-white font-black',
};

interface TacticalPitchProps {
  player: Player | null;
  className?: string;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({ player, className = '' }) => {
  // Recupera lo schema tattico ufficiale della squadra del calciatore
  const teamTactics = React.useMemo(() => {
    return getTeamTactics(player?.squadra);
  }, [player?.squadra]);

  // Identifica lo slot tattico esatto per il calciatore (es. BASTONI -> b_sx braccetto di difesa a 3)
  const activeSlotId = React.useMemo(() => {
    return getPlayerSlotId(
      player?.nome,
      player?.squadra,
      player?.ruolo,
      player?.ruoloMantra,
      player?.isTq
    );
  }, [player?.nome, player?.squadra, player?.ruolo, player?.ruoloMantra, player?.isTq]);

  // Slot attivo con dettagli
  const activeSlot = React.useMemo(() => {
    if (!activeSlotId) return null;
    return teamTactics.slots.find(s => s.id === activeSlotId) || null;
  }, [teamTactics, activeSlotId]);

  // Descrizione tattica del ruolo per il footer
  const tacticalDescription = React.useMemo(() => {
    if (!player) return 'Seleziona un calciatore per visualizzarne lo schema tattico di squadra.';
    if (activeSlot) return activeSlot.description;
    return `${teamTactics.team} (${teamTactics.formation}) • All. ${teamTactics.coach}`;
  }, [player, activeSlot, teamTactics]);

  // Titolarissimo verificato sui dati 2026/27 (almeno 3/4 o 4/5 gare da titolare)
  const isTitolarissimo = React.useMemo(() => {
    if (!player) return false;
    const off = OFFICIAL_PLAYERS.find(p => p.id === player.id) || player;
    return checkIsTitolarissimo(off);
  }, [player]);

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-1 sm:p-1.5 flex flex-col justify-between shadow-xl h-full ${className}`}>
      {/* HEADER DELLA MAPPA TATTICA SU 2 RIGHE (SQUADRA/SCHEMA IN RIGA 1, CALCIATORE/RUOLO IN RIGA 2) */}
      <div className="pb-0.5 border-b border-slate-800 text-xs mb-0.5 flex-shrink-0 space-y-0.5">
        {/* RIGA 1: SQUADRA, MODULO E ALLENATORE */}
        <div className="flex items-center justify-between gap-1.5 text-white">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] flex-shrink-0">📍</span>
            <span className="font-black uppercase text-[11px] sm:text-xs tracking-wide text-white truncate">
              {teamTactics.team} ({teamTactics.formation})
            </span>
          </div>
          <span className="text-[9.5px] sm:text-[10px] text-slate-300 font-mono flex-shrink-0">
            All. <strong className="text-white font-bold">{teamTactics.coach}</strong>
          </span>
        </div>

        {/* RIGA 2: CALCIATORE, BADGES RUOLO E DETTAGLIO POSIZIONE */}
        {player ? (
          <div className="flex items-center justify-between gap-1.5 pt-0.5 border-t border-slate-800/60 text-[9.5px] sm:text-[10px]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`px-1.5 py-0.2 rounded font-black text-[8.5px] flex-shrink-0 ${roleColors[player.ruolo] || 'bg-slate-800 text-white'}`}>
                {player.ruolo}
              </span>
              {player.ruoloMantra && (
                <span className="px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-bold text-[8.5px] flex-shrink-0">
                  {player.ruoloMantra}
                </span>
              )}
              <span className="font-black text-white uppercase tracking-tight truncate">
                {player.nome}
              </span>
              {isTitolarissimo && (
                <span 
                  className="px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 font-black text-[8.5px] shadow-sm flex-shrink-0"
                  title="Titolarissimo (almeno 3/4 o 4/5 gare da titolare)"
                >
                  T
                </span>
              )}
            </div>
            {activeSlot && (
              <span className="text-[9px] sm:text-[9.5px] font-mono font-black text-amber-950 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/70 border border-amber-500 dark:border-amber-500/50 px-1.5 py-0.5 rounded flex-shrink-0 whitespace-nowrap shadow-sm">
                {activeSlot.name}
              </span>
            )}
          </div>
        ) : (
          <div className="text-[9.5px] text-slate-500 italic font-mono pt-0.5">
            Nessun calciatore selezionato
          </div>
        )}
      </div>

      {/* CAMPO DA CALCIO COMPATTO PER FAR SPAZIO AI COMMENTI DEI PROSSIMI ARRIVI */}
      <div 
        className="relative w-full max-w-[230px] sm:max-w-[245px] mx-auto h-[190px] sm:h-[205px] rounded-lg overflow-hidden border border-emerald-600/40 shadow-inner select-none flex-shrink-0"
        style={{
          background: 'repeating-linear-gradient(180deg, #15803d 0px, #15803d 10px, #166534 10px, #166534 20px)'
        }}
      >
        {/* LINEE DEL CAMPO SVG */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox="0 0 300 400" 
          preserveAspectRatio="none"
        >
          {/* Rettangolo di gioco perimetrale */}
          <rect 
            x="12" y="10" width="276" height="380" 
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" 
          />

          {/* Linea di metà campo */}
          <line 
            x1="12" y1="200" x2="288" y2="200" 
            stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" 
          />

          {/* Cerchio di centrocampo e punto centrale */}
          <circle 
            cx="150" cy="200" r="42" 
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" 
          />
          <circle cx="150" cy="200" r="2.2" fill="rgba(255,255,255,0.9)" />

          {/* AREA DI RIGORE SUPERIORE (ATTACCO) */}
          <rect 
            x="70" y="10" width="160" height="60" 
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" 
          />
          {/* Area piccola superiore */}
          <rect 
            x="105" y="10" width="90" height="22" 
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" 
          />
          {/* Dischetto del rigore superiore */}
          <circle cx="150" cy="48" r="1.8" fill="rgba(255,255,255,0.9)" />
          {/* Mezzaluna superiore */}
          <path 
            d="M 120 70 A 30 30 0 0 0 180 70" 
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" 
          />
          {/* Porta superiore */}
          <rect 
            x="125" y="3" width="50" height="7" 
            fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" 
          />

          {/* AREA DI RIGORE INFERIORE (DIFESA / PORTIERE) */}
          <rect 
            x="70" y="330" width="160" height="60" 
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" 
          />
          {/* Area piccola inferiore */}
          <rect 
            x="105" y="368" width="90" height="22" 
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" 
          />
          {/* Dischetto del rigore inferiore */}
          <circle cx="150" cy="352" r="1.8" fill="rgba(255,255,255,0.9)" />
          {/* Mezzaluna inferiore */}
          <path 
            d="M 120 330 A 30 30 0 0 1 180 330" 
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" 
          />
          {/* Porta inferiore */}
          <rect 
            x="125" y="390" width="50" height="7" 
            fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" 
          />

          {/* Bandierine e archi dei 4 calci d'angolo */}
          <path d="M 12 20 A 10 10 0 0 0 22 10" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
          <path d="M 278 10 A 10 10 0 0 0 288 20" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
          <path d="M 12 380 A 10 10 0 0 0 22 390" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
          <path d="M 278 390 A 10 10 0 0 0 288 380" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
        </svg>

        {/* BOLLINI DELLE POSIZIONI SUL CAMPO DELLO SCHEMA DI SQUADRA */}
        {teamTactics.slots.map(pos => {
          const active = activeSlotId === pos.id;

          return (
            <div
              key={pos.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-auto"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={`${pos.name} (${pos.code})`}
            >
              {active ? (
                /* BOLLINO PIÙ GROSSO PER LA POSIZIONE DEL CALCIATORE SELEZIONATO */
                <div className="relative flex flex-col items-center justify-center group z-30">
                  {/* EFFETTO PULSANTE DI ONDA/PING — rosso per titolarissimi, amber per gli altri */}
                  <span className={`absolute -inset-1 rounded-full opacity-60 animate-ping ${isTitolarissimo ? 'bg-red-400' : 'bg-amber-400'}`} />

                  {/* BOLLINO INGRANDITO AD ALTO CONTRASTO CON CODICE PERFETTAMENTE CENTRATO */}
                  <div className={`relative w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full text-slate-950 font-black flex items-center justify-center text-center leading-none text-[9px] sm:text-[9.5px] tracking-tight whitespace-nowrap select-none border border-slate-950 ${
                    isTitolarissimo
                      ? 'bg-gradient-to-tr from-red-400 via-red-300 to-rose-200 shadow-2xl shadow-red-400 ring-2 ring-red-200'
                      : 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 shadow-2xl shadow-amber-500 ring-2 ring-white'
                  }`}>
                    {pos.code}
                  </div>

                  {/* NOME DEL CALCIATORE SOTTO IL BOLLINO */}
                  {player && (
                    <span className={`absolute top-full mt-0.5 px-1 py-0 rounded font-black text-[7.5px] uppercase tracking-tighter whitespace-nowrap shadow-xl z-40 max-w-[85px] truncate flex items-center gap-0.5 ${
                      isTitolarissimo
                        ? 'bg-red-950/95 border border-red-400 text-red-200 shadow-red-950'
                        : 'bg-[#020617]/95 border border-amber-400 text-amber-300'
                    }`}>
                      {isTitolarissimo && <span className="text-[7px]">⭐</span>}
                      <span className="truncate">{player.nome}</span>
                    </span>
                  )}
                </div>
              ) : (
                /* BOLLINO STANDARD COMPATTO CON CODICE PERFETTAMENTE CENTRATO */
                <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#022c22]/95 border border-white/50 hover:border-white text-emerald-100 hover:text-white font-black text-[7px] sm:text-[7.5px] flex items-center justify-center text-center leading-none shadow transition-all hover:scale-110 whitespace-nowrap select-none">
                  {pos.code}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER DESCRITTIVO DEL RUOLO E DELLO SCHEMA */}
      <div className="mt-0.5 pt-0.5 border-t border-slate-800/80 text-[8.5px] font-mono text-slate-300 truncate">
        <span className="text-amber-400 font-bold mr-1">Ruolo:</span>
        <span className="text-slate-200">{tacticalDescription}</span>
      </div>
    </div>
  );
};
