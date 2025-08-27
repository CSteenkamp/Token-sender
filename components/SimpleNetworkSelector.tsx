'use client';

import { useState, useEffect } from 'react';

type Network = 'mainnet' | 'preprod' | 'preview';

interface NetworkConfig {
  id: Network;
  name: string;
  displayName: string;
  color: string;
  description: string;
}

const NETWORKS: Record<Network, NetworkConfig> = {
  mainnet: {
    id: 'mainnet',
    name: 'mainnet',
    displayName: 'Mainnet',
    color: '#1e40af',
    description: 'Live network with real ADA'
  },
  preprod: {
    id: 'preprod',
    name: 'preprod', 
    displayName: 'Preprod',
    color: '#059669',
    description: 'Pre-production testnet'
  },
  preview: {
    id: 'preview',
    name: 'preview',
    displayName: 'Preview', 
    color: '#dc2626',
    description: 'Preview testnet for testing'
  }
};

export default function SimpleNetworkSelector() {
  const [currentNetwork, setCurrentNetwork] = useState<Network>('preprod');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved network
    const saved = localStorage.getItem('cardano-network') as Network;
    if (saved && NETWORKS[saved]) {
      setCurrentNetwork(saved);
    }
    setMounted(true);
  }, []);

  const handleNetworkChange = (network: Network) => {
    setCurrentNetwork(network);
    localStorage.setItem('cardano-network', network);
    setShowDropdown(false);
    
    // Show warning for mainnet
    if (network === 'mainnet') {
      alert('⚠️ You switched to Mainnet. This uses real ADA! Make sure your wallet is set to Mainnet.');
    }
  };

  if (!mounted) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 opacity-75">
        Loading...
      </div>
    );
  }

  const config = NETWORKS[currentNetwork];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title={`Current network: ${config.description}`}
      >
        <div 
          className="w-2 h-2 rounded-full mr-2" 
          style={{ backgroundColor: config.color }}
        ></div>
        {config.displayName}
        <svg
          className={`w-3 h-3 ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
              Select Network:
            </div>
            {Object.values(NETWORKS).map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkChange(network.id)}
                className={`w-full flex items-center justify-between p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentNetwork === network.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: network.color }}
                  ></div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {network.displayName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {network.description}
                    </div>
                  </div>
                </div>
                {currentNetwork === network.id && (
                  <div className="text-green-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-750 rounded-b-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {currentNetwork === 'mainnet' 
                ? '⚠️ This is the live network with real ADA'
                : 'Get free testnet ADA from the Cardano faucet'
              }
            </p>
            {currentNetwork !== 'mainnet' && (
              <a
                href="https://docs.cardano.org/cardano-testnet/tools/faucet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Visit Faucet →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}