import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FiX, FiCamera, FiLogOut, FiUser } from "react-icons/fi";
import AdminSidebar from "../components/admin/AdminSidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/admin.css";

const AdminLayout = () => {
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: "Administrator",
    email: "admin@codiq.com",
    image: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = () => {
      const storedAdmin = localStorage.getItem('osm_adminUser');
      if (storedAdmin) {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdminProfile({
          name: parsedAdmin.name || "Administrator",
          email: parsedAdmin.email || "admin@gmail.com",
          image: parsedAdmin.image || null
        });
      }
    };

    loadProfile();

    window.addEventListener('storage', loadProfile);
    return () => window.removeEventListener('storage', loadProfile);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAdminProfile({ ...adminProfile, image: imageUrl });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('osm_adminToken');
    localStorage.removeItem('osm_adminUser');
    navigate("/auth/login");
  };

  const saveProfile = (e) => {
    e.preventDefault();
    // Update local storage to persist name change
    const storedAdmin = localStorage.getItem('osm_adminUser');
    if (storedAdmin) {
      const parsedAdmin = JSON.parse(storedAdmin);
      parsedAdmin.name = adminProfile.name;
      localStorage.setItem('osm_adminUser', JSON.stringify(parsedAdmin));
    }
    setShowProfileDrawer(false);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="page-title">
            <h2>Management Console</h2>
          </div>
          <div className="topbar-actions">
            <div className="admin-profile" onClick={() => setShowProfileDrawer(true)}>
              {adminProfile.image ? (
                <img src={adminProfile.image} alt="Profile" className="admin-avatar-img" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div className="admin-avatar">A</div>
              )}
              <span className="admin-name">{adminProfile.name}</span>
            </div>
          </div>
        </header>
        <div className="admin-content-inner">
          <Outlet />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Profile Drawer */}
      {showProfileDrawer && (
        <div className="profile-overlay" onClick={() => setShowProfileDrawer(false)}></div>
      )}
      <div className={`profile-drawer ${showProfileDrawer ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Your Profile</h3>
          <button className="close-drawer-btn" onClick={() => setShowProfileDrawer(false)}>
            <FiX />
          </button>
        </div>

        <div className="drawer-content">
          <div className="profile-image-section">
            <div className="drawer-avatar-wrapper">
              {adminProfile.image ? (
                <img src={adminProfile.image} alt="Admin" className="drawer-avatar" />
              ) : (
                <div className="avatar-placeholder">A</div>
              )}
              <label htmlFor="avatar-upload" className="edit-avatar-btn">
                <FiCamera />
                <input
                  type="file"
                  id="avatar-upload"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div className="admin-info-text">
              <h4 style={{ margin: '5px 0' }}>{adminProfile.name}</h4>
              <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>{adminProfile.email}</span>
            </div>
          </div>

          <form className="profile-form" onSubmit={saveProfile}>
            <div className="form-group">
              <label><FiUser style={{ marginRight: '8px' }} /> Full Name</label>
              <input
                type="text"
                value={adminProfile.name}
                onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
              />
            </div>
            {/* Email field removed as per requirement */}
            <button type="submit" className="save-profile-btn">
              Save Changes
            </button>
          </form>
        </div>

        <div className="drawer-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};


export default AdminLayout;

