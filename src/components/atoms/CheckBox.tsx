import { FC } from "react";

interface CheckboxProps {
    value: string;
  }
  
  const Checkbox: FC<CheckboxProps> = ({ value }) => (
    <input type="checkbox" value={value} />
  );
  
export default Checkbox;