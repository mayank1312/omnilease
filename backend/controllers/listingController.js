const Listing = require('../models/Listing');

exports.createListing = async (req, res) => {
  try {
    const { title, description, category, basePrice, attributes, location, images } = req.body;
    
    const listing = await Listing.create({
      owner: req.user._id, 
      title,
      description,
      category,
      basePrice,
      attributes,
      location,
      images
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await Listing.find(query).populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this listing' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};