import { useEffect, useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css'
import TodoContext from './TodoContext';
import Home from './components/Home';
import { Route, Routes, useNavigate } from "react-router-dom";

function App() {

  const [user, setUser]  = useState(null);
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  //Logins
  const login =(email, password) => {
    // try to login
    fetch("http://localhost:3010/api/auth/login", {
      method:"POST", 
      headers:{
          "Content-type": "application/json",
        },
      body: JSON.stringify({
        email, 
        password
      }), 
    })
    .then((res) => res.json())
    .then((data) => {
      // if the login is success then only we will store in in state
      if (data.success == false) {
        alert(data.message)
      }
      else{
          // if login is succes then store the user and move the user to home page
        setUser(data);

        localStorage.setItem("userdata",JSON.stringify(data));

        navigate("/home");
      }
    })
    // if the login is success then only we will store in in state
    .catch(err => {
      console.log("Error", err.message);
      });
    };

  //Signup

    const signup =(
    firstName, 
    lastName, 
    email, 
    phone, 
    age, 
    gender, 
    password) => {
    
      fetch("http://localhost:3010/api/auth/singup",{
        method: "POST",
        headers:{
          "content-type":"application/json",
        },
        body: JSON.stringify({
          firstName, 
          lastName, 
          email, 
          phone, 
          age, 
          gender, 
          password
        }),
      })
      .then((res)=> res.json())
      .then((data)=> {
        if(data.success == true){
          alert("Account Created Now You can Login" )
          navigate("/");
        }
        else{
          alert(data.message)
        }
      })
      .catch((err)=> console.log("Error",err.message));

  };
//Add Todo
  const addTodo =(title, description)=>{

    fetch("http://localhost:3010/api/todo/add",{
        method: "POST",
        headers:{
          "content-type":"application/json",
          "Authorization": user.token,
        },
        body: JSON.stringify({
          title,
          description,
        }),
      })
      .then((res)=> res.json())
      .then((data)=> {
       if(data.success == false)
       {
        alert("Error while adding Todos"+ data.message)
       }
       else{
        // if added successfully then we will fetch the updated todos
        fetchAllTodos();
       }
      })
      .catch((err)=> console.log("Error",err.message));

  };
  // Read Todo
  const fetchAllTodos = ()=>{
    //if user dosnt exists then go to back
    if(!user) return;

    fetch("http://localhost:3010/api/todo/get",{
    method:"GET",
    headers:{
        "Context-Type":"application/json",
        Authorization: user.token,
        },
    })
    .then((res)=> res.json())
    .then((data)=> {
        if(data.success == false)
        {
            alert("Eror while fetching Todo" + data.message)
        }
        else{
            setTodos(data.todos);
        }
    })
    .catch((err)=> console.log("Error", err.message));
};
//delete Todo
  const deleteTodos = (todoId)=>{
    // ask for confirmation
    const userAction = confirm("Are you Sure ? You want to delete this todo")
    if(userAction == false)
    {
      return;
    }
    fetch(`http://localhost:3010/todo/delete/${todoId}`,{
    method:"DELETE",
    headers:{
        "Context-Type":"application/json",
        Authorization: user.token,
        },
    })
    .then((res)=> res.json())
    .then((data)=> {
        if(data.success == false)
        {
            alert("Eror while Deleting Todo" + data.message)
        }
        else{
            // if todo id deleted successfully
            fetchAllTodos();
        }
    })
    .catch((err)=> console.log("Error", err.message));

  };
//mark complete
  const markAsComplete = (todoId)=>{
    fetch(`http://localhost:3010/todo/mark-complete/${todoId}`,{
    method:"PUT",
    headers:{
        "Context-Type":"application/json",
        Authorization: user.token,
        },
    })
    .then((res)=> res.json())
    .then((data)=> {
        if(data.success == false)
        {
            alert("Eror while Deleting Todo" + data.message)
        }
        else{
            // if todo id deleted successfully
            fetchAllTodos();
        }
    })
    .catch((err)=> console.log("Error", err.message));
  };
  //when you ae coming to website frist time or  reloaded it  
  //we will check if your details in localStorage and if they are then 
  //we have toupdate in user state
  useEffect(()=>{
    if(localStorage.getItem("userdata"))
    {
      setUser(JSON.parse(localStorage.getItem("userdata")));
      navigate("/home");
    }

  }, []);
//logout
  const logout = ()=>{
    navigate("/");
    localStorage.removeItem("userdata")
    setUser(null);
  };
  
  return (
    <TodoContext.Provider 
    value={{ 
      login, 
      signup, 
      user, 
      addTodo, 
      fetchAllTodos, 
      todos, 
      deleteTodos,
      markAsComplete,
      logout,
    }}
    >
    <Routes>
      <Route  path="/" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />

      <Route path="/home" element={<Home/>} />
    </Routes>
    </TodoContext.Provider>
  );
}

export default App;
