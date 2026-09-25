export interface InjuryInfo {
  playerName: string;
  squadra?: string;
  infortunio: string;
  rientroPrevisto: string; // es. "Fine Novembre", "Inizio Ottobre", "Gennaio", ecc.
  meseRientro: string; // es. "Nov", "Gen", "Ott", "Inizio Ott", "In dubbio", "Squalificato"
  isSqualificato?: boolean;
  note?: string;
}

export const INJURY_DATABASE: Record<string, InjuryInfo> = {
  // --- ATALANTA ---
  "scamacca": {
    "playerName": "Scamacca",
    "squadra": "Atalanta",
    "infortunio": "Rottura del legamento crociato anteriore del ginocchio sinistro con interessamento del menisco.",
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
  "kossounou": {
    "playerName": "Kossounou",
    "squadra": "Atalanta",
    "infortunio": "Risentimento muscolare ai flessori della coscia sinistra subito alla vigilia della sfida contro la Juventus.",
    "rientroPrevisto": "Inizio Ottobre (6ª Giornata)",
    "meseRientro": "Inizio Ott"
  },
  "hien": {
    "playerName": "Hien",
    "squadra": "Atalanta",
    "infortunio": "Operato a fine giugno per una lesione del tendine prossimale del muscolo semimembranoso della coscia sinistra; in riatletizzazione e pronto a tornare a disposizione da metà ottobre.",
    "rientroPrevisto": "Metà Ottobre",
    "meseRientro": "Metà Ott"
  },
  "sulemana k": {
    "playerName": "Sulemana K.",
    "squadra": "Atalanta",
    "infortunio": "Lesione del collaterale mediale di secondo grado del ginocchio sinistro subita l'8 agosto in amichevole.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Inizio Ott"
  },

  // --- BOLOGNA ---
  "dovbyk": {
    "playerName": "Dovbyk",
    "squadra": "Bologna",
    "infortunio": "Noie muscolari al flessore: assente contro Napoli e Torino. Lavoro personalizzato con rientro stimato a inizio ottobre.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Inizio Ott"
  },
  "orsolini": {
    "playerName": "Orsolini",
    "squadra": "Bologna",
    "infortunio": "Risentimento ai flessori della coscia sinistra pienamente smaltito: tornato in gruppo a pieno regime e a disposizione per la 6ª giornata.",
    "rientroPrevisto": "Disponibile (6ª Giornata)",
    "meseRientro": "Disponibile"
  },
  "ferguson": {
    "playerName": "Ferguson",
    "squadra": "Bologna",
    "infortunio": "Fase finale di recupero post-intervento per ricostruzione del legamento crociato e caviglia.",
    "rientroPrevisto": "Ottobre",
    "meseRientro": "Ott"
  },
  "happonen": {
    "playerName": "Happonen",
    "squadra": "Bologna",
    "infortunio": "Risentimento all'adduttore destro accusato a Napoli, in fase di smaltimento.",
    "rientroPrevisto": "In valutazione per la 6ª giornata",
    "meseRientro": "In dubbio"
  },
  "zortea": {
    "playerName": "Zortea",
    "squadra": "Bologna",
    "infortunio": "Fastidio all'anca accusato in settimana: monitorato dallo staff medico rossoblù.",
    "rientroPrevisto": "In valutazione per la 6ª giornata",
    "meseRientro": "In dubbio"
  },
  "el azzouzi o": {
    "playerName": "El Azzouzi O.",
    "squadra": "Bologna",
    "infortunio": "Lesione del bicipite femorale della coscia sinistra, ormai vicino al rientro in gruppo.",
    "rientroPrevisto": "Fine Settembre",
    "meseRientro": "Set"
  },

  // --- CAGLIARI ---
  "felici": {
    "playerName": "Felici",
    "squadra": "Cagliari",
    "infortunio": "Rottura del legamento crociato anteriore del ginocchio subita il 7 settembre contro il Lecce. Intervento chirurgico programmato e lungo stop.",
    "rientroPrevisto": "Marzo 2027",
    "meseRientro": "Mar"
  },
  "idrissi r": {
    "playerName": "Idrissi R.",
    "squadra": "Cagliari",
    "infortunio": "In ripresa dopo l'intervento chirurgico per rottura del legamento crociato; verso il reintegro a fine ottobre.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "trepy": {
    "playerName": "Trepy",
    "squadra": "Cagliari",
    "infortunio": "Monitoraggio delle condizioni fisiche dopo il grave incidente e ricovero di agosto. Ottenuta idoneità a metà settembre, lavoro di riatletizzazione.",
    "rientroPrevisto": "Metà Ottobre",
    "meseRientro": "Metà Ott"
  },

  // --- FIORENTINA ---
  "parisi": {
    "playerName": "Parisi",
    "squadra": "Fiorentina",
    "infortunio": "Iter riabilitativo in corso dopo la rottura del legamento crociato del ginocchio.",
    "rientroPrevisto": "Novembre",
    "meseRientro": "Nov"
  },

  // --- FROSINONE ---
  "grillitsch": {
    "playerName": "Grillitsch",
    "squadra": "Frosinone",
    "infortunio": "Sindrome retto-adduttoria; indisponibile contro Como e Genoa, punta al rientro dalla 6ª giornata di campionato.",
    "rientroPrevisto": "Inizio Ottobre (6ª Giornata)",
    "meseRientro": "Inizio Ott"
  },
  "terzic": {
    "playerName": "Terzic",
    "squadra": "Frosinone",
    "infortunio": "Lesione di basso grado del bicipite femorale della coscia sinistra.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Inizio Ott"
  },

  // --- GENOA ---
  "havel": {
    "playerName": "Havel",
    "squadra": "Genoa",
    "infortunio": "Sottoposto ad operazione alla caviglia per risolvere una noia articolare; rientro previsto a metà ottobre.",
    "rientroPrevisto": "Metà Ottobre",
    "meseRientro": "Metà Ott"
  },
  "venturino": {
    "playerName": "Venturino",
    "squadra": "Genoa",
    "infortunio": "Intervento al tendine rotuleo con fase di riabilitazione specifica in corso.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "malinovskyi": {
    "playerName": "Malinovskyi",
    "squadra": "Genoa",
    "infortunio": "Grave lussazione articolare della caviglia destra con frattura del perone subita contro il Venezia. Sottoposto a intervento chirurgico, lungo decorso.",
    "rientroPrevisto": "Marzo 2027",
    "meseRientro": "Mar"
  },

  // --- INTER ---
  "barella": {
    "playerName": "Barella",
    "squadra": "Inter",
    "infortunio": "Distrazione al retto femorale della coscia destra accusata nel finale del derby. Stop stimato di 3 settimane con rivalutazione dopo la sosta di ottobre.",
    "rientroPrevisto": "Metà Ottobre (8ª Giornata)",
    "meseRientro": "Metà Ott"
  },
  "stones": {
    "playerName": "Stones",
    "squadra": "Inter",
    "infortunio": "Risentimento ai flessori della coscia sinistra; rientro atteso dopo la sosta di inizio ottobre.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Inizio Ott"
  },
  "calhanoglu": {
    "playerName": "Calhanoglu",
    "squadra": "Inter",
    "infortunio": "Risentimento agli adduttori in netto miglioramento: tornato parzialmente in gruppo, gestito cautelativamente per la sfida con l'Udinese.",
    "rientroPrevisto": "In dubbio / Convocabile (6ª Giornata)",
    "meseRientro": "In dubbio"
  },
  "spence": {
    "playerName": "Spence",
    "squadra": "Inter",
    "infortunio": "Risentimento muscolare al polpaccio, fase di scarico e recupero.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Inizio Ott"
  },

  // --- JUVENTUS ---
  "grabara": {
    "playerName": "Grabara",
    "squadra": "Juventus",
    "infortunio": "Lesione al legamento crociato anteriore del ginocchio destro. Stagione pesantemente compromessa e lungo stop.",
    "rientroPrevisto": "Stagione compromessa (Primavera 2027)",
    "meseRientro": "Lungo stop"
  },
  "locatelli": {
    "playerName": "Locatelli",
    "squadra": "Juventus",
    "infortunio": "Rottura del menisco esterno del ginocchio; operato con successo a Lione.",
    "rientroPrevisto": "Gennaio 2027",
    "meseRientro": "Gen"
  },
  "thuram k": {
    "playerName": "Thuram K.",
    "squadra": "Juventus",
    "infortunio": "Sindrome femoro-rotulea al ginocchio; operato il 3 settembre a Lione. Stop di almeno 4 mesi.",
    "rientroPrevisto": "Gennaio 2027",
    "meseRientro": "Gen"
  },
  "yildiz": {
    "playerName": "Yildiz",
    "squadra": "Juventus",
    "infortunio": "Frattura della base del V metatarso del piede sinistro operata il 31 agosto (osteosintesi). Stop di circa 3 mesi.",
    "rientroPrevisto": "Fine Novembre",
    "meseRientro": "Nov"
  },
  "boga": {
    "playerName": "Boga",
    "squadra": "Juventus",
    "infortunio": "Lesione di medio grado del bicipite femorale rimediata il 6 settembre contro il Milan. Nuovi controlli a fine mese.",
    "rientroPrevisto": "Metà Ottobre",
    "meseRientro": "Metà Ott"
  },
  "ekhator": {
    "playerName": "Ekhator",
    "squadra": "Juventus",
    "infortunio": "Lesione di medio grado del muscolo semitendinoso; atteso nuovo check clinico.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "cabal": {
    "playerName": "Cabal",
    "squadra": "Juventus",
    "infortunio": "Lesione di basso grado del muscolo semimembranoso della coscia sinistra in fase finale di riassorbimento.",
    "rientroPrevisto": "Fine Settembre",
    "meseRientro": "Set"
  },
  "milik": {
    "playerName": "Milik",
    "squadra": "Juventus",
    "infortunio": "Fase terminale di recupero dopo l'intervento per lesione al menisco mediale.",
    "rientroPrevisto": "Ottobre",
    "meseRientro": "Ott"
  },

  // --- LAZIO ---
  "dele-bashiru": {
    "playerName": "Dele-Bashiru",
    "squadra": "Lazio",
    "infortunio": "Guaio muscolare alla gamba subito contro il Bologna il 24 agosto; in miglioramento verso la 6ª giornata.",
    "rientroPrevisto": "6ª Giornata (Inizio Ottobre)",
    "meseRientro": "6ª G"
  },
  "marusic": {
    "playerName": "Marusic",
    "squadra": "Lazio",
    "infortunio": "Lesione muscolare alla coscia subita il 24 agosto a Bologna; rientro fissato per inizio ottobre.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Inizio Ott"
  },
  "rovella": {
    "playerName": "Rovella",
    "squadra": "Lazio",
    "infortunio": "Lesione muscolare al polpaccio accusata il 30 agosto contro il Genoa. Obiettivo rientro nella prima metà di ottobre.",
    "rientroPrevisto": "Metà Ottobre",
    "meseRientro": "Metà Ott"
  },

  // --- LECCE ---
  "berisha m": {
    "playerName": "Berisha M.",
    "squadra": "Lecce",
    "infortunio": "Sovraccarico muscolare alla gamba; forfait contro Monza e Milan.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Inizio Ott"
  },
  "gandelman": {
    "playerName": "Gandelman",
    "squadra": "Lecce",
    "infortunio": "Noie fisiche muscolari accusate a metà settembre, fuori contro Monza e Milan.",
    "rientroPrevisto": "Inizio Ottobre (6ª Giornata)",
    "meseRientro": "Inizio Ott"
  },
  "geubbels": {
    "playerName": "Geubbels",
    "squadra": "Lecce",
    "infortunio": "Distorsione alla caviglia subita il 31 agosto nella sfida contro la Roma.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Inizio Ott"
  },

  // --- MONZA ---
  "ciurria": {
    "playerName": "Ciurria",
    "squadra": "Monza",
    "infortunio": "Noie fisiche muscolari, assente contro il Sassuolo e monitorato dallo staff.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "In dubbio"
  },
  "pessina": {
    "playerName": "Pessina",
    "squadra": "Monza",
    "infortunio": "Lussazione della rotula del ginocchio destro rimediata nella prima metà di agosto in allenamento.",
    "rientroPrevisto": "Inizio Novembre",
    "meseRientro": "Nov"
  },
  "ziolkowski": {
    "playerName": "Ziolkowski",
    "squadra": "Monza",
    "infortunio": "Fascite plantare acuta che impedisce il regolare carico; stop precauzionale.",
    "rientroPrevisto": "Metà Ottobre",
    "meseRientro": "Metà Ott"
  },
  "mangas": {
    "playerName": "Mangas",
    "squadra": "Monza",
    "infortunio": "Problema alla caviglia accusato a Lecce il 13 settembre, verso il recupero.",
    "rientroPrevisto": "Fine Settembre",
    "meseRientro": "Set"
  },

  // --- NAPOLI ---
  "buongiorno": {
    "playerName": "Buongiorno",
    "squadra": "Napoli",
    "infortunio": "Operato a fine luglio per riparazione della radice del menisco del ginocchio destro; decorso regolare.",
    "rientroPrevisto": "Metà Novembre",
    "meseRientro": "Nov"
  },
  "giovane": {
    "playerName": "Giovane",
    "squadra": "Napoli",
    "infortunio": "Operato il 3 settembre a causa di un'ernia inguinale; decorso favorevole.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Ott"
  },
  "santos a": {
    "playerName": "Santos A.",
    "squadra": "Napoli",
    "infortunio": "Lesione muscolare di medio grado al bicipite femorale sinistro accusata in Champions League il 9 settembre.",
    "rientroPrevisto": "Seconda metà di Ottobre",
    "meseRientro": "Metà Ott"
  },
  "spinazzola": {
    "playerName": "Spinazzola",
    "squadra": "Napoli",
    "infortunio": "Lieve contrattura al bicipite femorale della coscia destra; gestione cautelativa verso la 6ª giornata.",
    "rientroPrevisto": "Inizio Ottobre (6ª Giornata)",
    "meseRientro": "Inizio Ott"
  },
  "meret": {
    "playerName": "Meret",
    "squadra": "Napoli",
    "infortunio": "Lesione di basso grado al muscolo adduttore lungo della coscia sinistra accusata contro la Juventus. Stop di circa 3 settimane, rientro dopo la sosta.",
    "rientroPrevisto": "Metà Ottobre (dopo la sosta)",
    "meseRientro": "Metà Ott"
  },
  "marianucci": {
    "playerName": "Marianucci",
    "squadra": "Napoli",
    "infortunio": "Lesione di alto grado del collaterale mediale del ginocchio sinistro subita in amichevole l'8 agosto.",
    "rientroPrevisto": "Metà Ottobre",
    "meseRientro": "Metà Ott"
  },

  // --- ROMA ---
  "saelemaekers": {
    "playerName": "Saelemaekers",
    "squadra": "Roma",
    "infortunio": "Frattura composta del malleolo mediale della caviglia destra subita contro il Genoa. Sottoposto a intervento chirurgico con lungo stop.",
    "rientroPrevisto": "Fine Novembre",
    "meseRientro": "Fine Nov"
  },
  "le fee": {
    "playerName": "Le Fée",
    "squadra": "Roma",
    "infortunio": "Risentimento al legamento collaterale mediale, prosegue il lavoro differenziato sul campo.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Inizio Ott"
  },

  // --- PARMA ---
  "bernabe": {
    "playerName": "Bernabè",
    "squadra": "Parma",
    "infortunio": "Noie fisiche muscolari continue, non convocato a Genova. Monitorato in vista della 6ª giornata.",
    "rientroPrevisto": "Inizio Ottobre (6ª Giornata)",
    "meseRientro": "Inizio Ott"
  },
  "nicolussi caviglia": {
    "playerName": "Nicolussi Caviglia",
    "squadra": "Parma",
    "infortunio": "Operato a fine agosto dopo una lesione muscolare di medio grado alla coscia destra; recupero stimato in autunno inoltrato.",
    "rientroPrevisto": "Novembre",
    "meseRientro": "Nov"
  },

  // --- SASSUOLO ---
  "idzes": {
    "playerName": "Idzes",
    "squadra": "Sassuolo",
    "infortunio": "Lesione di grado moderato al quadricipite della coscia sinistra.",
    "rientroPrevisto": "Seconda metà di Ottobre",
    "meseRientro": "Metà Ott"
  },
  "volpato": {
    "playerName": "Volpato",
    "squadra": "Sassuolo",
    "infortunio": "Lesione di grado moderato al flessore della gamba destra subita il 6 settembre a Bologna.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Ott"
  },
  "kone i": {
    "playerName": "Konè I.",
    "squadra": "Sassuolo",
    "infortunio": "Rottura di tibia e perone rimediata a giugno nei Mondiali col Canada; operato con lungo stop.",
    "rientroPrevisto": "Dicembre",
    "meseRientro": "Dic"
  },
  "pieragnolo": {
    "playerName": "Pieragnolo",
    "squadra": "Sassuolo",
    "infortunio": "Fase riabilitativa post-intervento per lesione al legamento crociato anteriore della gamba destra.",
    "rientroPrevisto": "Ottobre",
    "meseRientro": "Ott"
  },
  "walukiewicz": {
    "playerName": "Walukiewicz",
    "squadra": "Sassuolo",
    "infortunio": "Forte trauma contusivo alla gamba destra con edema muscolare in via di riassorbimento.",
    "rientroPrevisto": "Fine Settembre",
    "meseRientro": "Set"
  },
  "cande": {
    "playerName": "Candè",
    "squadra": "Sassuolo",
    "infortunio": "Fase conclusiva del recupero dopo la rottura del legamento crociato anteriore del ginocchio destro.",
    "rientroPrevisto": "Fine Settembre",
    "meseRientro": "Set"
  },
  "boloca": {
    "playerName": "Boloca",
    "squadra": "Sassuolo",
    "infortunio": "Problema al ginocchio che ne ha impedito la disponibilità nelle prime giornate di campionato.",
    "rientroPrevisto": "Fine Settembre",
    "meseRientro": "Set"
  },

  // --- TORINO ---
  "adams c": {
    "playerName": "Adams C.",
    "squadra": "Torino",
    "infortunio": "Lesione distrattiva di basso grado all'adduttore della coscia sinistra accusata a metà settembre. Lavoro differenziato.",
    "rientroPrevisto": "Prima metà di Ottobre",
    "meseRientro": "Metà Ott"
  },
  "casadei": {
    "playerName": "Casadei",
    "squadra": "Torino",
    "infortunio": "Affaticamento muscolare persistente; condizioni monitorate quotidianamente dallo staff granata.",
    "rientroPrevisto": "In valutazione per la 6ª giornata",
    "meseRientro": "In dubbio"
  },

  // --- UDINESE ---
  "arizala": {
    "playerName": "Arizala",
    "squadra": "Udinese",
    "infortunio": "Lesione muscolare al bicipite femorale rimediata il 6 settembre.",
    "rientroPrevisto": "Prima metà di Ottobre",
    "meseRientro": "Metà Ott"
  },
  "piotrowski": {
    "playerName": "Piotrowski",
    "squadra": "Udinese",
    "infortunio": "Intervento di ablazione cardiaca eseguito per lieve aritmia cardiaca benigna emersa il 7 settembre. Periodo di riposo prescritto.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "solet": {
    "playerName": "Solet",
    "squadra": "Udinese",
    "infortunio": "Lesione al muscolo pettineo della coscia sinistra accusata il 7 settembre contro la Lazio.",
    "rientroPrevisto": "Fine Settembre",
    "meseRientro": "Set"
  },
  "palma": {
    "playerName": "Palma",
    "squadra": "Udinese",
    "infortunio": "Problema muscolare all'adduttore della coscia destra subito al 1° turno contro il Como.",
    "rientroPrevisto": "Fine Settembre",
    "meseRientro": "Set"
  },
  "zanoli": {
    "playerName": "Zanoli",
    "squadra": "Udinese",
    "infortunio": "Fase terminale di recupero dall'intervento per lesione del legamento crociato anteriore del ginocchio destro.",
    "rientroPrevisto": "Fine Settembre",
    "meseRientro": "Set"
  },

  // --- VENEZIA ---
  "busio": {
    "playerName": "Busio",
    "squadra": "Venezia",
    "infortunio": "Distrazione intratendinea del bicipite femorale destro rimediata contro la Fiorentina l'11 settembre.",
    "rientroPrevisto": "Seconda metà di Ottobre",
    "meseRientro": "Metà Ott"
  },
  "dagasso": {
    "playerName": "Dagasso",
    "squadra": "Venezia",
    "infortunio": "Problema fisico accusato dall'11 settembre dopo la partita con la Fiorentina.",
    "rientroPrevisto": "Prima metà di Ottobre",
    "meseRientro": "Metà Ott"
  },
  "adorante": {
    "playerName": "Adorante",
    "squadra": "Venezia",
    "infortunio": "Intervento chirurgico alla schiena effettuato a fine luglio; riabilitazione in corso.",
    "rientroPrevisto": "Metà Ottobre",
    "meseRientro": "Metà Ott"
  },
  "bella-kotchap": {
    "playerName": "Bella-Kotchap",
    "squadra": "Venezia",
    "infortunio": "Risentimento muscolare mio-fasciale all'adduttore della gamba destra accusato il 6 settembre a Frosinone.",
    "rientroPrevisto": "Inizio Ottobre",
    "meseRientro": "Ott"
  },
  "sverko": {
    "playerName": "Sverko",
    "squadra": "Venezia",
    "infortunio": "Operato in estate per risolvere un problema cronico all'anca; in fase di completamento dell'iter riabilitativo.",
    "rientroPrevisto": "Fine Ottobre",
    "meseRientro": "Fine Ott"
  },
  "franjic": {
    "playerName": "Franjic",
    "squadra": "Venezia",
    "infortunio": "Intervento chirurgico alla spalla dopo infortunio subito contro il Milan a fine agosto. Lungo stop.",
    "rientroPrevisto": "Metà Dicembre",
    "meseRientro": "Dic"
  },
  "basic": {
    "playerName": "Basic",
    "squadra": "Venezia",
    "infortunio": "Noie fisiche continue, monitorato quotidianamente verso la 6ª giornata.",
    "rientroPrevisto": "In valutazione per la 6ª giornata",
    "meseRientro": "In dubbio"
  }
};

export const SUSPENSION_DATABASE: Record<string, { playerName: string; squadra: string; reason: string }> = {
  "guilbert": {
    "playerName": "Guilbert",
    "squadra": "Lecce",
    "reason": "Squalificato per 1 turno dal Giudice Sportivo per espulsione diretta"
  },
  "dawidowicz": {
    "playerName": "Dawidowicz",
    "squadra": "Hellas Verona",
    "reason": "Squalificato per 2 turni dal Giudice Sportivo"
  }
};

export function getInjuryInfo(nome: string): InjuryInfo | null {
  if (!nome) return null;
  const clean = (s: string) => s.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const normalized = clean(nome);
  if (INJURY_DATABASE[normalized]) {
    return INJURY_DATABASE[normalized];
  }

  const normTokens = normalized.split(" ").filter(Boolean);
  if (normTokens.length === 0) return null;

  for (const [key, info] of Object.entries(INJURY_DATABASE)) {
    const cleanKey = clean(key);
    if (cleanKey === normalized) return info;

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
        return info;
      }
    } else {
      const singleKey = keyTokens[0];
      if (normTokens.includes(singleKey)) {
        // Prevent false positives for players with same surname but specific other player having initial
        // e.g., 'pessina mas' should not match 'pessina' (Matteo Pessina)
        if (singleKey === 'pessina' && normTokens.includes('mas')) {
          return null;
        }
        // 'adams a' should not match 'adams' if 'adams c' is the injured one
        if (singleKey === 'adams' && normTokens.includes('a')) {
          return null;
        }
        // 'thuram' should not match if it's Marcus Thuram and only K. Thuram is injured
        if (singleKey === 'thuram' && !normTokens.includes('k')) {
          return null;
        }
        return info;
      }
    }
  }

  return null;
}
