exports.get404 = (req, res, next) => {
    res.status(404).json({ error: 'Page not found' });
};

exports.get500 = (req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error' });
};
