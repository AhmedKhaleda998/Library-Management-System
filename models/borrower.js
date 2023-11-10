// Import necessary components from Sequelize library
const { Sequelize, DataTypes } = require('sequelize');

// Import the configured Sequelize instance from the database configuration file
const sequelize = require('../configurations/database');

// Define the Borrower model
const Borrower = sequelize.define('Borrower', {
    // Model attributes are defined here

    // ID attribute using UUID as the data type, automatically generated with a default value
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,       // Indicates that this attribute is the primary key
        allowNull: false       // The ID should not be null
    },

    // Name attribute as a string, should not be null
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Email attribute as a string, should not be null and must be unique
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    // Registered Date attribute as a date, automatically set to the current date and should not be null
    registeredDate: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,   // Set the default value to the current date and time
        allowNull: false
    },
});

// Export the Borrower model for use in other parts of the application
module.exports = Borrower;
