const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const paymentController = require('./controllers/paymentController');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

app.use(cors());

app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("OmniLease DB Connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send("OmniLease Backend is Running");
});

const PORT = process.env.PORT || 5001; 

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

app.set('socketio', io);

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    if (userData?._id) {
      socket.join(userData._id);
      console.log(`User joined personal room: ${userData._id}`);
      socket.emit("connected");
    }
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined chat room: ${room}`);
  });

  socket.on("new message", (newMessageReceived) => {
    const chatRoom = newMessageReceived.conversationId;
    
    // We expect 'chat' to be passed from frontend containing a 'users' array
    const participants = newMessageReceived.chat?.users;

    if (!chatRoom) return;

    // 1. Emit to the chat room (for the active conversation window)
    socket.in(chatRoom).emit("message received", newMessageReceived);

    // 2. Emit to the recipient's personal ID room (for the Navbar badge)
    if (participants) {
      participants.forEach(user => {
        const userId = user._id || user; // Support both object and ID string
        
        // Don't send the pulse back to the person who sent the message
        if (userId === newMessageReceived.sender._id || userId === newMessageReceived.sender) return;

        socket.in(userId).emit("message received", newMessageReceived);
        console.log(`✅ Badge Pulse sent to user room: ${userId}`);
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));