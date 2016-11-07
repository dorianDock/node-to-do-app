var passport = require('passport');

module.exports = function(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        // null is here for the error, normally it would be done(err, user)
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        // null is here for the error, normally it would be done(err, user)
        done(null, user);
    });

    require('./strategies/local.strategy')();
};