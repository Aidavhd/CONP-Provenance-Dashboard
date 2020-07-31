import React from 'react'
import { Link, NavLink } from 'react-router-dom'


const NavBar = () => {
    return (
            <nav className="nav-wrapper blue-grey darken-3">
            <div className="container">
                <a className="brand-logo">CONP Provenance Dashboard</a>
                <ul className="right">
                    <li><Link to="/">Dashboard</Link></li>
                    <li><NavLink to="/recommender">Recommender</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                </ul>
            </div>
        </nav>
        
    )   
}

export default NavBar




