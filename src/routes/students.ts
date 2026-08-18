import { Router } from 'express';
import Student from '../models/students';
import { validate } from "../middlewares/validator";
import { getQuarterlySubscriptionPeriod, getAnnualSubscriptionPeriod } from "../utils/date";
import { addStudentSchema, updateCardSubscriptionSchema, newSubscriptionSchema, updateStudentFileSchema } from "../zodSchemas/students.schema";

const router = Router();

// Récupérer tous les inscrits
router.get("/", async (req, res) => {
    try {
        const registrants = await Student.find().select(
            "_id apellido name age_Group subscription endDate pointsLeft payementStatus amount2Pay isAdmin"
        );;
        res.json({ result: true, data: registrants });

    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: "Une erreur est survenue lors de la recherche des inscrits." });
    }
});

// Ajouter un nouvel inscrit
router.post("/addNewStudent", validate(addStudentSchema), async (req, res) => {
    try {
        const { apellido, name, age_Group, subscriptionType, amount2Pay } = req.body;
        console.log("données reçues:", { apellido, name, subscriptionType, amount2Pay })

        const periodTrimestriel = getQuarterlySubscriptionPeriod(new Date());
        const periodAnnual = getAnnualSubscriptionPeriod(new Date());

        const student = await Student.findOne({ name, apellido });

        if (student) {
            return res.status(400).json({ result: false, message: "L'utilisateur existe deja" });
        }

        if (!["trimestriel", "carte", "annuel"].includes(subscriptionType)) {
            return res.status(400).json({ result: false, message: "subscriptionType invalide" });
        }

        const subscriptionData = {
            plan: subscriptionType,
            amount2Pay: amount2Pay,
            ...(subscriptionType === "annuel" && {
                startDate: periodAnnual.startDate,
                endDate: periodAnnual.endDate,
            }),
            ...(subscriptionType === "trimestriel" && {
                startDate: periodTrimestriel.startDate,
                endDate: periodTrimestriel.endDate,
            }),
            ...(subscriptionType === "carte" && {
                pointsLeft: 10,
            }),
        };

        const newStudent = new Student({
            apellido,
            name,
            age_Group: age_Group,
            subscription: subscriptionData,
            isAdmin: false
        });

        const savedStudent = await newStudent.save();
        res.status(201).json({ result: true, message: 'élève ajouté', data: savedStudent });

    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: "Une erreur est survenue lors de l'ajout de l'inscrit." });
    }
});

router.post("/newSubscription", validate(newSubscriptionSchema), async (req, res) => {
    try {
        const { studentId, subscriptionType, amount2Pay, token } = req.body;

        const user = await Student.findOne({ token });

        if (!user) return res.status(403).json({ result: false, message: "administrateurs non trouvé" });

        if (!user.isAdmin) return res.status(403).json({ result: false, message: "Accès réservé aux administrateurs" });

        const studentPayementInfo = await Student.findById(studentId);

        if (!studentPayementInfo) return res.status(404).json({ result: false, message: "Étudiant introuvable" });

        const notPayed = studentPayementInfo.subscription?.amount2Pay || 0
        const period = getQuarterlySubscriptionPeriod(new Date());

        let updateData: Record<string, any> = {
            "subscription.plan": subscriptionType,
            "subscription.amount2Pay": amount2Pay + notPayed,
        };

        if (subscriptionType === "trimestriel") {
            updateData["subscription.startDate"] = period.startDate;
            updateData["subscription.endDate"] = period.endDate;
            updateData["subscription.pointsLeft"] = undefined; // optionnel
        }

        if (subscriptionType === "carte") {
            updateData["subscription.pointsLeft"] = 10;
            updateData["subscription.startDate"] = undefined;
            updateData["subscription.endDate"] = undefined;
        }

        const student = await Student.findByIdAndUpdate(
            studentId,
            { $set: updateData },
            { new: true }
        );

        if (!student) return res.status(404).json({ result: false, message: "Étudiant introuvable" });

        res.status(200).json({ result: true, message: 'Abonnement mis à jour', data: student });


    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: error });
    }
});

router.put("/updateCardSubscription", validate(updateCardSubscriptionSchema), async (req, res) => {
    try {
        const { studentId, token } = req.body;

        const isAdmin = await Student.findOne({ token });

        if (!isAdmin) return res.status(403).json({ message: "Accès réservé aux administrateurs" });

        const student = await Student.findByIdAndUpdate(
            studentId,
            { $inc: { pointsLeft: -1 } },
            { returnDocument: "after" }
        );

        if (!student) return res.status(404).json({ result: false, message: "Étudiant introuvable" });

        if (student.subscription?.pointsLeft === 0) {
            const updatedStudent = await Student.findByIdAndUpdate(
                studentId,
                {
                    $set: {
                        "subscription.plan": null,
                        "subscription.startDate": null,
                        "subscription.endDate": null,
                        "subscription.pointsLeft": null,
                        "subscription.amount2Pay": null,
                    },
                },
                { returnDocument: "after" }
            );

            if(!updatedStudent) return res.status(404).json({ result: false, message: "Étudiant introuvable" });

            return res.status(200).json({ result: true, message: 'Abonnement mis à jour', data: updatedStudent });
        }

        res.status(200).json({ result: true, message: 'Élève mis à jour', data: student });

    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: "Une erreur est survenue lors de la mise à jour de l'inscrit." });
    }
});

//MAJ des infos de la fiche étudiante
router.put("/updateStudentFile", validate(updateStudentFileSchema), async (req, res) => {
    try {
        const { studentId, token, updateData } = req.body;
        console.log("UPDATE DATA");
        console.log(typeof updateData.student.subscription.pointsLeft);
        const isAdmin = await Student.findOne({ token });

        if (!isAdmin) return res.status(403).json({ result: false, message: "Accès réservé aux administrateurs" });

        // Vérification si la fiche appartient à un administrateur
        const authorisation = await Student.findOne({ _id: studentId })
        if (!authorisation) return res.status(404).json({ result: false, message: "Étudiant introuvable" });

        if (!authorisation.isAdmin) {
            const student = await Student.findByIdAndUpdate(
                studentId,
                { $set: updateData.student },
                { new: true }
            );

            if (!student) return res.status(404).json({ result: false, message: "Étudiant introuvable" });

            res.status(200).json({ result: true, message: 'Élève mis à jour', data: student });
        }

        if (authorisation.isAdmin) {
            const student = await Student.findByIdAndUpdate(
                studentId,
                { $set: updateData.admin },
                { new: true }
            );

            if (!student) return res.status(404).json({ result: false, message: "Étudiant introuvable" });

            res.status(200).json({ result: true, message: 'Élève mis à jour', data: student });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: "Une erreur est survenue lors de la mise à jour de l'inscrit." });
    }
});

export default router;
