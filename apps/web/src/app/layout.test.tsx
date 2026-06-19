import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { metadata } from './layout';

vi.mock('./globals.css', () => ({}));

import RootLayout from './layout';

describe('RootLayout', () => {
  it('exports reunion metadata', () => {
    expect(metadata.title).toBe('Von Rosenberg Family Reunion');
  });

  it('renders children inside the document shell', () => {
    const html = renderToString(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>,
    );

    expect(html).toContain('lang="en"');
    expect(html).toContain('min-h-screen antialiased');
    expect(html).toContain('Hello');
  });
});
