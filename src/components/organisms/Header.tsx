// Header.tsx
import React from 'react';
import NavMenu from '../molecules/NavMenu';
import AgentInfo from '../molecules/AgentInfo';

const Header: React.FC = () => {
  return (
    <header className="bg-lightWhite p-2 w-full flex items-center justify-between border rounded-2xl border-lightWhite sticky top-0 left-0 z-10 "> {/* h-16 sets the height to 4rem */}
      <div className="text-xl font-semibold text-highGrey2 font-oswald p-1 hidden md:block">
        <div className='flex flex-row space-x-2 items-center'>
           <div>UniversSoft</div>
          <div className='bg-greenOne text-base font-oswald border border-greenOne rounded-md text-center p-1'>BETA</div>
        </div>
      </div>

      {/* Navigation Items */}
      <NavMenu />

      {/* Agent Info */}
      <AgentInfo />
    </header>
  );
};

export default Header;
