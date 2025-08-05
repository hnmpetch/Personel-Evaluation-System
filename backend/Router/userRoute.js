const express = require('express');
const router = express.Router();
const userControl = require('../controller/userController.js')

router.get('/', userControl.get_Users);
router.post('/register', userControl.register);
router.post('/login', userControl.login);

module.exports = router