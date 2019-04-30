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

const validateEmployeeBody = () => {
    return [
        body('fullname')
        .exists()
        .withMessage('fullname field is required')
        .isLength({min:3})
        .withMessage('fullname must be greater than 3 letters'),
        body('DOB')
        .exists()
        .withMessage('DOB field is required')
        .isDataURI()
        .withMessage('Date of Birth must be date'),
        body('gender')
        .exists()
        .withMessage('gender field is required')
        .contains('Male, Female')
        .withMessage('Gender must be either male or female'),
        body('salary')
        .exists()
        .withMessage('salary field is required')
        .isNumeric()
        .withMessage('salary must be a Number'),
        body('designation')
        .exists()
        .withMessage('designation field is required')
    ]
}

module.exports = {
    validateRegistrationBody : validateRegistrationBody,
    validateLoginBody : validateLoginBody,
    validateEmployeeBody : validateEmployeeBody
}