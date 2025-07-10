import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import { useCart } from '../context/CartContext';
import {authService} from '../services/authService';
// authService
const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const validateAddress = () => {
    const required = ['fullName', 'address', 'city', 'state', 'pincode', 'phone'];
    return required.every(field => shippingAddress[field].trim() !== '');
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
// Update these functions in your Cart.jsx file

const createRazorpayOrder = async (amount) => {
    try {
        const response = await fetch('https://makhana-nodebackend.onrender.com/api/payments/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount * 100,
                currency: 'INR'
            })
        });

        const data = await response.json();
        console.log("Response data: ", data);
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to create order');
        }
        return data;
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw error;
    }
};

const verifyPayment = async (paymentData) => {
    try {
        const response = await fetch('https://makhana-nodebackend.onrender.com/api/payments/verify', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
};

const createOrder = async (orderData) => {
    try {
        const response = await fetch('https://makhana-nodebackend.onrender.com/api/orders', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

const checkSession = async () => {
    try {
        const response = await fetch('https://makhana-nodebackend.onrender.com/api/auth/check_session', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Session check error:', error);
        return { status: 0, logged_in: false };
    }
};


  const handlePayment = async () => {
    if (!validateAddress()) {
      alert('Please fill in all shipping address fields');
      return;
    }

    setIsProcessing(true);

    try {
      // const sessionData = await checkSession();
      const sessionData = await authService.checkSession();
      
      if (!sessionData.user) {
        alert('Please login to continue');
        navigate('/login');
        return;
      }

      const user = sessionData.user;

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert('Razorpay SDK failed to load');
        return;
      }

      const totalAmount = getTotalPrice();
      const paymentOrder = await createRazorpayOrder(totalAmount);

      if (!paymentOrder.success) {
        throw new Error('Failed to create payment order');
      }

      const options = {
        key: paymentOrder.key_id || 'rzp_test_your_key_id_here',
        amount: paymentOrder.order.amount,
        currency: paymentOrder.order.currency,
        name: 'Makhana Delight',
        description: 'Order Payment',
        order_id: paymentOrder.order.id,
        handler: async function (response) {
          try {
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationResult.success) {
              const orderData = {
                user_id: user.id,
                total_amount: totalAmount,
                shipping_address: JSON.stringify(shippingAddress),
                items: cartItems.map(item => ({
                  product_id: item.id,
                  quantity: item.quantity,
                  price: item.price
                }))
              };

              const orderResult = await createOrder(orderData);

              if (orderResult.status === 1) {
                clearCart();
                showSuccessMessage();
                navigate('/order-success', { 
                  state: { 
                    orderId: orderResult.order_id,
                    paymentId: response.razorpay_payment_id 
                  } 
                });
              } else {
                throw new Error('Failed to create order');
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment processing error:', error);
            alert('Payment processing failed. Please try again.');
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: user.email,
          contact: shippingAddress.phone
        },
        notes: {
          address: shippingAddress.address
        },
        theme: {
          color: '#e67e22'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const showSuccessMessage = () => {
    const toast = document.createElement('div');
    toast.className = 'payment-success-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">✅</div>
        <div class="toast-message">
          <div class="toast-title">Payment Successful!</div>
          <div class="toast-subtitle">Your order has been placed</div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart-page">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="empty-cart-content"
            >
              <motion.span 
                className="empty-cart-icon"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🛒
              </motion.span>
              <h2>Your Cart is Empty</h2>
              <p>Discover amazing products and start shopping!</p>
              <Link to="/products" className="continue-shopping-btn">
                <span>🛍️</span>
                Start Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>Shopping Cart</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cart-header"
        >
          <h1>
            <span className="cart-icon">🛒</span>
            Shopping Cart
            <span className="item-count">({getTotalItems()} items)</span>
          </h1>
        </motion.div>

        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="items-header">
              <h3>Your Items</h3>
              <button 
                className="clear-all-btn"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all items?')) {
                    cartItems.forEach(item => removeFromCart(item.id));
                  }
                }}
              >
                Clear All
              </button>
            </div>

            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="cart-item-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1
                  }}
                  layout
                  whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                >
                  <div className="item-image">
                    <img 
                      src={`http://localhost/makhana_backend/uploads/${item.image}`} 
                      alt={item.name}
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <span className="view-icon">👁️</span>
                    </div>
                  </div>
                  
                  <div className="item-details">
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="item-description">
                        {item.description || "Premium quality makhana"}
                      </p>
                      <div className="price-section">
                        <span className="current-price">{formatPrice(item.price)}</span>
                        <span className="per-unit">per unit</span>
                      </div>
                    </div>

                    <div className="item-controls">
                      <div className="quantity-section">
                        <label>Quantity</label>
                        <div className="quantity-controls">
                          <motion.button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="quantity-btn decrease"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </motion.button>
                          <span className="quantity">{item.quantity}</span>
                          <motion.button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="quantity-btn increase"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            +
                          </motion.button>
                        </div>
                      </div>

                      <div className="item-total">
                        <span className="total-label">Total</span>
                        <span className="total-price">{formatPrice(item.price * item.quantity)}</span>
                      </div>

                      <motion.button 
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item.id)}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span>🗑️</span>
                        Remove
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="cart-summary">
            <motion.div 
              className="summary-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="summary-header">
                <h3>Order Summary</h3>
                <span className="summary-icon">📋</span>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">
                    <s>₹50</s> FREE
                  </span>
                </div>
                
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span className="discount-amount">−₹0</span>
                </div>

                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>

                <div className="savings-info">
                  <span>💰 You saved ₹50 on shipping!</span>
                </div>
              </div>

              {!showCheckoutForm ? (
                <div className="summary-actions">
                  <motion.button 
                    className="checkout-btn"
                    onClick={() => setShowCheckoutForm(true)}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 8px 25px rgba(230, 126, 34, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>🔒</span>
                    Proceed to Checkout
                  </motion.button>
                  
                  <Link to="/products" className="continue-shopping-link">
                    <span>←</span>
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="checkout-form">
                  <h4>Shipping Address</h4>
                  <div className="address-form">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                      required
                    />
                    <textarea
                      name="address"
                      placeholder="Address"
                      value={shippingAddress.address}
                      onChange={handleAddressChange}
                      required
                    />
                    <div className="form-row">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        required
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={shippingAddress.pincode}
                        onChange={handleAddressChange}
                        required
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={shippingAddress.phone}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="checkout-actions">
                    <button 
                      className="pay-now-btn"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span>💳</span>
                          Pay {formatPrice(getTotalPrice())}
                        </>
                      )}
                    </button>
                    
                    <button 
                      className="back-btn"
                      onClick={() => setShowCheckoutForm(false)}
                    >
                      ← Back to Cart
                    </button>
                  </div>
                </div>
              )}

              <div className="security-badges">
                <div className="badge">
                  <span>🔒</span>
                  <small>Secure Payment</small>
                </div>
                <div className="badge">
                  <span>🚚</span>
                  <small>Free Delivery</small>
                </div>
                <div className="badge">
                  <span>↩️</span>
                  <small>Easy Returns</small>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
