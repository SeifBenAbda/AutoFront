import React from 'react';
import Button from '../atoms/BottomAtom';
import { useUser } from '../../context/userContext';

/*interface AgentInfoProps {
  name: string;
}*/

const AgentInfo: React.FC<{}> = ({}) => {
  const { user } = useUser();
  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-600">{user?.nomUser}</span>
      <Button onClick={() => alert('Go to settings')} />
    </div>
  );
};

export default AgentInfo;
