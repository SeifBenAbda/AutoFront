import { z } from "zod";

export const formSchema = z.object({
    form1: z.object({

        clientType: z.enum(["pp", "pm"], {
            message: "Type de Client is required.",
        }),

        cin: z.string().optional(),
        nomClient: z.string().min(10, {
            message: "Nom Client minimum 5 characters.",
        }),
        telClient: z.string().min(10, {
            message: "Erreur Tel Client",
        }),
        email: z.string().min(10, {
            message: "Erreur Email",
        }),
        socialReason: z.string().min(10, {
            message: "Erreur Profession / Secteur Activite ",
        }),
        postalCode: z.string().min(10, {
            message: "Erreur Code Postale ",
        }),
        pays: z.string().min(10, {
            message: "Erreur Pays ",
        }),
        dateOfBirth: z.date({
            message: "Erreur Date de naissance",
        }),

        


        
        
    }).refine((data) => {
        // Conditional validation logic
        if (data.clientType !== "pp" && !data.cin) {
            return false;
        }
        return true;
    }, {
        message: "Cin is required for client types other than 'pp'.",
        path: ['cin'], // Specify which field to highlight the error on
    }),
    /*
    form2: z.object({
        nomClient: z.string().min(1, "Name is required"),
    }),
    form3: z.object({
        nomClient: z.string().min(1, "Name is required"),
    }),
    */
});