import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

// Required Base App metadata. Lives on the root layout (not page.tsx) so
// it's present on every route, not just the homepage.
export const metadata: Metadata = {
  title: 'EquityOS — Tokenized Equities on Base',
  description:
    'A 24/7 terminal for Coinbase tokenized equities on Base — trade while the exchange floor is dark.',
  other: {
    'base:app_id': '6a89d93d6ea1f57fed333d66',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink text-paper antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
