import { Router } from 'express';
import Student from '../models/students';
import { validate } from "../middlewares/validator";
import { userInfo, updateUserInfo } from "../zodSchemas/user.schema";

// Récupérer les informations de l'utilisateur
const router = Router();

router.post("/userInfo", validate(userInfo), async (req, res) => {
    try {
        const { apellido, token } = req.body;
        console.log("données reçues:", { apellido, token });

        const user = await Student.findOne({ apellido, token }).select(
            "apellido name subscription endDate pointsLeft payementStatus amount2Pay isAdmin"
        );

        if (!user) return res.status(404).json({result: false, message: "Étudiant introuvable" });
        
        res.json({ result: true, data: user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la recherche de l'utilisateur." });
    }
});



router.put("/updateUserFile", validate(updateUserInfo), async (req, res) => {
   try {
        const { token, updateData } = req.body;

        const isAdmin = await Student.findOne({ token });

        if (!isAdmin?.isAdmin) return res.status(403).json({ result: false, message: "Accès réservé aux administrateurs" });

        const authorisation = await Student.findOne({ token })
        if (!authorisation) return res.status(404).json({ result: false, message: "Étudiant introuvable" });

        if (authorisation.isAdmin) {
            const student = await Student.findByIdAndUpdate(
                authorisation._id,
                { $set: updateData},
                { new: true }
            );

            if (!student) return res.status(404).json({ result: false, message: "Étudiant introuvable" });

            res.status(200).json({ result: true, message: 'Élève mis à jour', data: student });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la recherche de l'utilisateur." });
    }
});


export default router;
