import React, { useState, useEffect, useRef } from 'react';
import { useAuction } from '../context/AuctionContext';
import { parseRostersCsv, exportCurrentRostersCsv, RosterParseResult } from '../utils/rosterImporter';
import { 
  X, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  FileSpreadsheet, 
  ChevronRight,
  Info
} from 'lucide-react';

interface RosterImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RosterImportModal: React.FC<RosterImportModalProps> = ({ isOpen, onClose }) => {
  const { teams, players, applyImportedRosters, theme } = useAuction();
  const isLight = theme === 'light';

  const [inputMode, setInputMode] = useState<'paste' | 'file'>('paste');
  const [csvText, setCsvText] = useState<string>('');
  const [parseResult, setParseResult] = useState<RosterParseResult | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [applySuccessFeedback, setApplySuccessFeedback] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gestione tasto indietro (popstate) ed ESC per chiudere
  useEffect(() => {
    if (!isOpen) return;
    const handlePopState = () => onClose();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Analizza il testo inserito
  const handleValidate = (textToValidate?: string) => {
    const text = textToValidate !== undefined ? textToValidate : csvText;
    if (!text.trim()) {
      setParseResult(null);
      return;
    }
    const res = parseRostersCsv(text, players);
    setParseResult(res);
  };

  // Lettura file caricato
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvText(content);
        handleValidate(content);
      }
    };
    reader.readAsText(file);
  };

  // Scarica template CSV delle rose attuali
  const handleDownloadTemplate = () => {
    const csvContent = exportCurrentRostersCsv(teams);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rose_fantacalcio_template_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copia template negli appunti
  const handleCopyTemplate = () => {
    const csvContent = exportCurrentRostersCsv(teams);
    navigator.clipboard.writeText(csvContent).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    });
  };

  // Carica le rose attuali nella textarea come base
  const handleLoadCurrentIntoTextarea = () => {
    const current = exportCurrentRostersCsv(teams);
    setCsvText(current);
    handleValidate(current);
  };

  // Applica le squadre all'applicazione
  const handleApply = () => {
    if (!parseResult || !parseResult.teams || parseResult.teams.length === 0) return;

    applyImportedRosters(parseResult.teams);
    setApplySuccessFeedback(true);

    setTimeout(() => {
      setApplySuccessFeedback(false);
      onClose();
    }, 1800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl flex flex-col max-h-[94vh] my-auto overflow-hidden transition-colors ${
          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* HEADER MODALE */}
        <div className={`p-3.5 sm:p-4 border-b flex items-start justify-between gap-2 flex-shrink-0 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/90 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
              <Upload className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-black uppercase tracking-wide flex items-center gap-2 ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}>
                <span>Aggiorna Rose da Template CSV</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500 text-slate-950 font-black">
                  ONLINE
                </span>
              </h2>
              <p className={`text-xs mt-0.5 font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Incolla il testo del foglio o carica un file CSV per aggiornare tutte le 8 rose in tempo reale.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-all ${
              isLight 
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Chiudi (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOOLBAR PULSANTI RAPIDI */}
        <div className={`px-4 py-2.5 border-b flex items-center justify-between gap-2 flex-wrap text-xs ${
          isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setInputMode('paste')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                inputMode === 'paste'
                  ? (isLight ? 'bg-white text-slate-950 shadow font-black border border-slate-300' : 'bg-slate-800 text-white shadow font-black border border-slate-700')
                  : (isLight ? 'text-slate-600 hover:text-slate-950' : 'text-slate-400 hover:text-white')
              }`}
            >
              Incolla Testo
            </button>
            <button
              onClick={() => setInputMode('file')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                inputMode === 'file'
                  ? (isLight ? 'bg-white text-slate-950 shadow font-black border border-slate-300' : 'bg-slate-800 text-white shadow font-black border border-slate-700')
                  : (isLight ? 'text-slate-600 hover:text-slate-950' : 'text-slate-400 hover:text-white')
              }`}
            >
              Carica File (.csv)
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleLoadCurrentIntoTextarea}
              className={`px-2.5 py-1.5 rounded-lg font-bold border flex items-center gap-1 transition-all ${
                isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
              title="Carica le rose attuali dell'app nel riquadro per modificarle"
            >
              <span>Carica Rose Attuali</span>
            </button>

            <button
              onClick={handleCopyTemplate}
              className={`px-2.5 py-1.5 rounded-lg font-bold border flex items-center gap-1 transition-all ${
                isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
              title="Copia negli appunti il template CSV compilato"
            >
              {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copyFeedback ? 'Copiato!' : 'Copia CSV'}</span>
            </button>

            <button
              onClick={handleDownloadTemplate}
              className={`px-2.5 py-1.5 rounded-lg font-bold border flex items-center gap-1 transition-all ${
                isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
              title="Scarica file template CSV per Excel"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Scarica .csv</span>
            </button>
          </div>
        </div>

        {/* CORPO MODALE SCROLLABILE */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
          
          {/* MODALITÀ 1: INCOLLA TESTO */}
          {inputMode === 'paste' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold">
                  Incolla qui la tabella o il testo CSV:
                </label>
                <span className={`font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Formato: Squadra,costo,,Squadra,costo...
                </span>
              </div>
              <textarea
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  handleValidate(e.target.value);
                }}
                placeholder={`Scarsenal,costo,,ABIDJAN,costo,,Gallosballo,costo,,Brancamenta,costo,,Al-Meja,costo,,AC Arbora,costo,,SanZeno,costo,,LONGOBARDA,costo\nSvilar,22,,Butez,16,,De Gea,6,,Meret,19,,Maignan,18,,Vicario,19,,Martinez Jo.,25,,Carnesecchi,15\n...`}
                rows={9}
                className={`w-full p-2.5 rounded-xl border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600'
                }`}
              />
            </div>
          ) : (
            /* MODALITÀ 2: CARICA FILE */
            <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-3 transition-colors ${
              isLight ? 'border-slate-300 bg-slate-50' : 'border-slate-800 bg-slate-950/50'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm">Seleziona o trascina il file CSV delle rose</h4>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Supporta file esportati da Excel o salvati con estensione .csv o .txt
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="roster-file-upload"
              />
              <label
                htmlFor="roster-file-upload"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow-md transition-all active:scale-95"
              >
                Scegli File dal Dispositivo
              </label>
            </div>
          )}

          {/* ANTEPRIMA VALIDAZIONE */}
          {parseResult && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* BANNER STATO */}
              {parseResult.success ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-2.5 text-xs text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 font-bold">
                    <span>{parseResult.message}</span>
                    <span className="block text-[11px] font-normal opacity-90 mt-0.5">
                      Tutte le rose rispettano i 25 slot e i costi sono stati verificati. Clicca su "Applica Rose" in basso per confermare.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-2 text-xs text-amber-200">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-amber-300">{parseResult.message}</span>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        Verifica i seguenti calciatori non riconosciuti nel listone ufficiale:
                      </p>
                    </div>
                  </div>

                  {parseResult.unmatched.length > 0 && (
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-amber-500/30 max-h-40 overflow-y-auto space-y-1 font-mono text-[11px]">
                      {parseResult.unmatched.map((u, idx) => (
                        <div key={idx} className="flex items-center justify-between text-amber-300">
                          <span>{u.teamName}: riga {u.rowIdx}</span>
                          <span className="font-bold underline">{u.rawName} ({u.expectedRole})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* GRIGLIA ANTEPRIMA SQUADRE RICONOSCIUTE */}
              {parseResult.teams.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider flex items-center justify-between">
                    <span>Squadre Riconosciute ({parseResult.teams.length}/8)</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Totale Assegnati: {parseResult.totalAssigned} calciatori
                    </span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {parseResult.teams.map((t) => {
                      const totalSpent = t.players.reduce((sum, p) => sum + p.price, 0);
                      return (
                        <div 
                          key={t.id}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black truncate max-w-[100px]">{t.name}</span>
                            <span className="text-[10px] px-1 rounded font-mono font-bold bg-slate-800 text-slate-300">
                              {t.players.length}/25
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Spesi:</span>
                            <span className="font-bold">{totalSpent} cr</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Cassa:</span>
                            <span className={`font-black ${t.currentBudget > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                              {t.currentBudget} cr
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* FOOTER MODALE: CONFERMA E APPLICA */}
        <div className={`p-3.5 sm:p-4 border-t flex items-center justify-between gap-2 flex-shrink-0 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/90 border-slate-800'
        }`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Info className="w-4 h-4 text-slate-500 hidden sm:inline" />
            <span className="text-[11px]">Aggiorna rose, svincolati e formazioni per tutta l'app.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Annulla
            </button>

            <button
              onClick={handleApply}
              disabled={!parseResult || parseResult.teams.length === 0}
              className={`px-5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-lg transition-all active:scale-95 ${
                parseResult && parseResult.teams.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              {applySuccessFeedback ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Rose Applicate!</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Applica Rose ({parseResult?.totalAssigned || 0})</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
