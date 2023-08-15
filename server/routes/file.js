const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { upload } = require('../middlewares/upload');
router.post('/upload', upload, (req, res) => {
    res.json({ filename: req.file.filename });
});
module.exports = router;