// Import necessary components from Sequelize library
const { Sequelize, DataTypes } = require('sequelize');

// Import the configured Sequelize instance from the database configuration file
const sequelize = require('../configurations/database');

// Define the Book model
const Book = sequelize.define('Book', {
    // Model attributes are defined here

    // ID attribute using UUID as the data type, automatically generated with a default value
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,       // Indicates that this attribute is the primary key
        allowNull: false       // The ID should not be null
    },

    // Title attribute as a string, should not be null
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Author attribute as a string, should not be null
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // ISBN attribute as a string, should not be null and must be unique
    isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    // Quantity Available attribute as an integer, should not be null
    quantityAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    // Location attribute as a string, should not be null
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

// Export the Book model for use in other parts of the application
module.exports = Book;
