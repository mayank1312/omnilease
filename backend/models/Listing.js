const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Real Estate', 'Gaming', 'Music', 'Computer', 'Books', 'Other']
  },
  basePrice: { type: Number, required: true },
  images: [{ type: String }], 
  
  
  attributes: [{
    k: { type: String },
    v: { type: String }
  }],
  
  location: { type: String },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);