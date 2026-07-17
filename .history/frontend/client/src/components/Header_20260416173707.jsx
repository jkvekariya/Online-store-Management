import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/header.css";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { LuHeart } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import Sidebar from "./Sidebar";
import { useCart } from "../context/CartContext";

const Header = () => {
  const categories = [
    "Accessories",
    "Best Selling Products",
    "Caps",
    "Clothing",
    "Daily Deal",
    "Electronics",
    "Featured Products",
    "Footwear",
    "Watches",
  ];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("All Categories");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [contactNumber, setContactNumber] = useState('+132 5465 2389');
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const apiBaseUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
        const res = await axios.get(`${apiBaseUrl}/api/page-content/contact`);
        if (res.data && res.data.sections && res.data.sections.contactNumber) {
          setContactNumber(res.data.sections.contactNumber);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const apiBaseUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
        const res = await axios.get(`${apiBaseUrl}/api/products`);
        setAllProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchContactInfo();
    fetchProducts();

    const userData = localStorage.getItem('osm_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      const userData = localStorage.getItem('osm_user');
      setUser(userData ? JSON.parse(userData) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const navigate = useNavigate();
  const { getCartCount, getWishlistCount } = useCart();

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
    } else {
      const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(value.toLowerCase()) ||
        product.description.toLowerCase().includes(value.toLowerCase()) ||
        product.vendor.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 8)); // Limit to 8 results
      setShowSearchResults(true);
    }
  };

  const handleSearchResultClick = (productId) => {
    setSearchInput('');
    setShowSearchResults(false);
    setSearchResults([]);
    navigate(`/pages/user/product/${productId}`);
  };

  const handleSearchIconClick = () => {
    if (searchInput.trim() !== '') {
      setShowSearchResults(false);
      // Could also navigate to products page with search filter
    }
  };

  const handleProfileClick = () => {
    const user = localStorage.getItem('osm_user');
    if (user) {
      navigate('/pages/user/profile');
    } else {
      navigate('/auth/login');
    }
  };

  const handleSelect = (category) => {
    setSelected(category);
    setOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <>
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Top Heading content */}
      <header className="header">
        {/* Top header */}
        <div className="logo">
          <h2>Clothify</h2>
        </div>
        <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <i className="fa-solid fa-bars"></i>
        </div>
        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </div>
          <ul>
            <li>
              <Link to="/" onClick={closeMobileMenu}>Home</Link>
            </li>
            <li>
              <Link to="/pages/user/products" onClick={closeMobileMenu}>Products</Link>
            </li>
            <li>
              <Link to="/pages/user/contact" onClick={closeMobileMenu}>Contact Us</Link>
            </li>
            <li>
              <Link to="/pages/user/about" onClick={closeMobileMenu}>About Us</Link>
            </li>
            <li>
              <Link to="/pages/user/blog" onClick={closeMobileMenu}>Blog</Link>
            </li>
            {user && (
              <li>
                <Link to="/pages/user/orders" onClick={closeMobileMenu}>Orders</Link>
              </li>
            )}
            <li className="nav-dropdown" onClick={() => setMoreOpen(!moreOpen)}>
              <span className="more-link">More <i className="fa-solid fa-angle-down"></i></span>
              {moreOpen && (
                <ul className="nav-dropdown-menu">
                  <li><Link to="/pages/user/Faq" onClick={() => { setMoreOpen(false); closeMobileMenu(); }}>FAQ</Link></li>
                  <li><Link to="/pages/user/privacy-policy" onClick={() => { setMoreOpen(false); closeMobileMenu(); }}>Privacy Policy</Link></li>
                  <li><Link to="/pages/user/terms-conditions" onClick={() => { setMoreOpen(false); closeMobileMenu(); }}>Terms & Conditions</Link></li>
                </ul>
              )}
            </li>
            <p className="line"></p>
            <li id="my-account">
              {user ? (
                <Link to="/pages/user/profile" onClick={closeMobileMenu}>
                  Hey, {user.firstname}<i className="fa-solid fa-user" style={{ marginLeft: '5px' }}></i>
                </Link>
              ) : (
                <Link to="/auth/login" onClick={closeMobileMenu}>
                  My Account<i className="fa-solid fa-user" style={{ marginLeft: '4px' }}></i>
                </Link>
              )}
            </li>

            {/* <div className='btn-signup-in'>
                        <li className='signup'>
                            <Link to="auth/signup">Signup</Link>
                        </li>
                        <li className='signin'>
                            <Link to="auth/login">Login</Link>
                        </li>
                    </div> */}
          </ul>
          <div className="social-media">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-facebook-f" id="facebook"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram" id="instagram"></i>
            </a>
            <a href="https://www.threads.net" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-threads" id="threads"></i>
            </a>
          </div>
        </nav>
      </header>

      {/* Middle header */}
      <div className="middle-container">
        <div className="left-content">
          <div className="logo">
            <h2>Clothify</h2>
          </div>
        </div>

        {/*-------------- center-part of middle header-------------- */}
        <div className="center-content">
          <input
            type="text"
            placeholder="Search..."
            className="search-box"
            autoComplete="off"
            value={searchInput}
            onChange={handleSearchInputChange}
            onFocus={() => searchInput && setShowSearchResults(true)}
          />
          <div className="search-icon" onClick={handleSearchIconClick}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  className="search-result-item"
                  onClick={() => handleSearchResultClick(product._id)}
                >
                  <img src={product.image} alt={product.title} className="search-result-image" />
                  <div className="search-result-info">
                    <h4>{product.title}</h4>
                    <p className="search-result-vendor">{product.vendor || 'Unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/*-------------- right-part of middle header-------------- */}
        <div className="right-content">
          <div className="contact-info-container">
            <div className="phone-logo">
              <FiPhoneCall />
            </div>
            <div className="contact-no">
              <h3>call us now</h3>
              <h2>{contactNumber}</h2>
            </div>
          </div>
          <div className="middle-header-icons">
            {user && (
              <div onClick={handleProfileClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaRegUser id="profile" />
              </div>
            )}
            <Link to="/pages/user/wishlist" className="icon-link">
              <LuHeart id="whichlist" style={{ cursor: 'pointer', color: '#333' }} />
              <span className="icon-badge">{getWishlistCount()}</span>
            </Link>
            <Link to="/pages/user/cart" className="icon-link">
              <HiOutlineShoppingCart id="cart" style={{ cursor: 'pointer', color: '#333' }} />
              <span className="icon-badge">{getCartCount()}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
