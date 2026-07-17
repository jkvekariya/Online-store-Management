import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../css/products.css';
import { FaChevronDown, FaHeart, FaLayerGroup, FaEye, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PageBodyHeader from '../../components/PagebodyHeader';
import { useCart } from '../../context/CartContext';


const Products = () => {
  // Accordion state
  const [openSections, setOpenSections] = useState({
    categories: true,
    availability: true,
    price: true,
    size: true,
    brand: true,
    bestsellers: true
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get('category');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryFromQuery || 'All');

  useEffect(() => {
    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery);
    }
  }, [categoryFromQuery]);

  const [priceRange, setPriceRange] = useState(5000);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [sortBy, setSortBy] = useState('Best Selling');

  // Mock Timer Logic
  const [timeLeft, setTimeLeft] = useState("1655d : 16h : 29m : 14s");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft("1655d : 16h : 29m : 14s");
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Products from Backend
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const { addToCart, addToWishlist, isInWishlist } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and Sort Logic
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let result = [...products]; // Create a copy for filtering/sorting

    if (selectedCategory !== 'All') {
      const allowedCategories = categoryMapping[selectedCategory] || [selectedCategory];
      result = result.filter(p => allowedCategories.includes(p.category));
    }

    result = result.filter(p => p.price <= priceRange);

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.vendor));
    }

    if (availability.length > 0) {
      result = result.filter(p => {
        if (availability.includes('inStock') && p.inStock) return true;
        if (availability.includes('outStock') && !p.inStock) return true;
        return false;
      });
    }

    // Apply Sorting
    switch (sortBy) {
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Newest Arrivals':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'Best Selling':
        result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [selectedCategory, priceRange, selectedSizes, selectedBrands, availability, products, sortBy]);

  const filterDrawerAnchorRef = useRef(null);
  const productsTopBarRef = useRef(null);
  const sidebarRef = useRef(null);
  const [filterDrawerTopPx, setFilterDrawerTopPx] = useState(300);

  const measureFilterDrawerTop = useCallback(() => {
    const anchor = filterDrawerAnchorRef.current;
    const topBar = productsTopBarRef.current;
    const a = anchor?.getBoundingClientRect().bottom ?? 0;
    const b = topBar?.getBoundingClientRect().bottom ?? 0;
    const bottom = Math.max(a, b);
    if (bottom > 0) {
      setFilterDrawerTopPx(Math.round(bottom));
    }
  }, []);

  useLayoutEffect(() => {
    if (loading) return;
    measureFilterDrawerTop();
    window.addEventListener('resize', measureFilterDrawerTop);
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measureFilterDrawerTop);
      if (filterDrawerAnchorRef.current) ro.observe(filterDrawerAnchorRef.current);
      if (productsTopBarRef.current) ro.observe(productsTopBarRef.current);
    }
    return () => {
      window.removeEventListener('resize', measureFilterDrawerTop);
      ro?.disconnect();
    };
  }, [measureFilterDrawerTop, loading, products.length, filteredProducts.length]);

  useLayoutEffect(() => {
    if (isFilterOpen) measureFilterDrawerTop();
  }, [isFilterOpen, measureFilterDrawerTop]);

  useLayoutEffect(() => {
    if (!isFilterOpen) return;
    const onScroll = () => measureFilterDrawerTop();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isFilterOpen, measureFilterDrawerTop]);

  useLayoutEffect(() => {
    if (isFilterOpen && sidebarRef.current) {
      sidebarRef.current.scrollTop = 0;
    }
  }, [isFilterOpen]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleAvailabilityToggle = (value) => {
    setAvailability(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [apiBaseUrl]);

  const categoryMapping = {
    'Topwear': ['Hoodies', 'T-Shirts', 'Shirts', 'Topwear'],
    'Bottomwear': ['Jeans', 'Trousers', 'Bottomwear'],
    'Bags': ['Handbags'],
    'Accessories': ['Accessories'],
    'Shoes': ['Shoes'],
    'Jackets': ['Jackets'],
    'Dresses': ['Dresses']
  };

  // Dynamic Brands Count (Assuming 'vendor' acts as brand)
  const brands = [
    { name: 'Adidas', count: products.filter(p => p.vendor === 'Adidas').length },
    { name: 'Nike', count: products.filter(p => p.vendor === 'Nike').length },
    { name: 'Levi\'s', count: products.filter(p => p.vendor === 'Levi\'s').length },
    { name: 'Allen Solly', count: products.filter(p => p.vendor === 'Allen Solly').length },
    { name: 'Boss', count: products.filter(p => p.vendor === 'Boss').length }
  ];

  const inStockCount = products.filter(p => p.inStock).length;
  const outStockCount = products.filter(p => !p.inStock).length;

  // Bestsellers Logic (Mock: assuming first 3 are bestsellers for now, or use a flag if model has it)
  // Backend doesn't strictly have 'rating' or 'bestseller' flag in the schema shown earlier, 
  // so we'll mock it or use what's available. We'll use slice(0,3) as bestsellers for display.
  const bestsellers = products.slice(0, 3);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading products...</div>;

  return (
    <div
      className="products-page-root"
      style={{ '--filter-sidebar-top': `${filterDrawerTopPx}px` }}
    >
      <div ref={filterDrawerAnchorRef} className="products-filter-drawer-anchor">
        <PageBodyHeader title="Products" />
        <div className="filter-mobile-btn-container">
          <button type="button" className="filter-mobile-btn" onClick={() => setIsFilterOpen(true)}>
            <i className="fa-solid fa-filter"></i> Filter
          </button>
        </div>
      </div>
      <div className={`products-page-container ${isLoaded ? 'fade-in' : ''}`}>
        {/* Sidebar */}
        <aside ref={sidebarRef} className={`product-sidebar ${isFilterOpen ? 'mobile-open' : ''}`}>
          <div className="close-filter-btn" onClick={() => setIsFilterOpen(false)}>
            <i className="fa-solid fa-xmark"></i> Close Filter
          </div>
          {/* Categories */}
          <div className="sidebar-section">
            <div className={`sidebar-title ${openSections.categories ? 'active' : ''}`} onClick={() => toggleSection('categories')}>
              <span>Categories</span>
              <FaChevronDown className="arrow-icon" />
            </div>
            <div className={`sidebar-content ${openSections.categories ? 'open' : ''}`}>
              <ul className="category-list">
                <li className={`category-item ${selectedCategory === 'All' ? 'active' : ''}`} onClick={() => handleCategoryClick('All')}>
                  <span>All Categories</span>
                  <span className="category-count">{products.length}</span>
                </li>
                {categories.map((cat, index) => (
                  <li key={index} className={`category-item ${selectedCategory === cat.name ? 'active' : ''}`} onClick={() => handleCategoryClick(cat.name)}>
                    <span>{cat.name}</span>
                    <span className="category-count">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Availability */}
          <div className="sidebar-section">
            <div className={`sidebar-title ${openSections.availability ? 'active' : ''}`} onClick={() => toggleSection('availability')}>
              <span>Availability</span>
              <FaChevronDown className="arrow-icon" />
            </div>
            <div className={`sidebar-content ${openSections.availability ? 'open' : ''}`}>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={availability.includes('inStock')}
                  onChange={() => handleAvailabilityToggle('inStock')}
                />
                <span>In stock ({inStockCount})</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={availability.includes('outStock')}
                  onChange={() => handleAvailabilityToggle('outStock')}
                />
                <span>Out of stock ({outStockCount})</span>
              </label>
            </div>
          </div>

          {/* Price */}
          <div className="sidebar-section">
            <div className={`sidebar-title ${openSections.price ? 'active' : ''}`} onClick={() => toggleSection('price')}>
              <span>Price</span>
              <FaChevronDown className="arrow-icon" />
            </div>
            <div className={`sidebar-content ${openSections.price ? 'open' : ''}`}>
              <div className="price-range-wrapper">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="range-slider"
                />
                <div className="price-inputs">
                  <div className="price-box"><span>₹</span>0</div>
                  <span>to</span>
                  <div className="price-box"><span>₹</span>{priceRange}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Size (Static for now as not in simple schema) */}
          <div className="sidebar-section">
            <div className={`sidebar-title ${openSections.size ? 'active' : ''}`} onClick={() => toggleSection('size')}>
              <span>Size</span>
              <FaChevronDown className="arrow-icon" />
            </div>
            <div className={`sidebar-content ${openSections.size ? 'open' : ''}`}>
              <div className="size-grid">
                {sizes.map(size => (
                  <div
                    key={size}
                    className={`size-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brands */}
          <div className="sidebar-section">
            <div className={`sidebar-title ${openSections.brand ? 'active' : ''}`} onClick={() => toggleSection('brand')}>
              <span>Brands</span>
              <FaChevronDown className="arrow-icon" />
            </div>
            <div className={`sidebar-content ${openSections.brand ? 'open' : ''}`}>
              {brands.map((brand, index) => (
                <label key={index} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.name)}
                    onChange={() => handleBrandToggle(brand.name)}
                  />
                  <span>{brand.name} ({brand.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bestsellers */}
          <div className="sidebar-section">
            <div className={`sidebar-title ${openSections.bestsellers ? 'active' : ''}`} onClick={() => toggleSection('bestsellers')}>
              <span>Bestsellers</span>
              <FaChevronDown className="arrow-icon" />
            </div>
            <div className={`sidebar-content ${openSections.bestsellers ? 'open' : ''}`}>
              {bestsellers.map(product => (
                <Link key={product._id} to={`/pages/user/product/${product._id}`} className="bestseller-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={product.image} alt={product.title} className="bestseller-img" />
                  <div className="bestseller-info">
                    <h4>{product.title}</h4>
                    <div className="bestseller-rating">
                      {/* Random rating for mock */}
                      <span>★★★★</span>
                    </div>
                    <div className="bestseller-price">₹{product.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-promo" style={{ marginTop: '2rem' }}>
            <img src="/photos/trending-main.jpg" alt="Promo" style={{ width: '100%', borderRadius: '4px' }} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-main-content">
          <div ref={productsTopBarRef} className="products-top-bar">
            {/* Sort Logic connected to sortBy state */}
            <select
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Best Selling">Best Selling</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Newest Arrivals">Newest Arrivals</option>
            </select>
            <span style={{ color: '#666' }}>Showing {filteredProducts.length} results</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}><h3>No products found matching your criteria.</h3></div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product._id} className="product-card">
                  <div className="product-image-wrapper">
                    <Link to={`/pages/user/product/${product._id}`}>
                      {product.isSale && <span className="sale-badge">SALE</span>}
                      <img src={product.image} alt={product.title} className="main-img" />
                      <img
                        src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                        alt={product.title}
                        className="hover-img"
                      />
                    </Link>

                    <div className="product-icons">
                      <div
                        className={`icon-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                        data-label="Add to Wishlist"
                        onClick={(e) => { e.preventDefault(); addToWishlist(product); }}
                      >
                        <FaHeart />
                      </div>
                      <Link to={`/pages/user/product/${product._id}`} className="icon-btn" data-label="Quick View"><FaEye /></Link>
                    </div>
                  </div>

                  <div className="product-details">
                    <Link to={`/pages/user/product/${product._id}`}><h3 className="product-name">{product.title}</h3></Link>
                    <div className="product-price">
                      {product.comparePrice > product.price && (
                        <>
                          <span className="old-price">₹{product.comparePrice}</span>
                          <span className="new-price">₹{product.price}</span>
                          <span className="off-label-listing" style={{ color: '#ff3e6c', marginLeft: '5px', fontSize: '0.85rem', fontWeight: 600 }}> (₹{product.comparePrice - product.price} OFF)</span>
                        </>
                      )}
                      {product.comparePrice <= product.price && <span className="new-price">₹{product.price}</span>}
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                      <div className="product-sizes">
                        {product.sizes
                          .filter(sz => sz && sz.trim() !== '')
                          .map((sz, i) => (
                            <div key={i} className="size-box">{sz}</div>
                          ))}
                      </div>
                    )}

                    <Link to={`/pages/user/product/${product._id}`} style={{ textDecoration: 'none', width: '100%' }}>
                      <button className="select-options-btn" style={{ pointerEvents: 'none' }}>
                        <FaShoppingCart /> Select Options
                      </button>
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="pagination">
            <div className="page-arrow"><FaChevronLeft /></div>
            <div className="page-num active">1</div>
            <div className="page-num">2</div>
            <div className="page-arrow"><FaChevronRight /></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
