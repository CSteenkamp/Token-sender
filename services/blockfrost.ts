import { NetworkType } from '../types/networks';

export interface TokenMetadata {
  name?: string;
  description?: string;
  image?: string;
  decimals?: number;
  ticker?: string;
  url?: string;
  logo?: string;
}

interface BlockfrostAssetMetadata {
  asset: string;
  policy_id: string;
  asset_name: string;
  fingerprint: string;
  quantity: string;
  initial_mint_tx_hash: string;
  mint_or_burn_count: number;
  onchain_metadata?: {
    name?: string;
    description?: string;
    image?: string | string[];
    logo?: string;
    decimals?: number;
    ticker?: string;
    url?: string;
  };
  metadata?: {
    name?: string;
    description?: string;
    logo?: string;
    decimals?: number;
    ticker?: string;
    url?: string;
  };
}

class BlockfrostService {
  private baseUrls = {
    mainnet: 'https://cardano-mainnet.blockfrost.io/api/v0',
    preprod: 'https://cardano-preprod.blockfrost.io/api/v0',
    preview: 'https://cardano-preview.blockfrost.io/api/v0',
  };

  private cache = new Map<string, TokenMetadata>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getHeaders(network: NetworkType): HeadersInit {
    // In production, you'd want to set these as environment variables
    const projectIds = {
      mainnet: process.env.NEXT_PUBLIC_BLOCKFROST_MAINNET_PROJECT_ID,
      preprod: process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_PROJECT_ID,
      preview: process.env.NEXT_PUBLIC_BLOCKFROST_PREVIEW_PROJECT_ID,
    };

    const projectId = projectIds[network];
    
    if (!projectId) {
      throw new Error(`Blockfrost project ID not configured for ${network}`);
    }

    return {
      'project_id': projectId,
      'Content-Type': 'application/json',
    };
  }

  async getTokenMetadata(
    unit: string,
    network: NetworkType
  ): Promise<TokenMetadata | null> {
    const cacheKey = `${network}-${unit}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const expiry = this.cacheExpiry.get(cacheKey) || 0;
      if (Date.now() < expiry) {
        return this.cache.get(cacheKey) || null;
      }
    }

    try {
      const baseUrl = this.baseUrls[network];
      const response = await fetch(`${baseUrl}/assets/${unit}`, {
        headers: this.getHeaders(network),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Asset not found, cache null result
          this.cache.set(cacheKey, {});
          this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: BlockfrostAssetMetadata = await response.json();
      const metadata = this.parseMetadata(data);
      
      // Cache the result
      this.cache.set(cacheKey, metadata);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
      
      return metadata;
    } catch (error) {
      console.error(`Failed to fetch metadata for ${unit}:`, error);
      return null;
    }
  }

  private parseMetadata(data: BlockfrostAssetMetadata): TokenMetadata {
    const onchain = data.onchain_metadata;
    const offchain = data.metadata;
    
    // Combine onchain and offchain metadata
    const metadata: TokenMetadata = {};

    // Name
    metadata.name = onchain?.name || offchain?.name || this.hexToString(data.asset_name);

    // Description
    metadata.description = onchain?.description || offchain?.description;

    // Image/Logo - handle both string and array formats
    let imageUrl = onchain?.image || onchain?.logo || offchain?.logo;
    if (Array.isArray(imageUrl)) {
      imageUrl = imageUrl[0]; // Take first image if array
    }
    if (imageUrl && typeof imageUrl === 'string') {
      metadata.image = this.resolveIpfsUrl(imageUrl);
      metadata.logo = metadata.image;
    }

    // Decimals
    metadata.decimals = onchain?.decimals || offchain?.decimals || 0;

    // Ticker
    metadata.ticker = onchain?.ticker || offchain?.ticker;

    // URL
    metadata.url = onchain?.url || offchain?.url;

    return metadata;
  }

  private hexToString(hex: string): string {
    if (!hex) return '';
    try {
      return Buffer.from(hex, 'hex').toString('utf8');
    } catch {
      return hex;
    }
  }

  private resolveIpfsUrl(url: string): string {
    if (url.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${url.slice(7)}`;
    }
    return url;
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

export const blockfrostService = new BlockfrostService();