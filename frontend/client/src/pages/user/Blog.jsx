import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import '../../css/blog.css';
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import PageBodyHeader from "../../components/PagebodyHeader";
import BlogSidebar from "../../components/BlogSidebar";

const Blog = () => {
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/blogs');
                setBlogs(res.data);
            } catch (error) {
                console.error("Error fetching blogs");
            }
            setLoading(false);
        };
        fetchBlogs();
    }, []);

    const filteredBlogs = categoryFilter
        ? blogs.filter(blog => blog.category.toUpperCase() === categoryFilter.toUpperCase())
        : blogs;

    return (
        <>
            <PageBodyHeader title={categoryFilter ? `Blog: ${categoryFilter}` : "Blog"} />
            <div className="blog-page-container">
                <BlogSidebar />

                {/* Main Content */}
                <main className="blog-main-content">
                    <div className="blog-grid">
                        {filteredBlogs.length > 0 ? (
                            filteredBlogs.map(blog => (
                                <article key={blog._id} className="blog-card">
                                    <div className="blog-card-img-wrapper">
                                        <img src={blog.image} alt={blog.title} className="blog-card-img" />
                                    </div>
                                    <div className="blog-meta">
                                        <span className="blog-meta-tag">{blog.category}</span>
                                        <span className="blog-author">by {blog.author}</span>
                                    </div>
                                    <h2 className="blog-card-title">{blog.title}</h2>
                                    <p className="blog-card-excerpt">{blog.excerpt}</p>
                                    <Link to={`/pages/user/blog/${blog._id}`}>
                                        <button className="read-more-btn">Read more</button>
                                    </Link>
                                </article>
                            ))
                        ) : (
                            <div className="no-blogs">
                                <h2>No blogs found for this category.</h2>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="blog-pagination">
                        <div className="pagination-item active">1</div>
                        <div className="pagination-item">2</div>
                        <div className="pagination-item"><HiOutlineArrowNarrowRight /></div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Blog;
