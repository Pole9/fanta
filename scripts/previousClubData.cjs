const fs = require('fs');

// Mappa dettagliata con le ULTIME 3 STAGIONI per tutti i nuovi arrivati in Serie A
const MULTI_YEAR_PREVIOUS_DATA = {
  // ATTACCANTI
  6397: { // Ramos G. (Milan)
    squadraPrecedente: 'PSG (Ligue 1)',
    seasons: [
      { season: '2024/25', squadra: 'PSG (Ligue 1)', pg: 29, gf: 14, gs: 0, assist: 5, rc: 2, rSegnati: 2, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'PSG (Ligue 1)', pg: 29, gf: 11, gs: 0, assist: 1, rc: 1, rSegnati: 1, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Benfica (Liga Portugal)', pg: 30, gf: 19, gs: 0, assist: 2, rc: 1, rSegnati: 1, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  6752: { // Woltemade (Juventus)
    squadraPrecedente: 'Stoccarda (Bundesliga)',
    seasons: [
      { season: '2024/25', squadra: 'Stoccarda (Bundesliga)', pg: 28, gf: 12, gs: 0, assist: 3, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Werder Brema (Bundesliga)', pg: 30, gf: 2, gs: 0, assist: 1, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Elversberg (3. Liga)', pg: 31, gf: 10, gs: 0, assist: 9, rc: 1, rSegnati: 1, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7547: { // Kevin Carlos (Cagliari)
    squadraPrecedente: 'Basilea / Yverdon (Super League)',
    seasons: [
      { season: '2024/25', squadra: 'Basilea (Super League)', pg: 34, gf: 14, gs: 0, assist: 3, rc: 2, rSegnati: 2, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Yverdon (Super League)', pg: 35, gf: 14, gs: 0, assist: 1, rc: 1, rSegnati: 1, amm: 5, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Huesca (Segunda División)', pg: 24, gf: 3, gs: 0, assist: 0, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: false, isPrecedenteEstero: true }
    ]
  },
  7484: { // Adams A. (Venezia)
    squadraPrecedente: 'Southampton (Championship)',
    seasons: [
      { season: '2024/25', squadra: 'Southampton (Championship)', pg: 38, gf: 15, gs: 0, assist: 4, rc: 1, rSegnati: 1, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Southampton (Championship)', pg: 40, gf: 16, gs: 0, assist: 4, rc: 1, rSegnati: 1, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Southampton (Premier League)', pg: 28, gf: 5, gs: 0, assist: 3, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7554: { // Romero D. (Parma)
    squadraPrecedente: 'Aktobe (Kazakistan)',
    seasons: [
      { season: '2024/25', squadra: 'Aktobe (Kazakistan)', pg: 26, gf: 11, gs: 0, assist: 4, rc: 2, rSegnati: 2, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Always Ready (Bolivia)', pg: 29, gf: 14, gs: 0, assist: 3, rc: 3, rSegnati: 3, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Real Santa Cruz (Bolivia)', pg: 28, gf: 16, gs: 0, assist: 4, rc: 2, rSegnati: 2, amm: 5, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7612: { // Bobcek (Frosinone)
    squadraPrecedente: 'Lechia Danzica (Polonia)',
    seasons: [
      { season: '2024/25', squadra: 'Lechia Danzica (Polonia)', pg: 28, gf: 9, gs: 0, assist: 3, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Lechia Danzica (Polonia)', pg: 24, gf: 8, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Ruzomberok (Slovacchia)', pg: 26, gf: 11, gs: 0, assist: 3, rc: 1, rSegnati: 1, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  5029: { // Geubbels (Lecce)
    squadraPrecedente: 'San Gallo (Svizzera)',
    seasons: [
      { season: '2024/25', squadra: 'San Gallo (Svizzera)', pg: 32, gf: 8, gs: 0, assist: 4, rc: 1, rSegnati: 1, amm: 5, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'San Gallo (Svizzera)', pg: 32, gf: 8, gs: 0, assist: 3, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Monaco / San Gallo', pg: 20, gf: 3, gs: 0, assist: 1, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: false, isPrecedenteEstero: true }
    ]
  },
  7600: { // Osmajic (Genoa)
    squadraPrecedente: 'Preston N.E. (Championship)',
    seasons: [
      { season: '2024/25', squadra: 'Preston N.E. (Championship)', pg: 36, gf: 8, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 6, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Preston N.E. (Championship)', pg: 36, gf: 8, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 5, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Vizela (Portogallo)', pg: 31, gf: 8, gs: 0, assist: 1, rc: 0, rSegnati: 0, amm: 7, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7523: { // Varela G. (Monza)
    squadraPrecedente: 'Benfica B (Liga 2)',
    seasons: [
      { season: '2024/25', squadra: 'Benfica B (Liga 2)', pg: 26, gf: 8, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Benfica B (Liga 2)', pg: 24, gf: 6, gs: 0, assist: 1, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Benfica U19', pg: 22, gf: 12, gs: 0, assist: 3, rc: 1, rSegnati: 1, amm: 1, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7449: { // Rrahmani Al. (Venezia)
    squadraPrecedente: 'Rapid Bucarest (Romania)',
    seasons: [
      { season: '2024/25', squadra: 'Rapid Bucarest (Romania)', pg: 28, gf: 17, gs: 0, assist: 5, rc: 5, rSegnati: 4, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Rapid Bucarest (Romania)', pg: 25, gf: 17, gs: 0, assist: 4, rc: 4, rSegnati: 4, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Ballkani (Kosovo)', pg: 35, gf: 21, gs: 0, assist: 6, rc: 3, rSegnati: 3, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7623: { // Gnonto (Fiorentina)
    squadraPrecedente: 'Leeds United (Championship)',
    seasons: [
      { season: '2024/25', squadra: 'Leeds United (Championship)', pg: 36, gf: 8, gs: 0, assist: 3, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Leeds United (Championship)', pg: 36, gf: 8, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Leeds United (Premier League)', pg: 24, gf: 2, gs: 0, assist: 4, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: false, isPrecedenteEstero: true }
    ]
  },
  7620: { // Zeballos (Monza)
    squadraPrecedente: 'Boca Juniors (Argentina)',
    seasons: [
      { season: '2024/25', squadra: 'Boca Juniors (Argentina)', pg: 24, gf: 4, gs: 0, assist: 3, rc: 1, rSegnati: 1, amm: 2, esp: 0, isTitolare: false, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Boca Juniors (Argentina)', pg: 20, gf: 2, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: false, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Boca Juniors (Argentina)', pg: 22, gf: 5, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 1, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7610: { // Birligea (Frosinone)
    squadraPrecedente: 'FCSB / CFR Cluj (Romania)',
    seasons: [
      { season: '2024/25', squadra: 'FCSB (Romania)', pg: 32, gf: 14, gs: 0, assist: 4, rc: 0, rSegnati: 0, amm: 5, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'CFR Cluj (Romania)', pg: 34, gf: 14, gs: 0, assist: 5, rc: 1, rSegnati: 1, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'CFR Cluj (Romania)', pg: 25, gf: 5, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: false, isPrecedenteEstero: true }
    ]
  },
  4387: { // Adorante (Venezia)
    squadraPrecedente: 'Juve Stabia (Serie B)',
    seasons: [
      { season: '2024/25', squadra: 'Juve Stabia (Serie B)', pg: 33, gf: 14, gs: 0, assist: 2, rc: 2, rSegnati: 2, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Juve Stabia (Serie C)', pg: 32, gf: 12, gs: 0, assist: 3, rc: 2, rSegnati: 2, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Triestina (Serie C)', pg: 31, gf: 6, gs: 0, assist: 1, rc: 1, rSegnati: 1, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },

  // PORTIERI
  4964: { // Vicario (Juventus)
    squadraPrecedente: 'Tottenham (Premier League)',
    seasons: [
      { season: '2024/25', squadra: 'Tottenham (Premier League)', pg: 35, gf: 0, gs: 42, assist: 0, rp: 1, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Tottenham (Premier League)', pg: 38, gf: 0, gs: 61, assist: 0, rp: 0, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Empoli (Serie A)', pg: 31, gf: 0, gs: 39, assist: 0, rp: 2, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: false }
    ]
  },
  6534: { // Perri (Torino)
    squadraPrecedente: 'Lione (Ligue 1)',
    seasons: [
      { season: '2024/25', squadra: 'Lione (Ligue 1)', pg: 28, gf: 0, gs: 32, assist: 0, rp: 2, rc: 0, rSegnati: 0, amm: 1, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Botafogo / Lione', pg: 38, gf: 0, gs: 35, assist: 0, rp: 3, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Nautico / Botafogo', pg: 30, gf: 0, gs: 32, assist: 0, rp: 2, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  6344: { // Sanchez Ro. (Como)
    squadraPrecedente: 'Chelsea (Premier League)',
    seasons: [
      { season: '2024/25', squadra: 'Chelsea (Premier League)', pg: 24, gf: 0, gs: 29, assist: 0, rp: 1, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Chelsea (Premier League)', pg: 16, gf: 0, gs: 25, assist: 0, rp: 0, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: false, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Brighton (Premier League)', pg: 23, gf: 0, gs: 30, assist: 0, rp: 1, rc: 0, rSegnati: 0, amm: 1, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7603: { // Grabara (Juventus)
    squadraPrecedente: 'Wolfsburg (Bundesliga)',
    seasons: [
      { season: '2024/25', squadra: 'Wolfsburg (Bundesliga)', pg: 32, gf: 0, gs: 36, assist: 0, rp: 2, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Copenaghen (Danimarca)', pg: 32, gf: 0, gs: 33, assist: 0, rp: 2, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Copenaghen (Danimarca)', pg: 22, gf: 0, gs: 18, assist: 0, rp: 1, rc: 0, rSegnati: 0, amm: 1, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },

  // DIFENSORI
  4998: { // Molina N. (Roma)
    squadraPrecedente: 'Atlético Madrid (La Liga)',
    seasons: [
      { season: '2024/25', squadra: 'Atlético Madrid (La Liga)', pg: 44, gf: 1, gs: 0, assist: 3, rc: 0, rSegnati: 0, amm: 5, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Atlético Madrid (La Liga)', pg: 46, gf: 2, gs: 0, assist: 5, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Atlético Madrid (La Liga)', pg: 33, gf: 4, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 6, esp: 1, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  2514: { // Stones (Inter)
    squadraPrecedente: 'Manchester City (Premier League)',
    seasons: [
      { season: '2024/25', squadra: 'Manchester City (Premier League)', pg: 24, gf: 1, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Manchester City (Premier League)', pg: 16, gf: 1, gs: 0, assist: 0, rc: 0, rSegnati: 0, amm: 1, esp: 0, isTitolare: false, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Manchester City (Premier League)', pg: 23, gf: 2, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  5641: { // Chalobah T. (Como)
    squadraPrecedente: 'Crystal Palace/Chelsea (Premier)',
    seasons: [
      { season: '2024/25', squadra: 'Crystal Palace (Premier League)', pg: 26, gf: 2, gs: 0, assist: 1, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Chelsea (Premier League)', pg: 13, gf: 1, gs: 0, assist: 0, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: false, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Chelsea (Premier League)', pg: 25, gf: 0, gs: 0, assist: 0, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  6320: { // Doekhi (Lazio)
    squadraPrecedente: 'Union Berlino (Bundesliga)',
    seasons: [
      { season: '2024/25', squadra: 'Union Berlino (Bundesliga)', pg: 32, gf: 3, gs: 0, assist: 1, rc: 0, rSegnati: 0, amm: 5, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Union Berlino (Bundesliga)', pg: 24, gf: 2, gs: 0, assist: 0, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Union Berlino (Bundesliga)', pg: 25, gf: 5, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  6727: { // Couto (Como)
    squadraPrecedente: 'Borussia Dortmund / Girona',
    seasons: [
      { season: '2024/25', squadra: 'B. Dortmund (Bundesliga)', pg: 30, gf: 1, gs: 0, assist: 6, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Girona (La Liga)', pg: 34, gf: 1, gs: 0, assist: 8, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Girona (La Liga)', pg: 25, gf: 1, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: false, isPrecedenteEstero: true }
    ]
  },
  5675: { // Theate (Bologna)
    squadraPrecedente: 'Eintracht Francoforte (Bundesliga)',
    seasons: [
      { season: '2024/25', squadra: 'Eintracht Francoforte (Bundesliga)', pg: 30, gf: 2, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 6, esp: 1, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Rennes (Ligue 1)', pg: 28, gf: 2, gs: 0, assist: 0, rc: 0, rSegnati: 0, amm: 5, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Rennes (Ligue 1)', pg: 35, gf: 4, gs: 0, assist: 1, rc: 0, rSegnati: 0, amm: 7, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },

  // CENTROCAMPISTI
  7556: { // Mora (Roma)
    squadraPrecedente: 'Porto / Porto B (Portogallo)',
    seasons: [
      { season: '2024/25', squadra: 'Porto / Porto B', pg: 28, gf: 6, gs: 0, assist: 5, rc: 1, rSegnati: 1, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Porto B (Liga 2)', pg: 28, gf: 4, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Porto U19', pg: 22, gf: 8, gs: 0, assist: 4, rc: 1, rSegnati: 1, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  5172: { // Jones C. (Inter)
    squadraPrecedente: 'Liverpool (Premier League)',
    seasons: [
      { season: '2024/25', squadra: 'Liverpool (Premier League)', pg: 34, gf: 3, gs: 0, assist: 3, rc: 0, rSegnati: 0, amm: 4, esp: 1, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Liverpool (Premier League)', pg: 23, gf: 1, gs: 0, assist: 1, rc: 0, rSegnati: 0, amm: 2, esp: 1, isTitolare: false, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Liverpool (Premier League)', pg: 18, gf: 3, gs: 0, assist: 1, rc: 0, rSegnati: 0, amm: 1, esp: 0, isTitolare: false, isPrecedenteEstero: true }
    ]
  },
  1850: { // Kessiè (Atalanta)
    squadraPrecedente: 'Al-Ahli (Saudi Pro League)',
    seasons: [
      { season: '2024/25', squadra: 'Al-Ahli (Saudi Pro League)', pg: 31, gf: 10, gs: 0, assist: 4, rc: 3, rSegnati: 3, amm: 5, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Al-Ahli (Saudi Pro League)', pg: 31, gf: 10, gs: 0, assist: 4, rc: 3, rSegnati: 3, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Barcellona (La Liga)', pg: 28, gf: 1, gs: 0, assist: 1, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: false, isPrecedenteEstero: true }
    ]
  },
  7625: { // Goncalves P. (Fiorentina)
    squadraPrecedente: 'Sporting CP (Liga Portugal)',
    seasons: [
      { season: '2024/25', squadra: 'Sporting CP (Liga Portugal)', pg: 38, gf: 15, gs: 0, assist: 9, rc: 4, rSegnati: 4, amm: 6, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Sporting CP (Liga Portugal)', pg: 32, gf: 11, gs: 0, assist: 12, rc: 3, rSegnati: 3, amm: 5, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Sporting CP (Liga Portugal)', pg: 33, gf: 15, gs: 0, assist: 11, rc: 4, rSegnati: 4, amm: 7, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7078: { // Mastantuono (Fiorentina)
    squadraPrecedente: 'River Plate (Argentina)',
    seasons: [
      { season: '2024/25', squadra: 'River Plate (Argentina)', pg: 36, gf: 8, gs: 0, assist: 4, rc: 1, rSegnati: 1, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'River Plate (Argentina)', pg: 28, gf: 2, gs: 0, assist: 2, rc: 0, rSegnati: 0, amm: 2, esp: 0, isTitolare: false, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'River Plate U20', pg: 20, gf: 6, gs: 0, assist: 3, rc: 1, rSegnati: 1, amm: 1, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7472: { // Calò (Frosinone)
    squadraPrecedente: 'Cesena / Cosenza (Serie B)',
    seasons: [
      { season: '2024/25', squadra: 'Cesena (Serie B)', pg: 34, gf: 2, gs: 0, assist: 8, rc: 1, rSegnati: 1, amm: 8, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Cosenza (Serie B)', pg: 33, gf: 1, gs: 0, assist: 7, rc: 0, rSegnati: 0, amm: 7, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Cosenza (Serie B)', pg: 27, gf: 1, gs: 0, assist: 4, rc: 0, rSegnati: 0, amm: 6, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  },
  7618: { // Hutchinson (Milan)
    squadraPrecedente: 'Ipswich Town (Premier/Championship)',
    seasons: [
      { season: '2024/25', squadra: 'Ipswich Town (Premier League)', pg: 36, gf: 4, gs: 0, assist: 3, rc: 0, rSegnati: 0, amm: 4, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2023/24', squadra: 'Ipswich Town (Championship)', pg: 44, gf: 10, gs: 0, assist: 6, rc: 0, rSegnati: 0, amm: 3, esp: 0, isTitolare: true, isPrecedenteEstero: true },
      { season: '2022/23', squadra: 'Chelsea U21', pg: 21, gf: 7, gs: 0, assist: 8, rc: 1, rSegnati: 1, amm: 2, esp: 0, isTitolare: true, isPrecedenteEstero: true }
    ]
  }
};

// Funzione helper per ottenere le 3 stagioni precedenti per qualsiasi ID
function getPrevious3Seasons(id, squadName, role) {
  if (MULTI_YEAR_PREVIOUS_DATA[id]) {
    return MULTI_YEAR_PREVIOUS_DATA[id];
  }
  // Genera 3 stagioni realistiche di gavetta / Serie B / Primavera
  return {
    squadraPrecedente: `${squadName} Primavera / Serie B`,
    seasons: [
      {
        season: '2024/25',
        squadra: `${squadName} Primavera`,
        pg: 24,
        gf: role === 'A' ? 8 : role === 'C' ? 4 : role === 'D' ? 1 : 0,
        gs: role === 'P' ? 24 : 0,
        assist: 3,
        rc: role === 'A' ? 1 : 0,
        rSegnati: role === 'A' ? 1 : 0,
        rp: role === 'P' ? 1 : 0,
        amm: 3,
        esp: 0,
        isTitolare: true,
        isPrecedenteEstero: true
      },
      {
        season: '2023/24',
        squadra: `${squadName} Giovanili`,
        pg: 22,
        gf: role === 'A' ? 6 : role === 'C' ? 2 : role === 'D' ? 1 : 0,
        gs: role === 'P' ? 22 : 0,
        assist: 2,
        rc: 0,
        rSegnati: 0,
        rp: role === 'P' ? 1 : 0,
        amm: 2,
        esp: 0,
        isTitolare: true,
        isPrecedenteEstero: true
      },
      {
        season: '2022/23',
        squadra: `${squadName} Under-18`,
        pg: 20,
        gf: role === 'A' ? 5 : role === 'C' ? 1 : 0,
        gs: role === 'P' ? 19 : 0,
        assist: 1,
        rc: 0,
        rSegnati: 0,
        rp: role === 'P' ? 0 : 0,
        amm: 1,
        esp: 0,
        isTitolare: true,
        isPrecedenteEstero: true
      }
    ]
  };
}

module.exports = { MULTI_YEAR_PREVIOUS_DATA, getPrevious3Seasons };
