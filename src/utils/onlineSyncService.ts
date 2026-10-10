import { SyncedOnlineData, cleanPlayerName } from '../data/matchdayData';
import liveSnapshot from '../data/liveSyncSnapshot.json';

const SYNC_STORAGE_KEY = 'fanta_online_sync_v4';

export function getCachedSyncData(): SyncedOnlineData | null {
  try {
    const saved = localStorage.getItem(SYNC_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as SyncedOnlineData;
      if (parsed && parsed.players && Object.keys(parsed.players).length > 50) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading cached sync data:', err);
  }
  return (liveSnapshot as unknown) as SyncedOnlineData;
}

export function parseHtmlData(html: string): SyncedOnlineData {
  const players: SyncedOnlineData['players'] = {};
  const teamComments: Record<string, string> = {};
  const ballottaggi: SyncedOnlineData['ballottaggi'] = [];

  // 1. Commenti di presentazione redazione per squadra
  const teamRegex = /<h4[^>]*class=\"h6\"[^>]*>(.*?)<\/h4>[\s\S]*?<div[^>]*class=\"comment[^\"]*\"[^>]*>([\s\S]*?)<\/div>/gi;
  let tm: RegExpExecArray | null;
  while ((tm = teamRegex.exec(html)) !== null) {
    const tName = cleanPlayerName(tm[1]);
    const comment = tm[2].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
    teamComments[tName] = comment;
  }

  // 2. Ballottaggi testa a testa
  const ballotRegex = /<li class=\"dot source-1\">[\s\S]*?<span>([^<]+)<\/span>[\s\S]*?<strong class=\"percentage\">(\d+)%<\/strong>[\s\S]*?<li class=\"dot source-2\">[\s\S]*?<span>([^<]+)<\/span>[\s\S]*?<strong class=\"percentage\">(\d+)%<\/strong>/gi;
  let bMatch: RegExpExecArray | null;
  while ((bMatch = ballotRegex.exec(html)) !== null) {
    ballottaggi.push({
      p1: bMatch[1].trim(),
      perc1: parseInt(bMatch[2], 10),
      p2: bMatch[3].trim(),
      perc2: parseInt(bMatch[4], 10)
    });
  }

  // 3. Calciatori con percentuale esatta (titolari e riserve)
  const ariaRegex = /<a[^>]*class=\"player-name[^\"]*\"[^>]*>[\s\S]*?<span>([^<]+)<\/span>[\s\S]*?aria-valuenow=\"(\d+)\"/gi;
  let aMatch: RegExpExecArray | null;
  while ((aMatch = ariaRegex.exec(html)) !== null) {
    const rawName = aMatch[1].trim();
    const clean = cleanPlayerName(rawName);
    const perc = parseInt(aMatch[2], 10);
    players[clean] = {
      name: rawName,
      titolaritaPercent: perc,
      status: perc >= 75 ? 'titolare' : perc >= 45 ? 'ballottaggio' : 'panchina',
      ballottaggioCon: null,
      source: 'Fantacalcio.it / Gazzetta Live'
    };
  }

  // 4. Calciatori titolari sul campo grafico (portieri e 11 titolari)
  const pitchRegex = /<ul class=\"team-lineup\"[\s\S]*?<\/ul>/gi;
  let pBlock: RegExpExecArray | null;
  while ((pBlock = pitchRegex.exec(html)) !== null) {
    const nameRegex = /<span>([^<]+)<\/span>/gi;
    let nMatch: RegExpExecArray | null;
    while ((nMatch = nameRegex.exec(pBlock[0])) !== null) {
      const raw = nMatch[1].trim();
      const clean = cleanPlayerName(raw);
      if (clean && clean.length > 2) {
        if (!players[clean]) {
          players[clean] = {
            name: raw,
            titolaritaPercent: 90,
            status: 'titolare',
            ballottaggioCon: null,
            source: 'Fantacalcio.it Pitch Starter'
          };
        }
      }
    }
  }

  // 5. Squalificati ufficiali da blocchi dedicati
  const susRegex = /<section class=\"suspendeds\"[\s\S]*?<\/section>/gi;
  let sm: RegExpExecArray | null;
  while ((sm = susRegex.exec(html)) !== null) {
    const block = sm[0];
    if (!block.includes('Nessun calciatore')) {
      const pRegex = /<span class=\"player-name[^\"]*\"[^>]*>([^<]+)<\/span>/gi;
      let pm: RegExpExecArray | null;
      while ((pm = pRegex.exec(block)) !== null) {
        const raw = pm[1].trim();
        const clean = cleanPlayerName(raw);
        if (clean && clean.length > 2) {
          players[clean] = {
            name: raw,
            titolaritaPercent: 0,
            status: 'squalificato',
            ballottaggioCon: null,
            source: 'Fantacalcio.it (Squalificato)'
          };
        }
      }
    }
  }

  // 6. Annotazione ballottaggi sui profili dei calciatori
  for (const b of ballottaggi) {
    const c1 = cleanPlayerName(b.p1);
    const c2 = cleanPlayerName(b.p2);

    if (players[c1]) {
      players[c1].status = 'ballottaggio';
      players[c1].titolaritaPercent = b.perc1;
      players[c1].ballottaggioCon = `${b.p1} ${b.perc1}% - ${b.p2} ${b.perc2}%`;
    }
    if (players[c2]) {
      players[c2].status = 'ballottaggio';
      players[c2].titolaritaPercent = b.perc2;
      players[c2].ballottaggioCon = `${b.p2} ${b.perc2}% - ${b.p1} ${b.perc1}%`;
    }
  }

  // Timestamp
  const now = new Date();
  const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timestamp = `${dateStr} ore ${timeStr}`;

  return {
    success: true,
    timestamp,
    syncedAt: Date.now(),
    totalPlayers: Object.keys(players).length,
    totalBallots: ballottaggi.length,
    players,
    teamComments,
    ballottaggi
  };
}

export async function syncOnlineMatchdayData(): Promise<{
  success: boolean;
  data: SyncedOnlineData;
  message: string;
  totalPlayers: number;
  totalBallots: number;
}> {
  try {
    // 1. Prova endpoint middleware / Cloudflare Pages Function (/api/fanta-sync)
    try {
      const res = await fetch('/api/fanta-sync', {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json() as SyncedOnlineData;
        if (data && data.success && Object.keys(data.players).length > 0) {
          localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(data));
          return {
            success: true,
            data,
            message: `Sincronizzazione completata: ${data.totalPlayers} calciatori e ${data.totalBallots} ballottaggi aggiornati da Fantacalcio.it e Gazzetta dello Sport.`,
            totalPlayers: data.totalPlayers,
            totalBallots: data.totalBallots
          };
        }
      }
    } catch {
      // Endpoint non attivo o fallito, procedi con fallback CORS
    }

    // 2. FONTE PRIMARIA: Fantacalcio.it via proxy CORS
    try {
      const targetUrl = 'https://www.fantacalcio.it/probabili-formazioni-serie-a';
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const html = await res.text();
        if (html.length > 25000) {
          const data = parseHtmlData(html);
          localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(data));
          return {
            success: true,
            data,
            message: `Sincronizzazione completata da Fantacalcio.it (Fonte Primaria): ${data.totalPlayers} calciatori aggiornati.`,
            totalPlayers: data.totalPlayers,
            totalBallots: data.totalBallots
          };
        }
      }
    } catch {
      // Procedi al fallback secondario
    }

    // 3. FONTE SECONDARIA: Gazzetta dello Sport via proxy CORS (escluse tutte le altre)
    try {
      const targetUrl2 = 'https://www.gazzetta.it/Calcio/prob_form/';
      const proxyUrl2 = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl2)}`;
      const res2 = await fetch(proxyUrl2);
      if (res2.ok) {
        const html2 = await res2.text();
        if (html2.length > 10000) {
          const data2 = parseHtmlData(html2);
          localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(data2));
          return {
            success: true,
            data: data2,
            message: `Sincronizzazione completata da La Gazzetta dello Sport (Fonte Secondaria): ${data2.totalPlayers} calciatori aggiornati.`,
            totalPlayers: data2.totalPlayers,
            totalBallots: data2.totalBallots
          };
        }
      }
    } catch {
      // Nessun'altra fonte ammessa
    }

    // 4. Fallback con snapshot offline archivio (da Fantacalcio.it & Gazzetta)
    const fallbackData: SyncedOnlineData = {
      ...((liveSnapshot as unknown) as SyncedOnlineData)
    };

    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(fallbackData));
    return {
      success: true,
      data: fallbackData,
      message: `Rete non raggiungibile: caricato snapshot locale delle probabili formazioni (aggiornato al ${fallbackData.timestamp || '09/10/2026'}).`,
      totalPlayers: fallbackData.totalPlayers,
      totalBallots: fallbackData.totalBallots
    };
  } catch (err: any) {
    return {
      success: false,
      data: {} as any,
      message: `Errore durante l'aggiornamento online: ${err?.message || 'Connessione fallita'}`,
      totalPlayers: 0,
      totalBallots: 0
    };
  }
}
