import React, { Component } from 'react'
import { FirebaseContext } from '../Firebase'
import * as Roles from '../constants/roles'

export default class AdminPage extends Component {

    static contextType = FirebaseContext

    state = { users : [] , loading : false  }

    componentDidMount(){
            this.context.users().on('value' , snapshot => {
                this.setState({ loading : true});
                if(snapshot.val() !==  null)
                 {
                    this.setState({ users : snapshot.val() , loading : false })
                 }
                
            })
    }

    render() {
        const {loading} = this.state.loading ;
        return (
            <div className="container-fluid my-4">
                <div className="row">
                    <div className="col-md-8 offset-md-2 bg-warning text-white text-center text-break">
                        <h1>Admin Page</h1>
                         <p className="bg-light text-dark p-2 my-4 font-weight-bolder mx-0 w-100">Users Info</p>
                         { loading && <p className="text-dark p-2 my-2 bg-light text-center">Loading........</p>}
                         <table className="table table-hover table-light text-warning table-responsive-sm">
                             <thead className="thead-dark">
                                 <tr>
                                 <th>UserName</th>
                                 <th>Email</th>
                                 <th>Role</th>
                                 </tr>
                            </thead>
                            <tbody>
                                <UserList users = {this.state.users} />
                            </tbody>
                         </table>
                    </div>
                </div>
            </div>
        )
    }
}

const UserList = ({ users })  => {
    return Object.keys(users).map( key => {
        return (
          <tr key={key}>
              <td>{ users[key].username}</td>
              <td className="text-dark font-weight-bold">{ users[key].email}</td>
              <td >
              { users[key].role === Roles.ADMIN ?
                <span className="align-middle badge badge-danger w-100 py-2">{ users[key].role}</span> : 
                <span className="align-middle badge badge-primary w-100 py-2">{ users[key].role}</span> }
              </td>
          </tr>
        )
    }) 
}