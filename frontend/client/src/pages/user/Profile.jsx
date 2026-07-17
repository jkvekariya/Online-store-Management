import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaCalendar, FaVenusMars, FaEnvelope, FaPen } from "react-icons/fa6";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "../../css/sidebar.css";
import Bodyheader from '../../components/BodyHeader';

const Profile = () => {
    const [personalInfo, setPersonalInfo] = useState({
        firstname: "",
        lastname: "",
        mobile: "",
        dob: "",
        gender: ""
    });

    const [loginInfo, setLoginInfo] = useState({
        email: ""
    });

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingLogin, setIsEditingLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('osm_user'));
        if (user) {
            setPersonalInfo({
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                mobile: user.mobile || "",
                dob: user.dob || "",
                gender: user.gender || ""
            });
            setLoginInfo({
                email: user.email || ""
            });
        }
    }, []);

    const handlePersonalChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };

    const savePersonal = async () => {
        try {
            // Check both localStorage and document.cookie for token
            let token = localStorage.getItem('osm_token');
            if (!token) {
                const cookies = document.cookie.split('; ');
                const tokenCookie = cookies.find(row => row.startsWith('osm_token='));
                if (tokenCookie) {
                    token = tokenCookie.split('=')[1];
                    localStorage.setItem('osm_token', token);
                }
            }

            if (!token) {
                toast.error("Session expired. Please login again.");
                navigate('/auth/login');
                return;
            }

            const response = await axios.put('http://localhost:5000/api/auth/update-profile', personalInfo, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                toast.success("Personal information updated successfully");
                // The backend returns { message, user: updatedUser }
                const updatedUser = response.data.user;

                // Merge with existing user data to preserve fields like email
                const currentUser = JSON.parse(localStorage.getItem('osm_user') || '{}');
                const mergedUser = { ...currentUser, ...updatedUser };

                localStorage.setItem('osm_user', JSON.stringify(mergedUser));
                setIsEditingPersonal(false);

                // Optional: Force a state refresh if needed
                setPersonalInfo({
                    firstname: mergedUser.firstname || "",
                    lastname: mergedUser.lastname || "",
                    mobile: mergedUser.mobile || "",
                    dob: mergedUser.dob || "",
                    gender: mergedUser.gender || "Male"
                });
            }
        } catch (error) {
            console.error("Update profile error:", error);
            if (error.response?.status === 401) {
                toast.error("Session invalid. Please login again.");
                localStorage.removeItem('osm_token');
                localStorage.removeItem('osm_user');
                navigate('/auth/login');
            } else {
                toast.error(error.response?.data?.message || "Failed to update profile");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('osm_token');
        localStorage.removeItem('osm_user');

        // Trigger storage event for Header update
        window.dispatchEvent(new Event('storage'));

        toast.success("Logged out successfully");
        setTimeout(() => {
            window.location.href = '/auth/login';
        }, 1500);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                const token = localStorage.getItem('osm_token');
                await axios.delete('http://localhost:5000/api/auth/delete-account', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                localStorage.removeItem('osm_token');
                localStorage.removeItem('osm_user');

                // Trigger storage event for Header update
                window.dispatchEvent(new Event('storage'));

                toast.success("Account deleted successfully");
                setTimeout(() => {
                    window.location.href = '/auth/signup';
                }, 2000);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete account");
            }
        }
    };

    return (
        <>
            <Bodyheader title="My Profile" />
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="profile-page-container" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Ubuntu, sans-serif' }}>
                <h1 style={{ marginBottom: '30px', color: '#333', fontSize: '1.8rem' }}>Account Settings</h1>

                <div className="sidebar-content-details" style={{ display: 'grid', gap: '30px' }}>
                    {/* Personal Info Box */}
                    <div className="info-box" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>Personal Information</h3>
                            {!isEditingPersonal && (
                                <button onClick={() => setIsEditingPersonal(true)} style={{ background: 'none', border: 'none', color: '#4b9da9', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                                    <FaPen size={14} /> Edit
                                </button>
                            )}
                        </div>

                        {!isEditingPersonal ? (
                            <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <div>
                                    <span className="label" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}><FaUser style={{ marginRight: '5px' }} /> First Name</span>
                                    <p style={{ margin: 0, fontWeight: '500' }}>{personalInfo.firstname || "Not set"}</p>
                                </div>
                                <div>
                                    <span className="label" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}><FaUser style={{ marginRight: '5px' }} /> Last Name</span>
                                    <p style={{ margin: 0, fontWeight: '500' }}>{personalInfo.lastname || "Not set"}</p>
                                </div>
                                <div>
                                    <span className="label" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}><FaPhone style={{ marginRight: '5px' }} /> Mobile No</span>
                                    <p style={{ margin: 0, fontWeight: '500' }}>{personalInfo.mobile || "Not set"}</p>
                                </div>
                                <div>
                                    <span className="label" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}><FaCalendar style={{ marginRight: '5px' }} /> Date of Birth</span>
                                    <p style={{ margin: 0, fontWeight: '500' }}>{personalInfo.dob || "Not set"}</p>
                                </div>
                                <div>
                                    <span className="label" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}><FaVenusMars style={{ marginRight: '5px' }} /> Gender</span>
                                    <p style={{ margin: 0, fontWeight: '500' }}>{personalInfo.gender || "Not specified"}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="edit-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>First Name</label>
                                    <input type="text" name="firstname" value={personalInfo.firstname} onChange={handlePersonalChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Last Name</label>
                                    <input type="text" name="lastname" value={personalInfo.lastname} onChange={handlePersonalChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Phone Number</label>
                                    <input type="text" name="mobile" value={personalInfo.mobile} onChange={handlePersonalChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Date of Birth</label>
                                    <input type="date" name="dob" value={personalInfo.dob} onChange={handlePersonalChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Gender</label>
                                    <select name="gender" value={personalInfo.gender} onChange={handlePersonalChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                                        <option value="" disabled>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="action-buttons" style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button onClick={savePersonal} style={{ padding: '10px 25px', background: '#3a3d3a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Changes</button>
                                    <button onClick={() => setIsEditingPersonal(false)} style={{ padding: '10px 25px', background: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Login Details Box */}
                    <div className="info-box" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '20px', color: '#333' }}>Login Details</h3>
                        <div>
                            <span className="label" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}><FaEnvelope style={{ marginRight: '5px' }} /> Email Address</span>
                            <p style={{ margin: 0, fontWeight: '500' }}>{loginInfo.email}</p>
                            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Email address cannot be changed.</p>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="info-box" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '20px', color: '#333' }}>Account Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Log out from all devices</h4>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px' }}>This will log you out from all web browsers you have used to access the website.</p>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        padding: '10px 25px',
                                        background: '#3a3d3a',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '8px', color: '#d9534f' }}>Delete Account</h4>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px' }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
                                <button
                                    onClick={handleDeleteAccount}
                                    style={{
                                        padding: '10px 25px',
                                        background: '#d9534f',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
