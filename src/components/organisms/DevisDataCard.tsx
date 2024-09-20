import React, { useEffect, useState } from 'react';
import useDevis from '../../hooks/useDevis';
import { Devis } from '../../types/devisTypes'; // Assuming you have a type for your data
import { PaginationTable } from '../atoms/TablePagination';
import Loading from '../atoms/Loading';
import PriorityDevisDropDown from '../atoms/PriorityDropDown';
import StatusDevisDropDown from '../atoms/StatusDevis';
import CarsMultiSelect from '../atoms/CarsMultiSelect';
import MiniDevisCardContent from './MiniDevisCardContent';
import SearchBar from '../atoms/SearchDevis';

interface DevisDataProps {
    onDevisClick: (devis: Devis) => void; // Function to send the selected Devis to the parent
}

const DevisData: React.FC<DevisDataProps> = ({ onDevisClick }) => {
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>('Tous Status');
    const [selectedPriority, setSelectedPriority] = useState<string | undefined>('Toutes les priorités');
    const [selectedCars, setSelectedCars] = useState<string[]>([]);
    const [selectedDevisId, setSelectedDevisId] = useState<string | undefined>(undefined); // Track the selected devis

    const { data, isLoading, error, isFetching, isError, refetch } = useDevis(page, searchValue, selectedStatus, selectedPriority, selectedCars);



    useEffect(() => {
        // Trigger refetch whenever search or filters change
        refetch();
    }, [searchValue, selectedStatus, selectedPriority, selectedCars, page, refetch]);

    const handleDevisClick = (devis: Devis) => {
        console.log("Pressed Devis _ " + devis)
        onDevisClick(devis); // Send the selected devis to the parent
        setSelectedDevisId(devis.DevisId!.toString()); // Track the selected devis ID
    };

    const handleSearch = (searchValue: string) => {
        setSearchValue(searchValue);
        setPage(1); // Reset to first page on search
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setPage(1); // Reset to first page on status change
    };

    const handlePriorityChange = (priority: string) => {
        setSelectedPriority(priority);
        setPage(1); // Reset to first page on priority change
    };

    const handleCarChange = (cars: string[]) => {
        setSelectedCars(cars);
        setPage(1); // Reset to first page on car change
    };



    const renderFilters = () => (
        <div className="flex flex-wrap gap-4 p-2 sticky">
            <div className="w-auto">
                <StatusDevisDropDown value={selectedStatus} onChange={handleStatusChange} isFiltring={true} />
            </div>
            <div className="w-auto">
                <PriorityDevisDropDown value={selectedPriority} onChange={handlePriorityChange} isFiltring={true} />
            </div>
            <div className="w-auto">
                <CarsMultiSelect selectedValues={selectedCars} onChange={handleCarChange} isFiltering={true} />
            </div>
        </div>

    );

    const renderArticles = () => {
        if (isError) {
            return <div>Error loading devis.</div>;
        }

        return (
            <div className="flex-grow overflow-y-auto p-4"> {/* Scrolling inside the DevisData */}
                {data?.data.map((devis: Devis) => (
                    <div
                        key={devis.DevisId}
                        className={`font-oswald p-3 bg-highGrey border border-highGrey rounded-xl mb-2 cursor-pointer 
                            ${selectedDevisId === devis.DevisId!.toString() ? 'bg-lightGreen border border-lightGreen text-highGrey' : 'text-lightWhite'}`}
                        onClick={() => {
                            console.log("Clicked Devis ID: ", devis.DevisId);
                            handleDevisClick(devis);
                        }}
                    >
                        <MiniDevisCardContent devis={devis} isSelected={selectedDevisId === devis.DevisId!.toString()} />
                    </div>
                ))}
            </div>
        );
    };

    const renderSearchBar = () => {
        return (
            <div className="w-full sticky top-0 bg-white z-10 ">
                <SearchBar onSearch={handleSearch} searchValue={searchValue} />
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col  overflow-hidden"> {/* Ensure the DevisData fills its parent */}
            {renderFilters()}
            <hr />
            {renderSearchBar()}
            {renderArticles()}
            <div className="flex justify-center mt-4">
                <PaginationTable
                    currentPage={data?.meta.currentPage}
                    totalPages={data?.meta.totalPages}
                    onPageChange={setPage}
                />
            </div>
            <div className="mt-4 p-4 text-center">
                {isFetching && <Loading />}
            </div>
        </div>
    );
};


export default DevisData;
