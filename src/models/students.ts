import mongoose from "mongoose";

const studentsSchema = new mongoose.Schema({
  apellido: String,
  name: String,

  subscription: {
    plan: {
      type: String,
      enum: ["trimestriel", "carte"],
      required: true,
    },

    startDate: Date,
    endDate: Date,

    pointsLeft: Number,

    paymentStatus: Boolean,
    amount2Pay: Number,
  },

  password: String,
  email: String,
  token: String,
  isAdmin: Boolean
});

const Student = mongoose.model('students', studentsSchema);

export default Student;