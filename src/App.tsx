import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import { Header } from './components/Header';

// Lazy loading per ottimizzare il bundle ed evitare il caricamento simultaneo di tutte le schermate
const AlphabeticalCaller = lazy(() => import('./components/AlphabeticalCaller').then(m => ({ default: m.AlphabeticalCaller })));
const GoalkeepersWarRoom = lazy(() => import('./components/GoalkeepersWarRoom').then(m => ({ default: m.GoalkeepersWarRoom })));
const AttackersWarRoom = lazy(() => import('./components/AttackersWarRoom').then(m => ({ default: m.AttackersWarRoom })));
const TeamsOverview = lazy(() => import('./components/TeamsOverview').then(m => ({ default: m.TeamsOverview })));
const ListoneView = lazy(() => import('./components/ListoneView').then(m => ({ default: m.ListoneView })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const HomeView = lazy(() => import('./components/HomeView').then(m => ({ default: m.HomeView })));
const TedLassoView = lazy(() => import('./components/TedLassoView').then(m => ({ default: m.TedLassoView })));
const TedLassoMobileView = lazy(() => import('./components/TedLassoMobileView').then(m => ({ default: m.TedLassoMobileView })));

const LoadingFallback: React.FC = () => (
  <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Caricamento modulo...</span>
    </div>
  </div>
);

const checkIsMobilePath = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return path.startsWith('/mobile') || hash.includes('mobile') || search.includes('mode=mobile');
};

const AppLayout: React.FC = () => {
  const { activeView } = useAuction();
  const [isMobileRoute, setIsMobileRoute] = useState<boolean>(checkIsMobilePath);

  useEffect(() => {
    // Normalizza l'URL da #/mobile a /mobile pulito se necessario
    if (window.location.hash.includes('mobile') && window.history.replaceState) {
      window.history.replaceState(null, '', '/mobile');
    }

    const handleLocationChange = () => {
      setIsMobileRoute(checkIsMobilePath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Se siamo nella route mobile (/mobile): visualizza SOLO la sezione Ted Lasso da cellulare
  if (isMobileRoute) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <TedLassoMobileView />
      </Suspense>
    );
  }

  return (
    <div className="h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none overflow-hidden">
      {activeView !== 'ted_lasso' && <Header />}
      
      <main className="max-w-[1850px] w-full mx-auto px-2 sm:px-3 py-1 flex-1 overflow-hidden flex flex-col min-h-0">
        <Suspense fallback={<LoadingFallback />}>
          {activeView === 'home' && <HomeView />}
          {activeView === 'ted_lasso' && <TedLassoView />}
          {activeView === 'goalkeepers' && <GoalkeepersWarRoom />}
          {activeView === 'auction' && <AlphabeticalCaller />}
          {activeView === 'attackers' && <AttackersWarRoom />}
          {activeView === 'teams' && <TeamsOverview />}
          {activeView === 'listone' && <ListoneView />}
          {activeView === 'settings' && <SettingsModal />}
        </Suspense>
      </main>

      {/* FOOTER ULTRA-COMPATTO A 1 RIGA */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-0.5 px-3 text-[10px] text-slate-500 flex-shrink-0">
        <div className="max-w-[1850px] mx-auto flex items-center justify-between gap-2">
          <span>8 Squadre • 300 • Set 3-8-8-6 (25 slot) • Modificatore Difesa</span>
          <div className="hidden sm:flex items-center gap-2">
            <span>Tasti: <strong className="text-slate-400">1-8</strong> squadra</span>
            <span>•</span>
            <span><strong className="text-slate-400">↑ / ↓</strong> prezzo</span>
            <span>•</span>
            <span><strong className="text-slate-400">← / →</strong> A-Z</span>
            <span>•</span>
            <span><strong className="text-slate-400">Enter</strong> assegna</span>
            <span>•</span>
            <span><strong className="text-slate-400">Ctrl+Z</strong> annulla</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuctionProvider>
      <AppLayout />
    </AuctionProvider>
  );
};

export default App;
