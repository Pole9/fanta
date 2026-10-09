export interface InjuryInfo {
  playerName: string;
  squadra?: string;
  infortunio: string;
  rientroPrevisto: string;
  meseRientro: string;
  isSqualificato?: boolean;
  isRecuperato?: boolean;
  note?: string;
}

// Database Infortuni UFFICIALI e VERIFICATI (Aggiornato a Ottobre 2026)
// Include ESCLUSIVAMENTE calciatori con infortunio certo e conclamato.
// Calciatori recuperati o con ballottaggi/acciacchi gestiti a parte NON sono inseriti per evitare falsi positivi.
export const INJURY_DATABASE: Record<string, InjuryInfo> = {
  "scamacca": {
    "playerName": "Scamacca",
    "squadra": "Atalanta",
    "infortunio": "Rottura del legamento crociato anteriore con interessamento del menisco.",
    "rientroPrevisto": "Febbraio 2027",
    "meseRientro": "Feb"
  },
  "scalvini": {
    "playerName": "Scalvini",
    "squadra": "Atalanta",
    "infortunio": "Rottura del legamento crociato anteriore del ginocchio sinistro, in riabilitazione avanzata.",
    "rientroPrevisto": "Gennaio 2027",
    "meseRientro": "Gen"
  },
  "felici": {
    "playerName": "Felici",
    "squadra": "Cagliari",
    "infortunio": "Rottura del legamento crociato anteriore del ginocchio, operato.",
    "rientroPrevisto": "Marzo 2027",
    "meseRientro": "Mar"
  },
  "kevin carlos": {
    "playerName": "Kevin Carlos",
    "squadra": "Cagliari",
    "infortunio": "Problema muscolare alla gamba sinistra accusato in rifinitura, forfait per questa giornata.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "parisi": {
    "playerName": "Parisi",
    "squadra": "Fiorentina",
    "infortunio": "Iter riabilitativo in corso dopo la rottura del legamento crociato del ginocchio.",
    "rientroPrevisto": "Novembre",
    "meseRientro": "Nov"
  },
  "raimondo": {
    "playerName": "Raimondo",
    "squadra": "Frosinone",
    "infortunio": "Distrazione muscolare al bicipite femorale, assente contro il Napoli.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "birligea": {
    "playerName": "Birligea",
    "squadra": "Frosinone",
    "infortunio": "Problema muscolare ai flessori, indisponibile.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "colombo": {
    "playerName": "Colombo",
    "squadra": "Genoa",
    "infortunio": "Lesione muscolare al flessore della coscia, assente contro la Fiorentina.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "sow": {
    "playerName": "Sow",
    "squadra": "Genoa",
    "infortunio": "Problema muscolare ai flessori in fase di valutazione, forfait.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "malinovskyi": {
    "playerName": "Malinovskyi",
    "squadra": "Genoa",
    "infortunio": "Grave infortunio alla caviglia destra con frattura del perone, operato. Stagione finita.",
    "rientroPrevisto": "Stagione Finita (Maggio 2027)",
    "meseRientro": "Mag"
  },
  "bremer": {
    "playerName": "Bremer",
    "squadra": "Juventus",
    "infortunio": "Rottura del legamento crociato anteriore e menisco del ginocchio sinistro, operato.",
    "rientroPrevisto": "Stagione Finita (Maggio 2027)",
    "meseRientro": "Mag"
  },
  "milik": {
    "playerName": "Milik",
    "squadra": "Juventus",
    "infortunio": "Intervento di sutura artroscopica del residuo meniscale mediale del ginocchio sinistro.",
    "rientroPrevisto": "Dicembre",
    "meseRientro": "Dic"
  },
  "gudmundsson": {
    "playerName": "Gudmundsson",
    "squadra": "Lazio",
    "infortunio": "Lesione muscolare di primo grado alla coscia destra, assente contro il Monza.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "saelemaekers": {
    "playerName": "Saelemaekers",
    "squadra": "Milan",
    "infortunio": "Frattura del malleolo mediale della caviglia destra, operato e lungo stop.",
    "rientroPrevisto": "Fine Novembre",
    "meseRientro": "Nov"
  },
  "bennacer": {
    "playerName": "Bennacer",
    "squadra": "Milan",
    "infortunio": "Lesione severa del muscolo gemello mediale del polpaccio destro, operato.",
    "rientroPrevisto": "Gennaio 2027",
    "meseRientro": "Gen"
  },
  "kowalski": {
    "playerName": "Kowalski",
    "squadra": "Parma",
    "infortunio": "Rottura del legamento crociato anteriore del ginocchio destro, operato.",
    "rientroPrevisto": "Marzo 2027",
    "meseRientro": "Mar"
  },
  "zapata": {
    "playerName": "Zapata",
    "squadra": "Torino",
    "infortunio": "Lesione del legamento crociato anteriore, del menisco mediale e del legamento collaterale laterale.",
    "rientroPrevisto": "Stagione Finita (Giugno 2027)",
    "meseRientro": "Giu"
  },
  "schuurs": {
    "playerName": "Schuurs",
    "squadra": "Torino",
    "infortunio": "Iter riabilitativo post-operatorio al ginocchio sinistro.",
    "rientroPrevisto": "Dicembre",
    "meseRientro": "Dic"
  },
  "schingtienne": {
    "playerName": "Schingtienne",
    "squadra": "Venezia",
    "infortunio": "Risentimento muscolare subito in Nazionale, assente contro l'Atalanta.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "cruz": {
    "playerName": "Cruz",
    "squadra": "Verona",
    "infortunio": "Rottura del tendine del retto femorale destro, intervento chirurgico e lungo stop.",
    "rientroPrevisto": "Gennaio 2027",
    "meseRientro": "Gen"
  }
};

export function getInjuryInfo(nome: string): InjuryInfo | null {
  if (!nome) return null;

  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/gi, " ").replace(/\s+/g, " ").trim();
  const normalized = clean(nome);

  const checkInfo = (info: InjuryInfo | undefined | null): InjuryInfo | null => {
    if (!info) return null;
    if (info.isRecuperato) return null;
    if (info.meseRientro === 'Disponibile' || info.rientroPrevisto?.toLowerCase().includes('disponibile')) return null;
    return info;
  };

  if (INJURY_DATABASE[normalized]) {
    return checkInfo(INJURY_DATABASE[normalized]);
  }

  const normTokens = normalized.split(" ").filter(Boolean);
  if (normTokens.length === 0) return null;

  for (const [key, info] of Object.entries(INJURY_DATABASE)) {
    const cleanKey = clean(key);
    if (cleanKey === normalized) return checkInfo(info);

    const keyTokens = cleanKey.split(" ").filter(Boolean);

    if (keyTokens.length > 1) {
      const allKeyTokensMatch = keyTokens.every(kt => {
        if (kt.length === 1) {
          return normTokens.some(nt => nt === kt || (nt.length > 1 && nt.startsWith(kt)));
        } else {
          return normTokens.includes(kt);
        }
      });

      const normInitials = normTokens.filter(t => t.length === 1);
      const keyInitials = keyTokens.filter(t => t.length === 1);
      const hasInitialConflict = normInitials.some(ni => keyInitials.length > 0 && !keyInitials.includes(ni));

      if (allKeyTokensMatch && !hasInitialConflict) {
        return checkInfo(info);
      }
    } else {
      const singleKey = keyTokens[0];
      if (normTokens.includes(singleKey)) {
        return checkInfo(info);
      }
    }
  }

  return null;
}
