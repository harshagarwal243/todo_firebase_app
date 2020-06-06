import React , { Component } from 'react'
import {  withRouter} from 'react-router-dom'
import { FirebaseContext } from '../Firebase'

import * as Routes from '../constants/routes'
import { SignUpLink } from '../SignUp'
import { PasswordForgetLink } from '../PasswordForget'
import { AuthContext } from '../Session'
import * as Roles from '../constants/roles'

const SignInPage = () => (
    <div className="container-fluid">
        <div className="row ">
             <div className="col-md-8 offset-md-2 text-center text-break">
                 <h1 className="mb-4  py-2 ">SignIn Form</h1>
                  <SignInForm />
                  <p className="text-center text-muted w-100 p-2 my-2">OR</p>
                  <SignInGoogle />
                  {/* <SignInFacebook /> */}
                  <PasswordForgetLink />
                  <SignUpLink />
             </div>
        </div>
    </div>
)


const INITIAL_STATE = {
    password: '',
    email: '',
    error: null,
    success : false,
    loading : false 
}



class SignInFormBase  extends Component {

   static contextType = FirebaseContext

   state = {...INITIAL_STATE };

   setAuthUser = null

   handleSubmit = event => { 
       event.preventDefault();
       this.setState({loading : true , error : false})
       this.context
               .doSignInWithEmailAndPassword(this.state.email, this.state.password)
               .then(authUser => { 
                                  console.log("SOCIAL AUTH USER",authUser);
                                  this.setState({ ...INITIAL_STATE , success : true});
                                   this.setAuthUser({ authUser}).then(() => { this.props.history.push(Routes.ACCOUNT);}) 
                                 })
               .catch(error => {
                                 this.setState({ error , loading : false });
                               });
       
   }

   handleChange = event => {
       const change = { [event.target.name] : event.target.value }
       this.setState( p => ({...p , ...change }))
   }
    
  
    render() {
        
        
        const {password , email  , error , success , loading } = this.state

        return (
            <AuthContext.Consumer>
                {
                    value => {
                        this.setAuthUser = value.setAuthUser;
                        return (
                            <React.Fragment>
                             { loading && <p className="text-dark p-2 my-2 bg-light text-center">Loading........</p>}
                            { success && <p className="alert alert-success">Successfully Signed In !</p>}
                            { error &&  <p className="alert alert-danger">{error.message}</p> }
                            <form onSubmit={this.handleSubmit}>
                              
                              <div className="form-group text-left">
                                  <label>Email Address</label>
                                  <input  type="email" className="form-control"  onChange={(e) => { this.handleChange(e)}} 
                                  name="email" value={email} pattern="^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-_]+\.[a-zA-Z]{2,}$"
                                  title="Enter a valid email" disabled={loading}/>
                              </div>
                              <div className="form-group text-left">
                                  <label>Password</label>
                                  <input  type="password" className="form-control"  onChange={(e) => { this.handleChange(e)}} 
                                  name="password" value={password} disabled={loading} />
                              </div>
                              <button className="btn btn-primary btn-block" type="submit" disabled={loading} >Sign In</button>
                             
                            </form>
                            </React.Fragment>
                        )
                    }
                }
            </AuthContext.Consumer>
        )
    }
}

class SignInGoogleBase extends Component {
    state = { error : false}
    static contextType = FirebaseContext
   
    setAuthUser = () => {}

    handleSubmit = (e) => {
            e.preventDefault();
            this.context.doSignInWithGoogle()
            .then( authUser => {
                
                return this.context.users().once('value').then(snapshot => {
                    let users = snapshot.val();
                    console.log("USERS : ",users)
                    if( users && users[authUser.user.uid])
                     { 
                         console.log("ALREADY EXIST A USER ",users[authUser.user.uid]);
                     }
                     else {
                         console.log("NO SUCH USER");
                         let role = Roles.USER ;
                         this.context.user(authUser.user.uid)
                         .set({
                             username : authUser.user.displayName ,
                             email : authUser.user.email ,
                             role,
                           
                         }).then(() => {
                             console.log("SIGIN BASE ")
                              this.setAuthUser({ newBase : true})})
                     }
                     return authUser;
                })
            })
            .then(authUser => {
                console.log("SOCIAL AUTH USER",authUser.user.uid);
                this.props.history.push(Routes.ACCOUNT);
            })
            .catch( error => {
                this.setState({ error })
            })
    }

    render() {
        
       
        const { error } = this.state

        return (
            <AuthContext.Consumer>
                {
                    value => {
                        this.setAuthUser = value.setAuthUser;
                        return (
                            <React.Fragment>
                             
                            { error &&  <p className="alert alert-danger">{error.message}</p> }
                            <form onSubmit={this.handleSubmit} className="mb-2">
                              <button className="btn btn-dark btn-block text-light font-weight-bold p-2"
                               type="submit" >Sign In With Google</button>
                            </form>
                            </React.Fragment>
                        )
                    }
                }
            </AuthContext.Consumer>
        )

            }
}

// class SignInFacebookBase extends Component {
//     state = { error : false}
//     static contextType = FirebaseContext
   
//     setAuthUser = () => {}

//     handleSubmit = (e) => {
//             e.preventDefault();
//             this.context.doSignInWithFacebook()
//             .then(socialauthUser => {
//                 console.log("SOCIAL AUTH USER",socialauthUser.user.uid);
//                 this.setAuthUser({ socialauthUser}).then(() => { this.props.history.push(Routes.ACCOUNT);})
//             })
//             .catch( error => {
//                 this.setState({ error })
//             })
//     }

//     render() {
        
       
//         const { error } = this.state

//         return (
//             <AuthContext.Consumer>
//                 {
//                     value => {
//                         this.setAuthUser = value.setAuthUser;
//                         return (
//                             <React.Fragment>
                             
//                             { error &&  <p className="alert alert-danger">{error.message}</p> }
//                             <form onSubmit={this.handleSubmit}>
//                               <button className="btn btn-dark btn-block text-light font-weight-bold p-2"
//                                type="submit" >Sign In With Facebook</button>
//                             </form>
//                             </React.Fragment>
//                         )
//                     }
//                 }
//             </AuthContext.Consumer>
//         )

//             }
// }

// class SignInTwitterBase extends Component {
//     state = { error : false}
//     static contextType = FirebaseContext
   
//     setAuthUser = () => {}

//     handleSubmit = (e) => {
//             e.preventDefault();
//             this.context.doSignInWithTwitter()
//             .then(authUser => {
//                 console.log("SOCIAL AUTH USER",authUser.user.uid);
//                 this.setAuthUser({ authUser}).then(() => { this.props.history.push(Routes.ACCOUNT);})
//             })
//             .catch( error => {
//                 this.setState({ error })
//             })
//     }

//     render() {
        
       
//         const { error } = this.state

//         return (
//             <AuthContext.Consumer>
//                 {
//                     value => {
//                         this.setAuthUser = value.setAuthUser;
//                         return (
//                             <React.Fragment>
                             
//                             { error &&  <p className="alert alert-danger">{error.message}</p> }
//                             <form onSubmit={this.handleSubmit} className="mb-2">
//                               <button className="btn btn-dark btn-block text-light font-weight-bold p-2"
//                                type="submit" >Sign In With Twitter</button>
//                             </form>
//                             </React.Fragment>
//                         )
//                     }
//                 }
//             </AuthContext.Consumer>
//         )

//             }
// }


const SignInForm = withRouter(SignInFormBase);
const SignInGoogle = withRouter(SignInGoogleBase);
// const SignInFacebook = withRouter(SignInFacebookBase);
// const SignInTwitter = withRouter(SignInTwitterBase);



export default SignInPage ;

export { SignInForm };