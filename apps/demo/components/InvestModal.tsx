'use client';

import { useState } from 'react';
import { X, Coins, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

export default function InvestModal({
    isOpen,
    onClose,
    asset,
    protocol,
    apy,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    asset: string;
    protocol: string;
    apy: string;
    onSuccess?: () => void;
}): JSX.Element | null {
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState(1); // 1: Input, 2: Signed, 3: Success

    if (!isOpen) return null;

    const handleInvest = () => {
        setStep(2);
        // Simulate network request
        setTimeout(() => {
            setStep(3);
            if (onSuccess) onSuccess();
        }, 2000);
    };

    const reset = () => {
        setStep(1);
        setAmount('');
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '400px', background: '#1a1a2e', position: 'relative', overflow: 'hidden' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                    <X size={20} />
                </button>

                {step === 1 && (
                    <>
                        <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Invest in {protocol}
                        </h3>
                        <div style={{ fontSize: '0.875rem', color: 'var(--success)', marginBottom: '1.5rem', display: 'inline-block', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                            🔥 Earn {apy} APY
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount to Invest</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', width: '100%', outline: 'none' }}
                                />
                                <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{asset}</span>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                Available: 1000.00 {asset} (Trial)
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Protocol</span>
                                <span>{protocol}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Est. Monthly Earnings</span>
                                <span style={{ color: 'var(--success)' }}>
                                    {amount ? `~$${(parseFloat(amount) * (parseFloat(apy) / 100) / 12).toFixed(2)}` : '$0.00'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Gas Fee (Yellow)</span>
                                <span style={{ color: 'var(--success)' }}>$0.00</span>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            onClick={handleInvest}
                            disabled={!amount || parseFloat(amount) <= 0}
                        >
                            Confirm Deposit <ArrowRight size={18} />
                        </button>
                    </>
                )}

                {step === 2 && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
                        <h3>Sign to Deposit</h3>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '200px', margin: '0 auto' }}>
                            Please sign the transaction in your embedded wallet...
                        </p>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                        }}>
                            <CheckCircle size={32} />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Deposit Successful!</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            You have successfully deposited <strong>{amount} {asset}</strong> into {protocol}.
                        </p>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
                            <ShieldCheck size={24} color="#6366f1" />
                            <div style={{ fontSize: '0.875rem' }}>
                                <div style={{ fontWeight: 'bold' }}>Yield is accumulating</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Check back daily to see your earnings grow.</div>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={reset}>
                            Back to Explore
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
