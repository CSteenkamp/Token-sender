'use client';

import { useState, useEffect } from 'react';
import { blockfrostService, TokenMetadata } from '../services/blockfrost';
import { useNetwork } from './NetworkProvider';

interface TokenImageProps {
  unit: string;
  className?: string;
  fallbackText?: string;
  showName?: boolean;
}

export default function TokenImage({ 
  unit, 
  className = "w-8 h-8", 
  fallbackText, 
  showName = false 
}: TokenImageProps) {
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { currentNetwork } = useNetwork();

  useEffect(() => {
    if (unit === 'lovelace' || unit === 'ada') {
      // ADA doesn't need metadata fetching
      setMetadata({ name: 'ADA', ticker: 'ADA' });
      setLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      setLoading(true);
      setImageError(false);
      
      try {
        const meta = await blockfrostService.getTokenMetadata(unit, currentNetwork);
        setMetadata(meta);
      } catch (error) {
        console.error(`Failed to fetch metadata for ${unit}:`, error);
        setMetadata(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [unit, currentNetwork]);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderFallback = () => {
    const text = fallbackText || metadata?.ticker || metadata?.name || '?';
    const displayText = text.length > 3 ? text.slice(0, 3).toUpperCase() : text.toUpperCase();
    
    return (
      <div className={`${className} bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center`}>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
          {displayText}
        </span>
      </div>
    );
  };

  const renderADAIcon = () => (
    <div className={`${className} bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center`}>
      <span className="text-white font-bold text-sm">₳</span>
    </div>
  );

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse`} />
    );
  }

  if (unit === 'lovelace' || unit === 'ada') {
    return (
      <div className="flex items-center space-x-2">
        {renderADAIcon()}
        {showName && (
          <span className="font-medium text-gray-900 dark:text-gray-100">ADA</span>
        )}
      </div>
    );
  }

  const hasValidImage = metadata?.image && !imageError;

  return (
    <div className="flex items-center space-x-2">
      {hasValidImage ? (
        <img
          src={metadata.image}
          alt={metadata.name || 'Token'}
          className={`${className} rounded-lg object-cover`}
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        renderFallback()
      )}
      
      {showName && (
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {metadata?.name || 'Unknown Token'}
          </span>
          {metadata?.ticker && metadata.ticker !== metadata.name && (
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {metadata.ticker}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Hook for getting token metadata
export function useTokenMetadata(unit: string) {
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentNetwork } = useNetwork();

  useEffect(() => {
    if (unit === 'lovelace' || unit === 'ada') {
      setMetadata({ name: 'ADA', ticker: 'ADA' });
      setLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      setLoading(true);
      try {
        const meta = await blockfrostService.getTokenMetadata(unit, currentNetwork);
        setMetadata(meta);
      } catch (error) {
        console.error(`Failed to fetch metadata for ${unit}:`, error);
        setMetadata(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [unit, currentNetwork]);

  return { metadata, loading };
}