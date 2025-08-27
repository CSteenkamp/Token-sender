'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { Asset, Transaction } from '@meshsdk/core';
import { useNetwork } from './NetworkProvider';
import { NetworkValidationService, NetworkValidationError } from '../services/validation';
import TokenImage from './TokenImage';

interface SendFormProps {
  availableAssets: Asset[];
  onTransactionComplete: (txHash: string) => void;
}

type AssetOption = {
  id: string;
  label: string;
  policyId?: string;
  assetName?: string;
  quantity: string;
  decimals?: number;
};

export default function SendForm({ availableAssets, onTransactionComplete }: SendFormProps) {
  const { connected, wallet } = useWallet();
  const { currentNetwork, networkConfig, isNetworkMismatch } = useNetwork();
  const [recipient, setRecipient] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<AssetOption | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [assetOptions, setAssetOptions] = useState<AssetOption[]>([]);

  useEffect(() => {
    // Create asset options including ADA
    const options: AssetOption[] = [
      {
        id: 'ada',
        label: 'ADA (Cardano)',
        quantity: '0', // Will be updated when balance is fetched
        decimals: 6,
      },
    ];

    // Add native tokens
    availableAssets.forEach((asset, index) => {
      const unit = asset.unit || '';
      const policyId = unit.length > 56 ? unit.slice(0, 56) : '';
      const assetName = unit.length > 56 ? unit.slice(56) : unit;
      
      options.push({
        id: `${unit}-${index}`,
        label: assetName || `Token ${index + 1}`,
        policyId: policyId,
        assetName: assetName,
        quantity: asset.quantity.toString(),
        decimals: 0, // Most native tokens don't have decimals
      });
    });

    setAssetOptions(options);
    
    // Auto-select ADA if no asset is selected
    if (!selectedAsset && options.length > 0) {
      setSelectedAsset(options[0]);
    }
  }, [availableAssets, selectedAsset]);

  const validateForm = (): boolean => {
    if (!recipient.trim()) {
      setError('Please enter a recipient address');
      return false;
    }

    if (!selectedAsset) {
      setError('Please select an asset to send');
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    // Check if user has enough balance
    const availableQuantity = parseFloat(selectedAsset.quantity);
    const sendAmount = parseFloat(amount);
    
    if (sendAmount > availableQuantity) {
      setError(`Insufficient balance. Available: ${availableQuantity}`);
      return false;
    }

    // Basic address validation (simplified)
    if (recipient.length < 50) {
      setError('Invalid recipient address format');
      return false;
    }

    return true;
  };

  const handleSend = async () => {
    if (!validateForm() || !wallet || !selectedAsset) return;

    // Additional network validation before sending
    if (isNetworkMismatch) {
      setError(`Cannot send transaction: wallet network mismatch. Please connect to ${networkConfig.displayName}.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validate wallet network before proceeding
      await NetworkValidationService.validateWalletNetwork(wallet, currentNetwork);
      
      const tx = new Transaction({ initiator: wallet });
      const sendAmount = parseFloat(amount);

      if (selectedAsset.id === 'ada') {
        // Send ADA
        const lovelaceAmount = Math.floor(sendAmount * 1000000).toString();
        tx.sendLovelace(recipient, lovelaceAmount);
      } else {
        // Send native token
        const assetUnit = `${selectedAsset.policyId}${selectedAsset.assetName || ''}`;
        const tokenAmount = Math.floor(sendAmount).toString();
        
        tx.sendAssets(recipient, [
          {
            unit: assetUnit,
            quantity: tokenAmount,
          },
        ]);
      }

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      onTransactionComplete(txHash);
      
      // Reset form
      setRecipient('');
      setAmount('');
      
    } catch (err: any) {
      console.error('Transaction error:', err);
      if (err instanceof NetworkValidationError) {
        setError(`Network Error: ${err.message}`);
      } else {
        setError(err.message || `Transaction failed on ${networkConfig.displayName}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!connected) return null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Send Transaction</h3>
        <span className={`network-indicator network-${currentNetwork}`}>
          {networkConfig.displayName}
        </span>
      </div>

      {error && (
        <div className="error-message mb-4">
          {error}
        </div>
      )}

      {isNetworkMismatch && (
        <div className="warning-message mb-4">
          <strong>Network Mismatch:</strong> Your wallet is connected to a different network than the app. 
          Please switch your wallet to {networkConfig.displayName} or change the app network.
        </div>
      )}

      <div className="space-y-4">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={`Enter ${networkConfig.displayName} address...`}
            className="input-field"
            disabled={loading || isNetworkMismatch}
          />
        </div>

        {/* Asset Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Asset to Send
          </label>
          <div className="space-y-2">
            {assetOptions.map((asset) => (
              <label
                key={asset.id}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedAsset?.id === asset.id
                    ? 'border-cardano-blue bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                } ${loading || isNetworkMismatch ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="asset"
                  value={asset.id}
                  checked={selectedAsset?.id === asset.id}
                  onChange={() => setSelectedAsset(asset)}
                  disabled={loading || isNetworkMismatch}
                  className="sr-only"
                />
                <TokenImage 
                  unit={asset.id === 'ada' ? 'ada' : asset.policyId + (asset.assetName || '')}
                  className="w-8 h-8"
                  showName={false}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {asset.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Available: {asset.quantity}
                  </div>
                </div>
                {selectedAsset?.id === asset.id && (
                  <div className="w-5 h-5 bg-cardano-blue rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.000000"
              step="0.000001"
              min="0"
              className="input-field pr-16"
              disabled={loading || isNetworkMismatch}
            />
            {selectedAsset && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {selectedAsset.id === 'ada' ? 'ADA' : 'TOKENS'}
                </span>
              </div>
            )}
          </div>
          {selectedAsset && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Available: {selectedAsset.quantity} {selectedAsset.id === 'ada' ? 'ADA' : 'tokens'}
            </p>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={loading || isNetworkMismatch || !recipient || !selectedAsset || !amount}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending on {networkConfig.displayName}...
            </div>
          ) : (
            `Send on ${networkConfig.displayName}`
          )}
        </button>
      </div>
    </div>
  );
}