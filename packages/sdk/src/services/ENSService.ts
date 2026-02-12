import { type WalletClient, createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import type { ENSProfile } from '../types';

const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
});

/**
 * ENS integration service
 * Handles name resolution and text records for GLIDE users
 */

export class ENSService {
    // Mock ENS registry for demo
    private static profiles: Map<string, ENSProfile> = new Map();

    /**
     * Resolve ENS name to address
     */
    static async resolveName(name: string): Promise<string | null> {
        try {
            // Real resolution on Base Sepolia (Basenames)
            const address = await publicClient.getEnsAddress({
                name: name.endsWith('.base.eth') ? name : `${name}.base.eth`, // Default to .base.eth
            });
            return address;
        } catch (error) {
            console.error('ENS Resolution error:', error);
            return null;
        }
    }

    /**
     * Get user's Glide ENS name (e.g., user123.glide.eth)
     * Checks if user has already claimed a name
     */
    static async getGlideName(address: string): Promise<string> {
        try {
            // Real reverse resolution
            const name = await publicClient.getEnsName({
                address: address as `0x${string}`,
            });
            return name || `user-${address.slice(0, 6)}.base.eth`;
        } catch (error) {
            return `user-${address.slice(0, 6)}.base.eth`;
        }
    }

    /**
     * Set text record for user preferences
     * Requires User Signature
     */
    static async setTextRecord(
        walletClient: WalletClient,
        address: string,
        params: {
            name: string;
            key: string;
            value: string;
        }
    ): Promise<string> {
        // console.log('[ENS] Setting text record:', params);

        const message = `Authorize ENS Record Update:
        Name: ${params.name}
        Key: ${params.key}
        Value: ${params.value}
        Timestamp: ${Date.now()}`;

        // console.log('[ENS] Requesting signature for record update...');
        const signature = await walletClient.signMessage({
            account: address as `0x${string}`,
            message,
        });

        // console.log('[ENS] Setup confirmed with signature:', signature);

        // Update local mock state
        // In production: writeContract(ENSResolver, 'setText', ...)
        const existingProfile = this.profiles.get(address) || {
            name: params.name,
            address,
        };

        // Update specific field based on key
        if (params.key === 'avatar') existingProfile.avatar = params.value;
        if (params.key === 'description') existingProfile.description = params.value;
        if (params.key === 'com.twitter') existingProfile.twitter = params.value;
        if (params.key === 'name') existingProfile.name = params.value; // Special case for custom name

        this.profiles.set(address, existingProfile);

        if (typeof window !== 'undefined') {
            localStorage.setItem(`glide_ens_${address}`, JSON.stringify(existingProfile));
        }

        // Simulate transaction hash
        return `0x${Math.random().toString(16).substr(2, 64)}`;
    }

    /**
     * Get user profile from ENS
     */
    static async getProfile(address: string): Promise<ENSProfile> {
        // Try to load from localStorage first
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`glide_ens_${address}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.profiles.set(address, parsed);
                return parsed;
            }
        }

        const profile: ENSProfile = {
            name: await this.getGlideName(address),
            address,
            description: 'Just a chill GLIDE user exploring the ecosystem.',
            twitter: '@glide_user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${address.slice(0, 5)}`
        };

        this.profiles.set(address, profile);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`glide_ens_${address}`, JSON.stringify(profile));
        }
        return profile;
    }

    /**
     * Calculates a user's trust score based on their activity.
     * Logic:
     * - Base score: 50
     * - +2 points per swap (capped at 20)
     * - +10 points per $1 gas saved (high value proxy, capped at 30)
     * - Total score capped at 100
     */
    private static calculateTrustScore(stats: { totalSwaps: number; gasSaved: number }): number {
        const baseScore = 50;
        const activityScore = Math.min(stats.totalSwaps * 2, 20); // Max 20 points from swaps
        const valueScore = Math.min(stats.gasSaved * 10, 30); // Max 30 points from gas saved

        return Math.min(baseScore + activityScore + valueScore, 100);
    }

    /**
     * Update user stats (swaps, gas saved) & Recalculate Trust Score
     */
    static async updateStats(address: string, newStats: { swaps?: number; gas?: number }): Promise<ENSProfile> {
        const profile = await this.getProfile(address);

        if (!profile.stats) {
            profile.stats = { totalSwaps: 0, gasSaved: 0 };
        }

        if (newStats.swaps) profile.stats.totalSwaps += newStats.swaps;
        if (newStats.gas) profile.stats.gasSaved += newStats.gas;

        // Recalculate Trust Score
        profile.trustScore = this.calculateTrustScore(profile.stats);

        this.profiles.set(address, profile);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`glide_ens_${address}`, JSON.stringify(profile));
        }

        return profile;
    }

    /**
     * Get user tier based on trust score
     */
    static getTier(score: number): string {
        if (score >= 90) return '🐳 Whale';
        if (score >= 75) return '⚡ Pro';
        if (score >= 50) return '🛡️ Explorer';
        return '🥚 Novice';
    }

    /**
     * Get protocol reputation score
     * Stored in ENS text records
     */
    static async getProtocolReputation(protocolName: string): Promise<{
        score: number;
        totalUsers: number;
        conversionRate: number;
    }> {
        // Simulate reputation data lookup
        return {
            score: 4.5,
            totalUsers: Math.floor(Math.random() * 1000) + 500,
            conversionRate: 0.75,
        };
    }
}
