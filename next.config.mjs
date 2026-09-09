/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // The wallet-connector stack (WalletConnect, MetaMask SDK, Coinbase's
    // CDP/x402 payment libs) pulls in a handful of optional Node-only or
    // not-yet-published subpaths that we never actually exercise from the
    // browser bundle. Stub them out instead of letting the build fail.
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
      encoding: false,
      '@x402/core/client': false,
      '@x402/evm': false,
      '@x402/evm/exact/client': false,
      '@x402/svm/exact/client': false,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
};

export default nextConfig;
