var passport = require('passport');
var express = require('express');
var router = express.Router();

var User = require('./../models/user');

// Register
router.get('/', function(req, res, next) {
    res.render('register');
});
router.post('/', function(req, res) {
    User.create(req.body, function(err, created) {
        if (err) {
            return;
        }

        res.status(200).json({
            data: created
        });
    })
});

//Login
router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/hello', passport.authenticate('bearer', { session: false }), function(req, res) {
    res.status(200).json({
        body: 'Hello'
    });
});

router.post('/login', passport.authenticate('bearer', { session: false }), function(req, res) {
    var obj = {
        username: req.user.username,
        access_token: req.user.acess_token
    };

    res.status(200).json({
        user: obj
    });
});

router.post('/auth', function(req, res) {
    console.log(req.body)
    User.findOne({
        username: req.body.username,
        password: req.body.password
    }, function(err, result) {
        if (err) {
            return;
        }

        var obj = {
            username: result.username,
            access_token: result.acess_token
        };

        res.status(200).json({
            user: obj
        });
    })
})

// Delete
router.post('/:id', function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err, deleted) {
        if (err) {
            return;
        }

        res.redirect('/users');
    });
});

module.exports = router;
