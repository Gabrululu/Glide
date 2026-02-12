import { NETWORK_CONFIG } from '../contracts/addresses';

/**
 * BaseScan Integration Utilities
 * Helper functions for generating block explorer links
 */

export class BaseScanService {
    /**
     * Get BaseScan URL for a transaction
     */
    static getTransactionUrl(txHash: string): string {
        return `${NETWORK_CONFIG.blockExplorer}/tx/${txHash}`;
    }

    /**
     * Get BaseScan URL for an address
     */
    static getAddressUrl(address: string): string {
        return `${NETWORK_CONFIG.blockExplorer}/address/${address}`;
    }

    /**
     * Get BaseScan URL for a token
     */
    static getTokenUrl(tokenAddress: string): string {
        return `${NETWORK_CONFIG.blockExplorer}/token/${tokenAddress}`;
    }

    /**
     * Get BaseScan URL for a block
     */
    static getBlockUrl(blockNumber: number): string {
        return `${NETWORK_CONFIG.blockExplorer}/block/${blockNumber}`;
    }

    /**
     * Open transaction in new tab
     */
    static openTransaction(txHash: string): void {
        if (typeof window !== 'undefined') {
            window.open(this.getTransactionUrl(txHash), '_blank');
        }
    }

    /**
     * Open address in new tab
     */
    static openAddress(address: string): void {
        if (typeof window !== 'undefined') {
            window.open(this.getAddressUrl(address), '_blank');
        }
    }

    /**
     * Format transaction hash for display
     */
    static formatTxHash(txHash: string): string {
        if (txHash.length < 10) return txHash;
        return `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;
    }

    /**
     * Format address for display
     */
    static formatAddress(address: string): string {
        if (address.length < 10) return address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
}
