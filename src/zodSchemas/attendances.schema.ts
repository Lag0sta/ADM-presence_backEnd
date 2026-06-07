import { z } from "zod";
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const addNewAttendance = z.object({
    students: z.array(z.string().regex(objectIdRegex, { message: "L'id de l'élève doit être un ObjectId valide" })),
    token: z.string().min(1, { message: "Le token est obligatoire" }),
   })

   export const deleteStudent = z.object({
       attendanceId: z.string().regex(objectIdRegex, { message: "L'id de la présence doit être un ObjectId valide" }),
       studentId: z.string().regex(objectIdRegex, { message: "L'id de l'élève doit être un ObjectId valide" }),
       token: z.string().min(1, { message: "Le token est obligatoire" }),
   })

   export const deleteDate = z.object({
       token: z.string().min(1, { message: "Le token est obligatoire" }),
   })