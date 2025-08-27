'use client';

import { useState, useEffect } from 'react';
import dynamicImport from 'next/dynamic';

// Dynamically import MeshJS wallet components
const DynamicWalletConnection = dynamicImport(() => import('./MeshWalletConnection'), {
  ssr: false,
  loading: () => (
    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg opacity-75 cursor-wait">
      Loading...
    </button>
  ),
});

export default function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const [meshFailed, setMeshFailed] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Test if MeshJS can be loaded
    const testMesh = async () => {
      try {
        await import('@meshsdk/react');
        await import('@meshsdk/core');
      } catch (error) {
        console.warn('MeshJS failed to load:', error);
        setMeshFailed(true);
      }
    };
    
    testMesh();
  }, []);

  if (!mounted) {
    return (
      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg opacity-75">
        Loading...
      </button>
    );
  }

  if (meshFailed) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Wallet unavailable
        </span>
      </div>
    );
  }

  return <DynamicWalletConnection />;
}