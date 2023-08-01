const express = require('express');
const router = express.Router();
const { Payment, Sequelize } = require('../models');
const yup = require("yup");



// Joseph's part

router.post("/", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object().shape({
        car_id: yup.string().trim().required(),
        make: yup.string().trim().min(3).max(100).required(),
        model: yup.string().trim().min(1).max(150).required(),
        price: yup.number().min(0.01).required(),
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
    data.car_id = data.car_id.trim();
    data.make = data.make.trim();
    data.model = data.model.trim();
    data.date = data.date.trim();
    let result = await Payment.create(data);
    res.json(result);
});


// View Car Listing
//router.get("/", async (req, res) => {
//    let list = await Payment.findAll({
//        order: [['createdAt', 'ASC']]
//    });
//    res.json(list);
//});


// View & Search for Car Listing
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { make: { [Sequelize.Op.like]: `%${search}%` } },
            { model: { [Sequelize.Op.like]: `%${search}%` } },
            { date: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }

    let list = await Payment.findAll({
        where: condition,
        order: [['createdAt', 'ASC']]
    });
    res.json(list);
});


// View Car Listing By ID
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let payment = await Payment.findByPk(id);
    // Check id not found
    if (!payment) {
        res.sendStatus(404);
        return;
    }
    res.json(payment);
});

module.exports = router;