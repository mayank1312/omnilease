import React, { useState,useEffect } from 'react';
import styles from './Auth.module.css';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      navigate('/');
    }
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const { data } = await API.post(endpoint, formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/'); 
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className="serif">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className={styles.subtitle}>
          {isLogin ? 'Enter your details to access your rentals.' : 'Join the community to start renting.'}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className={styles.authButton}>
            {isLogin ? 'Sign In' : 'Get Started'}
          </button>
        </form>

        <div className={styles.toggle}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Sign Up' : ' Log In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;