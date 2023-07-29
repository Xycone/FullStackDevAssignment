const express = require('express');
const router = express.Router();
const { Cars, Listings, Sequelize } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

// Sean's part

// Create Car Item
router.post("/", validateToken, async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object().shape({
        currentLocation: yup.string().trim().min(3).max(100).required(),
        listingId: yup.number().integer()
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
    let result = await Cars.create(data);
    res.json(result);
});


// View Car Item
//router.get("/", async (req, res) => {
//    let list = await Cars.findAll({
//        order: [['createdAt', 'ASC']]
//    });
//    res.json(list);
//});


// View & Search for Car Item
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { currentLocation: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }

    let list = await Cars.findAll({
        where: condition,
        order: [['createdAt', 'ASC']],
    });
    res.json(list);
});


// View Car Item By ID
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let cars = await Cars.findByPk(id);
    // Check id not found
    if (!cars) {
        res.sendStatus(404);
        return;
    }
    res.json(cars);
});


// Update Car Item By ID
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found 
    let cars = await Cars.findByPk(id);
    if (!cars) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        currentLocation: yup.string().trim().min(3).max(100).required(),
        listingId: yup.number().integer()
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
    let num = await Cars.update(data, {
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Car Item was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update car item with id ${id}.`
        });
    }
});


// Delete Car Item
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let cars = await Cars.findByPk(id);
    if (!cars) {
        res.sendStatus(404);
        return;
    }
    
    let num = await Cars.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Cars Item was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Car Item with id ${id}.`
        });
    }
});

module.exports = router;