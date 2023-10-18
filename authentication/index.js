const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer")

const { UserTodos } = require("./modals/User");
const Todos = require("./modals/Todo");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");

//Middleware
const { checkBodyParams, isLoggedIn } = require("./midllewares/Generals.js");

app.use(express.json());
app.use(cors());

//Database connection
mongoose
  .connect(
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.6"
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error connecting", err.message));

// SingUp |POST|
app.post("/api/auth/singup", checkBodyParams, (req, res) => {
  const { firstName, lastName, email, phone, age, gender, password } = req.body;

  // If account with this email is already exist
  UserTodos.findOne({ email: req.body.email })
    .then((User) => {
      // If Email exist return the response from here only
      if (User) {
        return res.json({ success: false, message: "Email Already Use!" });
      }
      
      // if email is new then first we will has the password
      bcrypt.hash(password, 10, (err, has) => {
        if (err) {
          return res.json({ success: false, message: err.message });
        }

        //Create User in Database
        UserTodos.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          age: age,
          gender: gender,
          password: has,
        })
          .then((newUser) => {
            // if account is created successfully then sent an account Activation mail
            
            // generate token
            const token = jwt.sign(
              {
                // firstName: newUser.firstName,
                // email: newUser.email,
                _id: newUser._id,
              },
              "2552",
              {expiresIn: 30*30}
            );
            
            // send this token on mail
              var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user : "sanjayka1993@gmail.com",
                  pass:"qugc vcsi fcxa hqgy",
                },
              });

              var mailOptions = {
                from:"sanjayka1993@gmail.com",
                to: newUser.email,
                subject:'Activate Your Account Todo',
                html:`
                <p>Hey ${newUser.firstName}, Wellcome in Todo APP. Your Account has been Created.
                In Order to use your Account you have  to verify your email by clicking on following link.
                </p>
                <a style="padding:10px; background-color: dodgerblue; color:white" href="http://localhost:3010/auth/activate-account/${token}"> Activate Account </a>
                `,
              };
              //sending email
              transporter.sendMail(mailOptions, function(error, info ){
                if(error){
                  return  res.json({ success: false, message: "Error Occured" })
                }
                else{
                  return res.json({ 
                    success: true, 
                    message: 
                    "An Account Activation Link has been given Email" 
                  });
                }
              });
            // res.json({ success: true, message: "Account Created" })
          })
          .catch((err) => res.json({ success: false, message: err.message }));
      });
    })
    .catch((err) => res.json({ success: false, message: err.message }));
});
// Route that will handle the account activation link sent on email
app.get("/auth/activate-account/:token", (req,res)=> {
  const token = req.params.token;
  //try to verify token
  try{
    const data= jwt.verify(token, "2552");
    
    //try to find the user now
    UserTodos.findOneAndUpdate(data._id, {emailVerified:true})
   .then (()=> res.json({success: true, message:"Account Activated. you can login"}))
   .catch(()=>res.json({success:false,  message:"Please Try again! we are sorry for inconvinece!"}));
  }
   
  catch(err)
  {
    return res.json({success:false, message:"Link has been Expired"})
  }
  
});
//  Login |POST|
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  console.log(req.headers);
  UserTodos.findOne({ email: email })
    .then((User) => {
      if (!User) {
        return res.json({ success: false, message: "Email not found" });
      }
      // checking only: if user Exist then we will check emailisverify or not
      if(User.emailVerified== false){
        return res.json({ 
          success: false, 
          message: "Please Verify Your Account by link sent on mail" 
        });
      }
      // if user exsit then compare password
      bcrypt.compare(password, User.password, (err, result) => {
        if (result == true) {
          // if password is verified
          // We well Generate a token
          const token = jwt.sign(
            {
              firstName: User.firstName,
              email: User.email,
              _id: User._id,
            },
            "2552",
            {expiresIn: 30*30}
          );

          return res.json({
            success: true,
            message: "Logged In",
            token: token,
            firstName: User.firstName,
          });
        } else {
          return res.json({ success: false, message: "Wrong Password" });
        }
      });
    })
    .catch((err) => res.json({ success: false, message: err.message }));
});

//Add Todo   (Need to token alse will not allow)
app.post("/api/todo/add", isLoggedIn, (req, res) => {
  //1. i wil verify the token (token will be present in req.headers )
  const { title, description } = req.body;

  Todos.create({ title, description, createdBy: req.tokenData._id })
    .then(() => res.json({ success: true, message: "Todo Added" }))
    .catch((err) => res.json({ success: false, message: err.message }));
});

//Read Todo
app.get("/api/todo/get", isLoggedIn, (req, res) => {
  Todos.find({ createdBy: req.tokenData._id })
    .then((Todos) => res.json({ success: true, todos: Todos }))
    .catch((err) => res.json({ success: false, message: err.message }));
});

// Tip: whenever you wanted to designs an API where document will be updated or delete always spacify the
// _id or docId in the url params of api
// Update Todo(UsrId, title, description, completed, todoId)
app.put("/todo/mark-complete/:todoId", isLoggedIn, (req, res) => {
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
});

//Delete Todo
app.delete("/todo/delete/:todoId", isLoggedIn, (req, res) => {
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
});

app.listen(3010, () => console.log("Server is running at port 3010"));
