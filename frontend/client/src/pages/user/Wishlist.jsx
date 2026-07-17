import React from 'react';
import PagebodyHeader from '../../components/PagebodyHeader';
import { FiX, FiLayers, FiEye, FiShoppingCart } from 'react-icons/fi';
import { LuHeart } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import '../../css/wishlist.css';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist, moveToCart } = useCart();
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Mock data for design visualization if context is empty (Uncomment to view design without data)
    /*
    const wishlistItems = [
       { id: 1, name: "Retro Oval Sunglasses For Women", price: 90.00, image: "/photos/product-1.jpg" },
       { id: 2, name: "Oversized Denim Jacket", price: 120.00, image: "/photos/product-2.jpg" },
    ];
    */

    return (
        <>
            <PagebodyHeader title="My Wishlist" />
            <div className={`wishlist-container ${isLoaded ? 'fade-in' : ''}`}>
                {wishlistItems.length === 0 ? (
                    <div className="wishlist-empty-container">
                        <LuHeart size={80} className="wishlist-empty-icon" />
                        <h2 className="wishlist-empty-title">Your Wishlist is Empty</h2>
                        <p className="wishlist-empty-message">Looks like you haven't added any items to the wishlist yet.</p>
                        <Link to="/pages/user/products" className="start-shopping-btn">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlistItems.map((item) => (
                            <div key={item._id} className="wishlist-card">
                                <div className="wishlist-image-container">
                                    <Link to={`/pages/user/product/${item._id}`}>
                                        <img src={item.image || "/photos/placeholder.jpg"} alt={item.title} className="wishlist-image" />
                                    </Link>
                                    <button className="remove-item-btn" onClick={() => removeFromWishlist(item._id)} title="Remove">
                                        <FiX />
                                    </button>
                                </div>
                                <div className="wishlist-details">
                                    <Link to={`/pages/user/product/${item._id}`}>
                                        <h3 className="wishlist-product-name">{item.title}</h3>
                                    </Link>
                                    <div className="wishlist-price-row">
                                        <span className="wishlist-current-price">₹{item.price}</span>
                                        {item.comparePrice > item.price && (
                                            <>
                                                <span className="wishlist-old-price">₹{item.comparePrice}</span>
                                                <span className="wishlist-discount">
                                                    ({Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)}% OFF)
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button className="move-to-bag-btn" onClick={() => moveToCart(item)}>
                                    MOVE TO BAG
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Wishlist;
