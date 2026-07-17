import React from "react";
import "../css/footer.css";
import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="main-footer">
        <div className="footer-container">
          <div className="sec-one-about">
            <h1>hello</h1>
            <p>
              let's purchasing new exclusive products in offer to provide lovely
              feeling.
            </p>
          </div>
          <div className="sec-two-customer-link">
            <h2>customer services</h2>
            <ul className="footer-list">
              <li><Link to="">my account</Link></li>
              <li><Link to="">shipping & delivery</Link></li>
              <li><Link to="">order tracking</Link></li>
              <li><Link to="">orders history</Link></li>
              <li><Link to="">help & FAQs</Link></li>
              <li><Link to="">fast delivery</Link></li>
              <li><Link to="">privacy</Link></li>
            </ul>
          </div>
          <div className="sec-three-useful-link">
            <h2>useful links</h2>
            <ul className="useful-link">
              <li><Link to="/">home</Link></li>
              <li><Link to="products">services</Link></li>
              <li><Link to="contact">contact</Link></li>
              <li><Link to="about">about us</Link></li>
              <li><Link to="faq">faq</Link></li>
            </ul>
          </div>
          <div className="sec-four-contact">
            <h2>contact info</h2>
            <h3>adress</h3>
            <p>12,crystal plaza,varachha,surat -395010.</p>
            <h3>phone</h3>
            <p>(132)5465 2389</p>
            <h3>email</h3>
            <p>hello@gmail.com</p>
            <h3>working days/hours</h3>
            <p>mon-sat/ 9:00 AM - 8:00 PM</p>

            <div className="facebook-icon">
              <FaFacebookF />
            </div>
            <div className="twiter-icon">
              <FaTwitter />
            </div>
            <div className="instagram-icon">
              <FaInstagram />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
