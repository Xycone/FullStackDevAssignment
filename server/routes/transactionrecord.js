const express = require('express');
const router = express.Router();
const { TransactionRecord, Cars, Sequelize } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

// Sean's part

// Create TransactionRecord
router.post("/", validateToken, async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object().shape({
        carId: yup.number().integer().required(),
        productPrice: yup.number().min(0).required(),
        productName: yup.string().max(250).required(),
        startDate: yup.date().required(),
        endDate: yup.date().required(),
    });
    try {
        await validationSchema.validate(data,
            { abortEarly: false });

        // Check if the car with the given carId exists in the Cars database
        const carExists = await Cars.findByPk(data.carId);
        if (!carExists) {
            return res.status(404).json({ message: 'Car not found' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }

    data.productName = data.productName.trim();
    let result = await TransactionRecord.create(data);
    res.json(result);
});

// View & Search for TransactionRecord
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { productName: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }

    let list = await TransactionRecord.findAll({
        where: condition,
        order: [['createdAt', 'ASC']],
    });
    res.json(list);
});


// View TransactionRecord by ID
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let transactionrecord = await TransactionRecord.findByPk(id);
    // Check id not found
    if (!transactionrecord) {
        res.sendStatus(404);
        return;
    }
    res.json(transactionrecord);
});


// Update TransactionRecord By ID
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found 
    let transactionrecord = await TransactionRecord.findByPk(id);
    if (!transactionrecord) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        carId: yup.number().integer().required(),
        productPrice: yup.number().min(0).required(),
        productName: yup.string().max(250).required(),
        startDate: yup.date().required(),
        endDate: yup.date().required(),
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

    data.currentLocation = data.currentLocation.trim();
    let num = await TransactionRecord.update(data, {
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Transaction Record was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update Transaction Record with id ${id}.`
        });
    }
});


// Delete TransactionRecord
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let transactionrecord = await TransactionRecord.findByPk(id);
    if (!transactionrecord) {
        res.sendStatus(404);
        return;
    }

    let num = await TransactionRecord.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Transaction Record was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Transaction Record with id ${id}.`
        });
    }
});

module.exports = router;