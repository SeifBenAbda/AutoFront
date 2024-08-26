import React, { useState, useCallback } from 'react';
import { TableData } from './TableData';
import { columns as initialColumns } from '../../utils/DevisColumns';
import { PaginationTable } from '../atoms/TablePagination';
import { SheetProvider } from '../../context/sheetContext';
import FilterColumnsDevis from '../molecules/FilterColumnsDevis';
import useDevis from '../../hooks/useDevis';

interface DataTableProps {
  typeDevis: string;
}

const DataTable: React.FC<DataTableProps> = ({ typeDevis }) => {
  const [page, setPage] = useState(1);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  const { data, isLoading, error } = useDevis(page);

  // Column ID to Filter List value mapping
  const columnMapping: { [key: string]: string } = {
    'Motif': 'Motif',
    'Créé par': 'CreatedBy',
    'Date Livraison prévue': 'scheduledLivrDate',
  };

  const handleFiltredListChange = useCallback((filtredList: string[]) => {
    // Determine which columns should be hidden based on filtredList
    const columnsToHide = Object.values(columnMapping).filter(
      (colId) => filtredList.includes(colId)  // Ensure the column ID is correctly checked
    );

    setHiddenColumns(columnsToHide);
  }, []);

  const displayedColumns = initialColumns.filter(
    (col) => !hiddenColumns.includes(col.id as string)
  );

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="flex-1 flex flex-col mt-16 overflow-hidden">
      <div className='flex-none flex flex-row justify-between mb-4'>
        <div className="flex items-center justify-center font-oswald text-2xl text-bluePrimary">
          {typeDevis === "TC" ? "Devis Voiture" : "Devis Changement des Pieces"}
        </div>

        <div className="flex-1">
          <FilterColumnsDevis onFiltredListChange={handleFiltredListChange} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
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
      </div>
    </div>
  );
};

export default DataTable;
