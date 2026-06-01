import { z } from "zod";

export const signIn = z.object({
    apellido: z.string().min(1, { message: "Le nom est obligatoire" }),
    password: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères" }),
    email: z.email({ message: "L'email est obligatoire" }),
})

export const logOut = z.object({
    apellido: z.string().min(1, { message: "Le nom est obligatoire" }),
    token: z.string().min(1, { message: "Le token est obligatoire" }),
})