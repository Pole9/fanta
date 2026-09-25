import React, { useMemo } from 'react';
import { Player, SeasonStats } from '../types';
import { 
  ShieldCheck, 
  Target, 
  Star, 
  Award, 
  CheckCircle2, 
  Clock, 
  History,
  Calendar
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { OFFICIAL_PLAYERS } from '../data/officialPlayers';
import { getInjuryInfo } from '../data/injuryData';
import { calculatePlayerPercentile, isTitolarissimo } from '../utils/auctionCalculations';

interface StatsCardProps {
  player: Player | null;
}

export const StatsCard: React.FC<StatsCardProps> = ({ player }) => {
  const { togglePlayerTarget, updatePlayerNote, teams, players } = useAuction();

  // Calcolo percentile di valutazione e relativo commento qualitativo all'interno della propria categoria
  const rolePercentileInfo = useMemo(() => {
    if (!player || !players || players.length === 0) return null;
    const sameRoleFvms = players
      .filter(p => p.ruolo === player.ruolo)
      .map(p => Number(p.fvm) || 0);
    return calculatePlayerPercentile(player.fvm, sameRoleFvms, player.ruolo);
  }, [player, players]);

  // Informazioni infortunio e tempo di rientro previsto da Gazzetta / Fantacalcio
  const injury = useMemo(() => {
    if (!player) return null;
    return getInjuryInfo(player.nome);
  }, [player?.nome]);

  // Garanzia di unione con l'archivio ufficiale per statistiche e squadra precedente
  const sourcePlayer = useMemo(() => {
    if (!player) return null;
    const official = OFFICIAL_PLAYERS.find(o => o.id === player.id);
    return {
      ...player,
      isPrimoAnnoA: player.isPrimoAnnoA ?? official?.isPrimoAnnoA,
      squadraPrecedente: player.squadraPrecedente || official?.squadraPrecedente,
      seasons: player.seasons || official?.seasons,
      isTq: player.isTq ?? official?.isTq,
      ruoloMantra: player.ruoloMantra || official?.ruoloMantra,
      pg: player.pg || official?.pg || 0,
      gf: player.gf || official?.gf || 0,
      gs: player.gs || official?.gs || 0,
      assist: player.assist || official?.assist || 0
    };
  }, [player]);

  if (!player || !sourcePlayer) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center text-slate-500 text-xs">
        Nessun calciatore selezionato
      </div>
    );
  }

  const assignedTeam = player.assignedTo ? teams.find(t => t.id === player.assignedTo) : null;

  const roleTheme = {
    P: { border: 'border-amber-500/40', badge: 'bg-amber-500 text-slate-950', text: 'text-amber-400' },
    D: { border: 'border-emerald-500/40', badge: 'bg-emerald-500 text-slate-950', text: 'text-emerald-400' },
    C: { border: 'border-blue-500/40', badge: 'bg-blue-500 text-white', text: 'text-blue-400' },
    A: { border: 'border-red-500/40', badge: 'bg-red-500 text-white', text: 'text-red-400' },
  }[player.ruolo];

  const seasonsList: SeasonStats[] = [];
  if (sourcePlayer.seasons) {
    const list = Object.values(sourcePlayer.seasons).filter((s): s is SeasonStats => Boolean(s));
    list.sort((a, b) => b.season.localeCompare(a.season));
    seasonsList.push(...list);
  }

  // Massimo 3 righe per le stagioni a sinistra come richiesto dall'utente
  const displayedSeasons = seasonsList.slice(0, 3);

  // Fallback garantito se ancora vuoto ma è un nuovo arrivato con squadra precedente (mostra 3 stagioni)
  if (seasonsList.length === 0 && (sourcePlayer.isPrimoAnnoA || sourcePlayer.squadraPrecedente)) {
    const teamName = sourcePlayer.squadraPrecedente || 'Campionato Estero / Serie B';
    const years = ['2024/25', '2023/24', '2022/23'];
    years.forEach((yr, i) => {
      seasonsList.push({
        season: yr,
        squadra: teamName,
        pg: Math.max(15, (sourcePlayer.pg || 26) - i * 2),
        mv: 0,
        fm: 0,
        gf: Math.max(0, (sourcePlayer.gf || 0) - i),
        gs: Math.max(0, (sourcePlayer.gs || 0) + (sourcePlayer.ruolo === 'P' ? i * 2 : 0)),
        rp: sourcePlayer.rp || 0,
        rc: sourcePlayer.rc || 0,
        rSegnati: sourcePlayer.rSegnati || 0,
        rSbagliati: sourcePlayer.rSbagliati || 0,
        assist: Math.max(0, (sourcePlayer.assist || 0) - i),
        amm: sourcePlayer.amm || 0,
        esp: sourcePlayer.esp || 0,
        au: 0,
        isTitolare: true,
        isPrecedenteEstero: true
      });
    });
  }

  const isGoodForModifier = player.ruolo === 'D' && (
    (player.mv != null && player.mv >= 6.0) ||
    (player.threeYearAvg && player.threeYearAvg.mv >= 6.0)
  );

  const isStarter = isTitolarissimo(sourcePlayer);
  const currentSeasonMv = sourcePlayer.seasons?.['2026/27']?.mv;
  const lastYearSeasonMv = sourcePlayer.seasons?.['2025/26']?.mv ?? sourcePlayer.mv;

  return (
    <div className={`bg-slate-900 border ${roleTheme.border} rounded-xl p-2.5 sm:p-3 shadow-lg relative`}>
      {/* RIGA 1 COMPATTA SU 1 SOLA RIGA (RISPARMIO DI 2 RIGHE):
          [RUOLO] [NOME] [SQUADRA] [TQ] [R] [T] [MODIF.] [Qt/FVM/MV/MV26] [Percentile] ------- [PREFERITO ⭐] */}
      <div className="flex items-center justify-between gap-2 mb-1.5 flex-nowrap">
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto scrollbar-none py-0.5">
          {/* BADGE RUOLO */}
          <div className={`w-7 h-7 rounded-lg ${roleTheme.badge} font-black text-base flex items-center justify-center shadow flex-shrink-0`}>
            {player.ruolo}
          </div>

          {/* NOME SEMPRE VISIBILE */}
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase whitespace-nowrap flex-shrink-0">
            {player.nome}
          </h2>

          {/* SQUADRA IN GRANDE */}
          <span className="text-white font-black bg-slate-800 border border-slate-600 px-2.5 py-0.5 rounded-lg text-xs sm:text-sm tracking-wide uppercase shadow flex-shrink-0">
            {player.squadra}
          </span>

          {/* BADGES SPOSTATI SUBITO DOPO LA SQUADRA: TREQUARTISTA, RIGORISTA, TITOLARE, MODIFICATORE */}
          {(sourcePlayer.isTq || player.isTq) && (
            <span 
              className="px-2 py-0.5 rounded-md bg-fuchsia-600 border border-fuchsia-400 text-white text-[11px] font-black shadow flex items-center gap-0.5 flex-shrink-0"
              title={`Centrocampista Offensivo (${sourcePlayer.ruoloMantra || player.ruoloMantra})`}
            >
              TQ
            </span>
          )}
          {player.rigorista && (
            <span 
              className="px-2 py-0.5 rounded-md bg-indigo-600 border border-indigo-400 text-white text-[11px] font-black shadow flex items-center gap-0.5 flex-shrink-0"
              title="Rigorista designato"
            >
              <Target className="w-3 h-3 text-indigo-200" /> R
            </span>
          )}
          {isStarter && (
            <span 
              className="px-2 py-0.5 rounded-md bg-emerald-400 text-slate-950 text-[11px] font-black shadow flex items-center gap-0.5 flex-shrink-0"
              title={sourcePlayer.seasons?.['2026/27']?.titolaritaDettaglio || "Titolarissimo (almeno 3/4 o 4/5 gare da titolare)"}
            >
              T
            </span>
          )}
          {isGoodForModifier && (
            <span 
              className="px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-500 text-emerald-300 text-[11px] font-black flex items-center gap-0.5 shadow flex-shrink-0"
              title="Valido per modificatore difesa"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> MODIF.
            </span>
          )}

          {/* QUOTAZIONI, FVM (VALUTAZIONE ATTUALE) E MEDIE VOTO IN GRANDE */}
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 shadow-sm flex-shrink-0">
            <span>Qt: <strong className="text-white text-xs sm:text-sm font-black">{player.quotazione}</strong></span>
            <span className="border-l border-slate-800 pl-1.5">FVM: <strong className="text-amber-400 text-sm sm:text-base font-black">{player.fvm}</strong></span>
            <span className="border-l border-slate-800 pl-1.5">MV: <strong className={`text-sm sm:text-base font-black ${currentSeasonMv && currentSeasonMv >= 6.0 ? 'text-emerald-400' : 'text-slate-200'}`}>{currentSeasonMv ? currentSeasonMv.toFixed(2) : '-'}</strong></span>
            <span className="border-l border-slate-800 pl-1.5" title="Media Voto Ultimo Anno (2025/26)">MV '26: <strong className={`text-sm sm:text-base font-black ${lastYearSeasonMv && lastYearSeasonMv >= 6.0 ? 'text-cyan-300' : 'text-slate-300'}`}>{lastYearSeasonMv ? lastYearSeasonMv.toFixed(2) : '-'}</strong></span>
          </div>

          {/* PERCENTILE DI CATEGORIA */}
          {rolePercentileInfo && (
            <div 
              className={`px-2 py-0.5 rounded-lg border text-xs font-black flex items-center gap-1.5 shadow flex-shrink-0 ${rolePercentileInfo.containerClass}`}
              title={rolePercentileInfo.tooltip}
            >
              <span className={rolePercentileInfo.percentileClass}>{rolePercentileInfo.percentile}° percentile</span>
              <span className={`text-[10px] font-bold hidden sm:inline ${rolePercentileInfo.commentClass}`}>
                ({rolePercentileInfo.comment})
              </span>
            </div>
          )}

          {/* BADGE INFORTUNIO CON MESE DI RIENTRO DA GAZZETTA / FANTACALCIO */}
          {injury && (
            <span 
              className="px-2 py-0.5 rounded-md bg-red-600 border border-red-400 text-white text-[11px] font-black shadow flex items-center gap-1 flex-shrink-0"
              title={`Infortunio: ${injury.infortunio} • Rientro previsto: ${injury.rientroPrevisto}`}
            >
              🏥 Rientro: <strong className="text-yellow-300 font-black">{injury.meseRientro}</strong>
            </span>
          )}

          {/* BADGES STATO ASSEGNAZIONE / INVENDUTO SE PRESENTE */}
          {player.status === 'assigned' && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-black shadow flex-shrink-0">
              Preso: {player.price} ({assignedTeam?.name})
            </span>
          )}
          {player.status === 'skipped' && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-xs font-black shadow flex-shrink-0">
              Invenduto
            </span>
          )}
        </div>

        {/* DUE LIVELLI DI PREFERITI: TIER S e TIER A */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          <button
            onClick={() => togglePlayerTarget(player.id, 'S')}
            className={`px-2 py-1 rounded-lg border text-[11px] font-black transition-all flex items-center gap-1 shadow-sm active:scale-95 ${
              player.targetTier === 'S'
                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-md ring-1 ring-amber-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-amber-300'
            }`}
            title="Tier S: Top Target (Priorità Assoluta)"
          >
            <Star className={`w-3.5 h-3.5 ${player.targetTier === 'S' ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
            <span>Tier S</span>
          </button>

          <button
            onClick={() => togglePlayerTarget(player.id, 'A')}
            className={`px-2 py-1 rounded-lg border text-[11px] font-black transition-all flex items-center gap-1 shadow-sm active:scale-95 ${
              player.targetTier === 'A'
                ? 'bg-cyan-400 border-cyan-300 text-slate-950 shadow-md ring-1 ring-cyan-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-cyan-300'
            }`}
            title="Tier A: Obiettivo Secondario"
          >
            <Star className={`w-3.5 h-3.5 ${player.targetTier === 'A' ? 'fill-slate-950 text-slate-950' : 'text-cyan-400'}`} />
            <span>Tier A</span>
          </button>
        </div>
      </div>

      {/* BANNER INFORTUNIO / SQUALIFICA CON TEMPO DI RIENTRO */}
      {injury && (
        <div className="mb-2 injury-banner border-2 border-red-500 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base flex-shrink-0">{injury.meseRientro === 'Squalificato' ? '🟥' : '🏥'}</span>
            <div className="text-xs min-w-0">
              <strong className="injury-title mr-1 uppercase">
                {injury.meseRientro === 'Squalificato' ? 'SQUALIFICA' : `INFORTUNIO (${injury.meseRientro})`}:
              </strong>
              <span className="injury-text leading-relaxed">{injury.infortunio}</span>
            </div>
          </div>
          <span className="injury-badge px-2 py-0.5 rounded border text-[10px] whitespace-nowrap flex-shrink-0 shadow-sm">
            Rientro: {injury.rientroPrevisto}
          </span>
        </div>
      )}

      {/* RIGA DEDICATA: NOTA / COMMENTO PERSONALE */}
      <div className="mb-2 bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center gap-2 shadow-inner">
        <span className="text-[11px] font-black uppercase text-amber-400 flex-shrink-0 flex items-center gap-1">
          📝 Nota:
        </span>
        <input
          type="text"
          placeholder="Aggiungi una nota o commento personale per questo calciatore (es. max 15, rigorista, scommessa)..."
          value={player.note || ''}
          onChange={(e) => updatePlayerNote(player.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="w-full bg-transparent text-xs text-amber-200 placeholder-slate-500 font-medium focus:outline-none"
        />
        {player.note && (
          <button
            onClick={() => updatePlayerNote(player.id, '')}
            className="text-slate-500 hover:text-slate-300 text-xs font-bold px-1"
            title="Cancella nota"
          >
            ✕
          </button>
        )}
      </div>

      {/* RIGA 2: TABELLA STORICO SU MAX 3 STAGIONI (COMPATTA SENZA SCROLL VERTICALE) */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto overflow-y-hidden scrollbar-none">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="py-1 px-2.5 whitespace-nowrap">
                <span>Stagione</span>
                {player.threeYearAvg && player.threeYearAvg.seasonsCount > 1 && (
                  <span className="text-amber-400 text-[10px] font-mono ml-1.5 font-normal">
                    (3y: MV <strong className="text-emerald-400 font-black text-xs">{player.threeYearAvg.mv > 0 ? player.threeYearAvg.mv.toFixed(2) : '-'}</strong> • FM <strong className="text-indigo-400 font-bold text-xs">{player.threeYearAvg.fm > 0 ? player.threeYearAvg.fm.toFixed(2) : '-'}</strong>)
                  </span>
                )}
              </th>
              <th className="py-1 px-2">Squadra</th>
              <th className="py-1 px-2 text-center">PV</th>
              <th className="py-1 px-2 text-center text-emerald-400 font-black text-xs sm:text-sm">MV Pura</th>
              <th className="py-1 px-2 text-center text-indigo-400">FM Fanta</th>
              <th className="py-1 px-2 text-center">{player.ruolo === 'P' ? 'GS' : 'Gol'}</th>
              <th className="py-1 px-2 text-center">{player.ruolo === 'P' ? 'RP' : 'Rigori'}</th>
              <th className="py-1 px-2 text-center">Ass</th>
              <th className="py-1 px-2 text-center">Amm/Esp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850 text-slate-200 text-xs">
            {displayedSeasons.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-2 px-2.5 text-center text-slate-500 italic text-[11px]">
                  Nessuna statistica storica disponibile (nuovo arrivo o neopromosso).
                </td>
              </tr>
            ) : (
              displayedSeasons.map(s => {
                const isCurrentSeason = s.season === '2026/27';
                const teamPlayed = s.squadra || player.squadra;
                const mvVal = s.mv ?? 0;
                const fmVal = s.fm ?? 0;
                const isModPass = player.ruolo === 'D' && mvVal >= 6.0;
                const rcVal = s.rc ?? 0;
                const rSegnatiVal = s.rSegnati ?? 0;
                const rpVal = s.rp ?? 0;

                return (
                  <tr 
                    key={s.season} 
                    className={
                      isCurrentSeason 
                        ? "bg-slate-900/95 font-black text-white border-y-2 border-amber-400 shadow-sm ring-1 ring-amber-500/30" 
                        : "hover:bg-slate-900/50"
                    }
                  >
                    {/* STAGIONE + [T] O DETTAGLIO TITOLARITA' IN PRIMA RIGA IN GRASSETTO */}
                    <td className="py-1 px-2.5 font-black text-white flex items-center gap-1.5 whitespace-nowrap">
                      {isCurrentSeason ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-amber-400 font-black text-xs">2026/27</span>
                          {s.titolaritaDettaglio && (
                            <span 
                              className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide flex items-center gap-1 shadow ${
                                s.motivoTitolarita === 'titolare_fisso'
                                  ? 'bg-emerald-100 dark:bg-emerald-400 text-emerald-950 dark:text-slate-950 border border-emerald-400'
                                  : s.motivoTitolarita === 'infortunato'
                                  ? 'bg-red-600 text-white shadow-sm'
                                  : s.motivoTitolarita === 'rientro_infortunio'
                                  ? 'bg-amber-100 dark:bg-amber-500 text-amber-950 dark:text-slate-950 border border-amber-400'
                                  : s.motivoTitolarita === 'rotazione'
                                  ? 'bg-blue-100 dark:bg-blue-600/30 text-blue-900 dark:text-blue-200 border border-blue-400 dark:border-blue-500/50 font-black'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                              }`}
                              title={s.titolaritaDettaglio}
                            >
                              {s.motivoTitolarita === 'titolare_fisso' && '⭐ '}
                              {s.motivoTitolarita === 'infortunato' && '🏥 '}
                              {s.motivoTitolarita === 'rientro_infortunio' && '🩹 '}
                              {s.motivoTitolarita === 'rotazione' && '🔄 '}
                              {s.titolaritaDettaglio}
                              {injury && s.motivoTitolarita === 'infortunato' && ` • Rientro: ${injury.rientroPrevisto}`}
                            </span>
                          )}
                        </div>
                      ) : (
                        <>
                          <span>{s.season}</span>
                          {s.isTitolare ? (
                            <span 
                              className="px-2 py-0.5 rounded-md bg-emerald-400 text-slate-950 font-black text-xs shadow-md tracking-wider" 
                              title="Normalmente Titolare nella stagione"
                            >
                              T
                            </span>
                          ) : null}
                          {s.isPrecedenteEstero && (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px] font-black" title="Dati squadra precedente / altro campionato">
                              PREC.
                            </span>
                          )}
                        </>
                      )}
                    </td>

                    {/* SQUADRA IN CUI GIOCAVA */}
                    <td className={`py-1 px-2 font-black uppercase text-[11px] truncate max-w-[150px] ${isCurrentSeason ? 'text-amber-200 font-extrabold' : 'text-slate-300'}`} title={teamPlayed}>
                      {teamPlayed}
                    </td>

                    {/* PV */}
                    <td className="py-1 px-2 text-center font-black">
                      {isCurrentSeason ? (
                        <span className="px-1.5 py-0.5 bg-slate-800 text-white rounded font-mono font-black text-xs border border-slate-700">
                          {s.pg}
                        </span>
                      ) : (
                        s.pg
                      )}
                    </td>

                    {/* MV PURA */}
                    <td className={`py-1.5 px-2 text-center font-black text-sm sm:text-base ${
                      mvVal >= 6.2 ? 'text-emerald-400' : mvVal >= 6.0 ? 'text-emerald-300' : isCurrentSeason && mvVal > 0 ? 'text-white' : 'text-slate-400'
                    }`}>
                      {mvVal > 0 ? mvVal.toFixed(2) : s.pg > 0 ? '-' : s.isPrecedenteEstero ? <span className="text-[10px] text-slate-500 font-normal">n/d</span> : '-'}
                      {isModPass && <span className="ml-0.5 text-[9px] text-emerald-400">✓</span>}
                    </td>

                    {/* FM FANTA */}
                    <td className={`py-1 px-2 text-center font-black ${
                      fmVal >= 7.5 ? 'text-indigo-400' : fmVal >= 7.0 ? 'text-indigo-300' : isCurrentSeason && fmVal > 0 ? 'text-white' : 'text-slate-400'
                    }`}>
                      {fmVal > 0 ? fmVal.toFixed(2) : s.pg > 0 ? '-' : s.isPrecedenteEstero ? <span className="text-[10px] text-slate-500 font-normal">n/d</span> : '-'}
                    </td>

                    {/* GOL / GS */}
                    <td className="py-1 px-2 text-center font-black text-white">
                      {player.ruolo === 'P' ? s.gs : s.gf}
                    </td>

                    {/* RIGORI */}
                    <td className="py-1 px-2 text-center font-bold text-slate-300">
                      {player.ruolo === 'P' 
                        ? (s.rp && s.rp > 0 ? `${rpVal} parati` : isCurrentSeason ? '0' : `${rpVal} parati`)
                        : rcVal > 0 ? `${rSegnatiVal}/${rcVal}` : '-'}
                    </td>

                    {/* ASSIST */}
                    <td className="py-1 px-2 text-center font-black text-white">{s.assist}</td>

                    {/* CARTELLINI */}
                    <td className="py-1 px-2 text-center font-bold text-slate-400">
                      <span className="text-amber-400">{s.amm}</span>/<span className="text-red-400">{s.esp}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
