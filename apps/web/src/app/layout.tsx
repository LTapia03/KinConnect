import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Von Rosenberg Family Reunion',
  description: 'Registration and reunion information for the Von Rosenberg family reunion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
