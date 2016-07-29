var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Home Page'});
});

router.post('/homepage', function(req, res, next) {
  res.redirect('/');
});

router.post('/chatroom', function (req, res, next) {
  res.render('chat', {username: req.body.name, title: 'Chat Room'});
})

module.exports = router;