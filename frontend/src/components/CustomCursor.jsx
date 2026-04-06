import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useGSAP(() => {
    // QuickSetters for better performance rather than standard gsap.to
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });
    
    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    
    const xToFollower = gsap.quickTo(follower, "x", { duration: 0.3, ease: "power3" });
    const yToFollower = gsap.quickTo(follower, "y", { duration: 0.3, ease: "power3" });
    
    const moveCursor = (e) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };
    
    window.addEventListener('mousemove', moveCursor);
    
    // Check when hovered over clickable elements
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .btn, input, textarea, select, [role="button"]');
      if (target) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div 
        ref={followerRef} 
        className={`custom-cursor-follower ${isHovering ? 'hover' : ''}`} 
      />
    </>
  );
};

export default CustomCursor;
