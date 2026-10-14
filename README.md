# FantaAsta Live Master & Ted Lasso Advisor ⚽🏆

Applicazione web professionale e PWA ad alte prestazioni per la gestione dell'asta del Fantacalcio, analisi statistica avanzata e schieramento formazioni con intelligenza tattica (8 squadre, 300 crediti, rosa standard 3P - 8D - 8C - 5A, modificatore di difesa attivo).

---

## Indice dei Contenuti
- [Panoramica](#panoramica)
- [Funzionalità Principali](#funzionalità-principali)
  - [1. Ted Lasso Advisor & Calcolo Formazione Ottimale](#1-ted-lasso-advisor--calcolo-formazione-ottimale)
  - [2. Probabili Formazioni Gazzetta & Disposizione in Campo](#2-probabili-formazioni-gazzetta--disposizione-in-campo)
  - [3. Report Giocatori Desktop Widescreen & Mobile](#3-report-giocatori-desktop-widescreen--mobile)
  - [4. Grafico Prestazioni a 38 Giornate (Barre Impilate & Tutto Schermo)](#4-grafico-prestazioni-a-38-giornate-barre-impilate--tutto-schermo)
  - [5. Gestione Rose & Import Aste di Riparazione In-App](#5-gestione-rose--import-aste-di-riparazione-in-app)
  - [6. App Mobile, PWA & Landscape Totale](#6-app-mobile-pwa--landscape-totale)
  - [7. War Room Strategiche (Portieri & Attaccanti)](#7-war-room-strategiche-portieri--attaccanti)
  - [8. Asta Live Rapida & Comandi da Tastiera](#8-asta-live-rapida--comandi-da-tastiera)
- [Wiki & Documentazione Approfondita](#wiki--documentazione-approfondita)
- [Avvio Rapido & Sviluppo](#avvio-rapido--sviluppo)
- [Stack Tecnologico](#stack-tecnologico)

---

## Panoramica

**FantaAsta Live Master** unisce in un unico strumento ultra-reattivo sia la gestione in tempo reale dell'asta iniziale e delle aste di riparazione, sia il supporto settimanale allo schieramento della formazione grazie all'assistente tattico **Ted Lasso**. L'applicazione è ottimizzata sia per l'utilizzo su schermi desktop widescreen sia per dispositivi mobile e tablet, con supporto nativo all'orientamento orizzontale (Landscape), navigazione a gesti (swipe) e funzionamento offline/PWA.

---

## Funzionalità Principali

### 1. Ted Lasso Advisor & Calcolo Formazione Ottimale
- **Algoritmo di Schieramento Intelligente**: calcolo dell'undici titolare e della panchina ordinata massimizzando l'indice proprietario *Ted Score* e il valore atteso della giornata.
- **Supporto Moduli Multipli**: 3-5-2, 3-4-3, 4-3-3, 4-4-2, 4-2-3-1, 4-5-1, 3-4-1-2 con passaggio immediato e simulatore interattivo sul campetto da gioco.
- **Calcolo Rigoroso Modificatore Difesa**: valutazione in tempo reale della convenienza del passaggio alla difesa a 4 in base alla media voto pura dei difensori e del portiere rispetto alle soglie ufficiali (+1, +3, +6).
- **Indici di Schierabilità**: percentuali di titolarità della redazione, ballottaggi con compagno di reparto, rigoristi, tiratori di piazzati e motivazione tattica per ogni calciatore.

### 2. Probabili Formazioni Gazzetta & Disposizione in Campo
- **Schemi Tattici Ufficiali Serie A**: visualizzazione delle formazioni probabili complete (Gazzetta dello Sport / Fantacalcio.it) con disposizione geometrica reale sul campo.
- **Evidenziazione Giocatori in Rosa**: badge e bagliori cromatici ad alto contrasto per individuare istantaneamente i calciatori della propria rosa titolari o in ballottaggio.
- **Navigazione Partite**: passaggio istantaneo tra tutti i 10 match del turno di campionato tramite swipe laterale su touch screen e tasti direzionali su desktop.

### 3. Report Giocatori Desktop Widescreen & Mobile
- **Layout Desktop a 2 Colonne (7/12 + 5/12)**: progettato per monitor ampi per avere sott'occhio statistiche, note redazionali e cronistoria senza scrolling orizzontale.
- **Focus Prossimo Avversario**: indicazione esclusiva della partita in arrivo con grado di difficoltà, luogo (casa/trasferta) e data, eliminando informazioni ridondanti sui match successivi.
- **Badge Proprietà Fanta**: evidenziazione della squadra della lega che possiede il calciatore oppure cartellino `FREE` se il calciatore è svincolato.
- **Scheda Statistica Completa**: accessibile per ogni calciatore del campionato Serie A (non solo per i propri tesserati).

### 4. Grafico Prestazioni a 38 Giornate (Barre Impilate & Tutto Schermo)
- **Istogramma a Barre Impilate (Stacked Bar Chart)**:
  - **Base**: Voto puro redazionale colorato secondo lo status della partita (Verde per titolare 90', Verde rigato per sostituito, Giallo per subentrato, Viola per uscito per infortunio, SV, INF).
  - **Malus**: Segmento impilato in **rosso vivo** per ammonizioni (-0.5), espulsioni (-1.0) e gol subiti dai portieri.
  - **Bonus**: Segmento impilato in **ciano brillante** per gol segnati (+3.0) e assist (+1.0).
- **Callout Contestuale Risultato**: passando il mouse o toccando qualsiasi giornata, compare un callout con il risultato della gara reale (es. `MIL-LAZ 3-2`), l'avversario e il dettaglio di voto e fantavoto.
- **Modalità a Tutto Schermo**: pulsante dedicato per espandere il grafico in un portale ad alta definizione (fino a 340px di altezza), con barre allargate, asse Y dettagliato da 0 a 14 e scheda di dettaglio della gara selezionata.
- **Layout Anti-Glitch**: header stabilizzato ad altezza fissa e padding superiore protetto per azzerare qualsiasi sfarfallio al passaggio del mouse.

### 5. Gestione Rose & Import Aste di Riparazione In-App
- **Pulsante di Caricamento Diretto**: importazione dei file Excel (`.xlsx`) delle rose aggiornate e dei template dell'asta di riparazione direttamente dall'interfaccia utente, senza riavviare o ricompilare l'app.
- **Aggiornamento Dinamico**: ricalcolo istantaneo di crediti residui, slot liberi, nuovi acquisti, svincolati e formazioni.

### 6. App Mobile, PWA & Landscape Totale
- **Modalità Landscape (Orizzontale)**: l'intera applicazione è completamente usabile e ottimizzata in orientamento orizzontale su qualsiasi smartphone e tablet.
- **Gestione Tasto Indietro**: premendo il tasto "indietro" del browser o dello smartphone si torna alla schermata precedente senza uscire dall'app.
- **Temi Chiaro & Scuro**: contrasti ottimizzati affinché nomi e maglie dei giocatori in campo siano perfettamente leggibili sia in Dark Mode che in Light Mode.

### 7. War Room Strategiche (Portieri & Attaccanti)
- **War Room Portieri**:
  - Griglia incroci Casa/Trasferta della Serie A per individuare le migliori coppie di portieri con alternanza perfetta.
  - Punteggi di sinergia, analisi big match ed evidenziazione dei portieri da modificatore.
- **War Room Attaccanti**:
  - Tabellone comparativo del potere d'acquisto residuo di tutte le 8 squadre.
  - Calcolo del Rilancio Massimo (*Max Bid*) e della spesa media per slot d'attacco rimasto.
  - Lista svincolati ordinata per quotazione e FVM con chiamata rapida ad un clic.

### 8. Asta Live Rapida & Comandi da Tastiera
- **8 Pulsanti Squadra Giganti**: con visualizzazione crediti, slot occupati e rilancio istantaneo.
- **Scorciatoie da Tastiera**:
  - `1 - 8`: Selezione rapida della squadra acquirente.
  - `Freccia Su / Freccia Giù`: Incremento / decremento di 1 credito.
  - `PageUp / PageDown`: Variazione rapida di 5 crediti.
  - `Enter`: Assegnazione calciatore alla squadra attiva.
  - `Ctrl + Z`: Undo istantaneo dell'ultima transazione.
- **Chiamata Alfabetica**: barra rapida A-Z, tasto "Invenduto a fine ruolo" e gestione della chiamata libera finale.

---

## Wiki & Documentazione Approfondita

La documentazione completa e approfondita di ciascun modulo è disponibile nella cartella [`wiki/`](./wiki):

1. [**Home & Indice Generale**](./wiki/Home.md)
2. [**Ted Lasso Advisor & Modificatore**](./wiki/Ted-Lasso-Advisor.md)
3. [**Probabili Formazioni & Disposizione Tattica**](./wiki/Probabili-Formazioni-e-Disposizione-Tattica.md)
4. [**Report Giocatori Desktop e Mobile**](./wiki/Report-Giocatori-Desktop-e-Mobile.md)
5. [**Grafico Prestazioni, Barre Impilate e Tutto Schermo**](./wiki/Grafico-Prestazioni-e-Voti.md)
6. [**Gestione Rose & Aste di Riparazione In-App**](./wiki/Gestione-Rose-e-Aste-di-Riparazione.md)
7. [**War Room Asta, Portieri, Attaccanti e Tastiera**](./wiki/War-Room-Asta-e-Tasti-Rapidi.md)
8. [**Architettura, Sincronizzazione Dati & Deployment**](./wiki/Architettura-e-Deployment.md)

---

## Avvio Rapido & Sviluppo

### Prerequisiti
- **Node.js** v18+ e **npm**

### Installazione ed Esecuzione Locale
```bash
# Installazione delle dipendenze
npm install

# Avvio del server di sviluppo
npm run dev

# Compilazione per la produzione
npm run build
```

Per gli utenti Windows è disponibile lo script rapido:
```cmd
start.bat
```

---

## Stack Tecnologico

- **Core**: React 18, TypeScript 5, Vite 6
- **Styling**: Tailwind CSS, PostCSS, Lucide React Icons
- **Data Engine**: XLSX (parsing fogli di calcolo Fantacalcio), LocalStorage Persistence
- **Hosting & CI/CD**: Cloudflare Pages con deploy automatico dal ramo `main`