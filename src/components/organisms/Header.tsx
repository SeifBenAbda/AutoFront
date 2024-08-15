import React from 'react';
import NavMenu from '../molecules/NavMenu';
import AgentInfo from '../molecules/AgentInfo';

const Header: React.FC<{}> = () => {
  
  return (
    <header className="bg-whiteSecond p-2 m-2 flex items-center justify-between border rounded-2xl border-whiteSecond">
      {}
      <div className="text-xl font-semibold text-bluePrimary font-oswald p-1">
        UniversSoft
      </div>

      {/* Navigation Items */}
      <NavMenu />

      {/* Agent Info */}
      <AgentInfo/>
    </header>
  );
};

export default Header;
