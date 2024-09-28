import React, { useEffect, useState, useRef } from 'react';
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
    const [selectedDevis, setSelectedDevis] = useState<Devis | undefined>(undefined); // Track the selected devis

    const { data, isLoading, error, isFetching, isError, refetch } = useDevis(page, searchValue, selectedStatus, selectedPriority, selectedCars);

    // Ref to track if it's the initial fetch
    const isInitialFetch = useRef(true);

    useEffect(() => {
        // Trigger refetch whenever search or filters change
        refetch();
    }, [searchValue, selectedStatus, selectedPriority, selectedCars, page, refetch]);

    useEffect(() => {
        if (data) {
            if (isInitialFetch.current) {
                // If it's the first fetch, select the first Devis
                handleDevisClick(data.data[0]);
                isInitialFetch.current = false; // Set it to false after the first fetch
            } else if (selectedDevis) {
                // If it's not the initial fetch, update the already selected Devis
                const updatedDevis = data.data.find((e) => e.DevisId === selectedDevis.DevisId);
                if (updatedDevis) {
                    handleDevisClick(updatedDevis);
                }
            }
        }
    }, [data]);

    const handleDevisClick = (devis: Devis) => {
        onDevisClick(devis); // Send the selected devis to the parent
        setSelectedDevis(devis); // Track the selected devis ID
    };

    const handleSearch = (searchValue: string) => {
        setSearchValue(searchValue);
        setPage(1); // Reset to first page on search
        if (searchValue !== '') {
            setSelectedDevis(undefined); // Clear selected devis on search
        }
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setPage(1); // Reset to first page on status change
        setSelectedDevis(undefined); // Clear selected devis on status change
    };

    const handlePriorityChange = (priority: string) => {
        setSelectedPriority(priority);
        setPage(1); // Reset to first page on priority change
        setSelectedDevis(undefined); // Clear selected devis on priority change
    };

    const handleCarChange = (cars: string[]) => {
        setSelectedCars(cars);
        setPage(1); // Reset to first page on car change
        setSelectedDevis(undefined); // Clear selected devis on car change
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
                            ${selectedDevis?.DevisId! === devis.DevisId ? 'bg-lightGreen border border-lightGreen text-highGrey' : 'text-lightWhite'}`}
                        onClick={() => {
                            handleDevisClick(devis);
                        }}
                    >
                        <MiniDevisCardContent devis={devis} isSelected={selectedDevis?.DevisId! === devis.DevisId} />
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
