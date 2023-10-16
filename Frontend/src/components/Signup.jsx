import  { useContext, useState } from 'react';
import TodoContext from '../TodoContext';
import{Link} from "react-router-dom";

export default function Signup() {

    const [firstName, setFisrtName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");

    const { signup } = useContext(TodoContext);

  return (
    <div className='signup'>
   
    <h1>Signup Now</h1>
    <input 
    onChange= {(e)=> setFisrtName (e.currentTarget.value)} 
    type="text" 
    placeholder='Enter Your First Name' 
    />
    <br/>
    <input 
    onChange= {(e)=> setLastName (e.currentTarget.value)} 
    type="text" 
    placeholder='Enter Your Last Name' 
    />
    
    <input 
    onChange= {(e)=> setEmail (e.currentTarget.value)} 
    type="email" 
    placeholder='Enter Your Email' 
    />
    <br/>
    <input 
    onChange= {(e)=> setPhone (e.currentTarget.value)} 
    type="number" 
    placeholder='Enter Your Number' 
    />
    
    <input 
    onChange= {(e)=> setAge (e.currentTarget.value)} 
    type="number" 
    placeholder='Enter Your Age' 
    />
    <br/>
    <input 
    onChange= {(e)=> setGender (e.currentTarget.value)} 
    type="text" 
    placeholder='Enter Your Gender' 
    />
    <br/>
    <input 
    onChange= {(e)=> setPassword (e.currentTarget.value)} 
    type="password" 
    placeholder='Enter Your Password' 
    />
    <br/>
    <button onClick={() => {
        signup(
        firstName,
        lastName,
        email,
        phone,
        age,
        gender,
        password
        );
    }}
    >
    {" "}
    Signup{" "}
    </button>

    <br/>
        <Link to="/"> Already  have account, Login?</Link>
        
    
    </div>
  );
}
