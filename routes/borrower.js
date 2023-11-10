// Import the express library
const express = require('express');

// Create an instance of the express Router
const router = express.Router();

// Import the borrowerController for handling borrower-related operations
const borrowerController = require('../controllers/borrower');

// Import the validations for borrower-related operations
const borrowerValidations = require('../validations/borrower');

// Define the routes for borrower-related operations

// Route to get a list of all borrowers
router.get('/', borrowerController.viewAll);

// Route to get information about a specific borrower by ID
router.get('/:id', borrowerController.view);

// Route to register a new borrower
router.post('/register', borrowerValidations.requiredFields(), borrowerValidations.isBorrower(), borrowerController.register);

// Route to update information about a specific borrower by ID
router.put('/:id', borrowerValidations.isBorrower(), borrowerController.update);

// Route to delete a borrower by ID
router.delete('/:id', borrowerController.delete);

// Export the router to use in other parts of the application
module.exports = router;
