import React from "react";
import "../../css/about.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa";

const About = () => {
  return (
    <>
      <section className="about-section">
        {/* LEFT IMAGE */}
        <div className="about-image">
          <img src="/photos/bodyheaderPic.jpg" alt="Store" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="about-content">
          <h2 className="fade-in delay-1">About Us & Our Skills</h2>

          <p className="fade-in delay-2">
            Welcome to our e-commerce store, where quality and customer satisfaction come first.
            We offer a wide range of carefully selected products to meet your everyday needs.
          </p>

          <div className="quote fade-in delay-3">
            <FaQuoteLeft className="quote-icon" />
            <p>
              “Smart shopping starts here. Comfort, quality, and convenience in
              one place.”
            </p>
          </div>

          <p className="fade-in delay-4">
            Our mission is to provide reliable service, secure payments, 
            and fast delivery, ensuring a seamless shopping experience from start to finish. 
            We believe in building long-term relationships with our customers by offering value, 
            transparency, and support at every step.
          </p>

          <div className="divider fade-in delay-5"></div>

          <div className="social-icons fade-in delay-6">
            <span>
              <FaFacebookF />
            </span>
            <span>
              <FaTwitter />
            </span>
            <span>
              <FaLinkedinIn />
            </span>
            <span>
              <FaInstagram />
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
