import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FiUser, FiTruck, FiPackage, FiDownload, FiCheckCircle, FiHome, FiMapPin } from 'react-icons/fi';
import PageBodyHeader from '../../components/PagebodyHeader';
import '../../css/orders.css';
import '../../css/adminOrders.css'; // Reuse invoice styles

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('osm_user'));

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/myorders?userId=${user.id || user._id}`);
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders", error);
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  const openInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  const openTracking = (order) => {
    setSelectedOrder(order);
    setShowTracking(true);
  };

  const TrackingModal = ({ order, onClose }) => {
    if (!order) return null;

    const orderDate = new Date(order.createdAt);
    const getStepDate = (days) => {
      const d = new Date(orderDate);
      d.setDate(d.getDate() + days);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    const expectedArrival = `${getStepDate(4)} - ${getStepDate(6)}`;

    // Logic to determine active step
    const status = (order.status || (order.isDelivered ? 'Delivered' : 'Processing')).toUpperCase();
    let activeLevel = 1; // Default: Processed
    if (status === 'SHIPPED') activeLevel = 2;
    if (['EN ROUTE', 'DISPATCHED'].includes(status)) activeLevel = 3;
    if (status === 'DELIVERED') activeLevel = 4;

    const steps = [
      { id: 1, label: 'Order Processed', icon: <FiCheckCircle />, date: getStepDate(0) },
      { id: 2, label: 'Order Shipped', icon: <FiPackage />, date: getStepDate(1) },
      { id: 3, label: 'Order En Route', icon: <FiTruck />, date: getStepDate(2) },
      { id: 4, label: 'Order Arrived', icon: <FiHome />, date: getStepDate(5) },
    ];

    return (
      <div className="modal-overlay tracking-modal-overlay" onClick={onClose}>
        <div className="tracking-modal-content" onClick={e => e.stopPropagation()}>
          <button className="close-tracking" onClick={onClose}>&times;</button>
          <div className="tracking-header">
            <div className="order-id-section" style={{ width: '100%', marginBottom: '20px' }}>
              <h3>ORDER <span className="blue-id">#{order.orderId}</span></h3>
            </div>
          </div>

          <div className="tracking-middle-layout">
            <div className="tracking-progress-container vertical">
              <div className="progress-track vertical" style={{ position: 'relative' }}>
                <div className="vertical-track-background"></div>
                <div className="vertical-track-fill" style={{ height: `${((activeLevel - 1) / 3) * 100}%` }}></div>
                {steps.map((step) => (
                  <div key={step.id} className="step-row-vertical">
                    <div className={`step-node ${activeLevel >= step.id ? 'active' : ''}`}>
                      <div className="node-circle">
                        {activeLevel >= step.id ? <FiCheckCircle /> : null}
                      </div>
                    </div>
                    <div className={`step-item ${activeLevel >= step.id ? 'active' : ''}`}>
                      <div className="step-icon">{step.icon}</div>
                      <div className="step-text">
                        <p className="step-label">{step.label}</p>
                        {activeLevel >= step.id && <p className="step-date">{step.date}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="expected-arrival arrival-sidebox">
              <p className="arrival-label">Expected Arrival</p>
              <p className="arrival-range">{expectedArrival}</p>
              <p className="arrival-date-exact">{getStepDate(5)}</p>
            </div>
          </div>

          <div className="tracking-details-grid">
            <div className="dispatch-address">
              <h4>Dispatched Address</h4>
              <p><strong>{order.shippingAddress?.name}</strong></p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
              <p>Ph: {order.shippingAddress?.mobile}</p>
            </div>
            <div className="tracking-products">
              <h4>Product Details ({order.items.length})</h4>
              <div className="t-products-list">
                {order.items.map((item, idx) => (
                  <div key={idx} className="t-product-item">
                    <img src={item.image} alt="" />
                    <div className="t-p-info">
                      <p className="t-p-name">{item.title}</p>
                      <p className="t-p-meta">Qty: {item.quantity} | Size: {item.size || 'M'}</p>
                    </div>
                    <p className="t-p-price">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="t-total-row">
                <span>Total Amount</span>
                <span>₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InvoiceModal = ({ order, onClose }) => {
    if (!order) return null;

    const handlePrint = () => {
      window.print();
    };

    return (
      <div className="modal-overlay invoice-modal-overlay" onClick={onClose}>
        <div className="order-modal detail-modal-premium invoice-container" onClick={e => e.stopPropagation()}>
          <div className="modal-header no-print">
            <div className="header-title-area">
              <h2>Invoice Preview</h2>
              <span className="order-id-tag">#{order.orderId}</span>
            </div>
            <div className="header-actions">
              <button className="print-btn invoice-print-trigger" onClick={handlePrint}>
                <FiDownload /> Download/Print
              </button>
              <button className="close-modal-btn" onClick={onClose}>&times;</button>
            </div>
          </div>

          <div className="modal-body printable-area invoice-body">
            <div className="invoice-header-branding">
              <div className="branding-left">
                <h1 className="company-logo">clothify</h1>
                <p className="tagline">Premium Fashion Destination</p>
                <div className="company-info-text">
                  <p>12, crystal plaza, surat</p>
                  <p>Gujarat, 395010, India</p>
                  <p><strong>GSTIN:</strong> 07AABCD1234E1Z5</p>
                </div>
              </div>
              <div className="branding-right">
                <div className="invoice-meta-box">
                  <h1>INVOICE</h1>
                  <p><strong>Order ID:</strong> #{order.orderId}</p>
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}</p>
                </div>
              </div>
            </div>

            <div className="info-grid invoice-info-grid">
              <div className="info-section client-card">
                <h3><FiUser /> Billed To</h3>
                <div className="card-content-invoice">
                  <p className="client-name">{order.shippingAddress?.name || (user ? `${user.firstname} ${user.lastname}` : 'Valued Customer')}</p>
                  <p>{user?.email || 'N/A'}</p>
                  <p>Mob: {order.shippingAddress?.mobile || 'N/A'}</p>
                </div>
              </div>
              <div className="info-section shipping-card">
                <h3><FiTruck /> Shipped To</h3>
                <div className="card-content-invoice">
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.locality ? `${order.shippingAddress.locality}, ` : ''}{order.shippingAddress?.city}</p>
                  <p>{order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                  <div className="payment-method-overlay">
                    <strong>Payment:</strong> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                  </div>
                </div>
              </div>
            </div>

            <div className="info-section products-section invoice-table-section">
              <h3><FiPackage /> Itemized Description</h3>
              <div className="table-responsive">
                <table className="modal-products-table invoice-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>Item Details</th>
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
                            <img src={item.image} alt={item.title} className="no-print" />
                            <div className="pi-text">
                              <span className="pi-title">{item.title}</span>
                              <span className="pi-sku no-print">SKU: {item.product?.substring(0, 8)}</span>
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

            <div className="invoice-footer-container">
              <div className="invoice-notes no-print">
                <h4>Terms & Notes</h4>
                <p>1. Please keep this invoice for your 7-day return policy.</p>
                <p>2. This is a computer generated invoice.</p>
              </div>
              <div className="modal-footer-summary invoice-totals-premium">
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

            <div className="printable-footer">
              <p>Thank you for choosing clothify!</p>
              <small>www.clothify.com | Support: +91 99999 88888</small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="orders-loading">Loading your orders...</div>;
  }

  return (
    <div className="orders-page-container">
      <ToastContainer />
      <PageBodyHeader title="My Orders" />
      {showInvoice && <InvoiceModal order={selectedOrder} onClose={() => setShowInvoice(false)} />}
      {showTracking && <TrackingModal order={selectedOrder} onClose={() => setShowTracking(false)} />}

      <div className="orders-content">
        {orders.length === 0 ? (
          <div className="no-orders">
            <h3>You haven't placed any orders yet.</h3>
            <button onClick={() => navigate('/pages/user/products')} className="shop-now-btn">Shop Now</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info-top">
                    <span className="order-date">Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="order-id-label">Order ID: #{order.orderId}</span>
                  </div>
                  <div className={`order-status ${(order.status || (order.isDelivered ? 'Delivered' : 'Processing')).toLowerCase()}`}>
                    {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          <img src={item.image} alt={item.title} />
                        </div>
                        <div className="item-details">
                          <h4>{item.title}</h4>
                          <p className="item-meta">Size: {(!item.size || item.size === 'N/A') ? 'M' : item.size} | Qty: {item.quantity}</p>
                          <p className="item-price">₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-address">
                      <h5>Delivery Address</h5>
                      <p><strong>{order.shippingAddress.name}</strong></p>
                      <p>{order.shippingAddress.address}, {order.shippingAddress.locality}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                      <p>Phone: {order.shippingAddress.mobile}</p>
                    </div>

                    <div className="order-summary-box">
                      <div className="summary-row">
                        <span>Payment Method:</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div className="summary-row">
                        <span>Payment Status:</span>
                        <span className={order.isPaid ? 'paid' : 'unpaid'}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      <div className="summary-row total">
                        <span>Total Amount:</span>
                        <span>₹{order.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="order-actions-user">
                        <button className="view-details-btn" onClick={() => openTracking(order)}>Track Order</button>
                        {order.isPaid && (
                          <button className="view-invoice-btn" onClick={() => openInvoice(order)}>
                            <FiDownload /> View Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
