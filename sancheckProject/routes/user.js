const express = require('express');
const router = express.Router();
const upload=require('../modules/multer');
const UserController = require('../controllers/user');
const ImageController = require('../controllers/image');

router.post('/signin', UserController.signin);
router.post('/signup', UserController.signup);
router.post('/uploadImage/:bookstoreIdx',upload.array('profile'),ImageController.updateImages);

module.exports = router;