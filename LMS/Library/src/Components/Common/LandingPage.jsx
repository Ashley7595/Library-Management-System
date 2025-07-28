import React from 'react'
import { Link } from 'react-router-dom'
import '../Style/LandingPage.css'
import recommendation from "../../assets/ai-recommendation.png"
import secure from "../../assets/secure.png"

function LandingPage() {
    return (
        <>
            <div className='Landing'>
                <div className='landingContent container py-5'>
                    <div className='text-center text-light'>
                        <h1 className='landingTitle display-4'>Welcome to SmartLibrary</h1>
                        <p className='landingPara mx-auto w-75'>
                            Your All-in-One Solution for Efficient Library Management. Whether you're managing a school, public, or personal library,
                            SmartLibrary helps streamline book tracking, member services, and real-time analytics.
                        </p>
                        <div className="landingButtons mt-4">
                            <div className="dropdown">
                                <button
                                    className="loginDropdownBtn"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Login
                                </button>

                                <ul className="dropdown-menu Landingdropdown">
                                    <li><Link className="dropdown-item" to='/Login'>Admin</Link></li>
                                    <li><Link className="dropdown-item" to='./TeacherLogin'>Teacher</Link></li>
                                    <li><Link className="dropdown-item" to='./StudentLogin'>Student</Link></li>
                                </ul>
                            </div>

                            <button className="registerBtn"><Link className="dropdown-item" to='/Register'>Register</Link></button>
                        </div>

                    </div>

                    <div className='row mt-5 text-light'>
                        <div className='col-md-3 text-center'>
                            <i className="bi bi-book-half display-4"></i>
                            <h4 className='mt-3'>Catalog Management</h4>
                            <p>Organize books by genre, author, or ISBN. Maintain accurate inventory with ease.</p>
                        </div>
                        <div className='col-md-3 text-center'>
                            <i className="bi bi-arrow-left-right display-4"></i>
                            <h4 className='mt-3'>Borrow & Return</h4>
                            <p>Seamlessly track issued books, due dates, and return reminders for users.</p>
                        </div>
                        <div className='col-md-3 text-center'>
                            <i className="bi bi-people display-4"></i>
                            <h4 className='mt-3'>User Management</h4>
                            <p>Manage members, assign roles, and monitor activity with detailed logs.</p>
                        </div>
                        <div className='col-md-3 text-center'>
                            <i className="bi bi-bar-chart-line display-4"></i>
                            <h4 className='mt-3'>Analytics</h4>
                            <p>Track popular books, overdue records, and performance through dynamic charts.</p>
                        </div>
                    </div>


                    <div className='row mt-5 text-light align-items-center flex-md-row-reverse'>
                        <div className='col-md-6'>
                            <h3 className='landingTitle'>AI-Based Book Recommendations</h3>
                            <p className='landingPara'>
                                SmartLibrary learns from user preferences and borrowing history to suggest the best reads. Keep your readers engaged
                                with personalized and intelligent recommendations.
                            </p>
                        </div>
                        <div className='col-md-6 text-center'>
                            <img src={recommendation} alt="AI Book Suggestions" className="imgLanding" />
                        </div>
                    </div>

                    <div className='row mt-5 text-light align-items-center'>
                        <div className='col-md-6'>
                            <h3 className='landingTitle'>Access Control & Data Security</h3>
                            <p className='landingPara'>
                                Role-based access ensures that librarians, members, and admins have the right permissions. All transactions and personal data
                                are encrypted and securely stored.
                            </p>
                        </div>
                        <div className='col-md-6 text-center'>
                            <img src={secure} alt="Secure Access" className="imgLanding" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default LandingPage