'use client';

import { useEffect, useState } from 'react';

import { useGlide, ENSService, YellowService, GlideTransaction } from '@glide/sdk';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, TrendingUp, Clock, Zap, ExternalLink, User, CheckCircle, Smartphone } from 'lucide-react';
import TrialBanner from '@/components/TrialBanner';
import SwapInterface from '@/components/SwapInterface';

import FiatRampModal from '@/components/FiatRampModal';

export default function Dashboard() {
    const { session, logout, getRemainingDays, updateENSProfile } = useGlide();
    const router = useRouter();
    const [ensName, setEnsName] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<GlideTransaction[]>([]);
    const [isRampOpen, setIsRampOpen] = useState(false);

    useEffect(() => {
        if (!session) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            // Fetch ENS Name
            const name = await ENSService.getGlideName(session.walletAddress);
            setEnsName(name);

            // Fetch Recent Transactions (Yellow)
            // Fetch Recent Transactions (Yellow)
            const txs = await YellowService.getTransactionHistory(session.sessionId);
            // Map Yellow txs to Glide txs for display
            const glideTxs: GlideTransaction[] = txs.map(tx => ({
                id: tx.id,
                type: tx.type as any,
                amount: tx.amount,
                token: tx.token,
                timestamp: tx.timestamp,
                status: 'completed',
                gasless: true
            }));
            setTransactions(glideTxs);
        };

        fetchData();
    }, [session, router]);

    if (!session) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const remainingDays = getRemainingDays();
    const progressPercent = ((7 - remainingDays) / 7) * 100;

    return (
        <div className="container">
            <FiatRampModal isOpen={isRampOpen} onClose={() => setIsRampOpen(false)} />

            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '2rem',
            }}>
                <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                    GLIDE
                </h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

                    <button
                        onClick={() => router.push('/analytics')}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Analytics
                    </button>

                    <button
                        onClick={() => router.push('/explore')}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Explore
                    </button>

                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }}></div>

                    <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Connected as</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {ensName || `${session.walletAddress.slice(0, 6)}...`}
                            <span style={{
                                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px'
                            }}>ENS</span>
                        </div>
                    </div>
                    <button
                        className="btn"
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <TrialBanner />

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem',
            }}>
                <StatCard
                    icon={<Wallet size={24} />}
                    label="Trial Balance"
                    value={`${session.balance} USDC`}
                    subtitle="Available for trading"
                    color="var(--accent)"
                    trend="+100%"
                    action={
                        <button
                            onClick={() => setIsRampOpen(true)}
                            style={{
                                marginTop: '0.5rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '4px',
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            + Add Funds
                        </button>
                    }
                />
                <StatCard
                    icon={<TrendingUp size={24} />}
                    label="Gas Saved"
                    value={`$${session.gasSaved}`}
                    subtitle="vs traditional DeFi"
                    color="var(--success)"
                    trend={`${Math.round(parseFloat(session.gasSaved) * 2)} txs`}
                />
                <StatCard
                    icon={<Zap size={24} />}
                    label="Trial Progress"
                    value={`${Math.round(progressPercent)}%`}
                    subtitle={`${remainingDays} days remaining`}
                    color="var(--warning)"
                    progress={progressPercent}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Swap Interface */}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Instant Swap</h3>
                    <SwapInterface />
                </div>

                {/* Network Status & Profile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Performance Card */}
                    <div className="card">
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={18} />
                            Network Performance
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Latency</span>
                                <span style={{ color: 'var(--success)' }}>~15ms</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Throughput</span>
                                <span style={{ color: 'var(--text-secondary)' }}>10k+ TPS</span>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Gas Cost</span>
                                <span style={{ color: 'var(--success)' }}>$0.00</span>
                            </div>
                        </div>
                    </div>

                    {/* ENS Profile Card */}
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' }}>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={18} />
                            Your Identity
                        </h4>
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                                margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', fontWeight: 'bold'
                            }}>
                                {ensName ? ensName[0].toUpperCase() : 'U'}
                            </div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                {ensName || 'Loading...'}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Verified by ENS
                            </div>
                            <button
                                className="btn"
                                style={{
                                    marginTop: '1rem', width: '100%', fontSize: '0.875rem',
                                    background: 'rgba(255,255,255,0.1)'
                                }}
                                onClick={() => router.push('/profile')}
                            >
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginTop: '3rem',
            }}>
                <InfoCard
                    title="How It Works"
                    icon={<Clock size={20} />}
                    items={[
                        'All transactions are processed off-chain via Yellow Network',
                        'You pay zero gas fees for 7 days',
                        'Final balance settles on Arc blockchain',
                        'Continue using GLIDE or withdraw anytime',
                    ]}
                />
                <InfoCard
                    title="Powered By"
                    icon={<Zap size={20} />}
                    items={[
                        '⚡ Yellow Network - State channels for gasless txs',
                        '🔷 Arc - USDC settlement layer',
                        '🔐 Privy - Embedded wallet (no seed phrases)',
                        '🌐 ENS - Decentralized identity',
                    ]}
                />
            </div>

            {/* Session Info */}
            <div className="card" style={{ marginTop: '2rem', background: 'var(--bg-secondary)' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ExternalLink size={18} />
                    Session Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Session ID</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{session.sessionId.slice(0, 24)}...</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Started</div>
                        <div>{session.trialStartDate.toLocaleDateString()}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Expires</div>
                        <div>{session.trialEndDate.toLocaleDateString()}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Status</div>
                        <div style={{ color: 'var(--success)' }}>✓ Active</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    subtitle,
    color,
    trend,
    progress,
    action
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtitle: string;
    color: string;
    trend?: string;
    progress?: number;
    action?: React.ReactNode;
}) {
    return (
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ color, background: `${color}20`, padding: '0.75rem', borderRadius: '12px' }}>
                    {icon}
                </div>
                {trend && !action && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '600' }}>
                        {trend}
                    </div>
                )}
                {action}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {label}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {subtitle}
            </div>
            {progress !== undefined && (
                <div style={{ marginTop: '1rem', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
                        transition: 'width 0.3s ease',
                    }} />
                </div>
            )}
        </div>
    );
}

function InfoCard({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
    return (
        <div className="card">
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {icon}
                {title}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map((item, i) => (
                    <li key={i} style={{
                        padding: '0.75rem 0',
                        borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        lineHeight: '1.6',
                    }}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
