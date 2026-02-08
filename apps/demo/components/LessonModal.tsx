'use client';

import { X, BookOpen, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LessonModal({
    isOpen,
    onClose,
    title,
    content
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setProgress(0);
            const timer = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 100));
            }, 300);
            return () => clearInterval(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '500px', maxWidth: '90vw', background: '#1a1a2e', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                    <X size={20} />
                </button>

                <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <BookOpen size={20} color="var(--accent)" />
                        <span style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 'bold' }}>DeFi Academy</span>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h2>
                </div>

                <div style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
                    {content}
                    <br /><br />
                    <p>
                        In decentralized finance, you replace the middleman (bank) with smart contracts code that runs on the blockchain.
                        This automated system ensures transparency and efficiency.
                    </p>
                    <br />
                    <h3>Key Takeaways:</h3>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>You are your own bank.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Transactions are immutable and transparent.</li>
                        <li>Risks include smart contract bugs and market volatility.</li>
                    </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        <span>Lesson Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--success)', transition: 'width 0.3s ease' }}></div>
                    </div>
                </div>

                {progress === 100 && (
                    <button
                        className="btn btn-primary"
                        onClick={onClose}
                        style={{ marginTop: '1.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <CheckCircle size={18} /> Complete Lesson
                    </button>
                )}
            </div>
        </div>
    );
}
