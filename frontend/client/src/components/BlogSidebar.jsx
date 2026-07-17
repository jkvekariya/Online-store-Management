import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";
import { FiBox, FiDollarSign, FiHeadphones, FiCreditCard } from "react-icons/fi";
import { blogs, categories } from '../data/blogData';

const BlogSidebar = () => {
    return (
        <aside className="blog-sidebar">
            <div className="sidebar-section">
                <h2>Categories</h2>
                <ul className="category-list">
                    <li>
                        <Link to="/pages/user/blog" style={{ textDecoration: 'none', color: 'inherit' }}>All Categories</Link>
                    </li>
                    {categories.map((cat, index) => (
                        <li key={index}>
                            <Link
                                to={`/pages/user/blog?category=${cat.toUpperCase()}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                {cat}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="sidebar-section">
                <h2>Recent Blogs</h2>
                {blogs.slice(0, 3).map(blog => (
                    <Link
                        to={`/pages/user/blog/blog-${blog.id}`}
                        key={blog.id}
                        className="recent-blog-item"
                        style={{ textDecoration: 'none' }}
                    >
                        <img src={blog.image} alt={blog.title} className="recent-blog-img" />
                        <div className="recent-blog-info">
                            <span className="recent-blog-tag">{blog.category}</span>
                            <h3 className="recent-blog-title">{blog.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="sidebar-section">
                <h2>Shipping & Delivery</h2>
                <div className="shipping-item">
                    <div className="shipping-icon"><FiBox /></div>
                    <div className="shipping-text">
                        <h4>Free Shipping</h4>
                        <p>Free Shipping for orders over Rs.899</p>
                    </div>
                </div>
                <div className="shipping-item">
                    <div className="shipping-icon"><FiDollarSign /></div>
                    <div className="shipping-text">
                        <h4>Money Guarantee</h4>
                        <p>Within 30 days for an exchange</p>
                    </div>
                </div>
                <div className="shipping-item">
                    <div className="shipping-icon"><FiHeadphones /></div>
                    <div className="shipping-text">
                        <h4>Online Support</h4>
                        <p>24/7 Online Support</p>
                    </div>
                </div>
                <div className="shipping-item">
                    <div className="shipping-icon"><FiCreditCard /></div>
                    <div className="shipping-text">
                        <h4>Flexible Payment</h4>
                        <p>Pay with Multiple Credit Cards</p>
                    </div>
                </div>
            </div>

            <div className="sidebar-section">
                <h2>Socials</h2>
                <div className="social-icons-row">
                    <div className="social-circle"><FaFacebookF /></div>
                    <div className="social-circle"><FaInstagram /></div>
                    <div className="social-circle"><FaXTwitter /></div>
                    <div className="social-circle"><FaTiktok /></div>
                    <div className="social-circle"><FaYoutube /></div>
                </div>
            </div>
        </aside>
    );
};

export default BlogSidebar;
