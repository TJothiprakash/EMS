import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure unique emails
    },
    password: {
      type: String,
      required: true, // Password is required for authentication
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
