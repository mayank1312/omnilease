const express = require('express');
const router = express.Router();
const { createListing, getAllListings,getListingById,deleteListing,updateListing,getMyListings } = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');

router.route('/')
  .get(getAllListings)
  .post(protect, createListing);

router.route('/:id')
  .get(getListingById)
  .delete(protect, deleteListing)
  .put(protect, updateListing);

router.route('/user/me')
  .get(protect, getMyListings);
router.get('/user/rentals', protect, async (req, res) => {
  try {
    const rentals = await Booking.find({ user: req.user._id })
      .populate('listing')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});  

module.exports = router;