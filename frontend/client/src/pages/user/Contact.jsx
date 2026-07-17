import React, { useEffect, useRef, useState } from 'react'
import PagebodyHeader from '../../components/PagebodyHeader'
import '../../css/contact.css'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWallet, FaThumbsUp, FaBoxOpen } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'

const Contact = () => {
  const cardsRef = useRef(null);
  const formRef = useRef(null);
  const featuresRef = useRef(null);

  const [showCards, setShowCards] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  // Dynamic Contact Info State
  const [contactInfo, setContactInfo] = useState({
    phone: '+0123 234 9568',
    email: 'support@clothify.com',
    address: '12,crystal plaza\nvarachha, surat - 395010\nGujarat.'
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/contact/submit', formData);
      toast.success(response.data.message || "Your query sent successfully");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/page-content/contact');
        if (res.data && res.data.sections) {
          setContactInfo({
            phone: res.data.sections.contactNumber || contactInfo.phone,
            email: res.data.sections.email || contactInfo.email,
            address: res.data.sections.address || contactInfo.address
          });
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };
    fetchContactInfo();
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.2 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === cardsRef.current) setShowCards(true);
          if (entry.target === formRef.current) setShowForm(true);
          if (entry.target === featuresRef.current) setShowFeatures(true);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (cardsRef.current) observer.observe(cardsRef.current);
    if (formRef.current) observer.observe(formRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <PagebodyHeader title="Contact Us" />

      <div className="contact-container">
        {/* Contact info cards */}
        <section ref={cardsRef} className={`contact-cards ${showCards ? 'show' : ''}`}>
          <div className="contact-card animate delay-1">
            <FaPhoneAlt className="contact-card-icon" />
            <h3>Contact</h3>
            <p className="highlight">{contactInfo.phone}</p>
          </div>

          <div className="contact-card animate delay-2">
            <FaEnvelope className="contact-card-icon" />
            <h3>Email</h3>
            <p>{contactInfo.email}</p>
          </div>

          <div className="contact-card animate delay-3">
            <FaMapMarkerAlt className="contact-card-icon" />
            <h3>Location</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{contactInfo.address}</p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section ref={formRef} className={`contact-form-section ${showForm ? 'show' : ''}`}>
          <div className="contact-image-container animate delay-1">
            <img src="/photos/Contact-us-pic.jpeg" alt="Contact Us" />
          </div>

          <div className="contact-form-container">
            <h2 className="animate delay-2">Contact Us</h2>
            <p className="description animate delay-3">
              Have questions or need help with your order? Our support team is here to help, reach out anytime and we’ll get back to you as soon as possible.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group animate delay-4">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group animate delay-4">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width animate delay-5">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width animate delay-5">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width animate delay-5">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button type="submit" className="send-btn animate delay-5">SEND</button>
            </form>
          </div>
        </section>

        {/* Service Features Section */}
        <section ref={featuresRef} className={`service-features ${showFeatures ? 'show' : ''}`}>
          <div className="service-feature animate delay-1">
            <FaBoxOpen className="service-icon" />
            <div className="service-info">
              <h4>Free Shipping</h4>
              <p>Free Shipping for orders over ₹899</p>
            </div>
          </div>

          <div className="service-feature animate delay-2">
            <FaThumbsUp className="service-icon" />
            <div className="service-info">
              <h4>24/7 Support</h4>
              <p>Dedicated support for our customers</p>
            </div>
          </div>

          <div className="service-feature animate delay-3">
            <FaWallet className="service-icon" />
            <div className="service-info">
              <h4>Online Payment</h4>
              <p>Secure and safe payment options</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Contact
