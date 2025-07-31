import React, { useState, useRef } from 'react'
import '../Style/Contact.css'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

function Contact() {
    const fileInputRef = useRef();
    const navigate = useNavigate();

    const [users, setUsers] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        subject: "",
        inquiry: "",
        image: "",
        contactMethod: "",
        consent: false
    })

    const [errors, setErrors] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        subject: "",
        inquiry: "",
        image: "",
        contactMethod: "",
        consent: ""
    })

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        let val = type === "checkbox" ? checked : value;

        if (["fname", "lname"].includes(name)) {
            val = val.replace(/[^A-Za-z\s]/g, "");
        }

        if (name === "inquiry") {
            val = val.replace(/[^A-Za-z0-9\s.,!?'"-]/g, "");
        }

        if (name === "email") {
            val = val.replace(/[^a-zA-Z0-9@._+-]/g, "");
        }

        if (name === "phone") {
            val = val.replace(/[^\d]/g, "").slice(0, 10); 
        }

        setUsers({ ...users, [name]: val });

        switch (name) {
            case "fname":
            case "lname":
                setErrors((prev) => ({
                    ...prev,
                    [name]: val.trim() === ""
                        ? "This field is required"
                        : /^[A-Za-z\s]+$/.test(val)
                            ? ""
                            : "Only alphabets allowed",
                }));
                break;

            case "inquiry":
                setErrors((prev) => ({
                    ...prev,
                    inquiry: val.trim() === ""
                        ? "This field is required"
                        : /[A-Za-z]/.test(val)
                            ? ""
                            : "Must contain at least one letter",
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
                const phonePattern = /^\d{10}$/;
                setErrors((prev) => ({
                    ...prev,
                    phone: phonePattern.test(val)
                        ? ""
                        : "Phone number must be 10 digits",
                }));
                break;

            case "subject":
                setErrors((prev) => ({
                    ...prev,
                    subject: val.trim() === ""
                        ? "This field is required"
                        : "",
                }));
                break;

            case "contactMethod":
                setErrors((prev) => ({
                    ...prev,
                    contactMethod: val ? "" : "Select a contact method",
                }));
                break;

            case "consent":
                setErrors((prev) => ({
                    ...prev,
                    consent: val ? "" : "Consent is required",
                }));
                break;

            default:
                break;
        }
    };



    const handleFile = (e) => {
        setUsers({ ...users, image: e.target.files[0] })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formErrors = {};

        if (!users.fname.trim()) formErrors.fname = "First name is required";
        if (!users.lname.trim()) formErrors.lname = "Last name is required";

        const emailPattern = /^\S+@\S+\.\S+$/;
        if (!users.email.trim()) formErrors.email = "Email is required";
        else if (!emailPattern.test(users.email)) formErrors.email = "Invalid email address";

        const phonePattern = /^\d{10}$/;
        if (!users.phone.trim()) formErrors.phone = "Phone number is required";
        else if (!phonePattern.test(users.phone)) formErrors.phone = "Phone must be 10 digits";

        if (!users.subject.trim()) formErrors.subject = "Subject is required";

        if (!users.inquiry.trim()) formErrors.inquiry = "Inquiry is required";
        else if (!/[A-Za-z]/.test(users.inquiry)) formErrors.inquiry = "Must contain at least one letter";

        if (!users.contactMethod) formErrors.contactMethod = "Select a contact method";

        if (!users.consent) formErrors.consent = "You must accept the consent checkbox";

        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
            toast.error("Please fix the errors in the form");
            return;
        }

        const formData = new FormData();
        formData.append("fname", users.fname);
        formData.append("lname", users.lname);
        formData.append("email", users.email);
        formData.append("phone", users.phone);
        formData.append("subject", users.subject);
        formData.append("inquiry", users.inquiry);
        formData.append("image", users.image);
        formData.append("contactMethod", users.contactMethod);
        formData.append("consent", users.consent);

        axios.post("http://localhost:5001/addComplaints", formData)
            .then((result) => {
                console.log(result);
                toast.success("Form Submitted Successfully");

                setTimeout(() => {
                    navigate('/');
                }, 2000);

                setUsers({
                    fname: "",
                    lname: "",
                    email: "",
                    phone: "",
                    subject: "",
                    inquiry: "",
                    image: "",
                    contactMethod: "",
                    consent: false
                });

                setErrors({});
                fileInputRef.current.value = null;
            })
            .catch((error) => {
                console.log(error);
                toast.error("Error in Form Submission");
            });
    };


    return (
        <>
            <div className='container contact d-flex justify-content-center align-items-center'>
                <div className='col-lg-6'>
                    <form className='contactForm p-4 mb-5' onSubmit={handleSubmit}>
                        <div className='row'>
                            <h2 className='commonTitle pt-2 pb-2'>Get In Touch</h2>
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
                                <input type="tel" name='phone' className="form-control" value={users.phone} onChange={handleInput} />
                                {errors.phone && <div className="text-danger">{errors.phone}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Subject</label>
                                <select name="subject" className="form-select" value={users.subject} onChange={handleInput}>
                                    <option value="">Select a subject</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="Feedback">Feedback / Suggestions</option>
                                    <option value="Book Donation">Book Donation</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.subject && <div className="text-danger">{errors.subject}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">*Inquiry</label>
                                <textarea className="form-control" name='inquiry' value={users.inquiry} onChange={handleInput}></textarea>
                                {errors.inquiry && <div className="text-danger">{errors.inquiry}</div>}
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label className="form-label">Attachment Upload (optional)</label>
                                <input type='file' name='image' className="form-control" onChange={handleFile} ref={fileInputRef} />
                            </div>

                            <div className="col-lg-6 mb-3">
                                <div className="mb-2">
                                    <label className="form-label d-block">*Preferred Contact Method</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input visible-radio" type="radio" name="contactMethod" value="Email" checked={users.contactMethod === "Email"} onChange={handleInput} />
                                    <label className="form-check-label">Email</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input visible-radio" type="radio" name="contactMethod" value="Phone" checked={users.contactMethod === "Phone"} onChange={handleInput} />
                                    <label className="form-check-label">Phone</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input visible-radio" type="radio" name="contactMethod" value="Either" checked={users.contactMethod === "Either"} onChange={handleInput} />
                                    <label className="form-check-label">Either</label>
                                </div>
                                {errors.contactMethod && <div className="text-danger">{errors.contactMethod}</div>}
                            </div>

                            <div className="col-lg-12 mb-3 mt-3 consent-box">
                                <div className="form-check">
                                    <input className="form-check-input visible-checkbox" type="checkbox" name="consent" checked={users.consent} onChange={handleInput} />
                                    <label className="form-check-label">I consent to having this website store my submitted information.</label>
                                </div>
                                {errors.consent && <div className="text-danger">{errors.consent}</div>}
                            </div>

                            <div align="center">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </form>
                    <ToastContainer position="top-center" />
                </div>
            </div>
        </>
    )
}

export default Contact