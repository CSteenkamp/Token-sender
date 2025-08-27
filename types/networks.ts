export type NetworkType = 'mainnet' | 'preprod' | 'preview';

export interface NetworkConfig {
  id: NetworkType;
  name: string;
  displayName: string;
  blockfrostUrl: string;
  cardanoscanUrl: string;
  faucetUrl?: string;
  color: string;
  chainId: number;
}

export const NETWORKS: Record<NetworkType, NetworkConfig> = {
  mainnet: {
    id: 'mainnet',
    name: 'mainnet',
    displayName: 'Mainnet',
    blockfrostUrl: 'https://cardano-mainnet.blockfrost.io/api/v0',
    cardanoscanUrl: 'https://cardanoscan.io',
    color: '#1e40af', // Blue
    chainId: 1,
  },
  preprod: {
    id: 'preprod',
    name: 'preprod',
    displayName: 'Preprod Testnet',
    blockfrostUrl: 'https://cardano-preprod.blockfrost.io/api/v0',
    cardanoscanUrl: 'https://preprod.cardanoscan.io',
    faucetUrl: 'https://docs.cardano.org/cardano-testnet/tools/faucet',
    color: '#059669', // Green
    chainId: 0,
  },
  preview: {
    id: 'preview',
    name: 'preview',
    displayName: 'Preview Testnet',
    blockfrostUrl: 'https://cardano-preview.blockfrost.io/api/v0',
    cardanoscanUrl: 'https://preview.cardanoscan.io',
    faucetUrl: 'https://docs.cardano.org/cardano-testnet/tools/faucet',
    color: '#dc2626', // Red
    chainId: 2,
  },
};

export const DEFAULT_NETWORK: NetworkType = 'preprod';