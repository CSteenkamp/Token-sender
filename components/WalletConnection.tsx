'use client';

import { useWallet, useWalletList } from '@meshsdk/react';
import { useState } from 'react';
import { useNetwork } from './NetworkProvider';
import { NetworkValidationService, NetworkValidationError } from '../services/validation';

export default function WalletConnection() {
  const { connect, connected, disconnect, wallet, name } = useWallet();
  const wallets = useWalletList();
  const { currentNetwork, networkConfig, setNetworkMismatch } = useNetwork();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  // Filter to show only the specified wallets
  const supportedWallets = wallets.filter((wallet) =>
    ['nami', 'eternl', 'flint', 'lace'].includes(wallet.name.toLowerCase())
  );

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true);
    setError('');
    
    try {
      await connect(walletName);
      
      // Validate network after connection - give wallet time to initialize
      setTimeout(async () => {
        try {
          if (wallet) {
            await NetworkValidationService.validateWalletNetwork(wallet, currentNetwork);
            setNetworkMismatch(false);
          }
        } catch (err) {
          if (err instanceof NetworkValidationError) {
            setError(`Network mismatch: ${err.message}. Please switch your wallet to ${NetworkValidationService.getNetworkDisplayName(currentNetwork)}.`);
            setNetworkMismatch(true);
          } else {
            console.warn('Network validation warning:', err);
          }
        }
      }, 1000);
      
    } catch (err) {
      setError(`Failed to connect to ${walletName}. Please make sure the wallet is installed and unlocked.`);
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setError('');
      setNetworkMismatch(false);
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  if (connected && wallet) {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Wallet Connected</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{name || 'Connected'}</p>
                <span className={`network-indicator network-${currentNetwork}`}>
                  {networkConfig.displayName}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="btn-secondary"
            disabled={isConnecting}
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Connect Your Wallet</h2>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <p className="text-gray-600 dark:text-gray-400">Connecting to</p>
          <span className={`network-indicator network-${currentNetwork}`}>
            {networkConfig.displayName}
          </span>
        </div>
        {NetworkValidationService.getNetworkWarningMessage(currentNetwork) && (
          <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
            {NetworkValidationService.getNetworkWarningMessage(currentNetwork)}
          </p>
        )}
      </div>

      {error && (
        <div className="error-message mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {supportedWallets.length > 0 ? (
          supportedWallets.map((walletOption) => (
            <button
              key={walletOption.name}
              onClick={() => handleConnect(walletOption.name)}
              disabled={isConnecting}
              className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:border-cardano-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src={walletOption.icon}
                alt={walletOption.name}
                className="w-8 h-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{walletOption.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isConnecting ? 'Connecting...' : 'Click to connect'}
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No supported wallets detected.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Please install one of the following wallets: Nami, Eternl, Flint, or Lace
            </p>
          </div>
        )}
      </div>
    </div>
  );
}