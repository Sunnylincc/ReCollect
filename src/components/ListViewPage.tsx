import React, { useState, useEffect } from 'react';
import { useGame } from './GameContext';
import { ArrowRight, Clock } from 'lucide-react';
import { ItemImage } from './ItemImage';

export function ListViewPage() {
  const { state, dispatch } = useGame();
  const { shoppingList, settings } = state;
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          dispatch({ type: 'SET_PAGE', page: 'intro' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const handleContinue = () => {
    dispatch({ type: 'SET_PAGE', page: 'intro' });
  };

  const progressPercentage = ((30 - timeLeft) / 30) * 100;

  return (
    <div className="min-h-screen bg-[#f4faff] flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 w-full flex items-center justify-between px-6 h-16 bg-[#f4faff]/90 backdrop-blur-xl z-50 shadow-sm">
        <h1 className="text-[#003194] font-headline font-bold text-xl tracking-tight">Memory Phase</h1>
        {/* Timer pill */}
        <div className="flex items-center gap-2 bg-[#e8f6ff] px-4 py-2 rounded-full border border-[#d3e5f1]">
          <Clock className="h-4 w-4 text-[#003194]" />
          <span className={`text-base font-headline font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-[#003194]'}`}>
            {timeLeft}s
          </span>
        </div>
      </header>

      <main className="flex-grow pb-36 px-5 max-w-2xl mx-auto w-full">
        {/* Heading */}
        <section className="mb-8 text-center mt-4">
          <h2 className="text-[#0c1e26] font-headline font-extrabold text-2xl md:text-3xl tracking-tight leading-tight mb-3">
            Take a moment to remember these items.
          </h2>
          <div className="w-14 h-1.5 bg-[#d3e5f1] rounded-full mx-auto" />
        </section>

        {/* Timer progress bar */}
        <div className="mb-8 bg-[#d3e5f1] rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${100 - progressPercentage}%`,
              background: timeLeft <= 10
                ? 'linear-gradient(90deg, #ba1a1a, #e53935)'
                : 'linear-gradient(90deg, #003194, #0a46c4)',
            }}
          />
        </div>

        {/* Items Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {shoppingList.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                border: '3px solid transparent',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
              }}
            >
              {/* Image area ~70% of card */}
              <div style={{ position: 'relative', paddingBottom: '70%', width: '100%', overflow: 'hidden', borderRadius: '13px 13px 0 0', flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <ItemImage name={item.name} imageUrl={item.image} />
                </div>
              </div>
              {/* Item name */}
              <div style={{ padding: '10px 8px', textAlign: 'center' }}>
                <span style={{ color: '#0d2260', fontWeight: 700, fontSize: '15px', lineHeight: 1.2, display: 'block' }}>
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions hint */}
        <div className="mt-8 bg-[#e8f6ff] rounded-2xl p-5 flex items-start gap-3 border border-[#d3e5f1]">
          <div className="w-8 h-8 rounded-xl bg-[#003194] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <p className="text-[#0c1e26] font-semibold text-base">How it works</p>
            <p className="text-[#434654] text-sm mt-0.5 leading-relaxed">
              Study these {shoppingList.length} items carefully. You'll need to find them in the store
              {settings.hintsEnabled ? `, with up to ${settings.maxHints} hints available` : ''}.
              {settings.timerEnabled ? ` Complete shopping within ${settings.timerMinutes} minute${settings.timerMinutes > 1 ? 's' : ''}.` : ''}
            </p>
          </div>
        </div>
      </main>

      {/* Fixed bottom CTA */}
      <div className="sticky bottom-0 w-full bg-[#f4faff]/95 backdrop-blur-xl px-5 pt-4 pb-8 flex justify-center z-40 border-t border-[#d3e5f1]/50">
        <button
          onClick={handleContinue}
          className="btn-primary max-w-md text-xl"
        >
          I'm Ready
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
