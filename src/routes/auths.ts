import { Router } from 'express';
import Student from '../models/students';
import { validate } from "../middlewares/validator";
import { signIn, logOut } from "../zodSchemas/auths.schema";
import crypto from "crypto";
import bcrypt from "bcrypt";

const router = Router();

router.post("/signIn", async (req, res) => {
  console.log("HIT SIGNIN");
  res.send("OK");
});

// Connexion d'un Administrateur
// router.post("/signIn", validate(signIn), async (req, res) => {
//     try {
//         const { apellido, password, email } = req.body;

//         const signIn = await Student.findOne({ apellido, email });

//         if (!signIn) return res.status(401).json({ message: "Identifiants Identifiants incorrects" });
        
//         if (!signIn.password) return res.status(500).json({message: "Mot de passe utilisateur introuvable"});
        
//         const isMatch = await bcrypt.compare(password, signIn.password);

//         if (!isMatch) return res.status(500).json({ message: "mot de passe incorrects" });
        
//         if(!signIn.isAdmin) return res.status(403).json({ message: "Accès réservé aux administrateurs" });
        
//         const token = crypto.randomBytes(32).toString("hex");
//         const signInUpdate = await Student.findOneAndUpdate({ apellido, email }, 
//                                                             { $set: { token: token } }, 
//                                                             { returnDocument: "after" }
//                                                            );

//         if (!signInUpdate) return res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour du token." });
        
//         res.status(200).json({ result: true, message: 'Connexion réussie', data: { apellido, token } });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Une erreur est survenue lors de la connexion." });
//     }
// });

router.post("/logOut", validate(logOut),async (req, res) => {
    try {
        const { apellido, token } = req.body;
        const logOut = await Student.findOneAndUpdate({ apellido, token }, 
                                                      { $set: { token: null } }, 
                                                      { returnDocument: "after" }
                                                    );

        if (!logOut) return res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour du token." });
        
        res.status(200).json({ result: true, message: 'Déconnexion réussie' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la connexion." });
    }
});

export default router;
