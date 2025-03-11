import React, { useState, useCallback } from 'react';
import { TableData } from '../TableData';
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

import { X as XIcon, Filter as FilterIcon, Calendar as CalendarIcon } from "lucide-react";
import { Button } from '../../../@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../@/components/ui/popover";
import { PopoverClose } from '@radix-ui/react-popover';

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

      {/* Improved Filters Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        {/* Filter Controls */}
        <div className="flex flex-col space-y-2">
          <div className="flex flex-wrap gap-2">
            {/* Status & Priority Popover */}
            <div className="w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    className="flex items-center gap-2 bg-normalGrey text-highBlue hover:bg-lightGrey px-4 py-2 rounded-md"
                  >
                    <FilterIcon size={16} />
                    <span className='font-oswald'>Status & Priorité</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-64 p-3 border border-gray-200 shadow-md bg-white rounded-md"
                  align="start"
                  sideOffset={5}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-oswald text-highBlue text-base">Filtres</h3>
                    <PopoverClose className="h-4 w-4 opacity-70 hover:opacity-100">
                      <XIcon size={14} />
                      <span className="sr-only">Close</span>
                    </PopoverClose>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full">
                      <label className="block text-xs font-medium text-highBlue mb-1">Status</label>
                      <StatusDevisDropDown
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        isFiltring={true}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-xs font-medium text-highBlue mb-1">Priorité</label>
                      <PriorityDevisDropDown
                        value={selectedPriority}
                        onChange={handlePriorityChange}
                        isFiltring={true}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="w-auto">
              <CarsMultiSelect
                selectedValues={selectedCars}
                onChange={handleCarChange}
                isFiltering={true}
              />
            </div>
            <div className="w-auto">
              <ClientsMultiSelect
                selectedValues={selectedClients}
                onChange={handleClientChange}
                isFiltering={true}
              />
            </div>
            
            {/* Date Range Filters in a popover */}
            <div className="w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    className="flex items-center gap-2 bg-normalGrey text-highBlue hover:bg-lightGrey px-4 py-2 rounded-md"
                  >
                    <CalendarIcon size={16} />
                    <span className='font-oswald'>Période (Rappels)</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-96 p-4 border border-gray-200 shadow-md bg-white rounded-md"
                  align="start"
                  sideOffset={5}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-oswald text-highBlue text-base">Période (Rappels)</h3>
                    <PopoverClose className="h-4 w-4 opacity-70 hover:opacity-100">
                      <XIcon size={14} />
                      <span className="sr-only">Close</span>
                    </PopoverClose>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-highBlue mb-1.5">De</label>
                      <DatePicker
                        value={dateRappelFrom}
                        onChange={handleDateRappelFromChange}
                        fromYear={new Date().getFullYear() - 1}
                        toYear={new Date().getFullYear() + 1}
                        styling="w-full border border-normalGrey rounded-md bg-normalGrey hover:bg-lightGrey transition-colors"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-highBlue mb-1.5">À</label>
                      <DatePicker
                        value={dateRappelTo}
                        onChange={handleDateRappelToChange}
                        fromYear={new Date().getFullYear() - 1}
                        toYear={new Date().getFullYear() + 1}
                        styling="w-full border border-normalGrey rounded-md bg-normalGrey hover:bg-lightGrey transition-colors"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="w-full md:w-auto">
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
              <TableData data={data?.data || []}  />
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
