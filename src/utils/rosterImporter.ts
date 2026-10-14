import { Player, Team, Role, PlayerAssignment } from '../types';

export interface UnmatchedPlayerError {
  teamName: string;
  teamId: string;
  rawName: string;
  expectedRole: Role;
  rowIdx: number;
}

export interface RosterParseResult {
  success: boolean;
  message: string;
  teams: Team[];
  unmatched: UnmatchedPlayerError[];
  totalAssigned: number;
  warnings: string[];
}

// Mappa sinonimi / alias frequenti nel fantacalcio
export const ROSTER_NAME_ALIASES: Record<string, string> = {
  'martinez jo': 'MARTINEZ JO.',
  'martinez j': 'MARTINEZ JO.',
  'martinez l': 'LAUTARO',
  'dimarco': 'DIMARCO',
  'esposito fp': 'ESPOSITO F.P.',
  'esposito se': 'ESPOSITO SE.',
  'adams a': 'ADAMS A.',
  'adams c': 'ADAMS C.',
  'ederson ds': 'EDERSON D.S.',
  'sutalo j': 'SUTALO J.',
  'tiago gabriel': 'TIAGO GABRIEL',
  'diego carlos': 'DIEGO CARLOS',
  'molina n': 'MOLINA N.',
  'chalobah t': 'CHALOBAH T.',
  'kristensen t': 'KRISTENSEN T.',
  'carlos augusto': 'CARLOS AUGUSTO',
  'de bruyne': 'DE BRUYNE',
  'da cunha': 'DA CUNHA',
  'paz n': 'PAZ N.',
  'gonzalez n': 'GONZALEZ N.',
  'gudmundsson a': 'GUDMUNDSSON A.',
  'kone m': 'KONE M.',
  'cisse a': 'CISSE A.',
  'fitzjim': 'FITZ-JIM',
  'jones c': 'JONES C.',
  'keita m': 'KEITA M.',
  'taylor k': 'TAYLOR K.',
  'el shaarawy': 'EL SHAARAWY',
  'kolo muani': 'KOLO MUANI',
  'de ketelaere': 'DE KETELAERE',
  'ramos g': 'RAMOS G.',
  'vitinha o': 'VITINHA O.',
  'varela g': 'VARELA G.',
  'yeboah j': 'YEBOAH J.',
  'romero d': 'ROMERO D.',
  'davis k': 'DAVIS K.',
  'toure e': 'TOURE E.',
  'pellegrino m': 'PELLEGRINO M.',
  'sucic p': 'SUCIC P.',
  'tavares n': 'TAVARES N.',
  'stankovic f': 'STANKOVIC F.',
  'christensen o': 'CHRISTENSEN O.',
  'jimenez a': 'JIMENEZ A.',
  'kamara h': 'KAMARA H.',
  'miranda j': 'MIRANDA J.',
  'ranieri l': 'RANIERI L.',
  'goncalves p': 'GONCALVES P.',
  'castro s': 'CASTRO S.',
  'santos a': 'SANTOS A.'
};

export const TEAM_METADATA_MAP: Record<string, { id: string; name: string; color: string }> = {
  'scarsenal': { id: 'team-1', name: 'Scarsenal', color: '#ef4444' },
  'abidjan': { id: 'team-2', name: 'ABIDJAN', color: '#3b82f6' },
  'abjan': { id: 'team-2', name: 'ABIDJAN', color: '#3b82f6' },
  'gallosballo': { id: 'team-3', name: 'Gallosballo', color: '#eab308' },
  'brancamenta': { id: 'team-4', name: 'Brancamenta', color: '#f59e0b' },
  'branca': { id: 'team-4', name: 'Brancamenta', color: '#f59e0b' },
  'longobarda': { id: 'team-5', name: 'LONGOBARDA', color: '#06b6d4' },
  'ac arbora': { id: 'team-6', name: 'AC Arbora', color: '#ec4899' },
  'sc arbora': { id: 'team-6', name: 'AC Arbora', color: '#ec4899' },
  'arbora': { id: 'team-6', name: 'AC Arbora', color: '#ec4899' },
  'sanzeno': { id: 'team-7', name: 'SanZeno', color: '#8b5cf6' },
  'san zeno': { id: 'team-7', name: 'SanZeno', color: '#8b5cf6' },
  'al-meja': { id: 'team-8', name: 'Al-Meja', color: '#84cc16' },
  'almeja': { id: 'team-8', name: 'Al-Meja', color: '#84cc16' },
  'meja': { id: 'team-8', name: 'Al-Meja', color: '#84cc16' },
};

export function cleanNameForMatch(n: string): string {
  return n.toLowerCase()
    .replace(/[àá]/g, 'a')
    .replace(/[èé]/g, 'e')
    .replace(/[ìí]/g, 'i')
    .replace(/[òó]/g, 'o')
    .replace(/[ùú]/g, 'u')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Cerca un calciatore nel database ufficiale gestendo omonimie e ruoli
 */
export function matchRosterPlayer(
  rawName: string, 
  expectedRole: Role, 
  allPlayers: Player[]
): Player | null {
  const cRaw = cleanNameForMatch(rawName);

  // 1. Controllo dizionario alias
  if (ROSTER_NAME_ALIASES[cRaw]) {
    const aliasClean = cleanNameForMatch(ROSTER_NAME_ALIASES[cRaw]);
    const aliasMatches = allPlayers.filter(p => cleanNameForMatch(p.nome) === aliasClean);
    if (aliasMatches.length > 0) {
      const roleMatch = aliasMatches.find(p => p.ruolo === expectedRole);
      if (roleMatch) return roleMatch;
      return aliasMatches[0];
    }
  }

  // 2. Match esatto cleanName
  const exactMatches = allPlayers.filter(p => cleanNameForMatch(p.nome) === cRaw);
  if (exactMatches.length === 1) return exactMatches[0];
  if (exactMatches.length > 1) {
    const roleMatch = exactMatches.find(p => p.ruolo === expectedRole);
    if (roleMatch) return roleMatch;
    return exactMatches[0];
  }

  // 3. Match con token e ruolo atteso
  const roleCandidates = allPlayers.filter(p => {
    if (p.ruolo !== expectedRole) return false;
    const cOfficial = cleanNameForMatch(p.nome);
    if (cOfficial === cRaw) return true;
    if (cOfficial.startsWith(cRaw) || cRaw.startsWith(cOfficial)) return true;
    const officialSurname = cleanNameForMatch(p.nome.split(' ')[0]);
    const rawSurname = cleanNameForMatch(rawName.split(' ')[0]);
    if (officialSurname === rawSurname && officialSurname.length >= 3) return true;
    return false;
  });

  if (roleCandidates.length === 1) return roleCandidates[0];

  if (roleCandidates.length > 1) {
    // Preferisci match esatto sul cognome
    const exactSurname = roleCandidates.filter(p => 
      cleanNameForMatch(p.nome.split(' ')[0]) === cleanNameForMatch(rawName.split(' ')[0])
    );
    if (exactSurname.length === 1) return exactSurname[0];
    return roleCandidates[0];
  }

  // 4. Fallback senza ruolo (se es. ruolo è cambiato nel listone)
  const fallback = allPlayers.filter(p => {
    const cOfficial = cleanNameForMatch(p.nome);
    return cOfficial.includes(cRaw) || cRaw.includes(cOfficial);
  });
  if (fallback.length === 1) return fallback[0];

  return null;
}

/**
 * Parsing completo del testo CSV delle 8 rose
 */
export function parseRostersCsv(csvText: string, allPlayers: Player[]): RosterParseResult {
  const trimmed = csvText.trim();
  if (!trimmed) {
    return {
      success: false,
      message: 'Il testo inserito è vuoto.',
      teams: [],
      unmatched: [],
      totalAssigned: 0,
      warnings: []
    };
  }

  // Rileva separatore (, o ; o \t)
  const firstLine = trimmed.split('\n')[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  let separator = ',';
  if (semiCount > commaCount && semiCount > tabCount) separator = ';';
  else if (tabCount > commaCount && tabCount > semiCount) separator = '\t';

  const lines = trimmed.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) {
    return {
      success: false,
      message: 'Il file contiene troppe poche righe. È richiesta una riga di intestazione con le squadre e le righe dei calciatori.',
      teams: [],
      unmatched: [],
      totalAssigned: 0,
      warnings: []
    };
  }

  const headerParts = lines[0].split(separator).map(s => s.trim());

  // Rilevamento delle 8 colonne squadra
  interface FoundTeamCol {
    colName: number;
    colCost: number;
    teamId: string;
    teamName: string;
    teamColor: string;
  }

  const detectedTeamCols: FoundTeamCol[] = [];
  const recognizedTeamIds = new Set<string>();

  for (let c = 0; c < headerParts.length; c++) {
    const title = headerParts[c];
    if (!title || title.toLowerCase() === 'costo' || title.toLowerCase() === 'totale') continue;

    const cleanTitle = cleanNameForMatch(title);
    const meta = TEAM_METADATA_MAP[cleanTitle];

    if (meta && !recognizedTeamIds.has(meta.id)) {
      recognizedTeamIds.add(meta.id);
      // Colonna costo è solitamente quella successiva
      const costCol = c + 1 < headerParts.length ? c + 1 : c;
      detectedTeamCols.push({
        colName: c,
        colCost: costCol,
        teamId: meta.id,
        teamName: meta.name,
        teamColor: meta.color
      });
    }
  }

  // Se non sono state riconosciute tutte e 8 per nome, proviamo il layout standard a 8 colonne
  if (detectedTeamCols.length < 8) {
    detectedTeamCols.length = 0;
    recognizedTeamIds.clear();

    const standardTeams = [
      { id: 'team-1', name: 'Scarsenal', color: '#ef4444' },
      { id: 'team-2', name: 'ABIDJAN', color: '#3b82f6' },
      { id: 'team-3', name: 'Gallosballo', color: '#eab308' },
      { id: 'team-4', name: 'Brancamenta', color: '#f59e0b' },
      { id: 'team-8', name: 'Al-Meja', color: '#84cc16' },
      { id: 'team-6', name: 'AC Arbora', color: '#ec4899' },
      { id: 'team-7', name: 'SanZeno', color: '#8b5cf6' },
      { id: 'team-5', name: 'LONGOBARDA', color: '#06b6d4' }
    ];

    let tIdx = 0;
    for (let c = 0; c < headerParts.length && tIdx < standardTeams.length; c += 3) {
      const t = standardTeams[tIdx];
      detectedTeamCols.push({
        colName: c,
        colCost: c + 1,
        teamId: t.id,
        teamName: headerParts[c] || t.name,
        teamColor: t.color
      });
      tIdx++;
    }
  }

  if (detectedTeamCols.length === 0) {
    return {
      success: false,
      message: 'Impossibile identificare le squadre nell\'intestazione. Assicurati che siano presenti i nomi delle squadre (es. Scarsenal, ABIDJAN, Gallosballo...).',
      teams: [],
      unmatched: [],
      totalAssigned: 0,
      warnings: []
    };
  }

  // Inizializza squadre risultanti
  const teamsMap = new Map<string, Team>();
  detectedTeamCols.forEach(tc => {
    teamsMap.set(tc.teamId, {
      id: tc.teamId,
      name: tc.teamName,
      color: tc.teamColor,
      currentBudget: 300,
      players: []
    });
  });

  const unmatched: UnmatchedPlayerError[] = [];
  const warnings: string[] = [];
  const assignedPlayerIds = new Map<number, string>();
  let totalAssigned = 0;

  // Righe dei calciatori: escludi la riga 0 (header) e l'ultima riga se contiene 'totale'
  const bodyLines = lines.slice(1).filter(l => {
    const lower = l.toLowerCase();
    return !lower.startsWith('totale') && !lower.includes('totale,') && !lower.includes('totale;');
  });

  bodyLines.forEach((line, rowIdx) => {
    const parts = line.split(separator);

    // Stima ruolo in base alla riga (standard Fantacalcio 25 slot: 3 P, 8 D, 8 C, 6 A)
    let expectedRole: Role = 'P';
    if (rowIdx >= 3 && rowIdx < 11) expectedRole = 'D';
    else if (rowIdx >= 11 && rowIdx < 19) expectedRole = 'C';
    else if (rowIdx >= 19) expectedRole = 'A';

    detectedTeamCols.forEach(tc => {
      const rawName = (parts[tc.colName] || '').trim();
      const rawCostStr = (parts[tc.colCost] || '1').trim();
      const rawCost = parseInt(rawCostStr, 10) || 1;

      if (!rawName) return;

      const matched = matchRosterPlayer(rawName, expectedRole, allPlayers);

      if (!matched) {
        unmatched.push({
          teamName: tc.teamName,
          teamId: tc.teamId,
          rawName,
          expectedRole,
          rowIdx: rowIdx + 1
        });
      } else {
        if (assignedPlayerIds.has(matched.id)) {
          warnings.push(`Attenzione: ${matched.nome} era già assegnato a ${assignedPlayerIds.get(matched.id)}, ma compare anche in ${tc.teamName}.`);
        } else {
          assignedPlayerIds.set(matched.id, tc.teamName);
        }

        const team = teamsMap.get(tc.teamId)!;
        const assignment: PlayerAssignment = {
          playerId: matched.id,
          nome: matched.nome,
          ruolo: matched.ruolo,
          squadra: matched.squadra,
          price: rawCost,
          fvm: matched.fvm,
          mv: matched.mv !== undefined ? matched.mv : null,
          fm: matched.fm !== undefined ? matched.fm : null
        };

        team.players.push(assignment);
        totalAssigned++;
      }
    });
  });

  // Calcola il budget residuo (300 - totale speso)
  const finalTeams = Array.from(teamsMap.values()).map(t => {
    const totalSpent = t.players.reduce((sum, p) => sum + p.price, 0);
    return {
      ...t,
      currentBudget: Math.max(0, 300 - totalSpent)
    };
  });

  const success = unmatched.length === 0 && totalAssigned >= 160;

  let message = `Caricati con successo ${totalAssigned} calciatori in ${finalTeams.length} squadre.`;
  if (unmatched.length > 0) {
    message = `Riconosciuti ${totalAssigned} calciatori, ma ci sono ${unmatched.length} nomi non trovati nel database.`;
  }

  return {
    success,
    message,
    teams: finalTeams,
    unmatched,
    totalAssigned,
    warnings
  };
}

/**
 * Esporta le rose attuali nell'esatto formato CSV richiesto dall'utente
 */
export function exportCurrentRostersCsv(teams: Team[]): string {
  // Ordine standard delle 8 squadre
  const orderedIds = ['team-1', 'team-2', 'team-3', 'team-4', 'team-8', 'team-6', 'team-7', 'team-5'];
  const orderedTeams = orderedIds
    .map(id => teams.find(t => t.id === id))
    .filter((t): t is Team => t !== undefined);

  // Intestazione
  const headerParts = orderedTeams.map(t => `${t.name},costo`).join(',,');
  const maxPlayers = Math.max(...orderedTeams.map(t => t.players.length), 25);

  const rows: string[] = [headerParts];

  for (let i = 0; i < maxPlayers; i++) {
    const rowParts = orderedTeams.map(t => {
      const pl = t.players[i];
      if (pl) {
        return `${pl.nome},${pl.price}`;
      }
      return ',';
    });
    rows.push(rowParts.join(',,'));
  }

  // Riga totali
  const totalsParts = orderedTeams.map(t => {
    const sum = t.players.reduce((acc, p) => acc + p.price, 0);
    return `totale,${sum}`;
  });
  rows.push(totalsParts.join(',,'));

  return rows.join('\n');
}
