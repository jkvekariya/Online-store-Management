import React, { useState, useEffect } from 'react';
import { FiSave, FiLogOut, FiTrash2, FiCamera } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Settings = () => {
    const navigate = useNavigate();
    const [adminProfile, setAdminProfile] = useState({
        name: "Administrator",
        email: "admin@gmail.com",
        image: null
    });

    useEffect(() => {
        const storedAdmin = localStorage.getItem('osm_adminUser');
        if (storedAdmin) {
            const parsedAdmin = JSON.parse(storedAdmin);
            setAdminProfile(prev => ({
                ...prev,
                name: parsedAdmin.name || "Administrator",
                email: parsedAdmin.email || "admin@gmail.com",
                image: parsedAdmin.image || null
            }));
        }
    }, []);

    const handleChange = (e) => {
        setAdminProfile({ ...adminProfile, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAdminProfile({ ...adminProfile, image: imageUrl });
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const storedAdmin = localStorage.getItem('osm_adminUser');
        let parsedAdmin = storedAdmin ? JSON.parse(storedAdmin) : {};
        parsedAdmin = { ...parsedAdmin, ...adminProfile };
        localStorage.setItem('osm_adminUser', JSON.stringify(parsedAdmin));

        window.dispatchEvent(new Event('storage'));
        toast.success("Settings updated successfully");
    };

    const handleLogout = () => {
        localStorage.removeItem('osm_adminToken');
        localStorage.removeItem('osm_adminUser');
        toast.success("Logged out successfully");
        navigate("/auth/login");
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your admin account? This action cannot be undone.")) {
            localStorage.removeItem('osm_adminToken');
            localStorage.removeItem('osm_adminUser');
            toast.success("Admin account deleted successfully");
            navigate("/auth/login");
        }
    };

    return (
        <div className="admin-cms-container" style={{ padding: '20px' }}>
            <header className="cms-header" style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Settings</h1>
            </header>

            <div className="admin-form" style={{ marginTop: '0', maxWidth: '600px' }}>
                <form onSubmit={handleSave}>
                    <div className="form-group" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div className="drawer-avatar-wrapper" style={{ margin: '0 auto', width: '120px', height: '120px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {adminProfile.image ? (
                                <img src={adminProfile.image} alt="Admin" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '48px', color: '#64748b' }}>{adminProfile.name.charAt(0)}</span>
                            )}
                            <label htmlFor="settings-avatar-upload" className="edit-avatar-btn" style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--admin-primary)', color: '#fff', borderRadius: '50%', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                <FiCamera size={18} />
                                <input
                                    type="file"
                                    id="settings-avatar-upload"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={adminProfile.name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={adminProfile.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button type="submit" className="save-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--admin-primary)', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                            <FiSave /> Save Changes
                        </button>
                    </div>
                </form>

                <hr style={{ margin: '40px 0', borderColor: 'var(--admin-border)' }} />

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button type="button" onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff' }}>
                        <FiLogOut /> Logout
                    </button>
                    <button type="button" onClick={handleDelete} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2', padding: '10px 20px', borderRadius: '8px', border: '1px solid #fca5a5', cursor: 'pointer' }}>
                        <FiTrash2 /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
