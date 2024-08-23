// src/components/atoms/CheckDevisButton.tsx
import React from 'react';
import { useSheet } from '../../context/sheetContext';
import { Button } from '../../@/components/ui/button';

interface CheckDevisButtonProps {
  numero: string;
}

const CheckDevisButton: React.FC<CheckDevisButtonProps> = ({ numero }) => {
  const { openSheet } = useSheet();

  return (
    <Button
      onClick={() => openSheet(numero)}
      className="px-4 py-2 text-white bg-blue-500 rounded"
    >
      Fetch Data
    </Button>
  );
};

export default CheckDevisButton;
