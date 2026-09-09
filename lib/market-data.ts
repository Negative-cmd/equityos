export type Ticker = {
  symbol: string;
  displaySymbol: string;
  name: string;
  price: number;
  changePct: number;
  // Short relative trend used to draw the sparkline. Sample shape only —
  // this project does not have a live price feed wired in.
  trend: number[];
  // Real, verified Coinbase Tokenized Stock (B20) contract addresses on
  // Base mainnet, sourced directly from the official registry at
  // https://www.base.org/stocks — cross-checked against Basescan.
  // "If a token is not on this list, Coinbase did not issue it."
  contractAddress: `0x${string}`;
};

// Prices below are sample display data — not a live feed. Contract
// addresses are real and verified; do not change them without re-checking
// base.org/stocks, since a wrong address would point at the wrong asset.
export const sampleTickers: Ticker[] = [
  {
    symbol: 'AAPL',
    displaySymbol: 'AAPLc',
    name: 'Apple',
    price: 232.41,
    changePct: 1.84,
    trend: [228, 229, 227, 230, 231, 229, 232.41],
    contractAddress: '0xb200000000000000000000C2e324d24d7eEcd1fb',
  },
  {
    symbol: 'NVDA',
    displaySymbol: 'NVDAc',
    name: 'Nvidia',
    price: 177.92,
    changePct: 3.21,
    trend: [168, 170, 169, 173, 172, 175, 177.92],
    contractAddress: '0xb20000000000000000000078ee7ce2fE4908108C',
  },
  {
    symbol: 'TSLA',
    displaySymbol: 'TSLAc',
    name: 'Tesla',
    price: 351.08,
    changePct: -0.42,
    trend: [356, 354, 357, 353, 350, 352, 351.08],
    contractAddress: '0xb2000000000000000000001e800a7f5189430cD0',
  },
  {
    symbol: 'AMZN',
    displaySymbol: 'AMZNc',
    name: 'Amazon',
    price: 231.64,
    changePct: 1.17,
    trend: [227, 228, 226, 229, 230, 229.5, 231.64],
    contractAddress: '0xb200000000000000000000d9192b6B456483C2E8',
  },
  {
    symbol: 'GOOGL',
    displaySymbol: 'GOOGLc',
    name: 'Alphabet',
    price: 168.55,
    changePct: 0.63,
    trend: [166, 167, 165.5, 167.5, 168, 167.8, 168.55],
    contractAddress: '0xb2000000000000000000002D0BA3164cc74f58B7',
  },
  {
    symbol: 'META',
    displaySymbol: 'METAc',
    name: 'Meta',
    price: 512.09,
    changePct: -1.05,
    trend: [520, 518, 522, 516, 514, 515, 512.09],
    contractAddress: '0xb2000000000000000000008bC8786B856E61707C',
  },
];

export function isUsMarketOpen(now: Date = new Date()): boolean {
  const ny = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = ny.getDay();
  const minutes = ny.getHours() * 60 + ny.getMinutes();
  const open = 9 * 60 + 30;
  const close = 16 * 60;
  const isWeekday = day >= 1 && day <= 5;
  return isWeekday && minutes >= open && minutes < close;
}

// Aerodrome is Base's own central liquidity hub and is named directly on
// base.org/stocks as a supported venue for tokenized-stock trading pairs.
// Sending users there (rather than us reinventing swap execution and risk
// managing slippage/routing ourselves) is the honest way to make "trade"
// actually do something real right now.
export function aerodromeSwapUrl(contractAddress: string) {
  return `https://aerodrome.finance/swap?from=eth&to=${contractAddress}`;
}
