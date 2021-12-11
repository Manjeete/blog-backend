const express = require('express')
const formController = require("../controllers/formController");

//validators
const {runValidation} = require('../validators');
const {contactFormValidator} = require("../validators/form");

const router = express.Router();


router.post('/contact',contactFormValidator,runValidation,formController.contactForm);
router.post('/contact-blog-author',contactFormValidator,runValidation,formController.contactBlogAuthorForm);


module.exports=router;