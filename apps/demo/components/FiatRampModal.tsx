'use client';

import { useState } from 'react';
import { X, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react';
import { useGlide } from '@glide/sdk';

export default function FiatRampModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [amount, setAmount] = useState('100');
    const [step, setStep] = useState(1); // 1: Input, 2: Processing, 3: Success
    const { session, setSession } = useGlide(); // Access setSession to update balance mock

    if (!isOpen) return null;

    const handleBuy = () => {
        setStep(2);

        // Simulate processing delay
        setTimeout(() => {
            setStep(3);

            // Mock update balance
            if (session) {
                // This is a hacky way to update session for demo purposes since SDK likely manages it via internal state
                // ideally SDK exposes a 'refreshBalance' or similar. 
                // For now, prompt user it's done. 
            }
        }, 2000);
    };

    const reset = () => {
        setStep(1);
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
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CreditCard size={20} color="var(--accent)" />
                            Buy USDC
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount (USD)</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
                                <span style={{ marginRight: '0.5rem', color: 'var(--text-primary)' }}>$</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', width: '100%', outline: 'none' }}
                                />
                                <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>USDC</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Payment Method</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--accent)', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)' }}>
                                <CreditCard size={24} color="white" />
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Visa •••• 4242</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No fees for first purchase</div>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleBuy}>
                            Buy Now
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            <ShieldCheck size={14} /> Encrypted & Secure
                        </div>
                    </>
                )}

                {step === 2 && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
                        <h3>Processing Payment...</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Confirming with bank provided...</p>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                        }}>
                            <ShieldCheck size={32} />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Purchase Successful!</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            {amount} USDC has been added to your settlement balance.
                        </p>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={reset}>
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
