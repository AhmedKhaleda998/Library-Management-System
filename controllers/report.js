const { Op } = require('sequelize');
const fastCsv = require('fast-csv');
const XLSX = require('xlsx');

const { Borrow, Book, Borrower } = require('../models/borrow');

// Function to generate analytical reports and export data
exports.generateReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        // Validate startDate and endDate to ensure they are valid date strings
        if (!startDate || !endDate || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
            return res.status(400).json({ error: 'Invalid date format for startDate or endDate' });
        }

        // Define conditions based on the specified period
        const dateConditions = {
            [Op.between]: [new Date(startDate), new Date(endDate)],
        };

        // Get all borrow records that meet the specified conditions
        const borrows = await Borrow.findAll({
            where: { borrowDate: dateConditions },
            include: [
                { model: Book, attributes: ['title', 'author', 'isbn'] },
                { model: Borrower, attributes: ['name', 'email'] },
            ],
        });

        // Export data in CSV format
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=borrow_report.csv');
        fastCsv.writeToStream(res, borrows.map(formatBorrowDataToCSV), { headers: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Helper function to format borrow data for CSV export
function formatBorrowDataToCSV(borrow) {
    return {
        'Borrow ID': borrow.id,
        'Borrow Date': borrow.borrowDate.toISOString(),
        'Return Date': borrow.returnDate ? borrow.returnDate.toISOString() : "Not Returned Yet",
        'Due Date': borrow.dueDate.toISOString(),
        'Book Title': borrow.Book.title,
        'Book Author': borrow.Book.author,
        'Book ISBN': borrow.Book.isbn,
        'Borrower Name': borrow.Borrower.name,
        'Borrower Email': borrow.Borrower.email,
    };
};
