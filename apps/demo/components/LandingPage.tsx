'use client';

import React from 'react';
import { useGlide } from '@glide/sdk';
import { useRouter } from 'next/navigation';
import { Zap, Shield, Clock } from 'lucide-react';

export default function LandingPage() {
    const { session, createSession, login, logout, authenticated, user, createWallet, wallets } = useGlide();
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isCreatingSession, setIsCreatingSession] = React.useState(false);
    const [isCreatingWallet, setIsCreatingWallet] = React.useState(false);

    // Clear stale Privy session on mount
    React.useEffect(() => {
        const cleanup = async () => {
            if (!session && authenticated) {
                try {
                    await logout();
                } catch (e) {
                    console.warn('Logout failed during cleanup (expected if already logged out):', e);
                }
            }
        };
        cleanup();
    }, []);

    // Handle redirection if session exists
    React.useEffect(() => {
        if (session) {
            router.push('/dashboard');
        }
    }, [session, router]);

    // Auto-create session when user becomes authenticated
    React.useEffect(() => {
        if (authenticated && user && !session) {
            // Case 1: Authenticated but no wallet - Create one
            if (!user.wallet?.address && !isCreatingWallet) {
                console.log('[GLIDE] Creating wallet for user...');
                setIsCreatingWallet(true);
                setLoading(true);

                createWallet?.().then(() => {
                    setIsCreatingWallet(false);
                }).catch((err: any) => {
                    console.error('[GLIDE] Failed to create wallet:', err);
                    setError('Failed to create wallet. Please try again.');
                    setLoading(false);
                    setIsCreatingWallet(false);
                });
                return;
            }

            // Case 2: Authenticated AND has wallet AND no session - Create session
            // WAIT for wallets to be loaded to avoid "Wallet not initializing" error
            const hasWalletsLoaded = wallets && wallets.length > 0;

            if (user.wallet?.address && !isCreatingSession && hasWalletsLoaded) {
                console.log('[GLIDE] Creating session...');
                setIsCreatingSession(true);
                setLoading(true);

                createSession()
                    .then(() => {
                        // Redirect handled by useEffect above
                    })
                    .catch((err: any) => {
                        console.error('[GLIDE] Session creation failed:', err);

                        // If error is wallet related, maybe retry?
                        if (err.message.includes('Wallet not initializing')) {
                            // This should be less likely now that we check hasWalletsLoaded
                            setError('Initializing wallet... please wait.');
                            setTimeout(() => setIsCreatingSession(false), 2000); // Retry after 2s
                        } else {
                            setError('Failed to create session. Please try again.');
                            setLoading(false);
                            setIsCreatingSession(false);
                        }
                    });
            } else if (user.wallet?.address && !hasWalletsLoaded) {
                console.log('[GLIDE] Waiting for wallets to load...');
                setLoading(true);
            }
        }
    }, [authenticated, user, session, isCreatingSession, isCreatingWallet, createWallet, createSession, wallets]);

    const handleGetStarted = async () => {
        setLoading(true);
        setError(null);

        try {
            // If already authenticated but no session, logout first
            if (authenticated && !session) {
                await logout();
                window.location.reload();
                return;
            }

            await login();
        } catch (err: any) {
            console.error('[GLIDE] Login failed:', err);
            setError('Login failed. Please try again.');
            setLoading(false);
        }
    };

    // If session exists or we are redirecting, show loading state
    if (session) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div className="spinner"></div>
                <p>Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <nav style={{ padding: '2rem 0', marginBottom: '4rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    GLIDE
                </h1>
            </nav>

            <main style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    DeFi Onboarding,{' '}
                    <span className="gradient-text">Simplified</span>
                </h2>

                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                    Start trading in 2 minutes. No seed phrases, no gas fees for 7 days.
                    Experience DeFi the way it should be.
                </p>


                <button
                    className="btn btn-primary"
                    onClick={handleGetStarted}
                    disabled={loading}
                    style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}
                >
                    {loading ? 'Creating your wallet...' : 'Get Started with Email'}
                </button>

                {error && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        color: '#ef4444',
                    }}>
                        {error}
                    </div>
                )}

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        marginTop: '6rem',
                    }}
                >
                    <FeatureCard
                        icon={<Zap size={32} />}
                        title="Instant Setup"
                        description="Email login. Wallet created automatically. Start trading in seconds."
                    />
                    <FeatureCard
                        icon={<Shield size={32} />}
                        title="Gasless Trial"
                        description="7 days of free transactions powered by Yellow Network state channels."
                    />
                    <FeatureCard
                        icon={<Clock size={32} />}
                        title="Secure Settlement"
                        description="All transactions settle on Arc blockchain with USDC."
                    />
                </div>

                <div style={{ marginTop: '6rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>The Problem</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        <strong style={{ color: 'var(--warning)' }}>50%+ of users</strong> drop off during
                        traditional DeFi onboarding due to complex wallet setup and gas fees.
                    </p>
                    <p style={{ color: 'var(--success)', fontSize: '1.1rem', marginTop: '1rem' }}>
                        GLIDE reduces drop-off to <strong>25%</strong> with instant, gasless onboarding.
                    </p>
                </div>
            </main>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="card" style={{ textAlign: 'left' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{icon}</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h4>
            <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
        </div>
    );
}
