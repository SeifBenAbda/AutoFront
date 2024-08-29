import React, { useState, useEffect } from "react";
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
import { EditDevisSheet } from "../molecules/EditDevisSheet";
import { Button } from "../../@/components/ui/button";
import { Devis } from "@/types/devisTypes";

interface DataTableProps {
  columns: ColumnDef<Devis, any>[];
  data: Devis[];
}

export const TableData = ({ columns, data }: DataTableProps) => {
  const [colSizing, setColSizing] = useState<ColumnSizingState>({});
  const [tableData, setTableData] = useState<Devis[]>(data); // Manage table data state
  const [selectedRow, setSelectedRow] = useState<Devis | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  // Update tableData when data prop changes
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColSizing,
    state: {
      columnSizing: colSizing,
    },
  });

  const handleOpenSheet = (row: Devis) => {
    setSelectedRow(row);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleSaveRow = (updatedRow: Devis) => {
    // Update the row in the tableData state
    setTableData((prevData) =>
      prevData.map((item) =>
        item.DevisId === updatedRow.DevisId ? updatedRow : item // Assuming `DevisId` is a unique identifier
      )
    );

    // Send updated data to the server
    console.log("Saved row:", updatedRow);
    // You can use an API call to update the data on the server
  };

  return (
    <div className="overflow-y-auto flex-1">
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
                        onClick={() => handleOpenSheet(row.original as Devis)}
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
          allData={selectedRow}
          isOpen={isSheetOpen}
          onClose={handleCloseSheet}
          onSave={handleSaveRow}
        />
      )}
    </div>
  );
};
