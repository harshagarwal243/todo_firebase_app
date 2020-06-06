import React from 'react'
import {FirebaseContext } from '../Firebase'
import { withRouter } from 'react-router-dom'
import * as Routes from '../constants/routes'

const SignOutButton = (props) => {
    
    const firebase = React.useContext(FirebaseContext)
    const  handleClick = () => {
        firebase.doSignOut();
        localStorage.removeItem("auth")
        props.history.push(Routes.LANDING)
    }
    return (
        <span onClick = {handleClick} className="nav-link">Sign Out</span>
    )
}

export default withRouter(SignOutButton) ;