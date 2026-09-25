import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function fantaSyncPlugin(): Plugin {
  return {
    name: 'fanta-sync-plugin',
    configureServer(server) {
      server.middlewares.use('/api/fanta-sync', async (req, res, next) => {
        if (req.method === 'GET' || req.method === 'POST') {
          try {
            const resp = await fetch('https://www.fantacalcio.it/probabili-formazioni-serie-a', {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
              }
            });
            if (!resp.ok) {
              throw new Error(`Fantacalcio ha risposto con status ${resp.status}`);
            }
            const html = await resp.text();

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

            // Calciatori con percentuale
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
                source: 'Fantacalcio.it Live'
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
                    source: 'Fantacalcio.it Pitch Starter'
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
            const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            const dateStr = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              timestamp: `${dateStr} ore ${timeStr}`,
              syncedAt: Date.now(),
              totalPlayers: Object.keys(players).length,
              totalBallots: ballottaggi.length,
              players,
              teamComments,
              ballottaggi
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err?.message || String(err) }));
          }
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fantaSyncPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
