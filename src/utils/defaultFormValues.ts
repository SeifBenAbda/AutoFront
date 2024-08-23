// src/defaultFormValues.ts
export const defaultDevisFormValues = {
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

    // Client Extra Form
    oldCar: "",
    carModel: "", // assuming this is a string; update if necessary
    motif: "", // assuming this is a string; update if necessary
    source: "", // assuming this is a string; update if necessary
    payementMethod: "", // assuming this is a string; update if necessary
    avancePayement: "",

    // Client Rappel Form
    rp1: new Date(),
    rp2: new Date(),
    rp3: new Date(),
    rappelNotes: "",
};
