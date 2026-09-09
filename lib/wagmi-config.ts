import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import * as Attribution from 'ox/erc8021/Attribution';

// Base Builder Code, registered at base.dev > Settings > Builder Codes.
// This is NOT a meta tag — it's appended to onchain transaction calldata
// so activity from this app is attributed to the builder account.
// Docs: https://docs.base.org/apps/builder-codes/app-developers
export const BUILDER_CODE = process.env.NEXT_PUBLIC_BASE_BUILDER_CODE ?? 'bc_iiuykn9c';

// Pass this as `dataSuffix` to `sendTransaction` / `sendCalls` when you wire
// up real trade execution. Base's docs also show a client-level `dataSuffix`
// option on `createConfig`, which is the newer, recommended approach — but
// it isn't in the currently published stable `wagmi` release yet, so this
// project uses the documented per-transaction fallback until that lands.
export const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
});

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({ appName: 'EquityOS', preference: 'all' }),
    injected(),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
