const express = require('express');
const router = express.Router();
const { Report, Sequelize } = require('../models');
const yup = require("yup");



// Joseph's part

router.post("/", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object().shape({
        revenue: yup.number().min(0).required(),
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

router.put("/:date", async (req, res) => {
    let date = req.params.date;
    // Check date not found 
    let report = await Report.findByPk(date);
    if (!report) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        revenue: yup.number().min(0).required(),
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
    data.revenue += data.revenue;
    let num = await Report.update(data, {
        where: { date: date }
    });
    if (num == 1) {
        res.json({
            message: "Report was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update report with id ${date}.`
        });
    }
});
module.exports = router;