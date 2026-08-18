import { z } from "zod";
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const addStudentSchema = z.object({
    apellido: z.string().optional(),
    name: z.string().min(1, { message: "Le nom est obligatoire" }),
    age_Group: z.string().min(1, { message: "Le groupe d'age est obligatoire" }),
    subscriptionType: z.string().min(1, { message: "l'abonnement est obligatoire" }),
    amount2Pay: z.number().min(0, { message: "Le montant à payer doit être supérieur ou égal à 0" }),
})

export const updateCardSubscriptionSchema = z.object({
    studentId: z.string().regex(objectIdRegex, { message: "L'id de l'élève doit être un ObjectId valide" }),
    token: z.string().min(1, { message: "Le token est obligatoire" }),
})

export const updateStudentFileSchema = z.object({
    studentId: z.string({ message: "L'id de l'élève est obligatoire et doit être une chaîne de caractères", }).regex(objectIdRegex, { message: "L'id de l'élève doit être un ObjectId valide", }),
    token: z.string({ message: "Le token est obligatoire et doit être une chaîne de caractères", }).min(1, { message: "Le token ne peut pas être vide", }),

    updateData: z.union([
        z.object({
            admin: z.object({
                subscription: z.object({
                    plan: z.enum(["trimestriel", "carte", "annuel"], { message: "Le type d'abonnement n'est pas valide", }).optional(),

                    startDate: z.preprocess(
                        (value) => (value === "" ? undefined : value),
                        z.coerce.date({ message: "La date de début n'est pas valide", }).optional()),

                    endDate: z.preprocess(
                        (value) => (value === "" ? undefined : value),
                        z.coerce.date({ message: "La date de fin n'est pas valide", }).optional()),

                    pointsLeft: z.number({ message: "Le nombre de points doit être un nombre", }).optional(),

                    amount2Pay: z.number({ message: "Le montant à payer doit être un nombre", }).optional(),
                }).optional(),
            }),
        }),

        z.object({
            student: z.object({
                apellido: z.string({ message: "Le apellido doit être une chaîne de caractères", }).optional(),

                name: z
                    .string({ message: "Le nom doit être une chaîne de caractères", }).optional(),

                age_Group: z
                    .string({ message: "Le groupe d'âge doit être une chaîne de caractères", }).optional(),

                subscription: z
                    .object({
                        plan: z.enum(["trimestriel", "carte"], { message: "Le type d'abonnement n'est pas valide", }).optional(),

                        startDate: z.preprocess(
                            (value) => (value === "" ? undefined : value),
                            z.coerce.date({ message: "La date de début n'est pas valide", }).optional()),

                        endDate: z.preprocess(
                            (value) => (value === "" ? undefined : value),
                            z.coerce.date({ message: "La date de fin n'est pas valide", }).optional()),

                        pointsLeft: z.number({ message: "Le nombre de points doit être un nombre", }).optional(),

                        amount2Pay: z.number({ message: "Le montant à payer doit être un nombre", }).optional(),
                    })
                    .optional(),
            }),
        }),
    ]),
});

export const newSubscriptionSchema = z.object({
    studentId: z.string().regex(objectIdRegex, { message: "L'id de l'élève doit être un ObjectId valide" }),
    token: z.string().min(1, { message: "Le token est obligatoire" }),
    subscriptionType: z.string().min(1, { message: "Le type d'abonnement est obligatoire" }),
    amount2Pay: z.number().min(0, { message: "Le montant à payer doit être supérieur ou égal à 0" }),
})