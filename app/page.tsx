'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { sampleTickers, isUsMarketOpen, type Ticker } from '@/lib/market-data';
import { TiltCard } from '@/components/TiltCard';
import { Sparkline } from '@/components/Sparkline';
import { AmbientField } from '@/components/AmbientField';

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
        className="group flex items-center gap-2 rounded-sm border border-wire px-4 py-2 font-mono text-xs tracking-wide text-bone transition-colors hover:border-moss hover:text-moss"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-moss" />
        </span>
        {shortAddress(address)} · disconnect
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
      className="rounded-sm bg-paper px-4 py-2 font-mono text-xs tracking-wide text-ink transition-all hover:bg-bone hover:shadow-[0_0_24px_-6px_rgba(243,241,236,0.5)] disabled:opacity-50"
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
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-3 font-mono text-xs text-bone">
        <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-moss animate-pulse' : 'bg-rust'}`} />
        <span>NYSE {open === null ? '—' : open ? 'OPEN' : 'CLOSED'}</span>
        <span className="text-wire">·</span>
        <span>{time || '—'} ET</span>
      </div>
      {open === false && (
        <span className="font-mono text-[10px] text-moss">Markets shut. Base is still open.</span>
      )}
    </div>
  );
}

type LiveTicker = Ticker & { flash: 'up' | 'down' | null };

function useLiveTickers(seed: Ticker[]) {
  const [tickers, setTickers] = useState<LiveTicker[]>(() =>
    seed.map((t) => ({ ...t, flash: null })),
  );

  useEffect(() => {
    const jitter = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.5) * 0.4;
          const nextPrice = +(t.price * (1 + delta / 100)).toFixed(2);
          return {
            ...t,
            price: nextPrice,
            trend: [...t.trend.slice(1), nextPrice],
            flash: delta >= 0 ? 'up' : 'down',
          };
        }),
      );
      const clear = setTimeout(() => {
        setTickers((prev) => prev.map((t) => ({ ...t, flash: null })));
      }, 900);
      return () => clearTimeout(clear);
    }, 3200);
    return () => clearInterval(jitter);
  }, []);

  return tickers;
}

export default function Home() {
  const tickers = useLiveTickers(sampleTickers);

  return (
    <main className="relative mx-auto min-h-screen max-w-5xl px-6 pb-24">
      <AmbientField />

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

      <section
        className="relative grid gap-8 border-b border-wire py-20 sm:grid-cols-[2fr,1fr]"
        style={{ perspective: '1200px' }}
      >
        <div className="rise-in">
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            The floor closes.
            <br />
            Base doesn&apos;t.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-bone">
            EquityOS is a terminal for Coinbase&apos;s tokenized equities on Base — a way to
            watch and hold onchain equity exposure whenever the exchange floor is dark.
          </p>
        </div>

        <div className="relative hidden sm:block" style={{ transformStyle: 'preserve-3d' }}>
          <div
            className="float-b absolute right-6 top-2 w-48 rounded-sm border border-wire bg-ink/80 p-4 font-mono shadow-2xl backdrop-blur"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="text-[10px] text-bone">NVDA position</span>
            <div className="mt-1 text-lg tabular">$430.58</div>
            <div className="text-[11px] tabular text-moss">+$18.21</div>
          </div>
          <div
            className="float-a absolute right-16 top-20 w-48 rounded-sm border border-wire bg-ink/90 p-4 font-mono shadow-2xl backdrop-blur"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="text-[10px] text-bone">sample onchain position</span>
            <div className="mt-1 text-2xl tabular">$4,281.92</div>
            <div className="text-xs tabular text-moss">+$184.31 · +4.50% today</div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-lg">Tokenized equities</h2>
          <span className="font-mono text-[11px] text-bone">sample data — not a live feed</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tickers.map((t, i) => (
            <TiltCard
              key={t.symbol}
              className="rise-in rounded-sm border border-wire bg-ink/60 p-4 backdrop-blur-sm"
            >
              <div
                className="flex items-start justify-between"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div>
                  <div className="font-mono text-sm text-paper">{t.symbol}</div>
                  <div className="font-mono text-[11px] text-bone">{t.name}</div>
                </div>
                <Sparkline data={t.trend} positive={t.changePct >= 0} />
              </div>

              <div className="mt-3 flex items-end justify-between">
                <div>
                  <span
                    className={`font-mono text-xl tabular ${
                      t.flash === 'up' ? 'flash-up' : t.flash === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    ${t.price.toFixed(2)}
                  </span>
                  <span
                    className={`ml-2 font-mono text-xs tabular ${
                      t.changePct >= 0 ? 'text-moss' : 'text-rust'
                    }`}
                  >
                    {t.changePct >= 0 ? '+' : ''}
                    {t.changePct.toFixed(2)}%
                  </span>
                </div>
                <button
                  disabled
                  title="Trading opens once this symbol is wired to a verified Coinbase tokenized-equity contract"
                  className="rounded-sm border border-wire px-3 py-1 font-mono text-[11px] text-wire cursor-not-allowed"
                >
                  trade
                </button>
              </div>
            </TiltCard>
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
