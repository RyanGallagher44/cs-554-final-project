const express = require("express");
const lastFmRoutes = require('./lastFmRoutes')

const constructorMethod = (app) => {
  app.use(express.json());
  app.use('/', lastFmRoutes);
  app.use('*', (req, res) => {
    res.status(404);
  });
};


module.exports = constructorMethod;