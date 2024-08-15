// src/components/atoms/BottomAtom.tsx
import React from 'react';

interface BottomAtomProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string; // For additional classes
  style?: React.CSSProperties; // For dynamic styles
  children?: React.ReactNode; // Include children prop
}

const BottomAtom: React.FC<BottomAtomProps> = ({
  onClick,
  icon,
  className,
  style,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-300 ${className}`}
      style={style}
    >
      {icon}
      {children}
    </button>
  );
};

export default BottomAtom;
