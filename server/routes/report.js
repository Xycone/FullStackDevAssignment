const express = require('express');
const router = express.Router();
const { Report, Sequelize } = require('../models');
const yup = require("yup");



// Joseph's part

router.post("/", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object().shape({
        revenue: yup.number().min(0.01).required(),
    });
    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
    data.date = data.date.trim();

    // Get the latest data from the payment table
    let latestData = await Payment.findOne({
        order: [
            { date: -1 },
        ],
    });

    // Update the data with the latest data from the payment table
    data.revenue += latestData.price;

    // Create the report
    let result = await Report.create(data);
    res.json(result);
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { date: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }

    let list = await Report.findAll({
        where: condition,
        order: [['createdAt', 'ASC']]
    });
    res.json(list);
});


// View Car Listing By ID
router.get("/:date", async (req, res) => {
    let date = req.params.date;
    let report = await Report.findByPk(date);
    // Check id not found
    if (!report) {
        res.sendStatus(404);
        return;
    }
    res.json(report);
});

module.exports = router;