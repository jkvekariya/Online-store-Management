import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "../../css/admin.css";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews');
                setReviews(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load reviews");
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) return <div className="admin-content">Loading...</div>;

    return (
        <div className="admin-content">
            <h2>Customer Reviews</h2>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>User</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No reviews found.</td></tr>
                        ) : (
                            reviews.map(review => (
                                <tr key={review._id}>
                                    <td>{review.product?.title || 'Unknown Product'}</td>
                                    <td>{review.user}</td>
                                    <td>
                                        <span className="star-rating">
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </span>
                                    </td>
                                    <td>{review.comment}</td>
                                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reviews;
