const lastfmRoutes = require('./lastfm');
const postRoutes = require('./posts');
const userRoutes = require('./users');
const imageRoutes = require('./images');

const constructorMethod = (app) => {
    app.use('/lastfm', lastfmRoutes);
    app.use('/posts', postRoutes);
    app.use('/users', userRoutes);
    app.use('/image', imageRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'This endpoint does not exist!'});
    });
};

module.exports = constructorMethod;