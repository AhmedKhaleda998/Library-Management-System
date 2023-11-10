const { Op } = require('sequelize');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

// Import the Book model from the '../models/borrow' file
const { Book } = require('../models/borrow');

// View all books
exports.viewAll = async (req, res) => {
    try {
        // Fetch all books from the database, ordered by title in ascending order
        const books = await Book.findAll({ order: [['title', 'ASC']] });
        res.json({ message: 'Fetching all books', books });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// View a specific book by ID
exports.view = async (req, res) => {
    try {
        const { id } = req.params;
        // Find a book by its primary key (ID)
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Fetching book by id', book });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create a new book
exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return 400 (Bad Request) if there are validation errors
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    try {
        // Extract book details from the request body
        const { title, author, quantityAvailable, isbn, location } = req.body;

        // Create a new book with a generated UUID as the ID
        const book = await Book.create({ id: uuid(), title, author, quantityAvailable, isbn, location });
        res.status(201).json({ message: 'Book created', book });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a book
exports.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return 400 (Bad Request) if there are validation errors
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    try {
        const { id } = req.params;
        // Extract book details from the request body
        const { title, author, quantityAvailable, isbn, location } = req.body;

        // Find the book by its primary key (ID)
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Update the book details
        book.title = title || book.title;
        book.author = author || book.author;
        book.quantityAvailable = quantityAvailable || book.quantityAvailable;
        book.isbn = isbn || book.isbn;
        book.location = location || book.location;

        // Save the updated book details to the database
        await book.save();
        res.json({ message: 'Book updated', book });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a book
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the book by its primary key (ID)
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Delete the book from the database
        await book.destroy();
        res.json({ message: 'Book deleted', book });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Search for books based on title, author, or ISBN
exports.search = async (req, res) => {
    try {
        // Extract search parameters from the query string
        const { title, author, isbn } = req.query;

        // Define search conditions based on the provided parameters
        const searchConditions = {
            [Op.or]: [
                title && { title: { [Op.like]: `%${title}%` } },
                author && { author: { [Op.like]: `%${author}%` } },
                isbn && { isbn: { [Op.like]: `%${isbn}%` } },
            ].filter(Boolean),
        };

        // Search for books that match the specified conditions, ordered by title in ascending order
        const books = await Book.findAll({ where: searchConditions, order: [['title', 'ASC']] });
        res.json({ message: 'Searching books', books });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
