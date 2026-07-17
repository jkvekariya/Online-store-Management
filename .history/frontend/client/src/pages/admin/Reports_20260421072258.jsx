import React, { useState } from 'react';
import axios from 'axios';
import { FiTable, FiTrendingUp, FiUsers, FiFilter, FiDownload } from 'react-icons/fi';
import "../../css/adminReports.css";

const Reports = () => {
    const [activeTab, setActiveTab] = useState('sales');
    const [salesData, setSalesData] = useState({ totalOrders: 0, totalRevenue: 0, totalProductsSold: 0 });
    const [productData, setProductData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        from: '',
        to: ''
    });


    // Only fetch on tab change or when Apply Filter is clicked
    React.useEffect(() => {
        if (activeTab !== 'sales') fetchData();
    }, [activeTab]);

    const fetchData = async (customFilters) => {
        setLoading(true);
        try {
            if (activeTab === 'sales') {
                const f = customFilters || filters;
                const res = await axios.get(`http://localhost:5000/api/stats/reports/sales?from=${f.from}&to=${f.to}`);
                setSalesData(res.data);
            } else if (activeTab === 'product') {
                const res = await axios.get('http://localhost:5000/api/stats/reports/products');
                setProductData(res.data);
            } else if (activeTab === 'customer') {
                const res = await axios.get('http://localhost:5000/api/stats/reports/customers');
                setCustomerData(res.data);
            }
        } catch (error) {
            console.error("Error fetching report data", error);
        }
        setLoading(false);
    };


    // Prevent future dates and ensure from <= to
    const todayStr = new Date().toISOString().split('T')[0];
    const handleFilterChange = (e) => {
        let { name, value } = e.target;
        // Clamp to today if future
        if (value > todayStr) value = todayStr;
        // If changing 'from', ensure it is not after 'to'
        if (name === 'from' && value > filters.to) {
            setFilters(f => ({ ...f, from: value, to: value }));
        } else if (name === 'to' && value < filters.from) {
            setFilters(f => ({ ...f, from: value, to: value }));
        } else {
            setFilters(f => ({ ...f, [name]: value }));
        }
    };

    // Only fetch when button is clicked
    const handleApplyFilter = () => {
        fetchData();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    return (
        <div className="admin-reports-container">
            <header className="reports-header">
                <h1>Reports & Insights</h1>
                <div className="tab-navigation">
                    <button className={activeTab === 'sales' ? 'active' : ''} onClick={() => setActiveTab('sales')}>
                        <FiTrendingUp /> Sales Report
                    </button>
                    <button className={activeTab === 'product' ? 'active' : ''} onClick={() => setActiveTab('product')}>
                        <FiTable /> Product Report
                    </button>
                    <button className={activeTab === 'customer' ? 'active' : ''} onClick={() => setActiveTab('customer')}>
                        <FiUsers /> Customer Report
                    </button>
                </div>
            </header>

            <div className="report-content">
                {activeTab === 'sales' && (
                    <div className="sales-report-section">

                        <div className="filters-bar" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                            <div className="filter-group">
                                <label><FiFilter /> From:</label>
                                <input type="date" name="from" value={filters.from} max={todayStr} onChange={handleFilterChange} style={{ width: 170 }} />
                            </div>
                            <div className="filter-group">
                                <label><FiFilter /> To:</label>
                                <input type="date" name="to" value={filters.to} max={todayStr} onChange={handleFilterChange} style={{ width: 170 }} />
                            </div>
                            <button
                                type="button"
                                className="apply-filter-btn"
                                style={{ width: 170, marginLeft: 'auto', padding: '0.7rem 1.5rem', border: '1px solid #111', borderRadius: 6, background: '#111', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                                onClick={handleApplyFilter}
                            >
                                Apply Filter
                            </button>
                        </div>

                        <div className="report-summary-cards">
                            <div className="summary-card">
                                <h3>Total Orders</h3>
                                <div className="value">{salesData.totalOrders}</div>
                                <p>Placed in selected range</p>
                            </div>
                            <div className="summary-card">
                                <h3>Total Revenue</h3>
                                <div className="value">{formatCurrency(salesData.totalRevenue)}</div>
                                <p>Revenue generated</p>
                            </div>
                            <div className="summary-card">
                                <h3>Products Sold</h3>
                                <div className="value">{salesData.totalProductsSold}</div>
                                <p>Total units sold</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'product' && (
                    <div className="product-report-section">
                        <table className="reports-table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Quantity Sold</th>
                                    <th>Revenue Generated</th>
                                    <th>Remaining Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.totalQuantitySold}</td>
                                        <td>{formatCurrency(item.totalRevenueGenerated)}</td>
                                        <td>
                                            <span className={`stock-badge ${item.remainingStock < 10 ? 'low' : ''}`}>
                                                {item.remainingStock}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'customer' && (
                    <div className="customer-report-section">
                        <table className="reports-table">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Email</th>
                                    <th>Total Orders</th>
                                    <th>Total Amount Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.totalOrders}</td>
                                        <td>{formatCurrency(item.totalAmountSpent)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
