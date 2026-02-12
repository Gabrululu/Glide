'use client';

import { useEffect, useState } from 'react';

import { usePrivy, useCreateWallet, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom } from 'viem';
import { useGlideContext } from '../GlideProvider';
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

            // Hydrate session from blockchain (Persistence)
            const hydrateSession = async () => {
                const activeSession = await import('../services/BlockchainService').then(m => m.BlockchainService.getActiveSession(user.wallet!.address as `0x${string}`));
                if (activeSession) {
                    setSession(activeSession);
                }
            };
            hydrateSession();
        } else {
            setProfile(null);
            setSession(null);
        }
    }, [user?.wallet?.address, setSession]);

    // Helper to get viem wallet client
    const getWalletClient = async () => {
        const userWalletAddress = user?.wallet?.address;
        if (!userWalletAddress) throw new Error('No user wallet address');

        // Find the wallet that matches the authenticated user's wallet address
        const wallet = wallets.find((w) => w.address.toLowerCase() === userWalletAddress.toLowerCase());

        if (!wallet) {
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
     * Simplified: No more Yellow state channels, just local session management
     */
    const createSession = async (): Promise<GlideSession> => {
        try {
            // User must be authenticated and have a wallet
            if (!authenticated || !user?.wallet?.address) {
                throw new Error('Please log in first');
            }

            const walletAddress = user.wallet.address;

            // Create Glide session (simplified - no Yellow)
            const trialStartDate = new Date();
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + (config.trialDays || 7));

            const sessionId = `glide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const newSession: GlideSession = {
                userId: user.id,
                walletAddress,
                sessionId,
                trialStartDate,
                trialEndDate,
                isActive: true,
                balance: config.trialAmount || '100.00',
                gasSaved: '0',
            };

            setSession(newSession);
            return newSession;
        } catch (error) {
            console.error('Failed to create session:', error);
            throw error;
        }
    };

    /**
     * Send a transaction (simulated for demo)
     * In production: Would interact with actual contracts
     */
    const sendTransaction = async (
        tx: Omit<GlideTransaction, 'id' | 'timestamp' | 'status' | 'gasless'>
    ): Promise<GlideTransaction> => {
        if (!session) {
            throw new Error('No active session');
        }

        try {
            // Simulate transaction processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const transaction: GlideTransaction = {
                id: txId,
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
            await logout();
        } catch (error) {
            console.warn('[Glide] Privy logout error (handled):', error);
        }
    };

    return {
        // Privy auth
        login,
        logout: handleLogout,
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
