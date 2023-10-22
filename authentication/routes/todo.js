const express = require("express");

const router = express.Router();

//import controllor
const { 
    addTodo, 
    readTodo, 
    markAsComplete, 
    deleteTodo,} = require ("../controllors/todo");

const {isLoggedIn} = require("../midllewares/Generals");

//***********TODO ******************
//Add Todo   (Need to token alse will not allow)
router.post("/add", isLoggedIn, addTodo);

//Read Todo
router.get("/get", isLoggedIn, readTodo );

// Tip: whenever you wanted to designs an API where document will be updated or delete always spacify the
// _id or docId in the url params of api
// Update Todo(UsrId, title, description, completed, todoId)
router.put("/mark-complete/:todoId", isLoggedIn, markAsComplete );

//Delete Todo
router.delete("/delete/:todoId", isLoggedIn, deleteTodo);

module.exports = router;