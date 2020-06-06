import React, { useContext, useState , useEffect}  from 'react'
import { AuthContext } from '../Session'
import { FirebaseContext } from '../Firebase'

const Home = () => {
    const { authUser } = useContext(AuthContext);
    const firebase = useContext(FirebaseContext);
    return authUser.emailVerified ? <Welcome authUser={authUser} firebase={firebase}/> : 
     <Warning />
     ;
}

const Warning = () =>   ( <div className="bg-danger container-fluid"  >
                            <div className="row align-items-center" style={{height : "93.5vh"}}>
                                 <div className="col col-md-8 offset-md-2">
                                 <h3 className="text-dark font-weight-bolder py-4 text-center "> 
                                  You can't visit to This Page ? Please Varify Your email first </h3>
                                 </div>
                            </div>
                          </div>) ;

const Welcome = ({authUser , firebase}) => {

    const [todo,setTodo] = useState("")
    const [todos,setTodos] = useState([]);

    const getTodo = () => {
        firebase.getTodos(authUser.uid).once('value')
        .then(snapshot => {
            let todos = snapshot.val() ;
            setTodos(todos)
        }) ;
    }


    const handleChange = e => {
        setTodo(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(todo.length === 0) { alert("could not be empty"); return; }
        firebase.setTodos(authUser.uid, { message : todo , state : 0})
        .then(() => {alert("added");
                      getTodo();
                    setTodo("")})
        .catch( err => { alert(err)
                    setTodo("")})
    }

    return (
        <div className="container-fluid  bg-warning py-4 ">
            <div className="row">
                <div className="col-12">
                    <p className="text-white text-center" style={{fontSize : "200%"}}>Welcome! To our site</p>
                </div>
                <div className="col-md-8 offset-md-2 py-4   text-light px-0">
                    <h3 className="lead text-center font-weight-bolder mb-4">Add Your To Do</h3>
                    <p className="text-center text-muted lead" style={{fontSize : "130%"}}>
                         Double Click to mark todo as completed</p>
                    <div className="container-fluid  p-2 text-white my-2">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input  type="text" className="form-control" 
                                value={todo} onChange={handleChange} />
                            </div>
                            <button className="btn btn-dark btn-block mb-4" type="submit" 
                            >Add ToDo</button>
                        </form>
                        <TodoList todos={todos} getTodo={getTodo} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const TodoList = ({todos,getTodo}) => {
    const firebase = useContext(FirebaseContext)
    const { authUser } = useContext(AuthContext)

   


    useEffect(() => {
       getTodo() 
    }, [])

    const handleClick = (e) => {
        const key = e.target.getAttribute("value");
        firebase.updateTodos(authUser.uid,key);
        getTodo()
    } 

    const handleDelete = e => {
        const key = e.target.parentNode.parentNode.getAttribute("value")
        firebase.deleteTodo(authUser.uid,key);
        getTodo()
    }

    const activeClass = "list-group-item text-light bg-success my-2";
    const simpleClass = "list-group-item text-dark my-2";

    return (
        <ul className="list-group">
           
         { todos && Object.keys(todos).map( key => {
            return <li key={key} className={todos[key].state === 1 ? activeClass : simpleClass}
            onDoubleClick={handleClick} value={key} >
                <button type="button" className="close" aria-label="Close" onClick={handleDelete}>
                            <span aria-hidden="true">&times;</span>
                </button>
                {todos[key].message}
                
            </li>
        }) }
        </ul>
    )
}

export default Home ;