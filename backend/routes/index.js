const lastfmRoutes = require('./lastfm');
const postRoutes = require('./posts');
const userRoutes = require('./users');

const constructorMethod = (app) => {
    app.use('/lastfm', lastfmRoutes);
    app.use('/posts', postRoutes);
    app.use('/users', userRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'This endpoint does not exist!'});
    });
};

module.exports = constructorMethod;