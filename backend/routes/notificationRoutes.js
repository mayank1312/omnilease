const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification && notification.recipient.toString() === req.user._id.toString()) {
      notification.isRead = true;
      await notification.save();
      res.json({ message: 'Marked as read' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;