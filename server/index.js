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
const carRoute = require('./routes/cars');
app.use("/cars", carRoute)
const discountroute = require('./routes/discounts');
app.use("/discounts", discountroute);
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);
const feedbackRoute = require('./routes/feedback');
app.use("/feedback", feedbackRoute);
const paymentRoute = require('./routes/payment');
app.use("/payment", paymentRoute);
const reportRoute = require('./routes/report');
app.use("/report", reportRoute);
const userRoute = require('./routes/user');
app.use("/user", userRoute);
const spRoute = require('./routes/stripepayment');
app.use("/stripepayment", spRoute);

require('dotenv').config();
const db = require('./models');
db.sequelize.sync({ alter: true }).then(() => {
    let port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`⚡ Server running on http://localhost:${port}`);
    });
});