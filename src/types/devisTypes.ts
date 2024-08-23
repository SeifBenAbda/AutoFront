
export interface Client {
  id: number;
  clientGender:string,
  clientType:string,
  cin:string,
  nomClient:string,
  mtFiscale:string | undefined,
  telClient:string,
  email:string,
  socialReason:string,
  dateOfBirth:Date,
  adresse:string,
  ville:string,
  region:string,
  postalCode:string,
  pays:string,
  addressMoreInfos:string,
  userCreation:string,
  lastVisitDate:Date
}

// Define the ItemRequest interface
export interface ItemRequest {
  itemRequestId: number;
  itemId: string;
  requestDate: Date | undefined , 
  requestedBy:string,
  Quantity:string,
  isWaranty:boolean,
  isCancled:boolean,
  Ligne:number,
  DevisId:number
  // Add other ItemRequest properties here
}

// Define the CarRequest interface
export interface CarRequest {
  CarRequestId: number;
  RequestDate: Date | undefined,
  RequestBy: string,
  CarModel: string,
  OldCar: string | undefined,
  CarColor: string,
  CarNotes: string,
  isCanceled: boolean,
  DevisId: number
}

// Define the Devis interface
export interface Devis {
  DevisId: number;
  clientId: number;
  CreatedBy:string,
  DateCreation:Date,
  payementMethod:string,
  motivation:string,
  source:string,
  updatedBy:string,
  updatedAt: Date | undefined,
  typeDevis:string,
  StatusDevis:string,
  isGarantie:boolean,
  numBonCommande:string,  
  priorityDevis:string,
  ScheduledLivDate:Date | undefined,
  client: Client; // The client associated with the Devis
  itemRequests: ItemRequest[]; // Array of ItemRequests associated with the Devis
  carRequests: CarRequest[]; // Array of CarRequests associated with the Devis
}
