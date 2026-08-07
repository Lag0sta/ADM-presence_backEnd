import { Router } from 'express';
import Student from '../models/students';
import { validate } from "../middlewares/validator";
import { userInfo } from "../zodSchemas/user.schema";

// Récupérer les informations de l'utilisateur
const router = Router();

router.post("/userInfo", validate(userInfo), async (req, res) => {
    try {
        const { apellido, token } = req.body;
        console.log("données reçues:", { apellido, token });

        const user = await Student.findOne({ apellido, token }).select(
            "_id apellido name subscription endDate pointsLeft payementStatus amount2Pay isAdmin"
        );;

        if (!user) return res.status(404).json({result: false, message: "Étudiant introuvable" });

        if (user.token !== token) return res.status(403).json({result: false, message: "Token invalide" });
        
        res.json({ result: true, data: user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la recherche de l'utilisateur." });
    }
});

export default router;
