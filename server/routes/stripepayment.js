const express = require("express");
const router = express.Router();
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/api/create-checkout-session", async (req, res) => {
  const { product, carId, startDate, endDate, currentLocation } = req.body;
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
    startDate: startDate, //Include startDate in queryParams
    endDate: endDate, //Include endDate in queryParams
    currentLocation: currentLocation, //Include currentLocation in queryParams

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

module.exports = router;
