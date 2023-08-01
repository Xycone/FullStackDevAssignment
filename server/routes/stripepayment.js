const express = require("express");
const router = express.Router();
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



router.post("/api/create-checkout-session", async (req, res) => {
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "sgd",
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price * 100,
                },
                quantity: product.quantity,
            },
        ],
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });
    res.json({
        id: session.id,
        url: session.url
    });
});

// Routes here 
router.get("/", (req, res) => {
    res.send("Hello World");
});

module.exports = router;

module.exports = router;
