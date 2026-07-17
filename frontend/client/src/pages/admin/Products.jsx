import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import "../../css/admin.css"; // Ensure you have basic admin css or reuse existing

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        toast.success("Product deleted successfully");
        fetchProducts(); // Refresh list
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  if (loading) return <div className="admin-content">Loading...</div>;

  return (
    <div className="admin-content">
      <div className="admin-header-actions">
        <h2>Products</h2>
        <Link to="/admin/products/add" className="btn-primary">
          <FiPlus /> Add Product
        </Link>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>No products found.</td></tr>
            ) : (
              products.map(product => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="admin-product-thumb"
                      style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', background: '#f8f9fa' }}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>Rs. {product.price}</td>
                  <td>{product.stockQuantity}</td>
                  <td>
                    <span className={`status-badge ${product.inStock ? 'status-success' : 'status-danger'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/products/edit/${product._id}`} className="action-btn edit" title="Edit">
                        <FiEdit />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="action-btn delete" title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
