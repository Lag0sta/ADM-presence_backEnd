import mongoose from "mongoose";

const studentsSchema = new mongoose.Schema({
  apellido: String,
  name: String,
  age_Group: String,
  subscription: {
    plan: { 
      type: String,
      enum: ["trimestriel", "carte", "annuel"],
      required: true,
    },

    startDate: Date,
    endDate: Date,

    pointsLeft: Number,

    amount2Pay: Number,
  },

  password: String,
  email: String,
  token: String,
  isAdmin: Boolean
});

const Student = mongoose.model('students', studentsSchema);

export default Student;