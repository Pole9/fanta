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

// Database Infortuni UFFICIALI e VERIFICATI (Fonte: Fantacalcio.it /infortunati-serie-a)
// Include ESCLUSIVAMENTE calciatori presenti nell'infermeria ufficiale di Fantacalcio.it aggiornata all'8-9 Ottobre 2026.
export const INJURY_DATABASE: Record<string, InjuryInfo> = {
  "kossounou": {
    "playerName": "Kossounou",
    "infortunio": "Il difensore frenato da una lesione muscolare di medio-alto grado del bicipite femorale della coscia sinistra alla vigilia della sfida di campionato contro la Juventus (del 20 settembre). Lungo stop, rientro dalla seconda metà di novembre.",
    "rientroPrevisto": "rientro dalla seconda metà di novembre.",
    "meseRientro": "Nov"
  },
  "sulemanak": {
    "playerName": "Sulemana K.",
    "infortunio": "L'attaccante KO in amichevole l'8 agosto vittima di una lesione del collaterale mediale di secondo grado del ginocchio sinistro. Recuperabile da inizio ottobre, ma da valutare nei prossimi allenamenti le possibilità di convocazione già nel prossimo turno contro il Venezia.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "raspadori": {
    "playerName": "Raspadori",
    "infortunio": "L'attaccante frenato a fine settembre in Nazionale azzurra da una distrazione di basso grado al bicipite femorale, rientro tra i convocati con la Dea in campionato dalla seconda metà di ottobre.",
    "rientroPrevisto": "rientro tra i convocati con la Dea in campionato dalla secon",
    "meseRientro": "Ott"
  },
  "pompei": {
    "playerName": "Pompei",
    "infortunio": "Il portiere fermo da inizio ottobre per la frattura della falange della mano destra, out nel prossimo turno di campionato. Tempi di recupero da valutare.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "hien": {
    "playerName": "Hien",
    "infortunio": "il difensore operato a fine giugno per una lesione del tendine prossimale del muscolo semimembranoso della coscia sinistra, in recupero e pronto a tornare in campo dalla metà di novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "holm": {
    "playerName": "Holm",
    "infortunio": "Lo svedese KO in Nazionale il 26 settembre vittima di un problema al tendine della coscia destra. Ha deciso di operarsi e affronterà un lungo stop. Ipotesi di rientro in campo da fine febbraio.",
    "rientroPrevisto": "rientro in campo da fine febbraio.",
    "meseRientro": "Feb"
  },
  "odgaard": {
    "playerName": "Odgaard",
    "infortunio": "Il calciatore frenato dopo il match col Toro da una lesione ai flessori della coscia destra, recuperabile dalla seconda metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "mbangula": {
    "playerName": "Mbangula",
    "infortunio": "L'ala offensiva dei rossoblù non al meglio per noie fisiche e non convocato domenica a Lecce. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "idrissir": {
    "playerName": "Idrissi R.",
    "infortunio": "il calciatore in ripresa dalla rottura del legamento crociato, può tornare arruolabile dalla fine di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "felici": {
    "playerName": "Felici",
    "infortunio": "il centrocampista KO il 7 settembre contro il Lecce in casa vittima della rottura del legamento crociato anteriore. Verrà operato e costretto a un lungo stop (ipotizziamo un rientro da marzo).",
    "rientroPrevisto": "rientro da marzo).",
    "meseRientro": "Mar"
  },
  "trepy": {
    "playerName": "Trepy",
    "infortunio": "Il calciatore ricoverato il 16 agosto dopo che avrebbe rischiato di annegare in piscina. Dimesso poi il 28 agosto, ora condizioni monitorate da parte dello staff medico rossoblù. Da metà settembre ha avuto l'ok per riprendere l'attività agonistica, potrebbe ora tornare convocabile dalla fine di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "kean": {
    "playerName": "Kean",
    "infortunio": "l'attaccante non ha recuperato dal fastidio alla tibia e salterà la sfida di domenica contro la Roma. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "parisi": {
    "playerName": "Parisi",
    "infortunio": "il cursore di fascia della Viola sta svolgendo l'iter di recupero dall'infortunio al legamento crociato al ginocchio, punta a tornare convocabile da dicembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Dic"
  },
  "atta": {
    "playerName": "Atta",
    "infortunio": "il centrocampista non al meglio per un sovraccarico funzionale dell'addome, assente sabato a Genova. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "grillitsch": {
    "playerName": "Grillitsch",
    "infortunio": "il centrocampista non convocato dalla gara di Genova (12 settembre) a causa di una sindrome retto-adduttoria, ha poi deciso di operarsi. Stop di circa sei settimane, può tornare convocabile da inizio novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "birligea": {
    "playerName": "Birligea",
    "infortunio": "L'attaccante sta recuperando da una lesione muscolare al quadricipite sinistro, tentativo di rientro dalla fine di ottobre.",
    "rientroPrevisto": "rientro dalla fine di ottobre.",
    "meseRientro": "Ott"
  },
  "havel": {
    "playerName": "Havel",
    "infortunio": "L'attaccante ha deciso di operarsi alla caviglia e dovrebbe tornare arruolabile dalla metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "sow": {
    "playerName": "Sow",
    "infortunio": "Il centrocampista svizzero il 6 ottobre in Nazionale vittima di una distrazione muscolare al bicipite femorale della coscia sinistra, rientro in campo da inizio novembre.",
    "rientroPrevisto": "rientro in campo da inizio novembre.",
    "meseRientro": "Nov"
  },
  "colombo": {
    "playerName": "Colombo",
    "infortunio": "L'attaccante non al meglio per un problema alla caviglia rimediato venerdì scorso in amichevole e darà forfait nel prossimo turno di campionato contro la Fiorentina. Ipotesi di rientro da fine ottobre.",
    "rientroPrevisto": "rientro da fine ottobre.",
    "meseRientro": "Ott"
  },
  "meichtry": {
    "playerName": "Meichtry",
    "infortunio": "Il calciatore ai box per una distrazione della muscolatura di un'anca, il cui grado rimane da valutare con ulteriori accertamenti medici. Di certo out nel prossimo turno di campionato contro la Fiorentina.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "amorim": {
    "playerName": "Amorim",
    "infortunio": "Il centrocampista non ha recuperato da un problema fisico e non è stato convocato per la gara contro la Fiorentina. Da valutare in vista della 7a giornata di campionato.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "venturino": {
    "playerName": "Venturino",
    "infortunio": "il calciatore operato al tendine rotuleo e ora in fase di recupero. Di certo assente nel prossimo turno di campionato, ipotesi di rientro da fine ottobre.",
    "rientroPrevisto": "rientro da fine ottobre.",
    "meseRientro": "Ott"
  },
  "stones": {
    "playerName": "Stones",
    "infortunio": "il difensore alle prese con un risentimento ai flessori della coscia sinistra, recuperabile dalla prima metà di ottobre. Tuttavia, da valutare la sua convocazione contro il Parma nella 6a di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "jonesc": {
    "playerName": "Jones C.",
    "infortunio": "Il centrocampista fermato da un risentimento miofasciale agli adduttori della coscia destra, tentativo rientro tra i convocati dalla fine di ottobre.",
    "rientroPrevisto": "rientro tra i convocati dalla fine di ottobre.",
    "meseRientro": "Ott"
  },
  "locatelli": {
    "playerName": "Locatelli",
    "infortunio": "il metronomo del centrocampo bianconero ha rimediato la rottura del menisco esterno del ginocchio. Verrà operato a Lione a stretto giro. Lungo stop e possibilità di rivederlo in campo da febbraio.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Feb"
  },
  "thuramk": {
    "playerName": "Thuram K.",
    "infortunio": "il centrocampista condizionato da una sindrome femoro-rotulea e, dopo un consulto medico a fine agosto, è stato sottoposto il 3 settembre a operazione chirurgica. Lungo stop, ipotizziamo un rientro da gennaio.",
    "rientroPrevisto": "rientro da gennaio.",
    "meseRientro": "Gen"
  },
  "boga": {
    "playerName": "Boga",
    "infortunio": "l'ala offensiva dei bianconeri fermo dopo il match contro il Milan (6 settembre) per una lesione di medio grado del bicipite femorale, ipotizziamo un possibile rientro dalla metà di novembre.",
    "rientroPrevisto": "rientro dalla metà di novembre.",
    "meseRientro": "Nov"
  },
  "ekhator": {
    "playerName": "Ekhator",
    "infortunio": "l'attaccante vittima di una lesione di medio grado del muscolo semitendinoso, rientro dalla metà di novembre.",
    "rientroPrevisto": "rientro dalla metà di novembre.",
    "meseRientro": "Nov"
  },
  "yildiz": {
    "playerName": "Yildiz",
    "infortunio": "l'attaccante turco, dopo la gara di Frosinone (23 agosto), ha lamentato un problema al piede. Operato il 31 agosto di osteosintesi della frattura della base del V metatarso del piede sinistro, stop di circa tre mesi. Rientro in campo da inizio dicembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Dic"
  },
  "grabara": {
    "playerName": "Grabara",
    "infortunio": "Il portiere out dal 20 settembre per una lesione al crociato anteriore del ginocchio destro. Operazione chirurgica e lungo stop, rientro da aprile.",
    "rientroPrevisto": "rientro da aprile.",
    "meseRientro": "Apr"
  },
  "marusic": {
    "playerName": "Marusic",
    "infortunio": "il terzino dei biancocelesti KO il 24 agosto a Bologna vittima di una lesione muscolare alla coscia. Recuperabile dalla metà di ottobre, da valutare convocazione nella 7a di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "rovella": {
    "playerName": "Rovella",
    "infortunio": "il regista dei biancocelesti KO il 30 agosto contro il Genoa vittima di una lesione muscolare al polpaccio, ai box fino alla metà di ottobre. Da valutare convocazione nella 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "cancellieri": {
    "playerName": "Cancellieri",
    "infortunio": "l'ala offensiva dei biancocelesti non al meglio per noie fisiche, out domenica contro il Monza. Recuperabile per la 7a giornata di campionato.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "gudmundssona": {
    "playerName": "Gudmundsson A.",
    "infortunio": "L'islandese in Nazionale il 26 settembre vittima di un problema alla spalla destra dopo una caduta fortuita in partita. Condizioni da monitorare, si confida di riaverlo a disposizione dalla fine metà di ottobre/inizio di novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "berisham": {
    "playerName": "Berisha M.",
    "infortunio": "Il centrocampista ha lamentato un sovraccarico muscolare alla gamba e non ha preso parte alle sfide contro Monza e Milan, out anche domenica contro il Bologna. Recuperabile da fine ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "stulic": {
    "playerName": "Stulic",
    "infortunio": "lavoro a parte in settimana per l'attaccante a causa del riacutizzarsi di un fastidio muscolare alla gamba. Non ci sarà domenica contro il Bologna, condizioni da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "saelemaekers": {
    "playerName": "Saelemaekers",
    "infortunio": "Il belga fermo da inizio ottobre per un problema alla caviglia, concreta ora la possibilità di operarsi. Saranno poi da stabilire i tempi di recupero, ma lo stop sarà lungo e lo rivedremo in campo nel 2027 inoltrato.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "ciurria": {
    "playerName": "Ciurria",
    "infortunio": "il centrocampista non al meglio per noie fisiche, forfait anche nel prossimo turno contro la Lazio. Da valutare.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "pessina": {
    "playerName": "Pessina",
    "infortunio": "Il centrocampista costretto a saltare l'inizio di campionato per una lussazione della rotula del ginocchio destro rimediata nella prima metà di agosto in allenamento. Tempi di recupero da monitorare, ma proverà a tornare arruolabile dall'inizio di novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "ziolkowski": {
    "playerName": "Ziolkowski",
    "infortunio": "Il difensore condizionato da una fastidiosa fascite plantare, di certo assente nel prossimo turno di campionato. Tempi di recupero da valutare.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "vergara": {
    "playerName": "Vergara",
    "infortunio": "Il centrocampista sostituito il 5 ottobre con la Nazionale italiana a causa di una lesione distrattiva al polpaccio destro. Recuperabile da inizio novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "favasuli": {
    "playerName": "Favasuli",
    "infortunio": "Il cursore di fascia degli azzurri ai box da inizio ottobre per una lesione muscolare di secondo grado del retto femorale della coscia destra. Recuperabile dalla metà di novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "santosa": {
    "playerName": "Santos A.",
    "infortunio": "Il brasiliano costretto al cambio il 9 settembre in Champions League vittima di una lesione muscolare di medio grado al bicipite femorale sinistro. Proverà a tornare arruolabile dalla seconda metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "olivera": {
    "playerName": "Olivera",
    "infortunio": "L'uruguaiano a inizio ottobre in Nazionale ha rimediato un problema muscolare alla gamba destra e salterà l'impegno di campionato contro il Frosinone. Recuperabile dalla metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "buongiorno": {
    "playerName": "Buongiorno",
    "infortunio": "il difensore operato nella seconda metà di luglio al menisco del ginocchio destro. Sta recuperando lentamente, ipotizziamo possa tornare arruolabile da fine dicembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Dic"
  },
  "zamboanguissa": {
    "playerName": "Zambo Anguissa",
    "infortunio": "il centrocampista subentrato a gara in corso il 20 settembre a Firenze, ma ha lamentato una lesione miofasciale di basso grado dell'adduttore lungo e rimane da valutare nei prossimi allenamenti in vista della gara contro il Frosinone alla ripresa del campionato.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "ndiaye": {
    "playerName": "Ndiaye",
    "infortunio": "Il difensore colpito duro in allenamento nei giorni scorsi, forfait per sabato contro l'Inter. Condizioni da valutare in vista della 7a giornata di campionato.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "nicolussicaviglia": {
    "playerName": "Nicolussi Caviglia",
    "infortunio": "il centrocampista alle prese dalla seconda metà di luglio con una lesione di medio grado alla coscia destra, ma a fine agosto ha deciso, assieme allo staff medico ducale, di operarsi. Lungo stop e ipotesi di ritorno in campo da dicembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Dic"
  },
  "almqvist": {
    "playerName": "Almqvist",
    "infortunio": "L'ala offensiva dei ducali KO dal 6 ottobre per una lesione muscolare al polpaccio sinistro, recuperabile dalla fine di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "svilar": {
    "playerName": "Svilar",
    "infortunio": "Il portiere condizionato da una frattura a un dito del piede e fuori dal match contro il Como. Ipotesi di rientro a disposizione dalla metà di novembre.",
    "rientroPrevisto": "rientro a disposizione dalla metà di novembre.",
    "meseRientro": "Nov"
  },
  "koulierakis": {
    "playerName": "Koulierakis",
    "infortunio": "il difensore non al meglio per una contusione alla gamba, out domenica a Como. Da valutare rientro già nella 7a giornata di A.",
    "rientroPrevisto": "rientro già nella 7a giornata di A.",
    "meseRientro": "Ott"
  },
  "cristante": {
    "playerName": "Cristante",
    "infortunio": "Il mediano giallorosso condizionato da un'infiammazione al ginocchio e darà forfait domenica contro il Como nel prossimo turno di campionato. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "boloca": {
    "playerName": "Boloca",
    "infortunio": "il centrocampista fuori causa per un problema al ginocchio e fuori causa in questo inizio di campionato. Da valutare rientro da fine ottobre.",
    "rientroPrevisto": "rientro da fine ottobre.",
    "meseRientro": "Ott"
  },
  "volpato": {
    "playerName": "Volpato",
    "infortunio": "l'esterno offensivo dei neroverdi KO il 6 settembre a Bologna vittima di una lesione di grado moderato al flessore della gamba destra. Recuperabile dalla seconda metà di ottobre, ma da valutare nei prossimi allenamenti le possibilità di convocazione già nel prossimo turno contro il Milan.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "koni": {
    "playerName": "Konè I.",
    "infortunio": "il centrocampista canadese vittima a giugno nella gara dei Mondiali di una rottura di tibia e perone. Operato, punta a tornare in campo da dicembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Dic"
  },
  "pieragnolo": {
    "playerName": "Pieragnolo",
    "infortunio": "il difensore sta proseguendo la fase di recupero dalla lesione legamento crociato anteriore gamba destra e ipotizziamo possa tornare convocabile da fine ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "cand": {
    "playerName": "Candè",
    "infortunio": "il difensore a gennaio vittima della rottura legamento crociato anteriore ginocchio destro, punta a tornare convocabile dalla fine di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Gen"
  },
  "walukiewicz": {
    "playerName": "Walukiewicz",
    "infortunio": "Il difensore alle prese con un forte trauma contusivo alla gamba destra, da valutare il rientro dalla seconda metà di ottobre.",
    "rientroPrevisto": "rientro dalla seconda metà di ottobre.",
    "meseRientro": "Ott"
  },
  "idzes": {
    "playerName": "Idzes",
    "infortunio": "Il difensore ai box per una lesione di grado moderato al quadricipite della gamba sinistra, proverà a tornerà arruolabile dalla seconda metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "fortini": {
    "playerName": "Fortini",
    "infortunio": "Il cursore di fascia dei granata rientrato in anticipo dagli impegni con l'U21 azzurra a causa di un affaticamento muscolare all'adduttore che mette a forte rischio la sua presenza contro l'Udinese alla ripresa del campionato. Da valutare nella rifinitura.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "piotrowski": {
    "playerName": "Piotrowski",
    "infortunio": "Il centrocampista ha ravvisato il 7 settembre contro la Lazio una lieve aritmia cardiaca benigna e si sottoporrà nei prossimi giorni ad un intervento di ablazione cardiaca. Osservato un periodo di riposo, potrà tornare alla regolare attività agonistica (ipotizziamo dalla seconda metà di ottobre).",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "zaniolo": {
    "playerName": "Zaniolo",
    "infortunio": "Il calciatore alle prese con una lesione muscolare al bicipite femorale destro, rientro previsto dalla seconda metà di ottobre.",
    "rientroPrevisto": "rientro previsto dalla seconda metà di ottobre.",
    "meseRientro": "Ott"
  },
  "gueye": {
    "playerName": "Gueye",
    "infortunio": "L'attaccante vittima di un problema alla caviglia a fine settembre. Ha deciso di operarsi, lungo stop di circa tre mesi e possibile ritorno in campo da fine gennaio.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Gen"
  },
  "adorante": {
    "playerName": "Adorante",
    "infortunio": "l'attaccante a fine luglio ha deciso di operarsi per un problema alla schiena, che lo costringerà a stare ai box per buona parte del girone d'andata del campionato. Tentativo di rientro da metà ottobre.",
    "rientroPrevisto": "rientro da metà ottobre.",
    "meseRientro": "Ott"
  },
  "busio": {
    "playerName": "Busio",
    "infortunio": "il regista dei veneti KO l'11 settembre contro la Fiorentina vittima di una distrazione intratendinea del bicipite femorale destro. Rientro dalla seconda metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "franjic": {
    "playerName": "Franjic",
    "infortunio": "il difensore costretto al cambio a Milano contro i rossoneri a fine agosto per un guaio alla spalla che ha richiesto l'intervento chirurgico. Lungo stop e rientro dalla metà di dicembre.",
    "rientroPrevisto": "rientro dalla metà di dicembre.",
    "meseRientro": "Dic"
  },
  "sverko": {
    "playerName": "Sverko",
    "infortunio": "il difensore operato in estate per il perdurare di un problema all'anca e recuperabile da fine ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  }
};

// Funzione di lookup per infortunati ufficiali
export function getInjuryInfo(name: string): InjuryInfo | null {
  if (!name) return null;
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (INJURY_DATABASE[clean]) return INJURY_DATABASE[clean];

  for (const [k, v] of Object.entries(INJURY_DATABASE)) {
    if (k.length >= 4 && clean.includes(k)) return v;
    if (clean.length >= 4 && k.includes(clean)) return v;
  }
  return null;
}

export const getPlayerInjury = getInjuryInfo;
