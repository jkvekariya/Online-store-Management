import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import "../../css/admin.css";

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    comparePrice: '',
    stockQuantity: '',
    inStock: true,
    image: '',
    category: '',
    vendor: '',
    tags: '',
    sizes: [],
    isSale: false,
    images: '',
    productType: '',
    viewCount: 0,
    soldCount: 0
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11'];

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();

    if (isEditMode) {
      // Fetch existing product data
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${id}`);
          const data = response.data;
          setFormData({
            ...data,
            tags: data.tags ? data.tags.join(', ') : '',
            sizes: data.sizes || [],
            isSale: data.isSale || false,
            images: data.images ? data.images.join(', ') : '',
            productType: data.productType || '',
            viewCount: data.viewCount || 0,
            soldCount: data.soldCount || 0
          });
        } catch (error) {
          toast.error("Failed to fetch product details");
          navigate('/admin/products');
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeChange = (size) => {
    setFormData(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for API
    const { _id, __v, createdAt, updatedAt, ...cleanFormData } = formData;

    const payload = {
      ...cleanFormData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      images: formData.images.split(',').map(url => url.trim()).filter(url => url !== ''),
      sizes: formData.sizes.filter(size => availableSizes.includes(size)),
      price: Number(formData.price),
      comparePrice: Number(formData.comparePrice),
      stockQuantity: Number(formData.stockQuantity),
      viewCount: Number(formData.viewCount),
      soldCount: Number(formData.soldCount)
    };

    // ... rest of submit logic


    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/products/${id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await axios.post('http://localhost:5000/api/products', payload);
        toast.success("Product created successfully");
      }
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      toast.error("Operation failed. Please check inputs.");
    }
  };

  return (
    <div className="admin-content">
      <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Product Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (Rs.)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Compare Price (Rs.)</label>
            <input
              type="number"
              name="comparePrice"
              value={formData.comparePrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
              />
              In Stock
            </label>
            <label style={{ marginLeft: '20px' }}>
              <input
                type="checkbox"
                name="isSale"
                checked={formData.isSale}
                onChange={handleChange}
              />
              On Sale
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Available Sizes</label>
          <div className="size-selection" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {availableSizes.map(size => (
              <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                {size}
              </label>
            ))}
          </div>
        </div>


        <div className="form-group">
          <label>Main Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            placeholder="http://example.com/image.jpg"
          />
          {formData.image && (
            <div className="image-preview" style={{ marginTop: '10px' }}>
              <img src={formData.image} alt="Preview" style={{ maxHeight: '100px' }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Additional Images (comma separated URLs)</label>
          <textarea
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="http://example.com/1.jpg, http://example.com/2.jpg"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Vendor</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Product Type</label>
            <input
              type="text"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              placeholder="e.g. Amazon, Top"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>View Count (Fake Stats)</label>
            <input
              type="number"
              name="viewCount"
              value={formData.viewCount}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Sold Count (Fake Stats)</label>
            <input
              type="number"
              name="soldCount"
              value={formData.soldCount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="summer, new, sale"
          />
        </div>

        <button type="submit" className="btn-primary">
          {isEditMode ? 'Update Product' : 'Create Product'}
        </button>

      </form>
    </div>
  );
};

export default AddProduct;
