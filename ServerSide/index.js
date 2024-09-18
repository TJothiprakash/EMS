import express from "express";
import cors from "cors";
import adminRouter from "./Routes/AdminRoute.js"; // Import your admin router
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "./utils/db.js"; // Import your MongoDB connection

const app = express();

// Middleware setup
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("Public")); // Serve static files from the Public directory

// Admin operations handled here
app.use("/auth", adminRouter); // Ensure this path matches your routing

// Middleware for verifying user authentication
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) return res.json({ Status: false, Error: "Wrong Token" });
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.json({ Status: false, Error: "Not authenticated" });
  }
};

// Verify route to check user authentication status
app.get("/verify", verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
