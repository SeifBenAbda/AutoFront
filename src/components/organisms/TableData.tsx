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
import { Button } from "../../@/components/ui/button";
import { Devis } from "@/types/devisTypes";

import { useNavigate } from "react-router-dom";
import { DevisDetailsPage } from "./DevisDetails/DevisDetailsNewDialog";
import { useDeletedDevis } from "../../hooks/useDevis";
import { useUser } from "../../context/userContext";




interface DataTableProps {
  columns: ColumnDef<Devis, any>[];
  data: Devis[];
}

export const TableData = ({ columns, data }: DataTableProps) => {
  const [colSizing, setColSizing] = useState<ColumnSizingState>({});
  const [tableData, setTableData] = useState<Devis[]>(data); // Manage table data state
  const [selectedRow, setSelectedRow] = useState<Devis | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { mutateAsync: deleteDevis } = useDeletedDevis();


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


  const handleDeleteRow = (row: Devis) => {
    const updatedData = tableData.filter((item) => item.DevisId !== row.DevisId);

    
    deleteDevis({
      database: "Commer_2024_AutoPro",
      devisId: row.DevisId!,
      deletedBy: user?.nomUser || "Unknown User",
    }).then((data) => {
      if(data.status===200){
        setTableData(updatedData);
      }
    })    
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
  };

  return (
    <div className="w-full">
      <div className="relative w-full overflow-auto rounded-xl  border-highBlue border-[1px]">
        <Table className="w-full bg-bgColorLight   table-fixed">
          <TableHeader className="sticky top-0 z-10 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-lighGrey hover:bg-lighGrey">
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    align="center"
                    key={header.id}
                    className={`
                      relative bg-lighGrey hover:bg-lighGrey
                      ${index < headerGroup.headers.length - 1
                        ? " text-center align-middle text-highGrey font-oswald"
                        : "text-highGrey  text-center align-middle font-oswald"
                      }
                      ${header.column.id === 'actions' ? 'w-24' : ''}
                      ${header.column.id === 'delete' ? 'w-24' : ''}
                      ${header.column.id === 'statusDevis' ? 'w-24' : ''}
                      ${header.column.id === 'PriorityDevis' ? 'w-24' : ''}
                      ${header.column.id === 'client.nomClient' ? 'w-44' : ''}
                      ${header.column.id === 'carModels' ? 'w-40' : ''}
                      ${header.column.id === 'DateCreation' ? 'w-36' : ''}
                      ${header.column.id === 'DevisId' ? 'w-24' : ''}
                      ${header.column.id === 'client.telClient' ? 'w-36' : ''}
                      ${header.column.id === 'nextReminder' ? 'w-56' : ''}
                      
            
                      
                    `}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    {index !== headerGroup.headers.length - 1 && <ColumnResizer header={header} />}
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
                  className={`
                    ${rowIndex % 2 === 0 ? "bg-lighGrey hover:bg-lighGrey cursor-pointer" : "bg-blueCiel hover:bg-blueCiel cursor-pointer"}
                  `}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      align="center"
                      className={`
                        ${cellIndex < row.getVisibleCells().length - 1
                          ? "  text-highGrey"
                          : "text-highGrey"
                        }
                        
                        
                      `}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      {cell.column.id === 'actions' && (
                        <Button
                          onClick={
                            () => handleOpenSheet(row.original)                    
                          }
                          className="px-4 py-2 text-white bg-highBlue rounded-md font-oswald"
                        >
                          Modifier
                        </Button>
                      )}
                      {cell.column.id === 'delete' && (
                        <Button
                          onClick={
                            () => handleDeleteRow(row.original)                    
                          }
                          className="px-2 py-2 text-white bg-lightRed hover:bg-lightRed rounded-md font-oswald"
                        >
                          Supprimer
                        </Button>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center rounded-b-xl"
                >
                  Aucun résultat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedRow && (
        <DevisDetailsPage
          allData={selectedRow}
          isOpen={isSheetOpen}
          onClose={handleCloseSheet}
          onSave={handleSaveRow}
        />
      )}
    </div>
  );
};
