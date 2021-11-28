const express = require('express')
const authController = require("../controllers/authController");
const categoryController = require("../controllers/categoryController");

//validators
const {runValidation} = require('../validators');
const {categoryValidator} = require("../validators/category");

const router = express.Router();


router
    .route('/')
    .post(categoryValidator,runValidation,authController.requireSignin,authController.adminMiddleware,categoryController.create)
    .get(categoryController.getAll)

router
    .route('/:slug')
    .get(categoryController.getOne)
    .delete(authController.requireSignin,authController.adminMiddleware,categoryController.deleteOne)

module.exports = router;