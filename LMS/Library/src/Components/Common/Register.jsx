import React, { useState, useRef } from 'react'
import '../Style/Contact.css'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

function Register() {
    const fileInputRef = useRef();
    const navigate = useNavigate();
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [users, setUsers] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        subject: "",
        joinDate: getTodayDate(),
        username: "",
        password: "",
        dob: "",
        image: "",
        consent: false
    })

    const [errors, setErrors] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        subject: "",
        joinDate: "",
        membership: "",
        username: "",
        password: "",
        dob: "",
        image: "",
        consent: false
    })

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        let val = type === 'checkbox' ? checked : value;

        if (["fname", "lname", "subject"].includes(name)) {
            val = val.replace(/[^A-Za-z\s]/g, "");
        }

        if (name === "phone") {
            val = val.replace(/[^0-9-/]/g, "");
        }

        if (name === "email") {
            val = val.replace(/[^a-zA-Z0-9@._+-]/g, "");
        }

        setUsers((prev) => ({ ...prev, [name]: val }));

        let errorMessage = "";

        switch (name) {
            case "fname":
            case "lname":
                if (val.trim() === "") {
                    errorMessage = "This field is required";
                } else if (!/^[A-Za-z\s]+$/.test(val)) {
                    errorMessage = "Only alphabets allowed";
                }
                break;

            case "email":
                if (val.trim() === "") {
                    errorMessage = "This field is required";
                } else if (!/^\S+@\S+\.\S+$/.test(val)) {
                    errorMessage = "Invalid email address";
                }
                break;

            case "phone":
                const cleaned = val.replace(/[-/\s]/g, '');
                if (val.trim() === "") {
                    errorMessage = "Phone number is required";
                } else if (!/^(\d{3}[-/]?\d{3}[-/]?\d{4})$/.test(val)) {
                    errorMessage = "Phone must be in format 123-456-7890 or 123/456/7890";
                } else if (cleaned.length !== 10) {
                    errorMessage = "Phone number must be 10 digits";
                }
                break;

            case "subject":
                if (val.trim() === "") {
                    errorMessage = "This field is required";
                } else if (!/^[A-Za-z\s]+$/.test(val)) {
                    errorMessage = "Only alphabets allowed";
                }
                break;

            case "username":
                errorMessage = val.trim() === "" ? "This field is required" : "";
                break;

            case "password":
                if (val.trim() === "") {
                    errorMessage = "This field is required";
                } else if (!/(?=.*[A-Z])(?=.*\d).{8,}/.test(val)) {
                    errorMessage = "Min 8 chars, 1 number, 1 uppercase letter";
                }
                break;

            case "dob":
                if (val.trim() === "") {
                    errorMessage = "This field is required";
                } else {
                    const dob = new Date(val);
                    const age = new Date().getFullYear() - dob.getFullYear();
                    if (dob.getFullYear() < 1980 || dob.getFullYear() > 2025) {
                        errorMessage = "Year must be between 1980 and 2025";
                    } else if (age < 21) {
                        errorMessage = "Minimum age is 21 years";
                    }
                }
                break;

            case "consent":
                errorMessage = val ? "" : "Consent is required";
                break;

            default:
                break;
        }

        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage
        }));
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
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!users.image) {
            setErrors((prev) => ({ ...prev, image: "Profile image is required" }));
            alert("Please fill in all fields before submitting.");
            return;
        }

        for (let key in users) {
            if (
                users[key] === "" ||
                (key === "consent" && users[key] === false) ||
                errors[key]
            ) {
                alert("Please fill in all fields before submitting.");
                return;
            }
        }

        const formData = new FormData()
        formData.append("fname", users.fname);
        formData.append("lname", users.lname);
        formData.append("email", users.email);
        formData.append("phone", users.phone);
        formData.append("subject", users.subject);
        formData.append("joinDate", users.joinDate);
        formData.append("username", users.username);
        formData.append("password", users.password);
        formData.append("dob", users.dob);
        formData.append("image", users.image);

        axios.post("http://localhost:5001/addTeacher", formData)

            .then((result) => {
                console.log(result);
                toast.success("Form Submitted Successfully");
                navigate('/TeacherLogin')
                setUsers({
                    fname: "",
                    lname: "",
                    email: "",
                    phone: "",
                    subject: "",
                    joinDate: "",
                    username: "",
                    password: "",
                    dob: "",
                    image: "",
                    consent: false
                });
                setErrors({
                    fname: "",
                    lname: "",
                    email: "",
                    phone: "",
                    subject: "",
                    joinDate: "",
                    username: "",
                    password: "",
                    dob: "",
                    image: "",
                    consent: false
                });
                fileInputRef.current.value = null;
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error("Error in Form Submission");
                }
            })
    }

    return (
        <>
            <div className='container contact d-flex justify-content-center align-items-center'>
                <div className='col-lg-6'>
                    <form className='contactForm p-4 mb-5' onSubmit={handleSubmit}>
                        <div className='row'>
                            <h2 className='commonTitle pt-2 pb-2 text-center'>Teacher Registration</h2>
                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*First Name</label>
                                <input type="text" name='fname' className="form-control" value={users.fname} onChange={handleInput} />
                                {errors.fname && <div className="text-danger">{errors.fname}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Last Name</label>
                                <input type="text" name='lname' className="form-control" value={users.lname} onChange={handleInput} />
                                {errors.lname && <div className="text-danger">{errors.lname}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Email Address </label>
                                <input type="email" name='email' className="form-control" value={users.email} onChange={handleInput} />
                                {errors.email && <div className="text-danger">{errors.email}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Phone Number</label>
                                <input type="tel" name='phone' className="form-control" value={users.phone} placeholder="123-456-7890" onChange={handleInput} />
                                {errors.phone && <div className="text-danger">{errors.phone}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Subject</label>
                                <input type="text" name='subject' className="form-control" value={users.subject} onChange={handleInput} />
                                {errors.subject && <div className="text-danger">{errors.subject}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Joining Date</label>
                                <input type="date" name='joinDate' className="form-control" value={users.joinDate} readOnly onChange={handleInput} />
                                {errors.joinDate && <div className="text-danger">{errors.joinDate}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Username</label>
                                <input type="text" name='username' className="form-control" value={users.username} onChange={handleInput} />
                                {errors.username && <div className="text-danger">{errors.username}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Password</label>
                                <input type="password" name='password' className="form-control" value={users.password} onChange={handleInput} />
                                {errors.password && <div className="text-danger">{errors.password}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Date of Birth</label>
                                <input type="date" name='dob' className="form-control" value={users.dob} onChange={handleInput} min="1980-01-01"
                                    max="2025-12-31" />
                                {errors.dob && <div className="text-danger">{errors.dob}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Profile</label>
                                <input type='file' name='image' className="form-control" onChange={handleFile} ref={fileInputRef} />
                                {errors.image && <div className="text-danger">{errors.image}</div>}
                            </div>

                            <div className="col-lg-12 mb-3 mt-3 consent-box">
                                <div className="form-check">
                                    <input className="form-check-input visible-checkbox" type="checkbox" name="consent" checked={users.consent} onChange={handleInput} />
                                    <label className="form-check-label" htmlFor="consent">I consent to having this website store my submitted information.</label>
                                </div>
                                {errors.consent && <div className="text-danger">{errors.consent}</div>}
                            </div>

                            <div align="center">
                                <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            </div>
                        </div>
                    </form>
                    <ToastContainer position="top-center" autoClose={3000} />
                </div>
            </div>
        </>
    )
}

export default Register