'use client';

import dynamicImport from 'next/dynamic';
import ErrorBoundary from '../components/ErrorBoundary';

// Force dynamic rendering to avoid WASM prerendering issues
export const dynamic = 'force-dynamic';

// Dynamically import the main CardanoApp with simpler error handling
const CardanoApp = dynamicImport(() => import('../components/CardanoApp'), {
  ssr: false,
  loading: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Send ADA & Native Tokens
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Loading Cardano wallet integration...
        </p>
      </div>
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Send ADA & Native Tokens
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Connect your Cardano wallet and easily send ADA or native tokens to any address
          on the Cardano blockchain.
        </p>
      </div>

      {/* Main Cardano App */}
      <ErrorBoundary
        fallback={
          <div className="card">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              Unable to Load Wallet Integration
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There was an issue loading the Cardano wallet integration. This might be due to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
              <li>Missing Cardano wallet browser extension</li>
              <li>Network connectivity issues</li>
              <li>Browser compatibility problems</li>
            </ul>
            <button
              onClick={() => window.location.reload()}
              className="bg-cardano-blue text-white px-4 py-2 rounded-lg hover:bg-cardano-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        }
      >
        <CardanoApp />
      </ErrorBoundary>
    </div>
  );
}