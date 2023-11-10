// Import the express library
const express = require('express');

// Create an instance of the express Router
const router = express.Router();

// Import the borrowController for handling borrow-related operations
const borrowController = require('../controllers/borrow');
const reportController = require('../controllers/report');

// Define the routes for borrow-related operations

// Route to get all borrow processes last month
router.get('/lastMonth', borrowController.viewLastMonth);

// Route to get information about all borrowed books
router.get('/', borrowController.allBorrowedBooks);

// Route to get all due books last month
router.get('/due/lastMonth', borrowController.dueBooksLastMonth);

// Route to get all due books, optionally filtered by a specific borrower
router.get('/due', borrowController.dueBooks);

// Route to get information about books borrowed by a specific borrower
router.get('/:borrowerId', borrowController.borrowedBooks);

// Route to borrow a specific book by a specific borrower
router.post('/:borrowerId/:bookId', borrowController.borrowBook);

// Route to return a specific book by a specific borrower
router.post('/return/:borrowerId/:bookId', borrowController.returnBook);

// Route to generate analytical reports
router.post('/report', reportController.generateReports);

// Export the router to use in other parts of the application
module.exports = router;
