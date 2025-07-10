// src/pages/Contact.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import Navbar from '../Components/Navbar';
// import Footer from '../components/Footer';
import './Contact.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // Custom Arrow Components
  const CustomPrevArrow = ({ onClick }) => (
    <button
      className="custom-arrow custom-prev"
      onClick={onClick}
      aria-label="Previous contact method"
      type="button"
    >
      <span>‹</span>
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button
      className="custom-arrow custom-next"
      onClick={onClick}
      aria-label="Next contact method"
      type="button"
    >
      <span>›</span>
    </button>
  );

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Slider settings for contact methods
  const contactSliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    centerMode: true,
    centerPadding: '0px',
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          centerMode: true,
          centerPadding: '0px',
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: false,
          centerMode: true,
          centerPadding: '0px',
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: false,
          centerMode: true,
          centerPadding: '0px',
        }
      }
    ]
  };

  // Contact methods data
  const contactMethods = [
    {
      icon: "📞",
      title: "Call Us",
      description: "Speak directly with our team for immediate assistance and personalized support",
      contact: "+91 98765 43210",
      action: "tel:+919876543210",
      color: "#27ae60",
      available: "Mon-Sat: 9:00 AM - 6:00 PM",
      badge: "Instant Support",
      highlight: "Call Now"
    },
    {
      icon: "📧",
      title: "Email Us",
      description: "Send us detailed messages and get comprehensive responses within 24 hours",
      contact: "hello@makhanadelight.com",
      action: "mailto:hello@makhanadelight.com",
      color: "#3498db",
      available: "We respond within 24 hours",
      badge: "24hr Response",
      highlight: "Email Support"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Get instant support through our live chat system during business hours",
      contact: "Chat with us now",
      action: "#",
      color: "#e67e22",
      available: "Mon-Fri: 10:00 AM - 5:00 PM",
      badge: "Live Support",
      highlight: "Chat Online"
    },
    {
      icon: "📍",
      title: "Visit Us",
      description: "Come to our office for face-to-face meetings and product demonstrations",
      contact: "123 Makhana Street, Bihar",
      action: "#",
      color: "#9b59b6",
      available: "By appointment only",
      badge: "In-Person",
      highlight: "Visit Office"
    },
    {
      icon: "📱",
      title: "WhatsApp",
      description: "Connect with us on WhatsApp for quick queries and instant responses",
      contact: "+91 98765 43210",
      action: "https://wa.me/919876543210",
      color: "#25D366",
      available: "Mon-Sat: 9:00 AM - 8:00 PM",
      badge: "Quick Chat",
      highlight: "WhatsApp Us"
    },
    {
      icon: "📺",
      title: "Video Call",
      description: "Schedule a video consultation for product demos and detailed discussions",
      contact: "Schedule a call",
      action: "#",
      color: "#FF6B6B",
      available: "Mon-Fri: 11:00 AM - 4:00 PM",
      badge: "Face-to-Face",
      highlight: "Video Chat"
    }
  ];

  const faqs = [
    {
      question: "What are your delivery times?",
      answer: "We deliver within 24-48 hours across India. Express delivery available in major cities."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes! We offer special pricing for bulk orders above 10kg. Contact us for custom quotes."
    },
    {
      question: "Are your products organic certified?",
      answer: "All our makhana products are 100% organic and certified by recognized authorities."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 30-day return policy for unopened products. Customer satisfaction is our priority."
    }
  ];
  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
  setActiveFaq(activeFaq === index ? null : index);
};

  return (
    <div className="contact-page">
      {/* <Navbar /> */}
      
      {/* Hero Section */}
      <section className="contact-hero fade-in">
        <div className="container">
          <div className="hero-content">
            <h1>
              <span className="bounce-icon">📞</span>
              Get In Touch
              <span className="bounce-icon">💬</span>
            </h1>
            <p>
              We'd love to hear from you! Whether you have questions about our products, 
              need support, or want to share feedback, our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods Section with Slider */}
      <section className="contact-methods slide-up">
        <div className="container">
          <div className="section-header">
            <h2>
              <span className="rotate-icon">🌟</span>
              Choose Your Preferred Way to Connect
            </h2>
            <p>Multiple ways to reach us - pick what works best for you!</p>
          </div>
          
          <div className="contact-slider-container">
            <div className="slider-wrapper">
              <Slider {...contactSliderSettings} className="contact-methods-slider">
                {contactMethods.map((method, index) => (
                  <div key={index} className="contact-slide">
                    <div 
                      className="method-card single-card-layout"
                      style={{ '--method-color': method.color }}
                    >
                      <div 
                        className="method-highlight"
                        style={{ backgroundColor: method.color }}
                      >
                        {method.highlight}
                      </div>
                      
                      <div 
                        className="method-badge"
                        style={{ backgroundColor: method.color }}
                      >
                        {method.badge}
                      </div>
                      
                      <div className="method-icon-container">
                        <div 
                          className="method-icon"
                          style={{ backgroundColor: method.color }}
                        >
                          {method.icon}
                        </div>
                      </div>
                      
                      <div className="method-content">
                        <h3>{method.title}</h3>
                        <p className="method-description">{method.description}</p>
                        <a 
                          href={method.action}
                          className="method-contact"
                          style={{ color: method.color }}
                        >
                          {method.contact}
                        </a>
                        <span className="method-availability">{method.available}</span>
                      </div>
                      
                      <div
                        className="method-glow"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${method.color}, transparent)`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="contact-form-section fade-in">
        <div className="container">
          <div className="contact-content">
            {/* Contact Form */}
            <div className="form-container slide-left">
              <div className="form-header">
                <h3>
                  <span className="wiggle-icon">✉️</span>
                  Send Us a Message
                </h3>
                <p>Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="inquiryType">Inquiry Type</label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="order">Order Support</option>
                      <option value="wholesale">Wholesale/Bulk Orders</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief subject of your message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button 
                  type="submit"
                  className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>
                      <span className="spinner">⏳</span>
                      Sending...
                    </span>
                  ) : (
                    <span>
                      <span>🚀</span>
                      Send Message
                    </span>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="success-message slide-down">
                    ✅ Thank you! Your message has been sent successfully. We'll get back to you soon!
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="error-message slide-down">
                    ❌ Sorry, there was an error sending your message. Please try again.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info & Map */}
            <div className="info-container slide-right">
              <div className="contact-info">
                <h3>
                  <span className="pulse-icon">🏢</span>
                  Visit Our Office
                </h3>
                
                <div className="info-details">
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <div>
                      <strong>Address</strong>
                      <p>123 Makhana Street<br />Bihar, India 800001</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-icon">🕒</span>
                    <div>
                      <strong>Business Hours</strong>
                      <p>Monday - Saturday<br />9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-icon">⚡</span>
                    <div>
                      <strong>Response Time</strong>
                      <p>Email: Within 24 hours<br />Phone: Immediate</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="social-section">
                  <h4>Follow Us</h4>
                  <div className="social-links">
                    <a href="#" aria-label="Facebook">📘</a>
                    <a href="#" aria-label="Instagram">📷</a>
                    <a href="#" aria-label="Twitter">🐦</a>
                    <a href="#" aria-label="WhatsApp">💬</a>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="map-container">
                <div className="map-placeholder">
                  <span className="map-icon">🗺️</span>
                  <p>Interactive Map</p>
                  <small>Click to view location</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section fade-in">
  <div className="container">
    <div className="section-header">
      <h2>
        <span className="spin-icon">❓</span>
        Frequently Asked Questions
      </h2>
      <p>Quick answers to common questions</p>
    </div>
    
    <div className="faq-grid">
      {faqs.map((faq, index) => (
        <div 
          key={index}
          className={`faq-item ${activeFaq === index ? 'active' : ''}`}
        >
          <button 
            className={`faq-question ${activeFaq === index ? 'active' : ''}`}
            onClick={() => toggleFaq(index)}
            aria-expanded={activeFaq === index}
          >
            <h4>{faq.question}</h4>
            <div className={`faq-icon ${activeFaq === index ? 'active' : ''}`}>
              {activeFaq === index ? '−' : '+'}
            </div>
          </button>
          
          <div 
            className={`faq-answer ${activeFaq === index ? 'active' : ''}`}
          >
            <div className="faq-answer-content">
              <p>{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* <Footer /> */}
    </div>
  );
};

export default Contact;
