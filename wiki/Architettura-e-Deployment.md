# 📱 Architettura, PWA, Landscape & Deployment

Documentazione dell'infrastruttura software, delle scelte architetturali e della pipeline di deployment di **FantaAsta Live Master**.

---

## 1. Stack Tecnologico

- **Runtime & Framework**: React 18 con TypeScript 5 (strict typing).
- **Bundler & Build Tool**: Vite 6 con code-splitting e lazy loading dei chunk pesanti.
- **Styling**: Tailwind CSS v3 con estensioni cromatiche e supporto dark/light mode ad alto contrasto.
- **Iconografia**: Lucide React.
- **Elaborazione Dati**: Libreria `xlsx` per parsing ed esportazione fogli di calcolo.

---

## 2. Modalità Mobile, PWA & Landscape Totale

L'applicazione è progettata secondo i principi Mobile-First e Responsive Design:
- **Landscape Totale**: l'intera app è progettata per funzionare sia in orientamento verticale (Portrait) che orizzontale (Landscape). In orizzontale, le viste del campetto e le probabili formazioni sfruttano la larghezza aggiuntiva per mostrare entrambe le squadre affiancate.
- **Gestione Tasto Indietro (History API)**:
  - L'applicazione intercetta gli eventi `popstate` e la navigazione cronologica.
  - Premendo il tasto "indietro" (hardware o browser) non si esce dall'applicazione, ma si chiude il modale attivo o si ritorna alla vista precedente.
- **PWA (Progressive Web App)**:
  - Manifest dedicato, icone e viewport configurato per un'esperienza nativa senza barre del browser superflue.

---

## 3. Persistenza & Sicurezza dei Dati

- **Salvataggio Continuo in LocalStorage**: ogni assegnazione, svincolo, modifica di budget o override di formazione viene salvata istantaneamente nel browser.
- **Nessuna Perdita di Dati**: in caso di chiusura accidentale della scheda o crash del browser, al riavvio lo stato della sessione viene ripristinato esattamente al secondo precedente.
- **Backup & Restore**: possibilità di esportare l'intero database della lega in formato `.json` e di esportare le rose finali in `.xlsx`.

---

## 4. Pipeline di Deployment (Cloudflare Pages)

- **Hosting**: Cloudflare Pages globale ad altissima velocità e bassa latenza.
- **Deploy Automatico**: ogni commit pushato sul branch `main` del repository GitHub `Pole9/fanta` attiva automaticamente la build (`npm run build`) e la pubblicazione globale sul dominio ufficiale:
  - **URL di Produzione**: [fanta.poletti.page](https://fanta.poletti.page)
- **Routing SPA**: file `_redirects` in `public/` con regola `/* /index.html 200` per garantire il routing corretto di tutte le pagine anche su ricaricamento diretto.
