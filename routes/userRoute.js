const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.get('/profile',authController.requireSignin,authController.authMiddleware,userController.profile);
router.patch('/update',authController.requireSignin,authController.authMiddleware,userController.updateProfile)
router.get('/:username',userController.publicProfile)
router.get("/photo/:username",userController.userPhoto)

module.exports = router;