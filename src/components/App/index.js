import React , {  Component } from 'react'
import {  BrowserRouter as Router , Route , Switch } from 'react-router-dom'

import Navigation from '../Navigation'
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import * as ROUTES from '../constants/routes';


import { FirebaseContext } from '../Firebase'
import {  AuthContext } from '../Session'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'

class App extends Component {

    static contextType = FirebaseContext
    state = { authUser : JSON.parse(localStorage.getItem("auth")), newBase : false }
   

    setStateSynchronous = (stateUpdate)  => {
       
    
      return new Promise(resolve => {
          
          this.setState(stateUpdate, () => resolve());
      });
    }
   

    componentDidMount() {
        // console.log("COMPONENT DID MOUNT")
        
      this.listener =   this.context.auth.onAuthStateChanged(authUser => {
          
           authUser ? 
           this.setStateSynchronous({ authUser : { email : authUser.email , 
            displayName : authUser.displayName , uid : authUser.uid , 
          role : this.state.authUser ? this.state.authUser.role : null , 
        emailVerified : authUser.emailVerified  }}).then(() => {
            this.context.user(this.state.authUser.uid).once('value').then(snapshot => {
              if(snapshot.val() !== null)
               {
                 const dbUser = snapshot.val();
                 const { role , username , email} = dbUser
                 const {   uid , emailVerified} = this.state.authUser
                 const  auth = { email , displayName : username , role , emailVerified , uid}
                
                 this.setStateSynchronous({ authUser : auth })
                 .then(() => { localStorage.setItem("auth",JSON.stringify(auth))})
               }
               
               })
           }) : this.setStateSynchronous({ authUser : null }).then(() => { localStorage.removeItem("auth")})
         
       })
     
    }

    componentDidUpdate()
    { 
      
      if(this.state.newBase === true && this.state.authUser !==null)
       {
        this.context.user(this.state.authUser.uid).once('value').then(snapshot => {
        
           
             const dbUser = snapshot.val();
             const { role , username , email } = dbUser
             const { uid, emailVerified } = this.state.authUser
             const  auth = { email , displayName : username , role , uid , emailVerified }
             localStorage.setItem("auth",JSON.stringify(auth))
             this.setState({ authUser : auth , newBase : false })
             
           })

       }
    }

    

    componentWillUnmount() {

        this.listener() 
    }

    render(){
        return (
            <AuthContext.Provider value={{authUser : this.state.authUser , setAuthUser : this.setStateSynchronous ,update : this.setState}}>
            <Router>
                <div style={{position : "sticky" , top : "0px" , zIndex : "2"}}>
                <Navigation />
                </div>
                
              
             <Switch>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
                <PrivateRoute path={ROUTES.HOME} component={HomePage} />
                <PrivateRoute path={ROUTES.ACCOUNT} component={AccountPage} />
                <AdminRoute path={ROUTES.ADMIN} component={AdminPage} />
              </Switch>
             
            </Router>
            </AuthContext.Provider>
         )
    }
}

export default App;