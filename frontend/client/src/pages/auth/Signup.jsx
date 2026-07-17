import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import axios from 'axios';
import "../../css/signup.css"
import Bodyheader from '../../components/BodyHeader';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {

  const [email, setEMail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!firstname) tempErrors.firstname = "First name is required";
    if (!lastname) tempErrors.lastname = "Last name is required";
    if (!mobile) tempErrors.mobile = "Mobile number is required";
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Email is invalid";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        firstname,
        lastname,
        mobile,
        email,
        password
      });
      toast.success(response.data.message || "Signup Successfully");
      setFirstName("");
      setLastName("");
      setMobile("");
      setEMail("");
      setPassword("");
      setErrors({});
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <Bodyheader title="Create an Account" />
      <ToastContainer position="top-right" autoClose={2000} />
      <div className='signup-container'>
        <div className='signup-image-section'>
          <img src="/photos/signup-image.jpg" alt="Signup Visual" />
        </div>
        <div className='signup-form-section'>
          <Link to="/" className="back-button" title="Back to Home">
            <FaArrowLeft />
          </Link>
          <h2>Create Account</h2>

          <div className="name-row">
            <div className='first-name-box'>
              <label htmlFor="first-name">First Name<em>*</em></label>
              <input type="text"
                id="first-name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='First name'
              />
              {errors.firstname && <span className="error-text">{errors.firstname}</span>}
            </div>
            <div className='last-name-box'>
              <label htmlFor="last-name">Last Name<em>*</em></label>
              <input type="text"
                id="last-name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Last name'
              />
              {errors.lastname && <span className="error-text">{errors.lastname}</span>}
            </div>
          </div>

          <div className='mobile-box'>
            <label htmlFor="mobile">Mobile No<em>*</em></label>
            <input type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder='Enter your mobile number'
            />
            {errors.mobile && <span className="error-text">{errors.mobile}</span>}
          </div>

          <div className='email-box'>
            <label htmlFor="email">Email<em>*</em></label>
            <input type="email"
              id="email"
              value={email}
              onChange={(e) => setEMail(e.target.value)}
              placeholder='Enter your email'
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className='password-box'>
            <label htmlFor="password">Password<em>*</em></label>
            <input type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          <div className='btn'>
            <button onClick={handleSignup}>Signup</button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/auth/login" style={{ color: '#4b9da9', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Signup
