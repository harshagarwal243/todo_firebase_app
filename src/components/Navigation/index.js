import { NavLink as Link } from 'react-router-dom'
import React from 'react';

import * as Routes from '../constants/routes'
import SignOut from '../SignOut'
import './Navbar.css'

import { AuthContext } from '../Session'
 import * as Roles from '../constants/roles'


const Navigation = () =>{ 
     
    const {authUser} = React.useContext(AuthContext)

    return(
    authUser ? (authUser.role === Roles.ADMIN  ? <NavigationAdmin /> : <NavigationAuth  /> ) : <NavigationNonAuth />)
 }

const NavigationAdmin = () => (
    
    <ul className="nav  bg-dark">
        <li className="nav-item">
            <Link to={Routes.LANDING} className="nav-link "  exact>Home</Link>
        </li>
        <li className="nav-item">
            <Link to={Routes.HOME} className="nav-link " >Main</Link>
        </li>
        <li className="nav-item">
            <Link to={Routes.ACCOUNT} className="nav-link " >Account</Link>
        </li>
        <li className="nav-item">
            <Link to={Routes.ADMIN} className="nav-link " >Admin</Link>
        </li>
        <li className="nav-item">
            <SignOut />
        </li>
    </ul>

)

const NavigationAuth = () =>  (
    
    <ul className="nav  bg-dark">
        <li className="nav-item">
            <Link to={Routes.LANDING} className="nav-link "  exact>Home</Link>
        </li>
        <li className="nav-item">
            <Link to={Routes.HOME} className="nav-link " >Main</Link>
        </li>
        <li className="nav-item">
            <Link to={Routes.ACCOUNT} className="nav-link " >Account</Link>
        </li>
        <li className="nav-item">
            <SignOut />
        </li>
    </ul>

)

const NavigationNonAuth = () =>  (
    
    <ul className="nav  bg-dark">
        <li className="nav-item">
            <Link to={Routes.SIGN_IN} className="nav-link "  >Sign In</Link>
        </li>
        <li className="nav-item">
            <Link to={Routes.LANDING} className="nav-link "  exact>Home</Link>
        </li>
       
    </ul>

)



export default  Navigation ;