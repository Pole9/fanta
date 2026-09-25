import React from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import { Header } from './components/Header';
import { AlphabeticalCaller } from './components/AlphabeticalCaller';
import { GoalkeepersWarRoom } from './components/GoalkeepersWarRoom';
import { AttackersWarRoom } from './components/AttackersWarRoom';
import { TeamsOverview } from './components/TeamsOverview';
import { ListoneView } from './components/ListoneView';
import { SettingsModal } from './components/SettingsModal';
import { HomeView } from './components/HomeView';
import { TedLassoView } from './components/TedLassoView';

const MainContent: React.FC = () => {
  const { activeView } = useAuction();

  return (
    <main className="max-w-[1850px] w-full mx-auto px-2 sm:px-3 py-1 flex-1 overflow-hidden flex flex-col min-h-0">
      {activeView === 'home' && <HomeView />}
      {activeView === 'ted_lasso' && <TedLassoView />}
      {activeView === 'goalkeepers' && <GoalkeepersWarRoom />}
      {activeView === 'auction' && <AlphabeticalCaller />}
      {activeView === 'attackers' && <AttackersWarRoom />}
      {activeView === 'teams' && <TeamsOverview />}
      {activeView === 'listone' && <ListoneView />}
      {activeView === 'settings' && <SettingsModal />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <AuctionProvider>
      <div className="h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none overflow-hidden">
        <Header />
        <MainContent />

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
    </AuctionProvider>
  );
};

export default App;
