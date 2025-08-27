'use client';

import { useWallet, useWalletList } from '@meshsdk/react';
import { useState } from 'react';
import { useNetwork } from './NetworkProvider';

export default function HeaderWalletConnection() {
  const { connect, connected, disconnect, wallet, name } = useWallet();
  const wallets = useWalletList();
  const { currentNetwork, networkConfig } = useNetwork();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);

  // Filter to show only the specified wallets
  const supportedWallets = wallets.filter((wallet) =>
    ['nami', 'eternl', 'flint', 'lace'].includes(wallet.name.toLowerCase())
  );

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true);
    try {
      await connect(walletName);
      setShowWalletList(false);
    } catch (err) {
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  if (connected && wallet) {
    return (
      <div className="flex items-center space-x-3">
        {/* Network Indicator */}
        <span className={`network-indicator network-${currentNetwork} text-xs px-2 py-1 rounded`}>
          {networkConfig.displayName}
        </span>
        
        {/* Wallet Status */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
            {name || 'Connected'}
          </span>
        </div>
        
        {/* Disconnect Button */}
        <button
          onClick={handleDisconnect}
          className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Connect Button */}
      <button
        onClick={() => setShowWalletList(!showWalletList)}
        disabled={isConnecting}
        className="px-4 py-2 bg-cardano-blue text-white text-sm font-medium rounded-lg hover:bg-cardano-dark transition-colors disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {/* Wallet Selection Dropdown */}
      {showWalletList && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
              Network: {networkConfig.displayName}
            </div>
            {supportedWallets.length > 0 ? (
              supportedWallets.map((walletOption) => (
                <button
                  key={walletOption.name}
                  onClick={() => handleConnect(walletOption.name)}
                  disabled={isConnecting}
                  className="w-full flex items-center space-x-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <img
                    src={walletOption.icon}
                    alt={walletOption.name}
                    className="w-6 h-6"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {walletOption.name}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
                No wallets detected
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showWalletList && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowWalletList(false)}
        />
      )}
    </div>
  );
}