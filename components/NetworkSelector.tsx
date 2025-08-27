'use client';

import { useState, useRef, useEffect } from 'react';
import { useNetwork } from './NetworkProvider';
import { NETWORKS, NetworkType } from '../types/networks';

export default function NetworkSelector() {
  const { currentNetwork, networkConfig, setNetwork } = useNetwork();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNetworkSelect = (network: NetworkType) => {
    setNetwork(network);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: networkConfig.color }}
        />
        <span className="text-gray-700 dark:text-gray-300">
          {networkConfig.displayName}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {Object.values(NETWORKS).map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkSelect(network.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  currentNetwork === network.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: network.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {network.displayName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {network.name}
                  </div>
                </div>
                {currentNetwork === network.id && (
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {networkConfig.faucetUrl && (
                <a
                  href={networkConfig.faucetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                >
                  Get testnet ADA →
                </a>
              )}
              {currentNetwork === 'mainnet' && (
                <span className="text-orange-500">⚠️ Real ADA network</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}