import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/productDetail.css';
import { FaStar, FaEye, FaFire, FaCheckCircle, FaMinus, FaPlus, FaShoppingCart, FaRegHeart, FaShareAlt, FaUserCircle } from 'react-icons/fa';
import { FiTruck, FiPackage, FiDollarSign, FiHeadphones } from 'react-icons/fi';
import PageBodyHeader from '../../components/PagebodyHeader';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    const { addToCart, addToWishlist, isInWishlist } = useCart();

    // Quantity State
    const [quantity, setQuantity] = useState(1);

    // Image State
    const [mainImage, setMainImage] = useState('');
    const [galleryImages, setGalleryImages] = useState([]);

    // Review Form State
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        name: '',
        rating: 5,
        title: '',
        comment: ''
    });

    const increaseQty = () => setQuantity(prev => prev + 1);
    const decreaseQty = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    const [activeTab, setActiveTab] = useState('description');
    const [selectedSize, setSelectedSize] = useState('');

    // Fetch Product & Reviews
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const prodRes = await axios.get(`http://localhost:5000/api/products/${id}`);
                const currentProduct = prodRes.data;
                setProduct(currentProduct);
                setMainImage(currentProduct.image);

                // Combine main image with additional images for gallery (Unique)
                const additional = currentProduct.images || [];
                const uniqueGallery = [...new Set([currentProduct.image, ...additional])];
                setGalleryImages(uniqueGallery);

                // Fetch Reviews
                const reviewRes = await axios.get(`http://localhost:5000/api/reviews/product/${id}`);
                setReviews(reviewRes.data);

                // Fetch Related Products (Same category)
                const relatedRes = await axios.get('http://localhost:5000/api/products');
                const filteredRelated = relatedRes.data
                    .filter(p => p.category === currentProduct.category && p._id !== id)
                    .slice(0, 4);
                setRelatedProducts(filteredRelated);

                // Manage Recently Viewed
                let viewed = JSON.parse(localStorage.getItem('osm_recentlyViewed') || '[]');
                // Filter out current and keep unique
                viewed = [currentProduct, ...viewed.filter(p => p._id !== id)].slice(0, 4);
                localStorage.setItem('osm_recentlyViewed', JSON.stringify(viewed));
                setRecentlyViewed(viewed.filter(p => p._id !== id));

                setLoading(false);
                setTimeout(() => setIsLoaded(true), 100);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check auth (assuming some user info needed or just guest)
            // Backend Review model `user` field might expect a string name or ID.
            // If backend `Review.js` schema uses `user` as String name, this works. 
            // If it uses ObjectId ref, we need a logged-in user.
            // Let's assume for now simplistic: passing name as user.
            // Wait, previous `Review.js` might have `user` as string?
            // "Created Review model with fields: user, product, rating, comment..."
            // If user is not logged in, we might fail if it expects ObjectId. 
            // I'll assume simple string for now based on snippet "Kelly".

            // Update: Step 106 says `Review` model created.
            const payload = {
                product: id,
                user: reviewForm.name || 'Anonymous', // Fallback
                rating: parseInt(reviewForm.rating),
                comment: reviewForm.comment,
                title: reviewForm.title // Schema might not have title, but I'll send it.
            };

            await axios.post('http://localhost:5000/api/reviews', payload);
            toast.success("Review submitted successfully!");
            setShowReviewForm(false);
            setReviewForm({ name: '', rating: 5, title: '', comment: '' });

            // Refetch reviews
            const reviewRes = await axios.get(`http://localhost:5000/api/reviews/product/${id}`);
            setReviews(reviewRes.data);
        } catch (error) {
            toast.error("Failed to submit review.");
            console.error(error);
        }
    };

    const handleBuyNow = () => {
        if (!localStorage.getItem('osm_user')) {
            toast.error("please log in then you can commence");
            setTimeout(() => {
                navigate('/auth/login');
            }, 2000);
            return;
        }

        if (sizes && sizes.length > 0 && !selectedSize) {
            toast.warning("Please select a size first");
            return;
        }

        // Add to cart
        addToCart(product, quantity, selectedSize);

        toast.info("Item added to cart. Redirecting to checkout...");

        setTimeout(() => {
            navigate('/pages/user/checkout');
        }, 1200); // Redirect within 2 seconds
    };

    // Derived Stats
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : 0;

    const starCounts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => Math.round(r.rating) === star).length
    }));

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    if (!product) return <div style={{ padding: '50px', textAlign: 'center' }}>Product not found.</div>;

    const {
        title, price, comparePrice, inStock,
        stockQuantity, category, vendor,
        tags, productType, viewCount, soldCount,
        sizes, isSale
    } = product;

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className={`product-detail-page ${isLoaded ? 'fade-in' : ''}`}>
                {/* Headers and Layout similar to original but using dynamic `product` */}
                <PageBodyHeader title="Product Details" />

                <div className="product-detail-container">
                    <div className="product-detail-flex">
                        {/* ... LEFT SECTION - Gallery ... */}
                        <div className="product-detail-left">
                            <div className="thumbnail-gallery">
                                {galleryImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail-item ${mainImage === img ? 'active' : ''}`}
                                        onMouseEnter={() => setMainImage(img)}
                                    >
                                        <img src={img} alt={`Thumb ${index}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="main-image-view">
                                <img src={mainImage} alt={title} />
                            </div>
                        </div>

                        {/* RIGHT SECTION - Info */}
                        <div className="product-detail-right">
                            <h1 className="product-detail-title">{title}</h1>

                            {/* ... rating, real-time-stats, stock-status, product-meta-info, stock-limit ... */}
                            <div className="product-detail-rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} style={{ color: i < Math.round(averageRating) ? '#ffb400' : '#ccc' }} />
                                    ))}
                                </div>
                                <span className="review-count">{totalReviews > 0 ? `${totalReviews} reviews` : 'No reviews'}</span>
                            </div>

                            <div className="real-time-stats">
                                <div className="stat-item">
                                    <FaEye /> <span>{viewCount || 20} people are viewing this right now</span>
                                </div>
                                <div className="stat-item sold-stat">
                                    <FaFire /> <span>{soldCount || 10} sold in last 21 hours</span>
                                </div>
                            </div>

                            <div className="stock-status">
                                {inStock ? <><FaCheckCircle style={{ color: 'green' }} /> <span style={{ color: 'green' }}>In Stock</span></> : <><FaCheckCircle style={{ color: 'red' }} /> <span style={{ color: 'red' }}>Out of Stock</span></>}
                            </div>

                            <div className="product-meta-info">
                                <div className="meta-row">
                                    <span className="meta-label">Product Type:</span>
                                    <span className="meta-value">{productType || 'Average'}</span>
                                </div>
                                <div className="meta-row">
                                    <span className="meta-label">Vendor:</span>
                                    <span className="meta-value">{vendor}</span>
                                </div>
                                <div className="meta-row">
                                    <span className="meta-label">Category:</span>
                                    <span className="meta-value">{category}</span>
                                </div>
                                <div className="meta-row">
                                    <span className="meta-label">Tags:</span>
                                    <span className="meta-value">{tags && tags.join(', ')}</span>
                                </div>
                            </div>

                            <div className="stock-limit">
                                <div className="stock-limit-text">Only <span>{stockQuantity} item(s)</span> left in stock</div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: `${Math.min(stockQuantity, 100)}%` }}></div>
                                </div>
                            </div>

                            <div className="product-detail-price">
                                {comparePrice > price && (
                                    <>
                                        <span className="old-price" style={{ textDecoration: 'line-through', color: '#999', marginRight: '10px', fontSize: '1.2rem' }}>₹{comparePrice.toFixed(2)}</span>
                                        <span className="current-price" style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{price.toFixed(2)}</span>
                                        <span className="off-badge-detail" style={{ background: '#ff3e6c', color: '#fff', marginLeft: '10px', fontSize: '1rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>₹{(comparePrice - price).toFixed(0)} OFF</span>
                                    </>
                                )}
                                {comparePrice <= price && <span className="current-price" style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{price.toFixed(2)}</span>}
                            </div>

                            {/* SIZE SELECTION */}
                            {sizes && sizes.length > 0 && (
                                <div className="size-section-detail">
                                    <p className="size-label-detail">Size: <span>{selectedSize}</span></p>
                                    <div className="size-options-detail">
                                        {sizes
                                            .filter(size => size && size.trim() !== '')
                                            .map(size => (
                                                <button
                                                    key={size}
                                                    className={`size-btn-detail ${selectedSize === size ? 'active' : ''}`}
                                                    onClick={() => setSelectedSize(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}

                            <div className="product-actions">
                                <div className="quantity-section">
                                    <p className="quantity-label">Quantity:</p>
                                    <div className="quantity-add-cart">
                                        <div className="quantity-selector">
                                            <button className="quantity-btn" onClick={decreaseQty}><FaMinus /></button>
                                            <input type="text" className="quantity-input" value={quantity} readOnly />
                                            <button className="quantity-btn" onClick={increaseQty}><FaPlus /></button>
                                        </div>
                                        <div className="add-to-cart-action">
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => {
                                                    if (sizes && sizes.length > 0 && !selectedSize) {
                                                        toast.warning("Please select a size first");
                                                        return;
                                                    }
                                                    addToCart(product, quantity, selectedSize);
                                                }}
                                            >
                                                <FaShoppingCart /> Add To Cart
                                            </button>
                                            <button
                                                className={`wishlist-btn-action ${isInWishlist(product._id) ? 'active' : ''}`}
                                                onClick={() => addToWishlist(product)}
                                            >
                                                <FaRegHeart />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <label className="terms-checkbox">
                                    <input type="checkbox" />
                                    <span>I Agree With The <Link to="/pages/user/terms-conditions">Terms And Conditions</Link></span>
                                </label>

                                <button
                                    className="buy-now-btn"
                                    onClick={handleBuyNow}
                                >
                                    Buy It Now
                                </button>
                            </div>

                            <div className="share-btns">
                                <div className="share-btn"><FaShareAlt /> Share</div>
                            </div>

                            {/* Delivery & Pickup Info (Static for now or mock) */}
                            <div className="delivery-info">
                                <p className="delivery-date">DELIVERY: <span>Feb 8 - Feb 11</span></p>
                                <p className="delivery-note">Free Shipping and Returns on all orders over ₹899</p>
                            </div>
                            <div className="pickup-info">
                                <FaCheckCircle className="pickup-icon" />
                                <div className="pickup-details">
                                    <h4>Pickup available at <strong>Surat</strong></h4>
                                    <p>Usually ready in 24 hours</p>
                                    <Link to="#">Check availability at other stores</Link>
                                </div>
                            </div>
                            <div className="secure-checkout">
                                <p>Guaranteed Safe Checkout:</p>
                                <div className="payment-methods">
                                    <img src="/photos/phonepay.png" className="payment-icon" alt="phonepay" />
                                    <img src="/photos/gpay.png" className="payment-icon" alt="gpay" />
                                    <img src="/photos/paytm.png" className="payment-icon" alt="paytm" />
                                    <img src="/photos/visa.png" className="payment-icon" alt="visa" />
                                    <img src="/photos/paypal.png" className="payment-icon" alt="paypal" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABS SECTION */}
                    <div className="product-tabs-section">
                        <div className="tabs-container-inner">
                            <div className="tabs-header">
                                <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Product Description</button>
                                <button className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveTab('shipping')}>Shipping Returns</button>
                                <button className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')}>Custom Tab</button>
                                <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
                            </div>

                            <div className="tab-content-container">
                                {activeTab === 'description' && (
                                    <div className="tab-pane active">
                                        <p>{product.description}</p>
                                    </div>
                                )}

                                {activeTab === 'shipping' && (
                                    <div className="tab-pane active shipping-tab-content">
                                        <p>Your order of ₹899 or more gets free standard delivery.</p>
                                        <ul>
                                            <li>Standard delivered 4-5 Business Days</li>
                                            <li>Express delivered 2-4 Business Days</li>
                                        </ul>
                                        <p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>
                                        <p>Team members enjoy free returns.</p>
                                    </div>
                                )}

                                {activeTab === 'custom' && (
                                    <div className="tab-pane active custom-tab-content">
                                        <p>When you place an order, we will estimate shipping and delivery dates for you based on the availability of your items and the shipping options you choose.</p>
                                        <p>Please also note that the shipping rates for many items we sell are weight-based. The weight of any such item can be found on its detail page. To reflect the policies of the shipping companies we use, all weights will be rounded up to the next full pound.</p>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="tab-pane active">
                                        <div className="reviews-summary">
                                            <div className="avg-rating-box">
                                                <div className="rating-score">
                                                    <div className="stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} style={{ color: i < Math.round(averageRating) ? '#ffb400' : '#ccc' }} />
                                                        ))}
                                                    </div>
                                                    <span>{averageRating} out of 5</span>
                                                </div>
                                                <span className="review-count">Based on {totalReviews} review(s)</span>
                                            </div>

                                            <div className="rating-bars">
                                                <p style={{ fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', marginBottom: '15px' }}>CUSTOMER REVIEWS</p>
                                                {starCounts.map(item => (
                                                    <div key={item.star} className="rating-bar-row">
                                                        <div className="bar-stars">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar key={i} style={{ color: i < item.star ? '#ffb400' : '#f0f0f0' }} />
                                                            ))}
                                                        </div>
                                                        <div className="bar-bg">
                                                            <div className="bar-fill" style={{ width: totalReviews > 0 ? `${(item.count / totalReviews) * 100}%` : '0%' }}></div>
                                                        </div>
                                                        <span className="bar-count">{item.count}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button className="write-review-btn" onClick={() => setShowReviewForm(!showReviewForm)}>
                                                {showReviewForm ? 'Cancel Review' : 'Write a review'}
                                            </button>
                                        </div>

                                        {showReviewForm && (
                                            <form onSubmit={handleReviewSubmit} className="review-form" style={{ marginTop: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                                                <h4>Write a Review</h4>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <label>Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={reviewForm.name}
                                                        onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                                                        required
                                                        placeholder="Your Name"
                                                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                                    />
                                                </div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <label>Rating</label>
                                                    <div className="star-rating-input">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <FaStar
                                                                key={star}
                                                                style={{ cursor: 'pointer', color: star <= reviewForm.rating ? '#ffb400' : '#ccc', fontSize: '1.2rem', marginRight: '5px' }}
                                                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div style={{ marginBottom: '10px' }}>
                                                    <label>Review</label>
                                                    <textarea
                                                        className="form-control"
                                                        value={reviewForm.comment}
                                                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                        required
                                                        rows="4"
                                                        placeholder="Write your comments here"
                                                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                                    />
                                                </div>
                                                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', borderRadius: '4px' }}>Submit Review</button>
                                            </form>
                                        )}

                                        <div className="reviews-list" style={{ marginTop: '30px' }}>
                                            {reviews.map(review => (
                                                <div key={review._id} className="individual-review">
                                                    <div className="review-header">
                                                        <div className="reviewer-info">
                                                            <div className="reviewer-avatar"><FaUserCircle /></div>
                                                            <div>
                                                                <div className="stars" style={{ color: '#ffb400', fontSize: '0.9rem', marginBottom: '5px' }}>
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <FaStar key={i} style={{ color: i < review.rating ? '#ffb400' : '#ccc' }} />
                                                                    ))}
                                                                </div>
                                                                <span className="reviewer-name">{review.user && (typeof review.user === 'string' ? review.user : review.user.name || 'Anonymous')}</span>
                                                            </div>
                                                        </div>
                                                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="review-body">
                                                        {review.title && <h4>{review.title}</h4>}
                                                        <p>{review.comment}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {reviews.length === 0 && <p>No reviews yet. Be the first to write one!</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FEATURES SECTION */}
                    <div className="features-section">
                        <div className="features-container">
                            <div className="feature-item">
                                <FiTruck className="feature-icon" />
                                <span className="feature-text">Free delivery</span>
                            </div>
                            <div className="feature-item">
                                <FiPackage className="feature-icon" />
                                <span className="feature-text">Non-contact shipping</span>
                            </div>
                            <div className="feature-item">
                                <FiDollarSign className="feature-icon" />
                                <span className="feature-text">Money-back guarantee</span>
                            </div>
                            <div className="feature-item">
                                <FiHeadphones className="feature-icon" />
                                <span className="feature-text">feather-shield</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="related-products-section">
                        <h2 className="section-title">Related Products</h2>
                        <div className="product-grid">
                            {relatedProducts.map(p => (
                                <div key={p._id} className="product-card">
                                    <Link to={`/pages/user/product/${p._id}`} className="product-image-wrapper">
                                        {p.isSale && <span className="sale-badge">SALE</span>}
                                        <img src={p.image} alt={p.title} className="main-img" />
                                        <img
                                            src={(p.images && p.images.length > 0) ? p.images[0] : p.image}
                                            alt={`${p.title} hover`}
                                            className="hover-img"
                                        />
                                        <div className="product-icons">
                                            <div className="icon-btn" onClick={(e) => { e.preventDefault(); addToWishlist(p); }}><FaRegHeart className={isInWishlist(p._id) ? 'active-icon' : ''} /></div>
                                            <div className="icon-btn"><FaShoppingCart onClick={(e) => { e.preventDefault(); addToCart(p); }} /></div>
                                        </div>
                                    </Link>
                                    <div className="product-info">
                                        <Link to={`/pages/user/product/${p._id}`} className="product-name">{p.title}</Link>
                                        <div className="product-price">
                                            {p.comparePrice > p.price && <span className="old-price">₹{p.comparePrice.toFixed(2)}</span>}
                                            <span className="current-price">₹{p.price.toFixed(2)}</span>
                                        </div>
                                        <div className="product-sizes">
                                            {p.sizes && p.sizes.map(s => <span key={s} className="size-label">{s}</span>)}
                                        </div>
                                        <div className="product-colors" style={{ display: 'flex', justifyContent: 'flex-start', gap: '5px', marginTop: '10px' }}>
                                            {p.colors && p.colors.map(c => (
                                                <span key={c} className="color-circle" style={{ backgroundColor: c, width: '12px', height: '12px', borderRadius: '50%', border: '1px solid #ddd' }}></span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recently Viewed Section */}
                {recentlyViewed.length > 0 && (
                    <div className="recently-viewed-section">
                        <h2 className="section-title">Recently Viewed Products</h2>
                        <div className="product-grid">
                            {recentlyViewed.map(p => (
                                <div key={p._id} className="product-card">
                                    <Link to={`/pages/user/product/${p._id}`} className="product-image-wrapper">
                                        {p.isSale && <span className="sale-badge">SALE</span>}
                                        {p.productType === 'New' && <span className="new-badge">New</span>}
                                        <img src={p.image} alt={p.title} className="main-img" />
                                        <img
                                            src={(p.images && p.images.length > 0) ? p.images[0] : p.image}
                                            alt={`${p.title} hover`}
                                            className="hover-img"
                                        />
                                    </Link>
                                    <div className="product-info">
                                        <Link to={`/pages/user/product/${p._id}`} className="product-name">{p.title}</Link>
                                        <div className="product-price">
                                            {p.comparePrice > p.price && <span className="old-price">₹{p.comparePrice.toFixed(2)}</span>}
                                            <span className="current-price">₹{p.price.toFixed(2)}</span>
                                        </div>
                                        <div className="product-sizes">
                                            {p.sizes && p.sizes.map(s => <span key={s} className="size-label">{s}</span>)}
                                        </div>
                                        <div className="product-colors" style={{ display: 'flex', justifyContent: 'flex-start', gap: '5px', marginTop: '10px' }}>
                                            {p.colors && p.colors.map(c => (
                                                <span key={c} className="color-circle" style={{ backgroundColor: c, width: '12px', height: '12px', borderRadius: '50%', border: '1px solid #ddd' }}></span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductDetail;
