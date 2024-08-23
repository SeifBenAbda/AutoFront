import { z } from "zod";

export const formSchema = z.object({
    devisForm: z.object({
        clientGender:  z.string().min(5, {
            message: "Genre est requis.",
        }),
        clientType: z.string().min(5, {
            message: "Type Client est requis.",
        }),

        cin: z.string().min(8, {
            message: "Cin est requis.",
        }),
        
        nomClient: z.string().min(1, {
            message: "Nom Client est requis.",
        }),

        mtFiscale: z.string().optional(),

        telClient: z.string().min(8, {
            message: "Tel Client est requis.",
        }),

        email: z.string().email({
            message: "Email mal formé.",
        }),

        socialReason: z.string().min(1, {
            message: "Erreur Profession / Secteur Activite est requis.",
        }),

        dateOfBirth: z.date({
            message: "Date naissance est requis.",
        }),

        adresse: z.string().min(5, {
            message: "Adresse est requis.",
        }),

        ville: z.string().min(2, {
            message: "Ville est requis.",
        }),

        region: z.string().min(1, {
            message: "Region est requis.",
        }),

        postalCode: z.string().min(4, {
            message: "Code Postal est requis.",
        }),

        pays: z.string().min(2, {
            message: "Pays est requis.",
        }),

        addressMoreInfos: z.string().optional(),

        // Required fields from ClientExtraForm
        oldCar: z.string().min(1, {
            message: "Ancien Vehicule est requis.",
        }),

        carModel: z.string().min(1, {
            message: "Modèle préféré est requis.",
        }),

        motif: z.string().min(1, {
            message: "Motif est requis.",
        }),

        source: z.string().min(1, {
            message: "Source est requis.",
        }),

        payementMethod: z.string().min(1, {
            message: "Moyen de Payement est requis.",
        }),

        avancePayement: z.string().optional(),

        rp1: z.date({
            message: "Date Rappel N°1 est requis.",
        }),

        rp2: z.date({
            message: "Date Rappel N°2 est requis.",
        }),

        rp3: z.date({
            message: "Date Rappel N°3 est requis.",
        }),

        rappelNotes: z.string().optional()
    }).refine((data) => {
        // Conditional validation logic
        if (data.clientType !== "Particulier" && !data.mtFiscale) {
            return false;
        }
        return true;
    }, {
        message: "Matricule Fiscale est requis'.",
        path: ['mtFiscale'], // Specify which field to highlight the error on
    }),
});
