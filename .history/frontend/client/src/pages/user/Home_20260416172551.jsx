import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/home.css';
import { FaArrowRight, FaHeart, FaLayerGroup, FaEye, FaShoppingCart } from 'react-icons/fa';
import { FiTruck, FiPackage, FiDollarSign, FiHeadphones, FiArrowUp } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
// Brand icons removed in favor of local images

// Local image paths for categories and hero
const backpackImg = '/photos/backpack.png';
const accessoriesImg = '/photos/accessories.png';
const jacketImg = '/photos/jacket.png';
const dressImg = '/photos/dress.png';
const trendingFeatureImg = '/photos/trending-main.jpg';
const shirtImg = '/photos/shirt.png';
const jeansImg = '/photos/jeans.png';
const shoesImg = '/photos/shoes.png';
const heroImg = '/photos/herosection-image.jpg';

// Categories will be fetched from backend dynamically
// const heroImg = '/photos/herosection-image.jpg';

const trendingItems = [
  {
    id: "6998534eec6911afd3c8a4e0",
    name: 'High-Waisted Straight Jeans',
    price: 1690.00,
    oldPrice: 2489.00,
    image: 'https://m.media-amazon.com/images/I/81Ii1sCIZkL._AC_SX679_.jpg',
    hoverImage: 'https://m.media-amazon.com/images/I/81KFYlz8QxL._AC_SX679_.jpg',
    colors: ['#000080', '#add8e6'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: "6998534eec6911afd3c8a4de",
    name: 'Black Classic Pullover Hoodie',
    price: 890.00,
    oldPrice: 1189.00,
    image: '/photos/hoodie-front.png',
    hoverImage: '/photos/hoodie-back.png',
    colors: ['#0000ff', '#333333'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: "6998534eec6911afd3c8a4df",
    name: 'Loose Fit Wool Blend Coat',
    price: 1400.00,
    oldPrice: 1950.00,
    image: 'https://m.media-amazon.com/images/I/91RSBvi-ssL._AC_SX679_.jpg',
    hoverImage: 'https://m.media-amazon.com/images/I/91TOWSfJENL._AC_SX679_.jpg',
    colors: ['#666666', '#000000'],
    sizes: ['M', 'L', 'XL', 'S'],
  },
];

const testimonials = [
  {
    id: 1,
    name: "amita pandya",
    role: "Marketing executive",
    image: "/photos/review-pic-1.jpg",
    rating: 5,
    text: "The fabric feels really soft and comfortable,Totally worth the price and quality is also good."
  },
  {
    id: 2,
    name: "kevin kumar",
    role: "Content creator",
    image: "/photos/review-pic-2.jpg",
    rating: 4.5,
    text: "Color is slightly different from the photos, but still looks good also Comfortable to wear for long hours."
  },
  {
    id: 3,
    name: "nandani shah",
    role: "Manager",
    image: "/photos/review-pic-3.jpg",
    rating: 5,
    text: "Fits well, but I’d recommend sizing up if you prefer a loose fit and it’s a bit on the pricier side."
  },
  {
    id: 4,
    name: "John Doe",
    role: "Designer",
    image: "/photos/trending-main.jpg", // Using available image as placeholder
    rating: 4,
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  }
];

function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [categories, setCategories] = useState([]);
  const [testimonialsPerView, setTestimonialsPerView] = useState(3);
  const { addToWishlist, isInWishlist } = useCart();

  const apiBaseUrl = `${window.location.protocol}//${window.location.hostname}:5000`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/categories`);
        const data = await response.json();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [apiBaseUrl]);

  const [categoriesPerView, setCategoriesPerView] = useState(4);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => {
      setCategoriesPerView(mq.matches ? 1 : 4);
      setTestimonialsPerView(mq.matches ? 1 : 3);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const maxIdx = Math.max(0, categories.length - categoriesPerView);
    setCategoryIndex((i) => Math.min(i, maxIdx));
  }, [categories.length, categoriesPerView]);

  // Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set the date we're counting down to (e.g., 3 days from now)
    const countDownDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  const nextTestimonial = () => {
    const maxIdx = Math.max(0, testimonials.length - testimonialsPerView);
    if (testimonialIndex < maxIdx) {
      setTestimonialIndex(testimonialIndex + 1);
    } else {
      setTestimonialIndex(0);
    }
  };

  const prevTestimonial = () => {
    const maxIdx = Math.max(0, testimonials.length - testimonialsPerView);
    if (testimonialIndex > 0) {
      setTestimonialIndex(testimonialIndex - 1);
    } else {
      setTestimonialIndex(maxIdx);
    }
  };

  const handleSizeSelect = (itemId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size
    }));
  };

  const nextCategory = () => {
    setCategoryIndex((prev) => {
      const maxIdx = Math.max(0, categories.length - categoriesPerView);
      if (prev < maxIdx) return prev + 1;
      return 0;
    });
  };

  const prevCategory = () => {
    setCategoryIndex((prev) => {
      const maxIdx = Math.max(0, categories.length - categoriesPerView);
      if (prev > 0) return prev - 1;
      return maxIdx;
    });
  };

  const categoryTrackTransform =
    categories.length > 0
      ? `translateX(-${(100 / categoriesPerView) * categoryIndex}%)`
      : 'translateX(0)';

  return (
    <>
      {/* HERO SECTION */}
      <div className="hero-section">
        <img src={heroImg} alt="Hero Background" className="hero-bg-img" />
        <div className="hero-content">
          <p className="hero-subtitle">Outerwear for cooler days</p>
          <h1 className="hero-title">
            BOLD LOOKS <br />
            EVERYDAY{' '}
            <br className="hero-wear-line-mobile-only" aria-hidden="true" />
            WEAR
          </h1>
          <Link to="/pages/user/products" className="hero-cta-link">
            <button className="hero-btn" type="button">SHOP NOW</button>
          </Link>
        </div>
        {/* <div className="hero-watermark">
          FASHION
        </div> */}
      </div>

      <div className="home-container">
        {/* SHOP BY CATEGORIES */}
        <div className="section-title">
          <h2>Shop By Categories</h2>
          <div className="section-controls">
            <button type="button" className="control-btn" onClick={prevCategory} aria-label="Previous category">
              <FaArrowRight style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button type="button" className="control-btn" onClick={nextCategory} aria-label="Next category">
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className="categories-wrapper">
          <div
            className="categories-track"
            style={{
              ['--cat-count']: Math.max(1, categories.length),
              transform: categoryTrackTransform,
              ...(categoriesPerView === 1 && categories.length > 0
                ? { width: `${categories.length * 100}%` }
                : {}),
            }}
          >
            {categories.map((cat, index) => (
              <Link key={cat._id || index} to={`/pages/user/products?category=${cat.name}`} className="category-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="category-card-inner">
                  <img src={cat.image} alt={cat.name} className="category-image" />
                  <div className="category-info">
                    <div>
                      <h3 className="category-name">{cat.name}</h3>
                      <span className="category-items-count">{cat.count} items</span>
                    </div>
                    <div className="category-arrow">
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* TRENDING NOW */}
        <div className="trending-section">
          {/* Left Side Image */}
          <div className="trending-image-container">
            <img
              src={trendingFeatureImg}
              alt="Trending Collection"
              className="trending-feature-image"
            />
            <div className="trending-overlay-content">
              <span className="overlay-subtitle">New arrivals</span>
              <h2 className="overlay-title">Winter Collection For Women</h2>
              <Link to="/pages/user/products">
                <button className="overlay-btn">Shop Now</button>
              </Link>
            </div>
          </div>

          {/* Right Side Slider */}
          <div className="trending-content">
            <div className="trending-header">
              <span className="accent-text">Favorite Products</span>
              <h2 className="trending-title">Trending Now</h2>
            </div>

            <div className="product-slider-container">
              {trendingItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`product-slide ${index === activeSlide ? 'active' : ''}`}
                >
                  <div className="product-card">
                    <Link to={`/pages/user/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="product-image-wrapper">
                        <span className="sale-badge">SALE</span>

                        <img src={item.image} alt={item.name} className="product-img main-img" />
                        <img src={item.hoverImage} alt={item.name} className="product-img hover-img" />

                        <div className="product-icons">
                          <div
                            className={`icon-btn ${isInWishlist(item.id) ? 'active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToWishlist({
                                _id: item.id,
                                title: item.name,
                                price: item.price,
                                image: item.image,
                                sizes: item.sizes,
                                colors: item.colors
                              });
                            }}
                            title={isInWishlist(item.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                          >
                            <FaHeart style={{ color: isInWishlist(item.id) ? '#ff3e6c' : 'inherit' }} />
                          </div>
                          <div className="icon-btn" title="Quick View">
                            <FaEye />
                          </div>
                        </div>

                        <div className="floating-btn-container">
                          <button className="select-options-btn">
                            <FaShoppingCart /> Select Options
                          </button>
                        </div>
                      </div>

                      <div className="product-details">
                        <h3 className="product-name">{item.name}</h3>
                        <div className="product-price">
                          <span className="new-price">₹{item.price.toFixed(2)}</span>
                          <span className="old-price" style={{ marginLeft: '10px' }}>₹{item.oldPrice.toFixed(2)}</span>
                          <span className="off-label" style={{ color: '#ff3e6c', marginLeft: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                            (₹{(item.oldPrice - item.price).toFixed(2)} OFF)
                          </span>
                        </div>

                        <div className="color-options">
                          {item.colors.map(color => (
                            <div key={color} className="color-dot" style={{ background: color }}></div>
                          ))}
                        </div>

                        <div className="size-options">
                          {item.sizes.map(size => (
                            <div
                              key={size}
                              className={`size-box ${selectedSizes[item.id] === size ? 'selected' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSizeSelect(item.id, size);
                              }}
                            >
                              {size}
                            </div>
                          ))}
                        </div>

                        <button
                          className="add-to-cart-btn"
                          style={{ display: 'block' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add to cart logic
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination moved here, outside the slider track and links */}
            <div className="slider-pagination" style={{ position: 'relative', marginTop: '20px', justifyContent: 'center' }}>
              {trendingItems.map((_, index) => (
                <div
                  key={index}
                  className={`pagination-dot ${index === activeSlide ? 'active' : ''}`}
                  onClick={() => handleSlideChange(index)}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SPECIAL OFFER SECTION */}
      <div className="special-offer-section">
        <div className="offer-content">
          <h2 className="offer-title">Special Offer</h2>
          <p className="offer-subtitle">20% OFF Winter Clothing Items.. Limited Time Only.</p>
        </div>

        <div className="offer-timer">
          <div className="timer-block">
            <span className="timer-number">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="timer-label">Days</span>
          </div>
          <span className="timer-colon">:</span>
          <div className="timer-block">
            <span className="timer-number">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="timer-label">Hours</span>
          </div>
          <span className="timer-colon">:</span>
          <div className="timer-block">
            <span className="timer-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="timer-label">Minutes</span>
          </div>
          <span className="timer-colon">:</span>
          <div className="timer-block">
            <span className="timer-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="timer-label">Seconds</span>
          </div>
        </div>

        <Link to="/pages/user/products">
          <button className="offer-btn">Shop The Sale</button>
        </Link>
      </div >

      {/* COLLECTION SPOTLIGHT SECTION */}
      < div className="collection-section" >
        <div className="collection-content">
          <span className="collection-subtitle">Our Collections</span>
          <h2 className="collection-title">The SweatShirts You'll Use <br /> Again And Again.</h2>
          <p className="collection-desc">Upgrade your wardrobe with a variety of styles and fits that <br />blend comfort with modern fashion.</p>
          <Link to="/pages/user/products">
            <button className="collection-btn">Shop All Products</button>
          </Link>

          <div className="collection-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        <div className="collection-images">
          {/* Main Background Image - Placeholder */}
          <img src="/photos/banner-1.jpg" className="img-main" alt="Model" />

          {/* Overlapping Product Image - Placeholder */}
          <div className="img-overlay-box">
            <img src="/photos/banner-tshirt.png" className="img-product" alt="Product" />
          </div>
        </div>
      </div >

      {/* BRANDS SECTION */}
      < div className="brands-section" >
        <div className="brands-container">
          <div className="brand-item" title="Nike"><img src="/photos/nike.png" alt="Nike" /></div>
          <div className="brand-item" title="US Polo"><img src="/photos/uspoloo.png" alt="US Polo" /></div>
          <div className="brand-item" title="Asos"><img src="/photos/asos.png" alt="Asos" /></div>
          <div className="brand-item" title="Adidas"><img src="/photos/addidas.png" alt="Adidas" /></div>
          <div className="brand-item" title="Allen Solly"><img src="/photos/allensolly.png" alt="Allen Solly" /></div>
          <div className="brand-item" title="Levi's"><img src="/photos/levi's.png" alt="Levi's" /></div>
          <div className="brand-item" title="Diesel"><img src="/photos/diesel.png" alt="Diesel" /></div>
          <div className="brand-item" title="Boss"><img src="/photos/boss.png" alt="Boss" /></div>
        </div>
      </div >

      {/* ANNOUNCEMENT BANNER */}
      < div className="announcement-bar" >
        <div className="announcement-track">
          <div className="announcement-item">Get 10% Off On Selected Items</div>
          <div className="announcement-item">Limited Time Offer: Fashion Sale You Can't Resist</div>
          <div className="announcement-item">Free Shipping And Returns</div>
          {/* Duplicate for infinite loop */}
          <div className="announcement-item">Get 10% Off On Selected Items</div>
          <div className="announcement-item">Limited Time Offer: Fashion Sale You Can't Resist</div>
          <div className="announcement-item">Free Shipping And Returns</div>
          <div className="announcement-item">Get 10% Off On Selected Items</div>
          <div className="announcement-item">Limited Time Offer: Fashion Sale You Can't Resist</div>
          <div className="announcement-item">Free Shipping And Returns</div>
        </div>
      </div >

      {/* TESTIMONIALS SECTION */}
      <div className="section-title testimonials-title">
        <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>TESTIMONIALS</h2>
        <div className="section-controls">
          <button className="control-btn" onClick={prevTestimonial}>
            <FaArrowRight style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button className="control-btn" onClick={nextTestimonial}>
            <FaArrowRight />
          </button>
        </div>
      </div >

      <div className="testimonials-wrapper">
        <div
          className="testimonials-track"
          style={{ transform: `translateX(-${(100 / testimonialsPerView) * testimonialIndex}%)` }}
        >
          {testimonials.map((test) => (
            <div key={test.id} className="testimonial-card">
              <div className="testimonial-card-inner">
                <div className="testimonial-stars">
                  {[...Array(Math.round(test.rating))].map((_, i) => (
                    <span key={i} style={{ color: '#ffb400', fontSize: '1.2rem' }}>☆</span> // Using simple char for now, or icon
                  ))}
                </div>
                <p className="testimonial-text">{test.text}</p>
                <img src={test.image} alt={test.name} className="testimonial-user-img" />
                <h4 className="testimonial-name">{test.name}</h4>
                <span className="testimonial-role">{test.role}</span>
              </div>
            </div>
          ))}
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

      {/* SCROLL TO TOP */}
      <button
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <FiArrowUp />
      </button>
    </>
  );
}

export default Home;

