import React, { useState, useMemo, useRef } from "react";
import { useAuction } from "../context/AuctionContext";
import { Player, Role } from "../types";
import { parseFantacalcioExcel } from "../utils/excelParser";
import { exportListoneExcel, parseListoneFile } from "../utils/listoneExportImport";
import { OFFICIAL_PLAYERS } from "../data/officialPlayers";
import { getInjuryInfo } from "../data/injuryData";
import { calculatePlayerPercentile, RolePercentileResult } from "../utils/auctionCalculations";
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Star, 
  ShieldCheck, 
  Target, 
  Gavel, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Download,
  StickyNote,
  Activity
} from "lucide-react";

type SortField = 
  | "ruolo"
  | "nome" 
  | "squadra" 
  | "quotazione" 
  | "fvm" 
  | "percentile"
  | "pv" 
  | "mv" 
  | "mvLastYear"
  | "fm" 
  | "gf" 
  | "rigori" 
  | "assist" 
  | "status"
  | "target"
  | "note";

export const ListoneView: React.FC = () => {
  const { 
    players, 
    teams,
    importPlayersList, 
    setActivePlayer, 
    setCurrentRole, 
    setActiveView, 
    togglePlayerTarget, 
    setPlayerTargetTier,
    updatePlayerNote,
    reloadTatticoNotes,
    allSerieATeams
  } = useAuction();

  // Stati Filtri
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [teamFilter, setTeamFilter] = useState<string | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "assigned" | "skipped">("all");
  const [targetFilter, setTargetFilter] = useState<"all" | "any" | "S" | "A">("all");
  const [notesOnly, setNotesOnly] = useState(false);
  const [injuredOnly, setInjuredOnly] = useState(false);
  const [modOnly, setModOnly] = useState(false);
  const [tqOnly, setTqOnly] = useState(false);
  const [penaltiesOnly, setPenaltiesOnly] = useState(false);

  // Stati Ordinamento
  const [sortBy, setSortBy] = useState<SortField>("fvm");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Gestione Upload Excel
  const [uploadMessage, setUploadMessage] = useState<{ text: string; success: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gestione Esportazione Listone con Commenti
  const handleExportListone = () => {
    try {
      const res = exportListoneExcel(players, teams, percentilesMap);
      setUploadMessage({
        text: `Listone esportato con successo (${res.count} calciatori, commenti e statistiche salvati in ${res.filename})`,
        success: true
      });
    } catch (err: any) {
      setUploadMessage({
        text: `Errore durante l'esportazione: ${err?.message || 'Errore sconosciuto'}`,
        success: false
      });
    }
  };

  // Gestione Importazione / Ricarica Listone (Excel / JSON)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await parseListoneFile(file);
      if (result.success && result.players.length > 0) {
        importPlayersList(result.players, 'merge');
        setUploadMessage({ text: result.message, success: true });
      } else {
        setUploadMessage({ text: result.message, success: false });
      }
    } catch (err: any) {
      setUploadMessage({ text: `Errore caricamento: ${err?.message || 'File non supportato'}`, success: false });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Mappa dei percentili per ruolo calcolati in modo statisticamente rigoroso
  const percentilesMap = useMemo(() => {
    const map = new Map<number, RolePercentileResult>();
    const roles: Role[] = ["P", "D", "C", "A"];
    
    roles.forEach(r => {
      const roleList = players.filter(p => p.ruolo === r);
      if (roleList.length === 0) return;
      const fvms = roleList.map(p => Number(p.fvm) || 0);
      roleList.forEach(p => {
        const res = calculatePlayerPercentile(p.fvm, fvms, r);
        map.set(p.id, res);
      });
    });
    return map;
  }, [players]);

  // Mappa ufficiale per arricchimento statistiche stagionali
  const officialMap = useMemo(() => {
    const map = new Map<number, typeof OFFICIAL_PLAYERS[0]>();
    OFFICIAL_PLAYERS.forEach(o => map.set(o.id, o));
    return map;
  }, []);

  // Calcolo giocatori arricchiti con info infortuni
  const enrichedPlayers = useMemo(() => {
    return players.map(p => {
      const off = officialMap.get(p.id);
      const s27 = p.seasons?.["2026/27"] || off?.seasons?.["2026/27"];
      const s26 = p.seasons?.["2025/26"] || off?.seasons?.["2025/26"];
      const pctInfo = percentilesMap.get(p.id);
      const pct = pctInfo ? pctInfo.percentile : 0;
      const injury = getInjuryInfo(p.nome);
      
      return {
        ...p,
        targetTier: p.targetTier || (p.isTarget ? "S" : null),
        isTq: p.isTq ?? off?.isTq,
        ruoloMantra: p.ruoloMantra || off?.ruoloMantra,
        percentile: pct,
        percentileInfo: pctInfo,
        s27Titolarita: s27?.titolaritaDettaglio || "",
        s27Motivo: s27?.motivoTitolarita || (injury ? "infortunato" : ""),
        injuryInfo: injury,
        assistVal: p.assist ?? off?.assist ?? 0,
        ammVal: p.amm ?? off?.amm ?? 0,
        espVal: p.esp ?? off?.esp ?? 0,
        rigoriVal: p.rSegnati ?? s26?.rSegnati ?? (p.rigorista ? 1 : 0),
        pvVal: s26?.pg ?? (p.pg && p.pg > 0 ? p.pg : 0),
        mvVal: s27?.mv ?? (p.pg && p.pg > 0 && p.mv ? p.mv : 0),
        mvLastYear: s26?.mv ?? p.mv ?? 0,
        fmVal: p.fm ?? s26?.fm ?? 0,
      };
    });
  }, [players, officialMap, percentilesMap]);

  // Calcolo conteggi generali per pulsanti filtro
  const counts = useMemo(() => {
    return {
      tierS: enrichedPlayers.filter(p => p.targetTier === "S").length,
      tierA: enrichedPlayers.filter(p => p.targetTier === "A").length,
      allTargets: enrichedPlayers.filter(p => Boolean(p.targetTier || p.isTarget)).length,
      notes: enrichedPlayers.filter(p => Boolean(p.note && p.note.trim().length > 0)).length,
      injured: enrichedPlayers.filter(p => Boolean(p.injuryInfo || p.s27Motivo === "infortunato")).length,
      roles: {
        ALL: enrichedPlayers.length,
        P: enrichedPlayers.filter(p => p.ruolo === "P").length,
        D: enrichedPlayers.filter(p => p.ruolo === "D").length,
        C: enrichedPlayers.filter(p => p.ruolo === "C").length,
        A: enrichedPlayers.filter(p => p.ruolo === "A").length,
      }
    };
  }, [enrichedPlayers]);

  // Calcolo lista filtrata e ordinata
  const filteredPlayers = useMemo(() => {
    let list = [...enrichedPlayers];

    // 1. Filtro Ruolo
    if (roleFilter !== "ALL") {
      list = list.filter(p => p.ruolo === roleFilter);
    }

    // 2. Filtro Squadra
    if (teamFilter !== "ALL") {
      list = list.filter(p => p.squadra.toLowerCase() === teamFilter.toLowerCase());
    }

    // 3. Filtro Stato Asta
    if (statusFilter !== "all") {
      list = list.filter(p => p.status === statusFilter);
    }

    // 4. Filtro Nome / Ricerca
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.nome.toLowerCase().includes(q) || 
        p.squadra.toLowerCase().includes(q) ||
        (p.note && p.note.toLowerCase().includes(q))
      );
    }

    // 5. Filtri Target a 2 livelli (Tier S / Tier A / Tutti)
    if (targetFilter === "S") {
      list = list.filter(p => p.targetTier === "S");
    } else if (targetFilter === "A") {
      list = list.filter(p => p.targetTier === "A");
    } else if (targetFilter === "any") {
      list = list.filter(p => Boolean(p.targetTier || p.isTarget));
    }

    // 6. Altri filtri speciali
    if (notesOnly) {
      list = list.filter(p => Boolean(p.note && p.note.trim().length > 0));
    }
    if (injuredOnly) {
      list = list.filter(p => Boolean(p.injuryInfo || p.s27Motivo === "infortunato"));
    }
    if (modOnly) {
      list = list.filter(p => p.ruolo === "D" && (p.mvVal >= 6.0 || p.mvLastYear >= 6.0));
    }
    if (tqOnly) {
      list = list.filter(p => p.isTq);
    }
    if (penaltiesOnly) {
      list = list.filter(p => p.rigorista || p.rigoriVal > 0);
    }

    // Ordinamento completo su qualsiasi statistica
    list.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "nome":
          comparison = a.nome.localeCompare(b.nome, "it", { sensitivity: "base" });
          break;
        case "ruolo": {
          const orderMap: Record<string, number> = { P: 1, D: 2, C: 3, A: 4 };
          comparison = (orderMap[a.ruolo] || 5) - (orderMap[b.ruolo] || 5);
          break;
        }
        case "squadra":
          comparison = a.squadra.localeCompare(b.squadra, "it", { sensitivity: "base" });
          break;
        case "quotazione":
          comparison = a.quotazione - b.quotazione;
          break;
        case "fvm":
          comparison = a.fvm - b.fvm;
          break;
        case "percentile":
          comparison = a.percentile - b.percentile;
          break;
        case "pv":
          comparison = a.pvVal - b.pvVal;
          break;
        case "mv":
          comparison = a.mvVal - b.mvVal;
          break;
        case "mvLastYear":
          comparison = a.mvLastYear - b.mvLastYear;
          break;
        case "fm":
          comparison = a.fmVal - b.fmVal;
          break;
        case "gf":
          comparison = (a.ruolo === "P" ? (a.gs ?? 0) : (a.gf ?? 0)) - (b.ruolo === "P" ? (b.gs ?? 0) : (b.gf ?? 0));
          break;
        case "rigori":
          comparison = a.rigoriVal - b.rigoriVal;
          break;
        case "assist":
          comparison = a.assistVal - b.assistVal;
          break;
        case "target": {
          const tierVal = (t: string | null | undefined) => t === "S" ? 2 : t === "A" ? 1 : 0;
          comparison = tierVal(a.targetTier) - tierVal(b.targetTier);
          break;
        }
        case "status": {
          const statusOrder = { available: 1, skipped: 2, assigned: 3 };
          comparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0) || (b.price || 0) - (a.price || 0);
          break;
        }
        case "note": {
          const aHasNote = Boolean(a.note && a.note.trim());
          const bHasNote = Boolean(b.note && b.note.trim());
          if (aHasNote !== bHasNote) {
            comparison = aHasNote ? 1 : -1;
          } else {
            comparison = (a.note || "").localeCompare(b.note || "");
          }
          break;
        }
        default:
          comparison = 0;
      }

      // Tie-breaker secondario: FVM decrescente, poi nome alfabetico
      if (comparison === 0) {
        comparison = (b.fvm - a.fvm) || a.nome.localeCompare(b.nome);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return list;
  }, [
    enrichedPlayers, 
    roleFilter, 
    teamFilter, 
    statusFilter, 
    search, 
    targetFilter, 
    notesOnly, 
    injuredOnly,
    modOnly, 
    tqOnly, 
    penaltiesOnly, 
    sortBy, 
    sortOrder
  ]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder(field === "nome" || field === "squadra" || field === "ruolo" ? "asc" : "desc");
    }
  };

  const startAuctionForPlayer = (player: Player) => {
    setCurrentRole(player.ruolo);
    setActivePlayer(player);
    setActiveView("auction");
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-2 h-2 text-slate-600 group-hover:text-slate-400" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-2.5 h-2.5 text-amber-400 font-bold" />
    ) : (
      <ArrowDown className="w-2.5 h-2.5 text-amber-400 font-bold" />
    );
  };

  return (
    <div className="h-full w-full flex flex-col justify-between overflow-hidden select-none space-y-1">
      
      {/* 1. TESTATA SUPERIORE: TITOLO, CONTEGGI & IMPORTAZIONE EXCEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 flex items-center justify-between gap-2 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-300 text-xs">
            📋
          </div>
          <h1 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase flex items-center gap-1.5">
            <span>LISTONE CALCIATORI</span>
            <span className="text-slate-400 text-[11px] font-mono font-bold">
              ({filteredPlayers.length} / {players.length})
            </span>
          </h1>
        </div>

        {/* PULSANTI GESTIONE LISTONE: SCARICA, RICARICA & CONSIGLI TATTICO */}
        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv, .json"
            className="hidden"
          />
          <button
            onClick={handleExportListone}
            className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-400 dark:border-emerald-600/60 text-emerald-900 dark:text-emerald-300 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            title="Scarica il listone completo in formato Excel (.xlsx) con tutti i commenti, note tattiche, target e statistiche"
          >
            <Download className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
            <span>Scarica con Commenti</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-0.5 bg-sky-100 dark:bg-sky-950/80 hover:bg-sky-200 dark:hover:bg-sky-900 border border-sky-400 dark:border-sky-600/60 text-sky-900 dark:text-sky-300 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            title="Ricarica / importa il listone aggiornato con commenti, note e target (.xlsx, .xls, .csv o .json)"
          >
            <Upload className="w-3 h-3 text-sky-700 dark:text-sky-400" />
            <span>Ricarica Listone</span>
          </button>
          <button
            onClick={() => {
              reloadTatticoNotes();
              setUploadMessage({ text: "Consigli del Tattico Luca Diddi ripristinati per 164 calciatori!", success: true });
            }}
            className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 border border-amber-400 dark:border-amber-600/60 text-amber-900 dark:text-amber-300 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            title="Ripristina / aggiorna tutti i consigli del Tattico Luca Diddi estratti dal video"
          >
            <span>🎖️ Consigli Tattico</span>
          </button>
        </div>
      </div>

      {uploadMessage && (
        <div className={`px-3 py-0.5 rounded text-[11px] font-bold flex items-center justify-between gap-2 flex-shrink-0 ${
          uploadMessage.success 
            ? "bg-emerald-100 dark:bg-emerald-950/90 border border-emerald-400 dark:border-emerald-500 text-emerald-900 dark:text-emerald-200" 
            : "bg-red-100 dark:bg-red-950/90 border border-red-400 dark:border-red-500 text-red-900 dark:text-red-200"
        }`}>
          <div className="flex items-center gap-1.5">
            {uploadMessage.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            <span>{uploadMessage.text}</span>
          </div>
          <button onClick={() => setUploadMessage(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* 2. BARRA FILTRI MULTIPLA ADATTIVA (SENZA OVERFLOW) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-sm flex flex-col gap-1 flex-shrink-0">
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          
          {/* RICERCA PER NOME / TESTO */}
          <div className="relative flex-1 min-w-[140px] max-w-xs">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca nome, club, nota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-lg pl-7 pr-6 py-0.5 text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-black"
                title="Azzera ricerca"
              >
                ✕
              </button>
            )}
          </div>

          {/* FILTRO RUOLO */}
          <div className="flex items-center gap-0.5">
            {(["ALL", "P", "D", "C", "A"] as const).map(role => {
              const isActive = roleFilter === role;
              return (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-1.5 py-0.5 rounded text-xs font-black border transition-all ${
                    isActive
                      ? role === "P" ? "bg-amber-500 border-amber-400 text-slate-950 shadow"
                        : role === "D" ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow"
                        : role === "C" ? "bg-blue-500 border-blue-400 text-slate-950 shadow"
                        : role === "A" ? "bg-red-500 border-red-400 text-white shadow"
                        : "bg-purple-600 border-purple-500 text-white shadow"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <span>{role === "ALL" ? "Tutti" : role}</span>
                  <span className="text-[10px] opacity-75 ml-0.5 font-mono">({counts.roles[role]})</span>
                </button>
              );
            })}
          </div>

          {/* FILTRO SQUADRA (CLUB) */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5">
            <span className="text-[10px] font-black text-amber-400">CLUB:</span>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="bg-transparent text-xs font-black text-emerald-400 focus:outline-none cursor-pointer uppercase max-w-[110px]"
              title="Filtra per Club di Serie A"
            >
              <option value="ALL" className="bg-slate-900 text-white">TUTTI</option>
              {allSerieATeams.map(team => (
                <option key={team} value={team} className="bg-slate-900 text-white">
                  {team.toUpperCase()}
                </option>
              ))}
            </select>
            {teamFilter !== "ALL" && (
              <button
                onClick={() => setTeamFilter("ALL")}
                className="text-slate-400 hover:text-white text-xs font-black ml-0.5"
                title="Azzera filtro club"
              >
                ✕
              </button>
            )}
          </div>

          {/* FILTRO STATO ASTA */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold rounded px-1.5 py-0.5 focus:outline-none"
          >
            <option value="all">Tutti</option>
            <option value="available">Liberi</option>
            <option value="assigned">Assegnati</option>
            <option value="skipped">Invenduti</option>
          </select>
        </div>

        {/* FILTRI SPECIALI COMPATTI E FLESSIBILI */}
        <div className="flex items-center gap-1 flex-wrap pt-0.5">
          
          {/* SELETTORE PREFERITI TIER S & TIER A */}
          <div className="flex items-center gap-0.5 bg-slate-950 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => setTargetFilter(targetFilter === "S" ? "all" : "S")}
              className={`px-1.5 py-0.2 rounded text-[10px] font-black flex items-center gap-0.5 transition-all ${
                targetFilter === "S"
                  ? "bg-amber-400 text-slate-950 shadow-md ring-1 ring-amber-300"
                  : "text-amber-400 hover:bg-slate-800"
              }`}
              title="Filtra Top Target Tier S"
            >
              <Star className="w-2.5 h-2.5 fill-current" />
              <span>Tier S ({counts.tierS})</span>
            </button>

            <button
              onClick={() => setTargetFilter(targetFilter === "A" ? "all" : "A")}
              className={`px-1.5 py-0.2 rounded text-[10px] font-black flex items-center gap-0.5 transition-all ${
                targetFilter === "A"
                  ? "bg-cyan-400 text-slate-950 shadow-md ring-1 ring-cyan-300"
                  : "text-cyan-400 hover:bg-slate-800"
              }`}
              title="Filtra Obiettivi Secondari Tier A"
            >
              <Star className="w-2.5 h-2.5 fill-current" />
              <span>Tier A ({counts.tierA})</span>
            </button>

            <button
              onClick={() => setTargetFilter(targetFilter === "any" ? "all" : "any")}
              className={`px-1 py-0.2 rounded text-[10px] font-bold transition-all ${
                targetFilter === "any"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Tutti i preferiti (Tier S + A)"
            >
              <span>Target ({counts.allTargets})</span>
            </button>
          </div>

          {/* FILTRO INFORTUNATI CON TEMPO DI RIENTRO */}
          <button
            onClick={() => setInjuredOnly(!injuredOnly)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border transition-all ${
              injuredOnly
                ? "bg-red-600 border-red-500 text-white shadow"
                : "bg-slate-950 border-slate-800 text-red-400 hover:text-red-300"
            }`}
            title="Mostra infortunati con tempi di rientro"
          >
            <Activity className="w-3 h-3 text-red-400" />
            <span>Infortunati ({counts.injured})</span>
          </button>

          {/* FILTRO CON NOTE */}
          <button
            onClick={() => setNotesOnly(!notesOnly)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border transition-all ${
              notesOnly
                ? "bg-indigo-500/25 border-indigo-500 text-indigo-300 shadow"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <StickyNote className="w-3 h-3 text-indigo-400" />
            <span>Note ({counts.notes})</span>
          </button>

          <button
            onClick={() => setPenaltiesOnly(!penaltiesOnly)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border transition-all ${
              penaltiesOnly
                ? "bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Target className="w-3 h-3 text-indigo-400" />
            <span>Rigoristi</span>
          </button>

          <button
            onClick={() => setTqOnly(!tqOnly)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border transition-all ${
              tqOnly
                ? "bg-fuchsia-950 border-fuchsia-500 text-fuchsia-300 shadow"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span className="font-black text-fuchsia-400">TQ</span>
          </button>

          <button
            onClick={() => setModOnly(!modOnly)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border transition-all ${
              modOnly
                ? "bg-emerald-950 border-emerald-500 text-emerald-300 shadow"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Modif.</span>
          </button>

          {(targetFilter !== "all" || notesOnly || injuredOnly || penaltiesOnly || tqOnly || modOnly || roleFilter !== "ALL" || teamFilter !== "ALL" || statusFilter !== "all" || search) && (
            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("ALL");
                setTeamFilter("ALL");
                setStatusFilter("all");
                setTargetFilter("all");
                setNotesOnly(false);
                setInjuredOnly(false);
                setModOnly(false);
                setTqOnly(false);
                setPenaltiesOnly(false);
              }}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900 bg-slate-950 transition-all ml-auto"
              title="Reimposta tutti i filtri"
            >
              Azzera
            </button>
          )}
        </div>
      </div>

      {/* 3. TABELLA LISTONE: TABLE-FIXED CON LARGHEZZE OTTIMIZZATE (ZERO SCROLL ORIZZONTALE) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="overflow-y-auto overflow-x-hidden flex-1 min-h-0 scrollbar-thin">
          <table className="w-full table-fixed text-left text-xs">
            
            {/* INTESTAZIONE TABELLA CON LARGHEZZE FISSE RIGIDE */}
            <thead className="sticky top-0 bg-slate-950 z-10 border-b border-slate-800 text-slate-400 font-black uppercase text-[10px] tracking-wider select-none shadow-sm">
              <tr>
                {/* 1. RUOLO: 28px */}
                <th 
                  onClick={() => handleSort("ruolo")}
                  className="w-7 py-1 px-1 text-center cursor-pointer hover:text-white group"
                  title="Ruolo"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span>R</span>
                    {renderSortIndicator("ruolo")}
                  </div>
                </th>

                {/* 2. CALCIATORE & TIER: FLESSIBILE */}
                <th 
                  onClick={() => handleSort("nome")}
                  className="py-1 px-1.5 cursor-pointer hover:text-white group truncate"
                  title="Calciatore & Tier (clicca per ordinare)"
                >
                  <div className="flex items-center gap-0.5">
                    <span className="truncate">Calciatore & Tier</span>
                    {renderSortIndicator("nome")}
                  </div>
                </th>

                {/* 3. CLUB: 56px */}
                <th 
                  onClick={() => handleSort("squadra")}
                  className="w-14 sm:w-16 py-1 px-1 cursor-pointer hover:text-white group truncate"
                  title="Club / Squadra"
                >
                  <div className="flex items-center gap-0.5">
                    <span className="truncate">Club</span>
                    {renderSortIndicator("squadra")}
                  </div>
                </th>

                {/* 4. QT: 28px */}
                <th 
                  onClick={() => handleSort("quotazione")}
                  className="w-7 py-1 px-0.5 text-center cursor-pointer hover:text-white group"
                  title="Quotazione attuale"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span>Qt</span>
                    {renderSortIndicator("quotazione")}
                  </div>
                </th>

                {/* 5. FVM: 38px */}
                <th 
                  onClick={() => handleSort("fvm")}
                  className="w-10 sm:w-11 py-1 px-0.5 text-center cursor-pointer hover:text-white group"
                  title="Valutazione attuale / FantaValore di Mercato"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-amber-400 font-black text-xs sm:text-sm">FVM</span>
                    {renderSortIndicator("fvm")}
                  </div>
                </th>

                {/* 6. PERC: 32px */}
                <th 
                  onClick={() => handleSort("percentile")}
                  className="w-8 sm:w-9 py-1 px-0.5 text-center cursor-pointer hover:text-white group"
                  title="Percentile di ruolo"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span>Perc</span>
                    {renderSortIndicator("percentile")}
                  </div>
                </th>

                {/* 7. TITOLARITA' E RIENTRO INFORTUNIO: 110-130px */}
                <th 
                  className="w-28 sm:w-32 py-1 px-1 cursor-pointer hover:text-white truncate"
                  title="Titolarità 26/27 e mese di rientro per infortunati (Gazzetta/Fantacalcio)"
                >
                  <span className="truncate">Stato & Rientro</span>
                </th>

                {/* 8. PV: 28px */}
                <th 
                  onClick={() => handleSort("pv")}
                  className="w-7 py-1 px-0.5 text-center cursor-pointer hover:text-white group"
                  title="Presenze / Partite a voto"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span>PV</span>
                    {renderSortIndicator("pv")}
                  </div>
                </th>

                {/* 9. MV: 34px */}
                <th 
                  onClick={() => handleSort("mv")}
                  className="w-9 sm:w-10 py-1 px-0.5 text-center cursor-pointer hover:text-white group"
                  title="Media Voto attuale (stagione in corso 2026/27)"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-emerald-400 font-black text-xs sm:text-sm">MV</span>
                    {renderSortIndicator("mv")}
                  </div>
                </th>

                {/* 9b. MV '26: 38px */}
                <th 
                  onClick={() => handleSort("mvLastYear")}
                  className="w-10 sm:w-11 py-1 px-0.5 text-center cursor-pointer hover:text-white group"
                  title="Media Voto Ultimo Anno (2025/26)"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-cyan-300 font-black text-xs sm:text-sm">MV '26</span>
                    {renderSortIndicator("mvLastYear")}
                  </div>
                </th>

                {/* 10. FM: 32px */}
                <th 
                  onClick={() => handleSort("fm")}
                  className="w-8 sm:w-9 py-1 px-0.5 text-center cursor-pointer hover:text-white group"
                  title="FantaMedia con bonus"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-indigo-400">FM</span>
                    {renderSortIndicator("fm")}
                  </div>
                </th>

                {/* 11. GOL: 28px */}
                <th 
                  onClick={() => handleSort("gf")}
                  className="w-7 py-1 px-0.5 text-center cursor-pointer hover:text-white group"
                  title="Gol segnati (o subiti per P)"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span>G</span>
                    {renderSortIndicator("gf")}
                  </div>
                </th>

                {/* 12. RIG: 24px */}
                <th 
                  onClick={() => handleSort("rigori")}
                  className="w-6 sm:w-7 py-1 px-0.5 text-center cursor-pointer hover:text-white group"
                  title="Rigori segnati"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span>R</span>
                    {renderSortIndicator("rigori")}
                  </div>
                </th>

                {/* 13. ASS: 24px */}
                <th 
                  onClick={() => handleSort("assist")}
                  className="w-6 sm:w-7 py-1 px-0.5 text-center cursor-pointer hover:text-white group"
                  title="Assist serviti"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span>A</span>
                    {renderSortIndicator("assist")}
                  </div>
                </th>

                {/* 14. STATO / PREZZO: 75-85px */}
                <th 
                  onClick={() => handleSort("status")}
                  className="w-20 sm:w-22 py-1 px-1 text-center cursor-pointer hover:text-white group truncate"
                  title="Stato asta o prezzo aggiudicato"
                >
                  <div className="flex items-center justify-center gap-0.5 truncate">
                    <span className="truncate">Stato</span>
                    {renderSortIndicator("status")}
                  </div>
                </th>

                {/* 15. AZIONE CHIAMA: 48px */}
                <th className="w-12 sm:w-13 py-1 px-1 text-right">
                  <span>Asta</span>
                </th>
              </tr>
            </thead>

            {/* CORPO TABELLA: 2 RIGHE PER GIOCATORE (RIGA 1: DATI, RIGA 2: NOTA AMPIA) */}
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={15} className="py-8 text-center text-slate-500 italic text-xs">
                    Nessun calciatore corrisponde ai filtri selezionati.
                  </td>
                </tr>
              ) : (
                filteredPlayers.map(p => {
                  const assignedTeam = p.assignedTo ? teams.find(t => t.id === p.assignedTo) : null;
                  const isModPass = p.ruolo === "D" && (p.mvVal >= 6.0 || p.mvLastYear >= 6.0);
                  const isInjured = Boolean(p.injuryInfo || p.s27Motivo === "infortunato");

                  return (
                    <React.Fragment key={p.id}>
                      {/* RIGA 1: TUTTI I DATI TECNICI & STATISTICI COMPATTI */}
                      <tr className="hover:bg-slate-850/70 transition-colors group">
                        
                        {/* 1. RUOLO BADGE */}
                        <td className="py-1 px-1 text-center">
                          <span className={`w-4 h-4 rounded font-black text-[10px] inline-flex items-center justify-center shadow-sm ${
                            p.ruolo === "P" ? "bg-amber-500 text-slate-950" :
                            p.ruolo === "D" ? "bg-emerald-500 text-slate-950" :
                            p.ruolo === "C" ? "bg-blue-500 text-white" :
                            "bg-red-500 text-white"
                          }`}>
                            {p.ruolo}
                          </span>
                        </td>

                        {/* 2. CALCIATORE & DUE LIVELLI DI PREFERITI: TIER S / TIER A */}
                        <td className="py-1 px-1.5 truncate">
                          <div className="flex items-center gap-1 truncate">
                            {/* PULSANTI TIER S & TIER A */}
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              <button
                                onClick={() => togglePlayerTarget(p.id, "S")}
                                className={`w-3.5 h-3.5 rounded text-[9px] font-black border transition-all flex items-center justify-center active:scale-90 ${
                                  p.targetTier === "S"
                                    ? "bg-amber-400 border-amber-300 text-slate-950 shadow-sm ring-1 ring-amber-400"
                                    : "bg-slate-950 border-slate-800 text-slate-500 hover:text-amber-300"
                                }`}
                                title={p.targetTier === "S" ? "Rimuovi da Tier S" : "Imposta Tier S (Top Target)"}
                              >
                                S
                              </button>
                              <button
                                onClick={() => togglePlayerTarget(p.id, "A")}
                                className={`w-3.5 h-3.5 rounded text-[9px] font-black border transition-all flex items-center justify-center active:scale-90 ${
                                  p.targetTier === "A"
                                    ? "bg-cyan-400 border-cyan-300 text-slate-950 shadow-sm ring-1 ring-cyan-400"
                                    : "bg-slate-950 border-slate-800 text-slate-500 hover:text-cyan-300"
                                }`}
                                title={p.targetTier === "A" ? "Rimuovi da Tier A" : "Imposta Tier A (Secondario)"}
                              >
                                A
                              </button>
                            </div>

                            <span className="font-black text-white text-xs uppercase truncate" title={p.nome}>
                              {p.nome}
                            </span>

                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              {p.isTq && (
                                <span className="px-1 rounded bg-fuchsia-600 text-white text-[8px] font-black" title="Trequartista">
                                  TQ
                                </span>
                              )}
                              {isModPass && (
                                <span className="px-1 rounded bg-emerald-500 text-slate-950 text-[8px] font-black" title="Modificatore difesa">
                                  M
                                </span>
                              )}
                              {p.rigorista && (
                                <span className="px-1 rounded bg-indigo-600 text-white text-[8px] font-black" title="Rigorista">
                                  R
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 3. SQUADRA */}
                        <td className="py-1 px-1 text-slate-300 text-xs font-bold truncate uppercase" title={p.squadra}>
                          {p.squadra}
                        </td>

                        {/* 4. QUOTAZIONE */}
                        <td className="py-1 px-0.5 text-center font-bold text-slate-200 text-xs">
                          {p.quotazione}
                        </td>

                        {/* 5. FVM (Valutazione attuale) */}
                        <td className="py-1 px-0.5 text-center font-black text-amber-400 text-sm sm:text-base">
                          {p.fvm}
                        </td>

                        {/* 6. PERCENTILE */}
                        <td className="py-1 px-0.5 text-center">
                          {p.percentileInfo ? (
                            <span 
                              className={`inline-block px-1.5 py-0.2 rounded text-[10px] cursor-help ${p.percentileInfo.badgeClass}`}
                              title={p.percentileInfo.tooltip}
                            >
                              {p.percentile}°
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">
                              {p.percentile}°
                            </span>
                          )}
                        </td>

                        {/* 7. TITOLARITA' 26/27 & RIENTRO INFORTUNIO DA GAZZETTA */}
                        <td className="py-1 px-1 truncate">
                          {isInjured ? (
                            <span 
                              className="px-1 py-0.2 rounded text-[10px] font-black bg-red-600 text-white border border-red-400 shadow-sm flex items-center gap-0.5 truncate max-w-full inline-flex"
                              title={`Infortunio: ${p.injuryInfo?.infortunio || "Infortunato"} • Rientro previsto: ${p.injuryInfo?.rientroPrevisto || "Da valutare"}`}
                            >
                              <span>🏥</span>
                              <strong className="text-white font-mono font-black truncate">
                                {p.injuryInfo?.meseRientro || "Infortunato"}
                              </strong>
                            </span>
                          ) : p.s27Titolarita ? (
                            <span 
                              className={`px-1 py-0.2 rounded text-[10px] font-black truncate max-w-full inline-flex items-center gap-0.5 ${
                                p.s27Motivo === "titolare_rotto"
                                  ? "bg-orange-500 text-slate-950"
                                  : p.s27Motivo === "fine_mercato"
                                  ? "bg-cyan-500 text-slate-950"
                                  : p.s27Motivo === "titolare_fisso"
                                  ? "bg-emerald-400 text-slate-950"
                                  : "bg-slate-800 text-slate-300"
                              }`}
                              title={p.s27Titolarita}
                            >
                              {p.s27Motivo === "titolare_fisso" && "⭐ Tit"}
                              {p.s27Motivo === "titolare_rotto" && "🚑 Sost"}
                              {p.s27Motivo === "fine_mercato" && "🕒 Merc"}
                              {p.s27Motivo !== "titolare_fisso" && p.s27Motivo !== "titolare_rotto" && p.s27Motivo !== "fine_mercato" && p.s27Titolarita}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[10px]">-</span>
                          )}
                        </td>

                        {/* 8. PV */}
                        <td className="py-1 px-0.5 text-center text-slate-400 font-bold text-xs">
                          {p.pvVal > 0 ? p.pvVal : "-"}
                        </td>

                        {/* 9. MV (Media Voto attuale 2026/27) */}
                        <td className={`py-1 px-0.5 text-center font-black text-sm sm:text-base ${
                          p.mvVal >= 6.2 ? "text-emerald-400" : p.mvVal >= 6.0 ? "text-emerald-300" : p.mvVal > 0 ? "text-white" : "text-slate-600"
                        }`} title="Media Voto stagione in corso (2026/27)">
                          {p.mvVal > 0 ? p.mvVal.toFixed(2) : "-"}
                        </td>

                        {/* 9b. MV '26 (Media Voto Ultimo Anno 2025/26) */}
                        <td className={`py-1 px-0.5 text-center font-black text-sm sm:text-base ${
                          p.mvLastYear >= 6.2 ? "text-cyan-300" : p.mvLastYear >= 6.0 ? "text-cyan-400" : p.mvLastYear > 0 ? "text-slate-300" : "text-slate-600"
                        }`} title="Media Voto Ultimo Anno (2025/26)">
                          {p.mvLastYear > 0 ? p.mvLastYear.toFixed(2) : "-"}
                        </td>

                        {/* 10. FM */}
                        <td className={`py-1 px-0.5 text-center font-bold text-xs ${
                          p.fmVal >= 7.5 ? "text-indigo-400 font-black" : p.fmVal >= 7.0 ? "text-indigo-300" : p.fmVal > 0 ? "text-slate-400" : "text-slate-600"
                        }`}>
                          {p.fmVal > 0 ? p.fmVal.toFixed(2) : "-"}
                        </td>

                        {/* 11. GOL / GS */}
                        <td className="py-1 px-0.5 text-center font-bold text-slate-300 text-xs">
                          {p.ruolo === "P" ? (p.gs != null ? `-${p.gs}` : "-") : (p.gf != null ? p.gf : "-")}
                        </td>

                        {/* 12. RIGORI */}
                        <td className="py-1 px-0.5 text-center text-slate-400 text-xs">
                          {p.rigoriVal > 0 ? `${p.rigoriVal}R` : "-"}
                        </td>

                        {/* 13. ASSIST */}
                        <td className="py-1 px-0.5 text-center text-slate-400 text-xs">
                          {p.assistVal > 0 ? p.assistVal : "-"}
                        </td>

                        {/* 14. STATO D'ASTA & ASSEGNAZIONE */}
                        <td className="py-1 px-1 text-center truncate">
                          {p.status === "assigned" ? (
                            <span 
                              className="px-1 py-0.2 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 text-[10px] font-black truncate block"
                              title={`${assignedTeam?.name}: ${p.price}`}
                            >
                              {assignedTeam?.name?.substring(0, 5)}: {p.price}
                            </span>
                          ) : p.status === "skipped" ? (
                            <span className="px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[9px] font-bold block">
                              Invend.
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px] font-medium block">
                              Libero
                            </span>
                          )}
                        </td>

                        {/* 15. AZIONE CHIAMA ALL'ASTA */}
                        <td className="py-1 px-1 text-right">
                          <button
                            onClick={() => startAuctionForPlayer(p)}
                            className="px-1.5 py-0.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded text-[10px] font-bold border border-slate-700 hover:border-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-0.5 ml-auto"
                            title={`Chiama subito ${p.nome}`}
                          >
                            <Gavel className="w-2.5 h-2.5" />
                            <span>Chiama</span>
                          </button>
                        </td>
                      </tr>

                      {/* RIGA 2: NOTA PERSONALE DEDICATA & INFORTUNIO A TUTTA LARGHEZZA */}
                      <tr className="bg-slate-950/40 border-b border-slate-800/80 hover:bg-slate-900/40 transition-colors">
                        <td colSpan={16} className="py-0.5 px-2">
                          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                            {p.injuryInfo && (
                              <span 
                                className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/90 border border-red-300 dark:border-red-500/60 text-red-950 dark:text-red-100 text-[10px] font-mono flex items-center gap-1 flex-shrink-0 shadow-sm"
                                title={`Diagnosi completa: ${p.injuryInfo.infortunio} • Rientro previsto: ${p.injuryInfo.rientroPrevisto}`}
                              >
                                <span>{p.injuryInfo.meseRientro === 'Squalificato' ? '🟥' : '🏥'}</span>
                                <strong className="text-red-700 dark:text-yellow-300 font-black">{p.injuryInfo.meseRientro}:</strong>
                                <span className="text-red-950 dark:text-red-100 max-w-[200px] sm:max-w-[340px] truncate font-semibold">{p.injuryInfo.infortunio}</span>
                              </span>
                            )}
                            <span className={`text-[10px] font-black uppercase flex items-center gap-0.5 flex-shrink-0 ${
                              p.note?.startsWith("Tattico:") ? "text-amber-400" : "text-indigo-400"
                            }`}>
                              {p.note?.startsWith("Tattico:") ? (
                                <span className="px-1 py-0.2 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center gap-1">
                                  <span>🎖️</span>
                                  <span>Tattico:</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5">
                                  <StickyNote className="w-3 h-3 text-indigo-400" />
                                  <span>Nota:</span>
                                </span>
                              )}
                            </span>
                            <input
                              type="text"
                              placeholder={`Aggiungi nota per ${p.nome}... `}
                              value={p.note || ""}
                              onChange={(e) => updatePlayerNote(p.id, e.target.value)}
                              className={`w-full bg-slate-900/90 border border-slate-800 focus:border-amber-400 rounded px-2 py-0.5 text-xs font-sans focus:outline-none shadow-inner ${
                                p.note?.startsWith("Tattico:") ? "text-amber-200 font-medium" : "text-slate-200"
                              }`}
                            />
                            {p.note && (
                              <button
                                onClick={() => updatePlayerNote(p.id, "")}
                                className="text-slate-500 hover:text-slate-300 text-xs font-bold px-1"
                                title="Cancella nota"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
