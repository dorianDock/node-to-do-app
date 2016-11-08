var express = require('express');
var todoRouter = express.Router();

var router = function() {
    var todoController = require('../controller/todoController')();

    todoRouter.use(todoController.middleware);

    // Routes
    // List of todos
    todoRouter.route('/').get(todoController.getIndex);
    // A particular todo
    todoRouter.route('/:id').get(todoController.getById);
    // Display creation form
    //    todoRouter.route('/createToDo').get(todoController.new);
    // Create a todo
    todoRouter.route('/createToDo').post(todoController.create);




    //    // Delete one
    //    todoRouter.route('/:id').delete(todoController.delete);
    //    // Update one
    //    todoRouter.route('/:id').patch(todoController.delete);
    return todoRouter;

};

module.exports = router;