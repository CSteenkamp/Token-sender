'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering to avoid WASM prerendering issues
export const dynamic = 'force-dynamic';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [testStep, setTestStep] = useState(0);

  useEffect(() => {
    console.log('Home: Component mounting...');
    setMounted(true);
    
    // Progressive testing
    const timer = setInterval(() => {
      setTestStep(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Send ADA & Native Tokens
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Loading application...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Send ADA & Native Tokens
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Connect your Cardano wallet and easily send ADA or native tokens to any address
          on the Cardano preprod testnet.
        </p>
      </div>

      {/* Debug Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Debug Information
        </h3>
        <div className="space-y-2 text-sm">
          <p className="text-green-600">✅ React component mounted successfully</p>
          <p className="text-green-600">✅ useState and useEffect working</p>
          <p className="text-green-600">✅ Test step: {testStep}</p>
          <p className="text-blue-600">🔍 Client-side JavaScript is working</p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Status
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Debugging client-side error. Basic React functionality is working.
          MeshJS integration will be restored once we identify the issue.
        </p>
      </div>
    </div>
  );
}