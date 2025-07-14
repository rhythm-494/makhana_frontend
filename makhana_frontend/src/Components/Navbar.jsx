import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import LoginModal from './LoginModal';
import { authService } from '../services/authService';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { getTotalItems, refreshUserCart, currentUser } = useCart();
  
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      closeMenu();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setShowUserDropdown(false);
    document.body.classList.remove('menu-open');
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    closeMenu();
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setShowUserDropdown(false);
      closeMenu();
      await refreshUserCart();
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkUserSession = async () => {
    try {
      setLoading(true);
      const response = await authService.checkSession();
      console.log("Session check response:", response);
      
      if (response.status === 1 && response.logged_in) {
        setUser(response.user);
        setIsAuthenticated(true);
        await refreshUserCart();
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    console.log('Login successful, refreshing session and cart...');
    // Add delay to ensure backend session is properly set
    setTimeout(async () => {
      await checkUserSession();
      closeLoginModal();
    }, 1500);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isMenuOpen) closeMenu();
        if (showUserDropdown) setShowUserDropdown(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, showUserDropdown]);

  // Initial session check on component mount
  useEffect(() => {
    checkUserSession();
  }, []);

  // Sync with cart context user (only if different)
  useEffect(() => {
    if (currentUser && (!user || user.id !== currentUser.id)) {
      console.log('Cart user changed, updating navbar user:', currentUser);
      setUser(currentUser);
      setIsAuthenticated(true);
    } else if (!currentUser && user) {
      console.log('User logged out, clearing navbar user');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [currentUser, user]);

  // Optional: Less frequent session validation (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(async () => {
      // Only check if user is authenticated to avoid unnecessary calls
      if (isAuthenticated) {
        try {
          const response = await authService.checkSession();
          const isLoggedIn = response.status === 1 && response.logged_in;
          
          if (!isLoggedIn && user) {
            console.log('Session expired, logging out user');
            setUser(null);
            setIsAuthenticated(false);
            await refreshUserCart();
          }
        } catch (error) {
          console.error('Periodic session check error:', error);
        }
      }
    }, 300000); // Check every 5 minutes instead of 3 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, user, refreshUserCart]);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📞' }
  ];

  return (
    <>
      <motion.nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="nav-container">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="nav-logo" onClick={closeMenu}>
              <motion.img 
                src="/generated-image.png" 
                alt="Makhana Delight" 
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              />
              <span>Makhana Delight</span>
            </Link>
          </motion.div>

          {/* Search Bar */}
          <div className="nav-search">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <div className="search-actions">
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={clearSearch}
                      className="clear-search-btn"
                    >
                      ✕
                    </button>
                  )}
                  <button type="submit" className="search-btn">
                    🔍
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Navigation Menu */}
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <AnimatePresence>
              {navItems.map((item, index) => (
                <motion.li 
                  key={item.path}
                  className="nav-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isMenuOpen ? index * 0.1 : 0 }}
                >
                  <Link 
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.label}</span>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* Navigation Actions */}
          <div className="nav-actions">
            {/* Cart Icon */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/cart" className="cart-icon" onClick={closeMenu}>
                <span className="cart-emoji">🛒</span>
                <AnimatePresence>
                  {getTotalItems() > 0 && (
                    <motion.span 
                      className="cart-count"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      key={getTotalItems()}
                    >
                      {getTotalItems()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            {/* Authentication Section */}
            {loading ? (
              <div className="auth-loading">
                <motion.div 
                  className="loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : isAuthenticated ? (
              <div className="user-dropdown" ref={dropdownRef}>
                <motion.button 
                  className="user-btn" 
                  onClick={toggleUserDropdown}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="user-avatar">
                    <span className="user-icon">👤</span>
                    <span className="user-name">
                      {user?.full_name || user?.username || user?.name || 'User'}
                    </span>
                    <motion.span 
                      className="dropdown-arrow"
                      animate={{ rotate: showUserDropdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▼
                    </motion.span>
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div 
                      className="dropdown-menu"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="dropdown-header">
                        <div className="user-info">
                          <strong>{user?.full_name || user?.username || user?.name}</strong>
                          <small>{user?.email}</small>
                        </div>
                      </div>
                      
                      <div className="dropdown-divider"></div>
                      
                      <Link to="/profile" className="dropdown-item" onClick={closeMenu}>
                        <span className="dropdown-icon">👤</span>
                        <span>My Profile</span>
                      </Link>
                      
                      <Link to="/orders" className="dropdown-item" onClick={closeMenu}>
                        <span className="dropdown-icon">📦</span>
                        <span>My Orders</span>
                      </Link>
                      
                      <div className="dropdown-divider"></div>
                      
                      <motion.button 
                        className="dropdown-item logout-item" 
                        onClick={handleLogout}
                        whileHover={{ backgroundColor: "rgba(231, 76, 60, 0.1)" }}
                      >
                        <span className="dropdown-icon">🚪</span>
                        <span>Logout</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button 
                className="login-btn" 
                onClick={openLoginModal}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="login-icon">🔐</span>
                <span>Login</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Toggle */}
          <motion.button 
            className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </motion.button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="nav-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Navbar;
