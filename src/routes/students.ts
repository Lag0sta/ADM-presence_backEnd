import { Router } from 'express';
import Student from '../models/students';
import { validate } from "../middlewares/validator";
import { getSubscriptionPeriod } from "../utils/date";
import { addStudentSchema, updateCardSubscriptionSchema, newSubscriptionSchema } from "../zodSchemas/students.schema";

const router = Router();

// Récupérer tous les inscrits
router.get("/", async (req, res) => {
    try {
        const registrants = await Student.find().select(
            "_id apellido name subscription endDate pointsLeft payementStatus amount2Pay"
        );;
        res.json({ result: true, data: registrants });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la recherche des inscrits." });
    }
});

// Ajouter un nouvel inscrit
router.post("/addNewStudent", validate(addStudentSchema), async (req, res) => {
    try {
        const { apellido, name, subscription, payementStatus, amount2Pay } = req.body;
        console.log("données reçues:", { apellido, name, subscription, payementStatus, amount2Pay })

        const period = getSubscriptionPeriod(new Date());
        let startDate;
        let endDate;
        let pointsLeft;
        if (subscription === "trimestriel") {
            startDate = period.startDate;
            endDate = period.endDate;
        } else if (subscription === "carte") {
            pointsLeft = 10;
        }

        console.log("période calculée:", period)
        const newStudent = new Student({
            apellido: apellido,
            name: name,
            subscription: subscription,
            startDate: startDate,
            endDate: endDate,
            pointsLeft: pointsLeft,
            payementStatus: payementStatus,
            amount2Pay: amount2Pay
        });

        const savedStudent = await newStudent.save();
        res.status(201).json({ result: true, message: 'élève ajouté', data: savedStudent });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de l'ajout de l'inscrit." });
    }
});

router.post("/newSubscription", validate(newSubscriptionSchema), async (req, res) => {
    try {
        const { studentId, subscription, amount2Pay, payementStatus, token } = req.body;

        const isAdmin = await Student.findOne({ token });

        if (!isAdmin) return res.status(403).json({ message: "Accès réservé aux administrateurs" });
        
        const period = getSubscriptionPeriod(new Date());
        let startDate;
        let endDate;
        let pointsLeft;

        if (subscription === "trimestriel") {
            startDate = period.startDate;
            endDate = period.endDate;

            const student = await Student.findByIdAndUpdate(
                studentId,
                {$set: { subscription: subscription, startDate: startDate, endDate: endDate, amount2Pay: amount2Pay, payementStatus: payementStatus }},
                { returnDocument: "after" }
            );

            if (!student) return res.status(404).json({ message: "Étudiant introuvable" });
            
            res.status(200).json({ result: true, message: 'Abonnement mis à jour', data: student });

        } else if (subscription === "carte") {
            pointsLeft = 10;

            const student = await Student.findByIdAndUpdate(
                studentId,
                {$set: { subscription: subscription, pointsLeft: pointsLeft, amount2Pay: amount2Pay, payementStatus: payementStatus }},
                { returnDocument: "after" }
            );

            if (!student) return res.status(404).json({ message: "Étudiant introuvable" });
            
            res.status(200).json({ result: true, message: 'Abonnement mis à jour', data: student });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour de l'inscrit." });
    }
});

router.put("/updateCardSubscription", validate(updateCardSubscriptionSchema), async (req, res) => {
    try {
        const { studentId, token } = req.body;

        const isAdmin = await Student.findOne({ token });

        if (!isAdmin) return res.status(403).json({ message: "Accès réservé aux administrateurs" });
        
        const student = await Student.findByIdAndUpdate(
            studentId,
            {$inc: { pointsLeft: -1 }},
            { returnDocument: "after" }
        );

        if (!student) return res.status(404).json({ message: "Étudiant introuvable" });

        res.status(200).json({ result: true, message: 'Élève mis à jour', data: student });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour de l'inscrit." });
    }
});


export default router;
