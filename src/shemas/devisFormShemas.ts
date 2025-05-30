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
        clientGender: z.string().trim().min(5, {
            message: "Genre est requis.",
        }),
        clientType: z.string().trim().min(1, {
            message: "Type de Client is required.",
        }),
        cin: z.string().trim().optional(),
        nomClient: z.string().trim().min(1, {
            message: "Nom Client est requis.",
        }),
        mtFiscale: z.string().trim().optional(),
        telClient: z.string().trim().max(8)
            .refine((val) => {
                if (!val) return false;
                const numVal = parseInt(val);
                return !isNaN(numVal) && val.length >= 8 && numVal > 11111111;
            }, {
                message: "Numéro de téléphone invalide ou requis",
            }),
        telClient2: z.string().trim().max(8)
            .optional()
            .refine((val) => {
                if (!val) return true;
                const numVal = parseInt(val);
                return !isNaN(numVal) && numVal > 11111111;
            }, {
                message: "Numéro de téléphone invalide",
            }),
        email: z.string().trim().optional(),
        socialReason: z.string().trim().optional(),
        dateOfBirth: z.date().optional(),
        adresse: z.string().trim().optional(),
        ville: z.string().trim().optional(),
        region: z.string().trim().min(1, {
            message: "Region est requis.",
        }),
        postalCode: z.string().trim().optional(),
        pays: z.string().trim().min(2, {
            message: "Pays est requis.",
        }),
        addressMoreInfos: z.string().trim().optional(),
    }),

    devisCarForm: z.object({
        OldCar: z.string().trim().optional(),
        CarModel: z.string().trim().min(1, {
            message: "Modèle préféré est requis.",
        }),
    }),

    devisGeneralForm: z.object({
        Motivation: z.string().trim().optional(),
        Source: z.string().trim().min(1, {
            message: "Source est requis.",
        }),
        PriorityDevis: z.enum(["Normale", "Moyenne", "Haute"], {
            message: "La priorité doit être 'Normale', 'Moyenne' ou 'Haute'.",
        }),
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
        OldCar: z.string().trim().min(1,{
            message:"Voiture Ancienne"
        }),
        Immatriculation:z.string().trim().min(1, {
            message: "Immatriculation",
        }),
    }),

    itemRequests: z.array(itemSchema),

    accidentDetails: z.object({
        NomExpert: z.string().trim().min(1,{message:"Nom de L'Expert est requis"}),
        MailExpert: z.string().trim().optional(),
        PhoneExpert: z.string().trim()
            .min(1, {
                message: "Numéro de L'Expert est requis",
            })
            .refine((val) => {
                const numVal = parseInt(val);
                return !isNaN(numVal) && numVal > 11111111;
            }, {
                message: "Numéro de téléphone invalide",
            }),
        CommentOne: z.string().trim().min(10,{
            message: "Commentaire de L'Expert 1",
        }),
        CommentTwo: z.string().trim().min(10, {
            message: "Commentaire de L'Expert 2",
        }),
        CommentThree: z.string().trim().min(10, {
            message: "Commentaire de L'Expert 3",
        }),
        Assurance:z.string().trim().min(1,{message:"Assurance"}),
        TypeDossier:z.enum(["Atelier Mecanique", "Magasin", "Carosserie"], {
            message: "Type de Devis",
        }),
    }),

    devisPayementForm: z.discriminatedUnion("PaymentMethod", [
        z.object({
          PaymentMethod: z.enum(["Banque", "Leasing"]),
          TotalTTC: z.number().nullable().optional(),
          TotalAPRem: z.number().nullable().optional(),
          BankRegion: z.string().trim().optional(),
          BankAndLeasing: z.string().trim().optional(),
        }).strict(),
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



