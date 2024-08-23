import React from 'react';
import Button from '../atoms/BottomAtom';
import { useUser } from '../../context/userContext';
import { Avatar, AvatarFallback, AvatarImage } from '../../@/components/ui/avatar';

const AgentInfo: React.FC<{}> = ({}) => {
  const { user } = useUser();
  return (
    <div className="flex items-center space-x-4">
      <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>PF</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AgentInfo;
