import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, MessageSquare, Home } from 'lucide-react';
import styles from './Success.module.css';

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
    }
  }, [sessionId, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <CheckCircle size={64} color="#22c55e" strokeWidth={1.5} />
        </div>
        
        <h1 className="serif">Booking Confirmed!</h1>
        <p className={styles.subtitle}>
          Your payment was successful. The owner has been notified and will prepare your item for pickup.
        </p>

        {sessionId && (
          <div className={styles.details}>
            <p>Order Reference: <span>{sessionId.slice(-10).toUpperCase()}</span></p>
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => navigate('/messages')}>
            <MessageSquare size={18} />
            <span>Go to Messages</span>
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate('/')}>
            <Home size={18} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;