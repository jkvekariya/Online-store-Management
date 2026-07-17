import React from 'react'
import "../../css/about.css"
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaBehance } from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa";


const About = () => {
  return (
    <>
     <section className="about-section">
      {/* LEFT IMAGE */}
      <div className="about-image">
        <img
          src="https://images.unsplash.com/photo-1521335629791-ce4aec67dd53"
          alt="Store"
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="about-content">
        <h2 className="fade-in delay-1">About Us & Our Skills</h2>

        <p className="fade-in delay-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore.
        </p>

        <div className="quote fade-in delay-3">
          <FaQuoteLeft className="quote-icon" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </p>
        </div>

        <p className="fade-in delay-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad
          minim veniam.
        </p>

        <div className="divider fade-in delay-5"></div>

        <div className="social-icons fade-in delay-6">
          <span><FaFacebookF /></span>
          <span><FaTwitter /></span>
          <span><FaLinkedinIn /></span>
          <span><FaBehance /></span>
        </div>
      </div>
    </section>
    </>
  )
}

export default About