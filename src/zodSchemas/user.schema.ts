import { z } from "zod";
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const userInfo = z.object({
    apellido: z.string().min(1, { message: "l'Appellido est obligatoire" }),
    token : z.string().min(1, { message: "Le token est obligatoire" })
})