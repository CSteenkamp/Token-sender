'use client';

import { useState, useEffect } from 'react';
import dynamicImport from 'next/dynamic';

// Force dynamic rendering to avoid WASM prerendering issues
export const dynamic = 'force-dynamic';

// Dynamically import components that don't need to be server-side rendered
const DynamicThemeControls = dynamicImport(() => import('../components/DynamicThemeControls'), { ssr: false });

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>{/* Main Content - Always loads */}
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Send ADA & Native Tokens
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect your Cardano wallet using the button in the top right corner to start sending ADA or native tokens 
            to any address on the Cardano blockchain.
          </p>
        </div>

        {/* App Controls */}
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              App Settings
            </h3>
            <div className="flex items-center space-x-3">
              {mounted && <DynamicThemeControls />}
            </div>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Getting Started</h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-cardano-blue text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Install a Wallet</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Install one of the supported Cardano wallet browser extensions:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Nami', url: 'https://namiwallet.io' },
                    { name: 'Eternl', url: 'https://eternl.io' },
                    { name: 'Flint', url: 'https://flint-wallet.com' },
                    { name: 'Lace', url: 'https://www.lace.io' }
                  ].map((wallet) => (
                    <a
                      key={wallet.name}
                      href={wallet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-cardano-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {wallet.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-cardano-blue text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Get Testnet ADA</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Get free testnet ADA to try out the token sender:
                </p>
                <a
                  href="https://docs.cardano.org/cardano-testnet/tools/faucet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Visit Cardano Testnet Faucet
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-cardano-blue text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Connect & Send</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Click the "Connect Wallet" button in the top right corner to connect your wallet. 
                  Once connected, you'll see your balance and can start sending ADA or native tokens.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Multi-Wallet Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compatible with Nami, Eternl, Flint, and Lace wallets
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Multi-Network Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between Mainnet, Preprod, and Preview networks
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Token Metadata</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View token names and images powered by Blockfrost API
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Dark Mode</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toggle between light and dark themes
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}