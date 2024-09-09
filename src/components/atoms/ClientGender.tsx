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
      className="relative w-full font-oswald bg-whiteSecond text-darkGrey hover:bg-whiteSecond hover:text-darkGrey border 
      data-[state=on]:border-lightRed data-[state=on]:bg-lightRed data-[state=on]:text-whiteSecond "
    >
      {selected}
    </Toggle>
  );
};

export default ClientGender;
