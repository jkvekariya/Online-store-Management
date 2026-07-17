import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiImage } from 'react-icons/fi';
import "../../css/admin.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: '', image: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch categories");
      setLoading(false);
    }
  };

  const handleOpenModal = (category = { name: '', image: '' }) => {
    setCurrentCategory(category);
    setIsEditMode(!!category._id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory({ name: '', image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/categories/${currentCategory._id}`, currentCategory);
        toast.success("Category updated successfully");
      } else {
        await axios.post('http://localhost:5000/api/categories', currentCategory);
        toast.success("Category added successfully");
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  if (loading) return <div className="admin-content">Loading...</div>;

  return (
    <div className="admin-content">
      <div className="admin-header">
        <h2>Category Management</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="category-grid-admin" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {categories.map(cat => (
          <div key={cat._id} className="admin-card category-card-admin" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #eee', position: 'relative' }}>
            <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '150px', objectFit: 'contain', borderRadius: '4px', background: '#f8f9fa' }} />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>{cat.name}</h3>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>{cat.count} products</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleOpenModal(cat)} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer' }}><FiEdit2 /></button>
                <button onClick={() => handleDelete(cat._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditMode ? 'Edit Category' : 'Add New Category'}</h3>
              <button className="close-drawer-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    value={currentCategory.name}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                    required
                    placeholder="e.g. Topwear, Bottomwear"
                  />
                  <small className="form-hint">Grouping name for products</small>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={currentCategory.image}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, image: e.target.value })}
                    required
                    placeholder="https://example.com/banner.jpg"
                  />
                  <small className="form-hint">Lifestyle banner images look best</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">
                  {isEditMode ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
