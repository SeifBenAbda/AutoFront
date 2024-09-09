// src/components/PriorityDevisDropDown.tsx
import useCarModels from '../../hooks/useCars';
import { MultiSelect } from '../../@/components/ui/multi-select';

interface CarsDropDownTypes {
    selectedValues: string[]; // Adjust to handle multiple selections
    onChange: (values: string[]) => void;
    isFiltering: boolean;
}

const CarsMultiSelect = ({ selectedValues, onChange, isFiltering }: CarsDropDownTypes) => {
    const { data: carModels, isLoading, error } = useCarModels();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // Prepare options for MultiSelect
    const options = carModels?.map((car) => ({
        label: car.carName,
        value: car.carName,
    })) || [];

    // Add a default "All types of cars" option if filtering
    if (isFiltering) {
        /*options.unshift({
            label: 'Tous types de voitures',
            value: 'Tous types de voitures',
        });*/
    }

    return (
        <MultiSelect
            options={options}
            onValueChange={onChange}
            defaultValue={selectedValues}
            placeholder="Tous types de voitures"
            variant="inverted"
            animation={0}
            maxCount={1}
            className='bg-white border rounded-md border-highGrey hover:bg-white text-highGrey'
        />
    );
};

export default CarsMultiSelect;
