var express = require('express');
var router = express.Router();
var login = require('./login');

/* MAPPED TO controllers/main */


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index", {"userid":req.session.userid});
});

/* Subpages */
router.get('/profile', function(req, res, next){
  res.render("user/profile", {"userid":req.session.userid});
});

router.get('/tournament_creator', function(req, res, next){
  res.render("tournament/tournament_creator", {"userid":req.session.userid});
});

router.post('/tournament_creator', function(req, res, next){
  var participants = req.body.participants;

});

module.exports = router;

