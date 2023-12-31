const express = require('express');
const router = express.Router();
const { User, Listings, Sequelize } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');



// Sean's part

// Create Car Listing
router.post("/", validateToken, async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object().shape({
        make: yup.string().trim().min(3).max(100).required(),
        model: yup.string().trim().min(1).max(150).required(),
        range: yup.number().min(0).required(),
        price: yup.number().min(0.01).required()
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

    data.make = data.make.trim();
    data.model = data.model.trim();
    data.userId = req.user.id;
    let result = await Listings.create(data);
    res.json(result);
});


// View Car Listing
//router.get("/", async (req, res) => {
//    let list = await Listings.findAll({
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
            { model: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }

    let list = await Listings.findAll({
        where: condition,
        order: [['createdAt', 'ASC']],
        include: { model: User, as: "user", attributes: ['name']}
    });
    res.json(list);
});


// View Car Listing By ID
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let listings = await Listings.findByPk(id);
    // Check id not found
    if (!listings) {
        res.sendStatus(404);
        return;
    }
    res.json(listings);
});


// Update Car Listing By ID
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found 
    let listings = await Listings.findByPk(id);
    if (!listings) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        make: yup.string().trim().min(3).max(100).required(),
        model: yup.string().trim().min(1).max(150).required(),
        range: yup.number().min(0).required(),
        price: yup.number().min(0.01).required()
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

    data.make = data.make.trim();
    data.model = data.model.trim();
    let num = await Listings.update(data, {
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Car Listing was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update car listing with id ${id}.`
        });
    }
});


// Delete Car Listing
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let listings = await Listings.findByPk(id);
    if (!listings) {
        res.sendStatus(404);
        return;
    }
    
    let num = await Listings.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Tutorial was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete tutorial with id ${id}.`
        });
    }
});

module.exports = router;