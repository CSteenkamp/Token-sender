'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { NetworkType, NetworkConfig, NETWORKS, DEFAULT_NETWORK } from '../types/networks';

interface NetworkContextType {
  currentNetwork: NetworkType;
  networkConfig: NetworkConfig;
  setNetwork: (network: NetworkType) => void;
  isNetworkMismatch: boolean;
  setNetworkMismatch: (mismatch: boolean) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>(DEFAULT_NETWORK);
  const [isNetworkMismatch, setIsNetworkMismatch] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cardano-sender-network') as NetworkType;
      const initialNetwork = stored && NETWORKS[stored] ? stored : DEFAULT_NETWORK;
      
      setCurrentNetwork(initialNetwork);
    } catch (error) {
      console.warn('Failed to load network from localStorage:', error);
      setCurrentNetwork(DEFAULT_NETWORK);
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cardano-sender-network', currentNetwork);
    }
  }, [currentNetwork, mounted]);

  const setNetwork = (network: NetworkType) => {
    if (NETWORKS[network]) {
      setCurrentNetwork(network);
      setIsNetworkMismatch(false); // Reset mismatch when changing networks
    }
  };

  const setNetworkMismatch = (mismatch: boolean) => {
    setIsNetworkMismatch(mismatch);
  };

  const networkConfig = NETWORKS[currentNetwork];

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NetworkContext.Provider
      value={{
        currentNetwork,
        networkConfig,
        setNetwork,
        isNetworkMismatch,
        setNetworkMismatch,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}