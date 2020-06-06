import React, { Component }  from 'react'
import { FirebaseContext } from '../Firebase'
import { Link } from 'react-router-dom'
import * as Routes from '../constants/routes'


const PasswordForget = () => (
    <div className="container-fluid">
        <div className="row">
           <div className="col-md-8 offset-md-2 py-4 mt-4 bg-warning">
               <PasswordForgetForm />
           </div>
        </div>
    </div>
)

class PasswordForgetForm  extends Component {
    static contextType = FirebaseContext

    state = { email : "", error : null , loading : false}

    handleChange = e => {
              this.setState({[e.target.name] : e.target.value})
    }

    handleSubmit = e => { e.preventDefault() ; 
          this.setState({ loading : true , error : false })
          this.context.doPasswordReset(this.state.email)
           .then( () => {
               this.setState({ email : "", error : null , loading : false})
           })
           .catch(error => {
               this.setState({ error , loading : false})
           })
     }

    render(){
        const { email , error , loading } = this.state
       return ( <form onSubmit={this.handleSubmit}>
           { loading && <p className="text-dark p-2 my-2 bg-light text-center">Loading........</p>}
           { error && <p className="alert alert-danger p-2">{error.message}</p>}
            <div className="form-group">
                 <label className="text-dark font-weight-bolder">Email Address</label>
                  <input type="email" onChange={this.handleChange} value={email} name="email" className="form-control" 
                   disabled={loading} />
            </div>
            <button type="submit" className="btn btn-block btn-danger mt-4" disabled={loading}>Submit</button>
           
       </form> );
    }
}

const PasswordForgetLink = () => (
    <p className="p-2 my-2 text-right">
        <Link to={Routes.PASSWORD_FORGET} className="text-muted font-weight-bolder">Forgot Password ? </Link></p>
)


export default PasswordForget ;

export { PasswordForgetLink }