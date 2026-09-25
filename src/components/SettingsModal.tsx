import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { 
  Settings, 
  Users, 
  RotateCcw, 
  Sliders, 
  Check, 
  Trash2, 
  ShieldAlert, 
  Download, 
  Upload,
  Sun,
  Moon,
  FileSpreadsheet
} from 'lucide-react';
import { exportListoneExcel, parseListoneFile } from '../utils/listoneExportImport';

export const SettingsModal: React.FC = () => {
  const { 
    teams, 
    updateTeam, 
    minimumPrice, 
    setMinimumPrice, 
    initialBudget, 
    slotConfig, 
    resetEntireAuction,
    reloadOfficialData,
    loadSimulatedAuction,
    players,
    importPlayersList,
    theme,
    setTheme
  } = useAuction();

  const [localMinPrice, setLocalMinPrice] = useState(minimumPrice);

  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', 
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
    '#14b8a6', '#6366f1', '#f43f5e', '#84cc16'
  ];

  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);
  const listoneInputRef = React.useRef<HTMLInputElement>(null);

  // Esportazione Listone Excel con tutti i commenti
  const handleExportListoneExcel = () => {
    try {
      const res = exportListoneExcel(players, teams);
      setSettingsFeedback(`Listone scaricato con successo (${res.count} calciatori con note e commenti salvati in ${res.filename})`);
      setTimeout(() => setSettingsFeedback(null), 6000);
    } catch (err: any) {
      setSettingsFeedback(`Errore download listone: ${err?.message || 'Errore imprevisto'}`);
    }
  };

  // Ricarica Listone (Excel / JSON)
  const handleListoneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await parseListoneFile(file);
      if (result.success && result.players.length > 0) {
        importPlayersList(result.players, 'merge');
        setSettingsFeedback(result.message);
      } else {
        setSettingsFeedback(`Errore: ${result.message}`);
      }
    } catch (err: any) {
      setSettingsFeedback(`Errore lettura file: ${err?.message || 'Formato non supportato'}`);
    } finally {
      if (listoneInputRef.current) {
        listoneInputRef.current.value = '';
      }
      setTimeout(() => setSettingsFeedback(null), 6000);
    }
  };

  // Backup completo in JSON
  const handleBackupExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      teams,
      players,
      minimumPrice,
      slotConfig
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fanta_asta_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl w-full mx-auto space-y-3.5 overflow-y-auto max-h-[calc(100vh-75px)] pr-2 pb-16 scrollbar-thin">
      
      {/* HEADER IMPOSTAZIONI */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          <span>Configurazione Regole & Squadre della Lega</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Personalizza i nomi delle 8 squadre, i colori, il prezzo minimo di partenza e i parametri d'asta.
        </p>
      </div>

      {/* REGOLE LEGA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Parametri di Gioco</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* BUDGET INIZIALE */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block uppercase">Budget Iniziale</span>
            <span className="text-2xl font-black font-mono text-amber-300 mt-1 block">
              {initialBudget} <span className="text-xs text-slate-500 font-normal">crediti</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Regola standard impostata</span>
          </div>

          {/* PREZZO MINIMO D'ASTA (BASE 0 vs BASE 1) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block uppercase">Prezzo Minimo Partenza</span>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  setLocalMinPrice(1);
                  setMinimumPrice(1);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all border ${
                  minimumPrice === 1
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Base 1 {minimumPrice === 1 ? '(Attivo)' : ''}
              </button>
              <button
                onClick={() => {
                  setLocalMinPrice(0);
                  setMinimumPrice(0);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all border ${
                  minimumPrice === 0
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Base 0 {minimumPrice === 0 ? '(Attivo)' : ''}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {minimumPrice === 0 ? 'I rilanci partono da 0 crediti.' : 'Ogni slot richiede almeno 1 credito.'}
            </span>
          </div>

          {/* COMPOSIZIONE ROSA */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block uppercase">Composizione Rosa (25)</span>
            <div className="flex items-center gap-2 mt-2 font-mono font-bold text-sm">
              <span className="text-amber-400">{slotConfig.P}P</span>
              <span className="text-slate-600">-</span>
              <span className="text-emerald-400">{slotConfig.D}D</span>
              <span className="text-slate-600">-</span>
              <span className="text-blue-400">{slotConfig.C}C</span>
              <span className="text-slate-600">-</span>
              <span className="text-red-400">{slotConfig.A}A</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">8 Squadre • 6 Attaccanti</span>
          </div>

          {/* TEMA GRAFICO CHIARO / SCURO */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Tema Grafico</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Modalità visiva dell'app</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-amber-400 text-amber-300 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Scuro</span>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1 ${
                  theme === 'light'
                    ? 'bg-amber-100 border-amber-400 text-amber-900 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Chiaro</span>
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {theme === 'light' ? 'Tema Chiaro attivo.' : 'Tema Scuro attivo.'}
            </span>
          </div>

        </div>
      </div>

      {/* NOMI E COLORI DELLE 8 SQUADRE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span>Personalizza le 8 Squadre</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {teams.map((team, idx) => (
            <div
              key={team.id}
              className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3"
            >
              <div className="relative group">
                <input
                  type="color"
                  value={team.color}
                  onChange={(e) => updateTeam(team.id, { color: e.target.value })}
                  className="w-9 h-9 rounded-xl border border-slate-700 cursor-pointer bg-transparent"
                />
              </div>

              <div className="flex-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">
                  Squadra {idx + 1}
                </label>
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none mt-0.5"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BACKUP E RESET ASTA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Backup & Manutenzione Sessione</span>
        </h3>

        {/* LISTONE EXCEL CON COMMENTI: SCARICA E RICARICA */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <input
            type="file"
            ref={listoneInputRef}
            onChange={handleListoneUpload}
            accept=".xlsx, .xls, .csv, .json"
            className="hidden"
          />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Gestione Listone Calciatori con Commenti & Note</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Scarica l'intero listone con tutte le schede, i commenti tattici di Diddi, le note personali, target e percentili in formato Excel (.xlsx), oppure ricarica un file modificato.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleExportListoneExcel}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow transition-all active:scale-95 border border-emerald-400"
                title="Scarica listone completo in Excel (.xlsx) con tutti i commenti e note"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Scarica Listone (.xlsx)</span>
              </button>
              <button
                onClick={() => listoneInputRef.current?.click()}
                className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow transition-all active:scale-95 border border-sky-400"
                title="Ricarica o aggiorna il listone con commenti da file (.xlsx o .json)"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Ricarica Listone</span>
              </button>
            </div>
          </div>
          {settingsFeedback && (
            <div className="p-2 rounded bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
              {settingsFeedback}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
          <button
            onClick={loadSimulatedAuction}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 border border-emerald-400"
            title="Carica la simulazione completa dell'asta con tutte le 8 rose al completo (25 calciatori: P, D, C, A)"
          >
            <Sliders className="w-4 h-4" />
            <span>⚡ Carica Simulazione Asta Completa (25/25 Calciatori)</span>
          </button>

          <button
            onClick={reloadOfficialData}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Ricarica Archivio Ufficiale</span>
          </button>

          <button
            onClick={handleBackupExport}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Salva Backup Sessione (.json)</span>
          </button>

          <button
            onClick={resetEntireAuction}
            className="w-full sm:w-auto px-4 py-2.5 bg-red-950/60 hover:bg-red-900 border border-red-700 text-red-200 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Azzera Asta</span>
          </button>
        </div>
      </div>

    </div>
  );
};
