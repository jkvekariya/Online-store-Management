import React from "react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../../css/about.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { FaQuoteLeft, FaPlay, FaTimes, FaDollarSign, FaHeadphones, FaCreditCard } from "react-icons/fa";
import PageBodyHeader from "../../components/PagebodyHeader";

const CounterCard = ({ target, title }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isVisible, target]);

  return (
    <div className="stats-card" ref={cardRef}>
      <h2>{count}+</h2>
      <p>{title}</p>
    </div>
  );
};

const About = () => {
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [cmsContent, setCmsContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/page-content/about');
        setCmsContent(res.data);
      } catch (error) {
        console.error("Using static about content");
      }
    };
    fetchContent();
  }, []);

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
      <PageBodyHeader title={cmsContent?.title || "About Us"} />
      {/*---------------- ABOUT AND OUR SKILL PAGE 1 -------------------*/}

      <section className="about-section">
        {/* LEFT IMAGE */}
        <div className="about-image">
          <img src="/photos/bodyheaderPic.jpg" alt="Store" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="about-content">
          <h2 className="fade-in delay-1">{cmsContent?.sections?.hero?.title || "About Us & Our Skills"}</h2>

          <p className="fade-in delay-2">
            {cmsContent?.sections?.hero?.description || "Welcome to our e-commerce store, where quality and customer satisfaction come first. We offer a wide range of carefully selected products to meet your everyday needs."}
          </p>

          <div className="quote fade-in delay-3">
            <FaQuoteLeft className="quote-icon" />
            <p>
              “{cmsContent?.sections?.hero?.quote || "Smart shopping starts here. Comfort, quality, and convenience in one place."}”
            </p>
          </div>

          <p className="fade-in delay-4">
            {cmsContent?.sections?.hero?.mission || "Our mission is to provide reliable service, secure payments, and fast delivery, ensuring a seamless shopping experience from start to finish. We believe in building long-term relationships with our customers by offering value, transparency, and support at every step."}
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
          <h2 className="animate fade-delay-1">{cmsContent?.sections?.explore?.title || "Explore Our Products"}</h2>

          <p className="animate fade-delay-2">
            {cmsContent?.sections?.explore?.description || "Our store brings together diverse products across multiple categories, ensuring quality and consistency. We continuously update our collection to match trends and customer expectations."}
          </p>

          <blockquote className="animate fade-delay-3 quote-box">
            <FaQuoteLeft className="quote-icon" />
            <span>
              {cmsContent?.sections?.explore?.quote || '"Every product we offer is carefully selected to combine quality, style, and value. Our collection is designed to meet modern needs while delivering lasting satisfaction".'}
            </span>
          </blockquote>

          <p className="animate fade-delay-4">
            {cmsContent?.sections?.explore?.content1 || "Our product collection is thoughtfully curated to meet the needs of modern customers. We focus on quality, usability, and style to ensure every product delivers real value and satisfaction."}
          </p>

          <p className="animate fade-delay-5">
            {cmsContent?.sections?.explore?.content2 || "We believe products should be both functional and appealing. That’s why our collection reflects thoughtful design and lasting performance."}
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
              src="/photos/otherAbout.jpg"
              alt="Bag"
            />
          </div>

          <div className="grid-img animate fade-delay-4">
            <img
              src="/photos/DifferentTypeAbout.jpg"
              alt="Fashion"
            />
          </div>

          <div className="grid-box animate fade-delay-5">
            <h3>Different Types</h3>
            <span>Over 204 Products</span>
          </div>
        </div>
      </section>

      {/*---------------- STATISTICS SECTION -------------------*/}
      <section className="stats-section">
        {(cmsContent?.sections?.stats || [
          { target: 240, title: "Product Types" },
          { target: 3, title: "Years Of Experience" },
          { target: 3500, title: "Trust Customers" },
          { target: 15, title: "Stores Nationwide" }
        ]).map((stat, index) => (
          <CounterCard key={index} target={stat.target} title={stat.title} />
        ))}
      </section>

      {/*---------------- VIDEO SECTION -------------------*/}
      <section className="video-section">
        <div className="video-container">
          <div className="play-button" onClick={() => setIsVideoOpen(true)}>
            <FaPlay />
          </div>
        </div>

        {isVideoOpen && (
          <div className="video-modal" onClick={() => setIsVideoOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setIsVideoOpen(false)}>
                <FaTimes />
              </button>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </section>

      {/*---------------- GUARANTEE CARDS SECTION -------------------*/}
      <section className="guarantee-section">
        <div className="guarantee-card">
          <div className="guarantee-icon-box">
            <FaDollarSign className="guarantee-icon" />
          </div>
          <div className="guarantee-info">
            <h3>Money Guarantee</h3>
            <p>Within 7 days for an exchange</p>
          </div>
        </div>

        <div className="guarantee-card">
          <div className="guarantee-icon-box">
            <FaHeadphones className="guarantee-icon" />
          </div>
          <div className="guarantee-info">
            <h3>Online Support</h3>
            <p>24 hours a day, 7 days a week</p>
          </div>
        </div>

        <div className="guarantee-card">
          <div className="guarantee-icon-box">
            <FaCreditCard className="guarantee-icon" />
          </div>
          <div className="guarantee-info">
            <h3>Flexible Payment</h3>
            <p>Pay with Multiple Credit Cards</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
