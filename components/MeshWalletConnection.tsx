'use client';

import { useState } from 'react';
import { useWallet, useWalletList, MeshProvider } from '@meshsdk/react';

function WalletConnectionContent() {
  const { connect, connected, disconnect, wallet, name } = useWallet();
  const wallets = useWalletList();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const [error, setError] = useState('');

  // Filter supported wallets
  const supportedWallets = wallets.filter((wallet) =>
    ['nami', 'eternl', 'flint', 'lace'].includes(wallet.name.toLowerCase())
  );

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true);
    setError('');
    try {
      await connect(walletName);
      setShowWalletList(false);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(`Failed to connect to ${walletName}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setError('');
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  if (connected && wallet) {
    return (
      <div className="flex items-center space-x-3">
        {/* Connected Status */}
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
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full right-0 mt-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded shadow-lg whitespace-nowrap z-50">
          {error}
        </div>
      )}

      {/* Wallet Selection Dropdown */}
      {showWalletList && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
              Choose your wallet:
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
                No wallets detected. Please install a Cardano wallet extension.
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

export default function MeshWalletConnection() {
  return (
    <MeshProvider>
      <WalletConnectionContent />
    </MeshProvider>
  );
}