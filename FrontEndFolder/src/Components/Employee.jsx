import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
          localStorage.setItem("employeeData", JSON.stringify(result.data.Result)); // Store data in local storage
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete("http://localhost:3000/auth/employee/delete_employee/" + id)
      .then(result => {
        if (result.data.Status) {
          // Remove the deleted employee from the state
          setEmployee(employee.filter((e) => e._id !== id));
        } else {
          alert(result.data.Error);
        }
      });
  };

  // Filtered employee data based on search term
  const filteredEmployees = employee.filter((e) => {
    return (
      (e.E_Id && e.E_Id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.E_Name && e.E_Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.E_Email && e.E_Email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.E_Mobile && e.E_Mobile.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.E_Designation && e.E_Designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.E_Gender && e.E_Gender.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.E_Course && e.E_Course.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success">
        Add Employee
      </Link>
      <div className="mt-3">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="form-control mb-3"
        />
        {filteredEmployees.length > 0 ? ( // Check if there are any filtered employees
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Image</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Designation</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((e) => (
                <tr key={e._id}>
                  <td>{e.E_Id}</td> {/* Display Employee ID */}
                  <td>{e.E_Name}</td>
                  <td>
                    <img
                      src={`http://localhost:3000/Images/` + e.E_Image}
                      className="employee_image"
                      alt={e.E_Name} // Added alt for accessibility
                    />
                  </td>
                  <td>{e.E_Email}</td>
                  <td>{e.E_Mobile}</td>
                  <td>{e.E_Designation}</td>
                  <td>{e.E_Gender}</td>
                  <td>{e.E_Course}</td>
                  <td>{new Date(e.createdAt).toLocaleString()}</td>
                  <td>
                    <Link
                      to={`/dashboard/edit_employee/` + e.E_Id}
                      className="btn btn-info btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm" // Change to btn-danger for consistency
                      onClick={() => handleDelete(e.E_Id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No employees found matching your search criteria.</p> // Display message if no results found
        )}
      </div>
    </div>
  );
};

export default Employee;
