const userRoutes = require('./users');
const authRoutes = require('./auth');

const routes = (app) => {
    // - /api
    app.get('/', (req, res) =>
        res.json({
            message: 'Welcome to Catchy Music Api Website',
        }),
    );

    // - /api/login
    app.use('/api/login', authRoutes);

    // - /api/users
    app.use('/api/users', userRoutes);
};

module.exports = routes;
