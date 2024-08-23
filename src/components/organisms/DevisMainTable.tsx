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

  const hideColumns = (columnsToHide: string[]) => {
    setHiddenColumns((prevHiddenColumns) => [
      ...new Set([...prevHiddenColumns, ...columnsToHide]),
    ]);
  };

  const showColumns = (columnsToShow: string[]) => {
    setHiddenColumns((prevHiddenColumns) =>
      prevHiddenColumns.filter((col) => !columnsToShow.includes(col))
    );
  };

  const handleFiltredListChange = useCallback((filtredList: string[]) => {
    const financialColumns = ['toprht', 'totrem', 'tottax', 'totttc'];

    if (filtredList.includes('financialData')) {
      hideColumns(financialColumns);
    } else {
      showColumns(financialColumns);
    }
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
    <div className="mt-16">
      <div className='flex flex-row justify-between mb-4'>
        <div className="flex-1 font-oswald text-2xl text-bluePrimary">
          {typeDevis=="TC"?"Devis Voiture":"Devis Changement des Pieces"}
        </div>
        <div className="flex-1">
          <FilterColumnsDevis onFiltredListChange={handleFiltredListChange} />
        </div>
      </div>
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
  );
};

export default DataTable;
