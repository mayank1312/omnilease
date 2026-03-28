import React from 'react';
import styles from './ListingCard.module.css';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/listing/${listing._id}`)}>
      <div className={styles.imageWrapper}>
        <img 
          src={listing.images?.[0] || 'https://via.placeholder.com/300'} 
          alt={listing.title} 
          loading="lazy" 
        />
        <div className={styles.categoryBadge}>{listing.category}</div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className="serif">{listing.title}</h3>
          <span className={styles.price}>${listing.basePrice}<span>/day</span></span>
        </div>
        
        <p className={styles.location}><MapPin size={14}/> {listing.location}</p>
        
        <div className={styles.attributes}>
          {listing.attributes?.slice(0, 3).map((attr, index) => (
            <div key={index} className={styles.attrTag}>
              <strong>{attr.k}:</strong> {attr.v}
            </div>
          ))}
        </div>
        
        <button className={styles.viewBtn}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default ListingCard;