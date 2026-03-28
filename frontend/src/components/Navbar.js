import React, { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';
import { Home, Gamepad, Music, Monitor, Book, User, LayoutDashboard, MessageCircle, Plus, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../api';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotes, setUnreadNotes] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchCounts = async () => {
      try {
        const [noteRes, chatRes] = await Promise.all([
          API.get('/notifications/unread/count', { headers: { Authorization: `Bearer ${user.token}` } }),
          API.get('/chats/unread/count', { headers: { Authorization: `Bearer ${user.token}` } })
        ]);
        setUnreadNotes(noteRes.data.count);
        setUnreadChats(chatRes.data.count);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCounts();

    const socket = io('http://localhost:5001');
    socket.emit("setup", user);

    socket.on("notification_received", () => setUnreadNotes(prev => prev + 1));
    socket.on("message received", () => setUnreadChats(prev => prev + 1));

    return () => socket.disconnect();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem('userInfo');
    navigate('/auth');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>OmniLease</Link>
        
        <div className={`${styles.categories} ${isMobileMenuOpen ? styles.active : ''}`}>
          <Link to="/category/Real Estate" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}><Home size={18}/> <span>Real Estate</span></Link>
          <Link to="/category/Gaming" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}><Gamepad size={18}/> <span>Gaming</span></Link>
          <Link to="/category/Music" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}><Music size={18}/> <span>Music</span></Link>
          <Link to="/category/Tech" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}><Monitor size={18}/> <span>Tech</span></Link>
          <Link to="/category/Books" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}><Book size={18}/> <span>Books</span></Link>
        </div>

        <div className={styles.rightSection}>
          {user ? (
            <div className={styles.userMenu} ref={menuRef}>
              <div className={styles.userActions}>
                <Link to="/my-listings" className={styles.iconLink}>
                  <div className={styles.badgeWrapper}>
                    <LayoutDashboard size={20} />
                    {unreadNotes > 0 && <span className={styles.badge}>{unreadNotes}</span>}
                  </div>
                  <span className={styles.iconText}>Dashboard</span>
                </Link>

                <Link to="/messages" className={styles.iconLink} onClick={() => setUnreadChats(0)}>
                  <div className={styles.badgeWrapper}>
                    <MessageCircle size={20} />
                    {unreadChats > 0 && <span className={styles.badge}>{unreadChats}</span>}
                  </div>
                  <span className={styles.iconText}>Chats</span>
                </Link>

                <button className={styles.listBtn} onClick={() => navigate('/create')}>
                  <Plus size={16} /> <span className={styles.btnText}>List Item</span>
                </button>

                <div onClick={() => setShowProfile(!showProfile)} className={styles.profileToggle}>
                  <div className={styles.avatar}><User size={18} /></div>
                  <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                </div>
              </div>

              {showProfile && (
                <div className={styles.profilePopover}>
                  <div className={styles.popoverHeader}>
                    <div className={styles.avatarLarge}><User size={28} /></div>
                    <div className={styles.popoverInfo}>
                      <div className={styles.popName}>{user.name}</div>
                      <div className={styles.popEmail}>{user.email}</div>
                    </div>
                  </div>
                  <div className={styles.popActions}>
                    <button className={styles.logoutBtn} onClick={logout}>Logout</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link className={styles.getStarted} to="/auth">Get Started</Link>
          )}

          <button className={styles.menuToggle} onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;