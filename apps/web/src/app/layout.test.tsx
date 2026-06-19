import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./globals.css', () => ({}));

import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders children inside the document shell', () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>,
    );

    expect(document.documentElement.lang).toBe('en');
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
