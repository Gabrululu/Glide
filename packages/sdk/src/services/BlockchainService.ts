import { type Address, type WalletClient, createWalletClient, custom, createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import {
    CONTRACTS,
    ERC20_ABI,
    UNISWAP_V4_POOL_MANAGER_ABI,
} from '../contracts/addresses';

/**
 * Blockchain Transaction Service
 * Handles real transaction execution with Privy wallet
 */

export interface TransactionResult {
    success: boolean;
    txHash?: string;
    error?: string;
}

// Create public client for reading transaction receipts
const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
});

export class BlockchainService {
    /**
     * Create wallet client from Privy provider
     */
    static createWalletClient(provider: any): WalletClient {
        return createWalletClient({
            chain: baseSepolia,
            transport: custom(provider),
        });
    }

    /**
     * Approve token spending
     */
    static async approveToken(
        walletClient: WalletClient,
        tokenAddress: Address,
        spenderAddress: Address,
        amount: bigint,
        userAddress: Address
    ): Promise<TransactionResult> {
        try {
            const hash = await walletClient.writeContract({
                address: tokenAddress,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [spenderAddress, amount],
                account: userAddress,
                chain: baseSepolia,
            });

            return {
                success: true,
                txHash: hash,
            };
        } catch (error: any) {
            console.error('Approval error:', error);
            return {
                success: false,
                error: error.message || 'Approval failed',
            };
        }
    }

    /**
     * Add liquidity to Uniswap v4 pool
     */
    static async addLiquidity(
        walletClient: WalletClient,
        poolKey: {
            currency0: Address;
            currency1: Address;
            fee: number;
            tickSpacing: number;
            hooks: Address;
        },
        params: {
            tickLower: number;
            tickUpper: number;
            liquidityDelta: bigint;
            salt: `0x${string}`;
        },
        userAddress: Address
    ): Promise<TransactionResult> {
        try {
            const hash = await walletClient.writeContract({
                address: CONTRACTS.UNISWAP_V4_POOL_MANAGER as Address,
                abi: UNISWAP_V4_POOL_MANAGER_ABI,
                functionName: 'modifyLiquidity',
                args: [poolKey, params, '0x' as `0x${string}`], // hookData
                account: userAddress,
                chain: baseSepolia,
            });

            return {
                success: true,
                txHash: hash,
            };
        } catch (error: any) {
            console.error('Add liquidity error:', error);
            return {
                success: false,
                error: error.message || 'Add liquidity failed',
            };
        }
    }

    /**
     * Remove liquidity from Uniswap v4 pool
     */
    static async removeLiquidity(
        walletClient: WalletClient,
        poolKey: {
            currency0: Address;
            currency1: Address;
            fee: number;
            tickSpacing: number;
            hooks: Address;
        },
        params: {
            tickLower: number;
            tickUpper: number;
            liquidityDelta: bigint;
            salt: `0x${string}`;
        },
        userAddress: Address
    ): Promise<TransactionResult> {
        try {
            // Negative liquidityDelta to remove
            const removeParams = {
                ...params,
                liquidityDelta: -params.liquidityDelta,
            };

            const hash = await walletClient.writeContract({
                address: CONTRACTS.UNISWAP_V4_POOL_MANAGER as Address,
                abi: UNISWAP_V4_POOL_MANAGER_ABI,
                functionName: 'modifyLiquidity',
                args: [poolKey, removeParams, '0x' as `0x${string}`],
                account: userAddress,
                chain: baseSepolia,
            });

            return {
                success: true,
                txHash: hash,
            };
        } catch (error: any) {
            console.error('Remove liquidity error:', error);
            return {
                success: false,
                error: error.message || 'Remove liquidity failed',
            };
        }
    }

    /**
     * Execute swap on Uniswap v4
     */
    static async swap(
        walletClient: WalletClient,
        poolKey: {
            currency0: Address;
            currency1: Address;
            fee: number;
            tickSpacing: number;
            hooks: Address;
        },
        swapParams: {
            zeroForOne: boolean;
            amountSpecified: bigint;
            sqrtPriceLimitX96: bigint;
        },
        userAddress: Address
    ): Promise<TransactionResult> {
        try {
            const hash = await walletClient.writeContract({
                address: CONTRACTS.UNISWAP_V4_POOL_MANAGER as Address,
                abi: UNISWAP_V4_POOL_MANAGER_ABI,
                functionName: 'swap',
                args: [poolKey, swapParams, '0x' as `0x${string}`],
                account: userAddress,
                chain: baseSepolia,
            });

            return {
                success: true,
                txHash: hash,
            };
        } catch (error: any) {
            console.error('Swap error:', error);
            return {
                success: false,
                error: error.message || 'Swap failed',
            };
        }
    }

    /**
     * Wait for transaction confirmation
     */
    static async waitForTransaction(
        txHash: `0x${string}`
    ): Promise<boolean> {
        try {
            const receipt = await publicClient.waitForTransactionReceipt({
                hash: txHash,
            });
            return receipt.status === 'success';
        } catch (error) {
            console.error('Transaction wait error:', error);
            return false;
        }
    }
}
