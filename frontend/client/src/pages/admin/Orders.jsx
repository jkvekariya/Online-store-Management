import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FiEye, FiCheckCircle, FiTruck, FiUser, FiPackage, FiSearch } from 'react-icons/fi';
import '../../css/adminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.firstname + ' ' + order.user?.lastname).toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'DELIVERED') return matchesSearch && (order.status === 'Delivered' || order.isDelivered);
    if (filterStatus === 'PROCESSING') return matchesSearch && (order.status === 'Processing' || (!order.isDelivered && !order.status));
    return matchesSearch;
  });

  const AdminOrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="modal-overlay invoice-modal-overlay" onClick={onClose}>
        <div className="order-modal detail-modal-premium" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="header-title-area">
              <h2>Order Management Detail</h2>
              <span className="order-id-tag">#{order.orderId}</span>
            </div>
            <div className="header-actions">
              <button className="close-modal-btn" onClick={onClose}>&times;</button>
            </div>
          </div>

          <div className="modal-body printable-area">
            <div className="status-banner">
              <div className={`banner-item ${order.isPaid ? 'success' : 'pending'}`}>
                <span className="dot"></span>
                <strong>Payment:</strong> {order.isPaid ? 'Paid' : 'Pending'}
              </div>
              <div className={`banner-item ${order.isDelivered ? 'success' : 'info'}`}>
                <span className="dot"></span>
                <strong>Fulfillment:</strong> {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
              </div>
            </div>

            <div className="info-grid">
              <div className="info-section">
                <h3><FiUser /> Customer Information</h3>
                <div className="user-details">
                  <p><strong>Name:</strong> {order.user ? `${order.user.firstname} ${order.user.lastname}` : 'Guest User'}</p>
                  <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
                  <p><strong>Mobile:</strong> {order.shippingAddress?.mobile || 'N/A'}</p>
                </div>
              </div>
              <div className="info-section">
                <h3><FiTruck /> Shipping Address</h3>
                <div className="address-details">
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.locality ? `${order.shippingAddress.locality}, ` : ''}{order.shippingAddress?.city}</p>
                  <p>{order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                  <p><strong>Method:</strong> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>
              </div>
            </div>

            <div className="info-section products-section">
              <h3><FiPackage /> Products Ordered</h3>
              <div className="table-responsive">
                <table className="modal-products-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>Product</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="product-item-detail">
                            <img src={item.image} alt={item.title} />
                            <div className="pi-text">
                              <span className="pi-title">{item.title}</span>
                              <span className="pi-sku">SKU: {item.product?.substring(0, 8)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-center"><span className="size-pill-invoice">{(!item.size || item.size === 'N/A') ? 'M' : item.size}</span></td>
                        <td>₹{item.price.toLocaleString()}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td style={{ textAlign: 'right' }} className="fw-700">₹{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{(order.totalPrice * 0.95).toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Tax (GST 5%)</span>
                <span>₹{(order.totalPrice * 0.05).toLocaleString()}</span>
              </div>
              <div className="summary-row total-row-final">
                <span>Grand Total</span>
                <span>₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="admin-loading">Loading Management Console...</div>;

  return (
    <div className="admin-orders-container">
      <ToastContainer />
      {showModal && <AdminOrderDetailModal order={selectedOrder} onClose={() => setShowModal(false)} />}

      <div className="admin-header-flex">
        <div className="header-left">
          <h1>Order Management</h1>
          <p>Track and manage all customer purchases</p>
        </div>
        <div className="header-stats">
          <div className="stat-box">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{orders.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">New Orders</span>
            <span className="stat-value">{orders.filter(o => o.status === 'Processing' || (!o.status && !o.isDelivered)).length}</span>
          </div>
        </div>
      </div>

      <div className="admin-controls-card">
        <div className="search-bar-admin">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button className={filterStatus === 'ALL' ? 'active' : ''} onClick={() => setFilterStatus('ALL')}>All</button>
          <button className={filterStatus === 'PROCESSING' ? 'active' : ''} onClick={() => setFilterStatus('PROCESSING')}>Processing</button>
          <button className={filterStatus === 'DELIVERED' ? 'active' : ''} onClick={() => setFilterStatus('DELIVERED')}>Delivered</button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>PRODUCTS</th>
              <th>TOTAL</th>
              <th>PAYMENT</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="order-id-cell">
                  <strong>#{order.orderId}</strong>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="customer-cell">
                  <div className="customer-info">
                    <strong>{order.user ? `${order.user.firstname} ${order.user.lastname}` : 'Guest User'}</strong>
                    <span>{order.user?.email}</span>
                    <small>{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</small>
                  </div>
                </td>
                <td className="products-cell">
                  <div className="product-summary">
                    <FiPackage /> <span>{order.items.length} Item(s)</span>
                    <div className="item-avatars">
                      {order.items.slice(0, 3).map((item, i) => (
                        <img key={i} src={item.image} alt="p" title={item.title} />
                      ))}
                      {order.items.length > 3 && <span className="more-items">+{order.items.length - 3}</span>}
                    </div>
                  </div>
                </td>
                <td className="total-cell">
                  <strong>₹{order.totalPrice.toFixed(2)}</strong>
                </td>
                <td>
                  <span className={`payment-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                    {order.paymentMethod === 'COD' ? 'Cash' : 'Online'} - {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${(order.status || (order.isDelivered ? 'Delivered' : 'Processing')).toLowerCase()}`}>
                    {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                  </span>
                </td>
                <td className="actions-cell">
                  <div className="action-buttons-group">
                    <button
                      className="view-order-btn-premium"
                      title="View Order Details"
                      onClick={() => openOrderDetail(order)}
                    >
                      <FiEye /> <span>View</span>
                    </button>
                    <div className="status-update-dropdown">
                      <select
                        className="admin-status-select"
                        value={order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="empty-table-msg">No orders found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
