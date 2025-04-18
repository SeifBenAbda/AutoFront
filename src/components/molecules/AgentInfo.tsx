import React from 'react';

import { useUser } from '../../context/userContext';
import { Popover, PopoverContent, PopoverTrigger } from '../../@/components/ui/popover';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AgentInfo: React.FC<{}> = ({ }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const handleNavClick = (navigateTo: string) => {
    navigate(navigateTo); // Navigate to the specified path
  };


  const { handleLogout } = useAuth();

  return (
    <div className="flex items-center space-x-4">

      {/*
         <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>PF</AvatarFallback>
      </Avatar>
      */
      }

      <Popover>
        <PopoverTrigger className='p-1 text-highBlue font-oswald pr-4'>
          <div className="w-10 h-10 rounded-full bg-normalBlue border-[1px] border-white flex items-center justify-center text-white font-bold">
            {user?.firstName?.charAt(0).toUpperCase()}
          </div>
        </PopoverTrigger>
        <PopoverContent className='mr-2 bg-normalGrey border border-normalGrey rounded-md p-1 text-highBlue w-40 pl-2 pr-2'>

          <div className="flex items-center justify-between mt-2 mb-2 hover:bg-highBlue hover:text-lightWhite cursor-pointer hover:border rounded-md p-2 font-oswald text-sm" onClick={() => handleNavClick('/profile')}>
            <span>Profile</span>
            <User size={20} />
          </div>

          <div className="flex items-center justify-between mb-2 hover:bg-highBlue hover:text-lightWhite cursor-pointer hover:border rounded-md p-2 font-oswald text-sm" onClick={() => handleLogout(navigate)}>
            <span>Se déconnecter</span>
            <LogOut size={20} />
          </div>

        </PopoverContent>

      </Popover>

    </div>
  );
};

export default AgentInfo;
