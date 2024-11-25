import { CarRequest, Client, Devis, DevisFacture, DevisPayementDetails, DevisReserved, ItemRequest, Rappel } from "@/types/devisTypes";


export const defaultFormPayementDetails : DevisPayementDetails = {
    TotalTTC: 0,
    TotalAPRem: 0,
    BankAndLeasing: "",
    BankRegion: "",
    PaymentMethod: "Comptant"
}


export const defaultFormCarDevisFacture : DevisFacture = {
    DateFacturation: new Date(),
    FactureNumero: "",
    StatutBRD: false,
    DateBRD: new Date(),
    Rendezvous: new Date(),
    isLivraison: false,
    DateLivraison: new Date(),
    BRDNumero: ""
}

export const defaultFormDevisReserved : DevisReserved = {
    DateReservation: null,
    NumBonCommande: ""
}


// src/defaultFormValues.ts
export const defaultFormDevisGeneral : Devis = {
    // Client Extra Form
    Motivation: "", // assuming this is a string; update if necessary
    Source: "", // assuming this is a string; update if necessary
    CreatedBy: "",
    DateCreation: new Date(),
    UpdatedBy: "",
    UpdatedAt: new Date(),
    TypeDevis: "",
    StatusDevis: "En Cours",
    PriorityDevis: "Normale",
    isGarantie: false,
    client: undefined,
    ReasonAnnulation: undefined,
    Comments: undefined,
    itemRequests: [],
    carRequests: [],
    rappels: [],
    //DevisId: 0,
    clientId: 0,
    Responsable: undefined,
    ResponsableNum: undefined,
    devisPayementDetails: { ...defaultFormPayementDetails },
    devisFacture: { ...defaultFormCarDevisFacture },
    devisReserved: { ...defaultFormDevisReserved }
};


export const defaultFormCarDevis : CarRequest = {
    // Client Extra Form
    OldCar: "",
    CarModel: "",
    RequestDate: new Date(),
    RequestBy: "",
    CarColor: "",
    CarNotes: "",
    isCanceled: false,
    Immatriculation:undefined
};

export const defaultFormClient : Client = {
    // Client Info Form
    nomClient: "",
    telClient: "",
    telClient2: "",
    email: "",
    socialReason: "",
    clientGender: "Monsieur", // Default value for enum "Monsieur" or "Madame"
    clientType: "Particulier", // Default value for enum "Particulier" or "Entreprise"



    // Client Address Form
    adresse: "",
    ville: "",
    region: "", // assuming this is a string; update if necessary
    postalCode: "",
    pays: "Tunisie",
    addressMoreInfos: "",
    
    cin: "",
    mtFiscale: "",
    dateOfBirth: undefined,
    userCreation: "",
    lastVisitDate: new Date()
}

export const defaultRappelForm: Rappel = {
    RappelDate: new Date(),
    CreatedBy: "",
    CreatedAt: new Date(),
    UpdatedBy: "",
    UpdatedAt: new Date(),
    RappelContent: ""
};

export const defaultRappelList = [
    { ...defaultRappelForm },
    { ...defaultRappelForm },
    { ...defaultRappelForm }
];


export const defaultItemRequestForm : ItemRequest = {
    ItemId: "Hey",
    RequestDate: new Date(),
    RequestedBy: "",
    Quantity: "",
    isWaranty: false,
    isCancled: false,
    Ligne: 0,
    Immatriculation: undefined
}

export const defaultGeneralItemChnageForm = {
    OldCar:"",
    Immatriculation:""
};


export const defaultItemRequestList = [
  
];


