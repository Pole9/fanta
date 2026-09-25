# FantaAsta Live Master

Applicazione web ultra-reattiva progettata specificamente per lo svolgimento rapido dell'asta del Fantacalcio (8 squadre, 300 crediti, rosa standard 3P - 8D - 8C - 5A, modificatore di difesa attivo).

## Avvio Rapido
1. Fai doppio clic su `start.bat` oppure esegui da terminale:
   ```bash
   npm run dev
   ```
2. Apri nel browser l'indirizzo indicato (tipicamente `http://localhost:5173`).

---

## Funzionalità Implementate

### 1. Import Listone & Statistiche Fantacalcio.it
- Supporto diretto per file Excel `.xlsx`, `.xls` e `.csv` esportati da Fantacalcio.it (Quotazioni e Statistiche).
- Mappatura automatica dei ruoli (Classic P, D, C, A), Quotazioni, FVM, Media Voto (MV), FantaMedia (FM), Gol, Assist, Rigori calciati/segnati e malus cartellini.
- Include un dataset di default Serie A precaricato per test immediati senza dover reperire subito un file.

### 2. Chiamata Alfabetica & Coda Invenduti (Fine Ruolo)
- Cursore automatico alfabetico per ruolo con barra di salto rapido A-Z.
- **Tasto gigante "Passa / Invenduto"**: se nessuno rilancia partendo da 0, il calciatore viene archiviato nella coda "Invenduti a fine ruolo".
- **Chiamata Libera**: a fine giro alfabetico, accesso immediato alla lista degli invenduti per avviare le aste su richiesta per chi ha ancora slot vuoti.

### 3. Schermata Dedicata: War Room Attaccanti
- Tabellone strategico a matrice per tutte le 8 squadre:
  - Crediti residui in tempo reale.
  - Attaccanti già acquistati (con prezzo speso) e slot ancora da completare.
  - **Rilancio Massimo consentito (Max Bid)** per ciascun avversario.
  - **Spesa media residua per slot A**: calcolo del budget disponibile diviso per gli attaccanti ancora da comprare (al netto dei crediti da riservare agli altri ruoli).
  - Classifica delle squadre per potere d'acquisto residuo.
- Lista interattiva dei migliori attaccanti ancora disponibili con chiamata rapida ad 1 click.

### 4. Data Entry Rapido & Bottoni Giganti (Anti-Errore)
- 8 pulsanti squadra di grandi dimensioni ad alto contrasto con crediti e slot visibili.
- Incrementi rapidi (+1, +2, +5, +10, -1, -5, Reset).
- **Scorciatoie da tastiera**:
  - `1 - 8`: Seleziona la squadra corrispondente.
  - `Freccia Su / Freccia Giù`: Incrementa o decrementa il prezzo di 1 credito.
  - `PageUp / PageDown`: Varia il prezzo di 5 crediti.
  - `Enter`: Assegna il calciatore alla squadra selezionata.
  - `Ctrl + Z`: Annulla istantaneamente l'ultima azione (Undo).

### 5. Modificatore della Difesa
- Evidenziazione automatica dei difensori con Media Voto (MV pura) $\ge 6.0$.
- Filtro rapido dedicato "Modificatore" nel Listone.
- Monitoraggio nella schermata rose del numero di difensori da modificatore posseduti da ciascuna squadra.

### 6. Persistenza & Esportazione
- Salvataggio automatico continuo in `localStorage` ad ogni click (anti-chiusura accidentale del browser).
- Esportazione rose finali e riepilogo bilanci in formato Excel `.xlsx`.
- Funzione di backup completo della sessione in formato `.json`.
