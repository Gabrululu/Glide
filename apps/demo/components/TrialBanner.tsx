'use client';

import { useGlide } from '@glide/sdk';
import { useEffect, useState } from 'react';
import { Clock, Zap } from 'lucide-react';

export default function TrialBanner() {
    const { session, getRemainingDays } = useGlide();
    const [remainingDays, setRemainingDays] = useState(0);

    useEffect(() => {
        if (session) {
            setRemainingDays(getRemainingDays());
            const interval = setInterval(() => {
                setRemainingDays(getRemainingDays());
            }, 60000); // Update every minute
            return () => clearInterval(interval);
        }
    }, [session, getRemainingDays]);

    if (!session) return null;

    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Zap size={32} />
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Gasless Trial Active</h3>
                    <p style={{ opacity: 0.9 }}>All transactions are free during your trial period</p>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Clock size={20} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{remainingDays}</span>
                </div>
                <p style={{ opacity: 0.9 }}>days remaining</p>
            </div>
        </div>
    );
}
