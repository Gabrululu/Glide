'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlide, AgentService, type UserProfile, type Strategy, type AgentAnalysis } from '@glide/sdk';
import { Brain, TrendingUp, Shield, Zap, ArrowLeft, Sparkles, Target, CheckCircle } from 'lucide-react';

export default function AgentPage() {
    const router = useRouter();
    const { session } = useGlide();
    const [analysis, setAnalysis] = useState<AgentAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionComplete, setExecutionComplete] = useState(false);

    // User profile (in production: would be saved/loaded from user preferences)
    const [userProfile, setUserProfile] = useState<UserProfile>({
        address: session?.walletAddress || '',
        riskTolerance: 'moderate',
        investmentAmount: '100',
        goal: 'balanced',
    });

    const handleStartAnalysis = async () => {
        setIsAnalyzing(true);
        setAnalysis(null);
        setSelectedStrategy(null);
        setExecutionComplete(false);

        try {
            const result = await AgentService.analyzeMarket(userProfile);
            setAnalysis(result);
            setSelectedStrategy(result.recommendedStrategy);
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleExecuteStrategy = async () => {
        if (!selectedStrategy || !session) return;

        setIsExecuting(true);

        try {
            await AgentService.executeStrategy(
                selectedStrategy,
                session.walletAddress,
                userProfile.investmentAmount
            );
            setExecutionComplete(true);
        } catch (error) {
            console.error('Execution failed:', error);
        } finally {
            setIsExecuting(false);
        }
    };

    if (!session) {
        router.push('/');
        return null;
    }

    return (
        <div className="container">
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2rem 0',
                marginBottom: '2rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => router.push('/dashboard')}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                        AI Agent
                    </h1>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                marginBottom: '2rem',
                textAlign: 'center',
                padding: '3rem 2rem',
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                    margin: '0 auto 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Brain size={40} color="white" />
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    Your Personal DeFi Agent
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Let the AI analyze Uniswap v4 pools and suggest the best yield strategy for your goals.
                    No complex terms, just simple choices.
                </p>

                {/* User Profile Configuration */}
                {!analysis && !isAnalyzing && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        maxWidth: '800px',
                        margin: '0 auto 2rem',
                        textAlign: 'left',
                    }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Investment Amount (USDC)
                            </label>
                            <input
                                type="number"
                                value={userProfile.investmentAmount}
                                onChange={(e) => setUserProfile({ ...userProfile, investmentAmount: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Risk Tolerance
                            </label>
                            <select
                                value={userProfile.riskTolerance}
                                onChange={(e) => setUserProfile({ ...userProfile, riskTolerance: e.target.value as any })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                }}
                            >
                                <option value="conservative">Conservative</option>
                                <option value="moderate">Moderate</option>
                                <option value="aggressive">Aggressive</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Goal
                            </label>
                            <select
                                value={userProfile.goal}
                                onChange={(e) => setUserProfile({ ...userProfile, goal: e.target.value as any })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                }}
                            >
                                <option value="passive_income">Passive Income</option>
                                <option value="balanced">Balanced</option>
                                <option value="growth">Growth</option>
                            </select>
                        </div>
                    </div>
                )}

                {!analysis && !isAnalyzing && (
                    <button
                        className="btn btn-primary"
                        onClick={handleStartAnalysis}
                        style={{ fontSize: '1.125rem', padding: '1rem 3rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Sparkles size={20} />
                        Start Analysis
                    </button>
                )}
            </div>

            {/* Analyzing State */}
            {isAnalyzing && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
                    <h3>Agent is analyzing the market...</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Scanning Uniswap v4 pools, calculating yields, and evaluating risks
                    </p>
                </div>
            )}

            {/* Analysis Results */}
            {analysis && !executionComplete && (
                <>
                    {/* Market Overview */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem',
                    }}>
                        <div className="card">
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Pools Analyzed
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                {analysis.marketConditions.totalPools}
                            </div>
                        </div>
                        <div className="card">
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Average APY
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                                {analysis.marketConditions.avgAPY}
                            </div>
                        </div>
                        <div className="card">
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Best APY Found
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                                {analysis.marketConditions.bestAPY}
                            </div>
                        </div>
                    </div>

                    {/* Strategy Cards */}
                    <h3 style={{ marginBottom: '1rem' }}>Recommended Strategies</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem',
                    }}>
                        {analysis.strategies.map((strategy) => (
                            <StrategyCard
                                key={strategy.id}
                                strategy={strategy}
                                isSelected={selectedStrategy?.id === strategy.id}
                                isRecommended={analysis.recommendedStrategy?.id === strategy.id}
                                onSelect={() => setSelectedStrategy(strategy)}
                            />
                        ))}
                    </div>

                    {/* Execute Button */}
                    {selectedStrategy && (
                        <div className="card" style={{ textAlign: 'center', background: 'var(--bg-secondary)' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Ready to Deploy</h4>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                You're about to invest <strong>${userProfile.investmentAmount} USDC</strong> in <strong>{selectedStrategy.name}</strong>
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={handleExecuteStrategy}
                                disabled={isExecuting}
                                style={{ fontSize: '1.125rem', padding: '1rem 3rem' }}
                            >
                                {isExecuting ? 'Executing...' : 'Deploy Strategy'}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Execution Complete */}
            {executionComplete && selectedStrategy && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--success)',
                        margin: '0 auto 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <CheckCircle size={40} color="white" />
                    </div>
                    <h2 style={{ marginBottom: '1rem' }}>Strategy Deployed!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                        Your funds are now earning <strong>{selectedStrategy.recommendedPool.apy} APY</strong> in the <strong>{selectedStrategy.name}</strong> pool.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => router.push('/dashboard')}
                        >
                            View Dashboard
                        </button>
                        <button
                            className="btn"
                            onClick={() => {
                                setAnalysis(null);
                                setExecutionComplete(false);
                            }}
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                            Analyze Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function StrategyCard({
    strategy,
    isSelected,
    isRecommended,
    onSelect,
}: {
    strategy: Strategy;
    isSelected: boolean;
    isRecommended: boolean;
    onSelect: () => void;
}) {
    const riskColors = {
        low: 'var(--success)',
        medium: 'var(--warning)',
        high: 'var(--error)',
    };

    const riskIcons = {
        low: <Shield size={20} />,
        medium: <Target size={20} />,
        high: <Zap size={20} />,
    };

    return (
        <div
            className="card"
            onClick={onSelect}
            style={{
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                background: isSelected ? 'rgba(59, 130, 246, 0.1)' : undefined,
                position: 'relative',
            }}
        >
            {isRecommended && (
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                }}>
                    RECOMMENDED
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ color: riskColors[strategy.riskLevel] }}>
                    {riskIcons[strategy.riskLevel]}
                </div>
                <h4 style={{ margin: 0 }}>{strategy.name}</h4>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {strategy.description}
            </p>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pool</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                        {strategy.recommendedPool.token0}/{strategy.recommendedPool.token1}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>APY</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--success)' }}>
                        {strategy.recommendedPool.apy}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Expected Return</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                        {strategy.expectedReturn}
                    </span>
                </div>
            </div>

            <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Why this strategy?
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {strategy.reasoning.map((reason, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem' }}>{reason}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
