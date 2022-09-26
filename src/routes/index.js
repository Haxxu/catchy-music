const userRoutes = require('./users');
const authRoutes = require('./auth');
const meRoutes = require('./me');
const trackRoutes = require('./tracks');

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

    // - /api/me
    app.use('/api/me', meRoutes);

    // - /api/tracks
    app.use('/api/tracks', trackRoutes);
};

module.exports = routes;
