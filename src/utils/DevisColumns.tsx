import { ColumnDef } from "@tanstack/react-table";
import { Devis } from "@/types/devisTypes";
import { CalendarClock, Car, FileText, Hash, Phone, Star, User } from "lucide-react";

// Status badge component for DevisColumns
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch(status?.toLowerCase()) {
      case 'facture':
      case 'facturé':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'completed':
      case 'terminé':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'pending':
      case 'en attente':
        return 'bg-amber-50 text-amber-800 border border-amber-300';
      case 'cancelled':
      case 'annulé':
        return 'bg-rose-50 text-rose-800 border border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-300';
    }
  };
  
  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getStatusColor()}`}>
      {status}
    </span>
  );
};

// Priority badge component for DevisColumns
const PriorityBadge = ({ priority }: { priority: string }) => {
  const getPriorityColor = () => {
    switch(priority?.toLowerCase()) {
      case 'high':
      case 'haute':
        return 'bg-rose-50 text-rose-700 border border-rose-300';
      case 'medium':
      case 'moyenne':
        return 'bg-amber-50 text-amber-700 border border-amber-300';
      case 'low':
      case 'basse':
        return 'bg-sky-50 text-sky-700 border border-sky-300';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-300';
    }
  };
  
  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getPriorityColor()}`}>
      {priority}
    </span>
  );
};

export const devisColumns: ColumnDef<Devis, any>[] = [
  {
    id: "DevisId",
    header: () => (
      <div className="flex items-center space-x-1">
        <Hash size={14} className="text-slate-500" />
        <span>Devis</span>
      </div>
    ),
    accessorKey: "DevisId",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("DevisId")}</div>;
    },
  },
  {
    id: "createdBy",
    header: () => (
      <div className="flex items-center space-x-1">
        <FileText size={14} className="text-slate-500" />
        <span>Créé par</span>
      </div>
    ),
    accessorKey: "createdBy",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("createdBy")}</div>;
    },
  },
  {
    id: "PriorityDevis",
    header: () => (
      <div className="flex items-center space-x-1">
        <Star size={14} className="text-slate-500" />
        <span>Priorité</span>
      </div>
    ),
    accessorKey: "PriorityDevis",
    cell: ({ row }) => {
      const priority = row.getValue("PriorityDevis") as string;
      return <PriorityBadge priority={priority} />;
    },
  },
  {
    id: "client.nomClient",
    header: () => (
      <div className="flex items-center space-x-1">
        <User size={14} className="text-slate-500" />
        <span>Client</span>
      </div>
    ),
    accessorKey: "client.nomClient",
  },
  {
    id: "client.telClient",
    header: () => (
      <div className="flex items-center space-x-1">
        <Phone size={14} className="text-slate-500" />
        <span>Téléphone</span>
      </div>
    ),
    accessorKey: "client.telClient",
  },
  {
    id: "carModels",
    header: () => (
      <div className="flex items-center space-x-1">
        <Car size={14} className="text-slate-500" />
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
      <div className="flex items-center space-x-1">
        <CalendarClock size={14} className="text-slate-500" />
        <span>Rappel</span>
      </div>
    ),
    accessorKey: "nextReminder",
    cell: ({ row }) => {
      const date = (() => {
        // If there are no reminders, return null
        if (!row.original.rappels || row.original.rappels.length === 0) {
          return null;
        }
        
        const now = new Date();
        // Filter future reminders and sort them by date (closest first)
        const futureReminders = row.original.rappels
          .filter(reminder => reminder.RappelDate && new Date(reminder.RappelDate) >= now)
          .sort((a, b) => {
            const dateA = a.RappelDate ? new Date(a.RappelDate).getTime() : 0;
            const dateB = b.RappelDate ? new Date(b.RappelDate).getTime() : 0;
            return dateA - dateB;
          });
          
        // Return the closest future reminder or null if none exist
        return futureReminders.length > 0 ? futureReminders[0].RappelDate : null;
      })();
      return date ? new Date(date).toLocaleDateString('fr-FR') : "Aucun";
    },
  },
  {
    id: "DateCreation",
    header: () => (
      <div className="flex items-center space-x-1">
        <CalendarClock size={14} className="text-slate-500" />
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
    id: "statusDevis",
    header: () => (
      <div className="flex items-center space-x-1">
        <FileText size={14} className="text-slate-500" />
        <span>Statut</span>
      </div>
    ),
    accessorKey: "StatusDevis",
    cell: ({ row }) => {
      const status = row.getValue("StatusDevis") as string;
      return <StatusBadge status={status} />;
    },
  },
  // Do not include the "Modification" column here as it's added separately in TableData component
];

export default devisColumns;
