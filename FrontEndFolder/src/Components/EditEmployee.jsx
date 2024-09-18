import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
  const [employee, setEmployee] = useState({
    E_Name: "",
    E_Email: "",
    E_Mobile: "",
    E_Designation: "",
    E_Gender: "",
    E_Course: "",
    E_Image: null,
  });
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Get employee ID from URL

  useEffect(() => {
    // Fetch employee details based on the employee ID
    axios
      .get(`http://localhost:3000/auth/employee/${id}`)
      .then((result) => {
        if (result.data && result.data.Status) {
          // Set employee state with retrieved data
          setEmployee({
            E_Name: result.data.Result.E_Name,
            E_Email: result.data.Result.E_Email,
            E_Mobile: result.data.Result.E_Mobile,
            E_Designation: result.data.Result.E_Designation,
            E_Gender: result.data.Result.E_Gender,
            E_Course: result.data.Result.E_Course,
            E_Image: result.data.Result.E_Image || null, // Set image or null
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching employee data:", err);
        setResponseMessage("An error occurred while fetching employee data.");
      });
  }, [id]); // Use 'id' as the dependency to trigger the effect when the id changes

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("E_Name", employee.E_Name);
    formData.append("E_Email", employee.E_Email);
    formData.append("E_Mobile", employee.E_Mobile);
    formData.append("E_Designation", employee.E_Designation);
    formData.append("E_Gender", employee.E_Gender);
    formData.append("E_Course", employee.E_Course);
    if (employee.E_Image) {
      formData.append("E_Image", employee.E_Image);
    }

    axios
      .put(`http://localhost:3000/auth/employee/edit_employee/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        if (result.data.Status) {
          setResponseMessage("Employee updated successfully!");
          navigate("/dashboard/employee");
        } else {
          setResponseMessage(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error updating employee:", err);
        setResponseMessage("An error occurred while updating the employee.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
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
              value={employee.E_Name}
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
              value={employee.E_Email}
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
              value={employee.E_Mobile}
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
              value={employee.E_Designation}
              onChange={(e) =>
                setEmployee({ ...employee, E_Designation: e.target.value })
              }
            >
              <option value="">Select Designation</option>
              <option value="Trainee">Trainee</option>
              <option value="Developer">Developer</option>
              <option value="Manager">Manager</option>
              {/* Add other designations if needed */}
            </select>
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
                checked={employee.E_Gender === "Male"}
                required
                onChange={(e) =>
                  setEmployee({ ...employee, E_Gender: e.target.value })
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
                checked={employee.E_Gender === "Female"}
                required
                onChange={(e) =>
                  setEmployee({ ...employee, E_Gender: e.target.value })
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
                checked={employee.E_Gender === "Other"}
                required
                onChange={(e) =>
                  setEmployee({ ...employee, E_Gender: e.target.value })
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
              value={employee.E_Course}
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
              onChange={(e) =>
                setEmployee({ ...employee, E_Image: e.target.files[0] })
              }
            />
            {employee.E_Image && (
              <div className="mt-2">
                <p>Current Image: {employee.E_Image.name}</p>
                {/* You can also show a preview if needed */}
              </div>
            )}
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100 rounded-0">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
