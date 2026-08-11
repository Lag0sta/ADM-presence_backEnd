import { Router } from 'express';
import Student from '../models/students';
import { validate } from "../middlewares/validator";
import { signIn, logOut } from "../zodSchemas/auths.schema";
import crypto from "crypto";
import bcrypt from "bcrypt";

import { authValidation } from "../zodSchemas/auths.schema";

const router = Router();
//

router.post("/authValidation", validate(authValidation), async (req, res) => {
    try{
        const { token, password, email } = req.body;

        const authResponse = await Student.findOne({ token });

        if (!authResponse) return res.status(401).json({result: false, message: "Identifiants incorrects" });

        if(!authResponse.isAdmin) return res.status(403).json({result: false, message: "Accès réservé aux administrateurs" });
        
        if (!authResponse.password) return res.status(401).json({result: false, message: "Utilisateur sans mot de passe" });
   
        const isMatch = await bcrypt.compare(password, authResponse.password);

        if (!isMatch) return res.status(500).json({result: false, message: "Mot de passe éronnée"});


        res.status(200).json({ result: true, message: "Authentification reussie", data: authResponse });

    }catch(error){
        console.error(error);
        res.status(500).json({result: false, message: "Une erreur est survenue lors de la connexion." });
    }
})

// Connexion d'un Administrateur
router.post("/signIn",validate(signIn) , async (req, res) => {
    try {
        const { apellido, password, email } = req.body;

        const signIn = await Student.findOne({ apellido, email });

        if (!signIn) return res.status(401).json({result: false, message: "Identifiants incorrects" });
        
        if (!signIn.password) return res.status(500).json({result: false, message: "Mot de passe utilisateur introuvable"});
        
        const isMatch = await bcrypt.compare(password, signIn.password);

        if (!isMatch) return res.status(500).json({result: false, message: "mot de passe incorrects" });
        
        if(!signIn.isAdmin) return res.status(403).json({result: false, message: "Accès réservé aux administrateurs" });
        
        const token = crypto.randomBytes(32).toString("hex");
        const signInUpdate = await Student.findOneAndUpdate({ apellido, email }, 
                                                            { $set: { token: token } }, 
                                                            { returnDocument: "after" }
                                                           );

        if (!signInUpdate) return res.status(500).json({result: false, message: "Une erreur est survenue lors de la mise à jour du token." });
        
        res.status(200).json({ result: true, message: 'Connexion réussie', data: { apellido, token } });

    } catch (error) {
        console.error(error);
        res.status(500).json({result: false, message: "Une erreur est survenue lors de la connexion." });
    }
});

router.post("/logOut", validate(logOut),async (req, res) => {
    try {
        const { apellido, token } = req.body;
        const logOut = await Student.findOneAndUpdate({ apellido, token }, 
                                                      { $set: { token: null } }, 
                                                      { returnDocument: "after" }
                                                    );

        if (!logOut) return res.status(500).json({result: false, message: "Une erreur est survenue lors de la mise à jour du token." });
        
        res.status(200).json({ result: true, message: 'Déconnexion réussie' });

    } catch (error) {
        console.error(error);
        res.status(500).json({result: false, message: "Une erreur est survenue lors de la connexion." });
    }
});

export default router;
