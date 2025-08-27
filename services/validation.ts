import { NetworkType } from '../types/networks';

export interface WalletNetworkInfo {
  networkId: number;
  protocolMagic: number;
}

export class NetworkValidationError extends Error {
  constructor(
    message: string,
    public expectedNetwork: NetworkType,
    public walletNetwork: string
  ) {
    super(message);
    this.name = 'NetworkValidationError';
  }
}

export class NetworkValidationService {
  // Cardano network magic numbers
  private static readonly NETWORK_MAGIC = {
    mainnet: 764824073,
    preprod: 1,
    preview: 2,
  };

  private static readonly NETWORK_ID = {
    mainnet: 1,
    preprod: 0,
    preview: 2,
  };

  static async validateWalletNetwork(
    wallet: any,
    expectedNetwork: NetworkType
  ): Promise<boolean> {
    try {
      // Get network info from wallet
      const networkInfo = await this.getWalletNetworkInfo(wallet);
      
      if (!networkInfo) {
        throw new NetworkValidationError(
          'Unable to determine wallet network',
          expectedNetwork,
          'unknown'
        );
      }

      const expectedNetworkId = this.NETWORK_ID[expectedNetwork];
      const isCorrectNetwork = networkInfo.networkId === expectedNetworkId;

      if (!isCorrectNetwork) {
        const walletNetworkName = this.getNetworkNameFromId(networkInfo.networkId);
        throw new NetworkValidationError(
          `Wallet is connected to ${walletNetworkName} but app is set to ${expectedNetwork}`,
          expectedNetwork,
          walletNetworkName
        );
      }

      return true;
    } catch (error) {
      if (error instanceof NetworkValidationError) {
        throw error;
      }
      
      // Handle other errors
      console.error('Network validation error:', error);
      throw new NetworkValidationError(
        'Failed to validate wallet network',
        expectedNetwork,
        'unknown'
      );
    }
  }

  private static async getWalletNetworkInfo(wallet: any): Promise<WalletNetworkInfo | null> {
    try {
      // Try different methods to get network info based on wallet type
      
      // Method 1: Direct network ID access
      if (wallet.getNetworkId) {
        const networkId = await wallet.getNetworkId();
        return { networkId, protocolMagic: 0 };
      }

      // Method 2: Get from UTXOs and parse addresses
      if (wallet.getUtxos) {
        const utxos = await wallet.getUtxos();
        if (utxos && utxos.length > 0) {
          const firstUtxo = utxos[0];
          // Parse network from address (simplified)
          const networkId = this.parseNetworkFromAddress(firstUtxo.output.address);
          if (networkId !== null) {
            return { networkId, protocolMagic: 0 };
          }
        }
      }

      // Method 3: Get from change address
      if (wallet.getChangeAddress) {
        const changeAddress = await wallet.getChangeAddress();
        const networkId = this.parseNetworkFromAddress(changeAddress);
        if (networkId !== null) {
          return { networkId, protocolMagic: 0 };
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get wallet network info:', error);
      return null;
    }
  }

  private static parseNetworkFromAddress(address: string): number | null {
    try {
      // Cardano addresses start with different prefixes based on network
      // This is a simplified check - in production you'd use proper address parsing
      
      if (address.startsWith('addr1')) {
        return 1; // Mainnet
      } else if (address.startsWith('addr_test1')) {
        return 0; // Testnet (preprod/preview)
      }
      
      return null;
    } catch {
      return null;
    }
  }

  private static getNetworkNameFromId(networkId: number): string {
    switch (networkId) {
      case 1:
        return 'mainnet';
      case 0:
        return 'testnet';
      case 2:
        return 'preview';
      default:
        return 'unknown';
    }
  }

  static getNetworkDisplayName(network: NetworkType): string {
    const names = {
      mainnet: 'Cardano Mainnet',
      preprod: 'Preprod Testnet',
      preview: 'Preview Testnet',
    };
    return names[network] || network;
  }

  static getNetworkWarningMessage(expectedNetwork: NetworkType): string {
    const warnings = {
      mainnet: '⚠️ You are about to transact on MAINNET with real ADA. Double-check all details.',
      preprod: 'ℹ️ You are using Preprod testnet. This is safe for testing.',
      preview: 'ℹ️ You are using Preview testnet. This is safe for testing.',
    };
    return warnings[expectedNetwork] || '';
  }
}