import { z } from "zod";
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const addStudentSchema = z.object({
    apellido: z.string().optional(),
    name: z.string().min(1, { message: "Le nom est obligatoire" }),
    subscriptionType: z.string().min(1, { message: "l'abonnement est obligatoire" }),
    paymentStatus: z.boolean(),
    amount2Pay: z.number().min(0, { message: "Le montant à payer doit être supérieur ou égal à 0" }),
})

export const updateCardSubscriptionSchema = z.object({
    studentId: z.string().regex(objectIdRegex, { message: "L'id de l'élève doit être un ObjectId valide" }),
    token: z.string().min(1, { message: "Le token est obligatoire" }),
})

export const  newSubscriptionSchema = z.object({
    studentId: z.string().regex(objectIdRegex, { message: "L'id de l'élève doit être un ObjectId valide" }),
    token: z.string().min(1, { message: "Le token est obligatoire" }),
    subscriptionType: z.string().min(1, { message: "Le type d'abonnement est obligatoire" }),
    paymentStatus: z.boolean(),
    amount2Pay: z.number().min(0, { message: "Le montant à payer doit être supérieur ou égal à 0" }),
})