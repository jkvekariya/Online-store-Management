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
    {/*---------------- ABOUT AND OUR SKILL PAGE 1 -------------------*/}

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

    {/*---------------- EXPLORE OUR PRODUCTS PAGE 2 -------------------*/}
        <section className="explore-section">
      {/* LEFT CONTENT */}
      <div className="explore-text">
        <h2 className="animate fade-delay-1">Explore Our Products</h2>

        <p className="animate fade-delay-2">
          You are allowed to use this HexaShop HTML CSS template. You can feel
          free to modify or edit this layout. You can convert this template as
          any kind of ecommerce CMS theme as you wish.
        </p>

        <blockquote className="animate fade-delay-3">
          You are not allowed to redistribute this template ZIP file on any
          other website.
        </blockquote>

        <p className="animate fade-delay-4">
          There are 5 pages included in this HexaShop Template and we are
          providing it to you for absolutely free of charge at our TemplateMo
          website.
        </p>

        <p className="animate fade-delay-5">
          If this template is beneficial for your website or business, please
          kindly support us a little via PayPal.
        </p>

        <button className="animate fade-delay-6">Discover More</button>
      </div>

      {/* RIGHT GRID */}
      <div className="explore-grid">
        <div className="grid-box animate fade-delay-2">
          <h3>Leather Bags</h3>
          <span>Latest Collection</span>
        </div>

        <div className="grid-img animate fade-delay-3">
          <img
            src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f"
            alt="Bag"
          />
        </div>

        <div className="grid-img animate fade-delay-4">
          <img
            src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb"
            alt="Fashion"
          />
        </div>

        <div className="grid-box animate fade-delay-5">
          <h3>Different Types</h3>
          <span>Over 304 Products</span>
        </div>
      </div>
    </section>
    </>
  );
};

export default About;
