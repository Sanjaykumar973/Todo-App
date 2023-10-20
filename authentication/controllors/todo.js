

const Todos = require("../modals/todo");
const addTodo = (req, res) => {
    //1. i wil verify the token (token will be present in req.headers )
    const { title, description } = req.body;
  
    Todos.create({ title, description, createdBy: req.tokenData._id })
      .then(() => res.json({ success: true, message: "Todo Added" }))
      .catch((err) => res.json({ success: false, message: err.message }));
  };

  const readTodo = (req, res) => {
    Todos.find({ createdBy: req.tokenData._id })
      .then((Todos) => res.json({ success: true, todos: Todos }))
      .catch((err) => res.json({ success: false, message: err.message }));
  };

  const markAsComplete = (req, res) => {
    const todoId = req.params.todoId;
    //Give me the todo with given id and created by loggedin User
    Todos.findOneAndUpdate(
      { _id: todoId, createdBy: req.tokenData._id },
      { completed : true}
    )
      .then((doc) => {
        if (doc) {
          return res.json({ success: true, data: "todo updated" });
        } else {
          return res.json({ success: false, data: "No Document found" });
        }
      })
      .catch((err) => res.json({ success: false, data: err.message }));
  };

  const deleteTodo = (req, res) => {
    Todos.findOneAndDelete({
      _id: req.params.todoId,
      createdBy: req.tokenData._id,
    })
      .then((doc) => {
        if (doc) {
          return res.json({ success: true, data: "Document deleted" });
        } else {
          return res.json({ success: false, data: " No Document found" });
        }
      })
      .catch((err) => res.json({ success: false, data: err.message }));
  };

  module.exports ={ addTodo, readTodo, markAsComplete, deleteTodo,};