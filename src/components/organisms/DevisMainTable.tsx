import React, { useState, useCallback } from 'react';
import { TableData } from './TableData';
import { columns as initialColumns } from '../../utils/DevisColumns';
import { PaginationTable } from '../atoms/TablePagination';
import { SheetProvider } from '../../context/sheetContext';
import FilterColumnsDevis from '../molecules/FilterColumnsDevis';
import useDevis from '../../hooks/useDevis';
import Loading from '../atoms/Loading';
import SearchBar from '../atoms/SearchDevis';

interface DataTableProps {
  typeDevis: string;
}

const DataTable: React.FC<DataTableProps> = ({ typeDevis }) => {
  const [page, setPage] = useState(1);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // Update the hook call to include searchValue
  const { data, isLoading, error } = useDevis(page, searchValue);
  const columnMapping: { [key: string]: string } = {
    'Motif': 'Motif',
    'Créé par': 'CreatedBy',
    'Date Livraison prévue': 'scheduledLivrDate',
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
    console.log("Saerch Value "+searchValue)
    setSearchValue(searchValue);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="flex-1 flex flex-col mt-16 overflow-hidden">
      {/* Header with Devis Title and Filter */}
      <div className='flex-none flex flex-row justify-between mb-4'>
        <div className="flex items-center justify-center font-oswald text-2xl text-bluePrimary">
          {typeDevis === "TC" ? "Devis Voiture" : "Devis Changement des Pieces"}
        </div>

        <div className="flex-1">
          <FilterColumnsDevis onFiltredListChange={handleFiltredListChange} />
        </div>
      </div>

      {/* Search Box */}
      <div className="flex-none mb-4">
        <SearchBar onSearch={handleSearch} searchValue={searchValue} />
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
