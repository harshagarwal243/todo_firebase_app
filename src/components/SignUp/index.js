import React , { Component } from 'react'
import { NavLink as Link , withRouter} from 'react-router-dom'
import { FirebaseContext } from '../Firebase'
import {  AuthContext } from '../Session'


import * as Routes from '../constants/routes'
import * as Roles from '../constants/roles'

const SignUpPage = () => (
    <div className="container-fluid">
        <div className="row ">
             <div className="col-md-8 offset-md-2 text-center text-break">
                 <h1 className="mb-4  py-2 ">SignUp Form</h1>
                  <SignUpForm />
             </div>
        </div>
    </div>
)


const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
    success : false,
    loading : false
}



class SignUpFormBase  extends Component {

   static contextType = FirebaseContext

   state = {...INITIAL_STATE};
   setAuthUser = null


   handleSubmit = event => { 
       event.preventDefault();
       this.setState({ loading : true  , error : false })
       this.context
               .doSignUpWithEmailAndPassword(this.state.email, this.state.passwordOne)
               .then( authUser => {
                   let role = Roles.USER ;
                   return  this.context.user(authUser.user.uid)
                .set({ email : this.state.email ,role , username : this.state.username}).then(() => authUser)
               })
               .then((authUser) => {  
                                    this.setAuthUser({ newBase : true}).then(() => {
                                        this.setState({ ...INITIAL_STATE , success : true});
                                        alert("Successfully Signed Up")
                                        this.props.history.push(Routes.ACCOUNT)
                                    });
                                  
                                 })
               .catch(error => {
                                 this.setState({ error , loading : false});
                               });
       
   }

   handleChange = event => {
       const change = { [event.target.name] : event.target.value }
       this.setState( p => ({...p , ...change }))
   }
    
  
    render() {
        
       
        const {username , email , passwordOne , passwordTwo , error , success , loading } = this.state
        const valid = passwordOne === passwordTwo &&
         /^[a-zA-Z ]{3,30}$/.test(username) &&
         /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-_]+\.[a-zA-Z]{2,}$/.test(email) &&
         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.-^*()%!]).{8,15}$/.test(passwordOne) 

        return (
            <AuthContext.Consumer>
                {
                    value => {
                        this.setAuthUser = value.setAuthUser;
                        return  (
                            <React.Fragment>
                            { loading && <p className="text-dark p-2 my-2 bg-light text-center">Loading........</p>}
                            { success && <p className="alert alert-success"> Successfully Signed Up !</p>}
                            { error &&  <p className="alert alert-danger">{error.message}</p> }
                            <form onSubmit={this.handleSubmit}>
                              <div className="form-group text-left">
                                  <label>UserName</label>
                                  <input  type="text" className="form-control" onChange={(e) => { this.handleChange(e)}} 
                                  name="username" value={username} pattern="^[a-zA-Z ]{3,30}$"
                                  title="Only alphabets are allowed" disabled={loading} />
                              </div>
                              <div className="form-group text-left">
                                  <label>Email Address</label>
                                  <input  type="email" className="form-control"  onChange={(e) => { this.handleChange(e)}} 
                                  name="email" value={email} pattern="^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-_]+\.[a-zA-Z]{2,}$"
                                  title="Enter a valid email" disabled={loading}/>
                              </div>
                              <div className="form-group text-left">
                                  <label>Password</label>
                                  <input  type="password" className="form-control"  onChange={(e) => { this.handleChange(e)}} 
                                  name="passwordOne" value={passwordOne} 
                                  pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.-^*()%!]).{8,15}$"
                                  title="password must contain a digit , a small letter,a capita letter ,a specil symbol 
                                  and must at least 8 char and at most 15 char" disabled={loading}/>
                              </div>
                              <div className="form-group text-left">
                                  <label>Confirm Password</label>
                                  <input  type="password" className="form-control"  onChange={(e) => { this.handleChange(e)}} 
                                  name="passwordTwo" value={passwordTwo} disabled={loading}/>
                              </div>
                              <button className="btn btn-primary btn-block" type="submit" disabled={!valid || loading}>Sign Up</button>
                            </form>
                            </React.Fragment>
                        )
                    }
                }
            </AuthContext.Consumer>
        )
    }
}

const SignUpLink = () => (
    <p className="lead p-2 mt-2 text-left">Don't Have An Account? <Link to={Routes.SIGN_UP} className="text-danger font-weight-bolder">Create Account</Link></p>
)

const SignUpForm = withRouter(SignUpFormBase);


export default SignUpPage ;

export { SignUpForm , SignUpLink};

