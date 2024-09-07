// Header.tsx
import React from 'react';
import NavMenu from '../molecules/NavMenu';
import AgentInfo from '../molecules/AgentInfo';

const Header: React.FC = () => {
  return (
    <header className="bg-veryGrey p-2 w-full flex items-center justify-between border rounded-2xl border-veryGrey fixed top-0 left-0 z-50 h-16"> {/* h-16 sets the height to 4rem */}
      <div className="text-xl font-semibold text-greenFour font-oswald p-1 hidden md:block">
        UniversSoft
      </div>

      {/* Navigation Items */}
      <NavMenu />

      {/* Agent Info */}
      <AgentInfo />
    </header>
  );
};

export default Header;
