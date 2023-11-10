// Import necessary components from Sequelize library
const { Sequelize, DataTypes } = require('sequelize');

// Import the configured Sequelize instance from the database configuration file
const sequelize = require('../configurations/database');

// Import other models (Book and Borrower) for associations
const Book = require('./book');
const Borrower = require('./borrower');

// Define the Borrow model
const Borrow = sequelize.define('Borrow', {
    // Model attributes are defined here

    // ID attribute using UUID as the data type, automatically generated with a default value
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,       // Indicates that this attribute is the primary key
        allowNull: false       // The ID should not be null
    },

    // Borrow Date attribute as a date, automatically set to the current date and time and should not be null
    borrowDate: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },

    // Return Date attribute as a date, can be null (indicating the book is not yet returned)
    returnDate: {
        type: DataTypes.DATE,
        allowNull: true
    },

    // Due Date attribute as a date, should not be null
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
});

// Associations
// Each Borrow belongs to a Book and a Borrower
// Each Book and Borrower can have multiple Borrows
Book.hasMany(Borrow);
Borrower.hasMany(Borrow);
Borrow.belongsTo(Book);
Borrow.belongsTo(Borrower);

// Export the models for use in other parts of the application
module.exports = {
    Book,
    Borrower,
    Borrow,
};
