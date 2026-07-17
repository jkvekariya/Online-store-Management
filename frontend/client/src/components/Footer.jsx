import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/footer.css";
import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    address: '12,crystal plaza,varachha,surat -395010.',
    phone: '+(132) 5465 2389',
    email: 'support@clothify.com'
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/page-content/contact');
        if (res.data && res.data.sections) {
          setContactInfo({
            address: res.data.sections.address || contactInfo.address,
            phone: res.data.sections.contactNumber || contactInfo.phone,
            email: res.data.sections.email || contactInfo.email
          });
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };
    fetchContactInfo();
  }, []);

  return (
    <>
      <div className="main-footer">
        <div className="footer-container">
          <div className="sec-one-about">
            <h1>clothify</h1>
            <p>
              purchasing our new exclusive products with
              incredible offer to provide luxurious
              feeling also,share how is your experience and send your faithfull feedback by email.
            </p>

            <div className="subscribe-by-email">
              <h2>signup to get 10% off on your first order</h2>
              <div className="subscribe-form-flex">
                <input type="email" id="subscribe-email" placeholder="your email address" autoComplete="off" />
                <button type="button" className="btn-subscribe">subscribe</button>
              </div>
            </div>
          </div>
          <div className="sec-two-customer-link">
            <h2>customer services</h2>
            <ul className="footer-list">
              <li><Link to="/pages/user/profile">my account</Link></li>
              <li><Link to="">shipping & delivery</Link></li>
              <li><Link to="">order tracking</Link></li>
              <li><Link to="/pages/user/orders">orders history</Link></li>
              <li><Link to="/pages/user/faq">help & FAQs</Link></li>
              <li><Link to="">fast delivery</Link></li>
              <li><Link to="/pages/user/privacy-policy">privacy policy</Link></li>
            </ul>
          </div>
          <div className="sec-three-useful-link">
            <h2>useful links</h2>
            <ul className="useful-link">
              <li><Link to="/">home</Link></li>
              <li><Link to="/pages/user/products">services</Link></li>
              <li><Link to="/pages/user/blog">blog</Link></li>
              <li><Link to="/pages/user/contact">contact</Link></li>
              <li><Link to="/pages/user/about">about us</Link></li>
              <li><Link to="/pages/user/faq">faq</Link></li>
              <li><Link to="/pages/user/terms-conditions">terms & conditions</Link></li>
            </ul>
          </div>
          <div className="sec-four-contact">
            <h2>contact info</h2>
            <h3>address</h3>
            <p>{contactInfo.address}</p>
            <h3>phone</h3>
            <p>{contactInfo.phone}</p>
            <h3>email</h3>
            <p>{contactInfo.email}</p>
            <h3>working days/hours</h3>
            <p>mon-sat/ 9:00 AM - 8:00 PM</p>

            <div className="media-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="facebook-icon">
                <FaFacebookF />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="twitter-icon">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="instagram-icon">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="copyright-text">
            <p>Copyright © 2025 clothify creative. all rights reserved.</p>
          </div>
          <div className="payment-icons">
            <span>Payment accepted:</span>
            <div className="cards">
              <div className="payment-card">
                <FaCcVisa size={33} color="#fff" />
              </div>
              <div className="payment-card">
                <FaCcMastercard size={33} color="#fff" />
              </div>
              <div className="payment-card">
                <FaCcAmex size={33} color="#fff" />
              </div>
              <div className="payment-card">
                <FaCcPaypal size={33} color="#fff" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
