const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing'
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;