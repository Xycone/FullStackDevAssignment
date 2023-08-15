
const express = require('express');
const router = express.Router();
const { Discounts, Sequelize } = require('../models');
const yup = require("yup");
const dayjs = require('dayjs');
const cron = require('node-cron');
const axios = require('axios'); // Assuming you have Axios installed for making HTTP requests

// Schedule the task to run daily at midnight
cron.schedule('0 0  * * *', async () => {
  try {
    const response = await axios.delete('http://localhost:3001/discounts/delete-expired-discounts');
    console.log(response.data.message);
  } catch (error) {
    console.error('Error deleting expired discounts:', error);
  }
});

router.delete('/delete-expired-discounts', async (req, res) => {
  try {
    const currentDate = dayjs(); // Get the current date and time

    // Retrieve all discounts
    const allDiscounts = await Discounts.findAll();

    // Filter out expired discounts
    const expiredDiscounts = allDiscounts.filter((discount) => {
      const discountEndDate = dayjs(discount.enddate, 'DD/MM/YYYY'); // Convert to dayjs object
      return discountEndDate.isBefore(currentDate, 'day'); // Compare dates
    });

    // Delete expired discounts
    await Discounts.destroy({
      where: {
        id: expiredDiscounts.map((discount) => discount.id),
      },
    });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

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
    discount: yup.number().required("Discount is required"),
      disctype: yup.string().required("required."),
      reqtype: yup.string().required("Requirement Type is required"),
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
      minspend: yup.number(),
      enddate: yup
        .string()
    .test('future-date', 'End date must be in the future', (value) => {
      if (!value) return false; // Return false if value is empty
      return dayjs(value, 'DD/MM/YYYY').isAfter(dayjs(), 'day');
    })
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
        discount: yup.number().required("Discount is required"),
      disctype: yup.string().required("required."),
      reqtype: yup.string().required("Requirement Type is required"),
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
      minspend: yup.number(),
      enddate: yup
        .string()
    .test('future-date', 'End date must be in the future', (value) => {
      if (!value) return false; // Return false if value is empty
      return dayjs(value, 'DD/MM/YYYY').isAfter(dayjs(), 'day');
    })
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