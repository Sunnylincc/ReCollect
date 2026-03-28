import React from 'react';
import { useGame } from './GameContext';
import { Activity, BarChart2, User, Puzzle } from 'lucide-react';

interface HomePageProps {
  isDemoMode?: boolean;
  onShowAdmin?: () => void;
  onExitToLogin?: () => void;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatMemTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

// ── Custom Slider ────────────────────────────────────────────────────────────

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

function CustomSlider({ value, min, max, step = 1, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="home-slider"
      style={{
        background: `linear-gradient(to right, #0c1e3d ${pct}%, #d5dae8 ${pct}%)`,
      }}
    />
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function HomePage({ isDemoMode = false }: HomePageProps) {
  const { state, dispatch } = useGame();
  const { settings, gameHistory } = state;

  const userName = localStorage.getItem('remind_user_name') || 'Friend';
  const lastGame = gameHistory.length > 0 ? gameHistory[gameHistory.length - 1] : null;

  const mistakes = lastGame ? lastGame.itemsTotal - lastGame.itemsCorrect : null;
  const timeTaken = lastGame ? `${Math.round(lastGame.timeTaken)}s` : null;

  const updateSettings = (key: keyof typeof settings, value: number | boolean) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { [key]: value } });
  };

  const handleHintPill = (count: number) => {
    if (count === 0) {
      dispatch({ type: 'UPDATE_SETTINGS', settings: { hintsEnabled: false, maxHints: 0 } });
    } else {
      dispatch({ type: 'UPDATE_SETTINGS', settings: { hintsEnabled: true, maxHints: count } });
    }
  };

  const currentHints = settings.hintsEnabled ? settings.maxHints : 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f4ff',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 80,
      }}
    >
      {/* Slider global styles */}
      <style>{`
        .home-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          display: block;
        }
        .home-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #0c1e3d;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        }
        .home-slider::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #0c1e3d;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        }
      `}</style>

      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 20px 10px',
        }}
      >
        {/* Hamburger */}
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            color: '#0c1e3d',
            fontSize: 22,
            lineHeight: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <span style={{ display: 'block', width: 22, height: 2.5, background: '#0c1e3d', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 22, height: 2.5, background: '#0c1e3d', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 22, height: 2.5, background: '#0c1e3d', borderRadius: 2 }} />
        </button>

        {/* Greeting */}
        <span
          style={{
            color: '#0c1e3d',
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: -0.2,
          }}
        >
          Hello, {userName}
        </span>

        {/* Blue ? circle */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#1a3faa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          ?
        </div>
      </header>

      {/* Scrollable content */}
      <main style={{ flex: 1, padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Last Session Card */}
        <div
          style={{
            background: '#e8eef8',
            borderRadius: 20,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: '#8892aa',
                textTransform: 'uppercase',
                margin: '0 0 10px',
              }}
            >
              Last Session
            </p>
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#0c1e3d',
                    lineHeight: 1,
                  }}
                >
                  {timeTaken ?? '--'}
                </div>
                <div style={{ fontSize: 12, color: '#8892aa', marginTop: 4 }}>Time taken</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#4444ff',
                    lineHeight: 1,
                  }}
                >
                  {mistakes !== null ? mistakes : '--'}
                </div>
                <div style={{ fontSize: 12, color: '#8892aa', marginTop: 4 }}>Mistakes</div>
              </div>
            </div>
          </div>

          {/* Graph icon circle */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#f5d0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Activity style={{ color: '#9b3a9b', width: 26, height: 26 }} />
          </div>
        </div>

        {/* Section header */}
        <div style={{ marginTop: 4 }}>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#0c1e3d',
              margin: '0 0 6px',
              letterSpacing: -0.4,
            }}
          >
            Customize your journey
          </h2>
          <p style={{ fontSize: 15, color: '#8892aa', margin: 0 }}>
            Tailor the challenge to your comfort today.
          </p>
        </div>

        {/* Settings Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: '22px 20px',
            boxShadow: '0 2px 12px rgba(0,0,50,0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {/* 1. Memorization Time */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#0c1e3d' }}>Memorization Time</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#1a3faa' }}>
                {formatMemTime(settings.memorizationTime ?? 90)}
              </span>
            </div>
            <CustomSlider
              value={settings.memorizationTime ?? 90}
              min={30}
              max={180}
              step={10}
              onChange={(v) => updateSettings('memorizationTime', v)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#9aa0b2', fontWeight: 600 }}>30S</span>
              <span style={{ fontSize: 11, color: '#9aa0b2', fontWeight: 600 }}>3M</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#eef0f6', margin: '0 -4px' }} />

          {/* 2. Shopping Time */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#0c1e3d' }}>Shopping Time</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#1a3faa' }}>{settings.timerMinutes}m</span>
            </div>
            <CustomSlider
              value={settings.timerMinutes}
              min={1}
              max={5}
              step={1}
              onChange={(v) => {
                updateSettings('timerMinutes', v);
                updateSettings('timerEnabled', true);
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#9aa0b2', fontWeight: 600 }}>1M</span>
              <span style={{ fontSize: 11, color: '#9aa0b2', fontWeight: 600 }}>5M</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#eef0f6', margin: '0 -4px' }} />

          {/* 3. Number of Items */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#0c1e3d' }}>Number of Items</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#1a3faa' }}>{settings.listLength}</span>
            </div>
            <CustomSlider
              value={settings.listLength}
              min={3}
              max={10}
              step={1}
              onChange={(v) => updateSettings('listLength', v)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#9aa0b2', fontWeight: 600 }}>3</span>
              <span style={{ fontSize: 11, color: '#9aa0b2', fontWeight: 600 }}>10</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#eef0f6', margin: '0 -4px' }} />

          {/* 4. Number of Hints — pill selector */}
          <div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#0c1e3d', display: 'block' }}>
                Number of Hints
              </span>
              <span style={{ fontSize: 12, color: '#9aa0b2' }}>Available during your journey</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {[0, 1, 2, 3].map((n) => {
                const active = currentHints === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleHintPill(n)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 16,
                      background: active ? '#0c1e3d' : '#e8eaf0',
                      color: active ? '#ffffff' : '#8892aa',
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'START_GAME' })}
          style={{
            width: '100%',
            height: 60,
            background: '#0c1e3d',
            color: '#ffffff',
            border: 'none',
            borderRadius: 50,
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 0.2,
            marginTop: 4,
          }}
        >
          Start Shopping →
        </button>

        {/* Quote */}
        <p
          style={{
            textAlign: 'center',
            color: '#9aa0b2',
            fontSize: 14,
            fontStyle: 'italic',
            margin: '0 8px',
            lineHeight: 1.5,
          }}
        >
          "Small steps every day lead to big discoveries."
        </p>
      </main>

      {/* Bottom nav bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          background: '#ffffff',
          borderTop: '1px solid #e8eaf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '10px 0 14px',
          zIndex: 50,
        }}
      >
        {/* Home – active */}
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            color: '#1a3faa',
            padding: '4px 16px',
          }}
        >
          <Puzzle style={{ width: 22, height: 22 }} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>Home</span>
        </button>

        {/* Progress */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_PAGE', page: 'stats' })}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            color: '#9aa0b2',
            padding: '4px 16px',
          }}
        >
          <BarChart2 style={{ width: 22, height: 22 }} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>Progress</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            color: '#9aa0b2',
            padding: '4px 16px',
          }}
        >
          <User style={{ width: 22, height: 22 }} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>Profile</span>
        </button>
      </nav>
    </div>
  );
}
