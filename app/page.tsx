'use client';

import { useState } from 'react';
import dynamicImport from 'next/dynamic';
import ClientOnly from '../components/ClientOnly';
import ErrorBoundary from '../components/ErrorBoundary';

// Force dynamic rendering to avoid WASM prerendering issues
export const dynamic = 'force-dynamic';

// Test components
const MinimalTest = dynamicImport(() => import('../components/MinimalTest'), { ssr: false });
const MeshTest = dynamicImport(() => import('../components/MeshTest'), { ssr: false });

// Dynamically import all MeshJS-dependent components
const DynamicCardanoApp = dynamicImport(() => import('../components/CardanoApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Send ADA & Native Tokens
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect your Cardano wallet and easily send ADA or native tokens to any address
          on the Cardano preprod testnet.
        </p>
      </div>

      {/* Test Components */}
      <div className="space-y-4">
        <ErrorBoundary>
          <MinimalTest />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <MeshTest />
        </ErrorBoundary>
      </div>

      {/* Client-side Cardano App */}
      <ErrorBoundary>
        <ClientOnly
          fallback={
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
              </div>
            </div>
          }
        >
          <DynamicCardanoApp />
        </ClientOnly>
      </ErrorBoundary>
    </div>
  );
}