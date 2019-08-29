const express = require('express');
const routerAuth = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const theSalt = 10;


//las rutas aquí

routerAuth.get('/signup', (req,res,next)=>{
  res.render('auth/signup')
})

routerAuth.post('/signup', (req,res,next)=>{
  const signUpUsername = req.body.username;
  const signUpPassword = req.body.password
  const salt = bcrypt.genSaltSync(theSalt);
  const cryptoPassword = bcrypt.hashSync(signUpPassword, salt)

  if(signUpUsername === "" || signUpPassword === ""){
    res.render("auth/signup", {errorMessage:"Indicate an username and a password to sign up"})
  }
  else {

    User.findOne({ "username": signUpUsername })
    .then(user => {

       if (user !== null) {
         res.render("auth/signup", {
         errorMessage: "The username already exists!"
        });
        return
        }

       else {

         User.create({
          signUpUsername,
         password: cryptoPassword
         })
         .then(res.redirect('/'))
         .catch(error => {
          next(error);
          })

        }

    })

  }

})

routerAuth.get('/login', (req,res,next)=>{
  res.render('auth/login')
})

routerAuth.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate an username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.render("index", {
          message: "Login successful", 
          session: req.session.currentUser
				});
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});

routerAuth.use((req, res, next) => {
  req.session.currentUser
    ? next()
    : res.render("auth/login", {
        errorMessage: "You have to be logedin"
      });
});

routerAuth.get("/private", (req, res, next) => res.render("private"));
routerAuth.get("/main", (req, res, next) => res.render("main"));

routerAuth.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // can't access session here
    res.redirect("/login");
  });
});



module.exports = routerAuth