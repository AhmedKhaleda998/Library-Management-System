const { body } = require('express-validator');

// Import the Book model from the '../models/borrow' file
const { Book } = require('../models/borrow');

exports.isBook = () => {
    return [
        // Use express-validator to define validation rules
        body('title')
            .trim().isLength({ min: 1, max: 256 }).withMessage('Title must be between 1 and 256 characters'),
        body('author')
            .trim().isLength({ min: 1, max: 256 }).withMessage('Author name must be between 1 and 256 characters'),
        body('quantityAvailable')
            .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
        body('isbn')
            .trim().isLength({ min: 8, max: 18 }).withMessage('ISBN must be between 8 and 18 characters'),
        body('location')
            .trim().isLength({ min: 1, max: 256 }).withMessage('Location must be between 1 and 256 characters'),

        // Custom validation function to body if the book with the given ISBN already exists
        body('isbn').custom(async (isbn) => {
            const existingBook = await Book.findOne({ where: { isbn } });
            if (existingBook) {
                throw new Error('Book with the same ISBN already exists');
            }
            return true;
        }),
    ]
};

exports.requiredFields = () => {
    return [
        body('title')
            .notEmpty().withMessage('Title is required'),
        body('author')
            .notEmpty().withMessage('Author is required'),
        body('quantityAvailable')
            .notEmpty().withMessage('Quantity is required'),
        body('isbn')
            .notEmpty().withMessage('ISBN is required'),
        body('location')
            .notEmpty().withMessage('Location is required'),
    ]
};