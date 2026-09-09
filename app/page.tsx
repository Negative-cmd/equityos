'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { sampleTickers, isUsMarketOpen } from '@/lib/market-data';

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="rounded-sm border border-wire px-4 py-2 font-mono text-xs tracking-wide text-bone hover:border-moss hover:text-moss transition-colors"
      >
        {shortAddress(address)} · disconnect
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
      className="rounded-sm bg-paper px-4 py-2 font-mono text-xs tracking-wide text-ink hover:bg-bone transition-colors disabled:opacity-50"
    >
      {isPending ? 'connecting…' : 'connect wallet'}
    </button>
  );
}

function MarketClock() {
  const [open, setOpen] = useState<boolean | null>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setOpen(isUsMarketOpen(now));
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono text-xs text-bone">
      <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-moss' : 'bg-rust'}`} />
      <span>NYSE {open === null ? '—' : open ? 'OPEN' : 'CLOSED'}</span>
      <span className="text-wire">·</span>
      <span>{time || '—'} ET</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 pb-24">
      <header className="flex items-center justify-between border-b border-wire py-6">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-xl">EquityOS</span>
          <span className="hidden font-mono text-[11px] text-bone sm:inline">base mainnet</span>
        </div>
        <div className="flex items-center gap-4">
          <MarketClock />
          <WalletButton />
        </div>
      </header>

      <section className="grid gap-8 border-b border-wire py-16 sm:grid-cols-[2fr,1fr]">
        <div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            The floor closes.
            <br />
            Base doesn't.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-bone">
            EquityOS is a terminal for Coinbase's tokenized equities on Base — a way to watch
            and hold onchain equity exposure whenever the exchange floor is dark.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-1 border border-wire p-5 font-mono">
          <span className="text-[11px] text-bone">sample onchain position</span>
          <span className="text-2xl tabular">$4,281.92</span>
          <span className="text-xs tabular text-moss">+$184.31 · +4.50% today</span>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-lg">Tokenized equities</h2>
          <span className="font-mono text-[11px] text-bone">sample data — not a live feed</span>
        </div>

        <div className="border border-wire">
          {sampleTickers.map((t, i) => (
            <div
              key={t.symbol}
              className={`flex items-center justify-between px-4 py-3 font-mono text-sm ${
                i !== sampleTickers.length - 1 ? 'border-b border-wire' : ''
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className="w-16 text-paper">{t.symbol}</span>
                <span className="hidden text-xs text-bone sm:inline">{t.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="tabular">${t.price.toFixed(2)}</span>
                <span
                  className={`w-16 text-right tabular ${
                    t.changePct >= 0 ? 'text-moss' : 'text-rust'
                  }`}
                >
                  {t.changePct >= 0 ? '+' : ''}
                  {t.changePct.toFixed(2)}%
                </span>
                <button
                  disabled
                  title="Trading opens once this symbol is wired to a verified Coinbase tokenized-equity contract"
                  className="rounded-sm border border-wire px-3 py-1 text-[11px] text-wire cursor-not-allowed"
                >
                  trade
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-wire py-6 font-mono text-[11px] text-wire">
        Onchain activity from this app is attributed via Base Builder Code. Not investment
        advice.
      </footer>
    </main>
  );
}
