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
  const username = req.body.username;
  const password = req.body.password
  const salt = bcrypt.genSaltSync(theSalt);
  const cryptoPassword = bcrypt.hashSync(password, salt)

  if(username === "" || password === ""){
    res.render("auth/signup", {errorMessage:"Indicate a username and a password to sign up"})
  }
  else {

    User.findOne({ "username": username })
.then(user => {

  if (user !== null) {
    res.render("auth/signup", {
      errorMessage: "The username already exists!"
    });
  }

  else {

  User.create({
    username,
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



module.exports = routerAuth