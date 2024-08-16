import { z } from "zod";

export const formSchema = z.object({
    nomClient: z.string().min(5, {
        message: "Nom Client minimum 5 characters.",
    }),
});