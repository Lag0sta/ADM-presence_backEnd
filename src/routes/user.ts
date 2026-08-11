import { Router } from 'express';
import Student from '../models/students';
import { hashPassword } from "../utils/generatePswd";
import { validate } from "../middlewares/validator";
import { userInfo, updateUserFile, updateUserInfo } from "../zodSchemas/user.schema";

// Récupérer les informations de l'utilisateur
const router = Router();

router.post("/userInfo", validate(userInfo), async (req, res) => {
    try {
        const { apellido, token } = req.body;

        const user = await Student.findOne({ apellido, token }).select(
            "apellido name subscription endDate pointsLeft payementStatus amount2Pay isAdmin"
        );

        if (!user) return res.status(404).json({ result: false, message: "Étudiant introuvable" });

        res.json({ result: true, data: user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: "Une erreur est survenue lors de la recherche de l'utilisateur." });
    }
});



router.put("/updateUserFile", validate(updateUserFile), async (req, res) => {
    try {
        const { token, updateData } = req.body;
        const apellido = updateData.apellido

        const isAdmin = await Student.findOne({ token, apellido });

        if (!isAdmin?.isAdmin) return res.status(403).json({ result: false, message: "Accès réservé aux administrateurs" });

        const authorisation = await Student.findOne({ token })
        if (!authorisation) return res.status(404).json({ result: false, message: "Autorisation non trouvé" });

        if (authorisation.isAdmin) {
            const user = await Student.findByIdAndUpdate(
                authorisation._id,
                { $set: updateData },
                { new: true }
            );

            if (!user) return res.status(404).json({ result: false, message: "utilisateur introuvable" });

            res.status(200).json({ result: true, message: 'Élève mis à jour', data: {apellido: user.apellido,
                                                                                     name: user.name,
                                                                                     subscription: user.subscription}});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: "Une erreur est survenue lors de la recherche de l'utilisateur." });
    }
});


router.put("/updateUserInfo", validate(updateUserInfo), async (req, res) => {
    try {
        const { token, apellido, password, email } = req.body;

        const hashedPassword = await hashPassword(password);

        const updateData = {
            apellido,
            email,
            password: hashedPassword,
        };
        
        const authorisation = await Student.findOne({ token })
        if (!authorisation || !authorisation.isAdmin) return res.status(404).json({ result: false, message: "Autorisation non trouvé" });

        if (authorisation.isAdmin) {
            const user = await Student.findByIdAndUpdate(
                authorisation._id,
                { $set: updateData },
                { new: true }
            );

            if (!user) return res.status(404).json({ result: false, message: "utilisateur introuvable" });

            res.status(200).json({ result: true, message: 'Élève mis à jour', apellido: user.apellido });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: error });
    }
});

export default router;
