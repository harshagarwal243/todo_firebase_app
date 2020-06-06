import  React from 'react'
import { AuthContext } from '../Session'
import { Redirect , Route } from 'react-router-dom'
import * as Routes from '../constants/routes'


const PrivateRoute = ({component : Component, ...rest }) => {
    const {authUser} = React.useContext(AuthContext)
    return (
      <Route  {...rest}
      render = {props => (
          authUser   ? <Component  {...props} />
          : <Redirect  to={Routes.LANDING} />
      )}
      />
    )
}

export default PrivateRoute ;