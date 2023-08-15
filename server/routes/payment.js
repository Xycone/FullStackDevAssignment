const express = require('express');
const router = express.Router();
const { Payment, Sequelize } = require('../models');
const yup = require("yup");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'totallyrealrental@gmail.com',
        pass: 'tnozgoqkkzfnfier'
    }
});


// Joseph's part

router.post("/", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object().shape({
        carId: yup.string().trim().required(),
        carname: yup.string().trim().min(1).max(150).required(),
        total: yup.number().min(0.01).required(),
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
    data.carId = data.carId.trim();
    data.carname = data.carname.trim();
    data.total = data.total;
    data.date = data.date.trim();
    let result = await Payment.create(data);
    res.json(result);
    const mailOptions = {
        from: 'totallyrealrental@gmail.com',
        to: `${data.email}`,
        subject: `Rental Invoice #${data.carId}${data.date}`,
        text: `Hi valued customer, \n\nThank you for renting ${data.carname} for $${data.total} from us!\nYour rental is from ${data.startDate} to ${data.endDate}\n\n\nCheers,\nThe Rental Team.`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { date: { [Sequelize.Op.like]: `%${search}%` } },
        ];
    }

    let list = await Payment.findAll({
        where: condition,
        order: [['createdAt', 'ASC']]
    });
    res.json(list);
});


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

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let payment = await Payment.findByPk(id);
    if (!payment) {
        res.sendStatus(404);
        return;
    }
    
    let num = await Payment.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Payment record was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Payment record with id ${id}.`
        });
    }
});
module.exports = router;