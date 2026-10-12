import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

beforeEach(() => {
  localStorage.clear();
});

describe('App', () => {
  it('renders the initial count and increments', async () => {
    const user = userEvent.setup();
    render(<App initial={0} min={-10} max={10} persist={false} />);

    expect(screen.getByLabelText('Current count')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByLabelText('Current count')).toHaveTextContent('1');
  });

  it('applies the selected step size', async () => {
    const user = userEvent.setup();
    render(<App initial={0} min={-50} max={50} persist={false} />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByLabelText('Current count')).toHaveTextContent('10');
  });

  it('resets back to the initial value', async () => {
    const user = userEvent.setup();
    render(<App initial={3} min={-50} max={50} persist={false} />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByLabelText('Current count')).toHaveTextContent('4');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByLabelText('Current count')).toHaveTextContent('3');
  });

  it('disables the increment button at the maximum', () => {
    render(<App initial={5} min={-10} max={5} persist={false} />);
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeEnabled();
  });

  it('responds to keyboard shortcuts', async () => {
    const user = userEvent.setup();
    render(<App initial={0} min={-50} max={50} persist={false} />);

    await user.keyboard('+');
    expect(screen.getByLabelText('Current count')).toHaveTextContent('1');
    await user.keyboard('-');
    expect(screen.getByLabelText('Current count')).toHaveTextContent('0');
    await user.keyboard('r');
    expect(screen.getByLabelText('Current count')).toHaveTextContent('0');
  });
});
