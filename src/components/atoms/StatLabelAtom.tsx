//This component will display the label for the stat (e.g., "Total Earnings from Car Sales")

import React from 'react';

interface StatLabelAtomProps {
  label: string;
}

const StatLabelAtom: React.FC<StatLabelAtomProps> = ({ label }) => {
  return (
    <span className="text-gray-700 font-semibold text-sm">
      {label}
    </span>
  );
};

export default StatLabelAtom;
