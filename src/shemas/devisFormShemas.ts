import { z } from "zod";


const rappelFormSchema = z.object({
    RappelDate: z.date({
        message: "Date est requis.",
    }),
    RappelContent: z.string().optional(),  // Ensure this is required
});

const itemSchema = z.object({
    ItemId: z.string().min(1, "Item is required"), // Backend will supply this
    Quantity: z.string().min(1, "Quantity is required"),
  });

export const devisSchema = z.object({
    clientForm: z.object({
        clientGender: z.string().min(5, {
            message: "Genre est requis.",
        }),
        clientType: z.string().min(1, {
            message: "Type de Client is required.",
        }),

        cin: z.string().optional(),

        nomClient: z.string().min(1, {
            message: "Nom Client est requis.",
        }),

        mtFiscale: z.string().optional(),

        telClient: z.string().max(8)
            .refine((val) => {
                if (!val) return false;
                const numVal = parseInt(val);
                return !isNaN(numVal) && val.length >= 8 && numVal > 11111111;
            }, {
                message: "Numéro de téléphone invalide ou requis",
            }),

        telClient2: z.string().max(8)
            .optional()
            .refine((val) => {
                if (!val) return true;
                const numVal = parseInt(val);
                return !isNaN(numVal) && numVal > 11111111;
            }, {
                message: "Numéro de téléphone invalide",
            }),

        email: z.string().optional(),

        socialReason: z.string().optional(),

        dateOfBirth: z.date().optional(),

        adresse: z.string().optional(),

        ville: z.string().optional(),

        region: z.string().min(1, {
            message: "Region est requis.",
        }),

        postalCode: z.string().optional(),

        pays: z.string().min(2, {
            message: "Pays est requis.",
        }),

        addressMoreInfos: z.string().optional(),
    }),

    /*
    .refine((data)=>{
        if(data.clientType == "Particulier" && !data.dateOfBirth){
            return false;
        }
        return true ;
    },{
        message:"Date de Naissance !",
        path:['dateOfBirth']
    }),
    */


    devisCarForm: z.object({
        OldCar: z.string().optional(),

        CarModel: z.string().min(1, {
            message: "Modèle préféré est requis.",
        }),
    }),


      devisGeneralForm: z.object({
        Motivation: z.string().optional(),

        Source: z.string().min(1, {
            message: "Source est requis.",
        }),
        
        PriorityDevis: z.enum(["Normale", "Moyenne", "Haute"], {
            message: "La priorité doit être 'Normale', 'Moyenne' ou 'Haute'.",
        }),
        /*Origin:z.enum(["Envoyé par Mail", "Au comptoire"], {
            message: "Devis Origine",
        }),*/
    }),
    rappelForm: z.array(rappelFormSchema)
    .refine(
        (data) => {
            if (data.length === 0) return true;
            const today = new Date();
            const firstDate = data[0].RappelDate;
            return today.toDateString() !== firstDate.toDateString();
        },
        {
            message: "Le premier rappel ne peut pas être aujourd'hui",
            path: ["rappelForm"]
        }
    ),

    itemChangeForm: z.object({
        OldCar: z.string().min(1,{
            message:"Voiture Ancienne"
        }),

        Immatriculation:z.string().min(1, {
            message: "Immatriculation",
        }),
    }),

    itemRequests: z.array(itemSchema),

    accidentDetails : z.object({
        NomExpert: z.string().min(1,{message:"Nom de L'Expert est requis"}),

        MailExpert: z.string().optional(),

        PhoneExpert: z.string()
            .min(1, {
                message: "Numéro de L'Expert est requis",
            })
            .refine((val) => {
                const numVal = parseInt(val);
                return !isNaN(numVal) && numVal > 11111111;
            }, {
                message: "Numéro de téléphone invalide",
            }),

        CommentOne: z.string().min(10,{
            message: "Commentaire de L'Expert 1",
        }),
        CommentTwo: z.string().min(10, {
            message: "Commentaire de L'Expert 2",
        }),
        CommentThree: z.string().min(10, {
            message: "Commentaire de L'Expert 3",
        }),
        Assurance:z.string().min(1,{message:"Assurance"}),
        TypeDossier:z.enum(["Atelier Mecanique", "Magasin", "Carosserie"], {
            message: "Type de Devis",
        }),
    }),

     devisPayementForm : z.discriminatedUnion("PaymentMethod", [
        // For Bank and Leasing
        z.object({
          PaymentMethod: z.enum(["Banque", "Leasing"]),
          TotalTTC: z.number().nullable().optional(),
          TotalAPRem: z.number().nullable().optional(),
          BankRegion: z.string().optional(),
          BankAndLeasing: z.string().optional(),
        }).strict(), // Add .strict() here too
      
        // For Comptant and FCR
        z.object({
          PaymentMethod: z.enum(["Comptant", "FCR"]),
          TotalTTC: z.number().nullable().optional(),
          TotalAPRem: z.number().nullable().optional(),
        }).strict(),
      ])

});

export const DevisFactureSchema = z.object({
    DateFacturation: z.date().optional(),
    FactureNumero: z.string(),
    StatutBRD: z.boolean(),
    DateBRD: z.date(),
    Rendezvous: z.date(),
    isLivraison: z.boolean(),
    DateLivraison: z.date(),
});

export const DevisReservedSchema = z.object({
    devisId: z.number(),
    DateReservation: z.date(),
    NumBonCommande: z.string().max(20),
});




export const devisSchemaForCar = devisSchema.omit({
    accidentDetails: true,
    itemRequests:true,
    itemChangeForm:true
});

export const devisSchemaForItems = devisSchema.omit({
    accidentDetails: true,
    devisGeneralForm:true,
    devisCarForm:true,
    
});



