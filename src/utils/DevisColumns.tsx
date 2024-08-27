import { Badge } from "../@/components/ui/badge";
import { Devis } from "../types/devisTypes";
import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import phoneIcon from '../images/phone.png';
import delieveryScheduleIcon from "../images/delieverySchedule.png"
import statusIcon from '../images/status.png'
import editDevisIcon from '../images/editDevis.png'
import carIcon from '../images/car.png'


const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};


const getVariantStatus = (status : string) =>{
  switch(status){
    case "En Cours":
      return "default"
      case "Annuler":
        return "destructive"
       
        case "Facture":
          return "running"
         
     default:
      return "outline";       
  }
}

export const columns: ColumnDef<Devis>[] = [
  {
    header: 'Numero Devis',
    accessorFn: (row) => row.DevisId,
    id: 'DevisId', // add a unique id to each column for identification
  },
  {
    header: 'Date Creation',
    accessorFn: (row) => {
      const formattedDate = format(new Date(row.DateCreation), "EEEE d MMMM yyyy", {
        locale: fr,
      });

      return capitalizeFirstLetter(formattedDate);
    },
    id: 'dateCreation',
  },
  {
    header: 'Nom Client',
    accessorFn: (row) => row.client.nomClient,
    id: 'client.nomClient',
  },
  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Tel. Client</span>
        <img
          src={phoneIcon}
          alt="Status"
          className="w-6 h-6"
        />
      </div>
    ),
    accessorFn: (row) => row.client.telClient,
    id: 'client.telClient',
  },

  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Modèle de voiture</span>
        <img
          src={carIcon}
          alt="Status"
          className="w-10 h-10"
        />
      </div>
    ),
    accessorFn: (row) => row.carRequests.map(cr => cr.CarModel).join(', '),
    id: "carModels",
  },
  {
    header: 'Motif',
    accessorFn: (row) => row.Motivation,
    id: 'Motif',
  },

  

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
  {
    header: 'Dernière visite',
    accessorFn: (row) => {
      const formattedDate = format(new Date(row.client.lastVisitDate), "EEEE d MMMM yyyy", {
        locale: fr,
      });

      return capitalizeFirstLetter(formattedDate);
    },
    id: 'row.client.lastVisitDate',
  },
  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Status</span>
        <img
          src={statusIcon}
          alt="Status"
          className="w-6 h-6"
        />
      </div>
    ),
    accessorKey: 'StatusDevis',
    cell: (row) => (
      <Badge variant={getVariantStatus(row.getValue<string>())}>{row.getValue<string>()}</Badge>
    ),
    id: 'statusDevis',
  },
  {
    header: 'Créé par',
    accessorFn: (row) => row.CreatedBy,
    id: 'CreatedBy',
  },
  {
    header: () => (
      <div className="flex flex-col md:flex-row items-center justify-center p-2">
        <span className="mb-2 md:mb-0 md:mr-2">Modification</span>
        <img
          src={editDevisIcon}
          alt="Status"
          className="w-6 h-6"
        />
      </div>
    ),
    id: 'actions',
  },
];
