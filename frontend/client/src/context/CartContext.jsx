import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('osm_cart');
    const savedWishlist = localStorage.getItem('osm_wishlist');

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('osm_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('osm_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product, quantity = 1, selectedSize = null) => {
    // If no size is selected but sizes are available, we might want to default or warn, 
    // but for now we'll just use the provided size or product's first size if available.
    const sizeToUse = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);

    const existingItem = cartItems.find(item => item._id === product._id && item.selectedSize === sizeToUse);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item._id === product._id && item.selectedSize === sizeToUse
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
      toast.success('Quantity updated in cart');
    } else {
      setCartItems([...cartItems, { ...product, quantity, selectedSize: sizeToUse }]);
      toast.success('Added to cart successfully');
    }
  };

  const removeFromCart = (productId, selectedSize) => {
    setCartItems(cartItems.filter(item => !(item._id === productId && item.selectedSize === selectedSize)));
    toast.success('Removed from cart');
  };

  const updateCartQuantity = (productId, selectedSize, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCartItems(cartItems.map(item =>
      (item._id === productId && item.selectedSize === selectedSize) ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const addToWishlist = (product) => {
    const existingItem = wishlistItems.find(item => item._id === product._id);

    if (existingItem) {
      toast.info('Already in wishlist');
      return;
    }

    setWishlistItems([...wishlistItems, product]);
    toast.success('Added to wishlist');
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(wishlistItems.filter(item => item._id !== productId));
    toast.success('Removed from wishlist');
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

  const isInCart = (productId) => cartItems.some(item => item._id === productId);
  const isInWishlist = (productId) => wishlistItems.some(item => item._id === productId);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const updateCartItem = (productId, currentSize, updates) => {
    setCartItems(cartItems.map(item =>
      (item._id === productId && item.selectedSize === currentSize) ? { ...item, ...updates } : item
    ));
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      wishlistItems,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      updateCartItem,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      moveToCart,
      isInCart,
      isInWishlist,
      getCartTotal,
      getCartCount,
      getWishlistCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
