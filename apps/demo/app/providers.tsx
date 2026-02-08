'use client';

import { GlideProvider } from '@glide/sdk';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GlideProvider
            config={{
                privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
                chainId: 84532, // Base Sepolia
                yellowNetworkId: 'testnet',
            }}
        >
            {children}
        </GlideProvider>
    );
}
