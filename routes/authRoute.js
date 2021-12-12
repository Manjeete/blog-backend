const express = require("express")
const router = express.Router();
const authController = require("../controllers/authController");

//validator for user body data
const {runValidation} = require("../validators/index");
const {userSignupValidator,forgotPasswordValidator,resetPasswordValidator} = require("../validators/auth");

router.post('/signup',userSignupValidator,runValidation,authController.signup);
router.post('/signin',authController.signin);
router.get('/signout',authController.signout);
router.patch('/forgot-password',forgotPasswordValidator,runValidation,authController.forgotPassword)
// router.patch('/reset-password',resetPasswordValidator,runValidation,authController.resetPassword)


router.use(authController.requireSignin)

module.exports = router;    