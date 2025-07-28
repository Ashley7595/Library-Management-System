import React from 'react'
import '../Style/Navbar.css'
import { Link } from 'react-router-dom'

function NavBar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg MainMenu">
                <div className="container">
                    <a className="navbar-brand menuTitle" href="#">Smart Library</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse menuList" id="navbarSupportedContent">
                        <ul className="navbar-nav navbarMenu">
                            <li className="nav-item">
                                <Link to='/' className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/About' className="nav-link">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/Contact' className="nav-link">Contact</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >
        </>
    )
}

export default NavBar