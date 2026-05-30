import mongoose from "mongoose";

const studentssSchema = new mongoose.Schema({
    apellido: String,
    name: String,
    subscription: String,
    startDate: Date,
    endDate: Date,
    pointsLeft: Number,
    payementStatus: String,
    amount2Pay: Number
})

const Student = mongoose.model('students', studentssSchema);

export default Student;