const express = require('express')
const authController = require("../controllers/authController");
const tagController = require("../controllers/tagController");

//validators
const {runValidation} = require('../validators');
const {categoryValidator} = require("../validators/category");

const router = express.Router();


router
    .route('/')
    .post(categoryValidator,runValidation,authController.requireSignin,authController.adminMiddleware,tagController.create)
    .get(tagController.getAll)

router
    .route('/:slug')
    .get(tagController.getOne)
    .delete(authController.requireSignin,authController.adminMiddleware,tagController.deleteOne)

module.exports = router;