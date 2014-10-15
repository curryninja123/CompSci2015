var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/info', function(req, res) {
  res.render('info', { title: 'Express' });
});

router.get('/downloads', function(req, res) {
  res.render('downloads', { title: 'Express' });
});

module.exports = router;
