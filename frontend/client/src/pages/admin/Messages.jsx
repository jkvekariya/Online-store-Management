import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEye, FiClock, FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';
import "../../css/admin.css";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/contact/all');
                setMessages(response.data.contacts || []);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load messages");
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    const handleView = (msg) => {
        setSelectedMsg(msg);
        setShowModal(true);
    };

    if (loading) return <div className="admin-content">Loading Queries...</div>;

    const MessageDetailModal = ({ msg, onClose }) => (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Query Details</h3>
                    <button className="close-modal-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiUser style={{ color: '#6366f1' }} /> <strong>From:</strong> {msg.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiMail style={{ color: '#6366f1' }} /> <strong>Email:</strong> {msg.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiClock style={{ color: '#6366f1' }} /> <strong>Date:</strong> {new Date(msg.createdAt).toLocaleString()}
                        </div>
                        <hr style={{ margin: '10px 0', border: '0.1px solid #eee' }} />
                        <div>
                            <strong>Subject:</strong> {msg.subject}
                        </div>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
                            <strong style={{ display: 'block', marginBottom: '8px' }}><FiMessageSquare /> Message:</strong>
                            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', margin: 0 }}>{msg.message}</p>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Close</button>
                    <a href={`mailto:${msg.email}`} className="btn-primary" style={{ textDecoration: 'none' }}>Reply via Email</a>
                </div>
            </div>
        </div>
    );

    return (
        <div className="admin-content">
            <h2>Contact Queries</h2>
            {showModal && <MessageDetailModal msg={selectedMsg} onClose={() => setShowModal(false)} />}
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Preview</th>
                            <th>Date</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No messages found.</td></tr>
                        ) : (
                            messages.map(msg => (
                                <tr key={msg._id}>
                                    <td>{msg.name}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{msg.email}</td>
                                    <td>{msg.subject}</td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {msg.message}
                                    </td>
                                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            className="action-btn view"
                                            title="View Message"
                                            onClick={() => handleView(msg)}
                                        >
                                            <FiEye />
                                        </button>
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

export default Messages;
