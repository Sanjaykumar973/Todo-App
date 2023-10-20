const express = require("express");
const mongoose = require("mongoose");

const app = express();
const cors = require("cors");

//Middleware
const { checkBodyParams, isLoggedIn } = require("./midllewares/Generals.js");

// import controllors

const {signup, login, activateAccount, sendForgetPasswordLink, hanldePasswordUpdateDetials,} = require("./controllors/authentication");
const { addTodo, readTodo, markAsComplete, deleteTodo,} = require ("./controllors/todo");


app.use(express.json());
app.use(cors());

//Database connection
mongoose
  .connect(
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.6"
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error connecting", err.message));



  //***********AUTHENTICATION ******************

// SingUp |POST|
app.post("/api/auth/singup", checkBodyParams, signup );
// Route that will handle the account activation link sent on email
app.get("/auth/activate-account/:token", activateAccount );
//  Login |POST|
app.post("/api/auth/login",login); 
//sending forget password link
app.post("/forget-password", sendForgetPasswordLink);
//handle password
app.post("/handle-password-update", hanldePasswordUpdateDetials); 




//***********TODO ******************
//Add Todo   (Need to token alse will not allow)
app.post("/api/todo/add", isLoggedIn, addTodo);

//Read Todo
app.get("/api/todo/get", isLoggedIn, readTodo );

// Tip: whenever you wanted to designs an API where document will be updated or delete always spacify the
// _id or docId in the url params of api
// Update Todo(UsrId, title, description, completed, todoId)
app.put("/todo/mark-complete/:todoId", isLoggedIn, markAsComplete );

//Delete Todo
app.delete("/todo/delete/:todoId", isLoggedIn, deleteTodo);




app.listen(3010, () => console.log("Server is running at port 3010"));
