let router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
//public
router.post('/login', AuthController.login);


module.exports = router;
