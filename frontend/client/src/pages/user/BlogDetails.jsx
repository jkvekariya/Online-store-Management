import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/blog.css';
import PageBodyHeader from "../../components/PagebodyHeader";
import BlogSidebar from "../../components/BlogSidebar";
import { FaFacebookF, FaXTwitter, FaPinterestP } from "react-icons/fa6";

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                // If ID starts with blog-, remove it (for backward compat if needed)
                const cleanId = id.replace('blog-', '');
                // Try fetching from database. Note: seed script might generate different IDs. 
                // In a real scenario, we should have consistent IDs. 
                // For now, I'll assume the list page provides the correct Mongo _id.
                const res = await axios.get(`http://localhost:5000/api/blogs/${cleanId}`);
                setBlog(res.data);
            } catch (error) {
                console.error("Error fetching blog details");
            }
            setLoading(false);
        };
        fetchBlog();
    }, [id]);

    if (loading) return <div className="loading">Loading Blog...</div>;

    if (!blog) {
        return (
            <>
                <PageBodyHeader title="Blog Not Found" />
                <div className="blog-page-container">
                    <BlogSidebar />
                    <main className="blog-main-content">
                        <h2>Blog post not found.</h2>
                    </main>
                </div>
            </>
        );
    }

    return (
        <>
            <PageBodyHeader title="Blog Details" />
            <div className="blog-page-container">
                <BlogSidebar />

                {/* Main Content */}
                <main className="blog-main-content">
                    <article className="blog-detail-view">
                        <div className="blog-detail-img-wrapper">
                            <img src={blog.image} alt={blog.title} className="blog-detail-img" />
                        </div>

                        <div className="blog-detail-meta">
                            <span className="author">by {blog.author}</span>
                            <span className="date">on {blog.date}</span>
                        </div>

                        <h1 className="blog-detail-title">{blog.title}</h1>

                        <div className="blog-detail-content">
                            {blog.content.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>

                        <div className="blog-detail-footer">
                            <div className="blog-tags">
                                <span className="tags-label">Tags</span>
                                {blog.tags && blog.tags.map((tag, index) => (
                                    <span key={index} className="tag-item">{tag}</span>
                                ))}
                            </div>

                            <div className="blog-share">
                                <span className="share-label"><FaXTwitter style={{ marginRight: '5px' }} /> Share</span>
                                <div className="share-icons">
                                    <div className="share-circle"><FaFacebookF /></div>
                                    <div className="share-circle"><FaXTwitter /></div>
                                    <div className="share-circle"><FaPinterestP /></div>
                                </div>
                            </div>
                        </div>
                    </article>
                </main>
            </div>
        </>
    );
};

export default BlogDetails;
