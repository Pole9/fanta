# 📊 Grafico Prestazioni, Barre Impilate e Tutto Schermo

Il componente **PlayerPerformanceChart** rappresenta la cronistoria completa di tutte le 38 giornate di campionato per ogni calciatore.

---

## 1. Struttura a Barre Impilate (Stacked Bar Chart)

In ciascuna colonna di giornata, l'istogramma impila con precisione millimetrica i diversi elementi che compongono il punteggio fantacalcistico:
1. **Base (Voto Puro)**:
   - Rappresenta il voto assegnato dai pagellisti (scala 0 - 10).
   - Riflette lo status della presenza:
     - 🟩 **Verde chiaro solido**: Titolare che ha giocato l'intera gara (90').
     - 🟩 **Verde a righe diagonali**: Titolare sostituito a gara in corso.
     - 🟨 **Giallo solido**: Calciatore subentrato dalla panchina.
     - 🟪 **Viola solido**: Uscito per infortunio durante la gara.
     - **SV**: Sigla per subentrato senza voto.
     - **INF**: Sigla per assente per infortunio certificato.
2. **Segmento Malus (Rosso)**:
   - Impilato in **rosso vivo** (`#ef4444`) se il calciatore ha subito penalizzazioni:
     - Ammonizione: `-0.5` punti
     - Espulsione: `-1.0` punti
     - Gol subito (Portieri): `-1.0` punti
3. **Segmento Bonus (Ciano / Sky Blue)**:
   - Impilato in cima in **ciano brillante** (`#06b6d4` / `#38bdf8`) per le azioni decisive:
     - Gol segnato: `+3.0` punti
     - Assist vincente: `+1.0` punti
     - Rigore parato: `+3.0` punti

L'altezza totale della barra raggiunge visivamente la somma dei punteggi rispetto alla scala dell'asse Y (da 0 a 14, con soglia della sufficienza tratteggiata a 6).

---

## 2. Callout Contestuale Risultato Partita

Al passaggio del mouse o al tocco di qualsiasi giornata (da 1 a 38), sopra la barra compare un callout con beccuccio orientato verso la barra:
- **Partita e Risultato Ufficiale**: es. `MIL-LAZ 3-2` per le giornate disputate (o `MIL-JUV` per le future).
- **Squadra Avversaria & Campo**: nome dell'avversaria e indicazione Casa o Trasferta.
- **Riepilogo Voti**: Voto base, dettaglio numerico di Bonus e Malus, FantaVoto finale calcolato.
- **Minutaggio / Condizione**: Titolare 90', Titolare sost., Subentrato, SV, INF.

---

## 3. Modalità Tutto Schermo (Portal HD)

Cliccando sul pulsante **"Tutto schermo"** presente nell'intestazione:
- Il grafico viene proiettato in un overlay a schermo intero ad altissima definizione montato via `createPortal` su `document.body`.
- **Vantaggi della visualizzazione Tutto Schermo**:
  - Altezza della griglia maggiorata fino a **340px**.
  - Barre e spaziature allargate per una leggibilità perfetta anche da lontano.
  - Asse X con marcatura delle giornate chiave (1, 5, 10, 15, 20, 25, 30, 35, 38).
  - Scheda inferiore con il tabellino espanso della singola giornata selezionata.
  - Uscita rapida con pulsante **"Riduci"**, tasto **X** o tasto da tastiera **ESC**.

---

## 4. Architettura Anti-Glitch

Per garantire la massima stabilità visiva:
- L'header ha un contenitore di preview ad altezza e larghezza fissa che impedisce salti di layout al passaggio del cursore.
- Il contenitore del grafico ha uno spazio superiore protetto (`pt-24`) che alloggia comodamente il callout senza collisioni o coperture di pulsanti.
- Il callout è reso completamente non interattivo per il cursore (`pointer-events-none`) evitando sfarfallii (flickering).
