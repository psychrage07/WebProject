import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AnimatedBackground = () => {
  const container = useRef(null);
  
  useGSAP(() => {
    // Subtle breathing/floating animation for the orbs
    gsap.to('.bg-orb-1', {
      x: 'random(-50, 50)',
      y: 'random(-50, 50)',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    
    gsap.to('.bg-orb-2', {
      x: 'random(-60, 60)',
      y: 'random(-60, 60)',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    
    gsap.to('.bg-orb-3', {
      x: 'random(-40, 40)',
      y: 'random(-40, 40)',
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    
    // Mouse tracking for subtle parallax
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      
      gsap.to('.bg-orb-1', { x: x * 2, y: y * 2, duration: 2, ease: 'power2.out', overwrite: 'auto' });
      gsap.to('.bg-orb-2', { x: -x * 2, y: -y * 2, duration: 2.5, ease: 'power2.out', overwrite: 'auto' });
      gsap.to('.bg-orb-3', { x: x, y: -y, duration: 3, ease: 'power2.out', overwrite: 'auto' });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: container });

  return (
    <div ref={container} className="fixed inset-0 overflow-hidden" style={{ zIndex: -1, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>
    </div>
  );
};

export default AnimatedBackground;
