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


export const getModificationErros = (devis : Devis): string => {
    if(devis.StatusDevis === "Facturé"){
        if(!isModificationFactureCorrect(devis)){
            return "Erreur dans les modifications de la facture";
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