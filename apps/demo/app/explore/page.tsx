'use client';

import { useGlide } from '@glide/sdk';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, TrendingUp, Shield, Coins, ArrowRight, Wallet, Award } from 'lucide-react';
import { useState } from 'react';
import InvestModal from '@/components/InvestModal';
import LessonModal from '@/components/LessonModal';
import Confetti from '@/components/Confetti';

export default function ExplorePage() {
    const { session, authenticated, ready } = useGlide();
    const router = useRouter();
    const [selectedYield, setSelectedYield] = useState<any>(null);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [filter, setFilter] = useState<'all' | 'stable' | 'balanced' | 'high'>('all');
    const [showConfetti, setShowConfetti] = useState(false);

    // Wait for Privy to be ready
    if (!ready) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!session && !authenticated) {
        router.push('/');
        return null;
    }

    const handlePathSelect = (type: 'stable' | 'balanced' | 'high') => {
        setFilter(type);
        document.getElementById('yields')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="container">
            {/* Modals */}
            <InvestModal
                isOpen={!!selectedYield}
                onClose={() => setSelectedYield(null)}
                asset={selectedYield?.asset || ''}
                protocol={selectedYield?.protocol || ''}
                apy={selectedYield?.apy || ''}
            />

            <LessonModal
                isOpen={!!selectedLesson}
                onClose={() => setSelectedLesson(null)}
                title={selectedLesson?.title || ''}
                content={selectedLesson?.content || ''}
            />

            <nav style={{ padding: '2rem 0', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => router.back()}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Explore DeFi</h1>
            </nav>

            {/* Hero Section */}
            <div className="card" style={{
                marginBottom: '3rem',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '3rem'
            }}>
                <div style={{ maxWidth: '600px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                        Make your money <span className="gradient-text">work for you</span>
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                        DeFi (Decentralized Finance) lets you earn interest, trade assets, and borrow money without a bank.
                        You stay in control of your funds at all times.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => document.getElementById('yields')?.scrollIntoView({ behavior: 'smooth' })}>
                            Start Earning
                        </button>
                        <button className="btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' })}>
                            Learn Basics
                        </button>
                    </div>
                </div>
                <div style={{ fontSize: '8rem', opacity: 0.2 }}>
                    🏦
                </div>
            </div>

            {/* Guided Paths */}
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="var(--accent)" />
                Choose Your Path
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                <PathCard
                    title="Stable & Safe"
                    description="Earn steady interest on US Dollar stablecoins. Low risk, better than a bank."
                    apy="5-8%"
                    risk="Low"
                    icon={<Shield size={32} />}
                    color="#10b981"
                    onClick={() => handlePathSelect('stable')}
                    active={filter === 'stable'}
                />
                <PathCard
                    title="Balanced Growth"
                    description="A mix of established assets like ETH and BTC along with stablecoins."
                    apy="8-15%"
                    risk="Medium"
                    icon={<Wallet size={32} />}
                    color="#6366f1"
                    onClick={() => handlePathSelect('balanced')}
                    active={filter === 'balanced'}
                />
                <PathCard
                    title="High Yield"
                    description="Provide liquidity to newer pools. Higher reward potential but more volatility."
                    apy="15-50%+"
                    risk="High"
                    icon={<Coins size={32} />}
                    color="#f59e0b"
                    onClick={() => handlePathSelect('high')}
                    active={filter === 'high'}
                />
            </div>

            {/* Yield Opportunities */}
            <div id="yields" style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <Coins size={20} color="var(--accent)" />
                        Top Opportunities (Simulated)
                    </h3>
                    {filter !== 'all' && (
                        <button
                            onClick={() => setFilter('all')}
                            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Clear Filter ✕
                        </button>
                    )}
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {(filter === 'all' || filter === 'stable') && (
                        <YieldRow
                            asset="USDC"
                            protocol="Aave"
                            apy="5.2%"
                            tvl="$12.4B"
                            type="Lending"
                            onInvest={() => setSelectedYield({ asset: 'USDC', protocol: 'Aave', apy: '5.2%' })}
                        />
                    )}

                    {(filter === 'all' || filter === 'balanced') && (
                        <YieldRow
                            asset="ETH"
                            protocol="Lido"
                            apy="3.8%"
                            tvl="$24.1B"
                            type="Staking"
                            onInvest={() => setSelectedYield({ asset: 'ETH', protocol: 'Lido', apy: '3.8%' })}
                        />
                    )}

                    {(filter === 'all' || filter === 'high') && (
                        <YieldRow
                            asset="USDC-ETH"
                            protocol="Uniswap"
                            apy="12.4%"
                            tvl="$450M"
                            type="Liquidity Pool"
                            onInvest={() => setSelectedYield({ asset: 'USDC-ETH', protocol: 'Uniswap', apy: '12.4%' })}
                        />
                    )}

                    {(filter === 'all' || filter === 'balanced') && (
                        <YieldRow
                            asset="GLIDE"
                            protocol="Governance"
                            apy="8.5%"
                            tvl="$2.1M"
                            type="Staking"
                            onInvest={() => setSelectedYield({ asset: 'GLIDE', protocol: 'Glide Gov', apy: '8.5%' })}
                        />
                    )}
                </div>
            </div>

            {/* Educational Section */}
            <div id="learn">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={20} color="var(--accent)" />
                    DeFi Academy
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <EduCard
                        title="What is Yield?"
                        content="Yield is the interest you earn on your crypto. It comes from users paying to borrow assets or swap tokens. Think of it as the 'rent' your money earns."
                        readTime="2 min"
                        onLearn={() => setSelectedLesson({ title: 'What is Yield?', content: "Yield is the interest you earn on your crypto assets. It primarily comes from two sources: Lending (users paying interest to borrow assets) and Trading Fees (users paying a small percentage to swap tokens). Unlike traditional banking where you might earn 0.1%, DeFi yields are often higher due to efficiency and demand." })}
                    />
                    <EduCard
                        title="Staking vs Lending"
                        content="Staking secures the network (like a validator), while lending lets others borrow your assets for a fee."
                        readTime="3 min"
                        onLearn={() => setSelectedLesson({ title: 'Staking vs Lending', content: "Staking supports the security of a Proof-of-Stake blockchain (like Ethereum). You lock your ETH to help validate transactions. Lending, on the other hand, involves depositing assets into a pool for others to borrow against collateral. Both earn yield, but the mechanisms and risks differ." })}
                    />
                    <EduCard
                        title="What are Stablecoins?"
                        content="Tokens pegged to a real-world asset like the US Dollar (e.g., USDC), keeping their value stable."
                        readTime="2 min"
                        onLearn={() => setSelectedLesson({ title: 'What are Stablecoins?', content: "Stablecoins are cryptocurrencies designed to minimize volatility by pegging their value to a currency like the US Dollar (USDC, USDT). They allow you to stay in the crypto ecosystem without exposure to the wild price swings of assets like Bitcoin or Ethereum." })}
                    />
                    <EduCard
                        title="Risks of DeFi"
                        content="Smart contract bugs or market volatility. Always diversify and start with small amounts."
                        readTime="4 min"
                        onLearn={() => setSelectedLesson({ title: 'Risks of DeFi', content: "Smart Contract Risk: Code bugs can be exploited. Impermanent Loss: Providing liquidity can lead to losses compared to holding. Market Volatility: Asset prices can change rapidly. Always do your own research (DYOR) and never invest more than you can afford to lose." })}
                    />
                </div>
            </div>
        </div>
    );
}

function PathCard({ title, description, apy, risk, icon, color, onClick, active }: any) {
    return (
        <div
            className="card"
            style={{
                transition: 'all 0.2s',
                cursor: 'pointer',
                border: active ? `2px solid ${color}` : '1px solid rgba(255,255,255,0.05)',
                transform: active ? 'scale(1.02)' : 'none',
                background: active ? `${color}10` : 'var(--bg-card)'
            }}
            onClick={onClick}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ background: `${color}20`, padding: '1rem', borderRadius: '12px', color: color }}>
                    {icon}
                </div>
                <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    background: risk === 'Low' ? 'rgba(16, 185, 129, 0.2)' : risk === 'Medium' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: risk === 'Low' ? '#10b981' : risk === 'Medium' ? '#6366f1' : '#f59e0b',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                }}>
                    {risk} Risk
                </div>
            </div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h4>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '3rem' }}>{description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Est. APY</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)' }}>{apy}</div>
                </div>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
                    <ArrowRight size={16} />
                </div>
            </div>
        </div>
    );
}

function YieldRow({ asset, protocol, apy, tvl, type, onInvest }: any) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 0.5fr',
            alignItems: 'center',
            background: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold' }}>
                <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontSize: '0.75rem' }}>
                    {asset.charAt(0)}
                </div>
                {asset}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>{protocol}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{type}</div>
            <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>{apy}</div>
            <div style={{ color: 'var(--text-secondary)' }}>{tvl}</div>
            <button
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                onClick={onInvest}
            >
                Invest
            </button>
        </div>
    );
}

function EduCard({ title, content, readTime, onLearn }: any) {
    return (
        <div
            className="card"
            style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
            onClick={onLearn}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Award size={24} color="var(--accent)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{readTime} read</span>
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{content}</p>
        </div>
    );
}
