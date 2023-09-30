// import http from "http"

// import randompercent from "./randompercent.js"
// import fs from 'fs';
// const home = fs.readFileSync("./index.html");

// const Port = 5000;

// randompercent();
// console.log(home);

// const server = http.createServer((req, res)=>{
//     if(req.url==='/'){
//         res.end("Home Page")
//     }else if(req.url==='/about'){
//         res.end(home)
//     }else if(req.url==='/contact'){
//         res.end("Contact Page")
//     } else{
//         res.end("Page not found 404:)")
//     }
// });

// server.listen(Port, ()=>{
//     console.log(`Server is working on Port ${Port}`);
// });















// import express from "express";
// const app = express();
// import path from "path";
// import cookieParser from "cookie-parser";
// const Port = 3000;

// app.use(express.static(path.join(path.resolve(), "public")));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.set("view engine", "ejs");

// import mongoose from "mongoose";
// mongoose
//   .connect("mongodb://127.0.0.1:27017", {
//     dbName: "backend",
//   })
//   .then(() => console.log("Connected to mongodb"))
//   .catch(() => console.log(e));

// const signupdetails = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String,
// });

// const Message = mongoose.model("signupdetails", signupdetails);

// const isAuthenticated = (req, res, next) => {
//   res.cookie("token", "abhishek");
//   // console.log(req.cookies);
//   const  token  = req.cookies;
//   if (token) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// };

// app.get("/login", (req, res) => {
//   res.render("login.ejs");
// });

// app.get("/signup", (req, res) => {
//   res.render("signup.ejs");
// });

// app.get("/logout", (req, res) => {
//   res.render("logout.ejs");
// });

// app.post("/logout", (req, res) => {
//   res.cookie("token", null, {
//     expires: new Date(Date.now()),
//   });
//   res.redirect("/login");
// });


// app.post("/signup", async (req, res) => {
//   // console.log(req.body);
//   await Message.create({
//     username: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//   });
  
//   // res.redirect("/success");
//   res.redirect("/login");
// });

// app.post("/login",  async (req, res) => {
//   res.cookie("token", "abhishek");
//   // console.log(req.cookies);
//   const  token  = req.cookies;
//   if (token) {
//     res.redirect("/logout");
//   } else {
//     res.redirect("/login");
//   }
// });

// app.get("/users", (req, res) => {
//   res.json({
//     user,
//   });
// });

// app.get("/success", (req, res) => {
//   res.render("success.ejs");
// });

// app.post("/add", (req, res) => {
//   user.push(req.body);
//   // console.log(req.body);
//   res.redirect("/success");
// });

// app.listen(Port, () => {
//   console.log(`Server is listening on Port ${Port}`);
// });
































import express from "express";
import { fileURLToPath } from 'url'; // Import the fileURLToPath function
import path from "path";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const app = express();
const Port = 3000;

// Use fileURLToPath to convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Connected to mongodb"))
  .catch((e) => console.log(e));

const signupdetails = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const Message = mongoose.model("signupdetails", signupdetails);

const jwtSecret = 'qwertyuiop'; // Replace with your secret key

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token)

  if (!token) {
    return res.redirect("/login");
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      // Token is invalid, redirect to the login page
      res.redirect("/login");
    } else {
      // Token is valid, proceed to the next middleware or route
      next();
    }
  });
};

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/logout", isAuthenticated, (req, res) => {
  res.render("logout.ejs");
});

app.post("/logout", (req, res) => {
  // Clear the token cookie
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  // Redirect to the login page
  res.redirect("/login");
});


app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the provided email already exists in the database
  const existingEmailUser = await Message.findOne({ email });

  // Check if the provided username already exists in the database
  const existingUsernameUser = await Message.findOne({ username });

  if (existingEmailUser && existingUsernameUser) {
    // Both email and username already exist, render the signup page with an error message
    res.render("signup.ejs", { error: "Email and username already exist" });
  } else if (existingEmailUser) {
    // Email already exists, render the signup page with an error message
    res.render("signup.ejs", { error: "Email already exists" });
  } else if (existingUsernameUser) {
    // Username already exists, render the signup page with an error message
    res.render("signup.ejs", { error: "Username already exists" });
  } else {
    // Neither email nor username exist, insert user data into the database
    const user = await Message.create({
      username,
      email,
      password,
    });

    // Generate a JWT token
    const token = jwt.sign({ email: user.email }, jwtSecret);

    // Set the token as a cookie
    res.cookie("token", token);

    // Redirect to the login page
    res.redirect("/login");
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the provided email exists in the database
  const user = await Message.findOne({ email });

  if (user) {
    // Check if the provided password matches the stored password
    if (user.password === password) {
      // Generate a JWT token
      const token = jwt.sign({ email: user.email }, jwtSecret);

      // Set the token as a cookie
      res.cookie("token", token);

      // Redirect to the logout page
      res.redirect("/logout");
    } else {
      // Incorrect password, render the login page with an error message
      res.render("login.ejs", { error: "Incorrect password" });
    }
  } else {
    // Email not found, redirect to the signup page
    res.redirect("/signup");
  }
});

app.listen(Port, () => {
  console.log(`Server is listening on Port ${Port}`);
});