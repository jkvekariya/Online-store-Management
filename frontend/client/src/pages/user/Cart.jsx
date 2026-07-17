import React, { useState, useEffect } from 'react';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { FiX, FiCheck, FiChevronRight, FiRotateCcw, FiBookmark } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../css/cart.css';
import { toast } from 'react-toastify'; // Assuming toast comes from react-toastify

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartQuantity, updateCartItem, getCartTotal, addToWishlist } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [itemToMove, setItemToMove] = useState(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePlaceOrder = () => {
    if (!agreed) return;

    // Check login
    const user = localStorage.getItem('osm_user');
    if (!user) {
      toast.info("Please login to place order");
      navigate('/auth/login');
      return;
    }

    navigate('/pages/user/checkout');
  };

  const deliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateTotalMRP = () => {
    return cartItems.reduce((acc, item) => acc + (item.comparePrice > 0 ? item.comparePrice : item.price) * item.quantity, 0);
  };

  const handleRemoveClick = (item) => {
    setItemToMove(item);
    setShowRemovePopup(true);
  };

  const confirmRemove = () => {
    removeFromCart(itemToMove._id, itemToMove.selectedSize);
    setShowRemovePopup(false);
    setItemToMove(null);
  };

  const moveToWishlistAndRemove = () => {
    addToWishlist(itemToMove);
    removeFromCart(itemToMove._id, itemToMove.selectedSize);
    setShowRemovePopup(false);
    setItemToMove(null);
  };

  if (cartItems.length === 0) {
    return (
      <div className={`cart-empty-container ${isLoaded ? 'fade-in' : ''}`}>
        <HiOutlineShoppingCart size={80} className="cart-empty-icon" />
        <h2 className="cart-empty-title">Your Cart is Empty</h2>
        <p className="cart-empty-message">Looks like you haven't added any items to the cart yet.</p>
        <Link to="/pages/user/products" className="return-shop-btn">
          Return to Shop
        </Link>
      </div>
    );
  }

  const totalMRP = calculateTotalMRP();
  const subTotal = getCartTotal();
  const discountOnMRP = totalMRP - subTotal;

  const availableSizes = (item) => item.sizes && item.sizes.length > 0 ? item.sizes : ['30', '32', '34', '36', '38', '40'];
  const qtyOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className={`cart-page-wrapper ${isLoaded ? 'fade-in' : ''}`}>
      {/* CHECKOUT PROGRESS HEADER */}
      <div className="checkout-progress-container">
        <div className="progress-steps">
          <span className="step active">BAG</span>
          <span className="step-divider">----------</span>
          <span className="step">ADDRESS</span>
          <span className="step-divider">----------</span>
          <span className="step">PAYMENT</span>
        </div>
      </div>

      <div className="cart-main-layout">
        {/* LEFT COLUMN: ITEMS */}
        <div className="cart-left-section">
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div key={`${item._id}-${item.selectedSize}`} className="cart-item-card">
                <div className="card-image-box">
                  <img src={item.image || "/photos/placeholder.jpg"} alt={item.title} />
                </div>
                <div className="card-info-box">
                  <div className="card-header-row">
                    <div className="brand-name">{item.vendor || 'DENIM LOOK'}</div>
                    <button className="remove-cross-btn" onClick={() => handleRemoveClick(item)}>
                      <FiX />
                    </button>
                  </div>
                  <h4 className="product-title-full">{item.description || item.title}</h4>

                  <div className="selectors-row">
                    <div className="selector-item-custom">
                      <span>Size:</span>
                      <select
                        value={item.selectedSize || availableSizes(item)[0]}
                        onChange={(e) => updateCartItem(item._id, item.selectedSize, { selectedSize: e.target.value })}
                      >
                        {availableSizes(item).map(sz => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                    </div>
                    <div className="selector-item-custom">
                      <span>Qty:</span>
                      <select
                        value={item.quantity}
                        onChange={(e) => updateCartQuantity(item._id, item.selectedSize, parseInt(e.target.value))}
                      >
                        {qtyOptions.map(q => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pricing-row-cart">
                    <span className="final-price">₹{item.price * item.quantity}</span>
                    {item.comparePrice > item.price && (
                      <>
                        <span className="original-price">₹{item.comparePrice * item.quantity}</span>
                        <span className="savings-msg">₹{(item.comparePrice - item.price) * item.quantity} OFF</span>
                      </>
                    )}
                  </div>

                  <div className="policy-row">
                    <FiRotateCcw className="policy-icon" /> <span><b>7 days</b> return available</span>
                  </div>
                  <div className="delivery-row">
                    <FiCheck className="delivery-icon" /> <span>Delivery by <b>{deliveryDate()}</b></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/pages/user/wishlist" className="add-more-wishlist-btn">
            <div className="wishlist-btn-left">
              <FiBookmark className="bookmark-icon" />
              <span>Add More From Wishlist</span>
            </div>
            <FiChevronRight className="arrow-right" />
          </Link>
        </div>

        {/* RIGHT COLUMN: PRICE DETAILS */}
        <div className="cart-right-section">
          <div className="price-details-card">
            <h4 className="section-title-small">PRICE DETAILS ({cartItems.length} Items)</h4>
            <div className="price-rows">
              <div className="price-detail-row">
                <span>Total MRP</span>
                <span>₹{totalMRP}</span>
              </div>
              <div className="price-detail-row">
                <span>Discount on MRP</span>
                <span className="discount-value">-₹{discountOnMRP}</span>
              </div>
              <div className="price-detail-row">
                <span>Platform Fee</span>
                <span className="discount-value">FREE</span>
              </div>
              <div className="price-detail-row">
                <span>Shipping Fee</span>
                <span className="discount-value">FREE</span>
              </div>
              <hr className="price-divider" />
              <div className="price-detail-row total-amount-row">
                <span>Total Amount</span>
                <span>₹{subTotal}</span>
              </div>
            </div>

            {/* TERMS AND CONDITIONS */}
            <div className="cart-terms-box">
              <label className="terms-checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />
                <span>I agree to the <Link to="/pages/user/terms-conditions">Terms and Conditions</Link> & <Link to="/pages/user/privacy-policy">Privacy Policy</Link></span>
              </label>
            </div>

            <button
              className="place-order-btn"
              disabled={!agreed}
              style={{ opacity: agreed ? 1 : 0.6, cursor: agreed ? 'pointer' : 'not-allowed' }}
              onClick={handlePlaceOrder}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>

      {/* REMOVAL POPUP */}
      {showRemovePopup && (
        <div className="remove-popup-overlay">
          <div className="remove-popup-content">
            <button className="close-popup-btn" onClick={() => setShowRemovePopup(false)}><FiX /></button>
            <div className="popup-top">
              <img src={itemToMove?.image || "/photos/placeholder.jpg"} alt="item" className="popup-thumb" />
              <div className="popup-text">
                <h4>Move from Bag</h4>
                <p>Are you sure you want to move this item from bag?</p>
              </div>
            </div>
            <div className="popup-actions">
              <button className="popup-btn remove" onClick={confirmRemove}>REMOVE</button>
              <button className="popup-btn move" onClick={moveToWishlistAndRemove}>MOVE TO WISHLIST</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
