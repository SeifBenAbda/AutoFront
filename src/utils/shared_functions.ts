import { Devis } from "../types/devisTypes";


export const databaseName = "AutoPro_Platform_Testing";

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
    if (devis.devisReserved.DateReservation && devis.devisReserved.DateReservation < new Date()) {
        return false;
    }
    return true;
}

const isModificationLivrerCorrect = (devis: Devis): boolean => {
    if(devis.devisFacture===null || devis.devisFacture?.DateLivraison===null){
        return false;
    }
    if (devis.devisFacture.DateLivraison) {
        const deliveryDate = new Date(devis.devisFacture.DateLivraison);
        deliveryDate.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (deliveryDate < today) {
            return false;
        }
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
    }
    return false;
}

const isCanceledDevisNotFinished = (devis: Devis): boolean => {
    if(devis.StatusDevis==="Annulé" && devis.ReasonAnnulation===""){ 
        return false;
    }
    return true;
}

export const getModificationErros = (devis : Devis): string => {
    if(!isCanceledDevisNotFinished(devis)){
        return "Erreur dans l'annulation du devis !";
    }else if(devis.StatusDevis != "Annulé"){
        if(totalTTCMissing(devis)){
            return "Le montant total TTC est manquant !";
        }
        if(bankDetailsMissing(devis)){
            return "Les détails de la banque sont manquants !";
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