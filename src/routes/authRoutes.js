var express = require('express');

var authRouter = express.Router();

var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var url = 'mongodb://localhost:27017/libraryApp';

var router = function() {
    authRouter.route('/signUp')
        .post(function(req, res) {
            console.log(req.body);
            mongodb.connect(url, function(err, db) {
                var collection = db.collection('users');
                var user = {
                    username: req.body.username,
                    password: req.body.password
                };
                collection.insert(user, function(err, results) {
                    req.login(results.ops[0], function() {
                        res.redirect('/auth/profile');
                    });
                });
            });

        });

    authRouter.route('/signIn')
        .post(passport.authenticate('local', {
            failureRedirect: '/'
        }), function(req, res) {
            res.redirect('/auth/profile');
        });

    authRouter.route('/logout')
        .get(function(req, res) {
            req.logout();
            delete(req.session.username);
            res.redirect('/');
        });



    // the .all gets executed BEFORE the get call
    authRouter.route('/profile')
        .all(function(req, res, next) {
            if (!req.user) {
                res.redirect('/');
            }
            next();
        })
        .get(function(req, res) {
            //            res.json(req.user);
            res.render('profile', {
                title: 'My Profile',
                isLogged: true,
                user: req.user
            });
        });
    return authRouter;
};


module.exports = router;