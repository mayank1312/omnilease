import "react-datepicker/dist/react-datepicker.css"; 
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { MapPin, User, ChevronLeft, Image as ImageIcon, X, AlertCircle, MessageCircle, CreditCard } from 'lucide-react';
import styles from './ListingDetails.module.css';
import DatePicker from "react-datepicker";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showRentModal, setShowRentModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await API.get(`/listings/${id}`);
        setListing(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchListing();
  }, [id]);

  const calculateTotal = () => {
    if (!startDate || !endDate || !listing) return listing?.basePrice || 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays || 1) * listing.basePrice;
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure?")) {
      try {
        await API.delete(`/listings/${id}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleProceedToCheckout = async () => {
    if (!startDate || !endDate) return alert("Select dates");
    try {
      const { data } = await API.post('/payment/create-checkout-session', {
        amount: (calculateTotal() * 1.05).toFixed(2),
        itemName: listing.title,
        listingId: listing._id,
        ownerId: listing.owner._id, 
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
  };

  if (!listing) return <div className={styles.loading}>Loading...</div>;

  const isOwner = currentUser?._id === listing.owner?._id;

  return (
    <>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={18} /> Back
        </button>

        <div className={styles.layout}>
          <div className={styles.imageSection}>
            <div className={styles.galleryLayout}>
              <div className={styles.thumbnailSidebar}>
                {listing.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`${styles.thumbWrapper} ${activeImage === index ? styles.activeThumb : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img} alt={`Thumbnail ${index}`} />
                  </div>
                ))}
              </div>

              <div className={styles.mainImageWrapper}>
                <img 
                  src={listing.images[activeImage]} 
                  alt={listing.title} 
                  className={styles.mainImage} 
                />
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.topInfo}>
              <span className={styles.categoryBadge}>{listing.category}</span>
              <h1 className="serif">{listing.title}</h1>
              <p className={styles.location}><MapPin size={16} /> {listing.location}</p>
            </div>

            <div className={styles.attributesGrid}>
              {listing.attributes.map((attr, index) => (
                <div key={index} className={styles.attrBox}>
                  <span className={styles.attrLabel}>{attr.k}</span>
                  <span className={styles.attrValue}>{attr.v}</span>
                </div>
              ))}
            </div>

            <div className={styles.descriptionBox}>
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>

            <div className={styles.ownerBox}>
              <div className={styles.avatar}><User size={20} color="#fff" /></div>
              <div className={styles.ownerMeta}>
                <p className={styles.ownerName}>{listing.owner?.name}</p>
                <p className={styles.ownerStatus}>{isOwner ? "Your listing" : "Verified Owner"}</p>
              </div>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.priceRow}>
                <span className={styles.price}>${listing.basePrice}</span>
                <span className={styles.perDay}>/ day</span>
              </div>
              
              {isOwner ? (
                <div className={styles.btnGroup}>
                  <button className={styles.editBtn} onClick={() => navigate(`/edit/${listing._id}`)}>Edit</button>
                  <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
                </div>
              ) : (
                <div className={styles.btnGroup}>
                  <button className={styles.enquireBtn} onClick={() => navigate(`/messages?product=${listing._id}`)}>Enquire now</button>
                  <button className={styles.rentBtn} onClick={() => setShowRentModal(true)}>Rent Now</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRentModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setShowRentModal(false)}><X size={20} /></button>
            <AlertCircle size={32} color="#111" />
            <h3>Book Rental</h3>
            <div className={styles.datePickerContainer}>
              <div className={styles.dateInputGroup}>
                <label>Start</label>
                <DatePicker selected={startDate} onChange={d => setStartDate(d)} selectsStart minDate={new Date()} className={styles.customDateInput} />
              </div>
              <div className={styles.dateInputGroup}>
                <label>End</label>
                <DatePicker selected={endDate} onChange={d => setEndDate(d)} selectsEnd startDate={startDate} minDate={startDate || new Date()} className={styles.customDateInput} />
              </div>
            </div>
            {startDate && endDate && (
              <div className={styles.priceReceipt}>
                <div className={styles.receiptRow}><span>Subtotal</span><span>${calculateTotal()}</span></div>
                <div className={styles.receiptTotal}><span>Total</span><span>${(calculateTotal() * 1.05).toFixed(2)}</span></div>
              </div>
            )}
            <button className={styles.checkoutBtn} onClick={handleProceedToCheckout}><CreditCard size={18}/> Checkout</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListingDetails;