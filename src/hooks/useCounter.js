import { useCallback, useMemo, useState } from 'react';

/**
 * Counter state with clamping and a configurable step.
 *
 * @param {object} [options]
 * @param {number} [options.initial] starting value
 * @param {number} [options.min] lower bound (inclusive)
 * @param {number} [options.max] upper bound (inclusive)
 */
export function useCounter({ initial = 0, min = -Infinity, max = Infinity } = {}) {
  const clamp = useCallback((value) => Math.min(max, Math.max(min, value)), [min, max]);
  const [count, setCountState] = useState(() => Math.min(max, Math.max(min, initial)));
  const [step, setStepState] = useState(1);

  const increment = useCallback(() => setCountState((current) => clamp(current + step)), [step, clamp]);
  const decrement = useCallback(() => setCountState((current) => clamp(current - step)), [step, clamp]);
  const reset = useCallback(() => setCountState(clamp(initial)), [initial, clamp]);
  const setCount = useCallback((value) => setCountState(clamp(Number(value))), [clamp]);

  const setStep = useCallback((next) => {
    const numeric = Number(next);
    if (Number.isFinite(numeric) && numeric > 0) setStepState(numeric);
  }, []);

  const canIncrement = useMemo(() => count + step <= max, [count, step, max]);
  const canDecrement = useMemo(() => count - step >= min, [count, step, min]);

  return {
    count,
    step,
    min,
    max,
    increment,
    decrement,
    reset,
    setCount,
    setStep,
    canIncrement,
    canDecrement,
  };
}
