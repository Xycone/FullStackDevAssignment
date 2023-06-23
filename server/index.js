const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
// testing
// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome!");
});

// Routes
const assignmentRoute = require('./routes/assignment');
app.use("/assignment", assignmentRoute);

require('dotenv').config();
const db = require('./models');
db.sequelize.sync({ alter: true }).then(() => {
    let port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`⚡ Sever running on http://localhost:${port}`);
    });
});