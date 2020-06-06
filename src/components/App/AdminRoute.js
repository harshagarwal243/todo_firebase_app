import  React from 'react'
import { AuthContext } from '../Session'
import { Redirect , Route } from 'react-router-dom'
import * as Routes from '../constants/routes'
 import * as Roles from '../constants/roles'


const AdminRoute = ({component : Component, ...rest }) => {
    const {authUser} = React.useContext(AuthContext)
    return (
      <Route  {...rest}
      render = {props => (
          authUser  ? ( authUser.role === Roles.ADMIN  ?  <Component  {...props} /> : 
              <React.Fragment>
               { alert("You are not admin")}
               <Redirect to={Routes.HOME} />
               </React.Fragment>
           )
          : <Redirect  to={Routes.SIGN_IN} />
      )}
      />
    )
}

export default AdminRoute ;