const { body } = require('express-validator');

// Import the Borrower model from the '../models/borrower' file
const { Borrower } = require('../models/borrow');

exports.isBorrower = () => {
    return [
        // Use express-validator to define validation rules
        body('name')
            .trim().isLength({ min: 3, max: 256 }).withMessage('Name must be between 3 and 256 characters'),
        body('email')
            .trim().isLength({ min: 3, max: 256 }).withMessage('Email must be between 3 and 256 characters')
            .isEmail().withMessage('Email must be a valid email address'),

        // Custom validation function to body if the borrower with the given email already exists
        body('email').custom(async (email) => {
            const existingBorrower = await Borrower.findOne({ where: { email } });
            if (existingBorrower) {
                throw new Error('Borrower with the same email already exists');
            }
            return true;
        }),
    ]
};

exports.requiredFields = () => {
    return [
        body('name')
            .notEmpty().withMessage('Name is required'),
        body('email')
            .notEmpty().withMessage('Email is required'),
    ]
};
