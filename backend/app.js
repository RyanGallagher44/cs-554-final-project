const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(3030, async () => {
    console.log("Your routes will be running on http://localhost:3030");
});