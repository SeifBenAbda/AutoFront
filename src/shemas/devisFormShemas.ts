import { z } from "zod";


const rappelFormSchema = z.object({
    RappelDate: z.date({
        message: "Date est requis.",
    }),
    RappelContent: z.string({
        
    }),  // Ensure this is required
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

        dateOfBirth: z.date().optional(),

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
    }).refine((data) => {
        if (data.clientType !== "Particulier" && !data.mtFiscale) {
            return false;
        }
        return true;
    }, {
        message: "Matricule Fiscale est requis pour les clients autres que 'Particulier'.",
        path: ['mtFiscale'], // Ensure the path points to the correct field
    }).refine((data)=>{
        if(data.clientType == "Particulier" && !data.dateOfBirth){
            return false;
        }
        return true ;
    },{
        message:"Date de Naissance !",
        path:['dateOfBirth']
    }),


    devisCarForm: z.object({
        OldCar: z.string().optional(),

        CarModel: z.string().min(1, {
            message: "Modèle préféré est requis.",
        }),
    }),

    devisGeneralForm: z.object({
        Motivation: z.string().min(1, {
            message: "Motif est requis.",
        }),

        Source: z.string().min(1, {
            message: "Source est requis.",
        }),

        PayementMethod: z.string().min(1, {
            message: "Moyen de Payement est requis.",
        }),

        ScheduledLivDate: z.date({
            message: "Date Livraison est requis.",
        }),
        PriorityDevis: z.enum(["Normale", "Moyenne", "Haute"], {
            message: "La priorité doit être 'Normale', 'Moyenne' ou 'Haute'.",
        }),
        /*Origin:z.enum(["Envoyé par Mail", "Au comptoire"], {
            message: "Devis Origine",
        }),*/
    }),
    rappelForm: z.array(rappelFormSchema),

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

        PhoneExpert: z.string().min(1, {
            message: "Numero de L'Expert est requis",
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
    })

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



