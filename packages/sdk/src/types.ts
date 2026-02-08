export interface GlideConfig {
    privyAppId: string;
    yellowApiKey: string;
    trialDays?: number;
    trialAmount?: string; // in USDC
    arcRpcUrl?: string;
    enableENS?: boolean;
}

export interface GlideSession {
    userId: string;
    walletAddress: string;
    sessionId: string;
    trialStartDate: Date;
    trialEndDate: Date;
    isActive: boolean;
    balance: string;
    gasSaved: string;
}

export interface GlideTransaction {
    id: string;
    type: 'swap' | 'transfer' | 'stake';
    amount: string;
    token: string;
    timestamp: Date;
    status: 'pending' | 'completed' | 'failed';
    gasless: boolean;
}

export interface YellowSessionConfig {
    sessionId: string;
    duration: number; // in days
    allowance: string; // max spending in USDC
}

export interface ENSProfile {
    name: string;
    address: string;
    avatar?: string;
    description?: string;
    twitter?: string;
    stats?: {
        totalSwaps: number;
        gasSaved: number;
    };
    trustScore?: number;
}
