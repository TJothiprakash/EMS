Employee Management System (EMS)
Table of Contents
Introduction
Features
Technologies Used
Setup Instructions
API Endpoints
Usage
Contributing
License
Introduction
The Employee Management System (EMS) is a web application designed to streamline the process of managing employee records, allowing administrators to add, edit, delete, and retrieve employee information efficiently. The application features a user-friendly interface with search functionality for easy access to employee details.

Features
User authentication for administrators.
Add, edit, and delete employee records.
Display employee details, including ID, name, email, mobile, designation, gender, course, and created date.
Search functionality to filter employee records based on various fields.
Image upload capability for employee profiles.
Responsive design for a better user experience on different devices.
Technologies Used
Frontend: React.js, Axios, React Router
Backend: Node.js, Express
Database: MongoDB Atlas
File Storage: Local or cloud storage for images
Authentication: JWT (JSON Web Tokens)
Setup Instructions
1. Clone the repository:
git clone <repository-url>
cd <repository-directory>
2. Install the required dependencies:
npm install
3. Set up your backend:
Navigate to the backend folder and install dependencies.
Set up your db.config file with MongoDB connection details and other configurations.
4. Start the backend server:
npm start
5. Start the frontend application:
npm run dev
6. Access the application in your web browser at http://localhost:3000.

API Endpoints
Method	Endpoint	Description
GET	/auth/employee	Retrieve all employee records
POST	/auth/adminlogin	Admin login
POST	/auth/employee/add_employee	Add a new employee
PUT	/auth/employee/edit_employee/:id	Edit employee details
DELETE	/auth/employee/delete_employee/:id	Delete an employee

Usage
Login: Admins can log in using their email and password.
Employee List: View the list of all employees with options to edit or delete records.
Add Employee: Fill in the form to add a new employee, including uploading an image.
Search Functionality: The search bar filters employee records based on input letters.

