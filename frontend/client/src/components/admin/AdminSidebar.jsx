import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiGrid, FiUsers, FiShoppingBag, FiLayers,
    FiSettings, FiMenu, FiChevronLeft, FiBarChart2,
    FiFileText, FiImage, FiMail, FiMessageSquare
} from 'react-icons/fi';
import "../../css/adminSidebar.css";

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { path: '/admin/dashboard', icon: <FiGrid />, text: 'Dashboard' },
        { path: '/admin/orders', icon: <FiShoppingBag />, text: 'Orders' },
        { path: '/admin/products', icon: <FiLayers />, text: 'Products' },
        { path: '/admin/categories', icon: <FiGrid />, text: 'Categories' },
        { path: '/admin/customers', icon: <FiUsers />, text: 'Customers' },
        { path: '/admin/content', icon: <FiFileText />, text: 'Page Contents' },
        { path: '/admin/reports', icon: <FiFileText />, text: 'Reports' },
        { path: '/admin/messages', icon: <FiMail />, text: 'Messages' },
        { path: '/admin/reviews', icon: <FiMessageSquare />, text: 'Reviews' },
        { path: '/admin/analytics', icon: <FiBarChart2 />, text: 'Analytics' },
        { path: '/admin/settings', icon: <FiSettings />, text: 'Settings' },
    ];

    return (
        <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && <div className="logo-text">ADMIN PANEL</div>}
                <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <FiMenu /> : <FiChevronLeft />}
                </button>
            </div>

            <ul className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <li key={index} className="menu-item">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
                            title={collapsed ? item.text : ''}
                        >
                            <span className="menu-icon">{item.icon}</span>
                            {!collapsed && <span className="menu-text">{item.text}</span>}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
};


export default AdminSidebar;
