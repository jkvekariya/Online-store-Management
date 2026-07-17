import React from 'react'
import { useState } from 'react'
import "../../css/login.css"
import Bodyheader from '../../components/BodyHeader';
import { Link } from 'react-router-dom';

const Login = () => {

    const [email, setEMail] = useState("");
    const [password, setPassword] = useState("");

  return (
    <>
        <Bodyheader title="Login"/>
         <div className='main-container'>
      <h2>Login Now</h2>
        <div className='email-box'>
            <label htmlFor="email">Email<em>*</em></label>
            <input type="email" 
            id="login-email" 
            value={email} 
            onChange={(e) => setEMail(e.target.value)}
            placeholder='Enter your email'
            />
        </div>
        <div className='password-box'>
            <label htmlFor="password">Password<em>*</em></label>
            <input type="password" 
            id="login-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            />
        </div>
        <div className='verify-forgetpassword'>
            <input type="checkbox" id='checkbox' name='checkbox' />
            <Link to=""> Forget password?</Link>
        </div>
      <div className='btn-login'>
        <button onClick={() => {}}>Login</button>
      </div>
      <div className='btn-login'>
        <button onClick={() => {}} className='btn-google'><img src='../../../public/photos/google-icon.png'/>Google</button>
      </div>
      <div className='btn-login'>
        <button type='button' className='btn-create-account'><Link to='/signup'>Create an Account</Link></button>
      </div>
    </div>
    </>
  )
}

export default Login