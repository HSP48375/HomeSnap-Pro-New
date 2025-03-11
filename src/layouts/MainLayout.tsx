import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import Sidebar from '../components/navigation/Sidebar';

interface MainLayoutProps {
  isAdmin?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isAdmin = false }) => {
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
    <div className="flex flex-col min-h-screen">
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
      
      <Navbar isAdmin={isAdmin} />
      
      <div className="flex flex-1 relative z-10 pt-16">
        <Sidebar isAdmin={isAdmin} />
        
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;