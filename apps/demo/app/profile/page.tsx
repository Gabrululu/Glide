'use client';

import { useGlide, ENSService } from '@glide/sdk';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Twitter, FileText, Camera, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
    const { session, authenticated, ready, updateENSProfile, user } = useGlide();
    const router = useRouter();

    const [profile, setProfile] = useState<any>({
        name: '',
        description: '',
        twitter: '',
        avatar: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initial Load
    useEffect(() => {
        if (!ready) return;
        if (!session && !authenticated) {
            router.push('/');
            return;
        }

        const loadProfile = async () => {
            if (session?.walletAddress) {
                try {
                    const p = await ENSService.getProfile(session.walletAddress);
                    setProfile(p);
                } catch (e) {
                    console.error('Failed to load profile', e);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadProfile();
    }, [session, authenticated, ready, router]);

    const handleSave = async (key: string, value: string) => {
        setIsSaving(true);
        setMessage(null);
        try {
            await updateENSProfile(key, value);

            // Should properly refresh profile here, but for now we update local state
            // profile state is already updated via input onChange, but we want to sync with "server"
            // The ENSService mock updates its internal map, so next fetch is good.

            setMessage({ type: 'success', text: `Saved ${key} successfully!` });

            // Clear success message after 3s
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            console.error('Save failed:', error);
            if (error.message?.includes('User rejected')) {
                setMessage({ type: 'error', text: 'You cancelled the signature request.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (!ready || isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Loader2 className="spinner" /> Loading Profile...
        </div>;
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
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your Identity</h1>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Left Column: Avatar & Preview */}
                <div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1.5rem',
                            background: 'var(--bg-secondary)', border: '4px solid var(--accent)',
                            backgroundImage: `url(${profile.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold',
                            position: 'relative'
                        }}>
                            {!profile.avatar && profile.name?.charAt(0).toUpperCase()}
                            <button style={{
                                position: 'absolute', bottom: '0', right: '0',
                                background: 'var(--accent)', border: 'none', borderRadius: '50%',
                                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'white'
                            }}>
                                <Camera size={16} />
                            </button>
                        </div>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{profile.name}</h2>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            {session?.walletAddress.slice(0, 6)}...{session?.walletAddress.slice(-4)}
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', textAlign: 'left' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bio</div>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{profile.description || 'No bio set yet.'}</p>

                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Twitter:</span>
                                    <span style={{ color: '#1dA1F2' }}>{profile.twitter || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Edit Profile
                        {isSaving && <Loader2 className="spinner" size={20} />}
                    </h3>

                    {message && (
                        <div style={{
                            padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem',
                            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                            color: message.type === 'success' ? '#10b981' : '#ef4444',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>ENS Name</label>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                    <div style={{ paddingLeft: '0.75rem', color: 'var(--text-secondary)' }}>
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={profile.name.replace('.glide.eth', '')}
                                        onChange={(e) => {
                                            // sanitize input: only alphanumeric and hyphens
                                            const val = e.target.value.replace(/[^a-zA-Z0-9-]/g, '');
                                            setProfile({ ...profile, name: `${val}.glide.eth` });
                                        }}
                                        placeholder="your-name"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'white',
                                            padding: '0.75rem 0.5rem',
                                            width: '100%',
                                            outline: 'none',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                    <div style={{ paddingRight: '0.75rem', color: 'var(--text-secondary)', userSelect: 'none', fontWeight: '500' }}>
                                        .glide.eth
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSave('name', profile.name)}
                                    className="btn"
                                    style={{ height: 'fit-content', padding: '0.75rem', background: 'var(--accent)', color: 'white' }}
                                    title="Save Name"
                                >
                                    <Save size={18} />
                                </button>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                Set your custom decentralized username (e.g. pepe.glide.eth)
                            </div>
                        </div>

                        <FormGroup
                            label="Bio / Description"
                            value={profile.description}
                            onChange={(v: string) => setProfile({ ...profile, description: v })}
                            onSave={() => handleSave('description', profile.description)}
                            icon={<FileText size={18} />}
                            type="textarea"
                        />

                        {/* Avatar Upload Section */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Avatar</label>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem', color: 'var(--text-secondary)' }}>
                                        <Camera size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={profile.avatar || ''}
                                        onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                                        placeholder="Paste Image URL or Upload"
                                        style={{
                                            width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px', color: 'white'
                                        }}
                                    />
                                </div>
                                <label className="btn" style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', height: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>Upload</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 500000) { // 500KB limit for demo
                                                    alert('Image too large! Please use an image under 500KB.');
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setProfile({ ...profile, avatar: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                                <button
                                    onClick={() => setProfile({ ...profile, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}` })}
                                    className="btn"
                                    style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.1)', color: 'white', height: 'fit-content' }}
                                    title="Randomize Avatar"
                                >
                                    🎲
                                </button>
                                <button
                                    onClick={() => handleSave('avatar', profile.avatar)}
                                    className="btn"
                                    style={{ padding: '0.75rem', background: 'var(--accent)', color: 'white', height: 'fit-content' }}
                                    title="Save Avatar"
                                >
                                    <Save size={18} />
                                </button>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                Upload an image, paste a URL, or roll the dice!
                            </div>
                        </div>

                        <FormGroup
                            label="Twitter / X"
                            value={profile.twitter}
                            onChange={(v: string) => setProfile({ ...profile, twitter: v })}
                            onSave={() => handleSave('com.twitter', profile.twitter)}
                            description="Link your social identity"
                            icon={<div style={{ fontWeight: 'bold' }}>𝕏</div>}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

function FormGroup({ label, value, onChange, onSave, icon, type = 'text', disabled = false, description }: any) {
    return (
        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>{label}</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <div style={{ position: 'absolute', top: type === 'textarea' ? '0.75rem' : '50%', transform: type === 'textarea' ? 'none' : 'translateY(-50%)', left: '0.75rem', color: 'var(--text-secondary)' }}>
                        {icon}
                    </div>
                    {type === 'textarea' ? (
                        <textarea
                            value={value || ''}
                            onChange={(e) => onChange && onChange(e.target.value)}
                            disabled={disabled}
                            rows={3}
                            style={{
                                width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px', color: 'white', fontFamily: 'inherit', resize: 'vertical'
                            }}
                        />
                    ) : (
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => onChange && onChange(e.target.value)}
                            disabled={disabled}
                            style={{
                                width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px', color: 'white'
                            }}
                        />
                    )}
                </div>
                {!disabled && (
                    <button
                        onClick={onSave}
                        className="btn"
                        style={{ height: 'fit-content', padding: '0.75rem', background: 'var(--accent)', color: 'white' }}
                        title="Save Field"
                    >
                        <Save size={18} />
                    </button>
                )}
            </div>
            {description && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{description}</div>}
        </div>
    );
}
