import React, { useEffect } from 'react';
import { useGame } from './GameContext';
import { ItemImage } from './ItemImage';

export function ResultsPage() {
  const { state, dispatch } = useGame();
  const { selectedItems, shoppingList, gameStats, gameHistory } = state;

  const correctIds = new Set(
    shoppingList
      .filter((req) => selectedItems.find((sel) => sel.id === req.id))
      .map((item) => item.id)
  );

  const incorrectItems = selectedItems.filter(
    (sel) => !shoppingList.find((req) => req.id === sel.id)
  );

  const mistakes =
    shoppingList.filter((req) => !correctIds.has(req.id)).length +
    incorrectItems.length;

  // Format seconds → MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Personal best: compare current time against all previous completed games
  const previousBest =
    gameHistory.length > 0
      ? Math.min(...gameHistory.map((g) => g.timeTaken))
      : null;
  const isPersonalBest =
    previousBest !== null && gameStats.timeTaken < previousBest;

  // Persist this session to localStorage so StatsPage can read it
  useEffect(() => {
    if (gameStats.itemsTotal === 0) return;
    try {
      const raw = localStorage.getItem('memoryGameSessions');
      const all: object[] = raw ? JSON.parse(raw) : [];
      all.push({
        date: new Date().toISOString().slice(0, 10),
        accuracy: gameStats.accuracy,
        timeTaken: gameStats.timeTaken,
        hintsUsed: gameStats.hintsUsed,
        itemsCorrect: gameStats.itemsCorrect,
        itemsTotal: gameStats.itemsTotal,
      });
      localStorage.setItem('memoryGameSessions', JSON.stringify(all));
    } catch (_) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_PAGE', page: 'home' });
  };

  return (
    <div
      style={{
        backgroundColor: '#f0f4ff',
        minHeight: '100vh',
        maxWidth: '430px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          backgroundColor: '#f0f4ff',
          zIndex: 50,
        }}
      >
        <button
          onClick={handleBack}
          style={{
            color: '#0d2260',
            fontWeight: 600,
            fontSize: '17px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
          }}
        >
          ←
        </button>
        <span
          style={{
            flex: 1,
            textAlign: 'center',
            color: '#1a56db',
            fontWeight: 700,
            fontSize: '17px',
          }}
        >
          Results
        </span>
        {/* Spacer to balance back button */}
        <div style={{ width: '17px' }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 140px 20px' }}>

        {/* Headline */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              color: '#0d2260',
              fontWeight: 800,
              fontSize: '36px',
              margin: '0 0 8px 0',
              lineHeight: 1.1,
            }}
          >
            Great Job!
          </h1>
          <p style={{ color: '#7a8499', fontSize: '15px', margin: 0, lineHeight: 1.5 }}>
            You've successfully completed today's shopping list challenge.
          </p>
        </div>

        {/* Total Time Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px 20px',
            textAlign: 'center',
            width: '80%',
            margin: '0 auto 20px auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <span
            style={{
              color: '#7a8499',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            TOTAL TIME
          </span>
          <div
            style={{
              color: '#0d2260',
              fontWeight: 800,
              fontSize: '48px',
              lineHeight: 1,
              marginBottom: isPersonalBest ? '12px' : 0,
            }}
          >
            {formatTime(gameStats.timeTaken)}
          </div>
          {isPersonalBest && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#ede9fe',
                color: '#5b21b6',
                borderRadius: '999px',
                padding: '5px 14px',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              🕐 New Personal Best
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          {/* Mistakes */}
          <div
            style={{
              backgroundColor: '#e8f0ff',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '17px' }}>!</span>
            </div>
            <span style={{ color: '#7a8499', fontSize: '13px', fontWeight: 600 }}>Mistakes</span>
            <span style={{ color: '#0d2260', fontWeight: 800, fontSize: '32px', lineHeight: 1 }}>
              {mistakes}
            </span>
          </div>

          {/* Hints Used */}
          <div
            style={{
              backgroundColor: '#e8f0ff',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '18px' }}>💡</span>
            </div>
            <span style={{ color: '#7a8499', fontSize: '13px', fontWeight: 600 }}>Hints Used</span>
            <span style={{ color: '#0d2260', fontWeight: 800, fontSize: '32px', lineHeight: 1 }}>
              {gameStats.hintsUsed}
            </span>
          </div>
        </div>

        {/* Your Items */}
        <h2
          style={{
            color: '#0d2260',
            fontWeight: 700,
            fontSize: '20px',
            margin: '0 0 12px 0',
          }}
        >
          Your Items
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {shoppingList.map((item) => {
            const isCorrect = correctIds.has(item.id);
            return (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <ItemImage name={item.name} imageUrl={item.image} />
                </div>

                {/* Name + status pill */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      color: '#0d2260',
                      fontWeight: 700,
                      fontSize: '15px',
                      display: 'block',
                      marginBottom: '5px',
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2',
                      color: isCorrect ? '#166534' : '#991b1b',
                      borderRadius: '999px',
                      padding: '2px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {isCorrect ? 'Correct' : 'Missed'}
                  </span>
                </div>

                {/* Status icon */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isCorrect ? '#dbeafe' : '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      color: isCorrect ? '#2563eb' : '#dc2626',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                  >
                    {isCorrect ? '✓' : '✕'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '430px',
          padding: '16px 20px 32px 20px',
          backgroundColor: '#f0f4ff',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          zIndex: 50,
        }}
      >
        <button
          onClick={handlePlayAgain}
          style={{
            width: '100%',
            height: '60px',
            backgroundColor: '#0d2260',
            color: 'white',
            border: 'none',
            borderRadius: '999px',
            fontSize: '17px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
