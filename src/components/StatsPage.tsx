import React, { useMemo } from 'react';
import { useGame } from './GameContext';
import { BarChart2, User, LayoutGrid, Flame, Trophy } from 'lucide-react';

interface StoredSession {
  date: string; // "YYYY-MM-DD"
  accuracy: number;
  timeTaken: number; // seconds
  hintsUsed: number;
  itemsCorrect: number;
  itemsTotal: number;
}

function loadSessions(): StoredSession[] {
  try {
    const raw = localStorage.getItem('memoryGameSessions');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function toDateStr(d: Date): string {
  // Local date string YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTime(sec: number): string {
  if (sec <= 0) return '0s';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function StatsPage() {
  const { dispatch } = useGame();

  const sessions = useMemo(() => loadSessions(), []);

  // ── Streak ────────────────────────────────────────────────────────────────
  const streak = useMemo(() => {
    const dates = new Set(sessions.map((s) => s.date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = toDateStr(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toDateStr(yesterday);

    if (!dates.has(todayStr) && !dates.has(yesterdayStr)) return 0;

    let count = 0;
    const cur = dates.has(todayStr) ? new Date(today) : new Date(yesterday);
    while (dates.has(toDateStr(cur))) {
      count++;
      cur.setDate(cur.getDate() - 1);
    }
    return count;
  }, [sessions]);

  // ── Total points ──────────────────────────────────────────────────────────
  const totalPoints = useMemo(
    () =>
      sessions.reduce(
        (sum, s) => sum + s.itemsCorrect * 10 + (s.accuracy === 100 ? 5 : 0),
        0
      ),
    [sessions]
  );

  // ── Average time per session ──────────────────────────────────────────────
  const avgTimeSec = useMemo(() => {
    if (sessions.length === 0) return 0;
    return Math.round(
      sessions.reduce((sum, s) => sum + s.timeTaken, 0) / sessions.length
    );
  }, [sessions]);

  const avgTimeLabel = useMemo(() => {
    if (avgTimeSec <= 0) return '—';
    if (avgTimeSec < 60) return `${avgTimeSec}s / day`;
    return `${Math.round(avgTimeSec / 60)} min / day`;
  }, [avgTimeSec]);

  // ── Week bar chart (Mon–Sun of current week) ───────────────────────────────
  const weekDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = toDateStr(today);

    const dow = today.getDay(); // 0=Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dow + 6) % 7));

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const byDate = new Map<string, StoredSession[]>();
    sessions.forEach((s) => {
      const arr = byDate.get(s.date) ?? [];
      arr.push(s);
      byDate.set(s.date, arr);
    });

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = toDateStr(d);
      const daySessions = byDate.get(dateStr) ?? [];
      const played = daySessions.length > 0;
      const isToday = dateStr === todayStr;
      const isFuture = d > today;
      const lastSession = daySessions[daySessions.length - 1];
      return {
        label: labels[i],
        played,
        isToday,
        isFuture,
        timeSec: lastSession?.timeTaken ?? 0,
      };
    });
  }, [sessions]);

  // ── Mistakes this week vs last week ───────────────────────────────────────
  const { thisWeekMistakes, lastWeekMistakes, thisWeekAccuracy, hasThisWeek } =
    useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sevenAgo = new Date(today);
      sevenAgo.setDate(today.getDate() - 6);
      const sevenAgoStr = toDateStr(sevenAgo);

      const fourteenAgo = new Date(today);
      fourteenAgo.setDate(today.getDate() - 13);
      const fourteenAgoStr = toDateStr(fourteenAgo);

      const thisWeek = sessions.filter((s) => s.date >= sevenAgoStr);
      const lastWeek = sessions.filter(
        (s) => s.date >= fourteenAgoStr && s.date < sevenAgoStr
      );

      const mistakes = (arr: StoredSession[]) =>
        arr.reduce((sum, s) => sum + (s.itemsTotal - s.itemsCorrect), 0);

      const thisWeekAcc =
        thisWeek.length > 0
          ? Math.round(
              thisWeek.reduce((sum, s) => sum + s.accuracy, 0) / thisWeek.length
            )
          : 0;

      return {
        thisWeekMistakes: mistakes(thisWeek),
        lastWeekMistakes: mistakes(lastWeek),
        thisWeekAccuracy: thisWeekAcc,
        hasThisWeek: thisWeek.length > 0,
      };
    }, [sessions]);

  // Comparison pill for mistakes
  const mistakePill = useMemo(() => {
    if (!hasThisWeek) {
      return { label: '→ No change', bg: '#e5e7eb', color: '#4b5563' };
    }
    if (lastWeekMistakes === 0) {
      return { label: '→ No change', bg: '#e5e7eb', color: '#4b5563' };
    }
    if (thisWeekMistakes < lastWeekMistakes) {
      const pct = Math.round(
        ((lastWeekMistakes - thisWeekMistakes) / lastWeekMistakes) * 100
      );
      return { label: `↘ ${pct}% Less`, bg: '#dcfce7', color: '#166534' };
    }
    if (thisWeekMistakes > lastWeekMistakes) {
      const pct = Math.round(
        ((thisWeekMistakes - lastWeekMistakes) / lastWeekMistakes) * 100
      );
      return { label: `↑ ${pct}% More`, bg: '#fee2e2', color: '#991b1b' };
    }
    return { label: '→ No change', bg: '#e5e7eb', color: '#4b5563' };
  }, [thisWeekMistakes, lastWeekMistakes, hasThisWeek]);

  const mistakeMotivation = useMemo(() => {
    if (!hasThisWeek) return 'Play more sessions to see your progress here.';
    if (lastWeekMistakes > 0 && thisWeekMistakes < lastWeekMistakes)
      return 'Great job! You made fewer mistakes this week compared to last week.';
    if (lastWeekMistakes > 0 && thisWeekMistakes > lastWeekMistakes)
      return 'Keep going! Every session helps build your memory.';
    return 'Play more sessions to see your progress here.';
  }, [thisWeekMistakes, lastWeekMistakes, hasThisWeek]);

  // ── Nav handlers ──────────────────────────────────────────────────────────
  const goHome = () => dispatch({ type: 'SET_PAGE', page: 'home' });
  const goStats = () => {}; // already here

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
      {/* ── Top Bar ── */}
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
        {/* Hamburger */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: '#0d2260',
            fontSize: '22px',
            lineHeight: 1,
            fontWeight: 700,
          }}
          aria-label="Menu"
        >
          ≡
        </button>

        {/* Title */}
        <span
          style={{
            flex: 1,
            textAlign: 'center',
            color: '#0d2260',
            fontWeight: 700,
            fontSize: '17px',
          }}
        >
          My Progress
        </span>

        {/* Question mark circle */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '15px' }}>?</span>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 100px 20px' }}>

        {/* Headline */}
        <div style={{ marginBottom: '20px' }}>
          <h1
            style={{
              color: '#0d2260',
              fontWeight: 800,
              fontSize: '28px',
              margin: '0 0 6px 0',
              lineHeight: 1.2,
            }}
          >
            You're doing great!
          </h1>
          <p style={{ color: '#7a8499', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
            Your memory is getting sharper every single day. Keep up this momentum!
          </p>
        </div>

        {/* ── Current Streak Card ── */}
        <div
          style={{
            backgroundColor: '#2244cc',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span
              style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              CURRENT STREAK
            </span>
            <span
              style={{
                color: 'white',
                fontWeight: 800,
                fontSize: '36px',
                lineHeight: 1,
              }}
            >
              {streak} Days
            </span>
          </div>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Flame size={28} color="#2244cc" />
          </div>
        </div>

        {/* ── Total Points Card ── */}
        <div
          style={{
            backgroundColor: '#6644bb',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span
              style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              TOTAL POINTS
            </span>
            <span
              style={{
                color: 'white',
                fontWeight: 800,
                fontSize: '36px',
                lineHeight: 1,
              }}
            >
              {totalPoints.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Trophy size={28} color="#6644bb" />
          </div>
        </div>

        {/* ── Average Time Card ── */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div>
              <span
                style={{
                  color: '#0d2260',
                  fontWeight: 700,
                  fontSize: '18px',
                  display: 'block',
                  marginBottom: '2px',
                }}
              >
                Average Time
              </span>
              <span style={{ color: '#7a8499', fontSize: '13px' }}>
                Your daily session duration
              </span>
            </div>
            {/* Blue pill */}
            <div
              style={{
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                borderRadius: '999px',
                padding: '5px 12px',
                fontSize: '13px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {avgTimeLabel}
            </div>
          </div>

          {/* Bar chart */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '6px',
              height: '80px',
            }}
          >
            {weekDays.map((day, i) => {
              const barHeight = day.played ? 48 : 12;
              const barColor =
                !day.played || day.isFuture ? '#d3e5f1' : '#0d2260';

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '100%',
                    gap: '4px',
                  }}
                >
                  {/* Time label above today's bar */}
                  {day.isToday && day.played && (
                    <span
                      style={{
                        color: '#0d2260',
                        fontSize: '9px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatTime(day.timeSec)}
                    </span>
                  )}
                  {/* Spacer to push bar to bottom when no label */}
                  {(!day.isToday || !day.played) && <div style={{ flex: 1 }} />}

                  {/* Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: `${barHeight}px`,
                      backgroundColor: barColor,
                      borderRadius: '4px 4px 2px 2px',
                    }}
                  />

                  {/* Day label */}
                  <span
                    style={{
                      color: day.isToday ? '#0d2260' : '#9ca3af',
                      fontSize: '10px',
                      fontWeight: day.isToday ? 700 : 500,
                    }}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mistakes Card ── */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
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
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '17px' }}>
                !
              </span>
            </div>
            <span style={{ color: '#0d2260', fontWeight: 700, fontSize: '18px' }}>
              Mistakes
            </span>
          </div>

          {/* Big number */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                color: '#0d2260',
                fontWeight: 800,
                fontSize: '48px',
                lineHeight: 1,
              }}
            >
              {thisWeekMistakes}
            </span>
            {/* Comparison pill */}
            <span
              style={{
                backgroundColor: mistakePill.bg,
                color: mistakePill.color,
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {mistakePill.label}
            </span>
          </div>

          {/* Motivational text */}
          <p
            style={{
              color: '#7a8499',
              fontSize: '13px',
              margin: '0 0 16px 0',
              lineHeight: 1.5,
            }}
          >
            {mistakeMotivation}
          </p>

          {/* Accuracy progress bar */}
          <div
            style={{
              height: '8px',
              backgroundColor: '#e8f0ff',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${thisWeekAccuracy}%`,
                backgroundColor: '#0d2260',
                borderRadius: '999px',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '4px',
            }}
          >
            <span style={{ color: '#9ca3af', fontSize: '11px' }}>
              Accuracy this week
            </span>
            <span style={{ color: '#0d2260', fontSize: '11px', fontWeight: 600 }}>
              {thisWeekAccuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom Nav Bar ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '430px',
          height: '68px',
          backgroundColor: 'white',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          zIndex: 50,
        }}
      >
        {/* Home */}
        <button
          onClick={goHome}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          <LayoutGrid size={22} color="#9ca3af" />
          <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
            Home
          </span>
        </button>

        {/* Progress (active) */}
        <button
          onClick={goStats}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
            position: 'relative',
          }}
        >
          {/* Active underline */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '24px',
              height: '3px',
              backgroundColor: '#1d4ed8',
              borderRadius: '0 0 3px 3px',
            }}
          />
          <BarChart2 size={22} color="#1d4ed8" />
          <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700 }}>
            Progress
          </span>
        </button>

        {/* Profile */}
        <button
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          <User size={22} color="#9ca3af" />
          <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
            Profile
          </span>
        </button>
      </div>
    </div>
  );
}
