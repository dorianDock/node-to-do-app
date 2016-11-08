var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/libraryApp';

module.exports = function() {
    // We check for the user in Db
    passport.use(new LocalStrategy({
        userNameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, username, password, done) {
        var user = {
            username: username,
            password: password
        };

        mongodb.connect(url, function(err, db) {
            var collection = db.collection('users');
            collection.findOne({
                username: username
            }, function(err, results) {
                if (!results) {
                    console.log('Dont know user');
                    return done(null, false, {
                        message: 'Unknown User'
                    });
                }
                if (results.password === password) {
                    console.log('User was found');
                    var user = results;
                    req.session.username = req.body.username;
                    done(null, user);
                } else {
                    console.log('Not good pwd');
                    done(null, false, {
                        message: 'Invalid Password'
                    });
                    //done(null, false);
                }
            });
        });
    }));
};