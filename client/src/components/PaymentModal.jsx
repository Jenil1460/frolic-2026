import React, { useState } from 'react';
import './PaymentModal.css';
import { paymentAPI } from '../utils/api';

export default function PaymentModal({ registrationId, amount = 0, onClose, onSuccess }){
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const upiId = process.env.VITE_DEMO_UPI || 'frolic@upi';

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await paymentAPI.demoUPI({ registrationId });
      setSuccess(true);
      setTimeout(()=>{
        onSuccess(res.data);
      }, 900);
    } catch (err) {
      console.error('Payment error:', err);
      alert(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        {!success ? (
          <>
            <h3>Demo UPI Payment</h3>
            <p>UPI ID: <strong>{upiId}</strong></p>
            <p>Amount: <strong>₹{amount}</strong></p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePay} disabled={loading}>{loading ? 'Processing...' : 'Pay Now'}</button>
            </div>
          </>
        ) : (
          <div className="payment-success">
            <div className="checkmark">✓</div>
            <h4>Payment Successful</h4>
            <p>Thank you. Registration confirmed.</p>
            <button className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
