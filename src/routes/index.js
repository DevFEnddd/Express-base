const express = require('express');

const authRoute = require('./auth.routes');

const router = express.Router();

router.use('/api', authRoute);

module.exports = router;
