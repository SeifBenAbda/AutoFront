import React, { useEffect, useState } from 'react';
import { Toggle } from "../../@/components/ui/toggle";

interface TypeClientProps {
  option1: string;
  option2: string;
  defaultValue: string;
  onChange?: (selected: string) => void;
}

const TypeClient: React.FC<TypeClientProps> = ({ option1, option2, onChange, defaultValue }) => {
  const [selected, setSelected] = useState<string>(defaultValue === "Entreprise" ? option2 : option1);

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue === "Entreprise" ? option2 : option1);
    }
  }, [defaultValue, option1, option2,selected]);

  const handleToggle = () => {
    const newSelected = selected === option1 ? option2 : option1;
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };

  return (
    <Toggle
      aria-label="Type Client"
      onClick={handleToggle}
      data-state={selected === "Entreprise" ? "on" : "off"}  // Dynamically set data-state
      className={`relative w-full font-oswald bg-whiteSecond text-highBlue hover:bg-whiteSecond hover:text-highBlue border 
      ${selected === "Entreprise" ? "border-greenOne bg-greenOne text-whiteSecond" : "border-gray-300 bg-white text-highBlue"}
      data-[state=on]:border-greenOne data-[state=on]:bg-greenOne data-[state=on]:text-whiteSecond`}
    >
      {selected}
    </Toggle>
  );
};

export default TypeClient;
