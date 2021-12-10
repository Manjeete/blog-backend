const express = require('express')
const formController = require("../controllers/formController");

//validators
const {runValidation} = require('../validators');
const {contactFormValidator} = require("../validators/form");

const router = express.Router();


router.post('/',contactFormValidator,runValidation,formController.contactForm);

module.exports=router;