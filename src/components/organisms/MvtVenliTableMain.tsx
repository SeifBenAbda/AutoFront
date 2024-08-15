// src/components/organisms/DataTable.tsx
import React, { useState } from 'react';
import useData from '../../hooks/useMvtVenli'; // Adjust the import path as necessary
import MyTableMvtVenLi from './MvtVenliTableData';

const DataTable: React.FC = () => {
  const [page, setPage] = useState(1); // Start with the first page

  const { data, isLoading, error, isFetching } = useData(page);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <MyTableMvtVenLi data={data || []} />
      <div className="pagination-controls">
        <button
          onClick={() => setPage(old => Math.max(old - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(old => old + 1)}
          disabled={isFetching || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
