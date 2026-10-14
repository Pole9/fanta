# ⚔️ War Room Asta, Portieri, Attaccanti e Tasti Rapidi

Questo modulo raggruppa le schermate di pianificazione e la plancia di comando per lo svolgimento rapido dell'asta dal vivo.

---

## 1. War Room Portieri & Griglia Incroci

La **War Room Portieri** è studiata per massimizzare il rendimento del reparto portieri e l'attivazione del modificatore:
- **Griglia Incroci Casa / Trasferta**: matrice che calcola il numero di giornate in cui due squadre giocano contemporaneamente in casa o in trasferta.
- **Indice di Alternanza**: evidenzia le coppie che garantiscono di avere sempre un portiere impegnato in una partita casalinga su 38 giornate (es. Inter/Milan, Lazio/Roma, Juventus/Torino, o incroci economici come Como/Monza o Parma/Udinese).
- **Filtro Big 7**: selezione rapida dei portieri delle prime 7 squadre del campionato.
- **Portieri da Modificatore**: contrassegno dei portieri con Media Voto pura $\ge 6.20$.

---

## 2. War Room Attaccanti

La **War Room Attaccanti** è la plancia strategica per il reparto più costoso del Fantacalcio:
- **Tabellone Matrice 8 Squadre**: mostra in tempo reale crediti residui, attaccanti acquistati e slot ancora vuoti.
- **Rilancio Massimo Consentito (Max Bid)**: calcolo dei crediti massimi che ogni avversario può spendere su un singolo calciatore, garantendo di riservare almeno 1 credito per ciascuno degli altri slot ancora scoperti.
- **Spesa Media Residua per Slot A**: budget disponibile diviso per gli attaccanti ancora da comprare.
- **Classifica Potere d'Acquisto**: ordinamento dinamico delle squadre dalla più ricca alla più debole finanziariamente.

---

## 3. Data Entry Rapido & Scorciatoie da Tastiera

Per garantire l'assegnazione rapida del calciatore in 2 secondi senza errori:
- **8 Bottoni Squadra Giganti**: con codice colore della squadra, crediti residui e slot occupati.
- **Scorciatoie da Tastiera**:
  | Tasto | Azione |
  |---|---|
  | `1 - 8` | Seleziona la squadra acquirente corrispondente |
  | `Freccia Su` / `Freccia Giù` | Aumenta / diminuisce il prezzo di 1 credito |
  | `PageUp` / `PageDown` | Aumenta / diminuisce il prezzo di 5 crediti |
  | `Enter` | Assegna definitivamente il calciatore alla squadra attiva |
  | `Ctrl + Z` | Annulla immediatamente l'ultima transazione (Undo) |

---

## 4. Chiamata Alfabetica & Coda Invenduti

- **Navigazione Alfabetica**: scorrimento automatico A-Z dei calciatori di ciascun ruolo (P, D, C, A).
- **Tasto Passa / Invenduto**: archivia istantaneamente il giocatore nella lista degli invenduti senza assegnarlo.
- **Chiamata Libera Finale**: al termine del giro alfabetico, accesso immediato agli invenduti per l'asta libera su richiesta di chi ha ancora slot scoperti.
