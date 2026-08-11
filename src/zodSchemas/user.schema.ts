import { z } from "zod";
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const userInfo = z.object({
    apellido: z.string().min(1, { message: "l'Appellido est obligatoire" }),
    token : z.string().min(1, { message: "Le token est obligatoire" })
})

export const updateUserFile = z.object({
        token: z.string({ message: "Le token est obligatoire et doit être une chaîne de caractères", }).min(1, { message: "Le token ne peut pas être vide" }),
        updateData: z.object({
                apellido: z.string({ message: "Le apellido doit être une chaîne de caractères", }).optional(),
                name: z.string({ message: "Le nom doit être une chaîne de caractères", }).optional(),
                subscription: z.object({
                    plan: z.enum(["trimestriel", "carte"], { message: "Le type d'abonnement doit être 'trimestriel' ou 'carte'", }).optional(),
                    startDate: z.preprocess((value) => value === "" ? undefined : value, z.coerce.date({ message: "La date de début n'est pas valide", }).optional()),
                    endDate: z.preprocess((value) => value === "" ? undefined : value, z.coerce.date({ message: "La date de fin n'est pas valide", }).optional()),
                    pointsLeft: z.number({ message: "Le nombre de points doit être un nombre", }).optional(),
                    amount2Pay: z.number({ message: "Le montant à payer doit être un nombre", }).optional(),
            }).optional(),
        }),
})

export const updateUserInfo = z.object({
    token: z.string().min(1, { message: "Le token est obligatoire" }),
    apellido: z.string().min(1, { message: "l'Appellido est obligatoire" }),
    password: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères" }),
    email: z.email({ message: "L'email est obligatoire" }),
})