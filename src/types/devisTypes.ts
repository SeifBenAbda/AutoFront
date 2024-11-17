
export interface Client {
  id?:number,
  clientGender:string,
  clientType:string,
  cin:string,
  nomClient:string,
  mtFiscale:string | undefined,
  telClient:string,
  telClient2:string,
  email:string,
  socialReason:string,
  dateOfBirth:Date | undefined,
  adresse:string,
  ville:string,
  region:string,
  postalCode:string,
  pays:string,
  addressMoreInfos:string,
  userCreation:string,
  lastVisitDate:Date | undefined
}

// Define the ItemRequest interface
export interface ItemRequest {
  ItemRequestId?: number;
  ItemId: string;
  RequestDate: Date | undefined , 
  RequestedBy:string,
  Quantity:string,
  isWaranty:boolean,
  isCancled:boolean,
  Ligne?:number | undefined,
  DevisId?:number,
  OldCar?:string | undefined , 
  Immatriculation:string | undefined
  // Add other ItemRequest properties here
}


export interface AccidentDetails{
  AccidentDetailId?:number,
  DevisId?:number,
  Assurance:string | undefined,
  NomExpert:string,
  PhoneExpert:string,
  MailExpert:string,
  TypeDossier:string | undefined , 
  CommentOne?:string | undefined,
  CommentTwo?:string | undefined,
  CommentThree?:string | undefined
}

// Define the CarRequest interface
export interface CarRequest {
  CarRequestId?: number;
  RequestDate: Date | undefined,
  RequestBy: string,
  CarModel: string,
  OldCar: string | undefined,
  CarColor: string,
  CarNotes: string,
  isCanceled: boolean,
  DevisId?: number,
  Immatriculation:string | undefined
}

// Define the Devis interface
export interface Devis {
  DevisId?: number;
  clientId: number;
  CreatedBy:string,
  DateCreation:string | Date | undefined,
  Motivation:string,
  Source:string,
  UpdatedBy:string,
  UpdatedAt: Date | undefined,
  TypeDevis:string | undefined,
  StatusDevis:string | undefined,
  PriorityDevis:"Normale" | "Moyenne" | "Haute",
  isGarantie:boolean | undefined,
  ReasonAnnulation : string | undefined , 
  Comments : string | undefined ,
  Responsable : string | undefined ,
  ResponsableNum : string | undefined ,
  client: Client | undefined; // The client associated with the Devis
  itemRequests: ItemRequest[]; // Array of ItemRequests associated with the Devis
  carRequests: CarRequest[]; // Array of CarRequests associated with the Devis
  rappels:Rappel[];
  devisPayementDetails:DevisPayementDetails; 
  devisFacture:DevisFacture;
  devisReserved:DevisReserved;
}



export interface Rappel{
  RappelId? : number , 
  ClientId?: number , 
  DevisId?: number , 
  RappelDate:Date | undefined, 
  CreatedBy : string
  CreatedAt: Date | undefined , 
  UpdatedBy : string | undefined , 
  UpdatedAt : Date | undefined , 
  RappelContent:string | undefined
}


export interface DevisFacture {
  devisId?: number;
  DateFacturation: Date;
  FactureNumero: string;
  StatutBRD: boolean;
  DateBRD: Date | undefined;
  Rendezvous: Date | undefined;
  isLivraison: boolean;
  DateLivraison: Date | undefined;
}

export interface DevisReserved {
  devisId?: number;
  DateReservation: Date | null;
  NumBonCommande: string;
}

export interface DevisPayementDetails {
  devisId?: number;
  TotalTTC: number | null;
  TotalAPRem: number | null;
  BankAndLeasing: string;
  BankRegion: string;
  PaymentMethod:"Banque" | "Leasing" |  "Comptant" | "FCR" ,
}




export enum HttpStatus {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}