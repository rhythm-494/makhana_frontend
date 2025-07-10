import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useFlyToCart } from '../hooks/useFlyToCart';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const itemsPerPage = 12;
  
  const { addToCart } = useCart();
  const flyToCart = useFlyToCart();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const highlightId = searchParams.get('highlight') || '';

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getAllProducts();
      console.log("response: ", response.data);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        case 'newest': return new Date(b.created_at) - new Date(a.created_at);
        case 'popularity': return b.stock_quantity - a.stock_quantity;
        default: return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, sortBy, priceRange]);

  useEffect(() => {
    if (highlightId && filteredProducts.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`ecom-product-${highlightId}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          element.classList.add('ecom-highlighted');
          setTimeout(() => {
            element.classList.remove('ecom-highlighted');
          }, 3000);
        }
      }, 500);
    }
  }, [highlightId, filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSortBy('name');
    setPriceRange({ min: 0, max: 10000 });
    setSearchParams({});
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

const handleAddToCart = async (product, event) => {
  const productCard = event.target.closest('.ecom-product-card');
  const productImage = productCard?.querySelector('.ecom-product-img');
  
  const cartIcon = document.querySelector('.cart-icon .cart-emoji');
  
  // Try to add to cart (this will check if user is logged in)
  const success = await addToCart(product);
  
  if (success) {
    // Only show animation if successfully added
    if (productImage && cartIcon) {
      flyToCart(productImage, cartIcon);
    }
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'ecom-toast ecom-toast-success';
    toast.innerHTML = `
      <div class="ecom-toast-content">
        <div class="ecom-toast-icon">✅</div>
        <div class="ecom-toast-message">
          <div class="ecom-toast-title">Added to Cart!</div>
          <div class="ecom-toast-subtitle">${product.name}</div>
        </div>
        <button class="ecom-toast-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 4000);
  }
  // If not successful, addToCart already showed login alert
};

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getDiscountedPrice = (price,discount) => {
    return price - (price * discount / 100);      
  };

  if (loading) {
    return (
      <div className="ecom-loading-container">
        <div className="ecom-loading-content">
          <div className="ecom-loading-spinner"></div>
          <div className="ecom-loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ecom-error-container">
        <div className="ecom-error-content">
          <div className="ecom-error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchProducts} className="ecom-retry-btn">
            <span>🔄</span> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ecom-page-container">
      <nav className="ecom-breadcrumb">
        <div className="ecom-breadcrumb-content">
          <a href="/" className="ecom-breadcrumb-link">Home</a>
          <span className="ecom-breadcrumb-separator">›</span>
          <a href="/products" className="ecom-breadcrumb-link">Products</a>
          {searchQuery && (
            <>
              <span className="ecom-breadcrumb-separator">›</span>
              <span className="ecom-breadcrumb-current">Search: "{searchQuery}"</span>
            </>
          )}
        </div>
      </nav>

      <header className="ecom-page-header">
        <div className="ecom-header-content">
          <div className="ecom-header-main">
            <h1 className="ecom-page-title">
              {searchQuery ? (
                <>
                  Search Results for <span className="ecom-search-term">"{searchQuery}"</span>
                </>
              ) : (
                'All Products'
              )}
            </h1>
            <p className="ecom-page-subtitle">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <button 
            className="ecom-mobile-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="ecom-filter-icon">⚙️</span>
            Filters
          </button>
        </div>
      </header>

      <div className="ecom-main-content">
        <aside className={`ecom-sidebar ${showFilters ? 'ecom-sidebar-open' : ''}`}>
          <div className="ecom-sidebar-header">
            <h3 className="ecom-filter-title">
              <span className="ecom-filter-icon">🔍</span>
              Filters
            </h3>
            <button 
              className="ecom-close-filters"
              onClick={() => setShowFilters(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="ecom-filter-section">
            {(searchQuery || selectedCategory !== 'all' || priceRange.min > 0 || priceRange.max < 10000) && (
              <button onClick={clearAllFilters} className="ecom-clear-filters">
                <span>🗑️</span>
                Clear All Filters
              </button>
            )}

            <div className="ecom-filter-group">
              <h4 className="ecom-filter-label">
                <span className="ecom-label-icon">📂</span>
                Category
              </h4>
              <div className="ecom-category-list">
                {categories.map(category => (
                  <label key={category} className="ecom-category-item">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="ecom-radio-input"
                    />
                    <span className="ecom-radio-custom"></span>
                    <span className="ecom-category-name">
                      {category === 'all' ? 'All Categories' : category}
                    </span>
                    <span className="ecom-category-count">
                      ({category === 'all' ? products.length : products.filter(p => p.category === category).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="ecom-filter-group">
              <h4 className="ecom-filter-label">
                <span className="ecom-label-icon">💰</span>
                Price Range
              </h4>
              <div className="ecom-price-range">
                <div className="ecom-price-inputs">
                  <div className="ecom-price-input-group">
                    <span className="ecom-currency">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                      className="ecom-price-input"
                    />
                  </div>
                  <span className="ecom-price-separator">to</span>
                  <div className="ecom-price-input-group">
                    <span className="ecom-currency">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                      className="ecom-price-input"
                    />
                  </div>
                </div>
                <div className="ecom-price-suggestions">
                  <button onClick={() => setPriceRange({min: 0, max: 500})} className="ecom-price-tag">Under ₹500</button>
                  <button onClick={() => setPriceRange({min: 500, max: 1000})} className="ecom-price-tag">₹500 - ₹1000</button>
                  <button onClick={() => setPriceRange({min: 1000, max: 2000})} className="ecom-price-tag">₹1000 - ₹2000</button>
                  <button onClick={() => setPriceRange({min: 2000, max: 10000})} className="ecom-price-tag">Above ₹2000</button>
                </div>
              </div>
            </div>

            <div className="ecom-filter-group">
              <h4 className="ecom-filter-label">
                <span className="ecom-label-icon">📦</span>
                Availability
              </h4>
              <div className="ecom-stock-filters">
                <label className="ecom-checkbox-item">
                  <input type="checkbox" className="ecom-checkbox-input" />
                  <span className="ecom-checkbox-custom"></span>
                  <span>In Stock</span>
                  <span className="ecom-stock-count">({products.filter(p => p.stock_quantity > 0).length})</span>
                </label>
                <label className="ecom-checkbox-item">
                  <input type="checkbox" className="ecom-checkbox-input" />
                  <span className="ecom-checkbox-custom"></span>
                  <span>Out of Stock</span>
                  <span className="ecom-stock-count">({products.filter(p => p.stock_quantity === 0).length})</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <main className="ecom-product-area">
          <div className="ecom-toolbar">
            <div className="ecom-toolbar-left">
              <div className="ecom-results-info">
                <span className="ecom-results-count">
                  Showing <strong>{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> results
                </span>
                {searchQuery && (
                  <span className="ecom-search-info">
                    for "<strong>{searchQuery}</strong>"
                  </span>
                )}
              </div>
            </div>
            
            <div className="ecom-toolbar-right">
              <div className="ecom-view-controls">
                <div className="ecom-view-toggle">
                  <button 
                    className={`ecom-view-btn ${viewMode === 'grid' ? 'ecom-active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <span className="ecom-view-icon">⊞</span>
                  </button>
                  <button 
                    className={`ecom-view-btn ${viewMode === 'list' ? 'ecom-active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <span className="ecom-view-icon">☰</span>
                  </button>
                </div>

                <div className="ecom-sort-wrapper">
                  <label className="ecom-sort-label">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="ecom-sort-select"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="popularity">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {currentProducts.length === 0 ? (
            <div className="ecom-no-products">
              <div className="ecom-no-products-illustration">
                <div className="ecom-no-products-icon">🔍</div>
                <div className="ecom-no-products-bg"></div>
              </div>
              <h3>No products found</h3>
              <p>We couldn't find any products matching your criteria.</p>
              <div className="ecom-no-products-actions">
                <button onClick={clearAllFilters} className="ecom-clear-btn">
                  Clear All Filters
                </button>
                <button onClick={() => setSearchParams({})} className="ecom-browse-btn">
                  Browse All Products
                </button>
              </div>
            </div>
          ) : (
            <div className={`ecom-products-grid ecom-${viewMode}`}>
              {currentProducts.map(product => {
                const discountedPrice = getDiscountedPrice(product.price,product.discount_price);
                const discountPercent = Math.round(((product.price - discountedPrice) / product.price) * 100);
                const isWishlisted = wishlist.includes(product.id);
                
                return (
                  <article 
                    key={product.id} 
                    id={`ecom-product-${product.id}`}
                    className="ecom-product-card"
                  >
                    <div className="ecom-product-image">
                      {product.image ? (
                        <img 
                          src={`http://localhost/makhana_backend/${product.image}`}
                          alt={product.name}
                          
                          className="ecom-product-img"
                        />
                      ) : (
                        <div className="ecom-placeholder-image">
                          <span className="ecom-placeholder-icon">📦</span>
                          <span className="ecom-placeholder-text">No Image</span>
                        </div>
                      )}
                      
                      <div className="ecom-product-badges">
                        {product.stock_quantity === 0 && (
                          <span className="ecom-product-badge ecom-out-of-stock">
                            Out of Stock
                          </span>
                        )}
                        {discountPercent > 0 && (
                          <span className="ecom-product-badge ecom-discount">
                            {discountPercent}% OFF
                          </span>
                        )}
                        {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                          <span className="ecom-product-badge ecom-low-stock">
                            Only {product.stock_quantity} left
                          </span>
                        )}
                      </div>
                      
                      <div className="ecom-product-actions">
                        <button 
                          className={`ecom-action-btn ecom-wishlist-btn ${isWishlisted ? 'ecom-wishlisted' : ''}`}
                          onClick={() => toggleWishlist(product.id)}
                          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <span className="ecom-action-icon">{isWishlisted ? '❤️' : '🤍'}</span>
                        </button>
                        <button className="ecom-action-btn ecom-quickview-btn" title="Quick View">
                          <span className="ecom-action-icon">👁️</span>
                        </button>
                        <button className="ecom-action-btn ecom-compare-btn" title="Compare">
                          <span className="ecom-action-icon">⚖️</span>
                        </button>
                      </div>

                      <div className="ecom-image-overlay">
                        <button className="ecom-overlay-btn">Quick View</button>
                      </div>
                    </div>

                    <div className="ecom-product-info">
                      {product.category && (
                        <span className="ecom-product-category">{product.category}</span>
                      )}
                      
                      <h3 className="ecom-product-name" title={product.name}>
                        {product.name}
                      </h3>
                      
                      {product.description && viewMode === 'list' && (
                        <p className="ecom-product-description">{product.description}</p>
                      )}

                      <div className="ecom-product-rating">
                        <div className="ecom-stars">
                          <span className="ecom-stars-filled">★★★★</span>
                          <span className="ecom-stars-empty">☆</span>
                        </div>
                        <span className="ecom-rating-count">(24 reviews)</span>
                      </div>

                      <div className="ecom-product-pricing">
                        <div className="ecom-price-main">
                          <span className="ecom-current-price">{formatPrice(discountedPrice)}</span>
                          {discountPercent > 0 && (
                            <span className="ecom-original-price">{formatPrice(product.price)}</span>
                          )}
                        </div>
                        {discountPercent > 0 && (
                          <div className="ecom-savings">
                            You save {formatPrice(product.price - discountedPrice)} ({discountPercent}%)
                          </div>
                        )}
                      </div>

                      <div className="ecom-product-stock">
                        {product.stock_quantity > 0 ? (
                          <div className="ecom-stock-info ecom-in-stock">
                            <span className="ecom-stock-icon">✅</span>
                            <span className="ecom-stock-text">
                              {product.stock_quantity > 10 ? 'In Stock' : `Only ${product.stock_quantity} left`}
                            </span>
                          </div>
                        ) : (
                          <div className="ecom-stock-info ecom-out-of-stock">
                            <span className="ecom-stock-icon">❌</span>
                            <span className="ecom-stock-text">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      <div className="ecom-product-cta">
                        <button 
                          className={`ecom-add-to-cart ${product.stock_quantity === 0 ? 'ecom-disabled' : ''}`}
                          disabled={product.stock_quantity === 0}
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          <span className="ecom-cart-icon">🛒</span>
                          <span className="ecom-cart-text">
                            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </span>
                        </button>
                        
                        {viewMode === 'list' && (
                          <button className="ecom-buy-now">
                            <span className="ecom-buy-icon">⚡</span>
                            Buy Now
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="ecom-pagination" aria-label="Product pagination">
              <button 
                className="ecom-page-btn ecom-page-prev"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                aria-label="Previous page"
              >
                <span className="ecom-page-icon">‹</span>
                <span className="ecom-page-text">Previous</span>
              </button>
              
              <div className="ecom-page-numbers">
                {[...Array(Math.min(totalPages, 7))].map((_, index) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = index + 1;
                  } else if (currentPage <= 4) {
                    pageNum = index + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + index;
                  } else {
                    pageNum = currentPage - 3 + index;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`ecom-page-btn ecom-page-number ${currentPage === pageNum ? 'ecom-active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-label={`Go to page ${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                className="ecom-page-btn ecom-page-next"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                aria-label="Next page"
              >
                <span className="ecom-page-text">Next</span>
                <span className="ecom-page-icon">›</span>
              </button>
            </nav>
          )}
        </main>
      </div>

      {showFilters && <div className="ecom-overlay" onClick={() => setShowFilters(false)}></div>}
    </div>
  );
};

export default ProductList;
