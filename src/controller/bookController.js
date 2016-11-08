var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;


var bookController = function(bookService, nav) {

    var middleware = function(req, res, next) {
        if (!req.user) {
            res.redirect('/');
        }
        next();
    };

    var url = 'mongodb://localhost:27017/libraryApp';

    // Get all the books in Db
    var getIndex = function(req, res) {
        mongodb.connect(url, function(err, db) {
            var collection = db.collection('books');
            collection.find({}).toArray(function(err, results) {
                res.render('bookListView', {
                    title: 'My Page',
                    nav: nav,
                    books: results
                });
            });
        });
    };

    // Get just the book for which we provide the id
    var getById = function(req, res) {

        var id = new objectId(req.params.id);
        mongodb.connect(url, function(err, db) {
            var collection = db.collection('books');
            collection.findOne({
                _id: id
            }, function(err, results) {
                bookService.getBookById(results.bookId, function(err, book) {
                    results.book = book;
                    console.log('dfdfdf');
                    res.render('bookView', {
                        title: 'My Book',
                        nav: nav,
                        book: results
                    });
                });
            });
        });
    };

    return {
        getIndex: getIndex,
        getById: getById,
        middleware: middleware
    };
};

module.exports = bookController;