import { Router } from 'express';
import Attendance from '../models/attendances';
import Student from '../models/students';
import { validate } from "../middlewares/validator";
import { addNewAttendance, deleteStudent, deleteDate } from "../zodSchemas/attendances.schema";

const router = Router();

// Récupérer toutes les présences
router.get("/", async (req, res) => {
    try {
        const response = await Attendance.find().populate("students", '_id apellido name');
        res.json({ result: true, data: response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la recherche des présences." });
    }
});

// Poster une nouvelle fiche de présence
router.post("/addNewAttendance", validate(addNewAttendance), async (req, res) => {
    try {
        const { students, token } = req.body;

        const auth = await Student.findOne({ token });

        if (!auth) return res.status(403).json({ message: "Accès réservé aux administrateurs" });

        const newAttencance = new Attendance({
            date: new Date(),
            students: students
        });

        const savedAttendance = await newAttencance.save();
        res.status(201).json({ result: true, message: 'Présence ajouté', data: savedAttendance });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la présence." });
    }
});

router.delete("/deleteStudent", validate(deleteStudent), async (req, res) => {
    try {
        const { attendanceId, studentId, token } = req.body;

        const auth = await Student.findOne({ token });

        if (!auth) return res.status(403).json({ message: "Accès réservé aux administrateurs" });

        const response = await Attendance.findByIdAndUpdate(attendanceId,
            { $pull: { students: studentId } },
            { returnDocument: "after" }
        );

        if (!response) return res.status(404).json({ message: "Date introuvable" });

        res.status(200).json({ result: true, message: 'Présence modifiée', data: response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la suppression de l'Étudiant." });
    }
})

router.delete("/deleteDate/:attendanceId", validate(deleteDate), async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const { token } = req.body;

        const auth = await Student.findOne({ token });

        if (!auth) return res.status(403).json({ message: "Accès réservé aux administrateurs" });

        const response = await Attendance.findByIdAndDelete(attendanceId);

        if (!response) return res.status(404).json({ message: "Date introuvable" });

        res.status(200).json({ result: true, message: 'Présence supprimée', data: response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la date." });
    }
})


export default router;
