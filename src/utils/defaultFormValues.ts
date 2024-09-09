import { CarRequest, Client, Devis, ItemRequest, Rappel } from "@/types/devisTypes";

// src/defaultFormValues.ts
export const defaultFormDevisGeneral : Devis = {
    // Client Extra Form
    Motivation: "", // assuming this is a string; update if necessary
    Source: "", // assuming this is a string; update if necessary
    PayementMethod: "",
    CreatedBy: "",
    DateCreation: new Date(),
    UpdatedBy: "",
    UpdatedAt: new Date(),
    TypeDevis: "",
    StatusDevis: "En Attente",
    PriorityDevis: "Normale",
    isGarantie: false,
    numBonCommande: "",
    client: undefined,
    itemRequests: [],
    carRequests: [],
    rappels:[],
    //DevisId: 0,
    clientId: 0,
    ScheduledLivDate: undefined
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
};

export const defaultFormClient : Client = {
    // Client Info Form
    nomClient: "",
    telClient: "",
    email: "",
    socialReason: "",
    clientGender: "Monsieur", // Default value for enum "Monsieur" or "Madame"
    clientType: "Particulier", // Default value for enum "Particulier" or "Entreprise"



    // Client Address Form
    adresse: "",
    ville: "",
    region: "", // assuming this is a string; update if necessary
    postalCode: "",
    pays: "",
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


