import { useState, useEffect, useMemo } from "react";
import {
  ColumnDef,
  ColumnSizingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Devis } from "@/types/devisTypes";
import { useNavigate } from "react-router-dom";
import { DevisDetailsPage } from "./DevisDetails/DevisDetailsNewDialog";
import { useDeletedDevis } from "../../hooks/useDevis";
import { useUser } from "../../context/userContext";
import {
  Edit,
  Hash,
  AlertTriangle,
  User,
  Phone,
  Car,
  Bell,
  Calendar,
  CheckCircle2
} from "lucide-react";

interface DataTableProps {
  columns?: ColumnDef<Devis, any>[];
  data: Devis[];
  autoOpenDevisId?: number | string;
}

export const TableData = ({ data, columns: externalColumns, autoOpenDevisId }: DataTableProps) => {
  const [colSizing, setColSizing] = useState<ColumnSizingState>({});
  const [tableData, setTableData] = useState<Devis[]>(data);
  const [selectedRow, setSelectedRow] = useState<Devis | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { mutateAsync: deleteDevis } = useDeletedDevis();

  // Update tableData when data prop changes
  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
        if (autoOpenDevisId) {
            const devis = data.find(d => d.DevisId == autoOpenDevisId);
            if (devis) {
                handleOpenSheet(devis);
            }
        }
    }, [autoOpenDevisId, data]);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case 'facturé':
          return 'bg-green-50 text-green-800 border border-green-300';
        case 'réservé':
          return 'bg-yellow-50 text-yellow-800 border border-yellow-300';
        case 'annulé':
          return 'bg-red-50 text-red-800 border border-red-300';
        case 'draft':
          return 'bg-blue-100 text-blue-700 border border-blue-200';
        case 'livré':
          return 'bg-purple-50 text-purple-700 border border-purple-200';
        default:
          return 'bg-gray-100 text-gray-700 border border-gray-200';
      }
    };

    const isBilled = status?.toLowerCase() === 'facturé';
    const isCancelled = status?.toLowerCase() === 'annulé';
    const isReserved = status?.toLowerCase() === 'réservé';
    const isLivred = status?.toLowerCase() === 'livré';

    return (
      <span className={`px-3 w-[100px] justify-center py-1 text-xs font-medium rounded-md inline-flex items-center ${getStatusColor()}`}>
        {isBilled ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 mr-1 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M9 14l6-6" />
              <rect width="18" height="18" x="3" y="3" rx="2" className="animate-[pulse_2s_ease-in-out_infinite]" />
              <path d="M9 8h6M9 12h6M9 16h6" />
            </svg>
            <span className="animate-[fadeIn_1s_ease-in-out]">Facturé</span>
          </>
        ) : isCancelled ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 mr-1 animate-spin-slow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6" />
              <path d="M9 9l6 6" />
            </svg>
            <span className="animate-[fadeIn_1s_ease-in-out]">Annulé</span>
          </>
        ) : isReserved ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 mr-1 "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M20 7h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
              <circle cx="12" cy="14" r="2" />
            </svg>
            <span className="animate-[fadeIn_1s_ease-in-out]">Réservé</span>
          </>
        ) :

          isLivred ?
            (
              <>
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-1 animate-bounce"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  {/* Car body */}
                  <path d="M5 17h14v-6H5v6z" />
                  {/* Car top */}
                  <path d="M7 11V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2" />
                  {/* Wheels */}
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                  {/* Motion lines */}
                  <path d="M3 17h-2" className="animate-pulse" />
                  <path d="M23 17h-2" className="animate-pulse" />
                </svg>
                <span className="transition-opacity duration-1000">Livré</span>
              </>
            ) :

            status}
      </span>
    );
  };



  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: string }) => {
    const getPriorityColor = () => {
      switch (priority?.toLowerCase()) {
        case 'high':
        case 'haute':
          return 'bg-rose-50 text-rose-700 border border-rose-200';
        case 'medium':
        case 'moyenne':
          return 'bg-amber-50 text-amber-700 border border-amber-200';
        case 'low':
        case 'basse':
          return 'bg-sky-50 text-sky-700 border border-sky-200';
        default:
          return 'bg-slate-50 text-slate-700 border border-slate-200';
      }
    };

    return (
      <span className={`px-2.5 w-[80px] justify-center py-1 text-xs font-medium rounded-md inline-flex items-center ${getPriorityColor()}`}>
        {priority}
      </span>
    );
  };

  // Helper function to get the closest upcoming reminder
  const getClosestReminder = (rappels: any[] | undefined) => {
    if (!rappels || rappels.length === 0) return null;

    const now = new Date();
    // Filter future reminders
    const futureRappels = rappels
      .filter(rappel => new Date(rappel.RappelDate) >= now)
      .sort((a, b) => new Date(a.RappelDate).getTime() - new Date(b.RappelDate).getTime());

    // If there are future reminders, return the closest one
    if (futureRappels.length > 0) return futureRappels[0];

    // Otherwise return the most recent past reminder
    return rappels.sort((a, b) =>
      new Date(b.RappelDate).getTime() - new Date(a.RappelDate).getTime()
    )[0];
  };

  // Define our own columns directly in the component
  const internalColumns = useMemo<ColumnDef<Devis, any>[]>(() => [
    {
      id: "DevisId",
      header: () => (
        <div className="flex items-center justify-center space-x-1">
          <Hash className="w-3.5 h-3.5" />
          <span>N° Devis</span>
        </div>
      ),
      accessorKey: "DevisId",
      size: 80, // Set fixed width
      cell: ({ row }) => {
        return <div className="font-medium text-black">#{row.getValue("DevisId")}</div>;
      },
    },
    {
      id: "PriorityDevis",
      header: () => (
        <div className="flex items-center justify-center space-x-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Priorité</span>
        </div>
      ),
      accessorKey: "PriorityDevis",
      size: 100, // Set fixed width
      cell: ({ row }) => {
        const priority = row.getValue("PriorityDevis") as string;
        return <PriorityBadge priority={priority} />;
      },
    },
    {
      id: "clientName",
      header: () => (
        <div className="flex items-center justify-center space-x-1">
          <User className="w-3.5 h-3.5" />
          <span>Client</span>
        </div>
      ),
      accessorKey: "client.nomClient",
    },
    {
      id: "clientPhone",
      header: () => (
        <div className="flex items-center justify-center space-x-1">
          <Phone className="w-3.5 h-3.5" />
          <span>Téléphone</span>
        </div>
      ),
      accessorKey: "client.telClient",
    },
    {
      id: "carModel",
      header: () => (
        <div className="flex items-center justify-center space-x-1">
          <Car className="w-3.5 h-3.5" />
          <span>Modèle</span>
        </div>
      ),
      accessorKey: "carRequests[0].CarModel",
      cell: ({ row }) => {
        const model = row.original.carRequests?.[0]?.CarModel || "N/A";
        return <div>{model}</div>;
      },
    },
    {
      id: "nextReminder",
      header: () => (
        <div className="flex items-center justify-center space-x-1">
          <Bell className="w-3.5 h-3.5" />
          <span>Rappel</span>
        </div>
      ),
      accessorKey: "nextReminder",
      cell: ({ row }) => {
        const closestReminder = getClosestReminder(row.original.rappels);
        return closestReminder
          ? new Date(closestReminder.RappelDate).toLocaleDateString('fr-FR')
          : "Aucun";
      },
    },
    {
      id: "DateCreation",
      header: () => (
        <div className="flex items-center justify-center space-x-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Date</span>
        </div>
      ),
      accessorKey: "DateCreation",
      cell: ({ row }) => {
        const date = row.getValue("DateCreation") as string;
        return date ? new Date(date).toLocaleDateString('fr-FR') : "";
      },
    },
    {
      id: "StatusDevis",
      header: () => (
        <div className="flex items-center justify-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Statut</span>
        </div>
      ),
      accessorKey: "StatusDevis",
      cell: ({ row }) => {
        const status = row.getValue("StatusDevis") as string;
        return <StatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="flex items-center justify-center space-x-1">
          <Edit className="w-3.5 h-3.5" />
          <span>Modification</span>
        </div>
      ),
      cell: ({ row }) => (
        <button
          onClick={() => handleOpenSheet(row.original)}
          className="inline-flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md transition-colors"
          aria-label="Modifier"
        >
          <Edit className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs font-medium">Modifier</span>
        </button>
      ),
    }
  ], []);

  // Use external columns if provided, otherwise use internal columns
  const columns = externalColumns || internalColumns;

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
    setTableData((prevData) =>
      prevData.map((item) =>
        item.DevisId === updatedRow.DevisId ? updatedRow : item
      )
    );
  };

  return (
    <div className="w-full rounded-lg">
      {/* Main table */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-normalGrey font-oswald">
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-4 py-2 text-center text-xs font-medium text-black uppercase tracking-wider relative"
                  style={{ width: header.getSize() !== 0 ? `${header.getSize()}px` : 'auto' }}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center justify-center space-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 transition-colors ${
                  row.original.StatusDevis?.toLowerCase() !== 'annulé' && 
                  row.original.rappels?.some(rappel => {
                  const rappelDate = new Date(rappel.RappelDate!);
                  const today = new Date();
                  return rappelDate.getDate() === today.getDate() && 
                     rappelDate.getMonth() === today.getMonth() &&
                     rappelDate.getFullYear() === today.getFullYear();
                  }) ? 'bg-red-100 border' : ''
                  }`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-black whitespace-nowrap text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-sm text-center text-black"
                >
                  Aucun résultat
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive cards for smaller screens */}
      <div className="md:hidden mt-4">
        <div className="space-y-3">
          {tableData.map((row) => (
            <div key={row.DevisId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-medium text-black">N° Devis</span>
                  <p className="text-black font-medium">#{row.DevisId}</p>
                </div>
                <div>
                  {row.StatusDevis && <StatusBadge status={row.StatusDevis} />}
                </div>
              </div>

              <div className="mt-2.5 border-t border-gray-100 pt-2.5">
                <div className="grid grid-cols-2 gap-3">
                  {row.client?.nomClient && (
                    <div>
                      <div className="text-xs font-medium text-black">Client</div>
                      <p className="text-black">{row.client?.nomClient}</p>
                      <p className="text-black text-xs">{row.client?.telClient}</p>
                    </div>
                  )}

                  {row.carRequests?.[0]?.CarModel && (
                    <div>
                      <div className="text-xs font-medium text-black">Véhicule</div>
                      <p className="text-black">{row.carRequests?.[0]?.CarModel}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2.5 flex justify-between items-center border-t border-gray-100 pt-2.5">
                <div className="flex items-center">
                  {row.PriorityDevis && <PriorityBadge priority={row.PriorityDevis} />}
                  <span className="ml-2 text-xs text-black">
                    {row.DateCreation ? new Date(row.DateCreation).toLocaleDateString('fr-FR') : ''}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenSheet(row)}
                  className="inline-flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-md transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  <span className="text-xs font-medium">Modifier</span>
                </button>
              </div>
            </div>
          ))}

          {tableData.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-black">
              Aucun résultat
            </div>
          )}
        </div>
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