'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { Asset, Transaction, MeshTxBuilder } from '@meshsdk/core';

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

    setLoading(true);
    setError('');

    try {
      const txBuilder = new MeshTxBuilder({
        fetcher: wallet.fetcher,
        submitter: wallet.submitter,
      });

      const sendAmount = parseFloat(amount);

      if (selectedAsset.id === 'ada') {
        // Send ADA
        const lovelaceAmount = Math.floor(sendAmount * 1000000); // Convert ADA to lovelace
        
        txBuilder
          .txOut(recipient, [
            {
              unit: 'lovelace',
              quantity: lovelaceAmount.toString(),
            },
          ]);
      } else {
        // Send native token
        const assetUnit = `${selectedAsset.policyId}${selectedAsset.assetName || ''}`;
        
        txBuilder
          .txOut(recipient, [
            {
              unit: assetUnit,
              quantity: Math.floor(sendAmount).toString(),
            },
          ]);
      }

      // Get wallet UTXOs and change address
      const utxos = await wallet.getUtxos();
      const changeAddress = await wallet.getChangeAddress();

      // Build the transaction
      const unsignedTx = await txBuilder
        .selectUtxosFrom(utxos)
        .changeAddress(changeAddress)
        .complete();

      // Sign and submit the transaction
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      onTransactionComplete(txHash);
      
      // Reset form
      setRecipient('');
      setAmount('');
      
    } catch (err: any) {
      console.error('Transaction error:', err);
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) return null;

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Send Transaction</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Cardano address..."
            className="input-field"
            disabled={loading}
          />
        </div>

        {/* Asset Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asset to Send
          </label>
          <select
            value={selectedAsset?.id || ''}
            onChange={(e) => {
              const asset = assetOptions.find(a => a.id === e.target.value);
              setSelectedAsset(asset || null);
            }}
            className="input-field"
            disabled={loading}
          >
            <option value="">Select an asset</option>
            {assetOptions.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.label} (Available: {asset.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
              disabled={loading}
            />
            {selectedAsset && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-gray-500 text-sm">
                  {selectedAsset.id === 'ada' ? 'ADA' : 'TOKENS'}
                </span>
              </div>
            )}
          </div>
          {selectedAsset && (
            <p className="mt-1 text-sm text-gray-600">
              Available: {selectedAsset.quantity} {selectedAsset.id === 'ada' ? 'ADA' : 'tokens'}
            </p>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={loading || !recipient || !selectedAsset || !amount}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </div>
          ) : (
            'Send Transaction'
          )}
        </button>
      </div>
    </div>
  );
}