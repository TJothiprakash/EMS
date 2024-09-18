import mongoose from "mongoose";

// Replace <username>, <password>, and <dbname> with your MongoDB Atlas credentials
const mongoURI = "";
console.log("connectiong mongodb ....");
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Connection error", err);
  });

export default mongoose;
