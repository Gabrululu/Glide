'use client';
import { useEffect, useState } from 'react';

export default function Confetti() {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const newParticles = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10 - Math.random() * 20,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            speed: 2 + Math.random() * 3,
            delay: Math.random() * 2
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: '10px',
                        height: '10px',
                        backgroundColor: p.color,
                        transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
                        animation: `fall ${p.speed}s linear ${p.delay}s forwards`,
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes fall {
                    to {
                        top: 110%;
                        transform: rotate(${Math.random() * 720}deg);
                    }
                }
            `}</style>
        </div>
    );
}
