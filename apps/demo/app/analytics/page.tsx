'use client';

import { useGlide } from '@glide/sdk';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, TrendingUp, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
    const { session, authenticated, ready } = useGlide();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    // Wait for Privy to be ready
    if (!ready) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!session && !authenticated) {
        router.push('/');
        return null;
    }

    return (
        <div className="container">
            <nav style={{ padding: '2rem 0', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => router.back()}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Protocol Analytics</h1>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard
                    title="Total Users"
                    value="12,453"
                    change="+12%"
                    icon={<Users size={24} />}
                    color="#6366f1"
                />
                <StatCard
                    title="Total Volume"
                    value="$4.2M"
                    change="+8.5%"
                    icon={<Activity size={24} />}
                    color="#10b981"
                />
                <StatCard
                    title="Gas Saved"
                    value="$156k"
                    change="+24%"
                    icon={<TrendingUp size={24} />}
                    color="#f59e0b"
                />
                <StatCard
                    title="Conversion Rate"
                    value="75.8%"
                    change="+50%"
                    subtitle="vs 25% industry avg"
                    icon={<BarChart3 size={24} />}
                    color="#ec4899"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Chart Section */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3>User Growth (Last 7 Days)</h3>
                        <select style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>

                    {/* CSS Bar Chart */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '300px', gap: '1rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <Bar height="40%" label="Mon" />
                        <Bar height="55%" label="Tue" />
                        <Bar height="45%" label="Wed" />
                        <Bar height="70%" label="Thu" />
                        <Bar height="85%" label="Fri" />
                        <Bar height="60%" label="Sat" />
                        <Bar height="90%" label="Sun" active />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Live Interactions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <ActivityItem action="User Login (Email)" time="2s ago" />
                        <ActivityItem action="Swap 100 USDC -> ETH" time="5s ago" value="$100" />
                        <ActivityItem action="New Wallet Created" time="12s ago" />
                        <ActivityItem action="Session Settled" time="45s ago" value="$420" />
                        <ActivityItem action="Fiat On-Ramp" time="1m ago" value="$500" />
                        <ActivityItem action="ENS Profile Updated" time="2m ago" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, subtitle, icon, color }: any) {
    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ background: `${color}20`, padding: '0.75rem', borderRadius: '12px', color: color }}>
                    {icon}
                </div>
                <span style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 'bold' }}>{change}</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{title}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{value}</div>
            {subtitle && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{subtitle}</div>}
        </div>
    );
}

function Bar({ height, label, active }: any) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{
                width: '100%',
                height: height,
                background: active ? 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.1)',
                borderRadius: '8px 8px 0 0',
                transition: 'height 1s ease'
            }} />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
        </div>
    );
}

function ActivityItem({ action, time, value }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
                <div style={{ fontSize: '0.9rem' }}>{action}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{time}</div>
            </div>
            {value && <div style={{ fontWeight: 'bold', color: 'var(--success)' }}>{value}</div>}
        </div>
    );
}
