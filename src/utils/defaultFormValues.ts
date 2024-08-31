import { CarRequest, Client, Devis } from "@/types/devisTypes";

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
    //DevisId: 0,
    clientId: 0,
    ScheduledLivDate: undefined
};


export const defaultFormCarDevis : CarRequest = {
    // Client Extra Form
    OldCar: "",
    CarModel: "",
    CarRequestId: 0,
    RequestDate: new Date(),
    RequestBy: "",
    CarColor: "",
    CarNotes: "",
    isCanceled: false,
    DevisId: 0,
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

export const defaultRappelForm = {
    // Client Rappel Form
    rp1: new Date(),
    rp2: new Date(),
    rp3: new Date(),
    rappelNotes: "",
}
