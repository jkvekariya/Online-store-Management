import React, { useState } from 'react'
import "../../css/signup.css"
import Bodyheader from '../../components/BodyHeader';

const Signup = () => {

    const [email,setEMail] = useState("");
    const [password,setPassword] = useState("");
    const [firstname,setFirstName] = useState("");
    const [lastname,setLastName] = useState("");    

  return (
    <>
    <Bodyheader title="Create an Account" />
    <div className='main-container'>
      <h2>Signup Now</h2>
      <div className='first-name-box'>
            <label htmlFor="text">First Name<p>*</p></label>
            <input type="text" 
            id="first-name" 
            value={firstname} 
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='Enter your first name'
            />
        </div>
        <div className='last-name-box'>
            <label htmlFor="text">Last Name</label>
            <input type="text" 
            id="last-name" 
            value={lastname} 
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Enter your last name'
            />
        </div>
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
            <button onClick={() => {}}>Signup</button>
      </div>
    </div>
    </>
  )
}

export default Signup
