export type Ticker = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  // Short relative trend used to draw the sparkline. Sample shape only.
  trend: number[];
  // Left null on purpose. Wire this to Coinbase's verified tokenized-stock
  // registry before enabling trading — do not hardcode contract addresses,
  // a wrong address here would send a real trade to the wrong asset.
  contractAddress: `0x${string}` | null;
};

// Sample display data only. Replace with a live feed before shipping.
export const sampleTickers: Ticker[] = [
  {
    symbol: 'AAPL',
    name: 'Apple',
    price: 232.41,
    changePct: 1.84,
    trend: [228, 229, 227, 230, 231, 229, 232.41],
    contractAddress: null,
  },
  {
    symbol: 'NVDA',
    name: 'Nvidia',
    price: 177.92,
    changePct: 3.21,
    trend: [168, 170, 169, 173, 172, 175, 177.92],
    contractAddress: null,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla',
    price: 351.08,
    changePct: -0.42,
    trend: [356, 354, 357, 353, 350, 352, 351.08],
    contractAddress: null,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon',
    price: 231.64,
    changePct: 1.17,
    trend: [227, 228, 226, 229, 230, 229.5, 231.64],
    contractAddress: null,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet',
    price: 168.55,
    changePct: 0.63,
    trend: [166, 167, 165.5, 167.5, 168, 167.8, 168.55],
    contractAddress: null,
  },
  {
    symbol: 'META',
    name: 'Meta',
    price: 512.09,
    changePct: -1.05,
    trend: [520, 518, 522, 516, 514, 515, 512.09],
    contractAddress: null,
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
