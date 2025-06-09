// Header.tsx
import React from 'react';
import NavMenu from '../molecules/NavMenu';
import AgentInfo from '../molecules/AgentInfo';
import SessionTimer from './SessionNotification/SessionTimer';
import DatabasesDropDown from '../atoms/DatabasesDropDown';
import { Button } from '../../@/components/ui/button';
import { getDatabasesAccess } from '../../services/apiService';
import { state } from '../../utils/shared_functions';
import { useUser } from '../../context/userContext';
import { RotateCcw } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useUser();
  
  const RefreshDatabasesButton = () => {
    const handleRefreshDatabases = async () => {
      if (!user) {
        console.error('User is not authenticated');
        return;
      }  
      try {
        const databases = await getDatabasesAccess(user!.username);
        state.databasesAccess = databases;
        state.databaseName = databases[0] || '';
        window.location.href = '/dashboard';

      } catch (error) {
        console.error('Failed to refresh databases:', error);
      }
    };

    return (
      <Button
        variant="outline"
        size="sm"
        className="border-highBlue text-highBlue hover:bg-white hover:text-highBlue transition-colors p-2"
        onClick={handleRefreshDatabases}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    );
  };
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
      <div className="flex items-center justify-end pr-4 space-x-4">
        <DatabasesDropDown />
        <RefreshDatabasesButton />
        <AgentInfo />
      </div>
    </header>
  );
};

export default Header;
