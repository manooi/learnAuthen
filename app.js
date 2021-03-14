//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 =  require("md5")

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema( {
  email: String,
  password: String
});


const User = mongoose.model('User', userSchema);


app.get('/', function(req, res) {
  res.render('home.ejs')
});

app.get('/login', function(req, res) {
  res.render('login.ejs')
});

app.get('/register', function(req, res) {
  res.render('register.ejs')
});

app.post('/register', function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err) {
    if (!err) {
      // res.send('Successfully added a new user.');
      res.render('secrets.ejs');
    } else {
      res.send(err);
    }
  });
})

app.post('/login', function(req, res) {

  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({
      email: username,
    },
    function(err, foundUser) {
      if (!err) {
        if (foundUser) {
          if (foundUser.password === password ) {
            res.render('secrets.ejs')
          } else {
            res.send('wrong password!')
          }
        } else {
          res.send("User not found!");
        }
      } else {
        res.send(err);
      }
    });
})




app.listen(3000, function() {
  console.log("Server strared on port 3000");
});