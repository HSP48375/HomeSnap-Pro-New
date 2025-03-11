import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Camera, Home } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background patterns */}
      <div className="fixed inset-0 bg-hex-grid opacity-20 pointer-events-none"></div>
      <div className="fixed inset-0 bg-cyber-dots opacity-10 pointer-events-none"></div>
      
      {/* Animated floating orbs */}
      <div 
        className="floating-orb floating-orb-blue w-96 h-96"
        style={{
          top: '10%',
          left: '20%',
          transform: `translate(${(mousePosition.x - window.innerWidth / 2) / -30}px, ${(mousePosition.y - window.innerHeight / 2) / -30}px)`,
          animation: 'float 8s ease-in-out infinite'
        }}
      ></div>
      <div 
        className="floating-orb floating-orb-pink w-80 h-80"
        style={{
          bottom: '15%',
          right: '15%',
          transform: `translate(${(mousePosition.x - window.innerWidth / 2) / -40}px, ${(mousePosition.y - window.innerHeight / 2) / -40}px)`,
          animation: 'float 10s ease-in-out infinite 1s'
        }}
      ></div>
      
      {/* Navigation button to return home */}
      <div className="absolute top-4 left-4 z-10">
        <Link to="/" className="p-3 glassmorphism rounded-full flex items-center justify-center hover:bg-white/5 transition-all">
          <Home className="h-5 w-5 text-white" />
        </Link>
      </div>

      <div className="flex-1 flex">
        {/* Left side - Auth form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div 
            className="w-full max-w-md glassmorphism p-8 rounded-xl"
            style={{
              transform: `translateX(${(mousePosition.x - window.innerWidth / 2) / 50}px) translateY(${(mousePosition.y - window.innerHeight / 2) / 50}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent blur-lg opacity-30"></div>
                  <Camera className="h-10 w-10 text-white relative z-10" />
                </div>
                <span className="ml-2 text-2xl font-bold gradient-text">HomeSnap Pro</span>
              </div>
              <Outlet />
            </div>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80')] bg-cover bg-center"></div>
          <div 
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{
              transform: `translateX(${-(mousePosition.x - window.innerWidth / 2) / 30}px) translateY(${-(mousePosition.y - window.innerHeight / 2) / 30}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <div className="glassmorphism p-8 rounded-xl max-w-lg text-center">
              <h2 className="text-3xl font-bold mb-4 gradient-text">Transform Your Real Estate Photos</h2>
              <p className="text-white/80">
                Upload your property photos and let our professional editors enhance them to showcase your listings at their absolute best.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;