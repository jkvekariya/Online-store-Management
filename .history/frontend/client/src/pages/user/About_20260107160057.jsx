import React from "react";
import { useEffect, useRef, useState } from "react";
import "../../css/about.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa";

const About = () => {
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect(); // run only once
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
  }, []);
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
            Welcome to our e-commerce store, where quality and customer
            satisfaction come first. We offer a wide range of carefully selected
            products to meet your everyday needs.
          </p>

          <div className="quote fade-in delay-3">
            <FaQuoteLeft className="quote-icon" />
            <p>
              “Smart shopping starts here. Comfort, quality, and convenience in
              one place.”
            </p>
          </div>

          <p className="fade-in delay-4">
            Our mission is to provide reliable service, secure payments, and
            fast delivery, ensuring a seamless shopping experience from start to
            finish. We believe in building long-term relationships with our
            customers by offering value, transparency, and support at every
            step.
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
      <section
        ref={sectionRef}
        className={`explore-section ${show ? "show" : ""}`}
      >
        {/* LEFT CONTENT */}
        <div className="explore-text">
          <h2 className="animate fade-delay-1">Explore Our Products</h2>

          <p className="animate fade-delay-2">
            Our store brings together diverse products across multiple
            categories, ensuring quality and consistency. We continuously update
            our collection to match trends and customer expectations.
          </p>

          <blockquote className="animate fade-delay-3 quote-box">
            <FaQuoteLeft className="quote-icon" />
            <span>
              "Every product we offer is carefully selected to combine quality,
              style, and value. Our collection is designed to meet modern needs
              while delivering lasting satisfaction".
            </span>
          </blockquote>

          <p className="animate fade-delay-4">
            Our product collection is thoughtfully curated to meet the needs of
            modern customers. We focus on quality, usability, and style to
            ensure every product delivers real value and satisfaction.
          </p>

          <p className="animate fade-delay-5">
            We believe products should be both functional and appealing. That’s
            why our collection reflects thoughtful design and lasting
            performance.
          </p>

          <button className="animate fade-delay-6">Discover More</button>
        </div>

        {/* RIGHT GRID */}
        <div className="explore-grid">
          <div className="grid-box animate fade-delay-2">
            <h3>Top Wears</h3>
            <span>Latest Collection</span>
          </div>

          <div className="grid-img animate fade-delay-3">
            <img
              src="/photos/TopWearAbout.jpg"
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
            <span>Over 204 Products</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
