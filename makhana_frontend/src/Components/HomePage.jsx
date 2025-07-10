import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import { useCart } from '../context/CartContext.jsx';
import { useFlyToCart } from '../hooks/useFlyToCart.js';
import { productAPI } from '../services/api';
import './HomePage.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Enhanced Custom Arrow Components for Mobile
const CustomPrevArrow = ({ onClick }) => (
  <motion.button
    className="custom-arrow custom-prev mobile-friendly"
    onClick={onClick}
    whileHover={{ scale: 1.1, backgroundColor: "#e67e22" }}
    whileTap={{ scale: 0.9 }}
    transition={{ duration: 0.2 }}
    aria-label="Previous slide"
  >
    <span>‹</span>
  </motion.button>
);

const CustomNextArrow = ({ onClick }) => (
  <motion.button
    className="custom-arrow custom-next mobile-friendly"
    onClick={onClick}
    whileHover={{ scale: 1.1, backgroundColor: "#e67e22" }}
    whileTap={{ scale: 0.9 }}
    transition={{ duration: 0.2 }}
    aria-label="Next slide"
  >
    <span>›</span>
  </motion.button>
);

const HomePage = () => {
  const { addToCart } = useCart();
  const flyToCart = useFlyToCart();
  const cartIconRef = useRef(null);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAllProducts();
      setFeaturedProducts(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product, event) => {
    const productCard = event.target.closest('.product-card');
    const productImage = productCard?.querySelector('.product-image img');
    
    const cartIcon = document.querySelector('.cart-icon .cart-emoji');
    
    // Try to add to cart (will check if user is logged in)
    const success = await addToCart(product);
    
    if (success) {
      // Only show animation if successfully added
      if (productImage && cartIcon) {
        flyToCart(productImage, cartIcon);
      }
      
      // Show success toast
      showSuccessToast(product.name);
    }
    // If not successful, addToCart already showed login alert
  };

  const showSuccessToast = (productName) => {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">✅</div>
        <div class="toast-message">
          <div class="toast-title">Added to Cart!</div>
          <div class="toast-subtitle">${productName}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 4000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  // Updated slider settings for single card display
  const featureSliderSettings = {
    dots: false,
    infinite: false,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    centerMode: true,
    centerPadding: '0px',
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

  // Enhanced features with more details
  const features = [
    { 
      icon: "🌱", 
      title: "100% Natural", 
      desc: "No artificial preservatives, chemicals, or additives. Pure, organic makhana sourced directly from trusted Bihar farmers with complete transparency in our supply chain.", 
      color: "#27ae60",
      badge: "Organic Certified",
      highlight: "Farm Fresh"
    },
    { 
      icon: "🍽️", 
      title: "Multiple Flavors", 
      desc: "From classic roasted to exotic masala, sweet caramel, and fusion varieties. Something delicious for every taste preference with new flavors added regularly.", 
      color: "#e74c3c",
      badge: "15+ Varieties",
      highlight: "Taste Paradise"
    },
    { 
      icon: "🚚", 
      title: "Fast Delivery", 
      desc: "Quick and secure delivery to your doorstep within 24-48 hours. Fresh products guaranteed with proper packaging and temperature-controlled logistics.", 
      color: "#3498db",
      badge: "24-48 Hours",
      highlight: "Express Shipping"
    },
    { 
      icon: "💪", 
      title: "High Protein", 
      desc: "Rich in protein (9.7g per 100g), low in calories, and packed with essential nutrients. Perfect for fitness enthusiasts and health-conscious individuals.", 
      color: "#f39c12",
      badge: "9.7g Protein",
      highlight: "Fitness Fuel"
    },
    { 
      icon: "🏆", 
      title: "Premium Quality", 
      desc: "Hand-picked, grade-A makhana ensuring the highest quality standards. Each batch is carefully inspected for excellence and consistency in taste.", 
      color: "#9b59b6",
      badge: "Grade A Quality",
      highlight: "Premium Select"
    },
    { 
      icon: "🌿", 
      title: "Healthy Choice", 
      desc: "Rich in antioxidants, magnesium, and potassium. Low in sodium and fat. A perfect guilt-free snacking option for the entire family.", 
      color: "#1abc9c",
      badge: "Antioxidant Rich",
      highlight: "Family Healthy"
    },
    { 
      icon: "📦", 
      title: "Fresh Packaging", 
      desc: "Advanced vacuum-sealed packaging technology to maintain freshness, crispiness, and extend shelf life up to 12 months without compromising quality.", 
      color: "#e67e22",
      badge: "12 Month Fresh",
      highlight: "Stay Crispy"
    },
    { 
      icon: "⭐", 
      title: "Customer Rated", 
      desc: "Highly rated 4.8/5 stars by thousands of satisfied customers across India. Join our happy customer family and experience the difference.", 
      color: "#f1c40f",
      badge: "4.8★ Rating",
      highlight: "Customer Love"
    }
  ];

  const instantContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0
      }
    }
  };

  const quickFade = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const playfulBounce = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hero-title"
            >
              <motion.span
                whileHover={{
                  scale: 1.05,
                  color: "#e67e22"
                }}
                transition={{ duration: 0.2 }}
                className="title-word"
              >
                Premium
              </motion.span>{" "}
              <motion.span
                animate={{ 
                  color: ["#ffffff", "#e67e22", "#f39c12", "#ffffff"]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="title-word title-highlight"
              >
                Makhana
              </motion.span>{" "}
              <motion.span
                animate={{
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="title-word"
              >
                Snacks
              </motion.span>
            </motion.h1>
            
            <motion.div 
              className="hero-badge"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Experience wellness in every bite — light, protein-rich, and roasted just right. Our makhana snacks aren't just tasty, they're crafted to nourish.
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hero-visual"
            initial={{ x: 50, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <div className="hero-image-container">
              <motion.div
                className="image-wrapper"
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -2, 2, 0]
                }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <img src="/generated-image.png" alt="Premium Makhana" className="hero-image" />
                </motion.div>
                <div className="image-glow"></div>
              </motion.div>
              
              <div className="floating-elements-local">
                {['🥜', '✨', '🌟', '💫', '🎉'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    className={`floating-emoji emoji-${i + 1}`}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut"
                    }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              className="hero-buttons"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  y: -3
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/products" className="btn-primary">
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="btn-content"
                  >
                    <span className="btn-icon">🛒</span>
                    <span className="btn-text">Shop Now</span>
                  </motion.span>
                  <div className="btn-shine"></div>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/about" className="btn-secondary">
                  <motion.span
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                    className="btn-icon"
                  >
                    ✨
                  </motion.span>
                  <span className="btn-text">Learn More</span>
                  <div className="btn-glow"></div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="floating-elements">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-particle"
              initial={{ 
                opacity: 0,
                scale: 0
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [100, -100],
                x: [0, Math.random() * 50 - 25]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut"
              }}
              style={{
                position: 'absolute',
                left: `${10 + Math.random() * 80}%`,
                bottom: '0%',
                pointerEvents: 'none'
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Enhanced Features Section with Single Card Display */}
      <motion.section 
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.h2
              whileHover={{
                scale: 1.02,
                color: "#e67e22"
              }}
            >
              <motion.span
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ display: "inline-block", marginRight: "8px" }}
              >
                🌟
              </motion.span>
              Why Choose Our Makhana?
              <motion.span
                animate={{
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
                style={{ display: "inline-block", marginLeft: "8px" }}
              >
                🌟
              </motion.span>
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Discover what makes our makhana the perfect choice for healthy snacking
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="features-slider-container"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Slider {...featureSliderSettings} className="features-slider single-card">
              {features.map((feature, index) => (
                <div key={index} className="feature-slide">
                  <motion.div 
                    className="feature-card single-card-layout"
                    whileHover={{ 
                      y: -15,
                      scale: 1.02,
                      boxShadow: `0 25px 50px ${feature.color}30`,
                      borderColor: feature.color
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      border: `3px solid transparent`,
                      borderRadius: "25px"
                    }}
                  >
                    <motion.div 
                      className="feature-highlight"
                      style={{ backgroundColor: feature.color }}
                    >
                      {feature.highlight}
                    </motion.div>
                    
                    <motion.div 
                      className="feature-badge"
                      style={{ backgroundColor: feature.color }}
                    >
                      {feature.badge}
                    </motion.div>
                    
                    <motion.div 
                      className="feature-icon-container"
                    >
                      <motion.div 
                        className="feature-icon"
                        whileHover={{ 
                          scale: 1.4,
                          rotate: [0, -20, 20, 0],
                          y: -8
                        }}
                        transition={{ duration: 0.6 }}
                        style={{ fontSize: "4rem" }}
                      >
                        {feature.icon}
                      </motion.div>
                    </motion.div>
                    
                    <motion.div className="feature-content">
                      <motion.h3
                        whileHover={{ 
                          color: feature.color,
                          scale: 1.05
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.title}
                      </motion.h3>
                      
                      <p>{feature.desc}</p>
                    </motion.div>
                    
                    <motion.div
                      className="feature-glow"
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        height: "6px",
                        background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                        borderRadius: "0 0 25px 25px",
                        opacity: 0
                      }}
                      whileHover={{
                        opacity: 1
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <motion.div
                      className="magic-sparkles"
                      style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        fontSize: "1.5rem",
                        opacity: 0
                      }}
                      whileHover={{
                        opacity: 1,
                        scale: [0, 1.5, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      ✨
                    </motion.div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section 
        className="featured-products-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={instantContainer}
      >
        <div className="container">
          <motion.h2
            variants={playfulBounce}
            whileHover={{
              scale: 1.02,
              background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              animate={{
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ display: "inline-block", marginRight: "12px" }}
            >
              🎪
            </motion.span>
            Featured Products
            <motion.span
              animate={{
                rotate: [360, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ display: "inline-block", marginLeft: "12px" }}
            >
              🎪
            </motion.span>
          </motion.h2>
          
          <motion.p
            variants={quickFade}
            whileHover={{
              scale: 1.01,
              color: "#e67e22"
            }}
            transition={{ duration: 0.15 }}
          >
            Discover our most popular makhana varieties
          </motion.p>
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                className="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(45deg, #e67e22, #f39c12)',
                    borderRadius: '50%',
                    margin: '0 auto 15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}
                >
                  🥜
                </motion.div>
                <motion.span
                  animate={{
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Loading products...
                </motion.span>
              </motion.div>
            ) : (
              <motion.div 
                className="products-grid"
                variants={instantContainer}
                initial="hidden"
                animate="visible"
              >
                {featuredProducts.map((product, index) => (
                  <motion.div 
                    key={product.id} 
                    className="product-card"
                    variants={quickFade}
                    whileHover={{ 
                      y: -8,
                      scale: 1.01,
                      boxShadow: "0 15px 35px rgba(0,0,0,0.12)"
                    }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden"
                    }}
                  >
                    <motion.div 
                      className="product-image"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                      style={{ position: "relative" }}
                    >
                      {product.image ? (
                        <motion.img 
                          src={`http://localhost/makhana_backend/uploads/${product.image}`}
                          alt={product.name}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{
                            filter: "brightness(1.05)"
                          }}
                          onError={(e) => {
                            e.target.src = '/images/placeholder-makhana.jpg';
                          }}
                        />
                      ) : (
                        <motion.div 
                          className="placeholder-image"
                          animate={{ 
                            rotate: [0, 3, -3, 0],
                            scale: [1, 1.02, 1]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.2
                          }}
                          style={{
                            background: "linear-gradient(45deg, #ff9a9e, #fecfef, #fad0c4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "200px",
                            fontSize: "2.5rem"
                          }}
                        >
                          <motion.span
                            animate={{
                              y: [0, -3, 0],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            🥜
                          </motion.span>
                        </motion.div>
                      )}
                      
                      {product.stock_quantity === 0 && (
                        <motion.div 
                          className="out-of-stock-badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, duration: 0.3 }}
                          whileHover={{
                            scale: 1.02,
                            rotate: [0, -2, 2, 0]
                          }}
                          style={{
                            background: "linear-gradient(45deg, #e74c3c, #c0392b)",
                            borderRadius: "10px",
                            padding: "5px 8px"
                          }}
                        >
                          😢 Out of Stock
                        </motion.div>
                      )}
                      
                      <motion.div
                        className="product-sparkles"
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          fontSize: "1rem"
                        }}
                        animate={{
                          rotate: [0, 360],
                          scale: [0.8, 1, 0.8]
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        ✨
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      className="product-info"
                      style={{ padding: "18px" }}
                    >
                      <motion.h3
                        whileHover={{ 
                          color: "#e67e22",
                          scale: 1.01
                        }}
                        transition={{ duration: 0.15 }}
                      >
                        {product.name}
                      </motion.h3>
                      
                      <motion.p 
                        className="product-description"
                        initial={{ opacity: 1 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {product.description}
                      </motion.p>
                      
                      <motion.div 
                        className="product-price"
                        whileHover={{ 
                          scale: 1.05,
                          color: "#27ae60"
                        }}
                        transition={{ duration: 0.15 }}
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: "bold",
                          margin: "10px 0"
                        }}
                      >
                        {formatPrice(product.price)}
                      </motion.div>
                      
                      <motion.button 
                        className={`add-to-cart-btn ${product.stock_quantity === 0 ? 'disabled' : ''}`}
                        disabled={product.stock_quantity === 0}
                        onClick={(e) => handleAddToCart(product, e)}
                        whileHover={product.stock_quantity > 0 ? { 
                          scale: 1.02,
                          y: -1,
                          boxShadow: "0 6px 15px rgba(39, 174, 96, 0.25)"
                        } : {}}
                        whileTap={product.stock_quantity > 0 ? { 
                          scale: 0.98
                        } : {}}
                      >
                        <motion.span
                          whileHover={product.stock_quantity > 0 ? { x: 2 } : {}}
                          transition={{ duration: 0.1 }}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
                        >
                          {product.stock_quantity === 0 ? (
                            <>😢 Out of Stock</>
                          ) : (
                            <>
                              <motion.span
                                animate={{
                                  rotate: [0, 10, -10, 0]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                🛒
                              </motion.span>
                              Add to Cart
                            </>
                          )}
                        </motion.span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="view-all-container"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.03,
                rotate: [0, -0.5, 0.5, 0]
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <Link to="/products" className="view-all-btn">
                <motion.span
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <motion.span
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    🎯
                  </motion.span>
                  View All Products
                  <motion.span
                    animate={{
                      x: [0, 2, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.span>
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        className="about-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={instantContainer}
      >
        <div className="container">
          <motion.div 
            className="about-content"
            variants={instantContainer}
          >
            <motion.div 
              className="about-text"
              variants={quickFade}
            >
              <motion.h2
                whileHover={{ 
                  color: "#e67e22",
                  scale: 1.01
                }}
                transition={{ duration: 0.15 }}
              >
                <motion.span
                  animate={{
                    rotate: [0, 8, -8, 0]
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
              </motion.h2>
              
              <motion.p
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.15 }}
              >
                We are passionate about bringing you the finest quality makhana (fox nuts) directly from the 
                fertile lands of Bihar, India. Our commitment to quality, taste, and health makes us your 
                trusted partner for nutritious snacking.
              </motion.p>
              
              <motion.p
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.15 }}
              >
                Each batch is carefully selected, processed, and packaged to retain maximum nutritional value 
                while delivering exceptional taste. From traditional roasted varieties to innovative flavored 
                options, we cater to diverse palates.
              </motion.p>
              
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  rotate: [0, -1, 1, 0]
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Link to="/about" className="learn-more-btn">
                  <motion.span
                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <motion.span
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      🌟
                    </motion.span>
                    Learn More About Us
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="about-image"
              variants={quickFade}
              whileHover={{ 
                scale: 1.02,
                rotate: [0, 0.5, -0.5, 0]
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.img 
                src="images.jpg" 
                alt="Makhana Farm"
                initial={{ borderRadius: "12px" }}
                whileHover={{ borderRadius: "16px" }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section 
        className="newsletter-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <motion.div 
            className="newsletter-content"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.h2
              whileHover={{ 
                scale: 1.02,
                color: "#f39c12"
              }}
              transition={{ duration: 0.15 }}
            >
              <motion.span
                animate={{
                  rotate: [0, 12, -12, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ display: "inline-block", marginRight: "8px" }}
              >
                📧
              </motion.span>
              Stay Updated
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
                🔔
              </motion.span>
            </motion.h2>
            
            <motion.p
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.15 }}
            >
              Get the latest updates on new products, offers, and health tips
            </motion.p>
            
            <motion.div 
              className="newsletter-form"
              initial={{ scale: 0.98, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.input 
                type="email" 
                placeholder="Enter your email address"
                whileFocus={{ 
                  scale: 1.01,
                  borderColor: "#e67e22"
                }}
                transition={{ duration: 0.15 }}
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  border: "2px solid #ddd"
                }}
              />
              
              <motion.button 
                type="submit"
                whileHover={{ 
                  scale: 1.03,
                  y: -1,
                  boxShadow: "0 6px 15px rgba(230, 126, 34, 0.25)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
                style={{
                  borderRadius: "10px",
                  padding: "10px 18px",
                  border: "none",
                  background: "linear-gradient(45deg, #e67e22, #f39c12)",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                <motion.span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <motion.span
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    🚀
                  </motion.span>
                  Subscribe
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Makhana Delight</h3>
              <p>Your trusted source for premium, healthy makhana snacks.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Customer Service</h4>
              <ul>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/returns">Returns</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Connect With Us</h4>
              <div className="social-links">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="Twitter">🐦</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Makhana Delight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
