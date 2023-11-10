const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

// Import the Borrower model from the '../models/borrow' file
const { Borrower } = require('../models/borrow');

// View all borrowers
exports.viewAll = async (req, res) => {
    try {
        // Fetch all borrowers from the database, ordered by name in ascending order
        const borrowers = await Borrower.findAll({ order: [['name', 'ASC']] });
        res.json({ message: 'Fetching all borrowers', borrowers });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// View a specific borrower by ID
exports.view = async (req, res) => {
    try {
        const { id } = req.params;
        // Find a borrower by its primary key (ID)
        const borrower = await Borrower.findByPk(id);
        if (!borrower) {
            return res.status(404).json({ error: 'Borrower not found' });
        }
        res.json({ message: 'Fetching Borrower', borrower });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Register a new borrower
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return 400 (Bad Request) if there are validation errors
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    try {
        // Extract borrower details from the request body
        const { name, email } = req.body;

        // Create a new borrower with a generated UUID as the ID and the current date as the registration date
        const borrower = await Borrower.create({ id: uuid(), name, email, registeredDate: new Date() });
        res.status(201).json({ message: 'Borrower created', borrower });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a borrower
exports.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return 400 (Bad Request) if there are validation errors
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    try {
        const { id } = req.params;
        // Extract borrower details from the request body
        const { name, email } = req.body;

        // Find the borrower by its primary key (ID)
        const borrower = await Borrower.findByPk(id);
        if (!borrower) {
            return res.status(404).json({ error: 'Borrower not found' });
        }

        // Update the borrower details
        borrower.name = name || borrower.name;
        borrower.email = email || borrower.email;

        // Save the updated borrower details to the database
        await borrower.save();
        res.json({ message: 'Borrower updated', borrower });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a borrower
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the borrower by its primary key (ID)
        const borrower = await Borrower.findByPk(id);
        if (!borrower) {
            return res.status(404).json({ error: 'Borrower not found' });
        }

        // Delete the borrower from the database
        await borrower.destroy();
        res.json({ message: 'Borrower deleted', borrower });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
