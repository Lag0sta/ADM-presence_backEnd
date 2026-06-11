import { Router } from 'express';
import Attendance from '../models/attendances';
import Student from '../models/students';
import { validate } from "../middlewares/validator";
import { addNewAttendance, updateAttendance, deleteStudent, deleteDate } from "../zodSchemas/attendances.schema";

const router = Router();

// Récupérer toutes les présences
router.get("/", async (req, res) => {
    try {
        const response = await Attendance.find().populate("students", '_id apellido name');
        res.json({ result: true, message: 'Présences trouvées', data: response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la recherche des présences." });
    }
});

// Poster une nouvelle fiche de présence
router.post("/addNewAttendance", validate(addNewAttendance), async (req, res) => {
    try {
        console.log("start")
        const { students, token } = req.body;

        const auth = await Student.findOne({ token });

        if (!auth || !auth.isAdmin) return res.status(403).json({ message: "Accès réservé aux administrateurs" });

        const newAttencance = new Attendance({
            attendanceDay: new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Brussels" }),
            createdAt: new Date(),
            students: students
        });

        const savedAttendance = await newAttencance.save();

        const studentsData = await Student.find({
            _id: { $in: students },
        })
            console.log(studentsData);
            console.log("hello world")

        if (studentsData.length === 0) return res.status(404).json({ message: "Élèves introuvables" });

        for (const student of studentsData) {
            if (student?.subscription?.plan === "carte") {
                await Student.bulkWrite(
                    studentsData
                        .filter(s => s?.subscription?.plan === "carte")
                        .map(s => ({
                            updateOne: {
                                filter: { _id: s._id },
                                update: { $inc: { "subscription.pointsLeft": -1 } }
                            }
                        }))
                );
            }
        }

        res.status(201).json({ result: true, message: 'Présence ajouté et carte mis à jour', data: { savedAttendance, studentsData } });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la présence." });
    }
});


router.put("/updateAttendance", validate(updateAttendance), async (req, res) => {
    try {
        const { students, token, attendanceID } = req.body;
        const _id = attendanceID
        const auth = await Student.findOne({ token });

        if (!auth || !auth.isAdmin) return res.status(403).json({ message: "Accès réservé aux administrateurs" });

        const updatedAttendance = await Attendance.findByIdAndUpdate(
            _id
            , {
                $addToSet: {
                    students: {
                        $each: students
                    }
                }
            },
            { returnDocument: "after" }
        );

         const studentsData = await Student.find({
            _id: { $in: students },
        })
            console.log(studentsData);
            console.log("hello world")

        if (studentsData.length === 0) return res.status(404).json({ message: "Élèves introuvables" });

        for (const student of studentsData) {
            if (student?.subscription?.plan === "carte") {
                await Student.bulkWrite(
                    studentsData
                        .filter(s => s?.subscription?.plan === "carte")
                        .map(s => ({
                            updateOne: {
                                filter: { _id: s._id },
                                update: { $inc: { "subscription.pointsLeft": -1 } }
                            }
                        }))
                );
            }
        }
        
        res.status(201).json({ result: true, message: 'Présence ajouté', data: updatedAttendance });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la présence." });
    }
});

router.delete("/deleteStudent", validate(deleteStudent), async (req, res) => {
    try {
        const { attendanceId, studentId, token } = req.body;

        const auth = await Student.findOne({ token });

        if (!auth || !auth.isAdmin) return res.status(403).json({ message: "Accès réservé aux administrateurs" });

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

        if (!auth || !auth.isAdmin) return res.status(403).json({ message: "Accès réservé aux administrateurs" });

        const response = await Attendance.findByIdAndDelete(attendanceId);

        if (!response) return res.status(404).json({ message: "Date introuvable" });

        res.status(200).json({ result: true, message: 'Présence supprimée', data: response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la date." });
    }
})


export default router;
