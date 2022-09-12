const userRoutes = require('./users');

const routes = (app) => {
    app.get('/', (req, res) =>
        res.json({
            message: 'Welcome to Catchy Music Api Website',
        }),
    );

    app.use('/api/users', userRoutes);
};

module.exports = routes;
