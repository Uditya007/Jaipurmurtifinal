'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouseX - 6}px`;
        cursorRef.current.style.top = `${mouseY - 6}px`;
      }
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;
      if (followerRef.current) {
        followerRef.current.style.left = `${followerX - 18}px`;
        followerRef.current.style.top = `${followerY - 18}px`;
      }
      requestAnimationFrame(animate);
    };

    const handleEnter = () => {
      if (cursorRef.current) cursorRef.current.style.transform = 'scale(2)';
      if (followerRef.current) {
        followerRef.current.style.width = '60px';
        followerRef.current.style.height = '60px';
        followerRef.current.style.borderColor = 'rgba(212,175,55,0.8)';
      }
    };

    const handleLeave = () => {
      if (cursorRef.current) cursorRef.current.style.transform = 'scale(1)';
      if (followerRef.current) {
        followerRef.current.style.width = '36px';
        followerRef.current.style.height = '36px';
        followerRef.current.style.borderColor = 'rgba(212,175,55,0.5)';
      }
    };

    window.addEventListener('mousemove', moveCursor);
    animate();

    const interactables = document.querySelectorAll('a, button, [data-cursor]');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
