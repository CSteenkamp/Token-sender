'use client';

import { useWallet } from '@meshsdk/react';
import { useEffect, useState } from 'react';
import { Asset } from '@meshsdk/core';
import TokenImage from './TokenImage';
import { useNetwork } from './NetworkProvider';

interface WalletBalanceProps {
  onAssetsLoad: (assets: Asset[]) => void;
}

export default function WalletBalance({ onAssetsLoad }: WalletBalanceProps) {
  const { connected, wallet } = useWallet();
  const { currentNetwork, networkConfig } = useNetwork();
  const [balance, setBalance] = useState<string>('0');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (connected && wallet) {
      fetchBalance();
    }
  }, [connected, wallet, currentNetwork]); // Refetch when network changes

  const fetchBalance = async () => {
    if (!wallet) return;
    
    setLoading(true);
    setError('');

    try {
      // Get ADA balance
      const adaBalance = await wallet.getBalance();
      const adaAmount = (parseInt(adaBalance[0]?.quantity || '0') / 1000000).toFixed(6);
      setBalance(adaAmount);

      // Get all assets
      const allAssets = await wallet.getAssets();
      setAssets(allAssets);
      onAssetsLoad(allAssets);
    } catch (err) {
      setError(`Failed to fetch wallet balance for ${networkConfig.displayName}`);
      console.error('Balance fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) return null;

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error-message mb-4">{error}</div>
        <button onClick={fetchBalance} className="btn-secondary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Wallet Balance</h3>
          <span className={`network-indicator network-${currentNetwork}`}>
            {networkConfig.displayName}
          </span>
        </div>
        
        <div className="bg-gradient-to-r from-cardano-blue to-cardano-light rounded-lg p-4 text-white mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <TokenImage unit="ada" className="w-6 h-6" />
            <div className="text-sm opacity-90">ADA Balance</div>
          </div>
          <div className="text-2xl font-bold">{balance} ADA</div>
        </div>

        <button
          onClick={fetchBalance}
          className="btn-secondary text-sm"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {assets.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Native Tokens ({assets.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {assets.map((asset, index) => {
              const quantity = asset.quantity;
              const unit = asset.unit || '';
              const policyId = unit.length > 56 ? unit.slice(0, 56) : '';
              
              return (
                <div
                  key={`${unit}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <TokenImage 
                      unit={unit} 
                      className="w-10 h-10 flex-shrink-0" 
                      showName={false}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        <TokenImage 
                          unit={unit} 
                          className="w-0 h-0 opacity-0" 
                          showName={true}
                        />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                        {policyId ? `${policyId.slice(0, 12)}...` : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {quantity.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}