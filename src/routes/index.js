const userRoutes = require('./users');
const authRoutes = require('./auth');
const meRoutes = require('./me');
const trackRoutes = require('./tracks');
const lyricRoutes = require('./lyrics');
const genreRotues = require('./genres');
const albumRoutes = require('./albums');

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

    // - /api/lyrics
    app.use('/api/lyrics', lyricRoutes);

    // - /api/genres
    app.use('/api/genres', genreRotues);

    // - /api/genres
    app.use('/api/albums', albumRoutes);
};

module.exports = routes;
