const { body } = require('express-validator/check')

const validateRegistrationBody = () => {
    return [ 
        body('username')
        .exists()
        .withMessage('username field is required')
        .isLength({min:3})
        .withMessage('name must be greater than 3 letters'),
        body('password')
        .exists()
        .withMessage('password field is required')
        .isLength({min : 8,max: 12})
        .withMessage('password must be in between 8 to 12 characters long')
       ] 
} 

const validateLoginBody = () => {
    return [ 
        body('username').exists()
        .withMessage('username field is required')
        .isEmail()
        .withMessage('username is invalid'),
        body('password')
        .exists()
        .withMessage('password field is required')
        .isLength({min : 8,max: 12})
        .withMessage('password must be in between 8 to 12 characters long')
       ] 
} 

module.exports = {
    validateRegistrationBody : validateRegistrationBody,
    validateLoginBody : validateLoginBody
}