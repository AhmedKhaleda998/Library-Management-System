// Import the Sequelize library
const { Sequelize } = require('sequelize');

// Create a new instance of Sequelize with connection details
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,   // The host where your MySQL server is running
    dialect: 'mysql',    // The database dialect (MySQL in this case)
});

// Export the configured Sequelize instance for use in other parts of your application
module.exports = sequelize;
