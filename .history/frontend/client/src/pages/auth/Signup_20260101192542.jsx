import React, { useState } from 'react'
import "./signup.css"

const Signup = () => {

    const [email,setEMail] = useState("");
    const [password,setPassword] = useState("");

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
            <button onClick={""}>Signup</button>
      </div>
    </div>
    </>
  )
}

export default Signup
