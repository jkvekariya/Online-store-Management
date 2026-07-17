import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/sidebar.css';
import { FaXmark, FaAngleRight, FaUser, FaPhone, FaCalendar, FaVenusMars, FaEnvelope } from "react-icons/fa6";
import axios from 'axios';
import { toast } from 'react-toastify';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // State for Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    dob: "",
    gender: "Male"
  });

  const [loginInfo, setLoginInfo] = useState({
    email: ""
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('osm_user'));
    if (user) {
      setPersonalInfo({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        mobile: user.mobile || "",
        dob: user.dob || "",
        gender: user.gender || "Male"
      });
      setLoginInfo({
        email: user.email || ""
      });
    }
  }, [isOpen]); // Update when sidebar opens

  const handleLogout = () => {
    localStorage.removeItem('osm_token');
    localStorage.removeItem('osm_user');
    onClose();
    toast.success("Logged out successfully");
    navigate('/auth/login');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      ></div>

      {/* Sidebar Content */}
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-block">
            <div className="sidebar-logo-mark">C</div>
            <div className="sidebar-logo-text">Clothify</div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaXmark />
          </button>
        </div>

        <div className="sidebar-body">
          {/* Menu */}
          <div className="sidebar-menu" style={{ width: '100%' }}>
            <ul>
              <li>
                <Link to="/pages/user/profile" onClick={onClose} className="sidebar-link">
                  <div className="sidebar-item-content">
                    <span><FaUser className="label-icon" /> My Profile</span>
                    <FaAngleRight />
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/pages/user/address-book" onClick={onClose} className="sidebar-link">
                  <div className="sidebar-item-content">
                    <span>Address Book</span>
                    <FaAngleRight />
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/pages/user/orders" onClick={onClose} className="sidebar-link">
                  <div className="sidebar-item-content">
                    <span>My Orders</span>
                    <FaAngleRight />
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/pages/user/wishlist" onClick={onClose} className="sidebar-link">
                  <div className="sidebar-item-content">
                    <span>Wishlist</span>
                    <FaAngleRight />
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/pages/user/contact" onClick={onClose} className="sidebar-link">
                  <div className="sidebar-item-content">
                    <span>Support</span>
                    <FaAngleRight />
                  </div>
                </Link>
              </li>
              <li onClick={handleLogout} style={{ cursor: 'pointer', borderTop: '1px solid #eee', marginTop: '10px' }}>
                <div className="sidebar-item-content">
                  <span style={{ color: '#d9534f', fontWeight: 'bold' }}>Logout</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Optional: Brief Info Summary at bottom */}
        {personalInfo.firstname && (
          <div className="sidebar-footer-info" style={{ padding: '20px', background: '#f9f9f9', borderTop: '1px solid #eee' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>Logged in as:</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem' }}>{personalInfo.firstname} {personalInfo.lastname}</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#666' }}>{loginInfo.email}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
