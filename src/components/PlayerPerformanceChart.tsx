import React from 'react';
import { Player } from '../types';
import { getPlayerPerformanceHistory, MatchdayHistoryItem, MatchdayStatus } from '../utils/playerMatchHistory';
import { CheckCircle2, Trophy, Award } from 'lucide-react';

interface Props {
  player: Player;
}

export const PlayerPerformanceChart: React.FC<Props> = ({ player }) => {
  const { history, kpis, isEstimatedSeasonSplit } = getPlayerPerformanceHistory(player, 7);
  const [activeMatchday, setActiveMatchday] = React.useState<number | null>(null);

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
        {/* INTESTAZIONE GRAFICO CON BADGE E RIEPILOGO GIORNATA ATTIVA */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider">
              Voto e Fantavoto
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Stagione Serie A (38 Giornate{isEstimatedSeasonSplit ? ' • Ripartizione voti stagionale' : ''})
            </span>
          </div>

          {/* INDICATORE STATO / LIVE PREVIEW DELLA GIORNATA EVIDENZIATA */}
          {activeMatchday !== null ? (() => {
            const cur = history.find(h => h.matchday === activeMatchday);
            if (!cur) return null;
            return (
              <div className="text-[11px] font-mono text-amber-300 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded flex items-center gap-2 shadow-sm animate-fadeIn">
                <span className="font-bold text-amber-400">G.{cur.matchday}:</span>
                <span className="font-black text-white">{cur.matchScore}</span>
                <span className="text-slate-400 text-[10px]">vs {cur.opponent} ({cur.isHome ? 'C' : 'T'})</span>
                {cur.voto !== null && (
                  <span className="text-emerald-400 font-bold ml-1">V: {cur.voto}</span>
                )}
              </div>
            );
          })() : (
            <span className="text-[10px] text-slate-500 italic hidden md:inline">
              Evidenzia una giornata per dettagli e risultato
            </span>
          )}
        </div>

        {/* CONTAINER GRAFICO CON ASSE Y ED ASSE X */}
        <div className="relative bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          
          {/* ALTEZZA DEL GRAFICO: 120px */}
          <div className="relative h-[120px] flex items-end">
            
            {/* GRIGLIA SFONDO ASSE Y (0, 2, 4, 6, 8, 10, 12, 14) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-1">
              {[14, 12, 10, 8, 6, 4, 2, 0].map((val) => (
                <div key={val} className="w-full flex items-center justify-between text-[9px] text-slate-600 font-mono">
                  <span className="w-4 text-right pr-1 select-none">{val}</span>
                  <div className={`flex-1 border-b ${
                    val === 6 
                      ? 'border-emerald-500/40 border-dashed' 
                      : 'border-slate-800/60 border-dotted'
                  }`} />
                </div>
              ))}
            </div>

            {/* BARRE ISTOGRAMMA PER LE 38 GIORNATE (OFFSET SINISTRO PER ASSE Y) */}
            <div className="relative z-10 w-full h-full flex items-end pl-5 gap-[2px]">
              {history.map((item) => {
                const isSV = item.status === 'senza_voto';
                const isINF = item.status === 'non_giocato_infortunio';
                const hasVoto = item.voto !== null && item.voto > 0;
                const heightPercent = hasVoto ? Math.min(100, (item.voto! / maxScale) * 100) : 0;
                const { style, className } = getBarStyle(item.status, item.voto);
                const isSelected = activeMatchday === item.matchday;

                return (
                  <div 
                    key={item.matchday} 
                    className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                    onMouseEnter={() => setActiveMatchday(item.matchday)}
                    onMouseLeave={() => setActiveMatchday(null)}
                    onClick={() => setActiveMatchday(prev => prev === item.matchday ? null : item.matchday)}
                  >
                    {/* CALLOUT FLUTTUANTE CON RISULTATO PARTITA (ES. MIL-LAZ 3-2), AVVERSARIO E VOTI */}
                    <div 
                      className={`absolute bottom-full mb-2.5 z-50 pointer-events-none transition-all duration-150 ${
                        isSelected 
                          ? 'opacity-100 visible scale-100' 
                          : 'opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100'
                      } ${
                        item.matchday <= 3 
                          ? 'left-0 translate-x-0' 
                          : item.matchday >= 36 
                          ? 'right-0 translate-x-0' 
                          : 'left-1/2 -translate-x-1/2'
                      }`}
                    >
                      <div className="bg-slate-900/98 backdrop-blur-md border border-slate-700 rounded-lg p-2.5 shadow-2xl shadow-black/95 min-w-[205px] max-w-[245px] text-left text-white font-sans select-none">
                        
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

                        {/* RIGA 3: DETTAGLIO PRESTAZIONE, VOTO E FANTAVOTO */}
                        {item.played ? (
                          hasVoto ? (
                            <div className="pt-1 border-t border-slate-800/80 space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">Voto / Fanta:</span>
                                <div className="flex items-center gap-1.5 font-mono">
                                  <span className="font-black text-emerald-400">{item.voto}</span>
                                  <span className="text-slate-500">/</span>
                                  <span className="font-black text-amber-400">{item.fantaVoto}</span>
                                </div>
                              </div>
                              {item.bonusMalusText && (
                                <div className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-700/50 text-center">
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
                        className={`absolute -bottom-1 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45 ${
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
                      /* BARRA ISTOGRAMMA COLORATA SECONDO I 5 STATI */
                      <div
                        style={{ height: `${heightPercent}%`, ...style }}
                        className={`w-full rounded-t-sm transition-all duration-300 shadow-sm ${className} ${
                          isSelected ? 'ring-2 ring-amber-400 brightness-125 shadow-lg' : 'hover:brightness-110'
                        }`}
                        title={`G.${item.matchday} - ${item.matchScore}: Voto ${item.voto}`}
                      />
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
          <div className="flex justify-between pl-5 pt-1.5 text-[10px] font-mono text-slate-400 font-bold border-t border-slate-800">
            <span>1</span>
            <span>10</span>
            <span>19</span>
            <span>30</span>
            <span>38</span>
          </div>

        </div>

        {/* LEGENDA UFFICIALE COLORAZIONE ISTOGRAMMA */}
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

    </div>
  );
};
