'use client';

import { useState } from 'react';

interface TransactionResultProps {
  txHash: string;
  onClose: () => void;
}

export default function TransactionResult({ txHash, onClose }: TransactionResultProps) {
  const [copied, setCopied] = useState(false);

  const cardanoscanUrl = `https://preprod.cardanoscan.io/transaction/${txHash}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Transaction Successful!
          </h3>
          <p className="text-gray-600">
            Your transaction has been submitted to the Cardano network.
          </p>
        </div>

        {/* Transaction Hash */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Hash
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-gray-100 rounded-lg font-mono text-sm">
              {truncateHash(txHash)}
            </div>
            <button
              onClick={copyToClipboard}
              className="p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              title="Copy full hash"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          <a
            href={cardanoscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center"
          >
            View on Cardanoscan
          </a>
          
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Send Another Transaction
          </button>
        </div>

        {/* Network Info */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Network:</span> Preprod Testnet
          </p>
          <p className="text-xs text-blue-600 mt-1">
            This transaction was submitted to the Cardano preprod testnet. 
            It may take a few minutes to be confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}