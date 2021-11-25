const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.get('/profile',authController.requireSignin,authController.authMiddleware,userController.profile);

module.exports = router;