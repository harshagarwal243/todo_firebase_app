import React, { Component }  from 'react'
import { FirebaseContext } from '../Firebase'


const PasswordChange = (props) => (
   
        <div className="row">
           <div className="col-md-8 offset-md-2 py-2 mt-2 bg-warning">
               <p className=" text-dark text-center">Change Password</p>
               <PasswordChangeForm email={props.email} goBack={props.goBack} />
           </div>
        </div>
  
)

const INITIAL_STATE = {  passwordOne : "", error : false , success : false , passwordTwo : "" , loading : false}

class PasswordChangeForm  extends Component {
    static contextType = FirebaseContext

    state = { ...INITIAL_STATE }

    handleChange = e => {
              this.setState({[e.target.name] : e.target.value})
    }

    handleSubmit = e => { e.preventDefault() ; 
          this.setState({loading : true , error : false })
          this.context.doPasswordUpdate(this.state.passwordOne)
           .then( () => {
               this.setState({ ...INITIAL_STATE , error : null, success : true })
           })
           .catch(error => {
               this.setState({ error , loading : false })
           })
     }

    

    render(){
        const { passwordOne , passwordTwo , error, success , loading} = this.state

       const inValid =  passwordOne !== passwordTwo || passwordOne === "" || passwordOne === null 
                        || passwordOne.length <= 7
       return ( <React.Fragment>
           <p className="text-right font-weight-bold">
               <button className="btn btn-warning" onClick={this.props.goBack}>&times;</button>
            </p>
         <form onSubmit={this.handleSubmit}>
           { loading && <p className="text-dark p-2 my-2 bg-light text-center">Loading........</p>}
           { error && <p className="alert alert-warning p-2">{error.message}</p>}
           { success && <p className="alert alert-danger p-2">Password Changed</p>}
           <div className="form-group">
                 <label className="text-dark font-weight-bolder">Email Address</label>
                  <input type="text"  value={this.props.email} className="form-control" disabled={true} />
            </div>
            <div className="form-group">
                 <label className="text-dark font-weight-bolder">Password</label>
                  <input type="password" onChange={this.handleChange} value={passwordOne} name="passwordOne"
                   className="form-control" disabled={loading} />
            </div>
            <div className="form-group">
                 <label className="text-dark font-weight-bolder">Confirm Password</label>
                  <input type="password" onChange={this.handleChange} value={passwordTwo} name="passwordTwo" 
                  className="form-control"  disabled={loading}/>
            </div>
            <button type="submit" className="btn btn-block btn-danger mt-4"
             disabled={inValid || loading}>Submit</button>
           
       </form>
       </React.Fragment> );
    }
}

export default PasswordChange ;
