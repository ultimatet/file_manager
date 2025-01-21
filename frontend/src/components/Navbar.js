import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="nav-container">
            <div className={`Navbar-overlay ${isOpen ? 'open' : ''}`} />
            <button onClick={toggle} className="nav-toggle">
                Menu
            </button>
            <nav className={`Navbar ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li>
                        <Link to="/User">Home</Link> 
                    </li>
                    <li>
                        <Link to="/About">About</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
} 

export default Navbar;