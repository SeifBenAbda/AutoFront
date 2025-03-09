import React, { useState, useCallback } from 'react';
import { TableData } from '../TableData';
import { columns as initialColumns } from '../../../utils/DevisColumns';
import { PaginationTable } from '../../atoms/TablePagination';
import { SheetProvider } from '../../../context/sheetContext';
import useDevis from '../../../hooks/useDevis';
import Loading from '../../atoms/Loading';
import SearchBar from '../../atoms/SearchDevis';
import StatusDevisDropDown from '../../atoms/StatusDevis';
import PriorityDevisDropDown from '../../atoms/PriorityDropDown';
import CarsMultiSelect from '../../atoms/CarsMultiSelect';
import ClientsMultiSelect from '../../../components/atoms/ClientsMultiSelect';
import { DatePicker } from '../../../components/atoms/DateSelector';

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
  const [selectedClients, setSelectedClients] = useState<string[]>([]); // Changed to an array
  const [dateRappelFrom, setDateRappelFrom] = useState<Date | undefined>();
  const [dateRappelTo, setDateRappelTo] = useState<Date | undefined>();

  // Fetch data from the API based on current filters and pagination
  const { data, isLoading, error } = useDevis(
    page, searchValue, selectedStatus, 
    selectedPriority, selectedCars, selectedClients,
    dateRappelFrom,
    dateRappelTo);

  const columnMapping: { [key: string]: string } = {
    'Motif': 'Motif',
    'Créé par': 'CreatedBy',
    'Date Livraison prévue': 'scheduledLivrDate',
  };


  const handleDateRappelFromChange = (date: Date | undefined) => {
    setDateRappelFrom(date);
    setPage(1);
  };

  const handleDateRappelToChange = (date: Date | undefined) => {
    setDateRappelTo(date);
    setPage(1);
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

  const handleClientChange = (clients: string[]) => {
    setSelectedClients(clients);
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
    <div className="flex-1 flex flex-col overflow-hidden ">
      {/* Header with Devis Title and Filter */}
      <div className='flex-none flex flex-row justify-between mb-4'>
        <div className="flex items-center justify-center font-oswald text-2xl text-highBlue">
          {typeDevis === "TC" ? "Devis Voiture" : "Devis Changement des Pieces"}
        </div>

        {/*<div className="flex-1">
          <FilterColumnsDevis onFiltredListChange={handleFiltredListChange} />
        </div> */}

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
          <div className="w-auto">
            <ClientsMultiSelect
              selectedValues={selectedClients} // Changed to selectedValues
              onChange={handleClientChange} // Updated to handle array of selected values
              isFiltering={true}
            />
          </div>

          <div className="flex gap-4">
            <div className="w-auto">
              <DatePicker
                value={dateRappelFrom}
                onChange={handleDateRappelFromChange}
                fromYear={new Date().getFullYear() - 1}
                toYear={new Date().getFullYear() + 1}
                styling="w-full border border-normalGrey bg-normalGrey"
              />
            </div>
            <div className="w-auto">
              <DatePicker
                value={dateRappelTo}
                onChange={handleDateRappelToChange}
                fromYear={new Date().getFullYear() - 1}
                toYear={new Date().getFullYear() + 1}
                styling="w-full border border-normalGrey bg-normalGrey"
              />
            </div>
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
