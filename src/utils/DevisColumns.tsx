import { Badge } from "../@/components/ui/badge";
import { Devis, Rappel } from "../types/devisTypes";
import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';



const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getClosestUpcomingReminder = (rappels: Rappel[] | undefined): Rappel | null => {
  // Filter out reminders with undefined dates or content
  const validReminders = rappels?.filter(
    reminder => reminder.RappelDate && reminder.RappelContent
  ) || [];

  if (validReminders.length === 0) return null;

  const now = new Date().getTime();

  // Find the closest upcoming reminder
  return validReminders.reduce((closest, current) => {
    const currentDate = new Date(current.RappelDate!).getTime();
    const closestDate = closest ? new Date(closest.RappelDate!).getTime() : 0;

    if (currentDate >= now && (!closest || currentDate < closestDate)) {
      return current;
    }
    return closest;
  }, null as Rappel | null);
};

// Helper function to format reminder display data
const formatReminderDisplay = (reminder: Rappel | null) => {
  if (!reminder) return {
    display: 'Aucun rappel proche',
    date: null,
    content: null
  };

  return {
    display: `${new Date(reminder.RappelDate!).toLocaleDateString()}: ${reminder.RappelContent}`,
    date: reminder.RappelDate,
    content: reminder.RappelContent
  };
};


const getVariantStatus = (status: string) => {
  switch (status) {
    case "En Attente":
      return "default"
    case "En Cours":
      return "medium"
    case "Annuler":
      return "destructive"
      case "Réservé":
        return "reserved" ;
    case "Facturé":
      return "running"

    default:
      return "outline";
  }
}

const getVariantPriority = (status: string) => {
  switch (status) {
    case "Moyenne":
      return "medium"
    case "Haute":
      return "destructive"

    case "Normale":
      return "running"
    default:
      return "normal";
  }
}

export const columns: ColumnDef<Devis>[] = [
  {
    header: 'Numéro Devis',
    accessorFn: (row) => row.DevisId,
    id: 'DevisId', // add a unique id to each column for identification
  },
  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Priorité</span>
        <img
          src='/images/prioritize.png'
          alt="PriorityDevis"
          className="w-6 h-6"
        />
      </div>
    ),
    accessorKey: 'PriorityDevis',
    cell: (row) => (
      <Badge className="p-2 w-[80%] text-center justify-center" variant={getVariantPriority(row.getValue<string>())}>{row.getValue<string>()}</Badge>
    ),
    id: 'PriorityDevis',
  },

  
  {
    header: 'Date Création',
    accessorFn: (row) => {
      const formattedDate = format(new Date(row.DateCreation!), "EEEE d MMMM yyyy", {
        locale: fr,
      });

      return capitalizeFirstLetter(formattedDate);
    },
    id: 'DateCreation',
  },
  
  {
    header: 'Nom Client',
    accessorFn: (row) => row.client!.nomClient,
    id: 'client.nomClient',
  },
  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Tél. Client</span>
        <img
          src='/images/phone.png'
          alt="Phone"
          className="w-6 h-6"
        />
      </div>
    ),
    accessorFn: (row) => row.client!.telClient,
    id: 'client.telClient',
  },

  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Modèle de voiture</span>
        <img
          src='/images/car.png'
          alt="car"
          className="w-10 h-10"
        />
      </div>
    ),
    accessorFn: (row) => row.carRequests!.map(cr => cr.CarModel).join(', '),
    id: "carModels",
  },
  /*
  {
    header: 'Motif',
    accessorFn: (row) => row.Motivation,
    id: 'Motif',
  },
  */

  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Rappel Prochain</span>
        <img
          src='/images/reminder_new.png'
          alt="Reminder"
          className="w-8 h-8"
        />
      </div>
    ),
    accessorFn: (row: Devis) => {
      const closestReminder = getClosestUpcomingReminder(row.rappels);
      return formatReminderDisplay(closestReminder).display;
    },
    id: "nextReminder",
  },


  /*
  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Date Livraison prévue</span>
        <img
          src={delieveryScheduleIcon}
          alt="Delivery Schedule"
          className="w-10 h-10"
        />
      </div>
    ),
    accessorFn: (row) => {
      if (row.ScheduledLivDate == null) {
        return "Non indiqué"
      }
      const formattedDate = format(new Date(row.ScheduledLivDate), "EEEE d MMMM yyyy", {
        locale: fr,
      });

      return capitalizeFirstLetter(formattedDate);
    },
    id: 'scheduledLivrDate',
  },
  */

  /*
  {
    header: 'Dernière visite',
    accessorFn: (row) => {
      const formattedDate = format(new Date(row.client!.lastVisitDate!), "EEEE d MMMM yyyy", {
        locale: fr,
      });

      return capitalizeFirstLetter(formattedDate);
    },
    id: 'row.client.lastVisitDate',
  },
  {
    header: 'Créé par',
    accessorFn: (row) => row.CreatedBy,
    id: 'CreatedBy',
  },
  */
  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Status</span>
        <img
          src='/images/status.png'
          alt="Status"
          className="w-6 h-6"
        />
      </div>
    ),
    accessorKey: 'StatusDevis',
    cell: (row) => (
      <Badge className="p-2 w-[80%] text-center justify-center" variant={getVariantStatus(row.getValue<string>())}>{row.getValue<string>()}</Badge>
    ),
    id: 'statusDevis',
  },

  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Modification</span>
        <img
          src='/images/editDevis.png'
          alt="Edit"
          className="w-6 h-6"
        />
      </div>
    ),
    id: 'actions',
  },
  /*
  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Supprimer</span>
        <img
          src={deleteIcon}
          alt="Delete"
          className="w-6 h-6"
        />
      </div>
    ),
    id: 'delete',
  },
  */
];
