const express = require("express");
const mongoose = require("mongoose");

const app = express();
const cors = require("cors");

//import routers


const authRouter = require("./routes/auth");
const todoRouter = require("./routes/todo");

//setting app
app.use(express.json());
app.use(cors());

//configuring Rounters
app.use("/auth", authRouter);
app.use("/todo", todoRouter);

//Database connection
mongoose
  .connect(
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.6"
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error connecting", err.message));

app.listen(3010, () => console.log("Server is running at port 3010"));
