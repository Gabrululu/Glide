'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import type { GlideConfig, GlideSession } from './types';

interface GlideContextValue {
    config: GlideConfig;
    session: GlideSession | null;
    setSession: (session: GlideSession | null) => void;
    onLoginComplete: (() => void) | null;
    setOnLoginComplete: (callback: (() => void) | null) => void;
}

const GlideContext = createContext<GlideContextValue | undefined>(undefined);

export const useGlideContext = () => {
    const context = useContext(GlideContext);
    if (!context) {
        throw new Error('useGlideContext must be used within GlideProvider');
    }
    return context;
};

interface GlideProviderProps {
    config: GlideConfig;
    children: React.ReactNode;
}

export function GlideProvider({
    children,
    config,
}: {
    children: React.ReactNode;
    config: GlideConfig;
}) {
    const [session, setSession] = useState<GlideSession | null>(null);
    const [onLoginComplete, setOnLoginComplete] = useState<(() => void) | null>(null);

    // Load session from localStorage on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('glide_session');
        if (savedSession) {
            try {
                const parsed = JSON.parse(savedSession);
                // Convert date strings back to Date objects
                parsed.trialStartDate = new Date(parsed.trialStartDate);
                parsed.trialEndDate = new Date(parsed.trialEndDate);
                setSession(parsed);
            } catch (error) {
                console.error('Failed to load session:', error);
            }
        }
    }, []);

    // Save session to localStorage when it changes
    useEffect(() => {
        if (session) {
            localStorage.setItem('glide_session', JSON.stringify(session));
        } else {
            localStorage.removeItem('glide_session');
        }
    }, [session]);

    return (
        <PrivyProvider
            appId={config.privyAppId}
            config={{
                appearance: {
                    theme: 'dark',
                    accentColor: '#6366f1',
                },
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets',
                    },
                    solana: {
                        createOnLogin: 'users-without-wallets',
                    },
                },
            }}
        >
            <GlideContext.Provider value={{ config, session, setSession, onLoginComplete, setOnLoginComplete }}>
                {children}
            </GlideContext.Provider>
        </PrivyProvider>
    );
}
