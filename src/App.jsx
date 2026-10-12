import { useEffect, useState } from 'react';
import { useCounter } from './hooks/useCounter.js';

const STEPS = [1, 5, 10];
const STORAGE_KEY = 'react-counter-app.count';

function readInitial(fallback) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? fallback : Number(stored);
  } catch {
    return fallback;
  }
}

export default function App({ initial = 0, min = -50, max = 50, persist = true }) {
  const startValue = persist ? readInitial(initial) : initial;
  const counter = useCounter({ initial: startValue, min, max });
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(counter.count));
    } catch {
      /* ignore storage failures (private mode, etc.) */
    }
  }, [counter.count, persist]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === '+' || event.key === 'ArrowUp') {
        event.preventDefault();
        counter.increment();
      } else if (event.key === '-' || event.key === 'ArrowDown') {
        event.preventDefault();
        counter.decrement();
      } else if (event.key.toLowerCase() === 'r') {
        counter.reset();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [counter]);

  function bump(direction) {
    if (direction === 'up') counter.increment();
    else counter.decrement();
    setFlash(direction);
    window.setTimeout(() => setFlash(null), 150);
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Counter</h1>
        <p>Use the buttons or your keyboard (+, −, R).</p>
      </header>

      <output
        className={`count count--${flash ?? 'idle'}`}
        aria-live="polite"
        aria-label="Current count"
      >
        {counter.count}
        <span className="count__range">
          {Number.isFinite(min) && Number.isFinite(max) ? `${min} … ${max}` : ''}
        </span>
      </output>

      <div className="controls">
        <button
          type="button"
          className="btn btn--lg"
          onClick={() => bump('down')}
          disabled={!counter.canDecrement}
          aria-label="Decrement"
        >
          −
        </button>
        <button type="button" className="btn btn--ghost" onClick={counter.reset}>
          Reset
        </button>
        <button
          type="button"
          className="btn btn--lg"
          onClick={() => bump('up')}
          disabled={!counter.canIncrement}
          aria-label="Increment"
        >
          +
        </button>
      </div>

      <div className="steps" role="group" aria-label="Step size">
        <span className="steps__label">Step</span>
        {STEPS.map((size) => (
          <button
            key={size}
            type="button"
            className={`chip${counter.step === size ? ' chip--active' : ''}`}
            aria-pressed={counter.step === size}
            onClick={() => counter.setStep(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </main>
  );
}
