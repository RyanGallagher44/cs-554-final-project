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

//Main function that generates a profile picture from the users requests
router.get('/generate/:source/:border/:background/:uid', function(req, res) {
    let source = req.params.source + ".jpg"
    let background = req.params.background;
    let borderColor = req.params.border;
    gm('./pictures/' + source)
      .fill(background)
      .opaque("white")
      .borderColor(borderColor)
      .border(40,40)
      .write(`./uploads/profilePicture_${req.params.uid}.jpg`, function (err) {
        if (!err) return;
  });
});

module.exports = router;
