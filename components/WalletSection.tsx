'use client';

import { useState, useEffect } from 'react';
import dynamicImport from 'next/dynamic';

// Dynamically import wallet-related components to avoid SSR issues
const DynamicWalletProvider = dynamicImport(() => import('./WalletProvider'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center space-x-3">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
      </div>
    </div>
  ),
});

export default function WalletSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-3">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <DynamicWalletProvider />
    </div>
  );
}