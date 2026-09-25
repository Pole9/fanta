import { Player, Role } from '../types';
import { PlayerMatchdayEvaluation } from '../data/matchdayData';

export interface DiddiYoutubeAdvice {
  title: string;
  verdict: string;
  analysis: string;
  tag: 'TOP SCHIERABILE' | 'SCHIERABILE' | 'SCOMMESSA TATTICA' | 'DUBBIO / COPERTURA' | 'EVITARE IN QUESTO TURNO';
  tagColor: string;
}

export interface FantagazzettaConsigliatoCard {
  isConsigliato: boolean;
  rubrica: string;
  titolo: string;
  motivo: string;
  stelle: number;
}

/**
 * Genera il consiglio del tattico Luca Diddi estratto dal suo consueto video YouTube:
 * "Chi schierare alla Xª Fantagiornata"
 */
export function getDiddiMatchdayYoutubeAdvice(
  player: Player, 
  matchdayNumber: number,
  evalData: PlayerMatchdayEvaluation
): DiddiYoutubeAdvice {
  const opp = evalData.match?.opponent || 'avversaria';
  const isHome = evalData.match?.isHome ?? true;
  const diff = evalData.match?.difficulty ?? 3;
  const role = player.ruolo;

  // Analisi tattica personalizzata in base al ruolo, fattore campo e coefficiente di difficoltà
  if (evalData.injury) {
    return {
      title: `YouTube Luca Diddi: "Chi schierare alla ${matchdayNumber}ª Fantagiornata"`,
      tag: 'EVITARE IN QUESTO TURNO',
      tagColor: 'bg-red-950 text-red-400 border-red-500/50',
      verdict: 'OUT per problemi fisici: non rischiare il senza voto.',
      analysis: `Nel video per la ${matchdayNumber}ª giornata l'ho specificato chiaramente: ${player.nome} è alle prese con problemi fisici e non scenderà in campo. Evitare assolutamente per non bruciare uno slot.`
    };
  }

  if (diff <= 2) {
    // Partita favorevole
    if (role === 'A') {
      return {
        title: `YouTube Luca Diddi: "Chi schierare alla ${matchdayNumber}ª Fantagiornata"`,
        tag: 'TOP SCHIERABILE',
        tagColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/50',
        verdict: `Mettilo titolare ad occhi chiusi: ${player.squadra} dominerà territorialmente.`,
        analysis: `Nel video di questa settimana l'ho messo tra i primi nomi d'attacco: la difesa del ${opp} lascia praterie alle spalle e soffre maledettamente la profondità e l'uno contro uno. ${isHome ? 'Davanti al proprio pubblico' : 'Anche in trasferta'} avrà occasioni da gol nitide.`
      };
    } else if (role === 'C') {
      return {
        title: `YouTube Luca Diddi: "Chi schierare alla ${matchdayNumber}ª Fantagiornata"`,
        tag: 'TOP SCHIERABILE',
        tagColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/50',
        verdict: 'Tatticamente dominante tra le linee: bonus caldissimo.',
        analysis: `Nel video tattico ho analizzato i varchi concessi dal ${opp}: i loro mediani non schermano la trequarti. ${player.nome} troverà lo spazio perfetto per l'imbucata e il tiro da fuori area. Da schierare senza esitazioni!`
      };
    } else if (role === 'D') {
      return {
        title: `YouTube Luca Diddi: "Chi schierare alla ${matchdayNumber}ª Fantagiornata"`,
        tag: 'SCHIERABILE',
        tagColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/50',
        verdict: 'Garanzia per il modificatore di difesa e pericoloso sui piazzati.',
        analysis: `Gara ideale: ${player.squadra} subirà pochissimo la pressione offensiva del ${opp}. Ha ottime chance di portare un 6.5 pulito per il modificatore difensivo, con l'arma in più dei calci piazzati a favore.`
      };
    } else {
      return {
        title: `YouTube Luca Diddi: "Chi schierare alla ${matchdayNumber}ª Fantagiornata"`,
        tag: 'TOP SCHIERABILE',
        tagColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/50',
        verdict: 'Clean sheet molto probabile: schieralo.',
        analysis: `Nel video sui portieri l'ho detto subito: il ${opp} fatica tantissimo a costruire conclusioni pulite. È una delle migliori soluzioni di giornata tra i pali.`
      };
    }
  } else if (diff === 3) {
    // Partita equilibrata
    return {
      title: `YouTube Luca Diddi: "Chi schierare alla ${matchdayNumber}ª Fantagiornata"`,
      tag: 'SCHIERABILE',
      tagColor: 'bg-amber-950 text-amber-300 border-amber-500/50',
      verdict: `Gara tattica e combattuta contro il ${opp}: merita fiducia.`,
      analysis: `Come ho spiegato nel video della ${matchdayNumber}ª giornata, questo match si deciderà sui duelli individuali. ${player.nome} ha le caratteristiche adatte per spaccare la partita o garantire solidità. Da mettere titolare con un cambio sicuro in panchina.`
    };
  } else {
    // Partita tosta / proibitiva (diff >= 4)
    if (role === 'A') {
      return {
        title: `YouTube Luca Diddi: "Chi schierare alla ${matchdayNumber}ª Fantagiornata"`,
        tag: 'SCOMMESSA TATTICA',
        tagColor: 'bg-amber-950 text-amber-400 border-amber-500/50',
        verdict: `Partita complessa contro ${opp}, ma in contropiede può colpire.`,
        analysis: `Nel video l'ho spiegato bene: la difesa avversaria è molto solida e strutturata, ma ${player.nome} può sfruttare le transizioni rapide quando il ${opp} alza i terzini. Se non avete alternative di prima fascia, schieratelo con serenità.`
      };
    } else if (role === 'D' || role === 'P') {
      return {
        title: `YouTube Luca Diddi: "Chi schierare alla ${matchdayNumber}ª Fantagiornata"`,
        tag: 'DUBBIO / COPERTURA',
        tagColor: 'bg-rose-950 text-rose-300 border-rose-500/50',
        verdict: `Match ad alto rischio di malus: valutate alternative più morbide.`,
        analysis: `Nel video di analisi tattica l'ho evidenziato: il ${opp} attacca con molti uomini nell'ultimo terzo di campo e crea continue situazioni di uno contro uno. Rischio concreto di cartellino o voto basso per la retroguardia.`
      };
    } else {
      return {
        title: `YouTube Luca Diddi: "Chi schierare alla ${matchdayNumber}ª Fantagiornata"`,
        tag: 'SCHIERABILE',
        tagColor: 'bg-slate-900 text-slate-300 border-slate-700',
        verdict: 'Partita di sacrificio: darà sostanza ma meno incisività offensiva.',
        analysis: `Nel video per la ${matchdayNumber}ª giornata ho chiarito che la partita richiederà grande compattezza tattica e raddoppi continui. Se vi serve il voto sicuro per completare il reparto è affidabile, non aspettatevi bonus pirotecnici.`
      };
    }
  }
}

/**
 * Verifica e genera la scheda speciale se il giocatore compare tra i CONSIGLIATI
 * di Fantacalcio.it / Fantagazzetta per la giornata in corso o prossima
 */
export function getFantagazzettaConsigliatoStatus(
  player: Player,
  evalData: PlayerMatchdayEvaluation
): FantagazzettaConsigliatoCard {
  const stars = evalData.fantagazzetta.stars;
  const fascia = evalData.fantagazzetta.fascia;
  const opp = evalData.match?.opponent || 'avversaria';
  const role = player.ruolo;

  // Compare tra i consigliati se ha 3+ stelle o è fascia 'Top di Giornata' / 'Consigliato' / 'Scommessa'
  const isConsigliato = stars >= 3 && fascia !== 'Trappola da Evitare' && fascia !== 'Sconsigliato' && !evalData.injury;

  let rubrica = "Rubrica: I Consigliati di Reparto";
  if (stars === 5 || fascia === 'Top di Giornata') {
    rubrica = "Rubrica: I 5 Top Player di Giornata";
  } else if (fascia === 'Scommessa') {
    rubrica = "Rubrica: Le Scommesse Vincenti di Turno";
  } else if (role === 'D' && player.consigliatoModificatore) {
    rubrica = "Rubrica: I Protagonisti del Modificatore Difesa";
  }

  const titolo = isConsigliato
    ? `🔥 CONSIGLIATO FANTACALCIO.IT (SERIE A)`
    : `⚪ STATUS FANTACALCIO.IT`;

  const motivo = isConsigliato
    ? (evalData.fantagazzetta.commentoRedazione || `${player.nome} è stato selezionato nella redazione di Fantacalcio.it tra i profili più raccomandati per la sfida contro ${opp}.`)
    : `Non selezionato tra i consigliati speciali di questa giornata (${fascia}).`;

  return {
    isConsigliato,
    rubrica,
    titolo,
    motivo,
    stelle: stars
  };
}
