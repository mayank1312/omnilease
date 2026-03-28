import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Plus } from 'lucide-react';
import styles from './CreateListing.module.css';

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

const CreateListing = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Gaming");
  const [baseData, setBaseData] = useState({
    title: '',
    description: '',
    basePrice: '',
    location: ''
  });

  const [dynamicAttrs, setDynamicAttrs] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
    setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
  };
  
  const handleDynamicChange = (label, value) => {
    setDynamicAttrs({ ...dynamicAttrs, [label]: value });
  };

  const uploadImagesToCloudinary = async () => {
    const uploadedUrls = [];
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    for (let i = 0; i < images.length; i++) {
      const data = new FormData();
      data.append("file", images[i]);
      data.append("upload_preset", uploadPreset);
      data.append("cloud_name", cloudName);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Cloudinary upload failed");

      const uploadedImage = await res.json();
      uploadedUrls.push(uploadedImage.secure_url);
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!user) return navigate('/auth');
    if (images.length === 0) return alert("Please upload at least one image.");

    setUploading(true);

    try {
      const imageUrls = await uploadImagesToCloudinary();
      const attributes = Object.keys(dynamicAttrs).map(key => ({
        k: key,
        v: dynamicAttrs[key]
      }));

      await API.post('/listings', 
        { ...baseData, category, attributes, images: imageUrls },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="serif">List an Item</h1>
      
      <div className={styles.categoryPicker}>
        <p className={styles.label}>Choose a Category</p>
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
            <input type="text" placeholder="Item Title" 
              onChange={e => setBaseData({...baseData, title: e.target.value})} required />
          </div>
          
          <div className={styles.inputGroup}>
            <textarea placeholder="Write a short description about the item..." 
              onChange={e => setBaseData({...baseData, description: e.target.value})} required />
          </div>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input type="number" placeholder="Rent per day ($)" 
                onChange={e => setBaseData({...baseData, basePrice: e.target.value})} required />
            </div>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Location (e.g. New York, NY)" 
                onChange={e => setBaseData({...baseData, location: e.target.value})} required />
            </div>
          </div>
          
          <div className={styles.imageSection}>
            <label className={styles.fieldLabel}>Upload Images</label>
            <div className={styles.imageUploadWrapper}>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" className={styles.uploadPlaceholder}>
                <Upload size={24} />
                <span>Click to upload photos</span>
              </label>
            </div>
            
            {imagePreviews.length > 0 && (
              <div className={styles.previewGrid}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className={styles.previewBox}>
                    <img src={preview} alt="upload preview" />
                    <button 
                      type="button" 
                      className={styles.removeImgBtn} 
                      onClick={() => removeImage(index)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>{category} Specifications</h3>
          <div className={styles.dynamicGrid}>
            {categoryFields[category].map((field) => (
              <div key={field.key} className={styles.inputGroup}>
                <label className={styles.fieldLabel}>{field.label}</label>
                <input 
                  type={field.type} 
                  placeholder={field.placeholder} 
                  onChange={(e) => handleDynamicChange(field.label, e.target.value)}
                  required 
                />
              </div>
            ))}
          </div>
        </div>

       <button type="submit" className={styles.submitBtn} disabled={uploading}>
          {uploading ? "Uploading Listing..." : "Ready to list"}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;