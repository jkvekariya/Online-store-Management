import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEye, FiUserX, FiUserCheck, FiTrash2, FiSearch, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiShoppingBag } from 'react-icons/fi';
import "../../css/admin.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load customers");
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId) => {
    setStatsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setSelectedUserDetails(response.data);
      setShowModal(true);
      setStatsLoading(false);
    } catch (error) {
      toast.error("Failed to fetch customer details");
      setStatsLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    if (window.confirm("Are you sure you want to change this customer's status?")) {
      try {
        const res = await axios.put(`http://localhost:5000/api/users/${userId}/status`);
        toast.success(res.data.message);
        fetchUsers();
        if (selectedUserDetails && selectedUserDetails.user._id === userId) {
          handleViewDetails(userId);
        }
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("DANGER: This will permanently delete this customer. Continue?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        toast.success("Customer deleted permanently");
        fetchUsers();
        if (showModal) setShowModal(false);
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm)
  );

  const UserDetailsModal = ({ data, onClose }) => {
    if (!data) return null;
    const { user, orders, addresses, stats } = data;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" style={{ maxWidth: '900px', width: '95%' }} onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="admin-avatar" style={{ width: '45px', height: '45px', fontSize: '1.2rem' }}>
                {user.firstname[0]}{user.lastname[0]}
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{user.firstname} {user.lastname}</h3>
                <small style={{ color: '#666' }}>Customer ID: #{user._id.substring(0, 8)}</small>
              </div>
            </div>
            <button className="close-modal-btn" onClick={onClose}>&times;</button>
          </div>

          <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            <div className="info-grid">
              <div className="info-section">
                <h3><FiUser /> Personal Information</h3>
                <div className="user-details">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.mobile}</p>
                  <p><strong>DOB:</strong> {user.dob || 'Not provided'}</p>
                  <p><strong>Gender:</strong> {user.gender || 'Not specified'}</p>
                  <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong>
                    <span className={`status-badge ${user.status === 'Active' ? 'status-success' : 'status-danger'}`} style={{ marginLeft: '10px' }}>
                      {user.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="info-section">
                <h3><FiMapPin /> Saved Addresses</h3>
                <div className="address-list-admin" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {addresses.length === 0 ? <p>No saved addresses found.</p> :
                    addresses.map(addr => (
                      <div key={addr._id} style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem', border: addr.isDefault ? '1px solid #6366f1' : '1px solid #eee' }}>
                        <strong>{addr.name} ({addr.type})</strong> {addr.isDefault && <small style={{ color: '#6366f1', marginLeft: '5px' }}>[Default]</small>}
                        <p style={{ margin: '4px 0 0' }}>{addr.address}, {addr.locality}</p>
                        <p style={{ margin: 0 }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p style={{ margin: 0 }}>Mob: {addr.mobile}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            <div className="info-section" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3><FiShoppingBag /> Order History</h3>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div className="mini-stat">
                    <small style={{ display: 'block', color: '#666' }}>Total Spent</small>
                    <strong style={{ fontSize: '1.1rem', color: '#03a685' }}>₹{stats.totalSpent.toLocaleString()}</strong>
                  </div>
                  <div className="mini-stat">
                    <small style={{ display: 'block', color: '#666' }}>Orders Count</small>
                    <strong style={{ fontSize: '1.1rem' }}>{stats.totalOrders}</strong>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table" style={{ minWidth: '100%' }}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center' }}>No orders placed yet.</td></tr> :
                      orders.map(order => (
                        <tr key={order._id}>
                          <td><strong>#{order.orderId}</strong></td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${(order.status || (order.isDelivered ? 'Delivered' : 'Processing')).toLowerCase()}`}>
                              {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>₹{order.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className={`btn-primary ${user.status === 'Active' ? 'status-danger' : 'status-success'}`} style={{ background: user.status === 'Active' ? '#fee2e2' : '#dcfce7', color: user.status === 'Active' ? '#dc2626' : '#166534', border: 'none' }} onClick={() => handleToggleStatus(user._id)}>
                {user.status === 'Active' ? <><FiUserX /> Block Customer</> : <><FiUserCheck /> Unblock Customer</>}
              </button>
              <button className="btn-secondary" style={{ color: '#dc2626' }} onClick={() => handleDeleteUser(user._id)}>
                <FiTrash2 /> Delete Account
              </button>
            </div>
            <button className="btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="admin-loading">Loading Customers...</div>;

  return (
    <div className="admin-content">
      <div className="admin-header-actions">
        <div>
          <h2>Customer Management</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Manage and monitor your customer base</p>
        </div>
        <div className="search-bar-admin" style={{ width: '300px' }}>
          <FiSearch />
          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showModal && <UserDetailsModal data={selectedUserDetails} onClose={() => setShowModal(false)} />}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Joined On</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No customers found matching your search.</td></tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td><span className="order-id-tag">#{user._id.substring(0, 8)}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="admin-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                        {user.firstname[0]}{user.lastname[0]}
                      </div>
                      <strong>{user.firstname} {user.lastname}</strong>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiMail size={12} /> {user.email}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiPhone size={12} /> {user.mobile}</div>
                    </div>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${user.status === 'Active' ? 'status-success' : 'status-danger'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons" style={{ justifyContent: 'center' }}>
                      <button className="action-btn view" title="View Customer Details" onClick={() => handleViewDetails(user._id)}>
                        <FiEye />
                      </button>
                      <button
                        className={`action-btn ${user.status === 'Active' ? 'block' : 'unblock'}`}
                        title={user.status === 'Active' ? "Block Customer" : "Unblock Customer"}
                        onClick={() => handleToggleStatus(user._id)}
                      >
                        {user.status === 'Active' ? <FiUserX /> : <FiUserCheck />}
                      </button>
                      <button className="action-btn delete" title="Delete Customer" onClick={() => handleDeleteUser(user._id)}>
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

export default Users;
