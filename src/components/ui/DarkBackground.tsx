
import React from 'react';

interface DarkBackgroundProps {
  children: React.ReactNode;
}

export const DarkBackground: React.FC<DarkBackgroundProps> = ({ children }) => {
  return (
    <div className="dark-bg-container">
      {/* Gradient orbs */}
      <div className="gradient-orb gradient-orb-purple"></div>
      <div className="gradient-orb gradient-orb-blue"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
