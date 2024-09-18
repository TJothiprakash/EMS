import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    E_Id: {
      type: String,
      required: true,
      unique: true, // Ensure unique IDs
    },
    E_Image: {
      type: String,
      required: false, // Image can be optional
    },
    E_Name: {
      type: String,
      required: true,
    },
    E_Email: {
      type: String,
      required: true,
      unique: true, // Ensure unique emails
    },
    E_Mobile: {
      type: String,
      required: true,
    },
    E_Designation: {
      type: String,
      required: true,
    },
    E_Gender: {
      type: String,
      required: true, // Gender can be optional
    },
    E_Course: {
      type: String,
      required: true, // Course can be optional
    },
    E_CreatedDate: {
      type: Date,
      default: Date.now, // Default to current date
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
