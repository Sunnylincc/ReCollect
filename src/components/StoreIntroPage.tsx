import React from 'react';
import { useGame } from './GameContext';
import {
  ShoppingCart,
  Info,
  ClipboardList,
  Store,
  Lightbulb,
  Timer,
  ShoppingBag,
  BarChart2,
  Settings,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import samImage from '@/assets/sam.png';

export function StoreIntroPage() {
  const { state, dispatch } = useGame();

  const handleBack = () => {
    dispatch({ type: 'SET_PAGE', page: 'home' });
  };

  const handleStartShopping = () => {
    dispatch({ type: 'SET_PAGE', page: 'game' });
  };

  const reminders = [
    {
      bgColor: '#dde8ff',
      iconColor: '#1a3faa',
      icon: <ClipboardList size={22} color="#1a3faa" />,
      label: 'GOAL',
      text: `Look for ${state.shoppingList.length} items total`,
    },
    {
      bgColor: '#dde8ff',
      iconColor: '#1a3faa',
      icon: <Store size={22} color="#1a3faa" />,
      label: 'LOCATION',
      text: 'Items are displayed on store shelves',
    },
    {
      bgColor: '#f0ddff',
      iconColor: '#8b3dff',
      icon: <Lightbulb size={22} color="#8b3dff" />,
      label: 'SUPPORT',
      text: 'Use hints if you need help',
    },
    {
      bgColor: '#ffe0dd',
      iconColor: '#d93025',
      icon: <Timer size={22} color="#d93025" />,
      label: 'LIMIT',
      text: `Complete within ${state.settings.timerMinutes} minutes`,
    },
  ];

  return (
    <div style={{ height: '100vh', backgroundColor: '#f0f4ff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          height: 56,
          backgroundColor: '#f0f4ff',
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: '#1a2f6e',
            fontWeight: 500,
            fontSize: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          <ArrowLeft size={18} color="#1a2f6e" />
          Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <ShoppingCart size={22} color="#1a2f6e" />
          <span style={{ color: '#1a2f6e', fontWeight: 700, fontSize: 18 }}>Memory Shop</span>
        </div>

        {/* Spacer to balance layout */}
        <div style={{ width: 60 }} />
      </header>

      {/* Scrollable main content */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Sam image */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <img
            src={samImage}
            alt="Sam, your shopping guide"
            style={{ height: 200, objectFit: 'contain' }}
          />
        </div>

        {/* Speech bubble */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <p
            style={{
              textAlign: 'center',
              color: '#1a2f6e',
              fontSize: 17,
              fontWeight: 400,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Hello! I'm Sam, and I'll be your guide today. Let's keep your memory sharp while we find everything on your list.
          </p>
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <h2
            style={{
              color: '#1a2f6e',
              fontWeight: 700,
              fontSize: 22,
              margin: 0,
              flex: 1,
            }}
          >
            Shopping Reminders
          </h2>
          <Info size={18} color="#9ca3af" />
        </div>

        {/* Reminder cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reminders.map((reminder, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              {/* Colored icon square */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  backgroundColor: reminder.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {reminder.icon}
              </div>

              {/* Text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#9ca3af',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {reminder.label}
                </span>
                <span style={{ fontSize: 15, color: '#1a2f6e', fontWeight: 400 }}>
                  {reminder.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Start Shopping button */}
      <div
        style={{
          flexShrink: 0,
          padding: '8px 16px 4px',
          backgroundColor: '#f0f4ff',
        }}
      >
        <button
          onClick={handleStartShopping}
          style={{
            width: '100%',
            height: 60,
            backgroundColor: '#1a2f6e',
            color: '#ffffff',
            borderRadius: 30,
            fontSize: 18,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            letterSpacing: '0.01em',
          }}
        >
          Start Shopping
          <ArrowRight size={20} color="#ffffff" />
        </button>
      </div>

      {/* Bottom nav bar */}
      <div
        style={{
          flexShrink: 0,
          height: 68,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Inventory (active) */}
        <button
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          <ShoppingBag size={22} color="#1a3faa" />
          <span style={{ fontSize: 11, color: '#1a3faa', fontWeight: 600 }}>Inventory</span>
        </button>

        {/* Analytics */}
        <button
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
          }}
          onClick={() => dispatch({ type: 'SET_PAGE', page: 'stats' })}
        >
          <BarChart2 size={22} color="#9ca3af" />
          <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>Analytics</span>
        </button>

        {/* Settings */}
        <button
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          <Settings size={22} color="#9ca3af" />
          <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>Settings</span>
        </button>
      </div>
    </div>
  );
}
