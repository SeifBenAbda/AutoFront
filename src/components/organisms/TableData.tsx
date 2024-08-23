// TableData.tsx
import React, { useState } from "react";
import {
  ColumnDef,
  ColumnSizingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../@/components/ui/table";
import { ColumnResizer } from "../atoms/ColumnResizer";
import { EditDevisSheet } from "../molecules/EditDevisSheet"; // Make sure this path is correct
import { Button } from "../../@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export const TableData = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const [colSizing, setColSizing] = useState<ColumnSizingState>({});
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColSizing,
    state: {
      columnSizing: colSizing,
    },
  });

  const handleOpenSheet = (row: any) => {
    console.log(row)
    setSelectedRow(row);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleSaveRow = (updatedRow: TData) => {
    // Update your data state or make an API call to save the changes
    console.log("Saved row:", updatedRow);
  };

  return (
    <>
      <Table
        style={{ width: table.getTotalSize() }}
        className="bg-whiteSecond border border-whiteSecond"
      >
        <TableHeader className="rounded-tl-2xl rounded-2xl overflow-hidden">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  align="center"
                  key={header.id}
                  className={`relative ${index < headerGroup.headers.length - 1
                      ? "border-r border-whiteSecond text-center align-middle text-bluePrimary font-oswald"
                      : "text-bluePrimary border-whiteSecond text-center align-middle font-oswald"
                    }`}
                  style={{
                    width: header.getSize(),
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  <ColumnResizer header={header} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`${rowIndex % 2 === 0 ? "bg-blueCiel hover:bg-blueCiel" : "bg-veryGrey"
                  }`}
              >
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <TableCell
                    key={cell.id}
                    align="center"
                    className={`${cellIndex < row.getVisibleCells().length - 1
                        ? "border-r border-gray-300 text-bluePrimary"
                        : "text-bluePrimary"
                      }`}
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.columnDef.minSize,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    {cell.column.id === 'actions' && (
                      <Button
                        onClick={() => handleOpenSheet(row.original)}
                        className="px-4 py-2 text-white bg-bluePrimary rounded"
                      >
                        Modifier
                      </Button>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center rounded-bl-2xl rounded-br-2xl">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedRow && (
        <EditDevisSheet
          allData={selectedRow} // Pass all row data
          isOpen={isSheetOpen}
          onClose={handleCloseSheet}
          onSave={handleSaveRow} // Pass the save handler
        />
      )}
    </>
  );
};
