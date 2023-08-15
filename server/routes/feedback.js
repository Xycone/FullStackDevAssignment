const express = require('express');
const router = express.Router();
const { Feedback, Sequelize } = require('../models');
const yup = require("yup");
router.put("/:id",  async (req, res) => {
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
        responded: yup.boolean()
    });
    try {
        await validationSchema.validate(data, { abortEarly: false });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
    

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
});
router.post("/", async (req, res) => {
    let data = req.body;
    if (!data.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
    console.log(data.userId);
    
    const user = await User.findByPk(data.userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    let validationSchema = yup.object().shape({
        rating: yup.string().trim().required(),
        description: yup.string().trim().min(3).max(500).required(),
        responded: yup.boolean()
    });
    try {
        await validationSchema.validate(data, { abortEarly: false });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
    const feedbackUser = await FeedbackUser.create({
        userId: user.id
    });
    data.rating = data.rating.trim();
    data.description = data.description.trim();
    data.responded = false;
    data.feedbackUserId = feedbackUser.id;
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
    if (search) {
        condition[Sequelize.Op.or] = [
            { rating: { [Sequelize.Op.like]: `%${search}%` } },
            { description: { [Sequelize.Op.like]: `%${search}%` } },
            { responded: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }
    let list = await Feedback.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        // include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});
router.delete("/:id",  async (req, res) => {
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