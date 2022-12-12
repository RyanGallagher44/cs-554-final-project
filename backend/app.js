const express = require('express');
const app = express();
const cors = require('cors');
const configRoutes = require('./routes');

const jsonErrorHandler = (err, req, res, next) => {
    res.status(500).send({ error: err.toString() });
  }

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
configRoutes(app);
app.use(jsonErrorHandler);

app.listen(3030, async () => {
    console.log("Your routes will be running on http://localhost:3030");
});