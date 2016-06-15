var express = require('express');
var router = express.Router();
var user = require('../lib/user');
var AjaxResponse = require('../lib/AjaxResponse');

router.post('/set_sequence', function(req, res) {
    var sequence = req.body.sequence;
    if(!sequence) {
        res.status(400);
        res.send(new AjaxResponse({}, new Error("Empty sequence")));
    }
    user.set_sequence(req.userid, sequence).done(function(){
        res.send(new AjaxResponse({}));
    }, function(err){
        res.status(500);
        res.send(new AjaxResponse({}, err));
    });
});


router.get('/get_sequence', function(req, res) {

    user.get_sequence(req.userid).done(function(sequence){
        res.send(new AjaxResponse({sequence:sequence}));
    }, function(err){
        res.status(500);
        res.send(new AjaxResponse({}, err));
    });
});

router.get('/:userid/exist', function(req, res){
    var userid=req.params.userid;
    if(!userid)
        res.send(new AjaxResponse({exist:false}));
    user.does_exist(userid).done(function(does_exist){
        res.send(new AjaxResponse({exist:does_exist}))
    }, function(err){
        res.status(500);
        res.send(new AjaxResponse({}, err));
    });
});

module.exports = router;