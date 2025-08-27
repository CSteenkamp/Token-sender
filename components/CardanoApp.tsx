'use client';

import { useState } from 'react';
import { useWallet, MeshProvider } from '@meshsdk/react';
import { Asset } from '@meshsdk/core';
import { ThemeProvider } from './ThemeProvider';
import { NetworkProvider } from './NetworkProvider';
import ThemeToggle from './ThemeToggle';
import NetworkSelector from './NetworkSelector';
import WalletConnection from './WalletConnection';
import WalletBalance from './WalletBalance';
import SendForm from './SendForm';
import TransactionResult from './TransactionResult';

function CardanoAppContent() {
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
    <>
      {/* App Controls */}
      <div className="card mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            App Settings
          </h2>
          <div className="flex items-center space-x-3">
            <NetworkSelector />
            <ThemeToggle />
          </div>
        </div>
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
    </>
  );
}

export default function CardanoApp() {
  return (
    <ThemeProvider>
      <NetworkProvider>
        <MeshProvider>
          <CardanoAppContent />
        </MeshProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
}