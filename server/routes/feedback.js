const express = require('express');
const router = express.Router();
const { Feedback, FeedbackUser, Sequelize } = require('../models');
const yup = require("yup");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'totallyrealrental@gmail.com',
        pass: 'tnozgoqkkzfnfier'
    }
});
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let feedback = await Feedback.findByPk(id);
    if (!feedback) {
        res.sendStatus(404);
        return;
    }
    // Check request user id
    // let userId = req.user.id;
    // if (feedback.userId != userId) {
    //     res.sendStatus(403);
    //     return;
    // }
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        rating: yup.string().trim(),
        description: yup.string().trim().min(3).max(500),
        responded: yup.boolean(),
        useremail: yup.string().trim(),
    });
    try {
        await validationSchema.validate(data, { abortEarly: false });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }

    console.log(data);
    let num = await Feedback.update(data, {
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Feedback was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update feedback with id ${id}.`
        });
    }
    const mailOptions = {
        from: 'totallyrealrental@gmail.com',
        to: `${data.useremail}`,
        subject: 'Response for the provided feedback',
        text: 'Hi valued customer, \n\nThank you for your feedback! We will react accordingly based off the feedback you have provided us!\n\nCheers,\nThe Rental Team.'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});
router.post("/", async (req, res) => {
    let data = req.body;
    // if (!data.userId) {
    //     res.status(401).json({ message: "Unauthorized" });
    //     return;
    // }
    let validationSchema = yup.object().shape({
        rating: yup.string().trim().required(),
        description: yup.string().trim().min(3).max(500).required(),
        responded: yup.boolean(),
        useremail: yup.string().trim()
    });
    try {
        await validationSchema.validate(data, { abortEarly: false });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
    data.rating = data.rating.trim();
    data.description = data.description.trim();
    data.responded = false;
    data.useremail = data.useremail.trim();
    let result = await Feedback.create(data);
    res.json(result);
});
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    // let feedback = await Feedback.findByPk(id, {
    //     include: { model: User, as: "user", attributes: ['name'] }
    // });
    if (!feedback) {
        res.sendStatus(404);
        return;
    }
    res.json(feedback);
});
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let responded = req.query.responded;
    if (search) {
        condition[Sequelize.Op.or] = [
            { rating: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }
    if (responded == 1) {
        condition.responded = true;
    } else if (responded == 0) {
        condition.responded = false;
    }
    let list = await Feedback.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        // include: { model: User, as: "user", attributes: ['userId'] }
    });
    res.json(list);
});
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await Feedback.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Feedback was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete feedback with id ${id}.`
        });
    }
});
module.exports = router;