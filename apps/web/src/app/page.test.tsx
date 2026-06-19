import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the reunion placeholder content', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: /reunion registration platform/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/payment is collected at check-in/i)).toBeInTheDocument();
  });
});
