import { useEffect, useContext, useState } from 'react'
import TodoContext from '../TodoContext'
import { useNavigate } from 'react-router-dom';
import TodoItem from './TodoItem';

export default function Home() {
    const{user, addTodo, fetchAllTodos, todos, logout }= useContext(TodoContext);
   

    const Navigate = useNavigate();
    // this function will fetch all the todos of the current login user
    
    // if the compnent loading first time 
    useEffect(() => {
        // if user dosnt exists then go back to login
        if(!user){
            //not allow to see this
            console.log(user);
            Navigate("/");
        }
        else{
            //otherswise fetch all his todos
            fetchAllTodos();
        }
        }, []);

        const [title, setTitle] = useState("")
        const [description, setDescription] =useState("")
    return (
    <div>
    <center>
    <div className='home'>
      <h1 style={{color:'white'}}>Welcome {user && user.firstName}</h1>
      <button onClick={logout}>Logout</button>
      <div style={{padding:'10px', margin:'10px', border:'1px solid #d5d5d5'}}>
      <h2>Add Todo</h2>
      <input onChange={(e)=> setTitle(e.currentTarget.value)}
      value={title} 
      type='text' 
      placeholder='Title'/>
      <br/>
      <textarea onChange={(e)=> setDescription(e.currentTarget.value)} 
      value={description}
      placeholder='Description'
      ></textarea>
      <br/>
      <br/>
      <button onClick={()=>{
        addTodo(
            title, 
            description
            );
            setTitle("");
            setDescription("");
            
      }}>Add Todo</button>
      </div>
      </div>
      </center>
      <div className='todolist'>
      {todos.map((item, index)=>{
        return <TodoItem 
        id = {item._id}
        title={item.title} 
        description={item.description} 
        completed={item.completed} key={index}/>
      })}
      </div>
    </div>
  );
}
