import React, { useState, useCallback } from 'react';
import { TableData } from './TableData';
import { columns as initialColumns } from '../../utils/DevisColumns';
import { PaginationTable } from '../atoms/TablePagination';
import { SheetProvider } from '../../context/sheetContext';
import FilterColumnsDevis from '../molecules/FilterColumnsDevis';
import useDevis from '../../hooks/useDevis';
import Loading from '../atoms/Loading';
import SearchBar from '../atoms/SearchDevis';
import StatusDevisDropDown from '../atoms/StatusDevis';
import PriorityDevisDropDown from '../atoms/PriorityDropDown';
import CarsMultiSelect from '../atoms/CarsMultiSelect';

interface DataTableProps {
  typeDevis: string;
}

const DataTable: React.FC<DataTableProps> = ({ typeDevis }) => {
  const [page, setPage] = useState(1);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>('Tous Status');
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>('Toutes les priorités');
  const [selectedCars, setSelectedCars] = useState<string[]>([]); // Changed to an array

  // Fetch data from the API based on current filters and pagination
  const { data, isLoading, error } = useDevis(page, searchValue, selectedStatus, selectedPriority, selectedCars);

  const columnMapping: { [key: string]: string } = {
    'Motif': 'Motif',
    'Créé par': 'CreatedBy',
    'Date Livraison prévue': 'scheduledLivrDate',
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

  const handleFiltredListChange = useCallback((filtredList: string[]) => {
    const columnsToHide = Object.values(columnMapping).filter(
      (colId) => filtredList.includes(colId)
    );
    setHiddenColumns(columnsToHide);
  }, []);

  const displayedColumns = initialColumns.filter(
    (col) => !hiddenColumns.includes(col.id as string)
  );

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="flex-1 flex flex-col mt-16 overflow-hidden">
      {/* Header with Devis Title and Filter */}
      <div className='flex-none flex flex-row justify-between mb-4'>
        <div className="flex items-center justify-center font-oswald text-2xl text-highGrey">
          {typeDevis === "TC" ? "Devis Voiture" : "Devis Changement des Pieces"}
        </div>

        <div className="flex-1">
          <FilterColumnsDevis onFiltredListChange={handleFiltredListChange} />
        </div>
      </div>

      {/* Search Box and Status Dropdown */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="w-auto">
            <StatusDevisDropDown
              value={selectedStatus}
              onChange={handleStatusChange}
              isFiltring={true}
            />
          </div>
          <div className="w-auto">
            <PriorityDevisDropDown
              value={selectedPriority}
              onChange={handlePriorityChange}
              isFiltring={true}
            />
          </div>
          <div className="w-auto">
          <CarsMultiSelect
              selectedValues={selectedCars} // Changed to selectedValues
              onChange={handleCarChange} // Updated to handle array of selected values
              isFiltering={true}
            />
          </div>
          
        </div>
        <div className="w-auto">
          <SearchBar onSearch={handleSearch} searchValue={searchValue} />
        </div>
      </div>

      {/* Devis Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loading />
          </div>
        ) : (
          <>
            <SheetProvider>
              <TableData data={data?.data || []} columns={displayedColumns} />
            </SheetProvider>
            <div className="flex justify-center mt-4">
              <PaginationTable
                currentPage={data?.meta.currentPage}
                totalPages={data?.meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataTable;
