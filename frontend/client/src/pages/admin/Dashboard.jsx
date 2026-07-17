import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiDollarSign, FiActivity, FiMessageSquare, FiGrid, FiPackage } from 'react-icons/fi';
import axios from 'axios';
import "../../css/adminDashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats');
        setStatsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="admin-loading">Loading Dashboard Metrics...</div>;

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${statsData?.totalRevenue?.toLocaleString() || 0}`,
      icon: <FiDollarSign />,
      colorClass: 'blue-bg'
    },
    {
      title: 'Total Orders',
      value: statsData?.totalOrders || 0,
      icon: <FiShoppingBag />,
      colorClass: 'green-bg'
    },
    {
      title: 'Products',
      value: statsData?.totalProducts || 0,
      icon: <FiPackage />,
      colorClass: 'purple-bg'
    },
    {
      title: 'Categories',
      value: statsData?.totalCategories || 0,
      icon: <FiGrid />,
      colorClass: 'orange-bg'
    },
    {
      title: 'Messages',
      value: statsData?.totalQueries || 0,
      icon: <FiMessageSquare />,
      colorClass: 'blue-bg'
    },
    {
      title: 'Customers',
      value: statsData?.totalCustomers || 0,
      icon: <FiUsers />,
      colorClass: 'green-bg'
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.colorClass}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <div className="section-header">
          <h3>Recent Transactions</h3>
          <button className="view-all-btn" onClick={() => navigate('/admin/orders')}>View All</button>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {statsData?.recentTransactions?.length > 0 ? (
                statsData.recentTransactions.map((order) => (
                  <tr key={order._id}>
                    <td><strong>#{order.orderId}</strong></td>
                    <td>{order.user ? `${order.user.firstname} ${order.user.lastname}` : 'Guest User'}</td>
                    <td>{order.isPaid ? 'Paid' : 'Pending'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>₹{order.totalPrice.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${(order.status || (order.isDelivered ? 'Delivered' : 'Processing')).toLowerCase()}`}>
                        {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No recent transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
