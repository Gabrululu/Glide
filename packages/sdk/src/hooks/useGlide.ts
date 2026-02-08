'use client';

import { useEffect, useState } from 'react';

import { usePrivy, useCreateWallet, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom } from 'viem';
import { useGlideContext } from '../GlideProvider';
import { YellowService } from '../services/YellowService';
import { ArcService } from '../services/ArcService';
import { ENSService } from '../services/ENSService';
import type { GlideSession, GlideTransaction, ENSProfile } from '../types';

export function useGlide(): any {
    const { login, logout, user, authenticated, ready: privyReady, createWallet } = usePrivy();
    const { wallets } = useWallets();
    const { config, session, setSession } = useGlideContext();
    const [profile, setProfile] = useState<ENSProfile | null>(null);

    // Load profile on auth
    useEffect(() => {
        if (user?.wallet?.address) {
            ENSService.getProfile(user.wallet.address).then(setProfile);
        } else {
            setProfile(null);
        }
    }, [user?.wallet?.address]);

    // Helper to get viem wallet client
    // Helper to get viem wallet client
    const getWalletClient = async () => {
        const userWalletAddress = user?.wallet?.address;
        if (!userWalletAddress) throw new Error('No user wallet address');

        // Find the wallet that matches the authenticated user's wallet address
        const wallet = wallets.find((w) => w.address.toLowerCase() === userWalletAddress.toLowerCase());

        if (!wallet) {
            // Fallback: If no matching wallet found in list yet (race condition), wait or throw
            console.warn('[Glide] Wallet not found in useWallets list yet', wallets);
            throw new Error('Wallet not initializing, please try again');
        }

        // Switch to Base Sepolia if needed
        const chainId = '0x14a34'; // 84532
        if (wallet.chainId !== chainId) {
            try {
                await wallet.switchChain(84532);
            } catch (e) {
                console.error('[Glide] Failed to switch chain', e);
                // Continue anyway, might be already on correct chain or wallet ignores request
            }
        }

        const provider = await wallet.getEthereumProvider();
        return createWalletClient({
            account: wallet.address as `0x${string}`,
            chain: {
                id: 84532,
                name: 'Base Sepolia',
                network: 'base-sepolia',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: { default: { http: ['https://sepolia.base.org'] }, public: { http: ['https://sepolia.base.org'] } },
            } as any,
            transport: custom(provider),
        });
    };

    /**
     * Create a new Glide session for the user
     * This should only be called when user is already authenticated
     */
    const createSession = async (): Promise<GlideSession> => {
        try {
            // User must be authenticated and have a wallet
            if (!authenticated || !user?.wallet?.address) {
                throw new Error('Please log in first');
            }

            const walletClient = await getWalletClient();
            const walletAddress = user.wallet.address;

            // Create Yellow session (User signs message here)
            const yellowSession = await YellowService.createSession(
                walletClient,
                walletAddress,
                {
                    duration: config.trialDays || 7,
                    allowance: config.trialAmount || '0.1',
                }
            );

            // Create Glide session
            const trialStartDate = new Date();
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + (config.trialDays || 7));

            const newSession: GlideSession = {
                userId: user.id,
                walletAddress,
                sessionId: yellowSession.sessionId,
                trialStartDate,
                trialEndDate,
                isActive: true,
                balance: config.trialAmount || '0.1',
                gasSaved: '0',
            };

            setSession(newSession);
            return newSession;
        } catch (error) {
            console.error('Failed to create session:', error);
            throw error;
        }
    };

    // Validate session on mount and when it changes
    useEffect(() => {
        const validateSession = async () => {
            if (session?.sessionId) {
                const channel = await YellowService.getChannelInfo(session.sessionId);
                if (!channel) {
                    console.warn('[Glide] Session exists but channel not found. Clearing stale session.');
                    handleLogout();
                }
            }
        };
        validateSession();
    }, [session]);

    /**
     * Send a gasless transaction during trial period
     */
    const sendTransaction = async (
        tx: Omit<GlideTransaction, 'id' | 'timestamp' | 'status' | 'gasless'>
    ): Promise<GlideTransaction> => {
        if (!session) {
            throw new Error('No active session');
        }

        try {
            const walletClient = await getWalletClient();

            // Send transaction via Yellow (off-chain, user signs)
            const result = await YellowService.sendTransaction(
                walletClient,
                session.walletAddress,
                {
                    sessionId: session.sessionId,
                    ...tx,
                }
            );

            const transaction: GlideTransaction = {
                id: result.txId,
                ...tx,
                timestamp: new Date(),
                status: 'completed',
                gasless: true,
            };

            // Update gas saved & stats persistently
            const profile = await ENSService.updateStats(session.walletAddress, {
                swaps: 1,
                gas: 0.5
            });

            // Update session state to reflect new total
            const gasSaved = profile.stats?.gasSaved || 0;
            setSession({ ...session, gasSaved: gasSaved.toString() });

            return transaction;
        } catch (error: any) {
            console.error('Transaction failed:', error);

            // Auto-recover from lost channels
            if (error.message?.includes('Channel not found')) {
                console.warn('[Glide] Channel lost during transaction. Resetting session.');
                await handleLogout();
                throw new Error('Session expired. Please log in again.');
            }

            throw error;
        }
    };

    /**
     * Settle the session on-chain via Arc
     */
    const settleSession = async (): Promise<string> => {
        if (!session) {
            throw new Error('No active session');
        }

        try {
            const walletClient = await getWalletClient();

            // Close Yellow session (User signs)
            await YellowService.closeSession(
                walletClient,
                session.walletAddress,
                session.sessionId
            );

            // Settle on Arc
            const txHash = await ArcService.settleSession(
                walletClient,
                {
                    sessionId: session.sessionId,
                    walletAddress: session.walletAddress,
                    finalBalance: session.balance,
                }
            );

            // Mark session as inactive
            setSession({ ...session, isActive: false });

            return txHash;
        } catch (error) {
            console.error('Settlement failed:', error);
            throw error;
        }
    };

    /**
     * Update ENS text record (e.g., for user preferences)
     */
    const updateENSProfile = async (key: string, value: string): Promise<string> => {
        if (!session) {
            throw new Error('No active session');
        }

        try {
            const walletClient = await getWalletClient();
            const name = await ENSService.getGlideName(session.walletAddress);

            return await ENSService.setTextRecord(
                walletClient,
                session.walletAddress,
                {
                    name,
                    key,
                    value,
                }
            );
        } catch (error: any) {
            // Don't log expected user rejections as errors
            if (error?.message?.includes('User rejected') || error?.details?.includes('User rejected')) {
                console.log('[Glide] User rejected ENS signature');
            } else {
                console.error('ENS update failed:', error);
            }
            throw error;
        }
    };

    /**
     * Get remaining trial days
     */
    const getRemainingDays = (): number => {
        if (!session) return 0;
        const now = new Date();
        const diff = session.trialEndDate.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    /**
     * Robust logout function that handles API errors
     */
    const handleLogout = async () => {
        try {
            // 1. Clear Glide session state first
            setSession(null);

            // 2. Clear any local storage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('glide_session');
            }

            // 3. Attempt Privy logout
            // We catch errors here because if the session is already invalid on server (400),
            // we still want the client to feel "logged out"
            await logout();
        } catch (error) {
            console.warn('[Glide] Privy logout error (handled):', error);
            // Force a reload if logout fails to ensure clean state
            // window.location.reload(); 
        }
    };

    return {
        // Privy auth
        login,
        logout: handleLogout, // Export our wrapper instead of original
        user,
        authenticated,
        ready: privyReady,
        createWallet,
        // Glide session
        session,
        createSession,
        sendTransaction,
        settleSession,
        updateENSProfile,
        getRemainingDays,
        profile,
        // Wallet state
        wallets,
    };
}
