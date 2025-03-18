
import React, { useEffect, useRef } from 'react';

const InteractiveLogoText: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll('path');
    if (!paths) return;

    const handleMouseEnter = (e: Event) => {
      const path = e.target as SVGPathElement;
      path.classList.add('letter-hover');
    };

    const handleMouseLeave = (e: Event) => {
      const path = e.target as SVGPathElement;
      path.classList.remove('letter-hover');
    };

    paths.forEach(path => {
      path.addEventListener('mouseenter', handleMouseEnter);
      path.addEventListener('mouseleave', handleMouseLeave);
      path.addEventListener('touchstart', handleMouseEnter);
      path.addEventListener('touchend', handleMouseLeave);
    });

    return () => {
      paths.forEach(path => {
        path.removeEventListener('mouseenter', handleMouseEnter);
        path.removeEventListener('mouseleave', handleMouseLeave);
        path.removeEventListener('touchstart', handleMouseEnter);
        path.removeEventListener('touchend', handleMouseLeave);
      });
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 100"
      className="w-full max-w-3xl mb-8"
      style={{ stroke: 'white', strokeWidth: '2' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="letterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4169E1" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 18 -7"
          />
        </filter>
      </defs>
      
      {/* H */ }
      <path d="M50 20h10v60h-10V55H30v25H20V20h10v25h20V20z" stroke="currentColor" strokeWidth="2" />
      {/* o */ }
      <path d="M80 35c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20z" stroke="currentColor" strokeWidth="2" />
      {/* m */ }
      <path d="M120 35v45h-10V50c0-5-4-9-9-9s-9 4-9 9v30h-10V50c0-5-4-9-9-9s-9 4-9 9v30h-10V35h10v7c3-5 8-8 14-8 7 0 13 3 16 9 3-6 9-9 16-9 11 0 20 9 20 20v26h-10V35z" stroke="currentColor" strokeWidth="2" />
      {/* e */ }
      <path d="M250 55c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20zm-30 0h20c0-6-4-10-10-10s-10 4-10 10z" stroke="currentColor" strokeWidth="2" />
      {/* S */ }
      <path d="M290 35c11 0 20 9 20 20h-10c0-6-4-10-10-10s-10 4-10 10c0 15 30 7 30 25 0 11-9 20-20 20s-20-9-20-20h10c0 6 4 10 10 10s10-4 10-10c0-15-30-7-30-25 0-11 9-20 20-20z" stroke="currentColor" strokeWidth="2" />
      {/* n */ }
      <path d="M330 35v45h-10V50c0-5-4-9-9-9s-9 4-9 9v30h-10V35h10v7c3-5 8-8 14-8 11 0 20 9 20 20v26h-6V35z" stroke="currentColor" strokeWidth="2" />
      {/* a */ }
      <path d="M370 35c11 0 20 9 20 20v25h-10v-7c-3 5-8 8-14 8-11 0-20-9-20-20s9-20 20-20zm0 35c6 0 10-4 10-10s-4-10-10-10-10 4-10 10 4 10 10 10z" stroke="currentColor" strokeWidth="2" />
      {/* p */ }
      <path d="M420 35c11 0 20 9 20 20s-9 20-20 20-20-9-20-20V20h10v22c3-5 8-7 14-7zm0 30c6 0 10-4 10-10s-4-10-10-10-10 4-10 10 4 10 10 10z" stroke="currentColor" strokeWidth="2" />
      
      {/* P */ }
      <path d="M480 20h30c11 0 20 9 20 20s-9 20-20 20h-20v20h-10V20zm30 30c6 0 10-4 10-10s-4-10-10-10h-20v20h20z" stroke="currentColor" strokeWidth="2" />
      {/* r */ }
      <path d="M550 35v45h-10V50c0-5-4-9-9-9s-9 4-9 9v30h-10V35h10v7c3-5 8-8 14-8 11 0 20 9 20 20v26h-6V35z" stroke="currentColor" strokeWidth="2" />
      {/* o */ }
      <path d="M580 35c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export default InteractiveLogoText;
