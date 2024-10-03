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

    if (isLoading){
        return (
            <div className="flex justify-center items-center h-10">
                <div className="flex border-2 border-t-highGrey h-4 w-4 border-gray-200 rounded-full animate-spin"></div>
            </div>
        );
    }
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
            className='bg-lightWhite border rounded-md border-highGrey hover:bg-lightWhite text-highGrey'
        />
    );
};

export default CarsMultiSelect;
