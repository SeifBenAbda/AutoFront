// src/components/organisms/MvtVenliTableData.tsx
import React from 'react';
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  ColumnResizeMode,
} from '@tanstack/react-table';
import { DataItem } from '../../types/mvtvenliTypes';

interface TableProps {
  data: DataItem[];
}

const MyTableMvtVenLi: React.FC<TableProps> = ({ data }) => {
  const columns: ColumnDef<DataItem>[] = [
    {
      header: 'UG',
      accessorKey: 'ug',
    },
    {
      header: 'Type',
      accessorKey: 'dtypdoc',
    },
    {
      header: 'Number',
      accessorKey: 'dnumero',
    },
    {
      header: 'Line',
      accessorKey: 'dligne',
    },
  ];

  const [columnResizeMode] = React.useState<ColumnResizeMode>('onChange');

  const table = useReactTable({
    data,
    columns,
    columnResizeMode, // Set columnResizeMode correctly
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <div className="overflow-x-auto">
        <table
          style={{ width: table.getCenterTotalSize() }}
        >
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                      position: 'relative',
                      paddingRight: '20px', // Adjusted for resizer visibility
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`}
                      style={{
                        transform: header.column.getIsResizing()
                          ? `translateX(${table.getState().columnSizingInfo.deltaOffset ?? 0}px)`
                          : '',
                        position: 'absolute',
                        right: '0',
                        top: '0',
                        width: '5px',
                        height: '100%',
                        cursor: 'col-resize',
                        backgroundColor: 'transparent',
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTableMvtVenLi;
