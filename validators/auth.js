const {check} = require("express-validator")

//validator for signup
exports.userSignupValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({min:5})
        .withMessage('Password must be at least 5 characters long.')
]


exports.forgotPasswordValidator = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Must be a valid email address')
]


exports.resetPasswordValidator = [
    check('newPassword')
        .not()
        .isEmpty()
        .isLength({min:6})
        .withMessage('Password must be at least 5 characters long.')
]