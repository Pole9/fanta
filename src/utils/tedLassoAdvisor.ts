import { Player, Role } from '../types';
import { PlayerMatchdayEvaluation, getPlayerMatchdayEvaluation, SyncedOnlineData } from '../data/matchdayData';

export interface TedPlayerCard {
  player: Player;
  evaluation: PlayerMatchdayEvaluation;
  tedScore: number; // 0 - 100
  isStarter: boolean;
  benchOrder?: number;
  pitchPosition?: { x: number; y: number }; // Coordinate percentuali sul campo (0-100)
}

export interface TedFormationConfig {
  id: string;
  label: string;
  slots: { P: number; D: number; C: number; A: number };
  isModificatoreFriendly: boolean;
  descrizione: string;
}

export const TED_FORMATIONS: Record<string, TedFormationConfig> = {
  '3-4-3': {
    id: '3-4-3',
    label: '3-4-3 (Ultra-Offensivo)',
    slots: { P: 1, D: 3, C: 4, A: 3 },
    isModificatoreFriendly: false,
    descrizione: 'Trazione anteriore massima: 3 punte per massimizzare i gol.'
  },
  '4-3-3': {
    id: '4-3-3',
    label: '4-3-3 (Modificatore + Tridente)',
    slots: { P: 1, D: 4, C: 3, A: 3 },
    isModificatoreFriendly: true,
    descrizione: 'Il modulo perfetto: attiva il modificatore di difesa senza rinunciare a 3 punte.'
  },
  '3-5-2': {
    id: '3-5-2',
    label: '3-5-2 (Centrocampo Dominante)',
    slots: { P: 1, D: 3, C: 5, A: 2 },
    isModificatoreFriendly: false,
    descrizione: 'Ideale per schierare 5 centrocampisti da bonus e da inserimento.'
  },
  '4-4-2': {
    id: '4-4-2',
    label: '4-4-2 (Classico & Equilibrato)',
    slots: { P: 1, D: 4, C: 4, A: 2 },
    isModificatoreFriendly: true,
    descrizione: 'Solido ed equilibrato, attiva il modificatore di difesa e bilancia i reparti.'
  },
  '4-2-3-1': {
    id: '4-2-3-1',
    label: '4-2-3-1 (Trequarti Spettacolo)',
    slots: { P: 1, D: 4, C: 5, A: 1 },
    isModificatoreFriendly: true,
    descrizione: 'Massima copertura difensiva e trequarti affollata, unica punta di riferimento.'
  }
};

// Calcolo del Ted Score (0-100)
export function calculateTedScore(player: Player, evalData: PlayerMatchdayEvaluation): number {
  if (evalData.injury) {
    return 0; // Infortunato non può scendere in campo
  }

  let score = 50; // Punteggio base

  // 1. Base Statistica: Fantamedia o Media Voto (Max +/- 20 punti)
  const fm = player.fm || player.threeYearAvg?.fm || (player.quotazione ? player.quotazione / 4 : 6.0);
  if (fm >= 8.0) score += 20;
  else if (fm >= 7.5) score += 16;
  else if (fm >= 7.0) score += 12;
  else if (fm >= 6.5) score += 8;
  else if (fm >= 6.0) score += 4;
  else score -= 5;

  // Bonus gol / assist
  if ((player.gf || 0) >= 10 || (player.threeYearAvg?.totalGf || 0) >= 25) score += 5;
  if ((player.assist || 0) >= 5) score += 3;

  // 2. Titolarità Gazzetta dello Sport (Max +/- 20 punti)
  const titolarita = evalData.gazzetta.titolaritaPercent;
  if (titolarita >= 90) score += 18;
  else if (titolarita >= 75) score += 12;
  else if (titolarita >= 60) score += 5; // Ballottaggio
  else if (titolarita >= 40) score -= 5;
  else score -= 18; // Rischio s.v.

  // 3. Difficoltà Match / Fattore Campo (Max +/- 15 punti)
  if (evalData.match) {
    const diff = evalData.match.difficulty;
    const isHome = evalData.match.isHome;
    if (diff === 1) score += 14;
    else if (diff === 2) score += 9;
    else if (diff === 3) score += (isHome ? 4 : 0);
    else if (diff === 4) score -= 6;
    else if (diff === 5) score -= 12;
  }

  // 4. Valutazione Redazione Fantagazzetta (Max +/- 15 punti)
  const stars = evalData.fantagazzetta.stars;
  if (stars === 5) score += 15;
  else if (stars === 4) score += 10;
  else if (stars === 3) score += 4;
  else if (stars === 2) score -= 6;
  else if (stars === 1) score -= 14;

  // 5. Consigli Tattico Luca Diddi (Max +/- 8 punti)
  if (evalData.tatticoAdvice) {
    const txt = evalData.tatticoAdvice.toLowerCase();
    if (txt.includes('bug del listone') || txt.includes('regalo') || txt.includes('poesia') || txt.includes('top scelta') || txt.includes('da prendere sempre')) {
      score += 8;
    } else if (txt.includes('trappol') || txt.includes('follia') || txt.includes('da evitare') || txt.includes('mai')) {
      score -= 8;
    } else if (txt.includes('ottim') || txt.includes('consigliato')) {
      score += 4;
    }
  }

  // Bonus Rigorista / Piazzati Gazzetta
  if (evalData.gazzetta.rigorista || player.rigorista) score += 4;
  if (evalData.gazzetta.piazzati) score += 2;

  // Clamp tra 10 e 98
  return Math.min(98, Math.max(10, Math.round(score)));
}

// Generatore formazione ottimale automatica
export function generateTedLineup(
  players: Player[],
  formationId: string = '3-4-3',
  syncedData?: SyncedOnlineData | null
): { starters: TedPlayerCard[]; bench: TedPlayerCard[]; formation: TedFormationConfig } {
  const formation = TED_FORMATIONS[formationId] || TED_FORMATIONS['3-4-3'];

  // Calcola valutazione e Ted Score per tutti i giocatori della rosa
  const evaluatedPlayers: TedPlayerCard[] = players.map(p => {
    const evalData = getPlayerMatchdayEvaluation(p.nome, p.squadra, syncedData);
    const score = calculateTedScore(p, evalData);
    return {
      player: p,
      evaluation: evalData,
      tedScore: score,
      isStarter: false
    };
  });

  // Raggruppa per ruolo e ordina per Ted Score decrescente
  const byRole: Record<Role, TedPlayerCard[]> = {
    P: evaluatedPlayers.filter(p => p.player.ruolo === 'P').sort((a, b) => b.tedScore - a.tedScore),
    D: evaluatedPlayers.filter(p => p.player.ruolo === 'D').sort((a, b) => b.tedScore - a.tedScore),
    C: evaluatedPlayers.filter(p => p.player.ruolo === 'C').sort((a, b) => b.tedScore - a.tedScore),
    A: evaluatedPlayers.filter(p => p.player.ruolo === 'A').sort((a, b) => b.tedScore - a.tedScore)
  };

  const starters: TedPlayerCard[] = [];
  const bench: TedPlayerCard[] = [];

  // Seleziona i migliori titolari in base agli slot del modulo
  (['P', 'D', 'C', 'A'] as Role[]).forEach(role => {
    const needed = formation.slots[role];
    const available = byRole[role];
    
    available.slice(0, needed).forEach(card => {
      card.isStarter = true;
      starters.push(card);
    });

    available.slice(needed).forEach(card => {
      card.isStarter = false;
      bench.push(card);
    });
  });

  // Ordina la panchina nel classico ordine Fanta: 1 P, 2 D, 2 C, 2 A ordinati per score decrescente
  const orderedBench: TedPlayerCard[] = [];
  const benchP = bench.filter(b => b.player.ruolo === 'P').sort((a, b) => b.tedScore - a.tedScore);
  const benchD = bench.filter(b => b.player.ruolo === 'D').sort((a, b) => b.tedScore - a.tedScore);
  const benchC = bench.filter(b => b.player.ruolo === 'C').sort((a, b) => b.tedScore - a.tedScore);
  const benchA = bench.filter(b => b.player.ruolo === 'A').sort((a, b) => b.tedScore - a.tedScore);

  let benchIndex = 1;
  [...benchP, ...benchD, ...benchC, ...benchA].forEach(card => {
    card.benchOrder = benchIndex++;
    orderedBench.push(card);
  });

  // Assegna coordinate sul campo tattico (x: 0-100%, y: 0-100%)
  assignPitchCoordinates(starters, formation);

  return { starters, bench: orderedBench, formation };
}

// Assegna coordinate grafiche per disegnare i calciatori sul prato verde
function assignPitchCoordinates(starters: TedPlayerCard[], formation: TedFormationConfig) {
  const p = starters.filter(s => s.player.ruolo === 'P');
  const d = starters.filter(s => s.player.ruolo === 'D');
  const c = starters.filter(s => s.player.ruolo === 'C');
  const a = starters.filter(s => s.player.ruolo === 'A');

  // Portiere (in basso al centro)
  if (p[0]) p[0].pitchPosition = { x: 50, y: 88 };

  // Linea Difensiva (y: 68)
  const dCount = d.length;
  d.forEach((card, idx) => {
    const xStep = 100 / (dCount + 1);
    card.pitchPosition = { x: Math.round(xStep * (idx + 1)), y: 68 };
  });

  // Linea Mediana (y: 44)
  const cCount = c.length;
  c.forEach((card, idx) => {
    const xStep = 100 / (cCount + 1);
    card.pitchPosition = { x: Math.round(xStep * (idx + 1)), y: 44 };
  });

  // Linea d'Attacco (y: 18)
  const aCount = a.length;
  a.forEach((card, idx) => {
    const xStep = 100 / (aCount + 1);
    card.pitchPosition = { x: Math.round(xStep * (idx + 1)), y: 18 };
  });
}

// Verdetto e citazione motivazionale di Ted Lasso per il giocatore
export function getTedPlayerVerdict(player: Player, score: number, evalData: PlayerMatchdayEvaluation): {
  badge: 'Certezza Assoluta' | 'Scelta di Cuore' | 'Scommessa alla Richmond' | 'Panchina Tattica' | 'In Infermeria';
  quote: string;
  verdict: string;
} {
  if (evalData.injury) {
    return {
      badge: 'In Infermeria',
      quote: "Anche il miglior tè freddo ha bisogno di riposare prima di essere servito. Fai un respiro profondo e lascialo guarire in pace!",
      verdict: `Indisponibile (${evalData.injury.infortunio}). Rientro previsto a ${evalData.injury.rientroPrevisto}.`
    };
  }

  if (score >= 82) {
    return {
      badge: 'Certezza Assoluta',
      quote: "Credere in te stesso è il primo segreto del successo! Questo ragazzo questa domenica ha gli occhi di tigre: da schierare a occhi chiusi.",
      verdict: `Indice Ted ${score}/100. Titolarità al ${evalData.gazzetta.titolaritaPercent}%, Fantagazzetta ${evalData.fantagazzetta.stars} stelle e match favorevole (${evalData.match?.description || 'in programma'}).`
    };
  }

  if (score >= 70) {
    return {
      badge: 'Scelta di Cuore',
      quote: "Non prometto che vinceremo, ma prometto che non ci tireremo mai indietro. Dagli fiducia da titolare e ti ripagherà con una prestazione generosa.",
      verdict: `Indice Ted ${score}/100. Valida opzione per il bonus. ${evalData.gazzetta.noteGazzetta}`
    };
  }

  if (score >= 55) {
    return {
      badge: 'Scommessa alla Richmond',
      quote: "Essere un pesce fuor d'acqua non significa non saper nuotare, significa solo che devi muovere le pinne un po' più forte. Scommessa intrigante da 3° slot.",
      verdict: `Indice Ted ${score}/100. Partita combattuta o ballottaggio (${evalData.gazzetta.ballottaggioCon || '50-50'}). Schieralo solo con copertura sicura in panchina.`
    };
  }

  return {
    badge: 'Panchina Tattica',
    quote: "A volte la mossa più coraggiosa è sedersi comodi, bere un sorso d'acqua e lasciare che sia qualcun altro a prendere i colpi sui parastinchi.",
    verdict: `Indice Ted ${score}/100. Match complicato (${evalData.match?.opponent}) o minutaggio a forte rischio. Meglio farlo rifiatare in panchina.`
  };
}

// Calcolo del Modificatore di Difesa
export function evaluateDefenseModifier(starters: TedPlayerCard[]): {
  isWorthIt: boolean;
  expectedBonus: '+1 punto' | '+3 punti' | '+6 punti' | 'Rischioso';
  averagePredictedMv: number;
  advice: string;
} {
  const defenders = starters.filter(s => s.player.ruolo === 'D');
  const goalkeeper = starters.find(s => s.player.ruolo === 'P');

  if (defenders.length < 4) {
    return {
      isWorthIt: false,
      expectedBonus: 'Rischioso',
      averagePredictedMv: 5.9,
      advice: `Hai solo ${defenders.length} difensori titolari. Per attivare il modificatore di difesa servono almeno 4 difensori a voto. Valuta il passaggio al modulo 4-3-3 o 4-4-2.`
    };
  }

  // Prendi i migliori 3 difensori + portiere per simulare il modificatore
  const top3Mv = defenders
    .map(d => d.player.mv || (d.tedScore > 75 ? 6.5 : d.tedScore > 60 ? 6.2 : 5.8))
    .sort((a, b) => b - a)
    .slice(0, 3);
  
  const gkMv = goalkeeper?.player.mv || (goalkeeper && goalkeeper.tedScore > 75 ? 6.5 : 6.0);
  const avg = (top3Mv.reduce((a, b) => a + b, 0) + gkMv) / 4;
  const roundedAvg = Math.round(avg * 100) / 100;

  if (roundedAvg >= 6.5) {
    return {
      isWorthIt: true,
      expectedBonus: '+6 punti',
      averagePredictedMv: roundedAvg,
      advice: `Modificatore ECCEZIONALE (media prevista ${roundedAvg}): i tuoi 4 difensori sono in grandissima forma. Schierali assolutamente per puntare al bonus pieno (+6 pt)!`
    };
  }

  if (roundedAvg >= 6.25) {
    return {
      isWorthIt: true,
      expectedBonus: '+3 punti',
      averagePredictedMv: roundedAvg,
      advice: `Modificatore CONSIGLIATO (media prevista ${roundedAvg}): buona probabilità di incassare almeno +3 punti bonus in classifica.`
    };
  }

  return {
    isWorthIt: true,
    expectedBonus: '+1 punto',
    averagePredictedMv: roundedAvg,
    advice: `Modificatore DISCRETO (media prevista ${roundedAvg}): puoi strappare +1 punto bonus. Se preferisci il tridente pesante, puoi passare al 3-4-3.`
  };
}

// Citazioni di Ted Lasso randomiche
export const TED_LASSO_QUOTES = [
  "Credici! 'Believe' non è solo un foglio di carta attaccato con lo scotch giallo sopra la porta. È il modo in cui scegliamo di affrontare questa domenica!",
  "Sii un pesce rosso, amico mio. Sai qual è l'animale più felice del mondo? Il pesce rosso: ha una memoria di 10 secondi. Dimentica i rigori sbagliati della scorsa giornata e pensa a questa!",
  "Prendi un bel tè caldo... cioè no, il tè sa di foglia bagnata. Prendi un bel caffè espresso e schiera chi ha il fuoco dentro!",
  "Il successo non si misura dai tre punti in classifica, ma dall'essere la miglior versione di noi stessi. E anche da un bel gol all'incrocio al 93° minuto!",
  "La curiosità batte sempre il giudizio. Prima di lasciare in panchina quel ragazzo, chiediti cosa può fare se gli dai fiducia!"
];
