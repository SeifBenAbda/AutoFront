import { Devis } from "../types/devisTypes";


export const state = {
  databasesAccess: [] as string[],
  databaseName: "" as string,
};

const isModificationFactureCorrect = (devis: Devis): boolean => {
        if(!devis.devisFacture.FactureNumero) {
            return false;
        }else{
            if (devis.devisFacture.DateLivraison && devis.devisFacture.DateLivraison < new Date()) {
                return false;
            }
            if (devis.devisFacture.FactureNumero && devis.devisFacture.FactureNumero.length < 1) {
                return false;
            }
        }
    return true;
}


const isModificationReservationCorrect = (devis: Devis): boolean => {
    console.log("Client Social Reason: ", devis.client?.socialReason);
    if (!devis.devisReserved.DateReservation || !devis.carRequests[0].CarColor || devis.carRequests[0].CarColor === "") {
        return false;
    }
    return true;
}

const isModificationLivrerCorrect = (devis: Devis): boolean => {
    if(devis.devisFacture===null || devis.devisFacture?.DateLivraison===null){
        return false;
    }
    return true;
}


const totalTTCMissing = (devis: Devis): boolean => {
    if(devis.devisPayementDetails.TotalTTC === null || devis.devisPayementDetails.TotalTTC === undefined || (typeof devis.devisPayementDetails.TotalTTC === 'string' && devis.devisPayementDetails.TotalTTC === "0") || (typeof devis.devisPayementDetails.TotalTTC === 'string' && devis.devisPayementDetails.TotalTTC === "")){
        return true;
    }
    return false;
}


const bankDetailsMissing = (devis: Devis): boolean => {
    if((devis.devisPayementDetails.BankAndLeasing === "" || devis.devisPayementDetails.BankRegion==="" ) && devis.devisPayementDetails.PaymentMethod=== "Banque"){
        return true;
    }else if((devis.devisPayementDetails.BankAndLeasing === "" || devis.devisPayementDetails.BankRegion==="" ) && devis.devisPayementDetails.PaymentMethod=== "Leasing"){
        return true;
    }
    return false;
}

const isCanceledDevisNotFinished = (devis: Devis): boolean => {
    if(devis.StatusDevis==="Annulé" && (devis.ReasonAnnulation==="" || devis.ReasonAnnulation===undefined || devis.ReasonAnnulation===null)){ 
        return true;
    }
    return false;
}

const bordoreauxMissing = (devis: Devis): boolean => {
    if(devis.devisFacture === null || devis.devisFacture === undefined) {
        console.log("Devis Facture is null or undefined");
        return false;
    }
    if(devis.devisFacture.StatutBRD!==undefined && (devis.devisFacture.DateBRD===null || devis.devisFacture.DateBRD===undefined || devis.devisFacture.BRDNumero===null || devis.devisFacture.BRDNumero===undefined || devis.devisFacture.BRDNumero==="") ){
       console.log("Statut BRD: ", devis.devisFacture.StatutBRD);
        return true;
    }
    return false;
}


const dateRappelsIncorrect = (devis: Devis): boolean => {
    if (devis.rappels && Array.isArray(devis.rappels) && devis.rappels.length > 1) {
        for (let i = 0; i < devis.rappels.length - 1; i++) {
            const currentDate = new Date(devis.rappels[i].RappelDate!);
            const nextDate = new Date(devis.rappels[i + 1].RappelDate!);

            if (currentDate >= nextDate) {
                    return true; // Found a date that's not in chronological order
            }
        }
    }
    return false;
}


export const getModificationErros = (devis : Devis): string => {
    if(isCanceledDevisNotFinished(devis)){
        return "Erreur dans l'annulation du devis !";
    }else if(devis.StatusDevis != "Annulé"){
        if(dateRappelsIncorrect(devis)){
            return "les rappels doivent se succéder";
        }
        if(totalTTCMissing(devis)){
            return "Le montant total TTC est manquant !";
        }
        if(bordoreauxMissing(devis)){
            return "Le bordereau est manquant !";
        }
        if(bankDetailsMissing(devis)){
            return "Les détails de la banque/leasing sont manquants !";
        }
        if(devis.StatusDevis === "Facturé"){
            if(!isModificationFactureCorrect(devis)){
                return "Erreur dans les modifications de la facture";
            }
            return "";
        }
        if(devis.StatusDevis === "Réservé"){
            if(!isModificationReservationCorrect(devis)){
                return "Erreur dans les modifications de la réservation";
            }
            return "";
        }
        
        if(devis.StatusDevis === "Livré"){
    
            if(!isModificationLivrerCorrect(devis)){
                return "Erreur dans les modifications de la livraison";
            }
            return "";
        }
    }
    return "";
}


export const isErrorBanqueSelection = (banque: string): boolean => {
    if(banque === ""){
        return true;
    }
    return false;
}

export const getErrorBanqueSelection = (): string => {
     return "La banque n'est pas encore choisie !";
}