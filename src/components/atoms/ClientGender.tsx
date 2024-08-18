import React, { useState } from 'react';
import { Toggle } from "../../@/components/ui/toggle";

interface ClientGenderProps {
  option1: string;
  option2: string;
  onChange?: (selected: string) => void;
}

const ClientGender: React.FC<ClientGenderProps> = ({ option1, option2, onChange }) => {
  const [selected, setSelected] = useState<string>(option1);

  const handleToggle = () => {
    const newSelected = selected === option1 ? option2 : option1;
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };

  return (
    <Toggle
      aria-label="Toggle gender"
      onClick={handleToggle}
      className="relative w-full font-oswald bg-bluePrimary text-whiteSecond hover:bg-bluePrimary hover:text-whiteSecond border data-[state=on]:border-bluePrimary"
    >
      {selected}
    </Toggle>
  );
};

export default ClientGender;
