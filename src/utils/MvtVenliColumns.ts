import { DataItem } from "@/types/mvtvenliTypes";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<DataItem>[] = [
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