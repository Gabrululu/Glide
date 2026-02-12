import { type Address, type WalletClient, createWalletClient, custom, createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import {
    CONTRACTS,
    ERC20_ABI,
    UNISWAP_V4_POOL_MANAGER_ABI,
    TRIAL_USDC_ABI,
    GLIDE_SESSION_ABI,
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

    /**
     * Claim trial USDC funds
     */
    static async claimTrialFunds(
        walletClient: WalletClient,
        userAddress: Address
    ): Promise<TransactionResult> {
        try {
            const hash = await walletClient.writeContract({
                address: CONTRACTS.TRIAL_USDC as Address,
                abi: TRIAL_USDC_ABI,
                functionName: 'claimTrialFunds',
                args: [],
                account: userAddress,
                chain: baseSepolia,
            });

            return {
                success: true,
                txHash: hash,
            };
        } catch (error: any) {
            console.error('Claim funds error:', error);
            return {
                success: false,
                error: error.message || 'Claim funds failed',
            };
        }
    }

    /**
     * Create a new Glide session
     */
    static async createSession(
        walletClient: WalletClient,
        userAddress: Address,
        trialDays: bigint = 7n,
        initialBalance: bigint = 100000000n // 100 USDC
    ): Promise<TransactionResult> {
        try {
            // First approve USDC spending
            const approveHash = await walletClient.writeContract({
                address: CONTRACTS.TRIAL_USDC as Address,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [CONTRACTS.SESSION_CONTRACT as Address, initialBalance],
                account: userAddress,
                chain: baseSepolia,
            });

            // Wait for approval
            await this.waitForTransaction(approveHash);

            // Create session
            const hash = await walletClient.writeContract({
                address: CONTRACTS.SESSION_CONTRACT as Address,
                abi: GLIDE_SESSION_ABI,
                functionName: 'createSession',
                args: [userAddress, trialDays, initialBalance],
                account: userAddress,
                chain: baseSepolia,
            });

            return {
                success: true,
                txHash: hash,
            };
        } catch (error: any) {
            console.error('Create session error:', error);
            return {
                success: false,
                error: error.message || 'Create session failed',
            };
        }
    }
    /**
     * Get active session for user from blockchain
     */
    static async getActiveSession(userAddress: Address): Promise<any | null> {
        try {
            // 1. Get all user sessions
            const sessionIds = await publicClient.readContract({
                address: CONTRACTS.SESSION_CONTRACT as Address,
                abi: GLIDE_SESSION_ABI,
                functionName: 'getUserSessions',
                args: [userAddress],
            }) as `0x${string}`[];

            if (!sessionIds || sessionIds.length === 0) return null;

            // 2. Iterate backwards to find latest active session
            for (let i = sessionIds.length - 1; i >= 0; i--) {
                const sessionId = sessionIds[i];
                const sessionData = await publicClient.readContract({
                    address: CONTRACTS.SESSION_CONTRACT as Address,
                    abi: GLIDE_SESSION_ABI,
                    functionName: 'getSession',
                    args: [sessionId],
                }) as any;

                // Struct: user, startTime, endTime, initialBalance, currentBalance, isActive, transactionCount, gasSaved
                // Index: 0,    1,         2,       3,              4,              5,        6,                7

                if (sessionData.isActive) {
                    // Map to GlideSession
                    return {
                        userId: userAddress, // Use address as ID for now
                        walletAddress: userAddress,
                        sessionId: sessionId,
                        trialStartDate: new Date(Number(sessionData.startTime) * 1000),
                        trialEndDate: new Date(Number(sessionData.endTime) * 1000),
                        isActive: true,
                        balance: sessionData.currentBalance.toString(),
                        gasSaved: sessionData.gasSaved.toString()
                    };
                }
            }

            return null;
        } catch (error) {
            console.error('Failed to fetch active session:', error);
            return null;
        }
    }
}
