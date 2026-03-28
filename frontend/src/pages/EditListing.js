import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import styles from './EditListing.module.css';

const categoryFields = {
  "Real Estate": [
    { key: "propertyType", label: "Property Type", placeholder: "e.g. Apartment, Villa, Studio", type: "text" },
    { key: "bhk", label: "BHK / Rooms", placeholder: "e.g. 2 BHK, 3 BHK", type: "text" },
    { key: "area", label: "Area (sq ft)", placeholder: "e.g. 1500", type: "number" },
    { key: "furnishing", label: "Furnishing Status", placeholder: "Fully / Semi / Unfurnished", type: "text" }
  ],
  "Gaming": [
    { key: "console", label: "Console/Device", placeholder: "e.g. PS5, Xbox Series X, Nintendo", type: "text" },
    { key: "storage", label: "Storage Capacity", placeholder: "e.g. 825GB, 1TB", type: "text" },
    { key: "controllers", label: "Extra Controllers", placeholder: "Number of controllers included", type: "number" },
    { key: "warranty", label: "Warranty Status", placeholder: "e.g. 6 months left", type: "text" }
  ],
  "Tech": [
    { key: "deviceType", label: "Device Type", placeholder: "e.g. Laptop, Camera, Drone", type: "text" },
    { key: "specs", label: "Processor/RAM", placeholder: "e.g. M4 Chip, 16GB RAM", type: "text" },
    { key: "condition", label: "Condition", placeholder: "e.g. Mint, Good, Used", type: "text" },
    { key: "usage", label: "Total Usage Time", placeholder: "e.g. 1 year used", type: "text" }
  ],
  "Books": [
    { key: "author", label: "Author Name", placeholder: "e.g. F. Scott Fitzgerald", type: "text" },
    { key: "genre", label: "Genre", placeholder: "e.g. Fiction, Self-help, Tech", type: "text" },
    { key: "edition", label: "Book Edition", placeholder: "e.g. 1st Edition, Hardcover", type: "text" },
    { key: "language", label: "Language", placeholder: "e.g. English, Hindi", type: "text" }
  ],
  "Music": [
    { key: "instrument", label: "Instrument Type", placeholder: "e.g. Acoustic Guitar, MIDI Keyboard", type: "text" },
    { key: "brand", label: "Brand & Model", placeholder: "e.g. Fender Stratocaster, Yamaha P-45", type: "text" },
    { key: "condition", label: "Condition", placeholder: "e.g. Mint, Light wear, Road-worn", type: "text" },
    { key: "accessories", label: "Included Accessories", placeholder: "e.g. Hard case, strap, amp cable", type: "text" }
  ]
};

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [category, setCategory] = useState("Gaming");
  const [baseData, setBaseData] = useState({
    title: '',
    description: '',
    basePrice: '',
    location: '',
    image: ''
  });
  const [dynamicAttrs, setDynamicAttrs] = useState({});

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await API.get(`/listings/${id}`);
        setCategory(data.category);
        setBaseData({
          title: data.title,
          description: data.description,
          basePrice: data.basePrice,
          location: data.location,
          image: data.images[0] || ''
        });

        const attrsObj = {};
        data.attributes.forEach(attr => {
          attrsObj[attr.k] = attr.v;
        });
        setDynamicAttrs(attrsObj);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    };
    fetchListing();
  }, [id, navigate]);

  const handleDynamicChange = (label, value) => {
    setDynamicAttrs({ ...dynamicAttrs, [label]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const attributes = Object.keys(dynamicAttrs).map(key => ({
      k: key,
      v: dynamicAttrs[key]
    }));

    try {
      await API.put(`/listings/${id}`, 
        { 
          ...baseData, 
          category, 
          attributes, 
          images: [baseData.image] 
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate(`/listing/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className={styles.loader}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className="serif">Edit Listing</h1>
      
      <div className={styles.categoryPicker}>
        <p className={styles.label}>Category</p>
        <div className={styles.categoryGrid}>
          {Object.keys(categoryFields).map((cat) => (
            <button 
              key={cat}
              type="button"
              className={category === cat ? styles.activeTab : styles.tab}
              onClick={() => {
                setCategory(cat);
                setDynamicAttrs({});
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Basic Information</h3>
          <div className={styles.inputGroup}>
            <label className={styles.fieldLabel}>Item Title</label>
            <input type="text" value={baseData.title} 
              onChange={e => setBaseData({...baseData, title: e.target.value})} required />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.fieldLabel}>Description</label>
            <textarea value={baseData.description} 
              onChange={e => setBaseData({...baseData, description: e.target.value})} required />
          </div>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.fieldLabel}>Rent per day ($)</label>
              <input type="number" value={baseData.basePrice} 
                onChange={e => setBaseData({...baseData, basePrice: e.target.value})} required />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.fieldLabel}>Location</label>
              <input type="text" value={baseData.location} 
                onChange={e => setBaseData({...baseData, location: e.target.value})} required />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.fieldLabel}>Main Image URL</label>
            <input type="text" value={baseData.image} 
              onChange={e => setBaseData({...baseData, image: e.target.value})} />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>{category} Specifications</h3>
          <div className={styles.dynamicGrid}>
            {categoryFields[category]?.map((field) => (
              <div key={field.key} className={styles.inputGroup}>
                <label className={styles.fieldLabel}>{field.label}</label>
                <input 
                  type={field.type} 
                  placeholder={field.placeholder} 
                  value={dynamicAttrs[field.label] || ''}
                  onChange={(e) => handleDynamicChange(field.label, e.target.value)}
                  required 
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actionRow}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate(`/listing/${id}`)}>Cancel</button>
          <button type="submit" className={styles.submitBtn}>Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditListing;