import { useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Header from "./Global/Header";

function AddStudent() {
  const primaryColorDark = "#303030";
  const primaryColorLight = "#ffffff";
  const greenAccentColor = "#00c853";
  const greenAccentHoverColor = "#00a142";

  const isDarkMode = false;
  const currentBackgroundColor = isDarkMode ? primaryColorDark : primaryColorLight;

  const fileInputRef = useRef();
  const todayDate = new Date().toISOString().split("T")[0];
  const currentYear = new Date().getFullYear();

  const [imagePreview, setImagePreview] = useState(null);
  const [users, setUsers] = useState({
    fname: "",
    lname: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    studclass: "",
    rollNumber: "",
    username: "",
    password: "",
    joinDate: todayDate,
    image: "",
  });

  const [errors, setErrors] = useState({});

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;

    if (["fname", "lname"].includes(name)) {
      val = val.replace(/[^A-Za-z\s]/g, "");
    }

    if (name === "phone" || name === "studclass") {
      val = val.replace(/[^\d]/g, "");
    }

    if (name === "email") {
      val = val.replace(/[^a-zA-Z0-9@._+-]/g, "");
    }

    setUsers((prev) => ({ ...prev, [name]: val }));

    switch (name) {
      case "fname":
      case "lname":
      case "gender":
      case "username":
        setErrors((prev) => ({
          ...prev,
          [name]: val.trim() === "" ? "This field is required" : "",
        }));
        break;

      case "dob":
        if (!val) {
          setErrors((prev) => ({ ...prev, dob: "Date of birth is required" }));
        } else {
          const dobDate = new Date(val);
          const age = currentYear - dobDate.getFullYear();
          const hasHadBirthday =
            new Date().getMonth() > dobDate.getMonth() ||
            (new Date().getMonth() === dobDate.getMonth() &&
              new Date().getDate() >= dobDate.getDate());
          const actualAge = hasHadBirthday ? age : age - 1;

          setErrors((prev) => ({
            ...prev,
            dob:
              actualAge >= 5 && actualAge <= 18
                ? ""
                : "Age must be between 5 and 18 years",
          }));
        }
        break;

      case "studclass":
        if (!/^\d+$/.test(val)) {
          setErrors((prev) => ({
            ...prev,
            studclass: "Only numbers are allowed for class",
          }));
        } else {
          const classNum = parseInt(val, 10);
          setErrors((prev) => ({
            ...prev,
            studclass:
              classNum >= 1 && classNum <= 12
                ? ""
                : "Class must be between 1 and 12",
          }));
        }
        break;

      case "rollNumber":
        const rollNum = parseInt(val);
        setErrors((prev) => ({
          ...prev,
          rollNumber:
            rollNum >= 1 && rollNum <= 1000
              ? ""
              : "Roll number must be between 1 and 1000",
        }));
        break;

      case "email":
        const emailPattern = /^\S+@\S+\.\S+$/;
        setErrors((prev) => ({
          ...prev,
          email: emailPattern.test(val) ? "" : "Invalid email address",
        }));
        break;

      case "phone":
        const phoneValid = /^\d{10}$/.test(val);
        setErrors((prev) => ({
          ...prev,
          phone: phoneValid ? "" : "Phone must contain exactly 10 digits",
        }));
        break;

      case "password":
        setErrors((prev) => ({
          ...prev,
          password:
            val.trim() === ""
              ? "This field is required"
              : !/(?=.*[A-Z])(?=.*\d).{8,}/.test(val)
              ? "Password must be at least 8 characters, include a number and an uppercase letter"
              : "",
        }));
        break;

      case "joinDate":
        const selectedYear = new Date(val).getFullYear();
        setErrors((prev) => ({
          ...prev,
          joinDate:
            selectedYear === currentYear
              ? ""
              : "Join Date must be in the current year",
        }));
        break;

      default:
        break;
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErrors((prev) => ({ ...prev, image: "Profile image is required" }));
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only JPG/PNG images allowed" }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 2MB" }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setUsers((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!users.image) {
      setErrors((prev) => ({ ...prev, image: "Profile image is required" }));
      alert("Please fill in all fields before submitting.");
      return;
    }

    for (let key in users) {
      if (users[key] === "" || errors[key]) {
        alert("Please fill in all fields correctly before submitting.");
        return;
      }
    }

    const teacherId = localStorage.getItem("teacherId");
    if (!teacherId) {
      alert("Teacher ID is missing. Please log in again.");
      return;
    }

    const formData = new FormData();
    Object.entries(users).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("teacherId", teacherId);

    axios
      .post("http://localhost:5001/addStudent", formData)
      .then(() => {
        toast.success("Form Submitted Successfully");
        setUsers({
          fname: "",
          lname: "",
          dob: "",
          gender: "",
          email: "",
          phone: "",
          studclass: "",
          rollNumber: "",
          username: "",
          password: "",
          joinDate: todayDate,
          image: "",
        });
        setErrors({});
        setImagePreview(null);
        fileInputRef.current.value = null;
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error in Form Submission");
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="p-3 mb-2 mt-4">
        <div className="mb-4 text-center">
          <Header title="Add Student" subtitle="Enter student details below" />
        </div>

        <div
          className="mx-auto p-4 rounded-4 shadow"
          style={{
            maxWidth: "900px",
            backgroundColor: currentBackgroundColor,
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {[
                { label: "First Name", id: "fname" },
                { label: "Last Name", id: "lname" },
                { label: "Date of Birth", id: "dob", type: "date" },
                {
                  label: "",
                  id: "gender",
                  type: "select",
                  options: ["Male", "Female", "Other"],
                },
                { label: "Email", id: "email", type: "email" },
                { label: "Phone Number", id: "phone", type: "tel" },
                { label: "Class", id: "studclass" },
                { label: "Roll Number", id: "rollNumber", type: "number" },
                { label: "Username", id: "username" },
                { label: "Password", id: "password", type: "password" },
                { label: "Join Date", id: "joinDate", type: "date" },
              ].map(({ label, id, type = "text", options }) => (
                <div className="col-12 col-sm-6" key={id}>
                  <div className={type === "select" ? "" : "form-floating"}>
                    {type === "select" ? (
                      <select
                        className="form-select"
                        id={id}
                        name={id}
                        value={users[id]}
                        onChange={handleInput}
                      >
                        <option value="">Select Gender</option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        className="form-control"
                        id={id}
                        name={id}
                        placeholder={label}
                        value={users[id]}
                        onChange={handleInput}
                        max={id === "joinDate" ? todayDate : undefined}
                      />
                    )}
                    {type !== "select" && <label htmlFor={id}>{label}</label>}
                  </div>
                  {errors[id] && (
                    <div className="text-danger mt-1" style={{ fontSize: "0.85em" }}>
                      {errors[id]}
                    </div>
                  )}
                </div>
              ))}

              <div className="col-12 col-sm-6">
                <div className="mb-3">
                  <label htmlFor="profileImage" className="form-label">
                    Profile Picture
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    name="image"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleFile}
                    ref={fileInputRef}
                  />
                  {errors.image && (
                    <div className="text-danger mt-1" style={{ fontSize: "0.85em" }}>
                      {errors.image}
                    </div>
                  )}
                </div>
              </div>

              {imagePreview && (
                <div className="col-12 text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      borderRadius: "8px",
                      marginTop: "10px",
                      objectFit: "cover",
                    }}
                    className="img-thumbnail"
                  />
                </div>
              )}

              <div className="col-12 text-center">
                <button
                  type="submit"
                  className="btn btn-lg fw-bold rounded-3"
                  style={{
                    padding: "10px 32px",
                    fontSize: "16px",
                    backgroundColor: greenAccentColor,
                    borderColor: greenAccentColor,
                    color: "#fff",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = greenAccentHoverColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = greenAccentColor)
                  }
                >
                  Add Student
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddStudent;
