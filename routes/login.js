var express = require('express');
var router = express.Router();
var HTTPerror = require('../lib/HTTPError');
var user = require('../lib/user');

router.get('/', function(req, res, next) {
    res.render("login/login", { "userid": req.session.userid, "error": null });
});


function accept_login(req, login)
{
    req.session.userid = login;
}

router.post('/' , function (req, res) {
    var options = { "userid": req.body.userid, "error": null };
    if (!req.body.userid) {
        options.error = new HTTPerror(400, "User name is required");
        res.render("login/login", options);
    } else if (req.body.userid == req.session.userid) {
        // User has not changed username, accept it as-is
        res.redirect("/");
    } else if (!req.body.userid.match(/^[a-zA-Z0-9\-_]{3,}$/)) {
        options.error = new HTTPerror(400, "User name must have at least 3 alphanumeric characters");
        res.render("login/login", options);
    } else if (!req.body.userpass){
        options.error = new HTTPerror(400, "Password is required");
        res.render("login/login", options);
    } else {
        user.check_login(req.body.userid, req.body.userpass).done(function(loggedin){
            if(loggedin) {
                accept_login(req, req.body.userid);
                res.redirect("/");
            } else {
                options.error = new HTTPerror(401, "Password mismatch");
                res.render("login/login", options);
            }
        }, function(err) {
            options.error = new HTTPerror(401, "Unable to login : "+err.message);
            res.render("login/login", options);
        });
    }
});

router.get('/logout', function(req, res){
    delete req.session.userid;
    res.redirect('login');
});

router.get('/createuser', function(req, res)
{
    res.render("user/createuser", {"error" : false});
});

router.post('/createuser', function(req, res) {
    input_userid = req.body.userid;
    if(!input_userid)
    {
        res.render("user/createuser", {"error": new HTTPerror(401, "Cannot create empty user")});
        return;
    }
    //Check unicity
    user.does_exist(input_userid).done(function(exists){
        if(exists)
            res.render("user/createuser", {"error": new HTTPerror(409, "User already exists")});
        else
            user.create(input_userid, req.body.userpass).done(function(){
                accept_login(req, input_userid);
                res.redirect("/");
            }, function(err) {
                res.render("user/createuser", {"error": new HTTPerror(401, err.message)});
            });

    }, function(err){res.render("user/createuser", {"error": err})});
});

module.exports = router;
