// Cloudflare Pages Function per fanta.poletti.page/api/fanta-sync
// Fonti autorizzate:
// 1. Primaria: https://www.fantacalcio.it/probabili-formazioni-serie-a
// 2. Secondaria: https://www.gazzetta.it/Calcio/prob_form/
// Qualsiasi altra fonte è tassativamente esclusa.

export async function onRequest(context: any) {
  try {
    let html = '';
    let usedSource = 'Fantacalcio.it (Primaria)';

    // 1. TENTATIVO FONTE PRIMARIA: Fantacalcio.it
    try {
      const resp = await fetch('https://www.fantacalcio.it/probabili-formazioni-serie-a', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      if (resp.ok) {
        const text = await resp.text();
        if (text && text.length > 25000) {
          html = text;
        }
      }
    } catch {
      // Procedi al fallback secondario
    }

    // 2. TENTATIVO FONTE SECONDARIA (se primaria non disponibile): Gazzetta dello Sport
    if (!html) {
      try {
        const resp2 = await fetch('https://www.gazzetta.it/Calcio/prob_form/', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
        if (resp2.ok) {
          const text2 = await resp2.text();
          if (text2 && text2.length > 10000) {
            html = text2;
            usedSource = 'Gazzetta dello Sport (Secondaria)';
          }
        }
      } catch {
        // Nessun'altra fonte ammessa
      }
    }

    if (!html) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Fonti ufficiali (Fantacalcio.it e Gazzetta dello Sport) non raggiungibili.'
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const players: Record<string, any> = {};
    const teamComments: Record<string, string> = {};
    const ballottaggi: any[] = [];

    // Commenti squadre
    const teamRegex = /<h4[^>]*class="h6"[^>]*>(.*?)<\/h4>[\s\S]*?<div[^>]*class="comment[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    let tm;
    while ((tm = teamRegex.exec(html)) !== null) {
      const tName = tm[1].replace(/<[^>]+>/g, '').replace(/[^A-Z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
      const comment = tm[2].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
      teamComments[tName] = comment;
    }

    // Ballottaggi
    const ballotRegex = /<li class="dot source-1">[\s\S]*?<span>([^<]+)<\/span>[\s\S]*?<strong class="percentage">(\d+)%<\/strong>[\s\S]*?<li class="dot source-2">[\s\S]*?<span>([^<]+)<\/span>[\s\S]*?<strong class="percentage">(\d+)%<\/strong>/gi;
    let bMatch;
    while ((bMatch = ballotRegex.exec(html)) !== null) {
      ballottaggi.push({
        p1: bMatch[1].trim(),
        perc1: parseInt(bMatch[2], 10),
        p2: bMatch[3].trim(),
        perc2: parseInt(bMatch[4], 10)
      });
    }

    // Calciatori con percentuale di titolarità
    const ariaRegex = /<a[^>]*class="player-name[^"]*"[^>]*>[\s\S]*?<span>([^<]+)<\/span>[\s\S]*?aria-valuenow="(\d+)"/gi;
    let aMatch;
    while ((aMatch = ariaRegex.exec(html)) !== null) {
      const rawName = aMatch[1].trim();
      const clean = rawName.toUpperCase().replace(/[^A-Z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
      const perc = parseInt(aMatch[2], 10);
      players[clean] = {
        name: rawName,
        titolaritaPercent: perc,
        status: perc >= 75 ? 'titolare' : perc >= 45 ? 'ballottaggio' : 'panchina',
        ballottaggioCon: null,
        source: usedSource
      };
    }

    // Titolari sul campo grafico
    const pitchRegex = /<ul class="team-lineup"[\s\S]*?<\/ul>/gi;
    let pBlock;
    while ((pBlock = pitchRegex.exec(html)) !== null) {
      const nameRegex = /<span>([^<]+)<\/span>/gi;
      let nMatch;
      while ((nMatch = nameRegex.exec(pBlock[0])) !== null) {
        const raw = nMatch[1].trim();
        const clean = raw.toUpperCase().replace(/[^A-Z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
        if (clean && clean.length > 2 && !players[clean]) {
          players[clean] = {
            name: raw,
            titolaritaPercent: 90,
            status: 'titolare',
            ballottaggioCon: null,
            source: `${usedSource} (Pitch Starter)`
          };
        }
      }
    }

    // Squalificati ufficiali da blocchi dedicati
    const susRegex = /<section class="suspendeds"[\s\S]*?<\/section>/gi;
    let sm;
    while ((sm = susRegex.exec(html)) !== null) {
      const block = sm[0];
      if (!block.includes('Nessun calciatore')) {
        const pRegex = /<span class="player-name[^"]*"[^>]*>([^<]+)<\/span>/gi;
        let pm;
        while ((pm = pRegex.exec(block)) !== null) {
          const raw = pm[1].trim();
          const clean = raw.toUpperCase().replace(/[^A-Z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
          if (clean && clean.length > 2) {
            players[clean] = {
              name: raw,
              titolaritaPercent: 0,
              status: 'squalificato',
              ballottaggioCon: null,
              source: `${usedSource} (Squalificato)`
            };
          }
        }
      }
    }

    // Infortunati ufficiali da sezione Infermeria (<section class="injureds"> collegata a /infortunati-serie-a)
    const injRegex = /<section class="injureds"[\s\S]*?<\/section>/gi;
    let im;
    while ((im = injRegex.exec(html)) !== null) {
      const block = im[0];
      const itemRegex = /<a class="player-name[^"]*"[^>]*>[\s\S]*?<span>([^<]+)<\/span>[\s\S]*?<\/a>[\s\S]*?<p class="description">([\s\S]*?)<\/p>/gi;
      let pm;
      while ((pm = itemRegex.exec(block)) !== null) {
        const raw = pm[1].trim();
        const desc = pm[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        const clean = raw.toUpperCase().replace(/[^A-Z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
        if (clean && clean.length > 2) {
          players[clean] = {
            name: raw,
            titolaritaPercent: 0,
            status: 'infortunato',
            ballottaggioCon: null,
            note: desc,
            source: `${usedSource} (Infermeria / Infortunati)`
          };
        }
      }
    }

    // Assegnazione ballottaggi ai calciatori
    for (const b of ballottaggi) {
      const c1 = b.p1.toUpperCase().replace(/[^A-Z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
      const c2 = b.p2.toUpperCase().replace(/[^A-Z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
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

    const now = new Date();
    const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
    const dateStr = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Rome' });

    const payload = {
      success: true,
      timestamp: `${dateStr} ore ${timeStr}`,
      syncedAt: Date.now(),
      primarySource: 'https://www.fantacalcio.it/probabili-formazioni-serie-a',
      secondarySource: 'https://www.gazzetta.it/Calcio/prob_form/',
      usedSource,
      totalPlayers: Object.keys(players).length,
      totalBallots: ballottaggi.length,
      players,
      teamComments,
      ballottaggi
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || 'Server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
