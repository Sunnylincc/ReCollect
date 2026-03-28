import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './components/GameContext';
import { HomePage } from './components/HomePage';
import { ListViewPage } from './components/ListViewPage';
import { StoreIntroPage } from './components/StoreIntroPage';
import { GamePage } from './components/GamePage';
import { ResultsPage } from './components/ResultsPage';
import { StatsPage } from './components/StatsPage';
import { AuthPage } from './components/AuthPage';
import { AdminDashboard } from './components/AdminDashboard';
import { supabase, signOut } from './utils/supabase/client';
import { User } from '@supabase/supabase-js';

/** Constrains the app to a 430px phone-width column, centered on desktop. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-300 flex justify-center items-start">
      <div
        className="relative w-full bg-[#f4faff] shadow-2xl overflow-x-hidden"
        style={{ maxWidth: 430, minHeight: '100vh' }}
      >
        {children}
      </div>
    </div>
  );
}

function GameRouter({
  isDemoMode,
  showAdmin,
  setShowAdmin,
  onExit,
}: {
  isDemoMode: boolean;
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
  onExit: () => void;
}) {
  const { state, isLoading, loadUserData } = useGame();

  useEffect(() => {
    if (!isDemoMode) loadUserData();
  }, [isDemoMode]);

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  if (isLoading && !isDemoMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4faff]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#003194] mb-5" />
        <p className="text-[#434654] text-lg font-medium">Loading your game data…</p>
      </div>
    );
  }

  switch (state.currentPage) {
    case 'home':
      return <HomePage isDemoMode={isDemoMode} onShowAdmin={() => setShowAdmin(true)} />;
    case 'list':
      return <ListViewPage />;
    case 'intro':
      return <StoreIntroPage />;
    case 'game':
      return <GamePage />;
    case 'results':
      return <ResultsPage />;
    case 'stats':
      return <StatsPage />;
    default:
      return <HomePage isDemoMode={isDemoMode} onShowAdmin={() => setShowAdmin(true)} />;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [localAuth, setLocalAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setDemoMode(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleExit = async () => {
    if (demoMode) {
      setDemoMode(false);
      window.location.reload();
    } else {
      try {
        await signOut();
        window.location.reload();
      } catch (error) {
        console.error('Sign out failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <PhoneFrame>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#003194] mb-5" />
          <p className="text-[#434654] text-lg font-medium">Loading…</p>
        </div>
      </PhoneFrame>
    );
  }

  if (!user && !demoMode && !localAuth) {
    return (
      <PhoneFrame>
        <AuthPage onAuthSuccess={() => setLocalAuth(true)} onDemoMode={() => setDemoMode(true)} />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <GameProvider isDemoMode={demoMode}>
        <GameRouter
          isDemoMode={demoMode}
          showAdmin={showAdmin}
          setShowAdmin={setShowAdmin}
          onExit={handleExit}
        />
      </GameProvider>
    </PhoneFrame>
  );
}
