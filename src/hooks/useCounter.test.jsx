import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter.js';

describe('useCounter', () => {
  it('starts at the initial value', () => {
    const { result } = renderHook(() => useCounter({ initial: 5 }));
    expect(result.current.count).toBe(5);
  });

  it('increments and decrements by the step', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
    act(() => result.current.setStep(5));
    act(() => result.current.increment());
    expect(result.current.count).toBe(6);
    act(() => result.current.decrement());
    expect(result.current.count).toBe(1);
  });

  it('clamps to the min and max bounds', () => {
    const { result } = renderHook(() => useCounter({ initial: 0, min: -3, max: 3 }));
    act(() => {
      for (let i = 0; i < 10; i += 1) result.current.increment();
    });
    expect(result.current.count).toBe(3);
    act(() => {
      for (let i = 0; i < 10; i += 1) result.current.decrement();
    });
    expect(result.current.count).toBe(-3);
  });

  it('reports whether a move is possible', () => {
    const { result } = renderHook(() => useCounter({ initial: 4, min: 0, max: 5 }));
    expect(result.current.canIncrement).toBe(true);
    act(() => result.current.increment());
    expect(result.current.count).toBe(5);
    expect(result.current.canIncrement).toBe(false);
  });

  it('ignores invalid step values', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.setStep(0));
    expect(result.current.step).toBe(1);
    act(() => result.current.setStep('nonsense'));
    expect(result.current.step).toBe(1);
  });

  it('resets to the initial value', () => {
    const { result } = renderHook(() => useCounter({ initial: 2 }));
    act(() => result.current.increment());
    expect(result.current.count).toBe(3);
    act(() => result.current.reset());
    expect(result.current.count).toBe(2);
  });
});
