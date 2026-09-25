import * as XLSX from 'xlsx';
import { Player, Role } from '../types';

export interface ParseResult {
  players: Player[];
  success: boolean;
  message: string;
  totalParsed: number;
}

export function parseFantacalcioExcel(fileData: ArrayBuffer): ParseResult {
  try {
    const workbook = XLSX.read(fileData, { type: 'array' });
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return { players: [], success: false, message: 'Nessun foglio trovato nel file Excel', totalParsed: 0 };
    }

    // Cerca foglio 'Tutti', 'Quotazioni', o usa il primo foglio
    const preferredSheets = ['tutti', 'quotazioni', 'listone', 'statistiche'];
    let targetSheetName = workbook.SheetNames[0];
    for (const name of workbook.SheetNames) {
      if (preferredSheets.includes(name.trim().toLowerCase())) {
        targetSheetName = name;
        break;
      }
    }

    const worksheet = workbook.Sheets[targetSheetName];
    // Converti in array di oggetti
    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1, defval: '' });

    if (rawData.length < 2) {
      return { players: [], success: false, message: 'Il foglio Excel selezionato è vuoto o privo di dati', totalParsed: 0 };
    }

    // Trova la riga di intestazione (alcuni export di Fantacalcio.it hanno 1-2 righe di intestazione prima dei dati)
    let headerRowIndex = -1;
    let headers: string[] = [];

    for (let i = 0; i < Math.min(10, rawData.length); i++) {
      const row = rawData[i] as any[];
      const rowStr = row.map(c => String(c).trim().toLowerCase());
      if (rowStr.includes('nome') && (rowStr.includes('r') || rowStr.includes('ruolo'))) {
        headerRowIndex = i;
        headers = rowStr;
        break;
      }
    }

    if (headerRowIndex === -1) {
      // Fallback alla prima riga
      headerRowIndex = 0;
      headers = (rawData[0] as any[]).map(c => String(c).trim().toLowerCase());
    }

    // Mappatura indici colonne
    const getColIndex = (candidates: string[]) => {
      return headers.findIndex(h => candidates.some(c => h === c || h.replace(/[^a-z0-9]/g, '') === c));
    };

    const idCol = getColIndex(['id']);
    const roleCol = getColIndex(['r', 'ruolo', 'ruoloclassic']);
    const mantraRoleCol = getColIndex(['rm', 'ruolomantra', 'mantra']);
    const nameCol = getColIndex(['nome', 'calciatore', 'giocatore']);
    const teamCol = getColIndex(['squadra', 'club', 'team']);
    const qtaCol = getColIndex(['qta', 'quotazioneattuale', 'quotazione', 'qa', 'q']);
    const fvmCol = getColIndex(['fvm', 'fantavolore', 'fantavalore']);
    const pgCol = getColIndex(['pg', 'pv', 'presenze', 'partite']);
    const mvCol = getColIndex(['mv', 'mediavoto']);
    const fmCol = getColIndex(['fm', 'mf', 'fantamedia']);
    const gfCol = getColIndex(['gf', 'gol', 'golfatti']);
    const gsCol = getColIndex(['gs', 'golsubiti']);
    const assistCol = getColIndex(['as', 'assist', 'ass']);
    const rcCol = getColIndex(['rc', 'rigoricalciati']);
    const rSegnatiCol = getColIndex(['r+', 'rigorisegnati', 'rs']);
    const ammCol = getColIndex(['amm', 'ammonizioni']);
    const espCol = getColIndex(['esp', 'espulsioni']);
    const noteCol = getColIndex(['note', 'noteutente', 'notapersonale', 'commento', 'commenti', 'notetattico', 'consigliotattico', 'consigliotatticodiddi']);
    const targetCol = getColIndex(['target', 'targetasta', 'tier', 'targettier', 'fascia']);
    const statusCol = getColIndex(['status', 'stato', 'statusasta', 'statoasta']);
    const priceCol = getColIndex(['prezzo', 'prezzoasta', 'costo', 'price']);
    const teamAssignedCol = getColIndex(['squadraasta', 'assegnatoa', 'assegnato', 'squadraassegnata']);
    const titolaritaCol = getColIndex(['titolarita', 'titolarita202627', 'info202627', 'motivo', 'motivotitolarita']);

    if (nameCol === -1) {
      return { players: [], success: false, message: 'Colonna "Nome" non trovata nel file Excel', totalParsed: 0 };
    }

    const players: Player[] = [];
    let currentId = 1;

    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
      const row = rawData[i] as any[];
      if (!row || row.length === 0) continue;

      const rawName = String(row[nameCol] || '').trim();
      if (!rawName || rawName.length < 2) continue;

      // Normalizzazione Ruolo
      let rawRole = roleCol !== -1 ? String(row[roleCol] || '').trim().toUpperCase() : 'C';
      // Gestione Classic vs Mantra: se contiene "/", prendi il primo oppure mappa
      let role: Role = 'C';
      if (rawRole.includes('P') || rawRole === 'POR') role = 'P';
      else if (rawRole.includes('D') || rawRole === 'DC' || rawRole === 'DD' || rawRole === 'DS') role = 'D';
      else if (rawRole.includes('A') || rawRole === 'PC') role = 'A';
      else role = 'C';

      const team = teamCol !== -1 ? String(row[teamCol] || '').trim() : 'Sconosciuta';
      const quotazione = qtaCol !== -1 ? Number(row[qtaCol]) || 1 : 1;
      const fvm = fvmCol !== -1 ? Number(row[fvmCol]) || quotazione : quotazione;
      const pg = pgCol !== -1 ? Number(row[pgCol]) || 0 : undefined;
      const mv = mvCol !== -1 ? parseFloat(String(row[mvCol]).replace(',', '.')) || 0 : undefined;
      const fm = fmCol !== -1 ? parseFloat(String(row[fmCol]).replace(',', '.')) || 0 : undefined;
      const gf = gfCol !== -1 ? Number(row[gfCol]) || 0 : undefined;
      const gs = gsCol !== -1 ? Number(row[gsCol]) || 0 : undefined;
      const assist = assistCol !== -1 ? Number(row[assistCol]) || 0 : undefined;
      const rc = rcCol !== -1 ? Number(row[rcCol]) || 0 : undefined;
      const rSegnati = rSegnatiCol !== -1 ? Number(row[rSegnatiCol]) || 0 : undefined;
      const amm = ammCol !== -1 ? Number(row[ammCol]) || 0 : undefined;
      const esp = espCol !== -1 ? Number(row[espCol]) || 0 : undefined;

      const isRigorista = (rc !== undefined && rc >= 2) || (rSegnati !== undefined && rSegnati >= 1);
      const consigliatoModificatore = role === 'D' && mv !== undefined && mv >= 6.0;

      const parsedId = idCol !== -1 && !isNaN(Number(row[idCol])) && Number(row[idCol]) > 0
        ? Number(row[idCol])
        : currentId++;

      // Campi personalizzati ed export arricchito
      const rawMantra = mantraRoleCol !== -1 ? String(row[mantraRoleCol] || '').trim() : undefined;
      const rawNote = noteCol !== -1 ? String(row[noteCol] || '').trim() : undefined;
      
      const rawTarget = targetCol !== -1 ? String(row[targetCol] || '').trim().toUpperCase() : undefined;
      const targetTier: 'S' | 'A' | null = rawTarget === 'S' || rawTarget === 'TIER S' 
        ? 'S' 
        : rawTarget === 'A' || rawTarget === 'TIER A' 
          ? 'A' 
          : null;
      const isTarget = targetTier !== null || Boolean(rawTarget && rawTarget !== 'NO' && rawTarget !== '-' && rawTarget.length > 0);

      let status: 'available' | 'assigned' | 'skipped' = 'available';
      if (statusCol !== -1) {
        const rawStatus = String(row[statusCol] || '').trim().toLowerCase();
        if (rawStatus.includes('assegnat') || rawStatus === 'assigned') status = 'assigned';
        else if (rawStatus.includes('chiamat') || rawStatus.includes('zero') || rawStatus === 'skipped') status = 'skipped';
        else status = 'available';
      }

      const price = priceCol !== -1 && row[priceCol] !== '' && !isNaN(Number(row[priceCol])) 
        ? Number(row[priceCol]) 
        : undefined;

      const assignedTo = teamAssignedCol !== -1 && String(row[teamAssignedCol] || '').trim().length > 0
        ? String(row[teamAssignedCol]).trim()
        : undefined;

      const titolaritaDettaglio = titolaritaCol !== -1 && String(row[titolaritaCol] || '').trim().length > 0
        ? String(row[titolaritaCol]).trim()
        : undefined;

      players.push({
        id: parsedId,
        nome: rawName.toUpperCase(),
        ruolo: role,
        ruoloMantra: rawMantra || (role === 'P' ? 'POR' : role === 'D' ? 'DC' : role === 'C' ? 'C' : 'PC'),
        squadra: team,
        quotazione,
        fvm,
        pg,
        mv,
        fm,
        gf,
        gs,
        assist,
        rc,
        rSegnati,
        amm,
        esp,
        rigorista: isRigorista,
        consigliatoModificatore,
        status,
        price,
        assignedTo,
        isTarget,
        targetTier,
        note: rawNote || undefined,
        titolarita2026_27: titolaritaDettaglio || undefined
      });
    }

    return {
      players,
      success: true,
      message: `Caricati con successo ${players.length} calciatori da ${targetSheetName}`,
      totalParsed: players.length
    };
  } catch (err: any) {
    console.error('Errore lettura Excel:', err);
    return {
      players: [],
      success: false,
      message: `Errore durante l'analisi del file: ${err?.message || 'Formato non valido'}`,
      totalParsed: 0
    };
  }
}
