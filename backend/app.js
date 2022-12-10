const express = require('express');
const app = express();
const cors = require('cors');
const configRoutes = require('./routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

configRoutes(app);

app.listen(3030, async () => {
    console.log("Your routes will be running on http://localhost:3030");
});