import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    E_Name: "",
    E_Email: "",
    E_Mobile: "",
    E_Designation: "",
    E_Gender: "",
    E_Course: "",
    E_Image: null,
  });
  const [category, setCategory] = useState([]);
  const [newDesignation, setNewDesignation] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log employee data before sending
    console.log("Submitting employee data:", employee);

    const formData = new FormData();
    formData.append("E_Name", employee.E_Name);
    formData.append("E_Email", employee.E_Email);
    formData.append("E_Mobile", employee.E_Mobile);
    formData.append("E_Designation", employee.E_Designation);
    formData.append("E_Gender", employee.E_Gender); // Ensure this line is correct
    formData.append("E_Course", employee.E_Course);
    formData.append("E_Image", employee.E_Image);

    // Log the form data being sent
    console.log("Form Data being sent:", formData);

    axios
      .post("http://localhost:3000/auth/employee/add_employee", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        // Log the result from the backend
        console.log("Response from backend:", result.data);

        if (result.data.Status) {
          setResponseMessage("Employee added successfully!");
          navigate("/dashboard/employee");
        } else {
          setResponseMessage(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error adding employee:", err);
        setResponseMessage("An error occurred while adding the employee.");
      });
  };

  const handleAddDesignation = () => {
    if (newDesignation) {
      // Log new designation being added
      console.log("Adding new designation:", newDesignation);
      setCategory([...category, { name: newDesignation }]); // Add new designation
      setNewDesignation(""); // Clear input
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        {responseMessage && (
          <div className="alert alert-info">{responseMessage}</div>
        )}
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              required
              onChange={(e) =>
                setEmployee({ ...employee, E_Name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail"
              placeholder="Enter Email"
              autoComplete="off"
              required
              onChange={(e) =>
                setEmployee({ ...employee, E_Email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputMobile" className="form-label">
              Mobile <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputMobile"
              placeholder="Enter Mobile Number"
              required
              onChange={(e) =>
                setEmployee({ ...employee, E_Mobile: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputDesignation" className="form-label">
              Designation <span className="text-danger">*</span>
            </label>
            <select
              id="inputDesignation"
              className="form-select"
              required
              onChange={(e) =>
                setEmployee({ ...employee, E_Designation: e.target.value })
              }
            >
              <option value="">Select Designation</option>
              {category.map((c, index) => (
                <option key={index} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="input-group mt-2">
              <input
                type="text"
                className="form-control"
                placeholder="Add New Designation"
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddDesignation}
              >
                Add
              </button>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Gender <span className="text-danger">*</span></label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="genderMale"
                value="Male"
                required
                onChange={(e) =>
                  setEmployee({ ...employee, E_Gender: e.target.value }) // Correctly set gender value
                }
              />
              <label className="form-check-label" htmlFor="genderMale">
                Male
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="genderFemale"
                value="Female"
                required
                onChange={(e) =>
                  setEmployee({ ...employee, E_Gender: e.target.value }) // Correctly set gender value
                }
              />
              <label className="form-check-label" htmlFor="genderFemale">
                Female
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="genderOther"
                value="Other"
                required
                onChange={(e) =>
                  setEmployee({ ...employee, E_Gender: e.target.value }) // Correctly set gender value
                }
              />
              <label className="form-check-label" htmlFor="genderOther">
                Other
              </label>
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="inputCourse" className="form-label">
              Course (Optional)
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputCourse"
              placeholder="Enter Course"
              onChange={(e) =>
                setEmployee({ ...employee, E_Course: e.target.value })
              }
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">
              Select Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              name="E_Image"
              onChange={(e) =>
                setEmployee({ ...employee, E_Image: e.target.files[0] })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
