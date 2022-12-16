const gm = require('gm');
const express = require('express');
const router = express.Router();

//Test function to identify information about image
router.get('/identify', function(req, res) {
    gm('./pictures/guitar.png')
      .identify(function (err, data) {
      if (!err) return res.json(data)
      else return res.json(err)
  });
});

//Function to create a border around the picture
router.get('/draw', function(req, res) {
    gm('./pictures/guitar.png')
      .borderColor("Green")
      .border(20,20)
      .write("./pictures/guitar.png", function (err) {
        if (!err) console.log('done');
  });
});

module.exports = router;
