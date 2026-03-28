import React, { useState, useEffect } from 'react';
import { useGame } from './GameContext';
import { ItemImage } from './ItemImage';


export function GamePage() {
  const { state, dispatch } = useGame();
  const {
    availableItems,
    selectedItems,
    shoppingList,
    settings,
    hintsUsed,
    timeStarted,
    lastHintTime,
  } = state;

  const [gameTimeLeft, setGameTimeLeft] = useState(settings.timerMinutes * 60);
  const [showHint, setShowHint] = useState<string | null>(null);
  const [hintCooldown, setHintCooldown] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);

  useEffect(() => {
    if (timeStarted) {
      setGameTimeLeft(settings.timerMinutes * 60);
    }
  }, [timeStarted, settings.timerMinutes]);

  useEffect(() => {
    if (!settings.timerEnabled || !timeStarted) return;
    const timer = setInterval(() => {
      setGameTimeLeft((prev) => {
        if (prev <= 1) {
          dispatch({ type: 'FINISH_GAME' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.timerEnabled, timeStarted, dispatch]);

  useEffect(() => {
    if (lastHintTime === 0) { setHintCooldown(0); return; }
    const updateCooldown = () => {
      const timeSinceHint = Date.now() - lastHintTime;
      const remainingCooldown = Math.max(0, 5000 - timeSinceHint);
      setHintCooldown(Math.ceil(remainingCooldown / 1000));
      if (remainingCooldown > 0) setTimeout(updateCooldown, 1000);
    };
    updateCooldown();
  }, [lastHintTime]);

  const handleItemClick = (item: any) => {
    const isSelected = selectedItems.find((s) => s.id === item.id);
    if (isSelected) {
      dispatch({ type: 'DESELECT_ITEM', itemId: item.id });
    } else {
      dispatch({ type: 'SELECT_ITEM', item });
    }
  };

  const handleUseHint = () => {
    if (!settings.hintsEnabled || hintsUsed >= settings.maxHints || hintCooldown > 0) return;
    const unselected = shoppingList.filter(
      (req) => !selectedItems.find((sel) => sel.id === req.id)
    );
    if (unselected.length > 0) {
      const randomItem = unselected[Math.floor(Math.random() * unselected.length)];
      setShowHint(randomItem.name);
      dispatch({ type: 'USE_HINT' });
      setTimeout(() => setShowHint(null), 3000);
    }
  };

  const handleFinishShopping = () => {
    dispatch({ type: 'FINISH_GAME' });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_PAGE', page: 'intro' });
  };

  const hintsLeft = settings.maxHints - hintsUsed;
  const itemsFound = selectedItems.filter((sel) =>
    shoppingList.find((req) => req.id === sel.id)
  ).length;

  return (
    <div
      style={{ backgroundColor: '#f0f4ff', minHeight: '100vh', maxWidth: '430px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: '#f0f4ff',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Back button */}
        <button
          onClick={handleBack}
          style={{
            color: '#0d2260',
            fontWeight: 600,
            fontSize: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ← Back
        </button>

        {/* Title */}
        <span style={{ color: '#0d2260', fontWeight: 700, fontSize: '17px', letterSpacing: '-0.3px' }}>
          Pick Your Items
        </span>

        {/* Hint pill */}
        {settings.hintsEnabled ? (
          <button
            onClick={handleUseHint}
            disabled={hintsLeft <= 0 || hintCooldown > 0}
            style={{
              backgroundColor: hintsLeft > 0 && hintCooldown === 0 ? '#d6e8ff' : '#c8d8f0',
              color: '#0d2260',
              border: 'none',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: hintsLeft > 0 && hintCooldown === 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              opacity: hintsLeft <= 0 || hintCooldown > 0 ? 0.6 : 1,
            }}
          >
            💡 {hintCooldown > 0 ? `${hintCooldown}s` : 'Hint'}
          </button>
        ) : (
          <div style={{ width: '70px' }} />
        )}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 140px 20px' }}>
        {/* Headline */}
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ color: '#0d2260', fontWeight: 800, fontSize: '30px', margin: '0 0 6px 0', lineHeight: 1.15 }}>
            Find your groceries.
          </h1>
          <p style={{ color: '#7a8499', fontSize: '15px', margin: 0, lineHeight: 1.5 }}>
            Refer to your list and select the items<br />
            you need to complete today's task.
          </p>
        </div>

        {/* Hint toast */}
        {showHint && (
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fcd34d',
            borderRadius: '14px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <p style={{ color: '#92400e', fontWeight: 600, fontSize: '15px', margin: 0 }}>
              Look for: <strong>{showHint}</strong>
            </p>
          </div>
        )}

        {/* Items Found Counter */}
        <div style={{
          backgroundColor: '#dce8ff',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          minWidth: '120px',
        }}>
          <span style={{
            color: '#7a8499',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}>
            ITEMS FOUND
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ color: '#0d2260', fontWeight: 800, fontSize: '36px', lineHeight: 1 }}>
              {itemsFound}
            </span>
            <span style={{ color: '#7a8499', fontWeight: 600, fontSize: '20px', lineHeight: 1 }}>
              /{shoppingList.length}
            </span>
          </div>
        </div>

        {/* Item Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
        }}>
          {availableItems.map((item) => {
            const isSelected = !!selectedItems.find((s) => s.id === item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: isSelected ? '3px solid #0d2260' : '3px solid transparent',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  transition: 'border-color 0.15s',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* Image area ~70% of card */}
                <div style={{ position: 'relative', paddingBottom: '70%', width: '100%', overflow: 'hidden', borderRadius: '13px 13px 0 0', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <ItemImage name={item.name} imageUrl={item.image} />
                  </div>

                  {/* Checkmark badge */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#0d2260',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: 700,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                    }}>
                      ✓
                    </div>
                  )}
                </div>

                {/* Item name */}
                <div style={{
                  padding: '10px 8px',
                  textAlign: 'center',
                }}>
                  <span style={{
                    color: '#0d2260',
                    fontWeight: 700,
                    fontSize: '15px',
                    lineHeight: 1.2,
                    display: 'block',
                  }}>
                    {item.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Button */}
      <div style={{
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
      }}>
        <button
          onClick={handleFinishShopping}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            letterSpacing: '0.01em',
          }}
        >
          Finish Shopping
        </button>
      </div>
    </div>
  );
}
