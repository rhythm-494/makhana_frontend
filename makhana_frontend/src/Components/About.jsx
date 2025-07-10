// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import Footer from '../Components/Footer';
import './About.css';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const stats = [
    { number: "10,000+", label: "Happy Customers", icon: "😊" },
    { number: "50+", label: "Product Varieties", icon: "🍽️" },
    { number: "5", label: "Years Experience", icon: "⏰" },
    { number: "4.8★", label: "Customer Rating", icon: "⭐" }
  ];

  const values = [
    {
      icon: "🌱",
      title: "100% Natural",
      description: "We source only the finest, chemical-free makhana directly from organic farms in Bihar, ensuring every bite is pure and healthy.",
      color: "#27ae60"
    },
    {
      icon: "🏆",
      title: "Premium Quality",
      description: "Each batch undergoes rigorous quality testing. We hand-pick only grade-A makhana that meets our exceptional standards.",
      color: "#9b59b6"
    },
    {
      icon: "🤝",
      title: "Fair Trade",
      description: "We work directly with farmers, ensuring fair prices and sustainable farming practices that benefit entire communities.",
      color: "#3498db"
    },
    {
      icon: "💚",
      title: "Health First",
      description: "Rich in protein, low in calories, and packed with nutrients - our makhana supports your healthy lifestyle goals.",
      color: "#e67e22"
    }
  ];

  const timeline = [
    {
      year: "2019",
      title: "The Beginning",
      description: "Founded with a vision to bring premium Bihar makhana to health-conscious consumers across India.",
      icon: "🌱"
    },
    {
      year: "2020",
      title: "First Milestone",
      description: "Reached 1,000 satisfied customers and expanded our product line to include 10 unique flavors.",
      icon: "🎯"
    },
    {
      year: "2021",
      title: "Quality Certification",
      description: "Achieved organic certification and established direct partnerships with 50+ farmers in Bihar.",
      icon: "🏆"
    },
    {
      year: "2022",
      title: "Nationwide Expansion",
      description: "Launched pan-India delivery and opened our state-of-the-art processing facility.",
      icon: "🚀"
    },
    {
      year: "2023",
      title: "Innovation Leader",
      description: "Introduced innovative packaging and became the most trusted makhana brand in India.",
      icon: "💡"
    },
    {
      year: "2024",
      title: "Future Ready",
      description: "Expanding internationally and continuing to innovate with new healthy snack options.",
      icon: "🌍"
    }
  ];

  return (
    <div className="about-page">
    
      <motion.section 
        className="about-hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container">
          <div className="hero-contenter">
            <motion.div className="hero-text" variants={fadeInUp}>
              <motion.h1
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  animate={{
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ display: "inline-block", marginRight: "8px" }}
                >
                  🏭
                </motion.span>
                About Makhana Delight
                <motion.span
                  animate={{
                    y: [0, -3, 0],
                    rotate: [0, 8, -8, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ display: "inline-block", marginLeft: "8px" }}
                >
                  ✨
                </motion.span>
              </motion.h1>
              <p>
                From the fertile lands of Bihar to your healthy lifestyle - we're passionate about bringing you the finest quality makhana that nourishes your body and delights your taste buds.
              </p>
              <motion.div 
                className="hero-buttons"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/products" className="cta-btn primary">
                  <span>🛍️ Shop Our Products</span>
                </Link>
                <Link to="/contact" className="cta-btn secondary">
                  <span>📞 Get In Touch</span>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="hero-image"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, rotate: [0, 1, -1, 0] }}
              transition={{ duration: 0.4 }}
            >
              <img src="/generated-image.png" alt="Makhana Farm" />
              <div className="image-overlay">
                <span className="overlay-text">Premium Quality Since 2019</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-card"
                variants={fadeInUp}
                whileHover={{ 
                  y: -5, 
                  scale: 1.05,
                  boxShadow: "0 15px 35px rgba(230, 126, 34, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.span 
                  className="stat-icon"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                >
                  {stat.icon}
                </motion.span>
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section 
        className="story-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="story-content" variants={fadeInUp}>
            <div className="story-text">
              <motion.h2
                whileHover={{ color: "#e67e22", scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  animate={{
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ display: "inline-block", marginRight: "8px" }}
                >
                  📖
                </motion.span>
                Our Story
              </motion.h2>
              <p>
                It all started with a simple question: <strong>"Why is it so hard to find truly healthy, delicious snacks?"</strong>
              </p>
              <p>
                In 2019, our founder discovered the incredible nutritional benefits of makhana during a trip to Bihar. Amazed by this superfood that was virtually unknown outside the region, we decided to bring this ancient treasure to health-conscious consumers across India.
              </p>
              <p>
                What began as a small initiative to source premium makhana directly from Bihar farmers has grown into India's most trusted makhana brand. We've maintained our commitment to quality, sustainability, and the well-being of both our customers and farming communities.
              </p>
              <motion.blockquote
                whileHover={{ scale: 1.02, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                "Every pack of Makhana Delight represents our promise of purity, quality, and the rich heritage of Bihar's finest farms."
                <cite>- Akarsh singh ,founder of makhana delight</cite>
              </motion.blockquote>
            </div>
            
            <motion.div 
              className="story-image"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img src="founder_image.jpg" alt="Our Founder" />
              <div className="story-badge">
                <span>🌟 Founded 2019</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className="values-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2>
              <motion.span
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ display: "inline-block", marginRight: "8px" }}
              >
                💎
              </motion.span>
              Our Core Values
            </h2>
            <p>The principles that guide everything we do</p>
          </motion.div>
          
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="value-card"
                variants={fadeInUp}
                whileHover={{ 
                  y: -10,
                  scale: 1.03,
                  boxShadow: `0 20px 40px ${value.color}25`,
                  borderColor: value.color
                }}
                transition={{ duration: 0.3 }}
                style={{ border: `2px solid transparent` }}
              >
                <motion.div 
                  className="value-icon"
                  style={{ backgroundColor: value.color }}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {value.icon}
                </motion.div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section 
        className="timeline-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2>
              <motion.span
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ display: "inline-block", marginRight: "8px" }}
              >
                🕒
              </motion.span>
              Our Journey
            </h2>
            <p>Milestones that shaped our story</p>
          </motion.div>
          
          <div className="timeline">
            {timeline.map((item, index) => (
              <motion.div 
                key={index}
                className="timeline-item"
                variants={fadeInUp}
                whileHover={{ scale: 1.02, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="timeline-icon"
                  whileHover={{ 
                    scale: 1.3,
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
                <div className="timeline-content">
                  <span className="timeline-year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="about-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="container">
          <div className="cta-content">
            <motion.h2
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                animate={{
                  rotate: [0, 20, -20, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ display: "inline-block", marginRight: "8px" }}
              >
                🚀
              </motion.span>
              Ready to Experience the Difference?
            </motion.h2>
            <p>Join thousands of satisfied customers who've made the healthy choice with Makhana Delight</p>
            <motion.div 
              className="cta-buttons"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/products" className="cta-btn primary">
                <span>🛍️ Shop Now</span>
              </Link>
              <Link to="/contact" className="cta-btn secondary">
                <span>💬 Contact Us</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* <Footer /> */}
    </div>
  );
};

export default About;
