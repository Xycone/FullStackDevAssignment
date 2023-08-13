const express = require("express");
const router = express.Router();
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



router.post("/api/create-checkout-session", async (req, res) => {
  const { product, carId } = req.body;
  console.log("Received carId:", carId);
  const priceData = {
    currency: "sgd",
    product_data: {
      name: product.name,
      images: [product.img]
    },
    unit_amount: product.price * 100,
  };

  const queryParams = new URLSearchParams({
    productName: priceData.product_data.name,
    productImage: priceData.product_data.images[0],
    productPrice: priceData.unit_amount / 100,
    quantity: product.quantity,
    carId: carId, // Include carId in queryParams
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "sgd",
          product_data: {
            name: product.name,
            images: [product.img]
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:3000/success?${queryParams.toString()}`,
    cancel_url: "http://localhost:3000/viewlistings",
  });
  console.log("Session ID:", session.id);
  res.json({
    id: session.id,
    url: session.url,
  });
});

// Route to handle incoming webhook events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    // Handle different webhook event types
    if (event.type === 'checkout.session.completed') {
      // Payment successful event
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);
      // Here you can update your database or take any other actions
    } else if (event.type === 'payment_intent.succeeded') {
      // Payment intent succeeded event
      const paymentIntent = event.data.object;
      console.log('Payment intent succeeded:', paymentIntent.id);
      // Here you can update your database or take any other actions
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).json({ error: 'Webhook Error' });
  }
});


module.exports = router;
