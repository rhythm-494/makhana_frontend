import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { orderService } from "../services/orderService";
import { FiEdit, FiLogOut, FiShoppingBag, FiMail, FiPhone, FiMapPin, FiUser, FiCalendar, FiStar } from "react-icons/fi";
import { format } from "date-fns";
import EditProfileModal from "./EditProfileModal";
import "./ProfileSection.css";

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [noOrdersMessage, setNoOrdersMessage] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
  async function fetchUser() {
    try {
      const res = await authService.checkSession();
      if (res.status === 1 && res.logged_in && res.user) {
        const response = await authService.seeProfileData(res.user.id); 
        if (response.status === 1) {
          console.log("profile Data seeing: ", response.result);
          setUser(response.result); 
        } else {
          setUser(res.user); 
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }
  fetchUser();
}, [navigate]);

  useEffect(() => {
    async function fetchOrders() {
      if (user && user.id) {
        setOrdersLoading(true);
        setOrdersError(null);
        setNoOrdersMessage("");
        try {
          const res = await orderService.getUserOrders(user.id);
          console.log("Orders response:", res);
          
          if (res.status === 1) {
            if (Array.isArray(res.orders) && res.orders.length > 0) {
              // Has orders - sort them by date
              setOrders(
                res.orders.sort(
                  (a, b) => new Date(b.order_date) - new Date(a.order_date)
                )
              );
            } else {
              // No orders found - use the message from API or default
              setOrders([]);
              setNoOrdersMessage(res.message || "No orders found. Start shopping to see your orders here!");
            }
          } else {
            // API returned error status
            setOrders([]);
            setOrdersError("fPlz continue with shopping");
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
          setOrders([]);
          setOrdersError("Plz continue with shopping");
        } finally {
          setOrdersLoading(false);
        }
      }
    }
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await authService.logout();
      navigate("/login");
    }
  };

  const handleProfileSave = async (form) => {
    try {
      const res = await authService.updateProfile(form);
      if (res.status === 1 && res.user) {
        setUser(res.user);
        return true;
      } else {
        throw new Error(res.message || "Update failed");
      }
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) return null;

  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.order_status.toLowerCase() === 'completed').length;

  return (
    <div className="profile-container">
      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={handleProfileSave}
        />
      )}
      
      {/* Hero Section */}
      <section className="profile-hero">
        <div className="profile-hero-bg"></div>
        <div className="profile-hero-content">
          <div className="profile-avatar-section">
            <div className="avatar-circle">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" />
              ) : (
                <span>{(user.full_name || user.username).charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="profile-badge">
              <FiStar /> Premium Member
            </div>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">
              {user.full_name || user.username}
            </h1>
            <p className="profile-username">@{user.username}</p>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{totalOrders}</span>
                <span className="stat-label">Total Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{completedOrders}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {user.created_at ? format(new Date(user.created_at), "yyyy") : "2024"}
                </span>
                <span className="stat-label">Member Since</span>
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="profile-btn profile-edit-btn"
                onClick={() => setShowEdit(true)}
              >
                <FiEdit /> Edit Profile
              </button>
              <button
                className="profile-btn profile-logout-btn"
                onClick={handleLogout}
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details Card */}
      <section className="profile-details-card">
        <h3>Contact Information</h3>
        <div className="details-grid">
          <div className="detail-item">
            <FiMail className="detail-icon" />
            <div>
              <span className="detail-label">Email</span>
              <span className="detail-value">{user.email}</span>
            </div>
          </div>
          
          {user.phone && (
            <div className="detail-item">
              <FiPhone className="detail-icon" />
              <div>
                <span className="detail-label">Phone</span>
                <span className="detail-value">{user.phone}</span>
              </div>
            </div>
          )}
          
          {user.address && (
            <div className="detail-item">
              <FiMapPin className="detail-icon" />
              <div>
                <span className="detail-label">Address</span>
                <span className="detail-value">{user.address}</span>
              </div>
            </div>
          )}
          
          <div className="detail-item">
            <FiCalendar className="detail-icon" />
            <div>
              <span className="detail-label">Joined</span>
              <span className="detail-value">
                {user.created_at ? format(new Date(user.created_at), "PPP") : "-"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Orders Section */}
      <section className="profile-orders">
        <div className="orders-header">
          <h3>
            <FiShoppingBag /> Order History
          </h3>
          <button
            className="profile-btn profile-shop-btn"
            onClick={() => navigate("/products")}
          >
            <FiShoppingBag /> Continue Shopping
          </button>
        </div>
        
        {ordersLoading ? (
          <div className="profile-orders-loading">
            <div className="profile-spinner"></div>
            <div>Loading your orders...</div>
          </div>
        ) : ordersError ? (
          <div className="profile-orders-error">
            <p>{ordersError}</p>
            {/* <button className="retry-btn" onClick={() => window.location.reload()}>
              Try Again
            </button> */}
          </div>
        ) : orders.length === 0 ? (
          <div className="profile-orders-empty">
            <FiShoppingBag className="empty-icon" />
            <h4>No orders yet</h4>
            <p>{noOrdersMessage || "Start shopping to see your orders here!"}</p>
            <button
              className="profile-btn profile-shop-btn"
              onClick={() => navigate("/products")}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="profile-orders-list">
            {orders.map((order) => (
              <div className="profile-order-card" key={order.order_id}>
                <div className="order-card-header">
                  <div className="order-info">
                    <h4>Order #{order.order_id}</h4>
                    <span className="order-date">
                      {order.order_date ? format(new Date(order.order_date), "PPP") : ""}
                    </span>
                  </div>
                  <span className={`order-status-badge status-${order.order_status.toLowerCase()}`}>
                    {order.order_status}
                  </span>
                </div>
                
                <div className="order-items">
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    <ul>
                      {order.items.slice(0, 3).map((item, idx) => (
                        <li key={idx}>
                          <span className="item-name">{item.name}</span>
                          <span className="item-details">
                            {item.quantity}x ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                      {order.items.length > 3 && (
                        <li className="more-items">
                          +{order.items.length - 3} more items
                        </li>
                      )}
                    </ul>
                  ) : (
                    <span className="no-items">No items found</span>
                  )}
                </div>
                
                <div className="order-footer">
                  <span className="order-total">
                    Total: ₹{order.total_amount.toFixed(2)}
                  </span>
                  <button className="view-order-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfileSection;
