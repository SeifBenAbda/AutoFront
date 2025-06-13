// src/components/PriorityDevisDropDown.tsx
import { MultiSelect } from '../../@/components/ui/multi-select';
import useClients from '../../hooks/useClients';

interface ClientsDownTypes {
    selectedValues: string[]; // Adjust to handle multiple selections
    onChange: (values: string[]) => void;
    isFiltering: boolean;
}

const ClientsMultiSelect = ({ selectedValues, onChange, isFiltering }: ClientsDownTypes) => {
    const { data: clients, isLoading, error } = useClients();

    if (isLoading){
        return (
            <div className="flex justify-center items-center h-10">
                <div className="flex border-2 border-t-highBlue h-4 w-4 border-gray-200 rounded-full animate-spin"></div>
            </div>
        );
    }
    if (error) return <div>Error: {error.message}</div>;

    // Prepare options for MultiSelect
    const options = clients?.map((client) => ({
        label: client.nomClient,
        value: client.nomClient,
    })) || [];

    // Add a default "All types of cars" option if filtering
    if (isFiltering) {
        /*options.unshift({
            label: 'Tous types de voitures',
            value: 'Tous types de voitures',
        });*/
    }
    const hoverItem = "cursor-pointer  hover:rounded-md hover:bg-normalGrey";
    const hoverItemCommand = "cursor-pointer   hover:bg-normalGrey";

    return (
        <MultiSelect
            options={options}
            key={options.findIndex((option) => option.value === selectedValues[0])}
            onValueChange={onChange}
            defaultValue={selectedValues}
            placeholder="Tous les clients"
            variant="inverted"
            animation={0}
            maxCount={1}
            className={`w-full border border-normalGrey  bg-normalGrey font-oswald text-highBlue ${hoverItem}`}
            classNameCommand={`w-full border border-normalGrey border border-normalGrey bg-normalGrey text-highBlue ${hoverItemCommand}`}
            classNameSearch={`w-full border border-normalGrey  bg-normalGrey text-highBlue  ${hoverItemCommand}`}
            borderCommand='border border-normalGrey'
        />
    );
};

export default ClientsMultiSelect;
