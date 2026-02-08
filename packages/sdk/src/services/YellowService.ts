import { type WalletClient, type PublicClient } from 'viem';

/**
 * Enhanced Yellow Network integration service
 * Based on official Yellow Network Nitrolite documentation
 * 
 * Implements realistic cryptographic signing for state channels
 */

interface YellowConfig {
    brokerUrl: string;
    apiKey?: string;
    network: 'testnet' | 'mainnet';
}

interface StateChannel {
    id: string;
    walletAddress: string;
    token: string;
    amount: string;
    status: 'pending' | 'active' | 'closed';
    createdAt: Date;
    expiresAt: Date;
    signatures: string[];
}

interface YellowTransaction {
    id: string;
    channelId: string;
    type: string;
    amount: string;
    token: string;
    timestamp: Date;
    status: 'pending' | 'completed' | 'failed';
    signature?: string;
}

export class YellowService {
    private static channels: Map<string, StateChannel> = new Map();
    private static transactions: Map<string, YellowTransaction> = new Map();

    /**
     * Create a new state channel session
     * Requires user signature to authorize channel creation
     */
    static async createSession(
        walletClient: WalletClient,
        address: string,
        params: {
            duration: number; // days
            allowance: string; // USDC amount
        }
    ): Promise<{ sessionId: string }> {
        this.loadChannels();
        // console.log('[Yellow] Initiating session creation...');

        // 1. Create Channel State compatible with ERC-7824
        const channelState = {
            participant: address,
            token: 'USDC',
            amount: params.allowance,
            nonce: Date.now(),
            chainId: 84532, // Base Sepolia
        };

        const message = `Authorize Yellow Channel Creation:
        Participant: ${channelState.participant}
        Amount: ${channelState.amount} USDC
        Nonce: ${channelState.nonce}
        Chain ID: ${channelState.chainId}`;

        // 2. Request User Signature (Real Cryptography)
        // console.log('[Yellow] Requesting user signature...');
        const signature = await walletClient.signMessage({
            account: address as `0x${string}`,
            message,
        });

        // console.log('[Yellow] Signature received:', signature);

        // 3. Simulate Broker interaction (verify signature & create channel)
        // In production, this signature is sent to the Yellow Broker
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const sessionId = `yellow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + params.duration);

        const channel: StateChannel = {
            id: sessionId,
            walletAddress: address,
            token: 'USDC',
            amount: params.allowance,
            status: 'active',
            createdAt: new Date(),
            expiresAt,
            signatures: [signature],
        };

        this.channels.set(sessionId, channel);
        this.saveChannels();

        /* console.log('[Yellow] State channel established:', {
            sessionId,
            duration: `${params.duration} days`,
            status: 'active',
            onChain: false // Still off-chain until settlement
        }); */

        return { sessionId };
    }

    /**
     * Send an off-chain transaction via Yellow state channel
     * Requires signing the state update
     */
    static async sendTransaction(
        walletClient: WalletClient,
        address: string,
        params: {
            sessionId: string;
            type: string;
            amount: string;
            token: string;
            to?: string;
        }
    ): Promise<{ txId: string }> {
        this.loadChannels();
        const channel = this.channels.get(params.sessionId);
        if (!channel) throw new Error('Channel not found');

        // 1. Prepare State Update
        const stateUpdate = {
            channelId: params.sessionId,
            daddr: params.to || '0xPool',
            amount: params.amount,
            asset: params.token,
            nonce: Date.now(),
        };

        const message = `Yellow State Update:
        Channel: ${stateUpdate.channelId}
        To: ${stateUpdate.daddr}
        Amount: ${stateUpdate.amount} ${stateUpdate.asset}
        Nonce: ${stateUpdate.nonce}`;

        // 2. Request user signature for the state update
        const signature = await walletClient.signMessage({
            account: address as `0x${string}`,
            message,
        });

        // 3. Update Channel State
        const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const transaction: YellowTransaction = {
            id: txId,
            channelId: params.sessionId,
            type: params.type,
            amount: params.amount,
            token: params.token,
            timestamp: new Date(),
            status: 'completed',
            signature,
        };

        this.transactions.set(txId, transaction);
        channel.signatures.push(signature);
        this.saveTransactions();
        // Note: We don't need to saveChannels here unless we modify channel properties other than signatures reference
        // But since signatures is an array in the channel object, and we just pushed to it, we should save channels too to persist the new signature list if that's intended.
        // The original code didn't hold signatures in `channel` permanently in a way that affected logic much, but let's be safe.
        this.saveChannels();

        /* console.log('[Yellow] Off-chain transaction executed:', {
            txId,
            signature: signature.slice(0, 10) + '...',
            gasless: true,
            instant: true,
        }); */

        return { txId };
    }

    private static loadTransactions() {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('glide_transactions');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Rehydrate dates
                parsed.forEach((tx: any) => {
                    tx.timestamp = new Date(tx.timestamp);
                    this.transactions.set(tx.id, tx);
                });
            }
        }
    }

    private static saveTransactions() {
        if (typeof window !== 'undefined') {
            const txs = Array.from(this.transactions.values());
            localStorage.setItem('glide_transactions', JSON.stringify(txs));
        }
    }

    private static loadChannels() {
        if (typeof window !== 'undefined') {
            // Only load if empty to avoid overwriting in-memory state with stale data?
            // Actually, we should probably always merge or just load if empty.
            // Since this is a static service likely re-instantiated on reload, loading if empty is fine.
            if (this.channels.size === 0) {
                const stored = localStorage.getItem('glide_channels');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    parsed.forEach((ch: any) => {
                        ch.createdAt = new Date(ch.createdAt);
                        ch.expiresAt = new Date(ch.expiresAt);
                        this.channels.set(ch.id, ch);
                    });
                }
            }
        }
    }

    private static saveChannels() {
        if (typeof window !== 'undefined') {
            const channels = Array.from(this.channels.values());
            localStorage.setItem('glide_channels', JSON.stringify(channels));
        }
    }

    /**
     * Close state channel and trigger settlement
     * Signs the final state
     */
    static async closeSession(
        walletClient: WalletClient,
        address: string,
        sessionId: string
    ): Promise<void> {
        this.loadChannels();
        const channel = this.channels.get(sessionId);
        if (!channel) return; // Idempotent

        const message = `Authorize Yellow Channel Closure:
        Channel ID: ${sessionId}
        Final State: Close`;

        await walletClient.signMessage({
            account: address as `0x${string}`,
            message,
        });

        channel.status = 'closed';
        this.saveChannels();
        // console.log('[Yellow] State channel closed & signed');
    }

    // Read-only methods don't need signing
    static async getChannelInfo(sessionId: string): Promise<StateChannel | null> {
        this.loadChannels();
        return this.channels.get(sessionId) || null;
    }

    static async getTransactionHistory(sessionId: string): Promise<YellowTransaction[]> {
        this.loadTransactions();
        return Array.from(this.transactions.values())
            .filter(tx => tx.channelId === sessionId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
}
