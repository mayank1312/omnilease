import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import ListingCard from '../components/ListingCard';
import { Plus, Bell, Calendar, CreditCard, Check, Package, ShoppingBag } from 'lucide-react';
import styles from './MyListings.module.css';
import { io } from 'socket.io-client';

const MyListings = () => {
  const [myItems, setMyItems] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        const [inventoryRes, rentalsRes, notifyRes] = await Promise.all([
          API.get('/listings/user/me', { headers: { Authorization: `Bearer ${currentUser.token}` } }),
          API.get('/listings/user/rentals', { headers: { Authorization: `Bearer ${currentUser.token}` } }),
          API.get('/notifications', { headers: { Authorization: `Bearer ${currentUser.token}` } })
        ]);
        
        setMyItems(inventoryRes.data);
        setMyRentals(rentalsRes.data);
        setNotifications(notifyRes.data.filter(n => !n.isRead));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, currentUser?.token]);

  useEffect(() => {
    if (!currentUser) return;

    const socket = io('http://localhost:5001');
    socket.emit("setup", currentUser);

    socket.on("notification_received", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      socket.off("notification_received");
      socket.disconnect();
    };
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.dashboardLayout}>
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.headerText}>
              <h1 className="serif">Dashboard</h1>
              <p className={styles.subtitle}>Manage your items and rentals</p>
            </div>
            <Link to="/create" className={styles.createBtn}>
              <Plus size={18} /> <span>List Item</span>
            </Link>
          </div>

          <div className={styles.tabSwitcher}>
            <button 
              className={activeTab === 'inventory' ? styles.activeTab : styles.tab} 
              onClick={() => setActiveTab('inventory')}
            >
              <Package size={18} /> Inventory ({myItems.length})
            </button>
            <button 
              className={activeTab === 'rentals' ? styles.activeTab : styles.tab} 
              onClick={() => setActiveTab('rentals')}
            >
              <ShoppingBag size={18} /> Rentals ({myRentals.length})
            </button>
          </div>

          <div className={styles.statsBar}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Active {activeTab === 'inventory' ? 'Listings' : 'Rentals'}</span>
              <span className={styles.statValue}>
                {activeTab === 'inventory' ? myItems.length : myRentals.length}
              </span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Unread Alerts</span>
              <span className={styles.statValue}>{notifications.length}</span>
            </div>
          </div>

          <div className={styles.contentGrid}>
            {activeTab === 'inventory' ? (
              myItems.length > 0 ? (
                <div className={styles.listingsGrid}>
                  {myItems.map(item => <ListingCard key={item._id} listing={item} />)}
                </div>
              ) : (
                <div className={styles.emptyState}>No items listed yet.</div>
              )
            ) : (
              myRentals.length > 0 ? (
                <div className={styles.rentalsList}>
                  {myRentals.map(rental => (
                    <div key={rental._id} className={styles.rentalCard}>
                      <img 
                        src={rental.listing?.images?.[0]} 
                        alt={rental.listing?.title} 
                      />
                      <div className={styles.rentalInfo}>
                        <h4>{rental.listing?.title}</h4>
                        <div className={styles.rentalMeta}>
                          <p>Owner: {rental.owner?.name}</p>
                          <div className={styles.rentalDates}>
                            <Calendar size={14} />
                            <span>{new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className={styles.priceTag}>${rental.totalPrice} Paid</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>No rentals found.</div>
              )
            )}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Bell size={18} />
            <h3>Activity</h3>
          </div>

          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <p className={styles.noNotes}>All caught up!</p>
            ) : (
              notifications.map(note => (
                <div key={note._id} className={styles.noteItem}>
                  <div className={styles.noteIcon}>
                    {note.type === 'BOOKING' ? <CreditCard size={14} /> : <Calendar size={14} />}
                  </div>
                  <div className={styles.noteBody}>
                    <p>{note.message}</p>
                    <div className={styles.noteFooter}>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      <button onClick={() => markAsRead(note._id)}>
                        <Check size={12} /> Clear
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default MyListings;