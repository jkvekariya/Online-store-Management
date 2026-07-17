import React from 'react'
import "./signup.css"
import { useState } from 'react'

const Login = () => {

    const [email, setEMail] = useState("");
    const [password, setPassword] = useState("");

  return (
    <>
         <div className='main-container'>
      <h2>Login Now</h2>
        <div className='email-box'>
            <label htmlFor="email">Email</label>
            <input type="email" 
            id="login-email" 
            value={email} 
            onChange={(e) => setEMail(e.target.value)}
            placeholder='Enter your email'
            />
        </div>
        <div className='password-box'>
            <label htmlFor="password">Password</label>
            <input type="password" 
            id="login-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            />
        </div>
      <div className='btn'>
        <button onClick={""}>Login</button>
      </div>
    </div>
    </>
  )
}

export default Login