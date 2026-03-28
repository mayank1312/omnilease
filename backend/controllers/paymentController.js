const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { amount, itemName, listingId, ownerId, startDate, endDate } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: itemName },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user._id.toString(),
        listingId: listingId,
        ownerId: ownerId, 
        startDate: startDate,
        endDate: endDate,
      },
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/messages`,
    });

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const existingBooking = await Booking.findOne({ stripeSessionId: session.id });
      
      if (!existingBooking) {
        const newBooking = await Booking.create({
          user: session.metadata.userId,
          listing: session.metadata.listingId,
          owner: session.metadata.ownerId, 
          startDate: new Date(session.metadata.startDate),
          endDate: new Date(session.metadata.endDate),
          totalPrice: session.amount_total / 100,
          stripeSessionId: session.id,
        });

        await Notification.create({
          recipient: session.metadata.ownerId,
          sender: session.metadata.userId,
          type: 'BOOKING',
          message: `New Booking! Your item "${session.line_items?.[0]?.description || 'Listing'}" has been rented for $${session.amount_total / 100}.`,
          bookingId: newBooking._id,
        });
        const io = req.app.get('socketio');
io.to(session.metadata.ownerId).emit('notification_received', notification);

        console.log("✅ Booking & Notification saved successfully!");
      }
    } catch (error) {
      console.error("❌ Webhook Processing Error:", error.message);
    }
  }
  res.json({ received: true });
};