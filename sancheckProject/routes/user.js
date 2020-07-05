const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

router.post('/signin', UserController.signin);
router.post('/signup', UserController.signup);

module.exports = router;