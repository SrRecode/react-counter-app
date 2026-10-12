# React Counter

A small, polished counter built with React hooks. It ships with a testable custom
hook, keyboard shortcuts, clamped bounds and persistent state — and is fully
covered by [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

## Features

- Increment / decrement with clamping between a configurable `min` and `max`
- Step sizes of 1, 5 and 10
- Reset to the initial value
- Keyboard shortcuts: `+` / `↑` increment, `-` / `↓` decrement, `R` reset
- Live region (`aria-live`) so screen readers announce the current count
- Count persisted to `localStorage` (disable with `persist={false}`)
- Buttons disable automatically at the bounds

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite once
npm run build    # production build into dist/
```

## Project layout

```
index.html                    Vite entry
src/main.jsx                  React root
src/App.jsx                   UI: number, controls, step chips, keyboard handling
src/hooks/useCounter.js       The counter hook (pure state logic)
src/hooks/useCounter.test.jsx Hook tests
src/App.test.jsx              Component tests (user interactions)
src/styles.css                Styling
vite.config.js                Vite + Vitest configuration
```

### `useCounter`

The hook keeps the component's logic testable in isolation:

```js
const { count, step, increment, decrement, reset, setStep, canIncrement, canDecrement } =
  useCounter({ initial: 0, min: -50, max: 50 });
```

- `count` — current value, always clamped to `[min, max]`
- `increment` / `decrement` — move by `step`, clamped
- `reset` — return to `initial`
- `setStep(n)` — change the step (ignores non-finite and non-positive values)
- `canIncrement` / `canDecrement` — whether the next move stays in range

## Tests

```bash
npm test
```

The suite covers the hook (initial value, clamping, validity guards, bounds
flags, reset) and the component (rendering, stepping, reset, disabled states and
keyboard shortcuts).

## License

MIT
