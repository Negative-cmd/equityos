# EquityOS

A 24/7 terminal for Coinbase's tokenized equities on Base — "the floor closes, Base doesn't."

This project was rebuilt from scratch and verified to actually build and run
(no placeholder claims) — see "What's real vs. placeholder" below before you
submit it anywhere.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to vercel.com → **Add New Project** → import that repo.
3. Vercel auto-detects Next.js — no config needed. Click **Deploy**.
4. You'll get a URL like `https://your-project.vercel.app`.

That's the whole flow — no environment variables are required to deploy
(the builder code has a working default baked in).

## What's wired up correctly

- **`base:app_id` meta tag** — lives in `app/layout.tsx`'s `metadata` export,
  so it's present in the rendered `<head>` on every route (verified by
  building and inspecting the served HTML, not just the source).
- **Builder Code (`bc_gc827vuh`)** — this is *not* a meta tag. It's a
  Wagmi/Viem `dataSuffix` appended to onchain transaction calldata for
  attribution, per Base's Builder Codes docs. See `lib/wagmi-config.ts` for
  `DATA_SUFFIX` — pass it as `dataSuffix` on `sendTransaction` /
  `sendCalls` when you wire up real trade execution.
- **Wallet connection** — real Coinbase Wallet connector via Wagmi, targeting
  Base mainnet.
- **Build** — `npm run build` completes with zero errors and zero warnings
  on Next.js 14.2.35 (a patched version — the version numbers floating
  around in older AI-generated scaffolds for this project had a known
  security vulnerability).

## What's placeholder — don't submit this as "trading works"

- The market table (`lib/market-data.ts`) uses **sample prices, not a live
  feed**. It's labeled as such in the UI.
- Every ticker's `contractAddress` is `null` on purpose. **Do not hardcode
  guessed token contract addresses** — get them from Coinbase's verified
  tokenized-equity registry first. A wrong address here would send a real
  trade to the wrong asset.
- The "trade" button is disabled until a verified contract is wired in.

## Next steps to make it contest-ready

1. Get verified Base contract addresses for each tokenized equity from
   Coinbase's official asset list — do not guess or reuse addresses found
   in random repos.
2. Replace `sampleTickers` with a real price feed (Coinbase's API or an
   onchain oracle).
3. Wire the trade button to `useSendTransaction`/`useSendCalls`, passing
   `DATA_SUFFIX` from `lib/wagmi-config.ts` so your builder attribution is
   captured.
4. Once deployed, register the app at base.dev and check builder-code
   attribution is landing (Basescan → your tx → input data → last 16 bytes
   should be `8021`-suffixed).
