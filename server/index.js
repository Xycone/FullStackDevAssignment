const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome!");
});

// Routes
const listingRoute = require('./routes/listings');
app.use("/listings", listingRoute);
const discountroute = require('./routes/discounts');
app.use("/discounts", discountroute);
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);
const feedbackRoute = require('./routes/feedback');
app.use("/feedback", feedbackRoute);
const paymentRoute = require('./routes/payment');
app.use("/payment", paymentRoute);

const userRoute = require('./routes/user');
app.use("/user", userRoute);

require('dotenv').config();
const db = require('./models');
db.sequelize.sync({ alter: true }).then(() => {
    let port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`⚡ Sever running on http://localhost:${port}`);
    });
});