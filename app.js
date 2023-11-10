const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const sequelize = require('./configurations/database');

const borrowRoutes = require('./routes/borrow');
const borrowerRoutes = require('./routes/borrower');
const bookRoutes = require('./routes/book');
const errors = require('./controllers/error');

const app = express();

// Add middleware for security, parsing, and CORS
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());

// Rate Limiting Middleware
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 requests per hour
    message: 'Too many requests from this IP, please try again later.',
});


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to GeekyAir Library!' });
});

// Apply rate limiting to specific endpoints
app.use('/borrows', apiLimiter);
app.use('/borrowers', apiLimiter);
app.use('/books', apiLimiter);

// Add routes
app.use('/books', bookRoutes);
app.use('/borrowers', borrowerRoutes);
app.use('/borrows', borrowRoutes);
app.use(errors.get404);

// Connect to database and start the server
sequelize.sync().then(() => {
    app.listen(process.env.PORT || 5200, () => {
        console.log(`App Running!`);
    });
});