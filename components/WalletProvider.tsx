'use client';

import { MeshProvider } from '@meshsdk/react';
import { NetworkProvider } from './NetworkProvider';
import HeaderWalletConnection from './HeaderWalletConnection';
import ErrorBoundary from './ErrorBoundary';

export default function WalletProvider() {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Wallet unavailable
          </span>
        </div>
      }
    >
      <NetworkProvider>
        <MeshProvider>
          <HeaderWalletConnection />
        </MeshProvider>
      </NetworkProvider>
    </ErrorBoundary>
  );
}