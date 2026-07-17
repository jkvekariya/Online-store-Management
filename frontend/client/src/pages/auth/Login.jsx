import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import axios from 'axios';
import "../../css/login.css"
import Bodyheader from '../../components/BodyHeader';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

  const [view, setView] = useState('login'); // login, forgot-email, forgot-otp, forgot-new-password

  // Login State
  const [email, setEMail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateLogin = () => {
    let tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Email is invalid";
    if (!password) tempErrors.password = "Password is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  // Handle Login
  const handleLogin = async () => {
    if (!validateLogin()) return;

    // Static Admin Credentials Check
    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      toast.success("Admin Login Successfully");

      // Store admin session
      localStorage.setItem('osm_adminToken', 'admin-static-token');
      localStorage.setItem('osm_adminUser', JSON.stringify({
        email: ADMIN_EMAIL,
        role: 'admin',
        name: 'Administrator'
      }));

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
      return;
    }

    // Regular User Login
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      toast.success(response.data.message || "Login Successfully");
      localStorage.setItem('osm_token', response.data.token);
      localStorage.setItem('osm_user', JSON.stringify(response.data.user));

      // Trigger storage event for Header update
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  }

  // Handle Forgot - Send Email
  const handleSendResetEmail = () => {
    if (!forgotEmail) {
      toast.error("Please enter email to reset password");
      return;
    }
    // Mock sending email
    toast.success(`Reset code sent to ${forgotEmail}`);
    setView('forgot-otp');
  }

  // Handle Forgot - Verify OTP
  const handleVerifyOtp = () => {
    const otpValue = otp.join("");
    if (otpValue.length < 5) {
      toast.error("Please enter the complete 5-digit code");
      return;
    }
    // Mock verify
    setView('forgot-new-password');
  }

  // Handle OTP Input Change
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  // Handle Forgot - Reset Password
  const handleResetPassword = () => {
    if (!newPassword) {
      toast.error("Please enter new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("New password updated");
    setView('login');
    setEMail("");
    setPassword("");
    setForgotEmail("");
    setOtp(["", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
  }


  return (
    <>
      <Bodyheader title={view === 'login' ? "Login" : "Reset Password"} />
      <div className='main-container'>
        <div className='login-image-section'>
          <img src="/photos/login-image.jpg" alt="Login Visual" />
        </div>
        <div className='login-form-section'>
          <Link to="/" className="back-button" title="Back to Home">
            <FaArrowLeft />
          </Link>

          {/* --- VIEW: LOGIN --- */}
          {view === 'login' && (
            <>
              <h2>Login Now</h2>
              <div className='email-box'>
                <label htmlFor="login-email">Email<em>*</em></label>
                <input type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEMail(e.target.value)}
                  placeholder='Enter your email'
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className='password-box'>
                <label htmlFor="login-password">Password<em>*</em></label>
                <input type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password'
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              <div className='verify-forgetpassword'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input type="checkbox" id='checkbox' name='checkbox' />
                  <label className="lbl-for-remember" htmlFor="checkbox">Remember me</label>
                </div>
                <span onClick={() => setView('forgot-email')} className="forget-password"> Forget password?</span>
              </div>
              <div className='btn-login'>
                <button onClick={handleLogin}>Login</button>
              </div>
              <div className='btn-login'>
                <button onClick={() => toast.info("Google Login Mock")} className='btn-google'><img src='/photos/google-icon.png' alt="G" />Google</button>
              </div>
              <div className='btn-login'>
                <button type='button' className='btn-create-account'><Link to='/auth/signup'>Create Account</Link></button>
              </div>
            </>
          )}

          {/* --- VIEW: FORGOT - EMAIL --- */}
          {view === 'forgot-email' && (
            <>
              <h2>Reset Password</h2>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
                Please enter your email address to receive a verification code.
              </p>
              <div className='email-box'>
                <label htmlFor="forgot-email">Email Address<em>*</em></label>
                <input type="email"
                  id="forgot-email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder='name@example.com'
                />
              </div>
              <div className='btn-login'>
                <button onClick={handleSendResetEmail}>Reset Password</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <span onClick={() => setView('login')} style={{ cursor: 'pointer', color: '#4b9da9', fontWeight: 'bold' }}>Back to Login</span>
              </div>
            </>
          )}

          {/* --- VIEW: FORGOT - OTP --- */}
          {view === 'forgot-otp' && (
            <>
              <h2>Enter Code</h2>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
                We sent a code to <b>{forgotEmail}</b>
              </p>

              <div className="otp-container">
                {otp.map((data, index) => {
                  return (
                    <input
                      className="otp-input"
                      type="text"
                      name="otp"
                      maxLength="1"
                      key={index}
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onFocus={e => e.target.select()}
                    />
                  );
                })}
              </div>

              <div className='btn-login'>
                <button onClick={handleVerifyOtp}>Submit</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <span onClick={() => setView('forgot-email')} style={{ cursor: 'pointer', color: '#888', fontSize: '0.9rem' }}>Didn't receive? <strong style={{ color: '#333' }}>Resend</strong></span>
              </div>
            </>
          )}

          {/* --- VIEW: FORGOT - NEW PASSWORD --- */}
          {view === 'forgot-new-password' && (
            <>
              <h2>New Password</h2>
              <div className='password-box'>
                <label htmlFor="new-password">New Password<em>*</em></label>
                <input type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Enter new password'
                />
              </div>
              <div className='password-box'>
                <label htmlFor="confirm-password">Confirm Password<em>*</em></label>
                <input type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm new password'
                />
              </div>
              <div className='btn-login'>
                <button onClick={handleResetPassword}>Reset Password</button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}

export default Login