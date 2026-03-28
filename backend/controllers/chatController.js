const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');

exports.accessConversation = async (req, res) => {
  try {
    const { ownerId, listingId } = req.body;

    // 1. Safely check if the conversation already exists
    let chat = await Conversation.findOne({
      participants: { $all: [req.user._id, ownerId] },
      listing: listingId
    })
      .populate('participants', '-password')
      .populate('listing', 'title images basePrice category owner')
      .populate('latestMessage');

    if (chat) {
      return res.status(200).json(chat);
    }

    const createdChat = await Conversation.create({
      participants: [req.user._id, ownerId],
      listing: listingId
    });

    const fullChat = await Conversation.findOne({ _id: createdChat._id })
      .populate('participants', '-password')
     .populate('listing', 'title images basePrice category owner')

    res.status(200).json(fullChat);
  } catch (error) {
    console.error("Chat Creation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const chats = await Conversation.find({
      participants: { $in: [req.user._id] }
    })
      .populate('participants', 'name email')
     .populate('listing', 'title images basePrice owner')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text, conversationId } = req.body;

    let message = await Message.create({
      sender: req.user._id,
      text,
      conversationId
    });

    message = await message.populate('sender', 'name');

    await Conversation.findByIdAndUpdate(conversationId, {
      latestMessage: message._id
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('sender', 'name');
      
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};