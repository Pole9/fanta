import React from 'react';
import { createPortal } from 'react-dom';
import { Player } from '../types';
import { getPlayerPerformanceHistory, MatchdayHistoryItem, MatchdayStatus } from '../utils/playerMatchHistory';
import { CheckCircle2, Trophy, Award, Maximize2, Minimize2, X, Calendar, Activity } from 'lucide-react';

interface Props {
  player: Player;
}

export const PlayerPerformanceChart: React.FC<Props> = ({ player }) => {
  const { history, kpis, isEstimatedSeasonSplit } = getPlayerPerformanceHistory(player, 7);
  const [activeMatchday, setActiveMatchday] = React.useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);

  // Gestione tasto ESC e blocco scroll quando in modalità tutto schermo
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const mv = kpis.mediaVoto;
  const fmv = kpis.fantaMediaVoto;

  const isMvUnder6 = mv !== null && mv < 6.0;
  const isFmvUnder6 = fmv !== null && fmv < 6.0;

  const getRoleBadge = (ruolo: string) => {
    switch (ruolo) {
      case 'P': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'D': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'C': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'A': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

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

  // Stili e classi per l'istogramma in base alle 5 condizioni dell'utente
  const getBarStyle = (status: MatchdayStatus, voto: number | null): { style: React.CSSProperties; className: string } => {
    switch (status) {
      case 'titolare_completo':
        // 1) Partito titolare e non sostituito: verde chiaro solido
        return {
          style: { backgroundColor: '#4ade80' },
          className: 'border border-emerald-300'
        };
      case 'titolare_sostituito':
        // 2) Partito titolare e sostituito: verde chiaro a righe diagonali
        return {
          style: {
            background: 'repeating-linear-gradient(-45deg, #4ade80, #4ade80 4px, #166534 4px, #166534 8px)'
          },
          className: 'border border-emerald-400'
        };
      case 'subentrato':
        // 3) Entrato da panchina: giallo
        return {
          style: { backgroundColor: '#facc15' },
          className: 'border border-yellow-300'
        };
      case 'uscito_infortunato':
        // 5) Uscito per infortunio: viola
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

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-3 shadow-md select-none">
      
      {/* 1. SEZIONE KPI STATISTICI (Fedele al layout di Fantacalcio.it) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3 space-y-2.5">
        
        {/* KPI PRINCIPALI: PARTITE A VOTO, GOL, ASSIST, MV, FMV */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center pb-2.5 border-b border-slate-800">
          
          {/* PARTITE A VOTO */}
          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block w-full">Partite a voto</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base sm:text-xl font-black text-blue-400">{kpis.partiteAVoto}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            </div>
          </div>

          {/* GOL */}
          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block w-full">Gol</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base sm:text-xl font-black text-blue-400">{kpis.gol}</span>
              <span className="text-xs">⚽</span>
            </div>
          </div>

          {/* ASSIST */}
          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block w-full">Assist</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base sm:text-xl font-black text-blue-400">{kpis.assist}</span>
              <span className="text-xs">👟</span>
            </div>
          </div>

          {/* MEDIA VOTO (ROSSA SE SOTTO AL 6) */}
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

          {/* FANTA MEDIA VOTO (ROSSA SE SOTTO AL 6) */}
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

        {/* DETTAGLI ACCESSORI: GOL C/T, AMMONIZIONI, RIGORI, ESPULSIONI, AUTORETI */}
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

      {/* 2. GRAFICO VOTO E FANTAVOTO (38 GIORNATE CON ISTOGRAMMA PERSONALIZZATO) */}
      <div className="space-y-1.5">
        {/* INTESTAZIONE GRAFICO CON BADGE, RIEPILOGO GIORNATA ATTIVA E TASTO FULLSCREEN */}
        <div className="flex items-center justify-between min-h-[34px] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider">
              Voto e Fantavoto
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Stagione Serie A (38 Giornate{isEstimatedSeasonSplit ? ' • Ripartizione voti stagionale' : ''})
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* LIVE PREVIEW GIORNATA CON ALTEZZA E LARGHEZZA STABILE (ANTI-GLITCH) */}
            <div className="h-6 flex items-center min-w-[160px] sm:min-w-[210px] justify-end">
              {activeMatchday !== null ? (() => {
                const cur = history.find(h => h.matchday === activeMatchday);
                if (!cur) return null;
                return (
                  <div className="text-[11px] font-mono text-amber-300 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded flex items-center gap-2 shadow-sm">
                    <span className="font-bold text-amber-400">G.{cur.matchday}:</span>
                    <span className="font-black text-white">{cur.matchScore}</span>
                    {cur.voto !== null && (
                      <span className="text-emerald-400 font-bold ml-1">V: {cur.voto}</span>
                    )}
                  </div>
                );
              })() : (
                <span className="text-[10px] text-slate-500 italic hidden md:inline">
                  Evidenzia una giornata per dettagli
                </span>
              )}
            </div>

            {/* PULSANTE ESPANDI A TUTTO SCHERMO */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-bold transition-all shadow-sm cursor-pointer"
              title="Espandi il grafico a tutto schermo"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Tutto schermo</span>
            </button>
          </div>
        </div>

        {/* CONTAINER GRAFICO CON ASSE Y ED ASSE X (PT-24 PER ALLOGGIARE CALLOUT SENZA GLITCH) */}
        <div className="relative bg-slate-900/60 rounded-xl p-3 pt-24 border border-slate-800">
          
          {/* ALTEZZA DEL GRAFICO: 120px */}
          <div className="relative h-[120px] flex items-end">
            
            {/* GRIGLIA SFONDO ASSE Y (0, 2, 4, 6, 8, 10, 12, 14) */}
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

            {/* BARRE ISTOGRAMMA IMPILATE PER LE 38 GIORNATE */}
            <div className="relative z-10 w-full h-full flex items-end pl-6 gap-[2px]">
              {history.map((item) => {
                const isSV = item.status === 'senza_voto';
                const isINF = item.status === 'non_giocato_infortunio';
                const hasVoto = item.voto !== null && item.voto > 0;
                const { style, className } = getBarStyle(item.status, item.voto);
                const isSelected = activeMatchday === item.matchday;

                // Calcolo altezze in pixel per stack: Voto base, Malus (rosso) e Bonus (ciano)
                const voteHeightPx = hasVoto ? (item.voto! / maxScale) * 120 : 0;
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
                    {/* CALLOUT FLUTTUANTE CON RISULTATO PARTITA, BONUS E MALUS */}
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
                        
                        {/* RIGA 1: BADGE GIORNATA + MATCH SCORE IN EVIDENZA (ES. MIL-LAZ 3-2) */}
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

                        {/* RIGA 2: AVVERSARIO */}
                        <div className="text-[11px] text-slate-300 flex items-center justify-between pb-1">
                          <span className="text-slate-400">Avversario:</span>
                          <span className="font-bold text-white truncate max-w-[130px]">
                            {item.opponent} <span className="font-mono text-slate-400 text-[10px]">({item.opponentAbbr})</span>
                          </span>
                        </div>

                        {/* RIGA 3: DETTAGLIO PRESTAZIONE CON VOTO, BONUS E MALUS SEPARATI */}
                        {item.played ? (
                          hasVoto ? (
                            <div className="pt-1 border-t border-slate-800/80 space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">Voto Base:</span>
                                <span className="font-black text-emerald-400 font-mono">{item.voto}</span>
                              </div>

                              {/* INDICATORI BONUS E MALUS */}
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

                      {/* FRECCETTA / BECCUCCIO VERSO IL BASSO PUNTATO SULLA BARRA */}
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

                    {/* SE NON HA GIOCATO PER INFORTUNIO: SIGLA INF */}
                    {isINF ? (
                      <span 
                        className={`text-[7.5px] font-black text-purple-400 font-mono mb-0.5 tracking-tighter transition-all ${
                          isSelected ? 'scale-125 text-purple-300 ring-1 ring-purple-400 rounded px-0.5' : ''
                        }`} 
                        title={`G.${item.matchday} • Non ha giocato per infortunio (${item.matchScore})`}
                      >
                        INF
                      </span>
                    ) : isSV ? (
                      /* SE SENZA VOTO (SV): NO ISTOGRAMMA, METTI LA SIGLA SV */
                      <span 
                        className={`text-[8px] font-black text-amber-300 font-mono mb-0.5 tracking-tighter transition-all ${
                          isSelected ? 'scale-125 text-amber-200 ring-1 ring-amber-400 rounded px-0.5' : ''
                        }`}
                        title={`G.${item.matchday} • SV (${item.matchScore})`}
                      >
                        SV
                      </span>
                    ) : hasVoto ? (
                      /* COLONNA IMPILATA: BONUS (CIANO IN CIMA) + MALUS (ROSSO AL CENTRO) + VOTO BASE */
                      <div 
                        className={`w-full flex flex-col justify-end items-stretch transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-amber-400 brightness-125 z-20 shadow-lg rounded-t-sm' : 'hover:brightness-110'
                        }`}
                        title={`G.${item.matchday} - ${item.matchScore}: Voto ${item.voto}${item.bonus > 0 ? ` +${item.bonus} Bonus` : ''}${item.malus > 0 ? ` -${item.malus} Malus` : ''} = Fanta ${item.fantaVoto}`}
                      >
                        {/* 1. SEGMENTO BONUS IN CIMA (CIANO/AZZURRO) */}
                        {bonusHeightPx > 0 && (
                          <div 
                            style={{ height: `${bonusHeightPx}px` }}
                            className="w-full bg-cyan-400 border-x border-t border-cyan-300 rounded-t-sm shadow-sm"
                            title={`Bonus: +${item.bonus}`}
                          />
                        )}

                        {/* 2. SEGMENTO MALUS (ROSSO VIVO) */}
                        {malusHeightPx > 0 && (
                          <div 
                            style={{ height: `${malusHeightPx}px` }}
                            className={`w-full bg-rose-500 border-x border-t border-rose-400 shadow-sm ${bonusHeightPx <= 0 ? 'rounded-t-sm' : ''}`}
                            title={`Malus: -${item.malus}`}
                          />
                        )}

                        {/* 3. SEGMENTO VOTO BASE (ALLA BASE - COLORE STATO) */}
                        <div
                          style={{ height: `${voteHeightPx}px`, ...style }}
                          className={`w-full shadow-sm ${className} ${bonusHeightPx <= 0 && malusHeightPx <= 0 ? 'rounded-t-sm' : ''}`}
                          title={`Voto Base: ${item.voto}`}
                        />
                      </div>
                    ) : (
                      /* GIORNATE FUTURE O NON A VOTO */
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

          {/* ASSE X: GIORNATE CHIAVE (1, 10, 19, 30, 38) COME SU FANTACALCIO */}
          <div className="flex justify-between pl-6 pt-1.5 text-[10px] font-mono text-slate-400 font-bold border-t border-slate-800">
            <span>1</span>
            <span>10</span>
            <span>19</span>
            <span>30</span>
            <span>38</span>
          </div>

        </div>

        {/* LEGENDA UFFICIALE COLORAZIONE ISTOGRAMMA INCLUSI BONUS E MALUS */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-[10px] pt-1 text-slate-300 font-medium">
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

          {/* BONUS (CIANO/AZZURRO) */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 border border-cyan-300 shadow-sm flex-shrink-0" />
            <span className="text-cyan-300 font-semibold">Bonus (+Gol, +Ass)</span>
          </div>

          {/* MALUS (ROSSO) */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 border border-rose-400 shadow-sm flex-shrink-0" />
            <span className="text-rose-300 font-semibold">Malus (-Amm, -Esp)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-amber-300 font-mono">SV</span>
            <span>Senza voto</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 border border-purple-400 flex-shrink-0" />
            <span>Uscito per infortunio</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-purple-400 font-mono">INF</span>
            <span>Non ha giocato (infortunio)</span>
          </div>
        </div>

      </div>

      {/* 3. MODALITA' A TUTTO SCHERMO ESPANSA (PORTAL) */}
      {isFullscreen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/98 backdrop-blur-2xl flex flex-col p-3 sm:p-6 overflow-y-auto animate-fadeIn select-none">
          <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col space-y-4">
            
            {/* HEADER FULLSCREEN: INFO CALCIATORE + CONTROLLI CHIUDI */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-lg font-black text-sm border shadow-sm ${getRoleBadge(player.ruolo)}`}>
                  {player.ruolo}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                      {player.nome}
                    </h2>
                    <span className="text-sm font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      {player.squadra}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Cronistoria Ufficiale 38 Giornate Serie A • Modalità a Tutto Schermo
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-sm"
                  title="Riduci a dimensione normale (ESC)"
                >
                  <Minimize2 className="w-4 h-4 text-blue-400" />
                  <span className="hidden sm:inline">Riduci</span>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1 py-0.5 rounded border border-slate-800">ESC</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 border border-slate-700 transition-colors cursor-pointer"
                  title="Chiudi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* SEZIONE KPI STATISTICI FULLSCREEN */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-3 shadow-lg">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pb-3 border-b border-slate-800">
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Partite a voto</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-blue-400">{kpis.partiteAVoto}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Gol Totali</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-blue-400">{kpis.gol}</span>
                    <span className="text-sm">⚽</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Assist</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-blue-400">{kpis.assist}</span>
                    <span className="text-sm">👟</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Media Voto</span>
                  <div className="mt-1">
                    <span className={`text-xl sm:text-2xl font-black ${isMvUnder6 ? 'text-rose-500' : 'text-emerald-400'}`}>
                      {mv !== null ? mv.toFixed(2) : '-'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-400 font-medium">Fanta Media</span>
                  <div className="mt-1">
                    <span className={`text-xl sm:text-2xl font-black ${isFmvUnder6 ? 'text-rose-500' : 'text-amber-400'}`}>
                      {fmv !== null ? fmv.toFixed(2) : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* KPI ACCESSORI IN FULLSCREEN */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-slate-300">
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Gol C/T:</span>
                  <span className="font-mono font-bold text-blue-300">{kpis.golCasa}/{kpis.golTrasferta}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Ammonizioni:</span>
                  <span className="font-mono font-bold text-amber-300">{kpis.ammonizioni} 🟨</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Espulsioni:</span>
                  <span className="font-mono font-bold text-rose-300">{kpis.espulsioni} 🟥</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Rigori s/tot:</span>
                  <span className="font-mono font-bold text-blue-300">{kpis.rigoriSegnati}/{kpis.rigoriTotali}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Autoreti:</span>
                  <span className="font-mono font-bold text-slate-400">{kpis.autoreti}</span>
                </div>
              </div>
            </div>

            {/* GRAFICO FULLSCREEN AD ALTA DEFINIZIONE */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex-1 flex flex-col space-y-3 shadow-xl">
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold text-xs uppercase tracking-wider">
                    Istogramma Prestazioni 38 Giornate
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    Scala voti 0 - 14 (Sufficienza evidenziata a 6)
                  </span>
                </div>

                {activeMatchday !== null && (() => {
                  const cur = history.find(h => h.matchday === activeMatchday);
                  if (!cur) return null;
                  return (
                    <div className="text-xs font-mono text-amber-300 bg-slate-950 border border-slate-700 px-3 py-1 rounded-lg flex items-center gap-2 shadow-inner">
                      <span className="font-bold text-amber-400">G.{cur.matchday}:</span>
                      <span className="font-black text-white">{cur.matchScore}</span>
                      <span className="text-slate-400">vs {cur.opponent} ({cur.isHome ? 'Casa' : 'Trasferta'})</span>
                      {cur.voto !== null && (
                        <span className="text-emerald-400 font-bold ml-1.5">Voto: {cur.voto} | Fanta: {cur.fantaVoto}</span>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* CONTAINER GRAFICO ESPANSO: ALTEZZA 280px / 340px CON PT-24 PER CALLOUT */}
              <div className="relative bg-slate-950/90 rounded-xl p-4 pt-24 border border-slate-800 flex-1 min-h-[280px] sm:min-h-[340px] flex flex-col justify-end">
                
                <div className="relative h-[220px] sm:h-[280px] flex items-end">
                  
                  {/* GRIGLIA ASSE Y FULLSCREEN */}
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

                  {/* BARRE ISTOGRAMMA FULLSCREEN (LARGHEZZA E SPAZIATURA MAGGIORATA CON STACK BONUS/MALUS) */}
                  <div className="relative z-10 w-full h-full flex items-end pl-7 gap-1 sm:gap-1.5">
                    {history.map((item) => {
                      const isSV = item.status === 'senza_voto';
                      const isINF = item.status === 'non_giocato_infortunio';
                      const hasVoto = item.voto !== null && item.voto > 0;
                      const { style, className } = getBarStyle(item.status, item.voto);
                      const isSelected = activeMatchday === item.matchday;

                      // Calcolo altezze percentuali rispetto a maxScale
                      const voteHeightPercent = hasVoto ? (item.voto! / maxScale) * 100 : 0;
                      const malusHeightPercent = hasVoto && item.malus > 0 ? (item.malus / maxScale) * 100 : 0;
                      const bonusHeightPercent = hasVoto && item.bonus > 0 ? (item.bonus / maxScale) * 100 : 0;

                      return (
                        <div 
                          key={item.matchday} 
                          className="flex-1 h-full flex flex-col justify-end items-center relative cursor-pointer"
                          onMouseEnter={() => setActiveMatchday(item.matchday)}
                          onMouseLeave={() => setActiveMatchday(null)}
                          onClick={() => setActiveMatchday(prev => prev === item.matchday ? null : item.matchday)}
                        >
                          {/* CALLOUT FULLSCREEN AD ALTA DEFINIZIONE */}
                          <div 
                            className={`absolute bottom-full mb-3 z-50 pointer-events-none transition-all duration-150 ${
                              isSelected 
                                ? 'opacity-100 visible scale-100' 
                                : 'opacity-0 invisible scale-95'
                            } ${
                              item.matchday <= 4 
                                ? 'left-0 translate-x-0' 
                                : item.matchday >= 35 
                                ? 'right-0 translate-x-0' 
                                : 'left-1/2 -translate-x-1/2'
                            }`}
                          >
                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl shadow-black min-w-[240px] max-w-[280px] text-left text-white font-sans select-none pointer-events-none">
                              
                              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-amber-400 font-mono">G.{item.matchday}</span>
                                  <span className="text-xs font-black text-amber-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-700 tracking-wider">
                                    {item.matchScore}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                                  {item.isHome ? 'Casa' : 'Trasferta'}
                                </span>
                              </div>

                              <div className="text-xs text-slate-300 flex items-center justify-between pb-1.5">
                                <span className="text-slate-400">Avversario:</span>
                                <span className="font-bold text-white">
                                  {item.opponent} <span className="font-mono text-slate-400 text-[10px]">({item.opponentAbbr})</span>
                                </span>
                              </div>

                              {item.played ? (
                                hasVoto ? (
                                  <div className="pt-1.5 border-t border-slate-800 space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-slate-400">Voto Base:</span>
                                      <span className="font-black text-emerald-400 font-mono text-sm">{item.voto}</span>
                                    </div>

                                    {/* DETTAGLIO BONUS E MALUS IMPILATI */}
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
                                      <div className="text-xs text-slate-200 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-center">
                                        {item.bonusMalusText}
                                      </div>
                                    )}
                                    <div className="text-[10px] text-slate-400 text-right">
                                      {getStatusLabel(item.status)}
                                    </div>
                                  </div>
                                ) : isINF ? (
                                  <div className="pt-1.5 border-t border-slate-800 text-xs text-purple-300 font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                    <span>INF • Non ha giocato per infortunio</span>
                                  </div>
                                ) : isSV ? (
                                  <div className="pt-1.5 border-t border-slate-800 text-xs text-amber-300 font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                                    <span>SV • Senza Voto (subentrato)</span>
                                  </div>
                                ) : (
                                  <div className="pt-1.5 border-t border-slate-800 text-xs text-slate-400">
                                    Non sceso in campo (panchina)
                                  </div>
                                )
                              ) : (
                                <div className="pt-1.5 border-t border-slate-800 text-xs text-blue-400 font-medium">
                                  Partita in programma
                                </div>
                              )}

                            </div>

                            <div 
                              className={`absolute -bottom-1.5 w-3 h-3 bg-slate-900 border-r border-b border-slate-700 rotate-45 pointer-events-none ${
                                item.matchday <= 4 
                                  ? 'left-4' 
                                  : item.matchday >= 35 
                                  ? 'right-4' 
                                  : 'left-1/2 -translate-x-1/2'
                              }`}
                            />
                          </div>

                          {/* BARRA O SIGLA IN FULLSCREEN */}
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
                            /* COLONNA IMPILATA FULLSCREEN: BONUS CIANO + MALUS ROSSO + VOTO BASE */
                            <div 
                              className={`w-full flex flex-col justify-end items-stretch transition-all duration-200 ${
                                isSelected ? 'ring-2 ring-amber-400 brightness-125 z-20 shadow-xl rounded-t-sm scale-x-110' : 'hover:brightness-110'
                              }`}
                              title={`G.${item.matchday} - ${item.matchScore}: Voto ${item.voto}${item.bonus > 0 ? ` +${item.bonus} Bonus` : ''}${item.malus > 0 ? ` -${item.malus} Malus` : ''} = Fanta ${item.fantaVoto}`}
                            >
                              {/* 1. SEGMENTO BONUS IN CIMA (CIANO/AZZURRO) */}
                              {bonusHeightPercent > 0 && (
                                <div 
                                  style={{ height: `${bonusHeightPercent}%` }}
                                  className="w-full bg-cyan-400 border-x border-t border-cyan-300 rounded-t-sm shadow-sm"
                                  title={`Bonus: +${item.bonus}`}
                                />
                              )}

                              {/* 2. SEGMENTO MALUS (ROSSO VIVO) */}
                              {malusHeightPercent > 0 && (
                                <div 
                                  style={{ height: `${malusHeightPercent}%` }}
                                  className={`w-full bg-rose-500 border-x border-t border-rose-400 shadow-sm ${bonusHeightPercent <= 0 ? 'rounded-t-sm' : ''}`}
                                  title={`Malus: -${item.malus}`}
                                />
                              )}

                              {/* 3. SEGMENTO VOTO BASE (ALLA BASE - COLORE STATO) */}
                              <div
                                style={{ height: `${voteHeightPercent}%`, ...style }}
                                className={`w-full shadow-md ${className} ${bonusHeightPercent <= 0 && malusHeightPercent <= 0 ? 'rounded-t-sm' : ''}`}
                                title={`Voto Base: ${item.voto}`}
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

                {/* ASSE X FULLSCREEN CON TUTTE LE GIORNATE CHIAVE */}
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

              {/* CARD DETTAGLIO GIORNATA SELEZIONATA IN BASSO */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between flex-wrap gap-3">
                {activeMatchday !== null ? (() => {
                  const sel = history.find(h => h.matchday === activeMatchday);
                  if (!sel) return null;
                  return (
                    <div className="flex items-center gap-4 flex-wrap w-full justify-between">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
                          Giornata {sel.matchday}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                            {sel.matchScore}
                          </span>
                          <span className="text-xs text-slate-300 font-medium">
                            contro <strong className="text-white">{sel.opponent}</strong> ({sel.isHome ? 'In Casa' : 'In Trasferta'})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {sel.played ? (
                          sel.voto !== null ? (
                            <div className="flex items-center gap-2 font-mono text-xs">
                              <span className="text-slate-400">Voto Base:</span>
                              <span className="font-black text-emerald-400 text-sm">{sel.voto}</span>
                              {sel.bonus > 0 && (
                                <span className="text-cyan-400 font-bold ml-1">+{sel.bonus} Bon.</span>
                              )}
                              {sel.malus > 0 && (
                                <span className="text-rose-400 font-bold ml-1">-{sel.malus} Mal.</span>
                              )}
                              <span className="text-slate-400 ml-1.5">Fanta:</span>
                              <span className="font-black text-amber-400 text-sm">{sel.fantaVoto}</span>
                              {sel.bonusMalusText && (
                                <span className="ml-2 px-2 py-0.5 rounded bg-slate-900 text-slate-200 font-sans font-bold border border-slate-700">
                                  {sel.bonusMalusText}
                                </span>
                              )}
                              <span className="text-slate-400 ml-2 font-sans">({getStatusLabel(sel.status)})</span>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-amber-300 font-sans">
                              {getStatusLabel(sel.status)}
                            </span>
                          )
                        ) : (
                          <span className="text-xs font-medium text-blue-400 font-sans">
                            Partita futura ancora da disputare
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })() : (
                  <p className="text-xs text-slate-400 italic">
                    Passa il mouse o tocca una colonna per fissare i dettagli della gara in questa scheda.
                  </p>
                )}
              </div>

              {/* LEGENDA UFFICIALE FULLSCREEN INCLUSI BONUS E MALUS */}
              <div className="flex items-center justify-between flex-wrap gap-3 text-xs pt-2 text-slate-300 font-medium border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-300 flex-shrink-0" />
                  <span>Titolare 90'</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span 
                    className="w-3 h-3 rounded-sm border border-emerald-400 flex-shrink-0"
                    style={{
                      background: 'repeating-linear-gradient(-45deg, #4ade80, #4ade80 2px, #166534 2px, #166534 4px)'
                    }}
                  />
                  <span>Titolare sost.</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-yellow-400 border border-yellow-300 flex-shrink-0" />
                  <span>Subentrato</span>
                </div>

                {/* BONUS CIANO */}
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-cyan-400 border border-cyan-300 shadow-sm flex-shrink-0" />
                  <span className="text-cyan-300 font-semibold">Bonus (+Gol, +Ass)</span>
                </div>

                {/* MALUS ROSSO */}
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-rose-500 border border-rose-400 shadow-sm flex-shrink-0" />
                  <span className="text-rose-300 font-semibold">Malus (-Amm, -Esp)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-amber-300 font-mono">SV</span>
                  <span>Senza voto</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-purple-500 border border-purple-400 flex-shrink-0" />
                  <span>Uscito per infortunio</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-purple-400 font-mono">INF</span>
                  <span>Non ha giocato (infortunio)</span>
                </div>
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
