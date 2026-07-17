import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FiX, FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';
import '../../css/checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [currentStep, setCurrentStep] = useState('ADDRESS'); // 'ADDRESS' or 'PAYMENT'
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    state: '',
    address: '',
    locality: '',
    city: '',
    type: 'HOME'
  });

  const user = JSON.parse(localStorage.getItem('osm_user'));

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    setIsLoaded(true);
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/address/${user.id}`);
      setAddresses(res.data);
      if (res.data.length > 0) {
        setSelectedAddressId(res.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching addresses", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await axios.put(`http://localhost:5000/api/address/${editingAddress._id}`, formData);
        toast.success("Address updated successfully");
      } else {
        await axios.post('http://localhost:5000/api/address', { ...formData, user: user.id });
        toast.success("Address added successfully");
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      setFormData({ name: '', mobile: '', pincode: '', state: '', address: '', locality: '', city: '', type: 'HOME' });
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setFormData({
      name: addr.name,
      mobile: addr.mobile,
      pincode: addr.pincode,
      state: addr.state,
      address: addr.address,
      locality: addr.locality,
      city: addr.city,
      type: addr.type
    });
    setShowAddressForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this address?")) {
      try {
        await axios.delete(`http://localhost:5000/api/address/${id}`);
        toast.success("Address removed");
        fetchAddresses();
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  const getDeliveryRange = () => {
    const start = new Date();
    start.setDate(start.getDate() + 5);
    const end = new Date();
    end.setDate(end.getDate() + 7);

    const options = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('en-GB', options)} - ${end.toLocaleDateString('en-GB', options)}`;
  };

  const calculateTotalMRP = () => {
    return cartItems.reduce((acc, item) => acc + (item.comparePrice > 0 ? item.comparePrice : item.price) * item.quantity, 0);
  };

  const handleContinue = () => {
    if (currentStep === 'ADDRESS') {
      if (selectedAddressId) {
        setCurrentStep('PAYMENT');
        window.scrollTo(0, 0);
      } else {
        toast.warning("Please select a delivery address");
      }
    } else {
      handlePlaceOrder();
    }
  };

  const saveOrder = async (orderId, paymentData = {}) => {
    try {
      const selectedAddress = addresses.find(a => a._id === selectedAddressId);
      const orderData = {
        user: user.id || user._id,
        orderItems: cartItems.map(item => ({
          product: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize || 'N/A',
          image: item.image
        })),
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod,
        totalPrice: subTotal,
        orderId: orderId,
        isPaid: paymentMethod !== 'COD',
        paidAt: paymentMethod !== 'COD' ? new Date() : null,
        ...paymentData
      };

      await axios.post('http://localhost:5000/api/orders', orderData);
      return true;
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to save order details. Please contact support.");
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'COD') {
      const orderId = `OD${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const saved = await saveOrder(orderId);
      if (saved) {
        toast.success(`Order placed successfully with Cash on Delivery! Order ID: ${orderId}`);
        clearCart();
        navigate('/pages/user/orders');
      }
    } else {
      await handleRazorpayPayment();
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const amount = subTotal;
      const receipt = `receipt_${Date.now()}`;

      // 1. Create order on server
      const { data: order } = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount,
        receipt
      });

      // Simulation Mode: If order is mock, auto-complete WITHOUT calling Razorpay API
      if (order.isMock) {
        toast.info("Simulation Mode: Processing payment...");
        setTimeout(async () => {
          try {
            const mockResponse = {
              razorpay_order_id: order.id,
              razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(7),
              razorpay_signature: 'sig_mock_verified_simulation'
            };
            await axios.post('http://localhost:5000/api/payment/verify-payment', mockResponse);

            const saved = await saveOrder(order.id, {
              paymentResult: {
                id: mockResponse.razorpay_payment_id,
                status: 'captured',
                update_time: new Date().toISOString()
              }
            });

            if (saved) {
              toast.success("Payment successful! Order placed (Simulated).");
              clearCart();
              navigate('/pages/user/orders');
            }
          } catch (err) {
            toast.error("Simulation verification failed");
          }
        }, 1500);
        return;
      }

      // Real Mode: Only execute if order is NOT a mock
      const options = {
        key: order.key, // Use key provided by backend
        amount: order.amount,
        currency: order.currency,
        name: 'Online Store',
        description: 'Order Payment',
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post('http://localhost:5000/api/payment/verify-payment', response);

            const saved = await saveOrder(order.id, {
              paymentResult: {
                id: response.razorpay_payment_id,
                status: 'captured',
                update_time: new Date().toISOString()
              }
            });

            if (saved) {
              toast.success("Payment successful! Order placed.");
              clearCart();
              navigate('/pages/user/orders');
            }
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email || 'user@example.com',
          contact: addresses.find(a => a._id === selectedAddressId)?.mobile || '',
        },
        theme: {
          color: '#282c3f',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      toast.error("Failed to initiate payment. Check server console for details.");
    }
  };

  if (cartItems.length === 0) {
    navigate('/pages/user/cart');
    return null;
  }

  const totalMRP = calculateTotalMRP();
  const subTotal = getCartTotal();
  const discountOnMRP = totalMRP - subTotal;

  return (
    <div className={`checkout-page-wrapper ${isLoaded ? 'fade-in' : ''}`}>
      <ToastContainer />
      <div className="checkout-progress-container">
        <div className="progress-steps">
          <span className={`step ${currentStep === 'ADDRESS' ? 'active' : ''}`} onClick={() => setCurrentStep('ADDRESS')} style={{ cursor: 'pointer' }}>BAG</span>
          <span className="step-divider">----------</span>
          <span className={`step ${currentStep === 'ADDRESS' ? 'active' : ''}`} onClick={() => setCurrentStep('ADDRESS')} style={{ cursor: 'pointer' }}>ADDRESS</span>
          <span className="step-divider">----------</span>
          <span className={`step ${currentStep === 'PAYMENT' ? 'active' : ''}`}>PAYMENT</span>
        </div>
      </div>

      <div className="checkout-main-layout">
        {/* LEFT SECTION: ADDRESS or PAYMENT */}
        <div className="checkout-left-section">
          {currentStep === 'ADDRESS' ? (
            !showAddressForm ? (
              <>
                <div className="section-header-row">
                  <h3 className="section-main-title">Select Delivery Address</h3>
                  <button className="add-new-btn-top" onClick={() => setShowAddressForm(true)}>
                    ADD NEW ADDRESS
                  </button>
                </div>

                <div className="address-list-container">
                  <p className="address-group-label">DEFAULT ADDRESS</p>

                  {addresses.length === 0 ? (
                    <div className="empty-address-box" onClick={() => setShowAddressForm(true)}>
                      <span className="plus-icon">+</span>
                      <p>Add New Address</p>
                    </div>
                  ) : (
                    addresses.map(addr => (
                      <div key={addr._id} className={`address-card ${selectedAddressId === addr._id ? 'selected' : ''}`}>
                        <div className="address-card-content" onClick={() => setSelectedAddressId(addr._id)} style={{ cursor: 'pointer' }}>
                          <div className="radio-selection">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={selectedAddressId === addr._id}
                              onChange={() => setSelectedAddressId(addr._id)}
                            />
                          </div>
                          <div className="address-details-body">
                            <div className="address-name-row">
                              <span className="customer-name">{addr.name}</span>
                              <span className="address-type-tag">{addr.type}</span>
                            </div>
                            <p className="address-text-full">
                              {addr.address}, {addr.locality}<br />
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="mobile-info">Mobile: <b>{addr.mobile}</b></p>
                            <ul className="address-perks">
                              <li>• Pay on Delivery available</li>
                            </ul>

                            {selectedAddressId === addr._id && (
                              <div className="address-actions-row">
                                <button className="checkout-addr-btn remove" onClick={(e) => { e.stopPropagation(); handleDelete(addr._id); }}>REMOVE</button>
                                <button className="checkout-addr-btn edit" onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}>EDIT</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {addresses.length > 0 && (
                    <div className="add-more-address-dashed" onClick={() => setShowAddressForm(true)}>
                      <span className="plus-pink">+ Add New Address</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="address-form-container">
                <h3 className="form-title">{editingAddress ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}</h3>
                <form onSubmit={handleFormSubmit} className="actual-address-form">
                  <div className="form-section-title">CONTACT DETAILS</div>
                  <div className="input-group-checkout">
                    <input type="text" name="name" placeholder="Name*" required value={formData.name} onChange={handleInputChange} />
                    <input type="text" name="mobile" placeholder="Mobile No*" required value={formData.mobile} onChange={handleInputChange} />
                  </div>

                  <div className="form-section-title">ADDRESS</div>
                  <div className="input-group-checkout">
                    <input type="text" name="pincode" placeholder="Pin Code*" required value={formData.pincode} onChange={handleInputChange} />
                    <input type="text" name="state" placeholder="State*" required value={formData.state} onChange={handleInputChange} />
                  </div>
                  <div className="single-input-checkout">
                    <input type="text" name="address" placeholder="Address (House No, Building, Street, Area)*" required value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className="single-input-checkout">
                    <input type="text" name="locality" placeholder="Locality / Town*" required value={formData.locality} onChange={handleInputChange} />
                  </div>
                  <div className="input-group-checkout">
                    <input type="text" name="city" placeholder="City / District*" required value={formData.city} onChange={handleInputChange} />
                  </div>

                  <div className="form-section-title">SAVE ADDRESS AS</div>
                  <div className="type-selection-row">
                    <label className={`type-btn ${formData.type === 'HOME' ? 'active' : ''}`}>
                      <input type="radio" name="type" value="HOME" checked={formData.type === 'HOME'} onChange={handleInputChange} />
                      Home
                    </label>
                    <label className={`type-btn ${formData.type === 'WORK' ? 'active' : ''}`}>
                      <input type="radio" name="type" value="WORK" checked={formData.type === 'WORK'} onChange={handleInputChange} />
                      Work
                    </label>
                  </div>

                  <div className="form-actions-checkout">
                    <button type="submit" className="submit-address-btn">SAVE ADDRESS</button>
                    <button type="button" className="cancel-address-btn" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}>CANCEL</button>
                  </div>
                </form>
              </div>
            )
          ) : (
            <div className="payment-options-container">
              <h3 className="section-main-title">Choose Payment Mode</h3>
              <div className="payment-methods-list">
                <div className={`payment-method-card ${paymentMethod === 'COD' ? 'active' : ''}`} onClick={() => setPaymentMethod('COD')}>
                  <div className="method-header">
                    <input type="radio" checked={paymentMethod === 'COD'} readOnly />
                    <span className="method-name">Cash On Delivery (Cash/UPI)</span>
                  </div>
                </div>

                <div className={`payment-method-card ${paymentMethod === 'CARD' ? 'active' : ''}`} onClick={() => setPaymentMethod('CARD')}>
                  <div className="method-header">
                    <input type="radio" checked={paymentMethod === 'CARD'} readOnly />
                    <span className="method-name">Credit / Debit Card</span>
                  </div>
                  {paymentMethod === 'CARD' && (
                    <div className="card-input-details">
                      <p className="card-mock-text">Payment integration would be here. (Razorpay/Stripe)</p>
                    </div>
                  )}
                </div>

                <div className={`payment-method-card ${paymentMethod === 'UPI' ? 'active' : ''}`} onClick={() => setPaymentMethod('UPI')}>
                  <div className="method-header">
                    <input type="radio" checked={paymentMethod === 'UPI'} readOnly />
                    <span className="method-name">UPI (Google Pay / PhonePe / BHIM)</span>
                  </div>
                </div>

                <div className={`payment-method-card ${paymentMethod === 'NET' ? 'active' : ''}`} onClick={() => setPaymentMethod('NET')}>
                  <div className="method-header">
                    <input type="radio" checked={paymentMethod === 'NET'} readOnly />
                    <span className="method-name">Net Banking</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: PRICE DETAILS & ESTIMATES */}
        <div className="checkout-right-section">
          <div className="estimates-card">
            <h4 className="estimates-title">DELIVERY ESTIMATES</h4>
            <div className="estimate-item">
              <div className="estimate-thumb-list">
                {cartItems.slice(0, 3).map(item => (
                  <img key={item._id} src={item.image || "/photos/placeholder.jpg"} alt="item" className="small-thumb" />
                ))}
              </div>
              <p className="estimate-text">Delivery between <b>{getDeliveryRange()}</b></p>
            </div>
          </div>

          <div className="price-details-card-checkout">
            <h4 className="section-title-small">PRICE DETAILS ({cartItems.length} Items)</h4>
            <div className="price-rows">
              <div className="price-detail-row">
                <span>Total MRP</span>
                <span>₹{totalMRP}</span>
              </div>
              <div className="price-detail-row">
                <span>Discount on MRP</span>
                <span className="discount-value">-₹{discountOnMRP}</span>
              </div>
              <div className="price-detail-row">
                <span>Platform Fee</span>
                <span className="discount-value">FREE</span>
              </div>
              <div className="price-detail-row">
                <span>Shipping Fee</span>
                <span className="discount-value">FREE</span>
              </div>
              <hr className="price-divider" />
              <div className="price-detail-row total-amount-row">
                <span>Total Amount</span>
                <span>₹{subTotal}</span>
              </div>
            </div>

            <button
              className="continue-btn"
              disabled={!selectedAddressId}
              onClick={handleContinue}
            >
              {currentStep === 'ADDRESS' ? 'CONTINUE' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
