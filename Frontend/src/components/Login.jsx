import  { useState } from 'react';
import { useContext } from 'react';
import TodoContext from '../TodoContext';
import{Link} from "react-router-dom"
export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {login} = useContext(TodoContext);


    const handleSubmit = (e) => {
        e.preventDefault();
        login(email,  password);
    };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <h1>Login Now</h1>
        <input 
        onChange={(e)=> setEmail (e.currentTarget.value)}
         type="email"
         placeholder="Enter Your Email" 
         />
        <br/>
        <input 
        onChange={(e)=> setPassword (e.currentTarget.value)} 
        type="Password"
        placeholder="Enter Your Password" 
        />
        <br/>
        
        <input type="submit" value="Login"/><br/>
        <Link to="/signup"> Dont have account, Register?</Link>
        
        </form>
    </div>
  );
}
