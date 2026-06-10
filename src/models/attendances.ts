import mongoose from "mongoose";

const attendancesSchema = new mongoose.Schema({
    attendanceDay: String,
    createdAt: Date,
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'students'}],
})

const Attendance = mongoose.model('attendances', attendancesSchema);

export default Attendance;