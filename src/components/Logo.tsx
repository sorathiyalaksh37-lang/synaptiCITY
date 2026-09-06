import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <img
      src="/logo.png"
      alt="synaptiCITY logo"
      className={className}
      style={{ width: '40px', height: '40px', objectFit: 'contain' }}
    />
  );
};
