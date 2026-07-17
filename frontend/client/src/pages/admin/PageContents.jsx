import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSave, FiEdit2, FiPlus, FiTrash2, FiLayers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import "../../css/adminPageContents.css";

const PageContents = () => {
    const [activeTab, setActiveTab] = useState('about');
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [isBlogMode, setIsBlogMode] = useState(false);

    // Blog Modal State
    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    const [editingBlogId, setEditingBlogId] = useState(null);
    const [blogForm, setBlogForm] = useState({
        title: '', category: '', author: '', date: '', excerpt: '', content: '', image: '', tags: ''
    });
    useEffect(() => {
        if (activeTab === 'blogs') {
            setIsBlogMode(true);
            setPageData(null);
            fetchBlogs();
        } else {
            setIsBlogMode(false);
            setPageData(null);
            fetchPageContent(activeTab);
        }
    }, [activeTab]);

    const fetchPageContent = async (page) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/page-content/${page}`);
            setPageData(res.data);
        } catch (error) {
            console.error("Error fetching page content", error);
            setPageData({ page, title: '', sections: {} });
        }
        setLoading(false);
    };

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/blogs');
            setBlogs(res.data);
        } catch (error) {
            console.error("Error fetching blogs", error);
        }
        setLoading(false);
    };

    const handlePageUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`http://localhost:5000/api/page-content/${activeTab}`, {
                title: pageData.title,
                sections: pageData.sections
            });
            setPageData(res.data);
            toast.success(`${res.data.title} updated successfully!`);
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Failed to update page content");
        }
        setLoading(false);
    };

    const handleBlogChange = (e) => {
        setBlogForm({ ...blogForm, [e.target.name]: e.target.value });
    };

    const handleOpenBlogModal = (blog = null) => {
        if (blog) {
            setEditingBlogId(blog._id);
            setBlogForm({
                title: blog.title || '',
                category: blog.category || '',
                author: blog.author || '',
                date: blog.date || '',
                excerpt: blog.excerpt || '',
                content: blog.content || '',
                image: blog.image || '',
                tags: blog.tags ? blog.tags.join(', ') : ''
            });
        } else {
            setEditingBlogId(null);
            setBlogForm({
                title: '', category: '', author: '', date: '', excerpt: '', content: '', image: '', tags: ''
            });
        }
        setIsBlogModalOpen(true);
    };

    const handleCloseBlogModal = () => {
        setIsBlogModalOpen(false);
        setEditingBlogId(null);
    };

    const handleSaveBlog = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...blogForm,
                tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            if (editingBlogId) {
                await axios.put(`http://localhost:5000/api/blogs/${editingBlogId}`, payload);
                toast.success('Blog updated successfully');
            } else {
                await axios.post('http://localhost:5000/api/blogs', payload);
                toast.success('Blog created successfully');
            }
            fetchBlogs();
            handleCloseBlogModal();
        } catch (error) {
            console.error("Error saving blog:", error);
            toast.error(error.response?.data?.message || 'Failed to save blog');
        }
        setLoading(false);
    };

    const handleDeleteBlog = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;
        setLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/blogs/${id}`);
            toast.success('Blog deleted successfully');
            fetchBlogs();
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error(error.response?.data?.message || 'Failed to delete blog');
        }
        setLoading(false);
    };

    const updateSection = (path, value) => {
        setPageData(prev => {
            const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
            const keys = path.split('.');
            let current = newData.sections;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    if (loading && !pageData && activeTab !== 'blogs') return <div className="admin-loading">Loading Content...</div>;

    return (
        <div className="admin-cms-container">
            <header className="cms-header">
                <h1><FiLayers /> Page Content Management</h1>
                <div className="tab-navigation">
                    {['about', 'privacy', 'terms', 'faq', 'contact', 'blogs'].map(tab => (
                        <button
                            key={tab}
                            className={activeTab === tab ? 'active' : ''}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            <div className="cms-content-area">
                {!isBlogMode ? (
                    <form className="cms-form" onSubmit={handlePageUpdate}>
                        <div className="form-header">
                            <div className="title-edit-main">
                                <label>Page Display Title</label>
                                <input
                                    className="main-title-input"
                                    value={pageData?.title || ''}
                                    onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="save-btn" disabled={loading}>
                                <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                        {activeTab === 'about' && pageData && (
                            <div className="sections-grid">
                                <div className="form-section">
                                    <h3>Hero Section</h3>
                                    <div className="input-group">
                                        <label>Title</label>
                                        <input
                                            value={pageData.sections?.hero?.title || ''}
                                            onChange={(e) => updateSection('hero.title', e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Description</label>
                                        <textarea
                                            rows="4"
                                            value={pageData.sections?.hero?.description || ''}
                                            onChange={(e) => updateSection('hero.description', e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Quote</label>
                                        <input
                                            value={pageData.sections?.hero?.quote || ''}
                                            onChange={(e) => updateSection('hero.quote', e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Mission Statement</label>
                                        <textarea
                                            rows="3"
                                            value={pageData.sections?.hero?.mission || ''}
                                            onChange={(e) => updateSection('hero.mission', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>Explore Section</h3>
                                    <div className="input-group">
                                        <label>Title</label>
                                        <input
                                            value={pageData.sections?.explore?.title || ''}
                                            onChange={(e) => updateSection('explore.title', e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Description</label>
                                        <textarea
                                            rows="4"
                                            value={pageData.sections?.explore?.description || ''}
                                            onChange={(e) => updateSection('explore.description', e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Quote</label>
                                        <textarea
                                            rows="3"
                                            value={pageData.sections?.explore?.quote || ''}
                                            onChange={(e) => updateSection('explore.quote', e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Paragraph 1</label>
                                        <textarea
                                            rows="4"
                                            value={pageData.sections?.explore?.content1 || ''}
                                            onChange={(e) => updateSection('explore.content1', e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Paragraph 2</label>
                                        <textarea
                                            rows="4"
                                            value={pageData.sections?.explore?.content2 || ''}
                                            onChange={(e) => updateSection('explore.content2', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'faq' && pageData && (
                            <div className="faq-edit-section">
                                <div className="form-section full-width">
                                    <div className="input-group">
                                        <label>FAQ Introduction</label>
                                        <textarea
                                            rows="4"
                                            value={pageData.sections.introduction}
                                            onChange={(e) => updateSection('introduction', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="faq-list-edit">
                                    <h3>Manage FAQ Items</h3>
                                    {pageData.sections.faqs?.map((faq, index) => (
                                        <div key={index} className="faq-edit-item">
                                            <div className="input-group">
                                                <label>Question {index + 1}</label>
                                                <input
                                                    value={faq.question}
                                                    onChange={(e) => {
                                                        const newFaqs = [...pageData.sections.faqs];
                                                        newFaqs[index].question = e.target.value;
                                                        updateSection('faqs', newFaqs);
                                                    }}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Answer {index + 1}</label>
                                                <textarea
                                                    rows="3"
                                                    value={faq.answer}
                                                    onChange={(e) => {
                                                        const newFaqs = [...pageData.sections.faqs];
                                                        newFaqs[index].answer = e.target.value;
                                                        updateSection('faqs', newFaqs);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(activeTab === 'privacy' || activeTab === 'terms') && pageData && (
                            <div className="form-section full-width">
                                <div className="input-group">
                                    <label>Effective Date</label>
                                    <input
                                        value={pageData.sections.effectiveDate}
                                        onChange={(e) => updateSection('effectiveDate', e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Introduction</label>
                                    <textarea
                                        rows="6"
                                        value={pageData.sections.introduction}
                                        onChange={(e) => updateSection('introduction', e.target.value)}
                                    />
                                </div>
                                <p className="hint">Note: More complex sections will be editable in a future version or can be managed via direct JSON in DB for now.</p>
                            </div>
                        )}
                        {activeTab === 'contact' && pageData && (
                            <div className="form-section full-width">
                                <div className="input-group">
                                    <label>Contact Number</label>
                                    <input
                                        value={pageData.sections?.contactNumber || ''}
                                        onChange={(e) => updateSection('contactNumber', e.target.value)}
                                        placeholder="e.g., +0123 234 9568"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input
                                        value={pageData.sections?.email || ''}
                                        onChange={(e) => updateSection('email', e.target.value)}
                                        placeholder="e.g., support@clothify.com"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Address</label>
                                    <textarea
                                        rows="4"
                                        value={pageData.sections?.address || ''}
                                        onChange={(e) => updateSection('address', e.target.value)}
                                        placeholder="e.g., 12, crystal plaza, surat"
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                ) : (
                    <div className="blogs-management">
                        <div className="blogs-header">
                            <h2>Manage Blogs</h2>
                            <button className="add-blog-btn" onClick={() => handleOpenBlogModal()}><FiPlus /> Create New Blog</button>
                        </div>
                        <div className="blogs-list">
                            {blogs.map(blog => (
                                <div key={blog._id} className="blog-item">
                                    <img src={blog.image} alt={blog.title} />
                                    <div className="blog-info">
                                        <h3>{blog.title}</h3>
                                        <p>{blog.category} | by {blog.author}</p>
                                    </div>
                                    <div className="action-buttons">
                                        <button className="action-btn edit" onClick={() => handleOpenBlogModal(blog)}><FiEdit2 /></button>
                                        <button className="action-btn delete" onClick={() => handleDeleteBlog(blog._id)}><FiTrash2 /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isBlogModalOpen && (
                            <div className="blog-modal-overlay">
                                <form className="blog-modal-content" onSubmit={handleSaveBlog}>
                                    <h2>{editingBlogId ? 'Edit Blog' : 'Create New Blog'}</h2>
                                    <div className="input-group">
                                        <label>Title</label>
                                        <input name="title" value={blogForm.title} onChange={handleBlogChange} required />
                                    </div>
                                    <div className="sections-grid">
                                        <div className="input-group">
                                            <label>Category</label>
                                            <input name="category" value={blogForm.category} onChange={handleBlogChange} required />
                                        </div>
                                        <div className="input-group">
                                            <label>Author</label>
                                            <input name="author" value={blogForm.author} onChange={handleBlogChange} required />
                                        </div>
                                        <div className="input-group">
                                            <label>Date</label>
                                            <input name="date" value={blogForm.date} onChange={handleBlogChange} placeholder="e.g., January 16, 2025" required />
                                        </div>
                                        <div className="input-group">
                                            <label>Image URL</label>
                                            <input name="image" value={blogForm.image} onChange={handleBlogChange} placeholder="/photos/blog.jpg" required />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Excerpt (Short Description)</label>
                                        <textarea name="excerpt" value={blogForm.excerpt} onChange={handleBlogChange} rows="2" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Full Content</label>
                                        <textarea name="content" value={blogForm.content} onChange={handleBlogChange} rows="6" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Tags (Comma separated)</label>
                                        <input name="tags" value={blogForm.tags} onChange={handleBlogChange} placeholder="NEWS, SHIRTS, FASHION" />
                                    </div>
                                    <div className="modal-actions">
                                        <button type="button" className="cancel-btn" onClick={handleCloseBlogModal}>Cancel</button>
                                        <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Saving...' : 'Save Blog'}</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageContents;
