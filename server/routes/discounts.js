const express = require('express');
const router = express.Router();
const { Discounts, Sequelize } = require('../models');
const yup = require("yup");



router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { discount: { [Sequelize.Op.like]: `%${search}%` } },
            { id: { [Sequelize.Op.like]: `%${search}%` } },
            { disctype: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }

    let list = await Discounts.findAll({
        where: condition,
        order: [['createdAt', 'ASC']]
    });
    res.json(list);
});

router.post("/", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object().shape({
    discount: yup.number().required('Discount is required'),
    disctype: yup.string().required("required."),
    reqtype: yup.string().required(), // Make reqtype required
    listingId: yup
        .number()
        .test(
          "Please select a Car Type when Requirement Type is 'Car'",
          function (value) {
            const { reqtype } = this.parent;
            if (reqtype === "listingId") {
              return value !== undefined && value !== "";
            }
            return true;
          }
        ),
    minspend: yup.number().required(),
    enddate: yup.string().matches(
      /^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
      'Invalid date format. Please use dd/mm/yyyy.'
    ).required('Date is required.'),
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
    data.discounts = data.Discounts;
    data.minspend = data.minspend;
    let result = await Discounts.create(data);
    res.json(result);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let discounts = await Discounts.findByPk(id);
    // Check id not found
    if (!discounts) {
        res.sendStatus(404);
        return;
    }
    res.json(discounts);
});


// Update Car Listing By ID
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found 
    let discounts = await Discounts.findByPk(id);
    if (!discounts) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        discount: yup.number()
            .min(1, 'At least 1 character')
            .required('Required'),
        disctype: yup.string().required(),
        reqtype: yup.string(),
        minspend: yup.number().min(1),
        enddate: yup.string()
            .matches(
                /^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
                'Invalid date format. Please use dd/mm/yyyy.'
            )
            .required('Date is required.'),
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
    data.discounts = data.Discounts;
    data.minspend = data.minspend;

    let num = await Discounts.update(data, {
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Discount was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update Discount with id ${id}.`
        });
    }
});


// Delete Car Listing
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let discounts = await Discounts.findByPk(id);
    if (!discounts) {
        res.sendStatus(404);
        return;
    }

    let num = await Discounts.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Discount was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete discount with id ${id}.`
        });
    }
});

module.exports = router;
// View & Search for Car Listing


