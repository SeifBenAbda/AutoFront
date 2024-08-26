import { useState, useEffect } from "react";
import { MultiSelect } from "../../@/components/ui/multi-select";

const filterList = [
  { value: "Motif", label: "Motif" },
  { value: "CreatedBy", label: "Créé par" },
  { value: "scheduledLivrDate", label: "Date Livraison prévue" },

  
];

interface FilterColumnsDevisProps {
  onFiltredListChange: (filtredList: string[]) => void;
}

const FilterColumnsDevis: React.FC<FilterColumnsDevisProps> = ({ onFiltredListChange }) => {
  const [filtredList, setFiltredList] = useState<string[]>([]);

  useEffect(() => {
    onFiltredListChange(filtredList);
  }, [filtredList, onFiltredListChange]);

  return (
    <MultiSelect
      options={filterList}
      onValueChange={setFiltredList}
      defaultValue={filtredList}
      placeholder="Choisir les filtres du tableau"
      variant="inverted"
      animation={0}
    />
  );
};

export default FilterColumnsDevis;
