import * as XLSX from 'xlsx';
import { Player, Role, Team } from '../types';
import { getTatticoAdvice } from '../data/tatticoData';
import { getInjuryInfo } from '../data/injuryData';
import { FANTAGAZZETTA_ADVICE } from '../data/matchdayData';
import { RolePercentileResult } from './auctionCalculations';
import { parseFantacalcioExcel } from './excelParser';

export interface ListoneExportRow {
  Id: number;
  Ruolo: string;
  'Ruolo Mantra': string;
  Nome: string;
  Squadra: string;
  'Qt.A': number;
  FVM: number;
  Percentile: string;
  'Titolarità 2026/27': string;
  'Note Utente': string;
  'Consiglio Tattico (Diddi)': string;
  'Consiglio Redazione': string;
  'Infortunio / Squalifica': string;
  Pv: number;
  Mv: number | string;
  Fm: number | string;
  Gf: number;
  Gs: number;
  Ass: number;
  Rigorista: string;
  Modificatore: string;
  'Target Asta': string;
  'Stato Asta': string;
  'Prezzo Asta': number | string;
  'Squadra Asta': string;
}

const COLUMN_WIDTHS = [
  { wch: 8 },  // Id
  { wch: 6 },  // Ruolo
  { wch: 12 }, // Ruolo Mantra
  { wch: 22 }, // Nome
  { wch: 15 }, // Squadra
  { wch: 6 },  // Qt.A
  { wch: 6 },  // FVM
  { wch: 12 }, // Percentile
  { wch: 32 }, // Titolarità 2026/27
  { wch: 45 }, // Note Utente
  { wch: 50 }, // Consiglio Tattico (Diddi)
  { wch: 40 }, // Consiglio Redazione
  { wch: 35 }, // Infortunio / Squalifica
  { wch: 6 },  // Pv
  { wch: 6 },  // Mv
  { wch: 6 },  // Fm
  { wch: 6 },  // Gf
  { wch: 6 },  // Gs
  { wch: 6 },  // Ass
  { wch: 10 }, // Rigorista
  { wch: 12 }, // Modificatore
  { wch: 11 }, // Target Asta
  { wch: 14 }, // Stato Asta
  { wch: 11 }, // Prezzo Asta
  { wch: 18 }  // Squadra Asta
];

function buildExportRows(
  players: Player[], 
  teams: Team[], 
  percentilesMap?: Map<number, RolePercentileResult>
): ListoneExportRow[] {
  const teamMap = new Map(teams.map(t => [t.id, t.name]));

  return players.map(p => {
    const s27 = p.seasons?.['2026/27'];
    const percInfo = percentilesMap?.get(p.id);
    const percentileStr = percInfo ? `${percInfo.percentile}% (${percInfo.comment})` : '';

    const injury = getInjuryInfo(p.nome);
    const injuryStr = injury 
      ? `${injury.isSqualificato ? '[SQUALIFICATO] ' : ''}${injury.infortunio}${injury.rientroPrevisto ? ` (Rientro: ${injury.rientroPrevisto})` : ''}` 
      : '';

    const redazioneAdvice = FANTAGAZZETTA_ADVICE[p.nome];
    const redazioneStr = redazioneAdvice 
      ? `${redazioneAdvice.fascia || ''}: ${redazioneAdvice.commentoRedazione || ''}`.trim() 
      : '';

    const tattico = getTatticoAdvice(p.nome) || '';
    const noteUtente = p.note || '';

    const titolaritaStr = s27?.titolaritaDettaglio || p.titolarita2026_27 || '';

    const assignedTeamName = p.assignedTo ? (teamMap.get(p.assignedTo) || p.assignedTo) : '';

    const statoAstaStr = p.status === 'assigned' 
      ? 'Assegnato' 
      : p.status === 'skipped' 
        ? 'Chiamato (Zero offerte)' 
        : 'Libero';

    return {
      Id: p.id,
      Ruolo: p.ruolo,
      'Ruolo Mantra': p.ruoloMantra || (p.ruolo === 'P' ? 'POR' : p.ruolo === 'D' ? 'DC' : p.ruolo === 'C' ? 'C' : 'PC'),
      Nome: p.nome,
      Squadra: p.squadra,
      'Qt.A': p.quotazione,
      FVM: p.fvm,
      Percentile: percentileStr,
      'Titolarità 2026/27': titolaritaStr,
      'Note Utente': noteUtente,
      'Consiglio Tattico (Diddi)': tattico,
      'Consiglio Redazione': redazioneStr,
      'Infortunio / Squalifica': injuryStr,
      Pv: s27?.pg ?? p.pg ?? 0,
      Mv: s27?.mv !== undefined && s27?.mv !== null ? s27.mv : (p.mv ?? 0),
      Fm: s27?.fm !== undefined && s27?.fm !== null ? s27.fm : (p.fm ?? 0),
      Gf: s27?.gf ?? p.gf ?? 0,
      Gs: s27?.gs ?? p.gs ?? 0,
      Ass: s27?.assist ?? p.assist ?? 0,
      Rigorista: p.rigorista ? 'Sì' : 'No',
      Modificatore: p.consigliatoModificatore ? 'Sì' : 'No',
      'Target Asta': p.targetTier || (p.isTarget ? 'S' : ''),
      'Stato Asta': statoAstaStr,
      'Prezzo Asta': p.price !== null && p.price !== undefined ? p.price : '',
      'Squadra Asta': assignedTeamName
    };
  });
}

export function exportListoneExcel(
  players: Player[], 
  teams: Team[], 
  percentilesMap?: Map<number, RolePercentileResult>
): { success: boolean; count: number; filename: string } {
  try {
    const allRows = buildExportRows(players, teams, percentilesMap);

    const wb = XLSX.utils.book_new();

    // Foglio 1: Tutti i calciatori
    const wsAll = XLSX.utils.json_to_sheet(allRows);
    wsAll['!cols'] = COLUMN_WIDTHS;
    XLSX.utils.book_append_sheet(wb, wsAll, 'Tutti');

    // Foglio 2: Portieri
    const portieri = allRows.filter(r => r.Ruolo === 'P');
    if (portieri.length > 0) {
      const wsP = XLSX.utils.json_to_sheet(portieri);
      wsP['!cols'] = COLUMN_WIDTHS;
      XLSX.utils.book_append_sheet(wb, wsP, 'Portieri');
    }

    // Foglio 3: Difensori
    const difensori = allRows.filter(r => r.Ruolo === 'D');
    if (difensori.length > 0) {
      const wsD = XLSX.utils.json_to_sheet(difensori);
      wsD['!cols'] = COLUMN_WIDTHS;
      XLSX.utils.book_append_sheet(wb, wsD, 'Difensori');
    }

    // Foglio 4: Centrocampisti
    const centrocampisti = allRows.filter(r => r.Ruolo === 'C');
    if (centrocampisti.length > 0) {
      const wsC = XLSX.utils.json_to_sheet(centrocampisti);
      wsC['!cols'] = COLUMN_WIDTHS;
      XLSX.utils.book_append_sheet(wb, wsC, 'Centrocampisti');
    }

    // Foglio 5: Attaccanti
    const attaccanti = allRows.filter(r => r.Ruolo === 'A');
    if (attaccanti.length > 0) {
      const wsA = XLSX.utils.json_to_sheet(attaccanti);
      wsA['!cols'] = COLUMN_WIDTHS;
      XLSX.utils.book_append_sheet(wb, wsA, 'Attaccanti');
    }

    // Foglio 6: Note & Target (schede con annotazioni personali o target)
    const noteTarget = allRows.filter(r => 
      (r['Note Utente'] && r['Note Utente'].trim().length > 0) || 
      (r['Target Asta'] && r['Target Asta'].trim().length > 0)
    );
    if (noteTarget.length > 0) {
      const wsNote = XLSX.utils.json_to_sheet(noteTarget);
      wsNote['!cols'] = COLUMN_WIDTHS;
      XLSX.utils.book_append_sheet(wb, wsNote, 'Note e Target');
    }

    // Genera buffer e attiva il download
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `Listone_Fantacalcio_Commenti_${dateStr}.xlsx`;

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, count: players.length, filename };
  } catch (err) {
    console.error('Errore durante export Excel listone:', err);
    throw err;
  }
}

export function exportListoneJson(players: Player[]): { success: boolean; count: number; filename: string } {
  try {
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `Listone_Fantacalcio_Backup_${dateStr}.json`;
    const dataStr = JSON.stringify(players, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, count: players.length, filename };
  } catch (err) {
    console.error('Errore durante export JSON listone:', err);
    throw err;
  }
}

export async function parseListoneFile(file: File): Promise<{
  success: boolean;
  message: string;
  players: Player[];
  count: number;
}> {
  const fileName = file.name.toLowerCase();

  // 1. Gestione JSON
  if (fileName.endsWith('.json')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          let playersList: Player[] = [];
          if (Array.isArray(parsed)) {
            playersList = parsed;
          } else if (parsed && Array.isArray(parsed.players)) {
            playersList = parsed.players;
          }

          if (playersList.length > 0) {
            resolve({
              success: true,
              message: `Caricati con successo ${playersList.length} calciatori da file JSON (${file.name})`,
              players: playersList,
              count: playersList.length
            });
          } else {
            resolve({
              success: false,
              message: 'Nessun calciatore valido trovato nel file JSON',
              players: [],
              count: 0
            });
          }
        } catch (err: any) {
          resolve({
            success: false,
            message: `Errore analisi JSON: ${err?.message || 'File non valido'}`,
            players: [],
            count: 0
          });
        }
      };
      reader.onerror = () => {
        resolve({
          success: false,
          message: 'Errore durante la lettura del file JSON',
          players: [],
          count: 0
        });
      };
      reader.readAsText(file);
    });
  }

  // 2. Gestione Excel (.xlsx, .xls, .csv)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        if (!buffer) {
          resolve({
            success: false,
            message: 'File vuoto o non leggibile',
            players: [],
            count: 0
          });
          return;
        }

        const res = parseFantacalcioExcel(buffer);
        resolve({
          success: res.success,
          message: res.message,
          players: res.players,
          count: res.totalParsed
        });
      } catch (err: any) {
        resolve({
          success: false,
          message: `Errore analisi Excel: ${err?.message || 'File non supportato'}`,
          players: [],
          count: 0
        });
      }
    };
    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Errore lettura file Excel',
        players: [],
        count: 0
      });
    };
    reader.readAsArrayBuffer(file);
  });
}
