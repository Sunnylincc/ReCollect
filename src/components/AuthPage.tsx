import React, { useState } from 'react';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onDemoMode?: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [healthConditions, setHealthConditions] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!age.trim() || isNaN(parseInt(age)) || parseInt(age) < 1 || parseInt(age) > 120) {
      setError('Please enter a valid age (1–120).');
      return;
    }

    localStorage.setItem('remind_user_name', name.trim());
    localStorage.setItem('remind_user_age', age.trim());
    localStorage.setItem('remind_user_health', healthConditions.trim());

    onAuthSuccess();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #f0f4f8 0%, #e8eef5 55%, #ede8f7 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft purple wash in bottom half */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '52%',
          background: 'linear-gradient(to top, rgba(180,160,230,0.18) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px 8px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Back arrow */}
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#0c1e3d',
            fontSize: 22,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ←
        </button>

        {/* Title */}
        <span
          style={{
            color: '#0c1e3d',
            fontWeight: 600,
            fontSize: 17,
            letterSpacing: 0.1,
          }}
        >
          Join Remind
        </span>

        {/* Question mark */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: '#d4d8e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#555c70',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          ?
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: '20px 24px 40px',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Headline */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#0c1021',
              lineHeight: 1.2,
              margin: '0 0 12px',
              letterSpacing: -0.5,
            }}
          >
            Let's get to{' '}
            <span style={{ color: '#1a3faa' }}>know you</span>{' '}
            better.
          </h1>
          <p
            style={{
              color: '#7a8399',
              fontSize: 16,
              lineHeight: 1.55,
              margin: 0,
              fontWeight: 400,
            }}
          >
            This helps us personalize your cognitive exercises and daily reminders for a safer, more mindful experience.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Name */}
          <div>
            <label
              style={{
                display: 'block',
                color: '#2d3348',
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 8,
              }}
            >
              What is your full name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#dce8f0',
                border: 'none',
                outline: 'none',
                borderRadius: 50,
                padding: '20px 24px',
                fontSize: 16,
                color: '#1a2236',
                fontWeight: 400,
              }}
            />
          </div>

          {/* Age */}
          <div>
            <label
              style={{
                display: 'block',
                color: '#2d3348',
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 8,
              }}
            >
              How many years young are you?
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              min="1"
              max="120"
              style={{
                width: '50%',
                boxSizing: 'border-box',
                background: '#dce8f0',
                border: 'none',
                outline: 'none',
                borderRadius: 50,
                padding: '20px 24px',
                fontSize: 16,
                color: '#1a2236',
                fontWeight: 400,
              }}
            />
          </div>

          {/* Health conditions */}
          <div>
            <label
              style={{
                display: 'block',
                color: '#2d3348',
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 8,
              }}
            >
              Any prior health conditions we should know?
            </label>
            <textarea
              value={healthConditions}
              onChange={(e) => setHealthConditions(e.target.value)}
              placeholder="e.g. Hypertension, Diabetes, etc."
              rows={4}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#e8e0f5',
                border: 'none',
                outline: 'none',
                borderRadius: 28,
                padding: '20px 24px',
                fontSize: 16,
                color: '#1a2236',
                fontWeight: 400,
                resize: 'none',
                minHeight: 120,
                fontFamily: 'inherit',
                lineHeight: 1.5,
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#c0392b', fontSize: 14, margin: '0 4px' }}>{error}</p>
          )}

          {/* Submit button */}
          <div style={{ marginTop: 8 }}>
            <button
              type="submit"
              style={{
                width: '100%',
                height: 60,
                background: '#1a3faa',
                color: '#ffffff',
                border: 'none',
                borderRadius: 50,
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                letterSpacing: 0.2,
              }}
            >
              Start My Journey →
            </button>
            <p
              style={{
                textAlign: 'center',
                color: '#9aa0b2',
                fontSize: 13,
                marginTop: 12,
                fontWeight: 400,
              }}
            >
              Your data is encrypted and stored securely.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
