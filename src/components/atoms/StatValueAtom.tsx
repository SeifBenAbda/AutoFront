//This component will display the value of the stat (e.g., "$25,000").

import React from 'react';

interface StatValueAtomProps {
  value: string;
}

const StatValueAtom: React.FC<StatValueAtomProps> = ({ value }) => {
  return (
    <span className="text-2xl font-bold text-gray-900">
      {value}
    </span>
  );
};

export default StatValueAtom;
