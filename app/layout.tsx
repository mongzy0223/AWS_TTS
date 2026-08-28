import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sino Voice Studio',
  description: 'Create natural English, Mandarin, and Cantonese audio from text.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
