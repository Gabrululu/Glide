'use client';

import { useGlide, ENSService } from '@glide/sdk';
import { useState } from 'react';
import { ArrowDownUp, Loader2, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

export default function SwapInterface() {
    const { sendTransaction, session, profile } = useGlide();
    const [fromAmount, setFromAmount] = useState('');
    const [fromToken, setFromToken] = useState('USDC');
    const [toToken, setToToken] = useState('ETH');
    const [loading, setLoading] = useState(false);
    const [lastTx, setLastTx] = useState<string | null>(null);
    // const [totalGasSaved, setTotalGasSaved] = useState(0); // Removed mock state
    // const [txCount, setTxCount] = useState(0); // Removed mock state

    const [error, setError] = useState<string | null>(null);

    const handleSwap = async () => {
        if (!fromAmount || parseFloat(fromAmount) <= 0) return;

        setLoading(true);
        setError(null);
        try {
            const tx = await sendTransaction({
                type: 'swap',
                amount: fromAmount,
                token: fromToken,
            });

            setLastTx(tx.id);
            // Stats updated automatically via useGlide -> ENSService
            setFromAmount('');

            setTimeout(() => setLastTx(null), 5000);
        } catch (err: any) {
            console.error('Swap failed:', err);
            setError(err.message || 'Swap failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const estimatedOutput = fromAmount ? (parseFloat(fromAmount) * 0.0003).toFixed(6) : '0.0';

    const txCount = profile?.stats?.totalSwaps || 0;
    const totalGasSaved = profile?.stats?.gasSaved || 0;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Swap Tokens</h3>
                    {session && (
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <TrendingUp size={16} style={{ color: 'var(--success)' }} />
                                <span>{txCount} swaps</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span style={{ color: 'var(--success)' }}>💰 ${totalGasSaved.toFixed(2)} saved</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border)' }}>
                                <ShieldCheck size={16} style={{ color: (profile?.trustScore || 50) > 80 ? 'var(--success)' : 'var(--warning)' }} />
                                <span style={{ color: (profile?.trustScore || 50) > 80 ? 'var(--success)' : 'var(--warning)' }}>
                                    {profile?.trustScore || 50}% Trust
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '0.5rem',
                                borderLeft: '1px solid var(--border)',
                                fontWeight: 'bold',
                                color: 'white'
                            }}>
                                <span>{ENSService.getTier(profile?.trustScore || 50)}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        From
                    </label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="number"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            placeholder="0.0"
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '2px solid rgba(99, 102, 241, 0.3)',
                                background: 'var(--bg-secondary)',
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                        />
                        <select
                            value={fromToken}
                            onChange={(e) => setFromToken(e.target.value)}
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                border: '2px solid rgba(99, 102, 241, 0.3)',
                                background: 'var(--bg-secondary)',
                                color: 'white',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                outline: 'none',
                            }}
                        >
                            <option>USDC</option>
                            <option>ETH</option>
                            <option>USDT</option>
                            <option>DAI</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
                    <div style={{
                        background: 'var(--bg-primary)',
                        borderRadius: '50%',
                        padding: '0.75rem',
                        border: '2px solid var(--accent)',
                    }}>
                        <ArrowDownUp size={24} style={{ color: 'var(--accent)' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        To (estimated)
                    </label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            value={estimatedOutput}
                            readOnly
                            placeholder="0.0"
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '2px solid rgba(255,255,255,0.1)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)',
                                fontSize: '1.5rem',
                                fontWeight: '600',
                            }}
                        />
                        <select
                            value={toToken}
                            onChange={(e) => setToToken(e.target.value)}
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                border: '2px solid rgba(255,255,255,0.1)',
                                background: 'var(--bg-secondary)',
                                color: 'white',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            <option>ETH</option>
                            <option>USDC</option>
                            <option>USDT</option>
                            <option>DAI</option>
                        </select>
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleSwap}
                    disabled={loading || !fromAmount || !session}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        padding: '1.25rem',
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        opacity: loading || !fromAmount || !session ? 0.5 : 1,
                        cursor: loading || !fromAmount || !session ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading && <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />}
                    {loading ? 'Swapping...' : '⚡ Swap (Gasless)'}
                </button>

                {error && (
                    <div
                        style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            fontSize: '0.9rem',
                            animation: 'slideIn 0.3s ease-out',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                {lastTx && (
                    <div
                        style={{
                            marginTop: '1.5rem',
                            padding: '1.25rem',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                            borderRadius: '12px',
                            border: '2px solid var(--success)',
                            animation: 'slideIn 0.3s ease-out',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                            <p style={{ color: 'var(--success)', fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                                Swap Successful!
                            </p>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                            TX: {lastTx.slice(0, 16)}...
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--success)' }}>✓ Instant execution</span>
                            <span style={{ color: 'var(--success)' }}>✓ Zero gas fees</span>
                            <span style={{ color: 'var(--success)' }}>✓ ~$0.50 saved</span>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                        💡 <strong>Powered by Yellow Network</strong> - All swaps during your trial are processed off-chain via state channels. Zero gas, instant execution.
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
