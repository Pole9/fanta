# 🔄 Gestione Rose & Aste di Riparazione In-App

Questo modulo consente di aggiornare le rose delle 8 squadre e il mercato dei calciatori svincolati nel corso delle settimane senza toccare il codice sorgente né passare dallo sviluppo.

---

## 1. Tasto di Caricamento Diretto In-App

Nell'interfaccia utente è presente il pulsante dedicato **"Carica Rose / Asta Riparazione"** (icona foglio di calcolo verde `FileSpreadsheet`):
- Consente di selezionare direttamente dal proprio computer o dispositivo mobile il file Excel `.xlsx`.
- Non richiede riavvii del server, commit git o rebuild dell'applicazione.

---

## 2. Formato del File Excel Accettato

L'applicazione supporta i template standard contenenti:
- Fogli con le rose delle 8 squadre della lega (es. *Scarsenal*, *ABIDJAN*, *Gallosballo*, *Brancamenta*, *LONGOBARDA*, ecc.).
- Colonne previste:
  - Ruolo (`P`, `D`, `C`, `A` o Mantre `POR`, `DD`, `DC`, `DS`, `E`, `M`, `C`, `T`, `W`, `A`, `PC`)
  - Nome calciatore
  - Squadra Serie A
  - Prezzo di acquisto / Costo sostenuto
- Foglio calciatori svincolati / Lista mercato.

---

## 3. Elaborazione & Ricalcolo Automatico

Al momento del caricamento del file:
1. **Verifica Integrità**: il parser controlla che i dati siano validi e non contengano duplicazioni di calciatori tra squadre diverse.
2. **Aggiornamento Bilanci**: i crediti spesi e i crediti residui vengono ricalcolati per ciascuna squadra partendo dal budget iniziale di 300 crediti (o budget personalizzato).
3. **Svincolati & Cartellini FREE**: tutti i calciatori della Serie A non presenti nelle rose vengono contrassegnati automaticamente come `FREE` e resi disponibili per le sessioni di riparazione.
4. **Persistenza Immediata**: i nuovi dati vengono salvati nel `localStorage` del browser, rimanendo attivi anche in caso di ricaricamento della pagina o chiusura della sessione.
