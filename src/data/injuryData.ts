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
// Include ESCLUSIVAMENTE calciatori presenti nell'infermeria ufficiale di Fantacalcio.it.
export const INJURY_DATABASE: Record<string, InjuryInfo> = {
  "bremer": {
    "playerName": "Bremer",
    "squadra": "Juventus",
    "infortunio": "Rottura del legamento crociato anteriore e menisco del ginocchio sinistro, operato.",
    "rientroPrevisto": "Stagione Finita (Maggio 2027)",
    "meseRientro": "Mag"
  },
  "zapata": {
    "playerName": "Zapata",
    "squadra": "Torino",
    "infortunio": "Lesione del legamento crociato anteriore, menisco mediale e legamento collaterale laterale.",
    "rientroPrevisto": "Stagione Finita (Giugno 2027)",
    "meseRientro": "Giu"
  },
  "malinovskyi": {
    "playerName": "Malinovskyi",
    "squadra": "Genoa",
    "infortunio": "Grave infortunio alla caviglia destra con frattura del perone, operato.",
    "rientroPrevisto": "Stagione Finita (Maggio 2027)",
    "meseRientro": "Mag"
  },
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
    "infortunio": "Rottura del legamento crociato anteriore del ginocchio sinistro, in riabilitazione.",
    "rientroPrevisto": "Gennaio 2027",
    "meseRientro": "Gen"
  },
  "schuurs": {
    "playerName": "Schuurs",
    "squadra": "Torino",
    "infortunio": "Iter riabilitativo post-operatorio al ginocchio sinistro.",
    "rientroPrevisto": "Dicembre",
    "meseRientro": "Dic"
  },
  "milik": {
    "playerName": "Milik",
    "squadra": "Juventus",
    "infortunio": "Intervento di sutura artroscopica del residuo meniscale mediale del ginocchio sinistro.",
    "rientroPrevisto": "Dicembre",
    "meseRientro": "Dic"
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
  "cruz": {
    "playerName": "Cruz",
    "squadra": "Verona",
    "infortunio": "Rottura del tendine del retto femorale destro, intervento chirurgico.",
    "rientroPrevisto": "Gennaio 2027",
    "meseRientro": "Gen"
  },
  "kossounou": {
    "playerName": "Kossounou",
    "squadra": "Atalanta",
    "infortunio": "Il difensore frenato da una lesione muscolare di medio-alto grado del bicipite femorale della coscia sinistra alla vigilia della sfida di campionato contro la Juventus (del 20 settembre). Lungo stop, rientro dalla seconda metà di novembre.",
    "rientroPrevisto": "dalla seconda metà di novembre",
    "meseRientro": "Nov"
  },
  "sulemana k": {
    "playerName": "Sulemana K.",
    "squadra": "Atalanta",
    "infortunio": "L'attaccante KO in amichevole l'8 agosto vittima di una lesione del collaterale mediale di secondo grado del ginocchio sinistro. Recuperabile da inizio ottobre, ma da valutare nei prossimi allenamenti le possibilità di convocazione già nel prossimo turno contro il Venezia.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "raspadori": {
    "playerName": "Raspadori",
    "squadra": "Atalanta",
    "infortunio": "L'attaccante frenato a fine settembre in Nazionale azzurra da una distrazione di basso grado al bicipite femorale, rientro tra i convocati con la Dea in campionato dalla seconda metà di ottobre.",
    "rientroPrevisto": "tra i convocati con la Dea in campionato dalla seconda metà di ottobre",
    "meseRientro": "Ott"
  },
  "pompei": {
    "playerName": "Pompei",
    "squadra": "Atalanta",
    "infortunio": "Il portiere fermo da inizio ottobre per la frattura della falange della mano destra, out nel prossimo turno di campionato. Tempi di recupero da valutare.",
    "rientroPrevisto": "Out nel prossimo turno di campionato",
    "meseRientro": "Ott"
  },
  "hien": {
    "playerName": "Hien",
    "squadra": "Atalanta",
    "infortunio": "il difensore operato a fine giugno per una lesione del tendine prossimale del muscolo semimembranoso della coscia sinistra, in recupero e pronto a tornare in campo dalla metà di novembre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Nov"
  },
  "holm": {
    "playerName": "Holm",
    "squadra": "Bologna",
    "infortunio": "Lo svedese KO in Nazionale il 26 settembre vittima di un problema al tendine della coscia destra. Ha deciso di operarsi e affronterà un lungo stop. Ipotesi di rientro in campo da fine febbraio.",
    "rientroPrevisto": "in campo da fine febbraio",
    "meseRientro": "Feb"
  },
  "odgaard": {
    "playerName": "Odgaard",
    "squadra": "Bologna",
    "infortunio": "Il calciatore frenato dopo il match col Toro da una lesione ai flessori della coscia destra, recuperabile dalla seconda metà di ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "mbangula": {
    "playerName": "Mbangula",
    "squadra": "Bologna",
    "infortunio": "L'ala offensiva dei rossoblù non al meglio per noie fisiche e non convocato domenica a Lecce. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "idrissi r": {
    "playerName": "Idrissi R.",
    "squadra": "Cagliari",
    "infortunio": "il calciatore in ripresa dalla rottura del legamento crociato, può tornare arruolabile dalla fine di ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "felici": {
    "playerName": "Felici",
    "squadra": "Cagliari",
    "infortunio": "il centrocampista KO il 7 settembre contro il Lecce in casa vittima della rottura del legamento crociato anteriore. Verrà operato e costretto a un lungo stop (ipotizziamo un rientro da marzo).",
    "rientroPrevisto": "da marzo)",
    "meseRientro": "Mar"
  },
  "trepy": {
    "playerName": "Trepy",
    "squadra": "Cagliari",
    "infortunio": "Il calciatore ricoverato il 16 agosto dopo che avrebbe rischiato di annegare in piscina. Dimesso poi il 28 agosto, ora condizioni monitorate da parte dello staff medico rossoblù. Da metà settembre ha avuto l'ok per riprendere l'attività agonistica, potrebbe ora tornare convocabile dalla fine di ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "kean": {
    "playerName": "Kean",
    "squadra": "Como",
    "infortunio": "l'attaccante non ha recuperato dal fastidio alla tibia e salterà la sfida di domenica contro la Roma. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "parisi": {
    "playerName": "Parisi",
    "squadra": "Fiorentina",
    "infortunio": "il cursore di fascia della Viola sta svolgendo l'iter di recupero dall'infortunio al legamento crociato al ginocchio, punta a tornare convocabile da dicembre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Dic"
  },
  "atta": {
    "playerName": "Atta",
    "squadra": "Fiorentina",
    "infortunio": "il centrocampista non al meglio per un sovraccarico funzionale dell'addome, assente sabato a Genova. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "grillitsch": {
    "playerName": "Grillitsch",
    "squadra": "Frosinone",
    "infortunio": "il centrocampista non convocato dalla gara di Genova (12 settembre) a causa di una sindrome retto-adduttoria, ha poi deciso di operarsi. Stop di circa sei settimane, può tornare convocabile da inizio novembre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Nov"
  },
  "birligea": {
    "playerName": "Birligea",
    "squadra": "Frosinone",
    "infortunio": "L'attaccante sta recuperando da una lesione muscolare al quadricipite sinistro, tentativo di rientro dalla fine di ottobre.",
    "rientroPrevisto": "dalla fine di ottobre",
    "meseRientro": "Ott"
  },
  "havel": {
    "playerName": "Havel",
    "squadra": "Genoa",
    "infortunio": "L'attaccante ha deciso di operarsi alla caviglia e dovrebbe tornare arruolabile dalla metà di ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "sow": {
    "playerName": "Sow",
    "squadra": "Genoa",
    "infortunio": "Il centrocampista svizzero il 6 ottobre in Nazionale vittima di una distrazione muscolare al bicipite femorale della coscia sinistra, rientro in campo da inizio novembre.",
    "rientroPrevisto": "in campo da inizio novembre",
    "meseRientro": "Nov"
  },
  "colombo": {
    "playerName": "Colombo",
    "squadra": "Genoa",
    "infortunio": "L'attaccante non al meglio per un problema alla caviglia rimediato venerdì scorso in amichevole e darà forfait nel prossimo turno di campionato contro la Fiorentina. Ipotesi di rientro da fine ottobre.",
    "rientroPrevisto": "da fine ottobre",
    "meseRientro": "Ott"
  },
  "meichtry": {
    "playerName": "Meichtry",
    "squadra": "Genoa",
    "infortunio": "Il calciatore ai box per una distrazione della muscolatura di un'anca, il cui grado rimane da valutare con ulteriori accertamenti medici. Di certo out nel prossimo turno di campionato contro la Fiorentina.",
    "rientroPrevisto": "Out nel prossimo turno di campionato contro la Fiorentina",
    "meseRientro": "Ott"
  },
  "amorim": {
    "playerName": "Amorim",
    "squadra": "Genoa",
    "infortunio": "Il centrocampista non ha recuperato da un problema fisico e non è stato convocato per la gara contro la Fiorentina. Da valutare in vista della 7a giornata di campionato.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "venturino": {
    "playerName": "Venturino",
    "squadra": "Genoa",
    "infortunio": "il calciatore operato al tendine rotuleo e ora in fase di recupero. Di certo assente nel prossimo turno di campionato, ipotesi di rientro da fine ottobre.",
    "rientroPrevisto": "da fine ottobre",
    "meseRientro": "Ott"
  },
  "stones": {
    "playerName": "Stones",
    "squadra": "Inter",
    "infortunio": "il difensore alle prese con un risentimento ai flessori della coscia sinistra, recuperabile dalla prima metà di ottobre. Tuttavia, da valutare la sua convocazione contro il Parma nella 6a di A.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "jones c": {
    "playerName": "Jones C.",
    "squadra": "Inter",
    "infortunio": "Il centrocampista fermato da un risentimento miofasciale agli adduttori della coscia destra, tentativo rientro tra i convocati dalla fine di ottobre.",
    "rientroPrevisto": "tra i convocati dalla fine di ottobre",
    "meseRientro": "Ott"
  },
  "locatelli": {
    "playerName": "Locatelli",
    "squadra": "Juventus",
    "infortunio": "il metronomo del centrocampo bianconero ha rimediato la rottura del menisco esterno del ginocchio. Verrà operato a Lione a stretto giro. Lungo stop e possibilità di rivederlo in campo da febbraio.",
    "rientroPrevisto": "Lungo stop",
    "meseRientro": "Feb"
  },
  "thuram k": {
    "playerName": "Thuram K.",
    "squadra": "Juventus",
    "infortunio": "il centrocampista condizionato da una sindrome femoro-rotulea e, dopo un consulto medico a fine agosto, è stato sottoposto il 3 settembre a operazione chirurgica. Lungo stop, ipotizziamo un rientro da gennaio.",
    "rientroPrevisto": "da gennaio",
    "meseRientro": "Gen"
  },
  "boga": {
    "playerName": "Boga",
    "squadra": "Juventus",
    "infortunio": "l'ala offensiva dei bianconeri fermo dopo il match contro il Milan (6 settembre) per una lesione di medio grado del bicipite femorale, ipotizziamo un possibile rientro dalla metà di novembre.",
    "rientroPrevisto": "dalla metà di novembre",
    "meseRientro": "Nov"
  },
  "ekhator": {
    "playerName": "Ekhator",
    "squadra": "Juventus",
    "infortunio": "l'attaccante vittima di una lesione di medio grado del muscolo semitendinoso, rientro dalla metà di novembre.",
    "rientroPrevisto": "dalla metà di novembre",
    "meseRientro": "Nov"
  },
  "yildiz": {
    "playerName": "Yildiz",
    "squadra": "Juventus",
    "infortunio": "l'attaccante turco, dopo la gara di Frosinone (23 agosto), ha lamentato un problema al piede. Operato il 31 agosto di osteosintesi della frattura della base del V metatarso del piede sinistro, stop di circa tre mesi. Rientro in campo da inizio dicembre.",
    "rientroPrevisto": "in campo da inizio dicembre",
    "meseRientro": "Dic"
  },
  "grabara": {
    "playerName": "Grabara",
    "squadra": "Juventus",
    "infortunio": "Il portiere out dal 20 settembre per una lesione al crociato anteriore del ginocchio destro. Operazione chirurgica e lungo stop, rientro da aprile.",
    "rientroPrevisto": "da aprile",
    "meseRientro": "Apr"
  },
  "marusic": {
    "playerName": "Marusic",
    "squadra": "Lazio",
    "infortunio": "il terzino dei biancocelesti KO il 24 agosto a Bologna vittima di una lesione muscolare alla coscia. Recuperabile dalla metà di ottobre, da valutare convocazione nella 7a di A.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "rovella": {
    "playerName": "Rovella",
    "squadra": "Lazio",
    "infortunio": "il regista dei biancocelesti KO il 30 agosto contro il Genoa vittima di una lesione muscolare al polpaccio, ai box fino alla metà di ottobre. Da valutare convocazione nella 7a giornata di A.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "cancellieri": {
    "playerName": "Cancellieri",
    "squadra": "Lazio",
    "infortunio": "l'ala offensiva dei biancocelesti non al meglio per noie fisiche, out domenica contro il Monza. Recuperabile per la 7a giornata di campionato.",
    "rientroPrevisto": "Out domenica contro il Monza",
    "meseRientro": "Ott"
  },
  "gudmundsson a": {
    "playerName": "Gudmundsson A.",
    "squadra": "Lazio",
    "infortunio": "L'islandese in Nazionale il 26 settembre vittima di un problema alla spalla destra dopo una caduta fortuita in partita. Condizioni da monitorare, si confida di riaverlo a disposizione dalla fine metà di ottobre/inizio di novembre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Nov"
  },
  "berisha m": {
    "playerName": "Berisha M.",
    "squadra": "Lecce",
    "infortunio": "Il centrocampista ha lamentato un sovraccarico muscolare alla gamba e non ha preso parte alle sfide contro Monza e Milan, out anche domenica contro il Bologna. Recuperabile da fine ottobre.",
    "rientroPrevisto": "Out anche domenica contro il Bologna",
    "meseRientro": "Ott"
  },
  "stulic": {
    "playerName": "Stulic",
    "squadra": "Lecce",
    "infortunio": "lavoro a parte in settimana per l'attaccante a causa del riacutizzarsi di un fastidio muscolare alla gamba. Non ci sarà domenica contro il Bologna, condizioni da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "saelemaekers": {
    "playerName": "Saelemaekers",
    "squadra": "Milan",
    "infortunio": "Il belga fermo da inizio ottobre per un problema alla caviglia, concreta ora la possibilità di operarsi. Saranno poi da stabilire i tempi di recupero, ma lo stop sarà lungo e lo rivedremo in campo nel 2027 inoltrato.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "ciurria": {
    "playerName": "Ciurria",
    "squadra": "Monza",
    "infortunio": "il centrocampista non al meglio per noie fisiche, forfait anche nel prossimo turno contro la Lazio. Da valutare.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "pessina": {
    "playerName": "Pessina",
    "squadra": "Monza",
    "infortunio": "Il centrocampista costretto a saltare l'inizio di campionato per una lussazione della rotula del ginocchio destro rimediata nella prima metà di agosto in allenamento. Tempi di recupero da monitorare, ma proverà a tornare arruolabile dall'inizio di novembre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Nov"
  },
  "ziolkowski": {
    "playerName": "Ziolkowski",
    "squadra": "Monza",
    "infortunio": "Il difensore condizionato da una fastidiosa fascite plantare, di certo assente nel prossimo turno di campionato. Tempi di recupero da valutare.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "vergara": {
    "playerName": "Vergara",
    "squadra": "Napoli",
    "infortunio": "Il centrocampista sostituito il 5 ottobre con la Nazionale italiana a causa di una lesione distrattiva al polpaccio destro. Recuperabile da inizio novembre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Nov"
  },
  "favasuli": {
    "playerName": "Favasuli",
    "squadra": "Napoli",
    "infortunio": "Il cursore di fascia degli azzurri ai box da inizio ottobre per una lesione muscolare di secondo grado del retto femorale della coscia destra. Recuperabile dalla metà di novembre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Nov"
  },
  "santos a": {
    "playerName": "Santos A.",
    "squadra": "Napoli",
    "infortunio": "Il brasiliano costretto al cambio il 9 settembre in Champions League vittima di una lesione muscolare di medio grado al bicipite femorale sinistro. Proverà a tornare arruolabile dalla seconda metà di ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "olivera": {
    "playerName": "Olivera",
    "squadra": "Napoli",
    "infortunio": "L'uruguaiano a inizio ottobre in Nazionale ha rimediato un problema muscolare alla gamba destra e salterà l'impegno di campionato contro il Frosinone. Recuperabile dalla metà di ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "buongiorno": {
    "playerName": "Buongiorno",
    "squadra": "Napoli",
    "infortunio": "il difensore operato nella seconda metà di luglio al menisco del ginocchio destro. Sta recuperando lentamente, ipotizziamo possa tornare arruolabile da fine dicembre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Dic"
  },
  "zambo anguissa": {
    "playerName": "Zambo Anguissa",
    "squadra": "Napoli",
    "infortunio": "il centrocampista subentrato a gara in corso il 20 settembre a Firenze, ma ha lamentato una lesione miofasciale di basso grado dell'adduttore lungo e rimane da valutare nei prossimi allenamenti in vista della gara contro il Frosinone alla ripresa del campionato.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "ndiaye": {
    "playerName": "Ndiaye",
    "squadra": "Parma",
    "infortunio": "Il difensore colpito duro in allenamento nei giorni scorsi, forfait per sabato contro l'Inter. Condizioni da valutare in vista della 7a giornata di campionato.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "nicolussi caviglia": {
    "playerName": "Nicolussi Caviglia",
    "squadra": "Parma",
    "infortunio": "il centrocampista alle prese dalla seconda metà di luglio con una lesione di medio grado alla coscia destra, ma a fine agosto ha deciso, assieme allo staff medico ducale, di operarsi. Lungo stop e ipotesi di ritorno in campo da dicembre.",
    "rientroPrevisto": "Lungo stop",
    "meseRientro": "Dic"
  },
  "almqvist": {
    "playerName": "Almqvist",
    "squadra": "Parma",
    "infortunio": "L'ala offensiva dei ducali KO dal 6 ottobre per una lesione muscolare al polpaccio sinistro, recuperabile dalla fine di ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "svilar": {
    "playerName": "Svilar",
    "squadra": "Roma",
    "infortunio": "Il portiere condizionato da una frattura a un dito della mano e fuori dal match contro il Como. Ipotesi di rientro a disposizione dalla metà di novembre.",
    "rientroPrevisto": "a disposizione dalla metà di novembre",
    "meseRientro": "Nov"
  },
  "koulierakis": {
    "playerName": "Koulierakis",
    "squadra": "Roma",
    "infortunio": "il difensore non al meglio per una contusione alla gamba, out domenica a Como. Da valutare rientro già nella 7a giornata di A.",
    "rientroPrevisto": "già nella 7a giornata di A",
    "meseRientro": "Ott"
  },
  "cristante": {
    "playerName": "Cristante",
    "squadra": "Roma",
    "infortunio": "Il mediano giallorosso condizionato da un'infiammazione al ginocchio e darà forfait domenica contro il Como nel prossimo turno di campionato. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "boloca": {
    "playerName": "Boloca",
    "squadra": "Sassuolo",
    "infortunio": "il centrocampista fuori causa per un problema al ginocchio e fuori causa in questo inizio di campionato. Da valutare rientro da fine ottobre.",
    "rientroPrevisto": "da fine ottobre",
    "meseRientro": "Ott"
  },
  "volpato": {
    "playerName": "Volpato",
    "squadra": "Sassuolo",
    "infortunio": "l'esterno offensivo dei neroverdi KO il 6 settembre a Bologna vittima di una lesione di grado moderato al flessore della gamba destra. Recuperabile dalla seconda metà di ottobre, ma da valutare nei prossimi allenamenti le possibilità di convocazione già nel prossimo turno contro il Milan.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "kon xe8 i": {
    "playerName": "Kon&#xE8; I.",
    "squadra": "Sassuolo",
    "infortunio": "il centrocampista canadese vittima a giugno nella gara dei Mondiali di una rottura di tibia e perone. Operato, punta a tornare in campo da dicembre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Dic"
  },
  "pieragnolo": {
    "playerName": "Pieragnolo",
    "squadra": "Sassuolo",
    "infortunio": "il difensore sta proseguendo la fase di recupero dalla lesione legamento crociato anteriore gamba destra e ipotizziamo possa tornare convocabile da fine ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "cand xe8": {
    "playerName": "Cand&#xE8;",
    "squadra": "Sassuolo",
    "infortunio": "il difensore a gennaio vittima della rottura legamento crociato anteriore ginocchio destro, punta a tornare convocabile dalla fine di ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Gen"
  },
  "walukiewicz": {
    "playerName": "Walukiewicz",
    "squadra": "Sassuolo",
    "infortunio": "Il difensore alle prese con un forte trauma contusivo alla gamba destra, da valutare il rientro dalla seconda metà di ottobre.",
    "rientroPrevisto": "dalla seconda metà di ottobre",
    "meseRientro": "Ott"
  },
  "idzes": {
    "playerName": "Idzes",
    "squadra": "Sassuolo",
    "infortunio": "Il difensore ai box per una lesione di grado moderato al quadricipite della gamba sinistra, proverà a tornerà arruolabile dalla seconda metà di ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "fortini": {
    "playerName": "Fortini",
    "squadra": "Torino",
    "infortunio": "Il cursore di fascia dei granata rientrato in anticipo dagli impegni con l'U21 azzurra a causa di un affaticamento muscolare all'adduttore che mette a forte rischio la sua presenza contro l'Udinese alla ripresa del campionato. Da valutare nella rifinitura.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "piotrowski": {
    "playerName": "Piotrowski",
    "squadra": "Udinese",
    "infortunio": "Il centrocampista ha ravvisato il 7 settembre contro la Lazio una lieve aritmia cardiaca benigna e si sottoporrà nei prossimi giorni ad un intervento di ablazione cardiaca. Osservato un periodo di riposo, potrà tornare alla regolare attività agonistica (ipotizziamo dalla seconda metà di ottobre).",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
  },
  "zaniolo": {
    "playerName": "Zaniolo",
    "squadra": "Udinese",
    "infortunio": "Il calciatore alle prese con una lesione muscolare al bicipite femorale destro, rientro previsto dalla seconda metà di ottobre.",
    "rientroPrevisto": "previsto dalla seconda metà di ottobre",
    "meseRientro": "Ott"
  },
  "gueye": {
    "playerName": "Gueye",
    "squadra": "Udinese",
    "infortunio": "L'attaccante vittima di un problema alla caviglia a fine settembre. Ha deciso di operarsi, lungo stop di circa tre mesi e possibile ritorno in campo da fine gennaio.",
    "rientroPrevisto": "Lungo stop",
    "meseRientro": "Gen"
  },
  "adorante": {
    "playerName": "Adorante",
    "squadra": "Venezia",
    "infortunio": "l'attaccante a fine luglio ha deciso di operarsi per un problema alla schiena, che lo costringerà a stare ai box per buona parte del girone d'andata del campionato. Tentativo di rientro da metà ottobre.",
    "rientroPrevisto": "da metà ottobre",
    "meseRientro": "Ott"
  },
  "busio": {
    "playerName": "Busio",
    "squadra": "Venezia",
    "infortunio": "il regista dei veneti KO l'11 settembre contro la Fiorentina vittima di una distrazione intratendinea del bicipite femorale destro. Rientro dalla seconda metà di ottobre.",
    "rientroPrevisto": "dalla seconda metà di ottobre",
    "meseRientro": "Ott"
  },
  "franjic": {
    "playerName": "Franjic",
    "squadra": "Venezia",
    "infortunio": "il difensore costretto al cambio a Milano contro i rossoneri a fine agosto per un guaio alla spalla che ha richiesto l'intervento chirurgico. Lungo stop e rientro dalla metà di dicembre.",
    "rientroPrevisto": "dalla metà di dicembre",
    "meseRientro": "Dic"
  },
  "sverko": {
    "playerName": "Sverko",
    "squadra": "Venezia",
    "infortunio": "il difensore operato in estate per il perdurare di un problema all'anca e recuperabile da fine ottobre.",
    "rientroPrevisto": "In valutazione",
    "meseRientro": "Ott"
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
