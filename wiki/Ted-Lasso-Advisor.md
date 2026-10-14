# 🧠 Ted Lasso Advisor & Calcolo Formazioni

**Ted Lasso Advisor** è il modulo di intelligenza tattica che analizza la rosa della propria squadra del Fantacalcio, incrocia i dati con il turno di Serie A in programma e consiglia lo schieramento ottimale (11 titolari + panchina ordinata).

---

## 1. Algoritmo Ted Score

L'algoritmo proprietario assegna ad ogni calciatore un punteggio ponderato denominato **Ted Score** (scala 0 - 100), calcolato combinando:
1. **FantaMedia & Media Voto Stagionale**: rendimento reale nei match a voto.
2. **Titolarità Gazzetta**: percentuale stimata di partenza dal 1' minuto (es. 95% titolare fisso, 60% ballottaggio, 20% panchina).
3. **Fattore Match & Difficoltà Avversaria**: coefficiente calcolato in base alla forza della squadra rivale e al fattore campo (Casa vs Trasferta).
4. **Status Disciplinare & Sanitario**: penalizzazioni o esclusioni automatiche per infortuni accertati o squalifiche.
5. **Bonus Speciali**: bonus aggiuntivo per tiratori di rigori e piazzati.

---

## 2. Selezione Modulo & Schieramento

Ted Lasso supporta i moduli classici:
- **3-5-2** (centrocampo a 5 per dominare i bonus inserimento)
- **3-4-3** (tridente offensivo ad alto potenziale)
- **4-3-3** (ideale per attivare il modificatore di difesa con attaccanti esterni)
- **4-4-2** (equilibrio tattico classico)
- **4-2-3-1** (difesa a 4 con ali offensive)
- **3-4-1-2**, **4-5-1**, **3-5-1-1**

L'utente può:
- Accettare il modulo consigliato automaticamente da Ted.
- Selezionare manualmente un modulo differente: la formazione sul campo viene istantaneamente ricalcolata e riposizionata per rispettare la nuova disposizione.
- Effettuare **swap manuali** (scambi) tra titolari e panchinari cliccando direttamente sulle maglie nel campetto.

---

## 3. Calcolo Rigoroso del Modificatore di Difesa

L'algoritmo valuta se conviene passare da una difesa a 3 a una difesa a 4 per raccogliere i punti bonus del modificatore:
- **Criterio Ufficiale**: media voto pura (senza bonus/malus fantacalcio) dei 3 migliori difensori + il portiere (o dei 4 difensori a seconda della regola attiva).
- **Fasce di Punteggio**:
  - Media $\ge 6.00$ e $< 6.50$: **+1 punto**
  - Media $\ge 6.50$ e $< 7.00$: **+3 punti**
  - Media $\ge 7.00$: **+6 punti**
- Se la combinazione di difensori garantisce una probabilità di modificatore superiore al valore atteso di un quarto centrocampista o terzo attaccante, Ted consiglia la difesa a 4 con il badge "CONSIGLIATO MODIFICATORE".

---

## 4. Simulatore Campo & Panchina Ordinata

- **Campetto Interattivo**: rendering SVG/CSS con le coordinate esatte di ogni calciatore per ruolo e posizione (es. terzino sinistro, difensore centrale, mediano, mezzala, trequartista, ala, punta centrale).
- **Panchina Ordinata**:
  - Secondo portiere designato
  - Difensori ordinati per Ted Score decrescente
  - Centrocampisti ordinati per Ted Score decrescente
  - Attaccanti ordinati per Ted Score decrescente
- **Copia Formazione**: pulsante rapido per copiare negli appunti l'undici titolare e la panchina in formato testo formattato pronto da incollare su WhatsApp o nell'app della lega.
