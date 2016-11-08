var mongodb = require('mongodb').MongoClient;
// ObjectId allows us to get the id in the URL (called :id)
var objectId = require('mongodb').ObjectID;


var url = 'mongodb://localhost:27017/libraryApp';
var toDoCollection = 'todos';


var todoController = function() {

    // the middleware makes us that we cannot do anything if we are not signed in
    var middleware = function(req, res, next) {
        if (!req.user) {
            res.redirect('/');
        }
        next();
    };


    var getIndex = function(req, res) {
        mongodb.connect(url, function(err, db) {
            var collection = db.collection(toDoCollection);
            collection.find({}).toArray(function(err, todos) {
                res.render('todoList', {
                    title: 'My Todos',
                    todos: todos,
                    isLogged: req.session.username
                });
            });
        });
    };

    // Get just the todo for which we provide the id
    var getById = function(req, res) {
        var id = new objectId(req.params.id);
        mongodb.connect(url, function(err, db) {
            var collection = db.collection(toDoCollection);
            collection.findOne({
                _id: id
            }, function(err, results) {
                res.render('showTodo', {
                    title: 'Todo ' + id,
                    todo: results,
                    isLogged: req.session.username
                });
            });
        });
    };

    var create = function(req, res) {
        mongodb.connect(url, function(err, db) {
            console.log(req.user);
            var collection = db.collection(toDoCollection);
            var toDoToInsert = {
                title: req.body.title,
                createdAt: new Date(),
                shortExplanation: req.body.shortExplanation,
                userId: req.user._id
            };
            collection.insert(toDoToInsert, function(err, results) {
                console.log(results);
            });
            db.close();
            res.redirect('/todos');
        });
    };

    return {
        getIndex: getIndex,
        getById: getById,
        create: create,
        middleware: middleware
    };

};


module.exports = todoController;