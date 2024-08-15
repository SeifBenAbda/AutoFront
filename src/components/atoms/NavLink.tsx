import React from 'react';
import BottomAtom from './BottomAtom';

interface NavLinkProps {
  href: string;
  label: string;
  isActive?: boolean; // To determine if the link is active
  onClick?: () => void; // Optional onClick handler
  activeBgColor?: string; // Custom background color when active
  activeTextColor?: string; // Custom text color when active
  defaultBgColor?: string; // Custom background color when inactive
  defaultTextColor?: string; // Custom text color when inactive
}

const NavLink: React.FC<NavLinkProps> = ({
  label,
  isActive = false,
  onClick,
  activeBgColor,
  activeTextColor,
  defaultBgColor,
  defaultTextColor,
}) => {
  return (
    <BottomAtom
      onClick={onClick}
      icon={undefined} // Set to the appropriate icon if needed
      className={`p-2 font-oswald text-lg rounded-2xl transition-colors duration-300 ${
        isActive ? activeBgColor : defaultBgColor
      } ${isActive ? activeTextColor : defaultTextColor}`}
      style={{ /* Add any additional dynamic styles here */ }}
    >
      {label}
    </BottomAtom>
  );
};

export default NavLink;
