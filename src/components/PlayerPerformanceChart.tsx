import React from 'react';
import { createPortal } from 'react-dom';
import { Player } from '../types';
import { getPlayerPerformanceHistory, MatchdayHistoryItem, MatchdayStatus } from '../utils/playerMatchHistory';
import { CheckCircle2, Maximize2, Minimize2, X } from 'lucide-react';

interface Props {
  player: Player;
  onToggleExpand?: () => void;
  isExpandedMode?: boolean;
}

export const PlayerPerformanceChart: React.FC<Props> = ({ 
  player, 
  onToggleExpand, 
  isExpandedMode = false 
}) => {
  const { history, kpis } = getPlayerPerformanceHistory(player, 7);
  const [activeMatchday, setActiveMatchday] = React.useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);

  // Gestione tasto ESC se usato come fallback interno
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onToggleExpand) {
          onToggleExpand();
        } else {
          setIsFullscreen(false);
        }
      }
    };

    if (isFullscreen || isExpandedMode) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, isExpandedMode, onToggleExpand]);

  const mv = kpis.mediaVoto;
  const fmv = kpis.fantaMediaVoto;

  const isMvUnder6 = mv !== null && mv < 6.0;
  const isFmvUnder6 = fmv !== null && fmv < 6.0;

  const getStatusLabel = (status: MatchdayStatus): string => {
    switch (status) {
      case 'titolare_completo': return 'Titolare 90\'';
      case 'titolare_sostituito': return 'Titolare sostituito';
      case 'subentrato': return 'Subentrato da panchina';
      case 'uscito_infortunato': return 'Uscito per infortunio';
      case 'senza_voto': return 'Senza Voto (SV)';
      case 'non_giocato_infortunio': return 'Non ha giocato (infortunio)';
      case 'non_ha_giocato': return 'Non a voto';
      case 'futura': return 'Partita in programma';
      default: return '';
    }
  };

  const getBarStyle = (status: MatchdayStatus, _voto: number | null): { style: React.CSSProperties; className: string } => {
    switch (status) {
      case 'titolare_completo':
        return {
          style: { backgroundColor: '#4ade80' },
          className: 'border border-emerald-300'
        };
      case 'titolare_sostituito':
        return {
          style: {
            background: 'repeating-linear-gradient(-45deg, #4ade80, #4ade80 4px, #166534 4px, #166534 8px)'
          },
          className: 'border border-emerald-400'
        };
      case 'subentrato':
        return {
          style: { backgroundColor: '#facc15' },
          className: 'border border-yellow-300'
        };
      case 'uscito_infortunato':
        return {
          style: { backgroundColor: '#a855f7' },
          className: 'border border-purple-400'
        };
      case 'senza_voto':
      case 'non_ha_giocato':
      case 'futura':
      default:
        return {
          style: {},
          className: ''
        };
    }
  };

  const maxScale = 14;

  // =========================================================================
  // MODALITA' ESPANSA INTEGRATA (SOSTITUISCE IL REPORT SENZA APRIRE FINESTRE SOPRA)
  // ZERO SCROLLBAR, ALTEZZA 100% RESPONSIVE E SCALE CORRETTE 0..14
  // =========================================================================
  if (isExpandedMode) {
    return (
      <div className="w-full h-full flex flex-col justify-between space-y-2 sm:space-y-3 overflow-hidden select-none">
        
        {/* 1. SEZIONE KPI COMPATTA (ORIZZONTALE) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 sm:p-2.5 px-3 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Partite a voto:</span>
              <span className="text-sm sm:text-base font-black text-blue-400 font-mono">{kpis.partiteAVoto}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Gol:</span>
              <span className="text-sm sm:text-base font-black text-blue-400 font-mono">{kpis.gol} ⚽</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Assist:</span>
              <span className="text-sm sm:text-base font-black text-blue-400 font-mono">{kpis.assist} 👟</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Media Voto:</span>
              <span className={`text-sm sm:text-base font-black font-mono ${isMvUnder6 ? 'text-rose-500' : 'text-emerald-400'}`}>
                {mv !== null ? mv.toFixed(2) : '-'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Fanta Media:</span>
              <span className={`text-sm sm:text-base font-black font-mono ${isFmvUnder6 ? 'text-rose-500' : 'text-amber-400'}`}>
                {fmv !== null ? fmv.toFixed(2) : '-'}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 font-mono text-[11px]">
              Gol C/T: {kpis.golCasa}/{kpis.golTrasferta}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 font-mono text-[11px]">
              Amm: {kpis.ammonizioni}
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 font-mono text-[11px]">
              Esp: {kpis.espulsioni}
            </span>
          </div>
        </div>

        {/* 2. GRAFICO AD ALTA DEFINIZIONE A TUTTO SCHERMO */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 flex-1 min-h-0 flex flex-col justify-between shadow-xl">
          
          {/* HEADER DEL GRAFICO CON TITOLO E SCALA (NON PIÙ ABSOLUTE: NESSUNA SOVRAPPOSIZIONE) */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 mb-2 border-b border-slate-800/80 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm">
                Istogramma Prestazioni 38 Giornate
              </span>
              <span className="text-xs text-slate-400 font-mono hidden md:inline">
                Scala voti 0 - 14 (Sufficienza evidenziata a 6)
              </span>
            </div>

            {activeMatchday !== null ? (() => {
              const cur = history.find(h => h.matchday === activeMatchday);
              if (!cur) return null;
              return (
                <div className="text-xs font-mono text-amber-300 bg-slate-950 border border-slate-700 px-3 py-1 rounded-lg flex items-center gap-2.5 shadow-inner">
                  <span className="font-bold text-amber-400">G.{cur.matchday}:</span>
                  <span className="font-black text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{cur.matchScore}</span>
                  <span className="text-slate-300">vs <strong>{cur.opponent}</strong> ({cur.isHome ? 'Casa' : 'Trasf.'})</span>
                  {cur.voto !== null && (
                    <span className="text-emerald-400 font-bold ml-1 pl-2 border-l border-slate-800">
                      Voto: {cur.voto} {cur.malus > 0 ? `(Netto ${Math.max(0, cur.voto - cur.malus)})` : ''} | Fanta: {cur.fantaVoto}
                    </span>
                  )}
                </div>
              );
            })() : (
              <span className="text-xs text-slate-500 italic hidden sm:inline">
                Passa con il mouse sulle colonne per visualizzare i dettagli della gara
              </span>
            )}
          </div>

          {/* AREA EFFETTIVA DEL GRAFICO */}
          <div className="relative flex-1 min-h-0 w-full flex items-end pt-4 pb-1">
            
            {/* GRIGLIA ASSE Y (0, 2, 4, 6, 8, 10, 12, 14) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-1">
              {[14, 12, 10, 8, 6, 4, 2, 0].map((val) => (
                <div key={val} className="w-full flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span className="w-6 text-right pr-2 select-none font-bold">{val}</span>
                  <div className={`flex-1 border-b ${
                    val === 6 
                      ? 'border-emerald-500/50 border-dashed' 
                      : 'border-slate-800/80 border-dotted'
                  }`} />
                </div>
              ))}
            </div>

            {/* BARRE ISTOGRAMMA */}
            <div className="relative z-10 w-full h-full flex items-end pl-7 gap-1 sm:gap-1.5">
              {history.map((item) => {
                const isSV = item.status === 'senza_voto';
                const isINF = item.status === 'non_giocato_infortunio';
                const hasVoto = item.voto !== null && item.voto > 0;
                const { style, className } = getBarStyle(item.status, item.voto);
                const isSelected = activeMatchday === item.matchday;

                // Calcolo altezze percentuali sulla scala 0..14
                const netVote = hasVoto ? Math.max(0, item.voto! - item.malus) : 0;
                const netVoteHeightPercent = hasVoto ? (netVote / maxScale) * 100 : 0;
                const malusHeightPercent = hasVoto && item.malus > 0 ? (item.malus / maxScale) * 100 : 0;
                const bonusHeightPercent = hasVoto && item.bonus > 0 ? (item.bonus / maxScale) * 100 : 0;
                const totalBarHeightPercent = Math.min(100, Math.max(0, netVoteHeightPercent + malusHeightPercent + bonusHeightPercent));

                // Proporzioni interne dei singoli segmenti rispetto all'altezza totale della barra
                const bonusSegmentPercent = totalBarHeightPercent > 0 ? (bonusHeightPercent / totalBarHeightPercent) * 100 : 0;
                const malusSegmentPercent = totalBarHeightPercent > 0 ? (malusHeightPercent / totalBarHeightPercent) * 100 : 0;
                const netVoteSegmentPercent = totalBarHeightPercent > 0 ? (netVoteHeightPercent / totalBarHeightPercent) * 100 : 0;

                const isCalloutAbove = totalBarHeightPercent <= 55;

                return (
                  <div 
                    key={item.matchday} 
                    className="flex-1 h-full flex flex-col justify-end items-center relative cursor-pointer"
                    onMouseEnter={() => setActiveMatchday(item.matchday)}
                    onMouseLeave={() => setActiveMatchday(null)}
                    onClick={() => setActiveMatchday(prev => prev === item.matchday ? null : item.matchday)}
                  >
                    {/* CALLOUT FLUTTUANTE: POSIZIONAMENTO ADATTIVO RISPETTO ALLA BARRA PER EVITARE QUALSIASI SOVRAPPOSIZIONE */}
                    <div 
                      style={
                        isCalloutAbove
                          ? { bottom: `calc(${totalBarHeightPercent}% + 10px)` }
                          : { top: `calc(${100 - totalBarHeightPercent}% + 10px)` }
                      }
                      className={`absolute z-50 pointer-events-none transition-all duration-150 ${
                        isSelected 
                          ? 'opacity-100 visible scale-100' 
                          : 'opacity-0 invisible scale-95'
                      } ${
                        item.matchday <= 5 
                          ? 'left-0 translate-x-0' 
                          : item.matchday >= 34 
                          ? 'right-0 translate-x-0' 
                          : 'left-1/2 -translate-x-1/2'
                      }`}
                    >
                      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl shadow-black min-w-[230px] max-w-[270px] text-left text-white font-sans select-none pointer-events-none">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-amber-400 font-mono">G.{item.matchday}</span>
                            <span className="text-xs font-black text-amber-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-700 tracking-wider">
                              {item.matchScore}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                            {item.isHome ? 'Casa' : 'Trasferta'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 flex items-center justify-between pb-1">
                          <span className="text-slate-400">Avversario:</span>
                          <span className="font-bold text-white">
                            {item.opponent} <span className="font-mono text-slate-400 text-[10px]">({item.opponentAbbr})</span>
                          </span>
                        </div>

                        {item.played ? (
                          hasVoto ? (
                            <div className="pt-1 border-t border-slate-800 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400">Voto Base:</span>
                                <span className="font-black text-emerald-400 font-mono text-sm">
                                  {item.voto}
                                  {item.malus > 0 && (
                                    <span className="text-rose-400 font-normal text-xs ml-1">
                                      (Netto: {netVote})
                                    </span>
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs font-mono">
                                <span>
                                  {item.bonus > 0 ? (
                                    <span className="text-cyan-400 font-bold">+{item.bonus} Bonus</span>
                                  ) : (
                                    <span className="text-slate-500">0 Bonus</span>
                                  )}
                                  {item.malus > 0 && (
                                    <span className="text-rose-400 font-bold ml-1.5">-{item.malus} Malus</span>
                                  )}
                                </span>
                                <span className="font-black text-amber-400 text-sm">
                                  Fanta: {item.fantaVoto}
                                </span>
                              </div>

                              {item.bonusMalusText && (
                                <div className="text-[11px] text-slate-200 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-center">
                                  {item.bonusMalusText}
                                </div>
                              )}
                              <div className="text-[10px] text-slate-400 text-right">
                                {getStatusLabel(item.status)}
                              </div>
                            </div>
                          ) : isINF ? (
                            <div className="pt-1 border-t border-slate-800 text-xs text-purple-300 font-bold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                              <span>INF • Non ha giocato per infortunio</span>
                            </div>
                          ) : isSV ? (
                            <div className="pt-1 border-t border-slate-800 text-xs text-amber-300 font-bold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              <span>SV • Senza Voto (subentrato)</span>
                            </div>
                          ) : (
                            <div className="pt-1 border-t border-slate-800 text-xs text-slate-400">
                              Non sceso in campo (panchina)
                            </div>
                          )
                        ) : (
                          <div className="pt-1 border-t border-slate-800 text-xs text-blue-400 font-medium">
                            Partita in programma
                          </div>
                        )}
                      </div>

                      {/* FRECCETTA PUNTATORE ORIENTATA VERSO LA BARRA */}
                      <div 
                        className={`absolute w-3 h-3 bg-slate-900 pointer-events-none ${
                          isCalloutAbove
                            ? '-bottom-1.5 border-r border-b border-slate-700 rotate-45'
                            : '-top-1.5 border-l border-t border-slate-700 rotate-45'
                        } ${
                          item.matchday <= 5 
                            ? 'left-4' 
                            : item.matchday >= 34 
                            ? 'right-4' 
                            : 'left-1/2 -translate-x-1/2'
                        }`}
                      />
                    </div>

                    {/* BARRA O SIGLA: H-FULL RIMANE SUL PARENT PER IL LAYOUT ASSE Y */}
                    {isINF ? (
                      <span 
                        className={`text-[9px] sm:text-[10px] font-black text-purple-400 font-mono mb-1 tracking-tighter transition-all ${
                          isSelected ? 'scale-125 text-purple-200 ring-2 ring-purple-400 rounded px-1' : ''
                        }`} 
                        title={`G.${item.matchday} • INF (${item.matchScore})`}
                      >
                        INF
                      </span>
                    ) : isSV ? (
                      <span 
                        className={`text-[9px] sm:text-[10px] font-black text-amber-300 font-mono mb-1 tracking-tighter transition-all ${
                          isSelected ? 'scale-125 text-amber-100 ring-2 ring-amber-400 rounded px-1' : ''
                        }`}
                        title={`G.${item.matchday} • SV (${item.matchScore})`}
                      >
                        SV
                      </span>
                    ) : hasVoto ? (
                      /* BARRA IMPILATA: ALTEZZA TOTALBARHEIGHTPERCENT (RING ESCLUSIVAMENTE SULLA BARRA REALE) */
                      <div 
                        style={{ height: `${totalBarHeightPercent}%` }}
                        className={`w-full flex flex-col justify-end items-stretch transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-amber-400 brightness-125 z-20 shadow-xl rounded-t-sm scale-x-110' : 'hover:brightness-110'
                        }`}
                        title={`G.${item.matchday} - ${item.matchScore}: Voto Base ${item.voto}${item.malus > 0 ? ` -${item.malus} Malus (Netto ${netVote})` : ''}${item.bonus > 0 ? ` +${item.bonus} Bonus` : ''} = Fanta ${item.fantaVoto}`}
                      >
                        {/* 1. BONUS IN CIMA (CIANO) */}
                        {bonusHeightPercent > 0 && (
                          <div 
                            style={{ height: `${bonusSegmentPercent}%` }}
                            className="w-full bg-cyan-400 border-x border-t border-cyan-300 rounded-t-sm shadow-sm"
                            title={`Bonus: +${item.bonus}`}
                          />
                        )}

                        {/* 2. MALUS (ROSSO VIVO - ERODE IL VOTO ORIGINARIO DALLA CIMA) */}
                        {malusHeightPercent > 0 && (
                          <div 
                            style={{ height: `${malusSegmentPercent}%` }}
                            className={`w-full bg-rose-500 border-x border-t border-rose-400 shadow-sm ${bonusHeightPercent <= 0 ? 'rounded-t-sm' : ''}`}
                            title={`Malus: -${item.malus} (Voto Base ${item.voto} -> Netto ${netVote})`}
                          />
                        )}

                        {/* 3. VOTO NETTO (ALLA BASE - COLORE STATO) */}
                        <div
                          style={{ height: `${netVoteSegmentPercent}%`, ...style }}
                          className={`w-full shadow-md ${className} ${bonusHeightPercent <= 0 && malusHeightPercent <= 0 ? 'rounded-t-sm' : ''}`}
                          title={`Voto Netto: ${netVote} (Voto Base: ${item.voto})`}
                        />
                      </div>
                    ) : (
                      <div 
                        className={`w-full h-1 rounded-full mb-1 transition-all ${
                          isSelected ? 'bg-amber-400 h-1.5' : 'bg-slate-800 hover:bg-slate-700'
                        }`} 
                      />
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* ASSE X DEL GRAFICO CON TUTTE LE GIORNATE CHIAVE */}
          <div className="flex justify-between pl-7 pt-2 text-xs font-mono text-slate-400 font-bold border-t border-slate-800">
            <span>1</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
            <span>25</span>
            <span>30</span>
            <span>35</span>
            <span>38</span>
          </div>

        </div>

        {/* 3. FOOTER COMPATTO: LEGENDA UFFICIALE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 px-3 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-300 font-medium flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 border border-emerald-300 flex-shrink-0" />
              <span>Titolare 90'</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span 
                className="w-2.5 h-2.5 rounded-sm border border-emerald-400 flex-shrink-0"
                style={{
                  background: 'repeating-linear-gradient(-45deg, #4ade80, #4ade80 2px, #166534 2px, #166534 4px)'
                }}
              />
              <span>Titolare sost.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400 border border-yellow-300 flex-shrink-0" />
              <span>Subentrato</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 border border-cyan-300 shadow-sm flex-shrink-0" />
              <span className="text-cyan-300 font-semibold">Bonus (+Gol, +Ass)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 border border-rose-400 shadow-sm flex-shrink-0" />
              <span className="text-rose-300 font-semibold">Malus (erode voto base)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-300 font-mono">SV</span>
              <span>Senza voto</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-400 font-mono">INF</span>
              <span>Infortunato</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            {activeMatchday ? `G.${activeMatchday} attiva` : 'Passa con il mouse sulle colonne'}
          </div>
        </div>

      </div>
    );
  }

  // =========================================================================
  // MODALITA' NORMALE (SCHEDA REPORT 2 COLONNE)
  // =========================================================================
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-3 shadow-md select-none">
      
      {/* 1. SEZIONE KPI STATISTICI */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3 space-y-2.5">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center pb-2.5 border-b border-slate-800">
          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block w-full">Partite a voto</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base sm:text-xl font-black text-blue-400">{kpis.partiteAVoto}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block w-full">Gol</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base sm:text-xl font-black text-blue-400">{kpis.gol}</span>
              <span className="text-xs">⚽</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block w-full">Assist</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base sm:text-xl font-black text-blue-400">{kpis.assist}</span>
              <span className="text-xs">👟</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block w-full">Media Voto</span>
            <div className="mt-0.5">
              <span className={`text-base sm:text-xl font-black ${
                isMvUnder6 
                  ? 'text-rose-500 font-black' 
                  : 'text-emerald-400 font-black'
              }`}>
                {mv !== null ? mv.toFixed(2) : '-'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block w-full">Fanta Media</span>
            <div className="mt-0.5">
              <span className={`text-base sm:text-xl font-black ${
                isFmvUnder6 
                  ? 'text-rose-500 font-black' 
                  : 'text-amber-400 font-black'
              }`}>
                {fmv !== null ? fmv.toFixed(2) : '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Gol casa/trasferta</span>
            <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 font-mono font-bold text-[10px]">
              {kpis.golCasa}/{kpis.golTrasferta}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Ammonizioni</span>
            <span className="px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 font-mono font-bold text-[10px]">
              {kpis.ammonizioni}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Rigori segnati/tot.</span>
            <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 font-mono font-bold text-[10px]">
              {kpis.rigoriSegnati}/{kpis.rigoriTotali}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Espulsioni</span>
            <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 font-mono font-bold text-[10px]">
              {kpis.espulsioni}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Autoreti</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[10px]">
              {kpis.autoreti}
            </span>
          </div>
        </div>
      </div>

      {/* 2. GRAFICO VOTO E FANTAVOTO INLINE */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between min-h-[34px] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider">
              Voto e Fantavoto
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              38 giornate Serie A
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="min-w-[190px] h-[26px] flex items-center justify-end">
              {activeMatchday !== null ? (() => {
                const cur = history.find(h => h.matchday === activeMatchday);
                if (!cur) return null;
                return (
                  <div className="text-[11px] font-mono text-amber-300 bg-slate-900 border border-slate-700/80 px-2 py-0.5 rounded flex items-center gap-1.5 shadow-sm">
                    <span className="font-bold text-amber-400">G.{cur.matchday}:</span>
                    <span className="font-black text-white">{cur.matchScore}</span>
                    {cur.voto !== null && (
                      <span className="text-emerald-400 font-bold ml-1">
                        Voto: {cur.voto} {cur.malus > 0 ? `(Netto ${Math.max(0, cur.voto - cur.malus)})` : ''} | Fanta: {cur.fantaVoto}
                      </span>
                    )}
                  </div>
                );
              })() : (
                <span className="text-[10px] text-slate-500 italic hidden md:inline">
                  Evidenzia una giornata per dettagli
                </span>
              )}
            </div>

            {/* PULSANTE ESPANDI: APRE LA SCHEDA INGRANDITA AL POSTO DI QUELLA NORMALE */}
            <button
              type="button"
              onClick={onToggleExpand ? onToggleExpand : () => setIsFullscreen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-bold transition-all shadow-sm cursor-pointer"
              title="Espandi il grafico a schermo intero"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Tutto schermo</span>
            </button>
          </div>
        </div>

        {/* CONTAINER GRAFICO INLINE (ALTEZZA 120px) */}
        <div className="relative bg-slate-900/60 rounded-xl p-3 pt-24 border border-slate-800">
          <div className="relative h-[120px] flex items-end">
            
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-1">
              {[14, 12, 10, 8, 6, 4, 2, 0].map((val) => (
                <div key={val} className="w-full flex items-center justify-between text-[9px] text-slate-600 font-mono">
                  <span className="w-5 text-right pr-2 select-none">{val}</span>
                  <div className={`flex-1 border-b ${
                    val === 6 
                      ? 'border-emerald-500/40 border-dashed' 
                      : 'border-slate-800/60 border-dotted'
                  }`} />
                </div>
              ))}
            </div>

            <div className="relative z-10 w-full h-full flex items-end pl-6 gap-[2px]">
              {history.map((item) => {
                const isSV = item.status === 'senza_voto';
                const isINF = item.status === 'non_giocato_infortunio';
                const hasVoto = item.voto !== null && item.voto > 0;
                const { style, className } = getBarStyle(item.status, item.voto);
                const isSelected = activeMatchday === item.matchday;

                const netVote = hasVoto ? Math.max(0, item.voto! - item.malus) : 0;
                const netVoteHeightPx = hasVoto ? (netVote / maxScale) * 120 : 0;
                const malusHeightPx = hasVoto && item.malus > 0 ? (item.malus / maxScale) * 120 : 0;
                const bonusHeightPx = hasVoto && item.bonus > 0 ? (item.bonus / maxScale) * 120 : 0;

                return (
                  <div 
                    key={item.matchday} 
                    className="flex-1 h-full flex flex-col justify-end items-center relative cursor-pointer"
                    onMouseEnter={() => setActiveMatchday(item.matchday)}
                    onMouseLeave={() => setActiveMatchday(null)}
                    onClick={() => setActiveMatchday(prev => prev === item.matchday ? null : item.matchday)}
                  >
                    {/* CALLOUT INLINE */}
                    <div 
                      className={`absolute bottom-full mb-2 z-50 pointer-events-none transition-all duration-150 ${
                        isSelected 
                          ? 'opacity-100 visible scale-100' 
                          : 'opacity-0 invisible scale-95'
                      } ${
                        item.matchday <= 3 
                          ? 'left-0 translate-x-0' 
                          : item.matchday >= 36 
                          ? 'right-0 translate-x-0' 
                          : 'left-1/2 -translate-x-1/2'
                      }`}
                    >
                      <div className="bg-slate-900/98 backdrop-blur-md border border-slate-700 rounded-lg p-2.5 shadow-2xl shadow-black/95 min-w-[215px] max-w-[250px] text-left text-white font-sans select-none pointer-events-none">
                        <div className="flex items-center justify-between gap-1.5 border-b border-slate-800 pb-1.5 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-amber-400 font-mono">G.{item.matchday}</span>
                            <span className="text-[11px] font-black text-amber-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-700/80 tracking-wider shadow-inner">
                              {item.matchScore}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase tracking-tighter">
                            {item.isHome ? 'Casa' : 'Trasf.'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300 flex items-center justify-between pb-1">
                          <span className="text-slate-400">Avversario:</span>
                          <span className="font-bold text-white truncate max-w-[130px]">
                            {item.opponent} <span className="font-mono text-slate-400 text-[10px]">({item.opponentAbbr})</span>
                          </span>
                        </div>

                        {item.played ? (
                          hasVoto ? (
                            <div className="pt-1 border-t border-slate-800/80 space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">Voto Base:</span>
                                <span className="font-black text-emerald-400 font-mono">
                                  {item.voto}
                                  {item.malus > 0 && (
                                    <span className="text-rose-400 font-normal text-[10px] ml-1">
                                      (Netto: {netVote})
                                    </span>
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span>
                                  {item.bonus > 0 ? (
                                    <span className="text-cyan-400 font-bold">+{item.bonus} Bonus</span>
                                  ) : (
                                    <span className="text-slate-500">0 Bonus</span>
                                  )}
                                  {item.malus > 0 && (
                                    <span className="text-rose-400 font-bold ml-1.5">-{item.malus} Malus</span>
                                  )}
                                </span>
                                <span className="font-black text-amber-400 text-xs">
                                  Fanta: {item.fantaVoto}
                                </span>
                              </div>

                              {item.bonusMalusText && (
                                <div className="text-[10px] text-slate-200 font-semibold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-center">
                                  {item.bonusMalusText}
                                </div>
                              )}
                              <div className="text-[9px] text-slate-400 text-right">
                                {getStatusLabel(item.status)}
                              </div>
                            </div>
                          ) : isINF ? (
                            <div className="pt-1 border-t border-slate-800/80 text-[10px] text-purple-300 font-bold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse flex-shrink-0" />
                              <span>INF • Non ha giocato per infortunio</span>
                            </div>
                          ) : isSV ? (
                            <div className="pt-1 border-t border-slate-800/80 text-[10px] text-amber-300 font-bold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                              <span>SV • Senza Voto (subentrato)</span>
                            </div>
                          ) : (
                            <div className="pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                              Non sceso in campo (panchina)
                            </div>
                          )
                        ) : (
                          <div className="pt-1 border-t border-slate-800/80 text-[10px] text-blue-400 font-medium">
                            Partita in programma
                          </div>
                        )}
                      </div>

                      <div 
                        className={`absolute -bottom-1 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45 pointer-events-none ${
                          item.matchday <= 3 
                            ? 'left-3' 
                            : item.matchday >= 36 
                            ? 'right-3' 
                            : 'left-1/2 -translate-x-1/2'
                        }`}
                      />
                    </div>

                    {isINF ? (
                      <span 
                        className={`text-[7.5px] font-black text-purple-400 font-mono mb-0.5 tracking-tighter transition-all ${
                          isSelected ? 'scale-125 text-purple-300 ring-1 ring-purple-400 rounded px-0.5' : ''
                        }`} 
                        title={`G.${item.matchday} • INF (${item.matchScore})`}
                      >
                        INF
                      </span>
                    ) : isSV ? (
                      <span 
                        className={`text-[8px] font-black text-amber-300 font-mono mb-0.5 tracking-tighter transition-all ${
                          isSelected ? 'scale-125 text-amber-200 ring-1 ring-amber-400 rounded px-0.5' : ''
                        }`}
                        title={`G.${item.matchday} • SV (${item.matchScore})`}
                      >
                        SV
                      </span>
                    ) : hasVoto ? (
                      <div 
                        className={`w-full flex flex-col justify-end items-stretch transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-amber-400 brightness-125 z-20 shadow-lg rounded-t-sm' : 'hover:brightness-110'
                        }`}
                        title={`G.${item.matchday} - ${item.matchScore}: Voto Base ${item.voto}${item.malus > 0 ? ` -${item.malus} Malus (Netto ${netVote})` : ''}${item.bonus > 0 ? ` +${item.bonus} Bonus` : ''} = Fanta ${item.fantaVoto}`}
                      >
                        {/* 1. BONUS IN CIMA */}
                        {bonusHeightPx > 0 && (
                          <div 
                            style={{ height: `${bonusHeightPx}px` }}
                            className="w-full bg-cyan-400 border-x border-t border-cyan-300 rounded-t-sm shadow-sm"
                            title={`Bonus: +${item.bonus}`}
                          />
                        )}

                        {/* 2. MALUS (ERODE DALLA CIMA) */}
                        {malusHeightPx > 0 && (
                          <div 
                            style={{ height: `${malusHeightPx}px` }}
                            className={`w-full bg-rose-500 border-x border-t border-rose-400 shadow-sm ${bonusHeightPx <= 0 ? 'rounded-t-sm' : ''}`}
                            title={`Malus: -${item.malus} (Voto Base ${item.voto} -> Netto ${netVote})`}
                          />
                        )}

                        {/* 3. VOTO NETTO */}
                        <div
                          style={{ height: `${netVoteHeightPx}px`, ...style }}
                          className={`w-full shadow-sm ${className} ${bonusHeightPx <= 0 && malusHeightPx <= 0 ? 'rounded-t-sm' : ''}`}
                          title={`Voto Netto: ${netVote} (Voto Base: ${item.voto})`}
                        />
                      </div>
                    ) : (
                      <div 
                        className={`w-full h-0.5 rounded-full mb-0.5 transition-all ${
                          isSelected ? 'bg-amber-400 h-1' : 'bg-slate-800/40 hover:bg-slate-700'
                        }`} 
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pl-6 pt-1.5 text-[10px] font-mono text-slate-400 font-bold border-t border-slate-800">
            <span>1</span>
            <span>10</span>
            <span>19</span>
            <span>30</span>
            <span>38</span>
          </div>
        </div>

        {/* LEGENDA INLINE */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-[10px] pt-1 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 border border-emerald-300 flex-shrink-0" />
            <span>Titolare 90'</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-sm border border-emerald-400 flex-shrink-0"
              style={{
                background: 'repeating-linear-gradient(-45deg, #4ade80, #4ade80 2px, #166534 2px, #166534 4px)'
              }}
            />
            <span>Titolare sost.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400 border border-yellow-300 flex-shrink-0" />
            <span>Subentrato</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 border border-cyan-300 shadow-sm flex-shrink-0" />
            <span className="text-cyan-300 font-semibold">Bonus (+Gol, +Ass)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 border border-rose-400 shadow-sm flex-shrink-0" />
            <span className="text-rose-300 font-semibold">Malus (erode voto base)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-amber-300 font-mono">SV</span>
            <span>Senza voto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-purple-400 font-mono">INF</span>
            <span>Infortunato</span>
          </div>
        </div>
      </div>

      {/* FALLBACK MODALITA' PORTAL SE NON USATO CON onToggleExpand */}
      {isFullscreen && !onToggleExpand && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col p-3 sm:p-6 overflow-hidden select-none">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-xl font-black text-white">{player.nome} - {player.squadra}</h2>
              <button 
                type="button" 
                onClick={() => setIsFullscreen(false)} 
                className="p-1.5 rounded-lg bg-slate-800 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 pt-4">
              <PlayerPerformanceChart player={player} isExpandedMode={true} onToggleExpand={() => setIsFullscreen(false)} />
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
