var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Welcome to Pixel Images');
});
router.get('/favicon', function(req, res, next) {
  res.statusCode = 200;
  
})

module.exports = router;
