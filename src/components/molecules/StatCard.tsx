
import React from 'react';
import StatLabelAtom from '../atoms/StatLabelAtom';
import StatValueAtom from '../atoms/StatValueAtom';

interface StatCardMoleculeProps {
  label: string;
  value: string;
}

const StatCardMolecule: React.FC<StatCardMoleculeProps> = ({ label, value }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-xs">
      <StatLabelAtom label={label} />
      <StatValueAtom value={value} />
    </div>
  );
};

export default StatCardMolecule;
