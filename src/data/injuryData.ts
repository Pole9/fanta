export interface InjuryInfo {
  playerName: string;
  squadra: string;
  infortunio: string;
  rientroPrevisto: string;
  meseRientro: string;
  isSqualificato?: boolean;
  isRecuperato?: boolean;
  note?: string;
}

// Database Infortuni UFFICIALI e VERIFICATI (Fonte: Fantacalcio.it /infortunati-serie-a)
// Include ESCLUSIVAMENTE calciatori presenti nell'infermeria ufficiale con squadra di appartenenza.
export const INJURY_DATABASE: Record<string, InjuryInfo> = {
  "kossounou_atalanta": {
    "playerName": "Kossounou",
    "squadra": "Atalanta",
    "infortunio": "Il difensore frenato da una lesione muscolare di medio-alto grado del bicipite femorale della coscia sinistra alla vigilia della sfida di campionato contro la Juventus (del 20 settembre). Lungo stop, rientro dalla seconda metà di novembre.",
    "rientroPrevisto": "rientro dalla seconda metà di novembre.",
    "meseRientro": "Nov"
  },
  "sulemanak_atalanta": {
    "playerName": "Sulemana K.",
    "squadra": "Atalanta",
    "infortunio": "L'attaccante KO in amichevole l'8 agosto vittima di una lesione del collaterale mediale di secondo grado del ginocchio sinistro. Recuperabile da inizio ottobre, ma da valutare nei prossimi allenamenti le possibilità di convocazione già nel prossimo turno contro il Venezia.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "raspadori_atalanta": {
    "playerName": "Raspadori",
    "squadra": "Atalanta",
    "infortunio": "L'attaccante frenato a fine settembre in Nazionale azzurra da una distrazione di basso grado al bicipite femorale, rientro tra i convocati con la Dea in campionato dalla seconda metà di ottobre.",
    "rientroPrevisto": "rientro tra i convocati con la Dea in campionato d",
    "meseRientro": "Ott"
  },
  "pompei_atalanta": {
    "playerName": "Pompei",
    "squadra": "Atalanta",
    "infortunio": "Il portiere fermo da inizio ottobre per la frattura della falange della mano destra, out nel prossimo turno di campionato. Tempi di recupero da valutare.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "hien_atalanta": {
    "playerName": "Hien",
    "squadra": "Atalanta",
    "infortunio": "il difensore operato a fine giugno per una lesione del tendine prossimale del muscolo semimembranoso della coscia sinistra, in recupero e pronto a tornare in campo dalla metà di novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "holm_bologna": {
    "playerName": "Holm",
    "squadra": "Bologna",
    "infortunio": "Lo svedese KO in Nazionale il 26 settembre vittima di un problema al tendine della coscia destra. Ha deciso di operarsi e affronterà un lungo stop. Ipotesi di rientro in campo da fine febbraio.",
    "rientroPrevisto": "rientro in campo da fine febbraio.",
    "meseRientro": "Feb"
  },
  "odgaard_bologna": {
    "playerName": "Odgaard",
    "squadra": "Bologna",
    "infortunio": "Il calciatore frenato dopo il match col Toro da una lesione ai flessori della coscia destra, recuperabile dalla seconda metà di ottobre.",
    "rientroPrevisto": "recuperabile dalla seconda metà di ottobre.",
    "meseRientro": "Ott"
  },
  "mbangula_bologna": {
    "playerName": "Mbangula",
    "squadra": "Bologna",
    "infortunio": "L'ala offensiva dei rossoblù non al meglio per noie fisiche e non convocato domenica a Lecce. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "idrissir_cagliari": {
    "playerName": "Idrissi R.",
    "squadra": "Cagliari",
    "infortunio": "il calciatore in ripresa dalla rottura del legamento crociato, può tornare arruolabile dalla fine di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "felici_cagliari": {
    "playerName": "Felici",
    "squadra": "Cagliari",
    "infortunio": "il centrocampista KO il 7 settembre contro il Lecce in casa vittima della rottura del legamento crociato anteriore. Verrà operato e costretto a un lungo stop (ipotizziamo un rientro da marzo).",
    "rientroPrevisto": "rientro da marzo).",
    "meseRientro": "Mar"
  },
  "trepy_cagliari": {
    "playerName": "Trepy",
    "squadra": "Cagliari",
    "infortunio": "Il calciatore ricoverato il 16 agosto dopo che avrebbe rischiato di annegare in piscina. Dimesso poi il 28 agosto, ora condizioni monitorate da parte dello staff medico rossoblù. Da metà settembre ha avuto l'ok per riprendere l'attività agonistica, potrebbe ora tornare convocabile dalla fine di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "kean_como": {
    "playerName": "Kean",
    "squadra": "Como",
    "infortunio": "l'attaccante non ha recuperato dal fastidio alla tibia e salterà la sfida di domenica contro la Roma. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "parisi_fiorentina": {
    "playerName": "Parisi",
    "squadra": "Fiorentina",
    "infortunio": "il cursore di fascia della Viola sta svolgendo l'iter di recupero dall'infortunio al legamento crociato al ginocchio, punta a tornare convocabile da dicembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Dic"
  },
  "atta_fiorentina": {
    "playerName": "Atta",
    "squadra": "Fiorentina",
    "infortunio": "il centrocampista non al meglio per un sovraccarico funzionale dell'addome, assente sabato a Genova. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "grillitsch_frosinone": {
    "playerName": "Grillitsch",
    "squadra": "Frosinone",
    "infortunio": "il centrocampista non convocato dalla gara di Genova (12 settembre) a causa di una sindrome retto-adduttoria, ha poi deciso di operarsi. Stop di circa sei settimane, può tornare convocabile da inizio novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "birligea_frosinone": {
    "playerName": "Birligea",
    "squadra": "Frosinone",
    "infortunio": "L'attaccante sta recuperando da una lesione muscolare al quadricipite sinistro, tentativo di rientro dalla fine di ottobre.",
    "rientroPrevisto": "rientro dalla fine di ottobre.",
    "meseRientro": "Ott"
  },
  "havel_genoa": {
    "playerName": "Havel",
    "squadra": "Genoa",
    "infortunio": "L'attaccante ha deciso di operarsi alla caviglia e dovrebbe tornare arruolabile dalla metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "sow_genoa": {
    "playerName": "Sow",
    "squadra": "Genoa",
    "infortunio": "Il centrocampista svizzero il 6 ottobre in Nazionale vittima di una distrazione muscolare al bicipite femorale della coscia sinistra, rientro in campo da inizio novembre.",
    "rientroPrevisto": "rientro in campo da inizio novembre.",
    "meseRientro": "Nov"
  },
  "colombo_genoa": {
    "playerName": "Colombo",
    "squadra": "Genoa",
    "infortunio": "L'attaccante non al meglio per un problema alla caviglia rimediato venerdì scorso in amichevole e darà forfait nel prossimo turno di campionato contro la Fiorentina. Ipotesi di rientro da fine ottobre.",
    "rientroPrevisto": "rientro da fine ottobre.",
    "meseRientro": "Ott"
  },
  "meichtry_genoa": {
    "playerName": "Meichtry",
    "squadra": "Genoa",
    "infortunio": "Il calciatore ai box per una distrazione della muscolatura di un'anca, il cui grado rimane da valutare con ulteriori accertamenti medici. Di certo out nel prossimo turno di campionato contro la Fiorentina.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "amorim_genoa": {
    "playerName": "Amorim",
    "squadra": "Genoa",
    "infortunio": "Il centrocampista non ha recuperato da un problema fisico e non è stato convocato per la gara contro la Fiorentina. Da valutare in vista della 7a giornata di campionato.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "venturino_genoa": {
    "playerName": "Venturino",
    "squadra": "Genoa",
    "infortunio": "il calciatore operato al tendine rotuleo e ora in fase di recupero. Di certo assente nel prossimo turno di campionato, ipotesi di rientro da fine ottobre.",
    "rientroPrevisto": "rientro da fine ottobre.",
    "meseRientro": "Ott"
  },
  "stones_inter": {
    "playerName": "Stones",
    "squadra": "Inter",
    "infortunio": "il difensore alle prese con un risentimento ai flessori della coscia sinistra, recuperabile dalla prima metà di ottobre. Tuttavia, da valutare la sua convocazione contro il Parma nella 6a di A.",
    "rientroPrevisto": "recuperabile dalla prima metà di ottobre. Tuttavia",
    "meseRientro": "Ott"
  },
  "jonesc_inter": {
    "playerName": "Jones C.",
    "squadra": "Inter",
    "infortunio": "Il centrocampista fermato da un risentimento miofasciale agli adduttori della coscia destra, tentativo rientro tra i convocati dalla fine di ottobre.",
    "rientroPrevisto": "rientro tra i convocati dalla fine di ottobre.",
    "meseRientro": "Ott"
  },
  "locatelli_juventus": {
    "playerName": "Locatelli",
    "squadra": "Juventus",
    "infortunio": "il metronomo del centrocampo bianconero ha rimediato la rottura del menisco esterno del ginocchio. Verrà operato a Lione a stretto giro. Lungo stop e possibilità di rivederlo in campo da febbraio.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Feb"
  },
  "thuramk_juventus": {
    "playerName": "Thuram K.",
    "squadra": "Juventus",
    "infortunio": "il centrocampista condizionato da una sindrome femoro-rotulea e, dopo un consulto medico a fine agosto, è stato sottoposto il 3 settembre a operazione chirurgica. Lungo stop, ipotizziamo un rientro da gennaio.",
    "rientroPrevisto": "rientro da gennaio.",
    "meseRientro": "Gen"
  },
  "boga_juventus": {
    "playerName": "Boga",
    "squadra": "Juventus",
    "infortunio": "l'ala offensiva dei bianconeri fermo dopo il match contro il Milan (6 settembre) per una lesione di medio grado del bicipite femorale, ipotizziamo un possibile rientro dalla metà di novembre.",
    "rientroPrevisto": "rientro dalla metà di novembre.",
    "meseRientro": "Nov"
  },
  "ekhator_juventus": {
    "playerName": "Ekhator",
    "squadra": "Juventus",
    "infortunio": "l'attaccante vittima di una lesione di medio grado del muscolo semitendinoso, rientro dalla metà di novembre.",
    "rientroPrevisto": "rientro dalla metà di novembre.",
    "meseRientro": "Nov"
  },
  "yildiz_juventus": {
    "playerName": "Yildiz",
    "squadra": "Juventus",
    "infortunio": "l'attaccante turco, dopo la gara di Frosinone (23 agosto), ha lamentato un problema al piede. Operato il 31 agosto di osteosintesi della frattura della base del V metatarso del piede sinistro, stop di circa tre mesi. Rientro in campo da inizio dicembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Dic"
  },
  "grabara_juventus": {
    "playerName": "Grabara",
    "squadra": "Juventus",
    "infortunio": "Il portiere out dal 20 settembre per una lesione al crociato anteriore del ginocchio destro. Operazione chirurgica e lungo stop, rientro da aprile.",
    "rientroPrevisto": "rientro da aprile.",
    "meseRientro": "Apr"
  },
  "marusic_lazio": {
    "playerName": "Marusic",
    "squadra": "Lazio",
    "infortunio": "il terzino dei biancocelesti KO il 24 agosto a Bologna vittima di una lesione muscolare alla coscia. Recuperabile dalla metà di ottobre, da valutare convocazione nella 7a di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "rovella_lazio": {
    "playerName": "Rovella",
    "squadra": "Lazio",
    "infortunio": "il regista dei biancocelesti KO il 30 agosto contro il Genoa vittima di una lesione muscolare al polpaccio, ai box fino alla metà di ottobre. Da valutare convocazione nella 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "cancellieri_lazio": {
    "playerName": "Cancellieri",
    "squadra": "Lazio",
    "infortunio": "l'ala offensiva dei biancocelesti non al meglio per noie fisiche, out domenica contro il Monza. Recuperabile per la 7a giornata di campionato.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "gudmundssona_lazio": {
    "playerName": "Gudmundsson A.",
    "squadra": "Lazio",
    "infortunio": "L'islandese in Nazionale il 26 settembre vittima di un problema alla spalla destra dopo una caduta fortuita in partita. Condizioni da monitorare, si confida di riaverlo a disposizione dalla fine metà di ottobre/inizio di novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "berisham_lecce": {
    "playerName": "Berisha M.",
    "squadra": "Lecce",
    "infortunio": "Il centrocampista ha lamentato un sovraccarico muscolare alla gamba e non ha preso parte alle sfide contro Monza e Milan, out anche domenica contro il Bologna. Recuperabile da fine ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "stulic_lecce": {
    "playerName": "Stulic",
    "squadra": "Lecce",
    "infortunio": "lavoro a parte in settimana per l'attaccante a causa del riacutizzarsi di un fastidio muscolare alla gamba. Non ci sarà domenica contro il Bologna, condizioni da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "saelemaekers_milan": {
    "playerName": "Saelemaekers",
    "squadra": "Milan",
    "infortunio": "Il belga fermo da inizio ottobre per un problema alla caviglia, concreta ora la possibilità di operarsi. Saranno poi da stabilire i tempi di recupero, ma lo stop sarà lungo e lo rivedremo in campo nel 2027 inoltrato.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "ciurria_monza": {
    "playerName": "Ciurria",
    "squadra": "Monza",
    "infortunio": "il centrocampista non al meglio per noie fisiche, forfait anche nel prossimo turno contro la Lazio. Da valutare.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "pessina_monza": {
    "playerName": "Pessina",
    "squadra": "Monza",
    "infortunio": "Il centrocampista costretto a saltare l'inizio di campionato per una lussazione della rotula del ginocchio destro rimediata nella prima metà di agosto in allenamento. Tempi di recupero da monitorare, ma proverà a tornare arruolabile dall'inizio di novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "ziolkowski_monza": {
    "playerName": "Ziolkowski",
    "squadra": "Monza",
    "infortunio": "Il difensore condizionato da una fastidiosa fascite plantare, di certo assente nel prossimo turno di campionato. Tempi di recupero da valutare.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "vergara_napoli": {
    "playerName": "Vergara",
    "squadra": "Napoli",
    "infortunio": "Il centrocampista sostituito il 5 ottobre con la Nazionale italiana a causa di una lesione distrattiva al polpaccio destro. Recuperabile da inizio novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "favasuli_napoli": {
    "playerName": "Favasuli",
    "squadra": "Napoli",
    "infortunio": "Il cursore di fascia degli azzurri ai box da inizio ottobre per una lesione muscolare di secondo grado del retto femorale della coscia destra. Recuperabile dalla metà di novembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Nov"
  },
  "santosa_napoli": {
    "playerName": "Santos A.",
    "squadra": "Napoli",
    "infortunio": "Il brasiliano costretto al cambio il 9 settembre in Champions League vittima di una lesione muscolare di medio grado al bicipite femorale sinistro. Proverà a tornare arruolabile dalla seconda metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "olivera_napoli": {
    "playerName": "Olivera",
    "squadra": "Napoli",
    "infortunio": "L'uruguaiano a inizio ottobre in Nazionale ha rimediato un problema muscolare alla gamba destra e salterà l'impegno di campionato contro il Frosinone. Recuperabile dalla metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "buongiorno_napoli": {
    "playerName": "Buongiorno",
    "squadra": "Napoli",
    "infortunio": "il difensore operato nella seconda metà di luglio al menisco del ginocchio destro. Sta recuperando lentamente, ipotizziamo possa tornare arruolabile da fine dicembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Dic"
  },
  "zamboanguissa_napoli": {
    "playerName": "Zambo Anguissa",
    "squadra": "Napoli",
    "infortunio": "il centrocampista subentrato a gara in corso il 20 settembre a Firenze, ma ha lamentato una lesione miofasciale di basso grado dell'adduttore lungo e rimane da valutare nei prossimi allenamenti in vista della gara contro il Frosinone alla ripresa del campionato.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "ndiaye_parma": {
    "playerName": "Ndiaye",
    "squadra": "Parma",
    "infortunio": "Il difensore colpito duro in allenamento nei giorni scorsi, forfait per sabato contro l'Inter. Condizioni da valutare in vista della 7a giornata di campionato.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "nicolussicaviglia_parma": {
    "playerName": "Nicolussi Caviglia",
    "squadra": "Parma",
    "infortunio": "il centrocampista alle prese dalla seconda metà di luglio con una lesione di medio grado alla coscia destra, ma a fine agosto ha deciso, assieme allo staff medico ducale, di operarsi. Lungo stop e ipotesi di ritorno in campo da dicembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Dic"
  },
  "almqvist_parma": {
    "playerName": "Almqvist",
    "squadra": "Parma",
    "infortunio": "L'ala offensiva dei ducali KO dal 6 ottobre per una lesione muscolare al polpaccio sinistro, recuperabile dalla fine di ottobre.",
    "rientroPrevisto": "recuperabile dalla fine di ottobre.",
    "meseRientro": "Ott"
  },
  "svilar_roma": {
    "playerName": "Svilar",
    "squadra": "Roma",
    "infortunio": "Il portiere condizionato da una frattura a un dito del piede e fuori dal match contro il Como. Ipotesi di rientro a disposizione dalla metà di novembre.",
    "rientroPrevisto": "rientro a disposizione dalla metà di novembre.",
    "meseRientro": "Nov"
  },
  "koulierakis_roma": {
    "playerName": "Koulierakis",
    "squadra": "Roma",
    "infortunio": "il difensore non al meglio per una contusione alla gamba, out domenica a Como. Da valutare rientro già nella 7a giornata di A.",
    "rientroPrevisto": "rientro già nella 7a giornata di A.",
    "meseRientro": "Ott"
  },
  "cristante_roma": {
    "playerName": "Cristante",
    "squadra": "Roma",
    "infortunio": "Il mediano giallorosso condizionato da un'infiammazione al ginocchio e darà forfait domenica contro il Como nel prossimo turno di campionato. Da valutare in vista della 7a giornata di A.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "boloca_sassuolo": {
    "playerName": "Boloca",
    "squadra": "Sassuolo",
    "infortunio": "il centrocampista fuori causa per un problema al ginocchio e fuori causa in questo inizio di campionato. Da valutare rientro da fine ottobre.",
    "rientroPrevisto": "rientro da fine ottobre.",
    "meseRientro": "Ott"
  },
  "volpato_sassuolo": {
    "playerName": "Volpato",
    "squadra": "Sassuolo",
    "infortunio": "l'esterno offensivo dei neroverdi KO il 6 settembre a Bologna vittima di una lesione di grado moderato al flessore della gamba destra. Recuperabile dalla seconda metà di ottobre, ma da valutare nei prossimi allenamenti le possibilità di convocazione già nel prossimo turno contro il Milan.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "koni_sassuolo": {
    "playerName": "Konè I.",
    "squadra": "Sassuolo",
    "infortunio": "il centrocampista canadese vittima a giugno nella gara dei Mondiali di una rottura di tibia e perone. Operato, punta a tornare in campo da dicembre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Dic"
  },
  "pieragnolo_sassuolo": {
    "playerName": "Pieragnolo",
    "squadra": "Sassuolo",
    "infortunio": "il difensore sta proseguendo la fase di recupero dalla lesione legamento crociato anteriore gamba destra e ipotizziamo possa tornare convocabile da fine ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "cand_sassuolo": {
    "playerName": "Candè",
    "squadra": "Sassuolo",
    "infortunio": "il difensore a gennaio vittima della rottura legamento crociato anteriore ginocchio destro, punta a tornare convocabile dalla fine di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Gen"
  },
  "walukiewicz_sassuolo": {
    "playerName": "Walukiewicz",
    "squadra": "Sassuolo",
    "infortunio": "Il difensore alle prese con un forte trauma contusivo alla gamba destra, da valutare il rientro dalla seconda metà di ottobre.",
    "rientroPrevisto": "rientro dalla seconda metà di ottobre.",
    "meseRientro": "Ott"
  },
  "idzes_sassuolo": {
    "playerName": "Idzes",
    "squadra": "Sassuolo",
    "infortunio": "Il difensore ai box per una lesione di grado moderato al quadricipite della gamba sinistra, proverà a tornerà arruolabile dalla seconda metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "fortini_torino": {
    "playerName": "Fortini",
    "squadra": "Torino",
    "infortunio": "Il cursore di fascia dei granata rientrato in anticipo dagli impegni con l'U21 azzurra a causa di un affaticamento muscolare all'adduttore che mette a forte rischio la sua presenza contro l'Udinese alla ripresa del campionato. Da valutare nella rifinitura.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "piotrowski_udinese": {
    "playerName": "Piotrowski",
    "squadra": "Udinese",
    "infortunio": "Il centrocampista ha ravvisato il 7 settembre contro la Lazio una lieve aritmia cardiaca benigna e si sottoporrà nei prossimi giorni ad un intervento di ablazione cardiaca. Osservato un periodo di riposo, potrà tornare alla regolare attività agonistica (ipotizziamo dalla seconda metà di ottobre).",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "zaniolo_udinese": {
    "playerName": "Zaniolo",
    "squadra": "Udinese",
    "infortunio": "Il calciatore alle prese con una lesione muscolare al bicipite femorale destro, rientro previsto dalla seconda metà di ottobre.",
    "rientroPrevisto": "rientro previsto dalla seconda metà di ottobre.",
    "meseRientro": "Ott"
  },
  "gueye_udinese": {
    "playerName": "Gueye",
    "squadra": "Udinese",
    "infortunio": "L'attaccante vittima di un problema alla caviglia a fine settembre. Ha deciso di operarsi, lungo stop di circa tre mesi e possibile ritorno in campo da fine gennaio.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Gen"
  },
  "adorante_venezia": {
    "playerName": "Adorante",
    "squadra": "Venezia",
    "infortunio": "l'attaccante a fine luglio ha deciso di operarsi per un problema alla schiena, che lo costringerà a stare ai box per buona parte del girone d'andata del campionato. Tentativo di rientro da metà ottobre.",
    "rientroPrevisto": "rientro da metà ottobre.",
    "meseRientro": "Ott"
  },
  "busio_venezia": {
    "playerName": "Busio",
    "squadra": "Venezia",
    "infortunio": "il regista dei veneti KO l'11 settembre contro la Fiorentina vittima di una distrazione intratendinea del bicipite femorale destro. Rientro dalla seconda metà di ottobre.",
    "rientroPrevisto": "Da valutare",
    "meseRientro": "Ott"
  },
  "franjic_venezia": {
    "playerName": "Franjic",
    "squadra": "Venezia",
    "infortunio": "il difensore costretto al cambio a Milano contro i rossoneri a fine agosto per un guaio alla spalla che ha richiesto l'intervento chirurgico. Lungo stop e rientro dalla metà di dicembre.",
    "rientroPrevisto": "rientro dalla metà di dicembre.",
    "meseRientro": "Dic"
  },
  "sverko_venezia": {
    "playerName": "Sverko",
    "squadra": "Venezia",
    "infortunio": "il difensore operato in estate per il perdurare di un problema all'anca e recuperabile da fine ottobre.",
    "rientroPrevisto": "recuperabile da fine ottobre.",
    "meseRientro": "Ott"
  }
};

// Funzione di lookup con verifica rigorosa di NOME, INIZIALE e SQUADRA per evitare scambi tra fratelli/omonimi
export function getInjuryInfo(name: string, teamName?: string): InjuryInfo | null {
  if (!name) return null;
  
  const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanN = cleanStr(name);
  const cleanT = teamName ? cleanStr(teamName) : '';

  // 1. Match esatto per chiave con squadra: es. "thuramk_juventus"
  if (cleanT) {
    const directKey = `${cleanN}_${cleanT}`;
    if (INJURY_DATABASE[directKey]) return INJURY_DATABASE[directKey];
  }

  // Normalizzatore squadra per matching flessibile (es. "Inter" vs "Internazionale", "Hellas Verona" vs "Verona")
  const isTeamMatch = (t1: string, t2: string) => {
    if (!t1 || !t2) return false;
    return t1 === t2 || t1.includes(t2) || t2.includes(t1);
  };

  // 2. Analisi token del nome cercato (cognome e iniziale)
  // Es. "THURAM" (cognome THURAM, iniziale ""), "THURAM K." (iniziale K), "ESPOSITO F.P." (iniziale FP)
  const normUpper = name.toUpperCase().replace(/[^A-Z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = normUpper.split(' ').filter(Boolean);
  const surname = tokens[0] || '';
  const initial = tokens.length > 1 ? tokens.slice(1).join('') : '';

  for (const [, info] of Object.entries(INJURY_DATABASE)) {
    const infoTeamClean = cleanStr(info.squadra);

    // Se è fornita la squadra del calciatore in rosa, DEVE coincidere con la squadra dell'infortunato!
    if (cleanT && !isTeamMatch(cleanT, infoTeamClean)) {
      continue;
    }

    const infoNorm = info.playerName.toUpperCase().replace(/[^A-Z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    const infoTokens = infoNorm.split(' ').filter(Boolean);
    const infoSurname = infoTokens[0] || '';
    const infoInitial = infoTokens.length > 1 ? infoTokens.slice(1).join('') : '';

    // Il cognome deve corrispondere esattamente
    if (infoSurname !== surname) {
      continue;
    }

    // Se l'infortunato ha un'iniziale (es. K in Thuram K. o I in Konè I.)
    if (infoInitial) {
      if (initial) {
        // Entrambi hanno iniziale: devono coincidere esattamente o avere prefisso comune (es. "FP" e "F")
        if (initial !== infoInitial && !infoInitial.startsWith(initial) && !initial.startsWith(infoInitial)) {
          continue;
        }
      } else {
        // Il giocatore cercato NON ha iniziale (es. "THURAM"), ma l'infortunato ha un'iniziale (es. "THURAM K.")
        // Se non abbiamo la squadra o la squadra non combacia, NON fare match per evitare scambi tra fratelli!
        if (!cleanT || !isTeamMatch(cleanT, infoTeamClean)) {
          continue;
        }
      }
    } else {
      // L'infortunato nel DB NON ha iniziale: se il giocatore cercato ha un'iniziale e non abbiamo la squadra, cautela
      if (initial && !cleanT) {
        continue;
      }
    }

    return info;
  }

  return null;
}

export const getPlayerInjury = getInjuryInfo;
