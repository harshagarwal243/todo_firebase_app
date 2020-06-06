import React, { Component }  from 'react'
import { FirebaseContext } from '../Firebase'
import { AuthContext } from '../Session'

const UpdateProfile = (props) => (
   
        <div className="row">
           <div className="col-md-8 offset-md-2 py-2 mt-2 bg-warning">
               <p className=" text-dark text-center">Update Profile</p>
               <UpdateProfileForm user={props.user} goBack={props.goBack} />
           </div>
        </div>
  
)

const INITIAL_STATE = {  username : "", error : false   , loading : false}

class UpdateProfileForm  extends Component {
    static contextType = FirebaseContext

    state = { ...INITIAL_STATE }

    handleChange = e => {
              this.setState({[e.target.name] : e.target.value})
    }

    handleSubmit = e => { e.preventDefault() ; 
          this.setState({loading : true , error : false })
          this.context.user(this.props.user.uid).set({ username : this.state.username
        , email : this.props.user.email , role : this.props.user.role,})
          .then(() => {
             
              this.setAuthUser({ newBase : true}).then(() => {
                alert("Updated Successfullty");
                this.setState({ ...INITIAL_STATE , error : null })
              })
             })
           .catch(error => {
               this.setState({ error , loading : false })
           })
     }

    setAuthUser = null ;

    render(){
        const { username, error,  loading} = this.state

       return (
           <AuthContext.Consumer>
             {
                 value => {
                     this.setAuthUser = value.setAuthUser ;
                     return  ( <React.Fragment>
                        <p className="text-right font-weight-bold">
                            <button className="btn btn-warning" onClick={this.props.goBack}>&times;</button>
                         </p>
                      <form onSubmit={this.handleSubmit}>
                        { loading && <p className="text-dark p-2 my-2 bg-light text-center">Loading........</p>}
                        { error && <p className="alert alert-warning p-2">{error.message}</p>}
                        <div className="form-group">
                              <label className="text-dark font-weight-bolder">Email Address</label>
                               <input type="text"  value={this.props.user.email} className="form-control" disabled={true} />
                         </div>
                         <div className="form-group">
                              <label className="text-dark font-weight-bolder">New Username</label>
                               <input type="text" onChange={this.handleChange} value={username} name="username" 
                               className="form-control"  disabled={loading}/>
                         </div>
                         <button type="submit" className="btn btn-block btn-danger mt-4"
                          disabled={loading}>Submit</button>
                        
                    </form>
                    </React.Fragment> );
                 }
             }
           </AuthContext.Consumer>
       )
    }
}

export default UpdateProfile ;
