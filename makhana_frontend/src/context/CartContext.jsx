import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchingCart, setFetchingCart] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const loadCartFromStorage = (userId) => {
        if (!userId) return [];
        try {
            const stored = localStorage.getItem(`cart_${userId}`);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    };

    const saveCartToStorage = (userId, cartItems) => {
        if (!userId) return;
        try {
            const cartData = cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity
            }));
            localStorage.setItem(`cart_${userId}`, JSON.stringify(cartData));
        } catch (error) {}
    };

 // Update the fetchProductDetails function
const fetchProductDetails = async (productIds) => {
    if (!productIds || productIds.length === 0) return [];

    try {
        const response = await fetch('https://makhana-nodebackend.onrender.com/api/products/find', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productIds })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Error fetching product details:', error);
        return [];
    }
};


    const loadUserCart = async (userId) => {
        if (!userId) {
            setCartItems([]);
            return;
        }

        setFetchingCart(true);
        try {
            const storedCartData = loadCartFromStorage(userId);
            if (storedCartData.length === 0) {
                setCartItems([]);
                setFetchingCart(false);
                return;
            }

            const productIds = storedCartData.map(item => item.id);
            const products = await fetchProductDetails(productIds);

            const cartWithDetails = storedCartData.map(cartItem => {
                const productDetails = products.find(p => p.id == cartItem.id);
                if (productDetails) {
                    return {
                        ...productDetails,
                        quantity: cartItem.quantity,
                        userId: userId
                    };
                }
                return null;
            }).filter(Boolean);

            setCartItems(cartWithDetails);
        } catch (error) {
            console.error('Error loading user cart:', error);
            setCartItems([]);
        } finally {
            setFetchingCart(false);
        }
    };

    useEffect(() => {
        const initializeCart = async () => {
            try {
                const response = await authService.checkSession();
                if (response.status === 1 && response.logged_in && response.user) {
                    setCurrentUser(response.user);
                    const storedCart = loadCartFromStorage(response.user.id);
                    setCartItems(storedCart);
                    
                    if (storedCart.length > 0) {
                        const productIds = storedCart.map(item => item.id);
                        const products = await fetchProductDetails(productIds);
                        
                        const cartWithDetails = storedCart.map(cartItem => {
                            const productDetails = products.find(p => p.id == cartItem.id);
                            if (productDetails) {
                                return {
                                    ...productDetails,
                                    quantity: cartItem.quantity,
                                    userId: response.user.id
                                };
                            }
                            return cartItem;
                        });
                        
                        setCartItems(cartWithDetails);
                    }
                } else {
                    if (currentUser) {
                        localStorage.removeItem(`cart_${currentUser.id}`);
                    }
                    setCurrentUser(null);
                    setCartItems([]);
                }
            } catch (error) {
                console.error('Error initializing cart:', error);
                if (currentUser) {
                    localStorage.removeItem(`cart_${currentUser.id}`);
                }
                setCurrentUser(null);
                setCartItems([]);
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };

        initializeCart();
    }, []);

    useEffect(() => {
        if (!isInitialized || isClearing) return;

        const checkUserChange = async () => {
            try {
                const response = await authService.checkSession();
                if (response.status === 1 && response.logged_in && response.user) {
                    const newUserId = response.user.id;
                    if (!currentUser || currentUser.id !== newUserId) {
                        if (currentUser && cartItems.length > 0) {
                            saveCartToStorage(currentUser.id, cartItems);
                            localStorage.removeItem(`cart_${currentUser.id}`);
                        }
                        setCurrentUser(response.user);
                        await loadUserCart(newUserId);
                    }
                } else {
                    if (currentUser) {
                        if (cartItems.length > 0) {
                            saveCartToStorage(currentUser.id, cartItems);
                            localStorage.removeItem(`cart_${currentUser.id}`);
                        }
                        setIsClearing(true);
                        setCurrentUser(null);
                        setCartItems([]);
                        setTimeout(() => setIsClearing(false), 100);
                    }
                }
            } catch (error) {
                console.error('Error checking user change:', error);
            }
        };

        const handleFocus = () => checkUserChange();
        const handleVisibilityChange = () => {
            if (!document.hidden) checkUserChange();
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [currentUser, isInitialized, isClearing]);

    useEffect(() => {
        if (currentUser && !loading && !fetchingCart && isInitialized && cartItems.length >= 0) {
            saveCartToStorage(currentUser.id, cartItems);
        }
    }, [cartItems, currentUser, loading, fetchingCart, isInitialized]);

    const addToCart = async (product) => {
        try {
            const sessionData = await authService.checkSession();
            if (sessionData.status !== 1 || !sessionData.logged_in || !sessionData.user) {
                alert('Please login to add items to cart');
                return false;
            }

            const newUserId = sessionData.user.id;
            if (!currentUser || currentUser.id !== newUserId) {
                if (currentUser && cartItems.length > 0) {
                    saveCartToStorage(currentUser.id, cartItems);
                    localStorage.removeItem(`cart_${currentUser.id}`);
                }
                setCurrentUser(sessionData.user);
                await loadUserCart(newUserId);
                
                setTimeout(() => {
                    setCartItems(prev => {
                        const existing = prev.find(item => item.id == product.id);
                        if (existing) {
                            return prev.map(item =>
                                item.id == product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            );
                        }
                        return [...prev, { ...product, quantity: 1, userId: newUserId }];
                    });
                }, 100);
            } else {
                setCartItems(prev => {
                    const existing = prev.find(item => item.id == product.id);
                    if (existing) {
                        return prev.map(item =>
                            item.id == product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        );
                    }
                    return [...prev, { ...product, quantity: 1, userId: newUserId }];
                });
            }

            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        }
    };

    const removeFromCart = (productId) => {
        if (!currentUser) return;
        setCartItems(prev => prev.filter(item => item.id != productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (!currentUser) return;
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.id == productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        if (!currentUser) return;
        setCartItems([]);
        localStorage.removeItem(`cart_${currentUser.id}`);
    };

    const refreshCartFromAPI = async () => {
        if (!currentUser) return;
        await loadUserCart(currentUser.id);
    };

    const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);

    const getTotalPrice = () => cartItems.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        return total + (price * item.quantity);
    }, 0);

    const getSubtotal = () => getTotalPrice();
    const getTaxAmount = () => getTotalPrice() * 0.18;
    const getShippingCost = () => getTotalPrice() > 500 ? 0 : 50;
    const getFinalTotal = () => getTotalPrice() + getTaxAmount() + getShippingCost();

    const refreshUserCart = async () => {
        try {
            const response = await authService.checkSession();
            if (response.status === 1 && response.logged_in) {
                const userId = response.user.id;
                if (!currentUser || currentUser.id !== userId) {
                    if (currentUser && cartItems.length > 0) {
                        saveCartToStorage(currentUser.id, cartItems);
                        localStorage.removeItem(`cart_${currentUser.id}`);
                    }
                    setCurrentUser(response.user);
                    await loadUserCart(userId);
                } else {
                    await loadUserCart(userId);
                }
            } else {
                if (currentUser && cartItems.length > 0) {
                    saveCartToStorage(currentUser.id, cartItems);
                    localStorage.removeItem(`cart_${currentUser.id}`);
                }
                setCurrentUser(null);
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error refreshing user cart:', error);
        }
    };

    const isInCart = (productId) => {
        return cartItems.some(item => item.id == productId);
    };

    const getItemQuantity = (productId) => {
        const item = cartItems.find(item => item.id == productId);
        return item ? item.quantity : 0;
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice,
            getSubtotal,
            getTaxAmount,
            getShippingCost,
            getFinalTotal,
            loading,
            currentUser,
            refreshCartFromAPI,
            refreshUserCart,
            isInCart,
            getItemQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
};
