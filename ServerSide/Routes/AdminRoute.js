import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import winston from "winston";
import bcrypt from "bcrypt";
import Employee from "../Modal/Employee.js"; // Ensure this path is correct
import { log } from "console";

// Logger configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/admin.log" }),
    new winston.transports.Console(),
  ],
});

const adminRouter = express.Router(); // Correct the casing to match the import statement

// Image upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Adjust this if you have specific file types allowed
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: File type not supported", false);
    }
  },
});

// Admin schema
const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const Admin = mongoose.model("Admin", adminSchema);

// Employee schema
const employeeSchema = new mongoose.Schema({
  E_Id: String, // Ensure you add the E_Id field here
  E_Name: String,
  E_Email: { type: String, unique: true },
  E_Mobile: String,
  E_Designation: String,
  E_Image: String,
  E_Course: String,
  E_Createddate: { type: Date, default: Date.now },
});

// Admin login API
adminRouter.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email :" + email + " password :" + password);

    // Find admin by email
    const admin = await Admin.findOne({
      email: { $regex: new RegExp("^" + email.toLowerCase(), "i") },
    });
    logger.info("admin email : " + admin);

    if (!admin) {
      logger.warn(`Login attempt failed for email: ${email}`);
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }

    // Compare hashed password with the plain-text password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      logger.warn(`Login attempt failed for email: ${email}`);
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { role: "admin", email: admin.email, id: admin._id },
      "jwt_secret_key",
      { expiresIn: "1d" }
    );

    // Send the token as a cookie
    res.cookie("token", token);
    logger.info(`Admin logged in: ${email}`);
    return res.json({ loginStatus: true });
  } catch (err) {
    logger.error(`Admin login error: ${err.message}`);
    return res.status(500).json({ loginStatus: false, Error: "Server error" });
  }
});

// Add new employee API
adminRouter.post(
  "/employee/add_employee",
  upload.single("E_Image"), // Ensure that the frontend sends 'E_Image' as the field name
  async (req, res) => {
    console.log("Received data:", req.body);

    try {
      // Validate required fields
      const { E_Name, E_Email, E_Mobile, E_Designation, E_Course, E_Gender } =
        req.body;
      if (!E_Name || !E_Email || !E_Mobile || !E_Designation || !E_Gender) {
        return res.status(400).json({
          Status: false,
          Error:
            "Required fields are missing: E_Name, E_Email, E_Mobile, E_Designation, E_Gender.",
        });
      }

      // Fetch the last employee
      const lastEmployee = await Employee.findOne().sort({ E_Id: -1 });
      let newE_Id;

      if (lastEmployee) {
        const lastId = lastEmployee.E_Id;
        const lastNum = parseInt(lastId.substring(3)); // Extract the number part after "DLS"
        newE_Id = `DLS${lastNum + 1}`; // Increment the number
        logger.info(
          `Generated new E_Id: ${newE_Id} based on last E_Id: ${lastId}`
        );
      } else {
        newE_Id = "DLS1"; // Start with DLS1 if no employee exists
        logger.info(
          `No previous employee found, starting with new E_Id: ${newE_Id}`
        );
      }

      const newEmployee = new Employee({
        E_Id: newE_Id, // Use the newly generated E_Id
        E_Name: E_Name,
        E_Email: E_Email,
        E_Mobile: E_Mobile,
        E_Designation: E_Designation,
        E_Image: req.file ? req.file.filename : undefined, // Check if the image exists
        E_Course: E_Course,
        E_Gender: E_Gender, // Include E_Gender
        E_CreatedDate: new Date(), // Ensure that the created date is set
      });

      logger.info("New employee created with data: ", newEmployee);
      await newEmployee.save();
      logger.info(
        `New employee added: ${newEmployee.E_Name} with E_Id: ${newEmployee.E_Id}`
      );

      return res.status(201).json({
        Status: true,
        Message: "Employee added successfully!",
        Employee: newEmployee,
      });
    } catch (err) {
      logger.error(`Add employee error: ${err.message}`);
      return res.status(500).json({ Status: false, Error: err.message });
    }
  }
);

// Retrieve all employees API
adminRouter.get("/employee", async (req, res) => {
  try {
    const employees = await Employee.find();
    logger.info(`Retrieved all employees: ${employees.length} found`);
    return res.json({ Status: true, Result: employees });
  } catch (err) {
    logger.error(`Retrieve all employees error: ${err.message}`);
    return res.json({ Status: false, Error: "Query Error" });
  }
});

// Retrieve specific employee by E_Id API
adminRouter.get("/employee/:id", async (req, res) => {
  try {
    const employee = await Employee.findOne({ E_Id: req.params.id }); // Use E_Id for querying
    if (!employee) {
      logger.warn(`Employee not found with E_Id: ${req.params.id}`);
      return res.json({ Status: false, Error: "Employee not found" });
    }

    logger.info(`Retrieved employee: ${employee.E_Name}`);
    return res.json({ Status: true, Result: employee });
  } catch (err) {
    logger.error(`Retrieve employee error: ${err.message}`);
    return res.json({ Status: false, Error: "Query Error" });
  }
});

// Update employee record API
adminRouter.put(
  "/employee/edit_employee/:id",
  upload.single("image"), // Ensure the same field name is used
  async (req, res) => {
    console.log("Inside update employee data function");

    console.log("Form data received from frontend: ", req.body);

    try {
      // Find the employee by ID first
      const employee = await Employee.findOne({ E_Id: req.params.id });
      console.log(employee);

      if (!employee) {
        logger.warn(`Employee not found for update: ${req.params.id}`);
        return res.json({ Status: false, Error: "Employee not found" });
      }

      // Explicitly update each field if the new value is provided, otherwise retain the old value
      employee.E_Name = req.body.E_Name || employee.E_Name;
      console.log(" name " + employee.E_Name);

      employee.E_Email = req.body.E_Email || employee.E_Email;
      console.log(" name " + employee.E_Email);

      employee.E_Mobile = req.body.E_Mobile || employee.E_Mobile;
      console.log(" name " + employee.E_Mobile);

      employee.E_Designation = req.body.E_Designation || employee.E_Designation;
      console.log(
        " name " +
          employee.E_Designation +
          " updated value " +
          req.body.E_Designation +
          "old value " +
          employee.E_Designation
      );

      employee.E_Course = req.body.E_Course || employee.E_Course;
      console.log(" name " + employee.E_Course);

      // Update the image only if a new file was uploaded
      if (req.file) {
        employee.E_Image = req.file.E_Image; // Use the uploaded image filename
      }

      // Save the updated employee
      const updatedEmployee = await employee.save();

      logger.info(`Employee updated: ${updatedEmployee.E_Id}`);
      return res.json({ Status: true, Result: updatedEmployee });
    } catch (err) {
      logger.error(`Update employee error: ${err.message}`);
      return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
  }
);

// Delete employee record API
adminRouter.delete("/employee/delete_employee/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({
      E_Id: req.params.id,
    });

    if (!deletedEmployee) {
      logger.warn(`Employee not found for deletion: ${req.params.id}`);
      return res.json({ Status: false, Error: "Employee not found" });
    }

    logger.info(`Employee deleted: ${deletedEmployee.E_Name}`);
    return res.json({ Status: true, Result: deletedEmployee });
  } catch (err) {
    logger.error(`Delete employee error: ${err.message}`);
    return res.json({ Status: false, Error: "Query Error: " + err.message });
  }
});

// Logout API to clear the cookie
adminRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  logger.info("Admin logged out");
  return res.json({ Status: true });
});

// API to add a new admin
adminRouter.post("/add", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newAdmin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newAdmin.save();
    logger.info(`New admin created: ${newAdmin.email}`);
    return res.json({ Status: true });
  } catch (err) {
    logger.error(`Add admin error: ${err.message}`);
    return res.json({ Status: false, Error: "Admin creation failed" });
  }
});

export default adminRouter; // Ensure you export adminRouter
