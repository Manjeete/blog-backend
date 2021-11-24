const express = require("express")
const router = express.Router();
const authController = require("../controllers/authController");

//validator for user body data
const {runValidation} = require("../validators/index");
const {userSignupValidator} = require("../validators/auth");

router.get('/signup',userSignupValidator,runValidation,authController.signup);


module.exports = router;