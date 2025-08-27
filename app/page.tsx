'use client';

import { useState } from 'react';

// Force dynamic rendering to avoid WASM prerendering issues
export const dynamic = 'force-dynamic';
import { useWallet } from '@meshsdk/react';
import { Asset } from '@meshsdk/core';
import WalletConnection from '../components/WalletConnection';
import WalletBalance from '../components/WalletBalance';
import SendForm from '../components/SendForm';
import TransactionResult from '../components/TransactionResult';

export default function Home() {
  const { connected } = useWallet();
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [completedTxHash, setCompletedTxHash] = useState<string>('');

  const handleAssetsLoad = (assets: Asset[]) => {
    setAvailableAssets(assets);
  };

  const handleTransactionComplete = (txHash: string) => {
    setCompletedTxHash(txHash);
  };

  const handleCloseResult = () => {
    setCompletedTxHash('');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Send ADA & Native Tokens
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect your Cardano wallet and easily send ADA or native tokens to any address
          on the Cardano preprod testnet.
        </p>
      </div>

      {/* Wallet Connection */}
      <WalletConnection />

      {/* Wallet Information & Send Form */}
      {connected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Wallet Balance */}
          <div className="space-y-6">
            <WalletBalance onAssetsLoad={handleAssetsLoad} />
          </div>

          {/* Right Column - Send Form */}
          <div className="space-y-6">
            <SendForm
              availableAssets={availableAssets}
              onTransactionComplete={handleTransactionComplete}
            />
          </div>
        </div>
      )}

      {/* Getting Started Guide for Non-Connected Users */}
      {!connected && (
        <div className="card max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cardano-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                1
              </div>
              <div>
                <p className="font-semibold">Install a Wallet</p>
                <p className="text-sm text-gray-600">
                  Install one of the supported wallets: Nami, Eternl, Flint, or Lace
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cardano-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                2
              </div>
              <div>
                <p className="font-semibold">Get Testnet ADA</p>
                <p className="text-sm text-gray-600">
                  Visit the{' '}
                  <a
                    href="https://docs.cardano.org/cardano-testnet/tools/faucet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cardano-blue hover:text-cardano-light underline"
                  >
                    Cardano Testnet Faucet
                  </a>{' '}
                  to get free testnet ADA
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cardano-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                3
              </div>
              <div>
                <p className="font-semibold">Connect & Send</p>
                <p className="text-sm text-gray-600">
                  Connect your wallet above and start sending ADA or native tokens
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Result Modal */}
      {completedTxHash && (
        <TransactionResult
          txHash={completedTxHash}
          onClose={handleCloseResult}
        />
      )}
    </div>
  );
}