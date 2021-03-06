var express = require('express');
var bookRouter = express.Router();


var router = function(nav) {

    // Api calls to get our books
    var bookService = require('../services/goodreadsService')();

    var bookController = require('../controller/bookController')(bookService, nav);
    //    bookRouter.use(bookController.middleware);

    // Routes
    bookRouter.route('/').get(bookController.getIndex);
    bookRouter.route('/:id').get(bookController.getById);

    return bookRouter;
};



module.exports = router;