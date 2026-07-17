import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import PagebodyHeader from '../../components/PagebodyHeader'
import '../../css/faq.css'
import { FaChevronDown } from 'react-icons/fa'

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null)
  const [showFaq, setShowFaq] = useState(false)
  const [cmsData, setCmsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const faqRef = useRef(null)

  useEffect(() => {
    const fetchFaq = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/page-content/faq');
        setCmsData(res.data);
      } catch (error) {
        console.error("Using static FAQ content");
      }
      setLoading(false);
    };
    fetchFaq();
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowFaq(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    );

    if (faqRef.current) {
      observer.observe(faqRef.current)
    }

    return () => observer.disconnect();
  }, [])

  const faqData = []

  return (
    <>
      <PagebodyHeader title={cmsData?.title || "FAQs"} />

      <div className="faq-container">
        <div ref={faqRef} className={`faq-layout ${showFaq ? 'show' : ''}`}>
          {/* Left Column: Image */}
          <div className="faq-image-container animate delay-1">
            <img src="/photos/Faqpic.jpg" alt="Frequently Asked Questions" />
          </div>

          {/* Right Column: Content and Accordion */}
          <div className="faq-content">
            <h2 className="animate delay-2">FAQ</h2>
            <p className="faq-description animate delay-3">
              {cmsData?.sections?.introduction || "Find answers to the most common questions about our products, shipping, and services. If you don't find what you're looking for, feel free to contact us."}
            </p>

            <div className="faq-accordion">
              {(cmsData?.sections?.faqs || faqData).map((item, index) => (
                <div
                  key={index}
                  className={`faq-item animate delay-4 ${activeIndex === index ? 'active' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleAccordion(index)}
                  >
                    <h3>{item.question}</h3>
                    <FaChevronDown className="faq-icon" />
                  </button>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Faq
