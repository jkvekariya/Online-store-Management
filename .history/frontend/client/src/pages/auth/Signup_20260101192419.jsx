import React, { useEffect, useState } from 'react'
import "./signup.css"
import { useFirebase } from '../context/AuthContext';

const Signup = () => {

  const firebase = useFirebase();
  useEffect(() =>{
    console.log(firebase)
  },[firebase])

    const [email,setEMail] = useState("");
    const [password,setPassword] = useState("");

    const SubmitDataToFireBase = async(e) =>{
      e.preventDefault();
      try {
         await firebase.SignupWithEmailAndPassword(email, password);
         alert("Signup Successfully...")
         setEMail("")
         setPassword("")
      } catch (error) {
        alert("Signup Failed!! please enter valid credential..")
        console.log(error.message);
      }

    }

  return (
    <>
    <div className='main-container'>
      <h2>Signup Now</h2>
        <div className='email-box'>
            <label htmlFor="email">Email</label>
            <input type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEMail(e.target.value)}
            placeholder='Enter your email'
            />
        </div>
        <div className='password-box'>
            <label htmlFor="password">Password</label>
            <input type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            />
        </div>
      <div className='btn'>
        <button onClick={SubmitDataToFireBase}>Signup</button>
      </div>
    </div>
    </>
  )
}

export default Signup
