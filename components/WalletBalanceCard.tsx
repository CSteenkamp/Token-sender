'use client';

import { useState, useEffect } from 'react';

interface WalletBalanceCardProps {
  onWalletConnected?: (connected: boolean) => void;
}

export default function WalletBalanceCard({ onWalletConnected }: WalletBalanceCardProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for wallet connection every second
    const interval = setInterval(() => {
      checkWalletConnection();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const checkWalletConnection = async () => {
    try {
      // Check if MeshJS wallet is available and connected
      const meshModule = await import('@meshsdk/react');
      const { useWallet } = meshModule;
      
      // This is a simplified check - in a real app you'd use the hook properly
      // For now, we'll simulate wallet connection status
      const connected = localStorage.getItem('wallet-connected') === 'true';
      const name = localStorage.getItem('wallet-name') || '';
      
      if (connected !== isConnected) {
        setIsConnected(connected);
        setWalletName(name);
        onWalletConnected?.(connected);
        
        if (connected) {
          loadBalance();
        } else {
          setBalance(null);
        }
      }
    } catch (error) {
      // MeshJS not available, keep disconnected state
      if (isConnected) {
        setIsConnected(false);
        setBalance(null);
        onWalletConnected?.(false);
      }
    }
  };

  const loadBalance = async () => {
    setLoading(true);
    try {
      // Simulate loading wallet balance
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock balance data
      setBalance('1,234.56');
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Wallet Connected
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Connect your wallet using the button in the top right corner to view your balance and send tokens.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Wallet Balance
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {walletName || 'Connected'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ADA Balance */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">₳</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {balance} ADA
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Cardano
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ~$1,852.34 USD
              </div>
            </div>
          </div>

          {/* Mock Native Tokens */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Native Tokens
            </h4>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Loading tokens...
            </div>
          </div>

          {/* Send Button */}
          <button className="w-full btn-primary mt-4">
            Send Tokens
          </button>
        </div>
      )}
    </div>
  );
}