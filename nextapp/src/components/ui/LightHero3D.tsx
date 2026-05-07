'use client';

import { useEffect, useRef } from 'react';
import styles from './LightHero3D.module.css';

export default function LightHero3D() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Subtle mouse parallax — very lightweight
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      scene.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Deep space background */}
      <div className={styles.bg} />

      {/* 3D perspective scene */}
      <div className={styles.scene} ref={sceneRef}>

        {/* Outer ring */}
        <div className={`${styles.ring} ${styles.ring1}`} />
        <div className={`${styles.ring} ${styles.ring2}`} />
        <div className={`${styles.ring} ${styles.ring3}`} />

        {/* Central glowing orb */}
        <div className={styles.orb}>
          <div className={styles.orbInner} />
          <div className={styles.orbCore}>
            <span className={styles.omSymbol}>ॐ</span>
          </div>
          <div className={styles.orbGlow} />
        </div>

        {/* Orbiting dots */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={styles.orbitDot}
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}

        {/* Floating particles */}
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              '--px': `${Math.random() * 100}%`,
              '--py': `${Math.random() * 100}%`,
              '--delay': `${Math.random() * 6}s`,
              '--dur': `${4 + Math.random() * 4}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
