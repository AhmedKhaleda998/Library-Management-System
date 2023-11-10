// Import the express library
const express = require('express');

// Create an instance of the express Router
const router = express.Router();

// Import the bookController for handling book-related operations
const bookController = require('../controllers/book');

// Import the validations for book-related operations
const bookValidations = require('../validations/book');

// Define the routes for book-related operations

// Route to search for books based on title, author, or ISBN
router.get('/search', bookController.search);

// Route to get a list of all books
router.get('/', bookController.viewAll);

// Route to get information about a specific book by ID
router.get('/:id', bookController.view);

// Route to create a new book
router.post('/', bookValidations.requiredFields(), bookValidations.isBook(), bookController.create);

// Route to update information about a specific book by ID
router.put('/:id', bookValidations.isBook(), bookController.update);

// Route to delete a book by ID
router.delete('/:id', bookController.delete);

// Export the router to use in other parts of the application
module.exports = router;
