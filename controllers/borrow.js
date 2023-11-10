const { Book, Borrower, Borrow, } = require('../models/borrow');
const { Sequelize } = require('sequelize');


// List all borrow processes last month
exports.viewLastMonth = async (req, res) => {
    try {
        // Get all borrow records last month
        const borrows = await Borrow.findAll({
            where: {
                borrowDate: {
                    [Sequelize.Op.lt]: new Date(),
                    [Sequelize.Op.gt]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
            },
            include: [{ model: Book, attributes: ['title', 'author', 'isbn'] }],
        });

        res.status(200).json({ message: 'Fetching all borrow processes last month', borrows });
    }
    catch (error) {
        console.error('Error fetching all borrow processes last month:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// List all borrowed books
exports.allBorrowedBooks = async (req, res) => {
    try {
        // Get all borrow records
        const borrows = await Borrow.findAll({
            where: { returnDate: null },
            include: [{ model: Book, attributes: ['title', 'author', 'isbn'] }],
        });

        res.status(200).json({ message: 'Fetching all borrowed books', borrows });
    } catch (error) {
        console.error('Error fetching all borrowed books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// List books currently borrowed by a borrower
exports.borrowedBooks = async (req, res) => {
    try {
        const { borrowerId } = req.params;

        // Get all borrow records for the given borrower
        const borrows = await Borrow.findAll({
            where: { BorrowerId: borrowerId, returnDate: null },
            include: [{ model: Book, attributes: ['title', 'author', 'isbn'] }],
        });

        res.status(200).json({ message: 'Fetching borrowed books', borrows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// List books due for return last month
exports.dueBooksLastMonth = async (req, res) => {
    try {
        // Get all borrow records that were due last month
        const borrows = await Borrow.findAll({
            where: {
                returnDate: null,
                dueDate: {
                    [Sequelize.Op.lt]: new Date(),
                    [Sequelize.Op.gt]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
            },
            include: [{ model: Book, attributes: ['title', 'author', 'isbn'] }],
        });

        res.status(200).json({ message: 'All due books last month', borrows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// List books due for return, optionally filtered by a specific borrower
exports.dueBooks = async (req, res) => {
    try {
        // Extract borrowerId from request parameters
        const { borrowerId } = req.params;

        // Define common query conditions
        const commonConditions = {
            returnDate: null,
            dueDate: { [Sequelize.Op.lt]: new Date() },
        };

        // Add additional condition for a specific borrower if borrowerId is present
        const borrowConditions = borrowerId ? { ...commonConditions, BorrowerId: borrowerId } : commonConditions;

        // Get all borrow records that meet the specified conditions
        const borrows = await Borrow.findAll({
            where: borrowConditions,
            include: [{ model: Book, attributes: ['title', 'author', 'isbn'] }],
        });

        res.status(200).json({ message: 'All due books', borrows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Borrow a book
exports.borrowBook = async (req, res) => {
    try {
        const { borrowerId, bookId } = req.params;

        // Check if the book and borrower exist
        const book = await Book.findByPk(bookId);
        const borrower = await Borrower.findByPk(borrowerId);

        if (!book || !borrower) {
            return res.status(404).json({ message: 'Book or borrower not found.' });
        }

        // Check if the book is available for borrow
        if (book.quantityAvailable <= 0) {
            return res.status(400).json({ message: 'Book is not available for borrow.' });
        }

        // Update book quantity and create a borrow record
        await Book.update({ quantityAvailable: book.quantityAvailable - 1 }, { where: { id: bookId } });

        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 14); // Assuming a 14-day borrow period

        const borrow = await Borrow.create({
            borrowDate: today,
            dueDate: dueDate,
            BookId: bookId,
            BorrowerId: borrowerId,
        });

        res.status(201).json({ message: 'Book borrowed successfully.', borrow });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Return a book
exports.returnBook = async (req, res) => {
    try {
        const { borrowerId, bookId } = req.params;

        // Check if the borrow record exists
        const borrow = await Borrow.findOne({
            where: { BookId: bookId, BorrowerId: borrowerId, returnDate: null },
        });

        if (!borrow) {
            return res.status(404).json({ message: 'Borrow record not found.' });
        }

        // Update book quantity and return date
        await Book.update({ quantityAvailable: Sequelize.literal('quantityAvailable + 1') }, { where: { id: bookId } });
        await Borrow.update({ returnDate: new Date() }, { where: { BookId: bookId, BorrowerId: borrowerId } });

        res.status(200).json({ message: 'Book returned successfully.', borrow });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
