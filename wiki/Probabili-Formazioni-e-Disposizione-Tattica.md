# 📋 Probabili Formazioni & Disposizione Tattica

Il modale delle **Probabili Formazioni** visualizza in tempo reale le formazioni previste per tutte le partite del turno di Serie A, posizionando i calciatori sul terreno di gioco secondo lo schema tattico ufficiale di ciascun allenatore.

---

## 1. Disposizione Tattica Reale sul Campo

Per ogni partita del turno (es. *Milan vs Lazio*), il modulo renderizza:
- **Squadra di Casa e Squadra Ospite** affiancate o sovrapposte (a seconda dell'orientamento dello schermo).
- **Modulo Tattico Ufficiale**: mappatura delle posizioni estratta dal database `teamTactics.ts` (es. 3-5-2 dell'Inter, 4-2-3-1 del Milan, 3-4-2-1 dell'Atalanta).
- **Coordinate Geometriche sul Campo**: ogni slot ha coordinate X e Y che riflettono fedelmente l'occupazione dello spazio (terzini larghi, braccetti di difesa, registi bassi, mezze ali, ali larghe e punte d'area).

---

## 2. Evidenziazione Calciatori della Propria Rosa

Quando l'utente consulta le formazioni probabili:
- I calciatori appartenenti alla **propria fanta-squadra** vengono immediatamente messi in risalto con:
  - Bordo luminoso e anello color ambra/oro ad alta visibilità.
  - Badge dedicato con il nome della propria squadra di fanta.
  - Indicazione dello status previsto: **Titolare sicuro**, **Ballottaggio aperto** (con percentuale e nome del rivale), oppure **Panchina**.
- Questo consente di valutare in 3 secondi quanti propri calciatori scenderanno in campo nella gara specifica.

---

## 3. Navigazione a Gesti & Swipe Touch

Per scorrere comodamente tra tutte le 10 partite della giornata di campionato:
- **Su Smartphone e Tablet (Touch)**: supporto al gesto di **Swipe orizzontale** (scorrimento a sinistra per la partita successiva, scorrimento a destra per la precedente).
- **Su Desktop (Mouse/Tastiera)**: pulsanti freccia direzionale "Gara Precedente" e "Gara Successiva" con transizione fluida e indicatore numerico del match (es. Match 4 di 10).

---

## 4. Scheda Personale da Campo

Cliccando su qualunque giocatore presente nel campo delle formazioni probabili (sia proprio sia avversario):
- Si apre direttamente il **Report Statistico Personale del Calciatore**.
- Vengono mostrati: voti, fantamedia, titolarità, cronistoria e il nome della squadra di fanta che ne detiene il cartellino (o il cartellino `FREE`).
