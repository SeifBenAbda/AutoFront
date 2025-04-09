// Header.tsx
import React from 'react';
import NavMenu from '../molecules/NavMenu';
import AgentInfo from '../molecules/AgentInfo';
import SessionTimer from './SessionNotification/SessionTimer';

const Header: React.FC = () => {
  return (
    <header className="bg-highBlue h-14 border-0 w-full flex items-center justify-between border-lightWhite sticky top-0 left-0 z-10 m-0 p-0">
      <div className="text-xl font-semibold text-highBlue font-oswald p-1 hidden md:block">
        <div className='pl-2 flex flex-row space-x-2 items-center'>
          <div className='font-oswald text-lightWhite'>UniversSoft</div>
          <div className='bg-highYellow text-base font-oswald border border-highYellow rounded-md text-center p-1'>BETA</div>
          <SessionTimer />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-grow flex justify-center">
        <NavMenu />
      </div>

      {/* Agent Info */}
      <AgentInfo />
    </header>
  );
};

export default Header;
