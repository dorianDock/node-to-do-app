var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();
var port = process.env.PORT || 5000;

// Our nav bar is just a table of Js Objects
var nav = [{
    Link: '/Books',
    Text: 'Books'
}, {
    Link: '/Authors',
    Text: 'Authors'
}];


var bookRouter = require('./src/routes/bookRoutes.js')(nav);
var adminRouter = require('./src/routes/adminRoutes.js')(nav);
var authRouter = require('./src/routes/authRoutes.js')(nav);
var todoRouter = require('./src/routes/todoRoutes.js')();




// used by express FIRST
// each time a request is made for ex css/styles.css, it is going to look in public first
app.use(express.static('public'));


// Analyse the request body to parse automatoically Json and URLs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// this a string used to provide a secure hash for secrued regions of our app
app.use(session({
    secret: 'library'
}));


require('./src/config/passport')(app);

// another static directory > looks first in the public folder, and then in views (as a static folder)
// app.use(express.static('src/views'));
// if we want to use a templating engine:
app.set('views', './src/views');
app.set('view engine', 'ejs');


app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);
app.use('/Todos', todoRouter);

// matching / request and responding to it
app.get('/', function(req, res) {

    var isLogged = req.session.username;
    console.log(req.session);

    res.render('index', {
        title: 'My Page',
        nav: nav,
        isLogged: isLogged
    });
});
//// matching /books request and responding to it
//app.get('/books', function(req, res) {
//    res.send('Hello men');
//});
// Starts the server
app.listen(port, function(err) {
    console.log('running on port: ' + port);
});