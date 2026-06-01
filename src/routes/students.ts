import { Router } from 'express';
import Student from '../models/students';
import { validate } from "../middlewares/validator";
import { getSubscriptionPeriod } from "../utils/date";
import { addStudentSchema, updateCardSubscriptionSchema } from "../zodSchemas/students.schema";

const router = Router();

// Récupérer tous les inscrits
router.get("/", async (req, res) => {
    try {
        const registrants = await Student.find().select(
            "apellido name subscription endDate pointsLeft payementStatus amount2Pay"
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

router.put("/updateCardSubscription", validate(updateCardSubscriptionSchema), async (req, res) => {
    try {
        const { studentId, token } = req.body;

        const admin = await Student.findOne({ token });

        if (!admin) {
            return res.status(403).json({ message: "Token d'administrateur invalide." });
        }

        const student = await Student.findByIdAndUpdate(
            studentId,
            {
                $inc: { pointsLeft: -1 }
            },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Étudiant introuvable" });
        }


        res.status(200).json({ result: true, message: 'Élève mis à jour', data: student });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour de l'inscrit." });
    }
});


export default router;
