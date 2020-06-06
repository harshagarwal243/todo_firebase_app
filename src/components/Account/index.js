import React, { useContext } from 'react'
import PasswordChange from '../PasswordChange'
import * as Roles from '../constants/roles'
import * as Routes from '../constants/routes'
import { Switch , Route  , NavLink as Link} from 'react-router-dom'
import UpdateProfile from './updateprofile'
import { AuthContext } from '../Session'
import { FirebaseContext } from '../Firebase'

export default function Account(props) {
        let {authUser } =  useContext(AuthContext)
    const firebase = useContext(FirebaseContext)

    const handleClick = e => {
        firebase.doVerifyEmail().then(
            () => {
                alert("Verification Email has been sent to you \n Please reload after verifying")
            }
        )
        .catch(
            err => {
                alert(`err occured`)
            }
        )
    }

    return (
        <div>
            <div className="Container-fluid">
                <div className="row">
                    <div className="col-md-8 offset-md-2 py-4 mt-2 bg-warning">
                     
                    { authUser.role === Roles.ADMIN &&
                       <p className="text-light font-weight-bolder text-center bg-dark p-2"> Hi Admin </p> }
                    <p className="text-light font-weight-bold  text-center"
                    style={{ fontSize : "160%"}}>Username : {authUser.displayName}</p>
                    <p className="text-light font-weight-bold  text-center"
                    style={{ fontSize : "160%"}}>Email : {authUser.email}</p>
                    <p className="text-light font-weight-bold  text-center" style={{ fontSize : "160%"}}>
                              Email Verified : {"" + authUser.emailVerified}</p>
                    { !authUser.emailVerified &&
                          <button className="btn btn-block btn-primary"
                          onClick={handleClick}>Verify Your Email</button>} 
                    <p className="text-right"><Link to={Routes.UPDATE_ACCOUNT} exact 
                      activeStyle={{color : "black"}}  className="font-weight-bold tex-muted"
                     > UPDATE PROFILE</Link></p>
                              
                    <p className="text-left"><Link to={Routes.PASSWORD_CHANGE} exact 
                      activeStyle={{color : "black"}}  className="font-weight-bold tex-muted"
                     > CHANGE PASSWORD </Link></p>
                    </div>
                </div>
            </div>
              <Switch>
                  <Route  path={Routes.PASSWORD_CHANGE}
                   render ={() => (<PasswordChange email={authUser.email} goBack={props.history.goBack}/>)} />
                   <Route  path={Routes.UPDATE_ACCOUNT}
                   render ={() => (<UpdateProfile user={authUser} goBack={props.history.goBack}/>)} />
              </Switch>
             
        </div>
    )
}
