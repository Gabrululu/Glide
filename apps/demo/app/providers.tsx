'use client';

import { GlideProvider } from '@glide/sdk';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GlideProvider
            config={{
                privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
                trialDays: 7,
                trialAmount: '1000',
            }}
        >
            {children}
        </GlideProvider>
    );
}
