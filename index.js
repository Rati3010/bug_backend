const express = require("express");
const { connection } = require("./config/db");
const { UserModel } = require("./models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

 
require("dotenv").config();
mongoose.set('strictQuery', true);
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.get("/",(req,res)=>{
  res.send("home")
})
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const checkEmail = await UserModel.find({ email });
  if (checkEmail.length > 0) {
    res.send({ msg: "Email already exist" });
  } else {
    try {
      bcrypt.hash(password, 4, async (err, hash) => {
        if (err) {
          console.log(err);
          res.send({ msg: "Registration Failed" });
        } else {
          const new_user = new UserModel({ email, password: hash });
          await new_user.save();
          res.send({ msg: "Registration Success" });
        }
      });
    } catch (error) {
      console.log(error);
      res.send({ msg: "Registration Failed" });
    }
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkEmail = await UserModel.find({ email });
    if (checkEmail.length > 0) {
      const hashed = checkEmail[0].password;
      bcrypt.compare(password, hashed, (err, result) => {
        if (err) {
          console.log(err);
          res.send({ err: "Login failed" });
        }
        if (result) {
          const token = jwt.sign({ id: checkEmail[0]._id }, process.env.key);
          res.send({ msg: "Login Successfull", token: token });
        } else {
          res.send({ msg: "your passwor is not correct" });
        }
      });
    } else {
      res.send({ msg: "Login First" });
    }
  } catch (error) {
    console.log(error);
    res.send({ msg: "something went wrong" });
  }
});
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    console.log("Database is not responding");
  }
});
