const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// User model
const User = require('../models/User');
const jwt = require('jsonwebtoken');
//email request
const mailgun = require("mailgun-js");
const DOMAIN = 'https://api.mailgun.net/v3/sandboxf86c7839c8814a589689a58a1563de67.mailgun.org';
const mg = mailgun({ apiKey: "391bc80364531fbc95d6e286b646288e-7cd1ac2b-71af1274", domain: DOMAIN });



//Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
  const { firstname, lastname, position, email, password, password2 } = req.body;
  let errors = [];

  //  Gerekli alanların dolduruldugunu Check et
  if (!firstname || !lastname || !position || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }


  //Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //Chech pas length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstname,
      lastname,
      position,
      email,
      password,
      password2

    });
  } else {
    // Validation passed -dogrulama geciti
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          // User exists girişi
          errors.push({ msg: 'Email is already registered' });
          res.render('register', {
            errors,
            firstname,
            lastname,
            position,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            firstname,
            lastname,
            position,
            email,
            password
          });

          // Hash Password 
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // Save user
              newUser.save()
                .then(user => {

                  const token = jwt.sign({ firstname, lastname, position, email, password, password2 }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '20m' })

                  const data = {
                    from: 'berymochat-verification@berymo.org',
                    to: email,
                    subject: 'BerymoChat Verification Link',
                    html: `
             <h2>Hello user welcome to Berymo-Chat! Please click on
            given activate-link to verify your email. (^_^ )</h2>
            <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>
           `
                  };
                  mg.messages().send(data, function (error, body) {
                    /* if (error) {
                      return res.json({
                        message: error.message
                      })
                    } */
                    //return res.json({ messages: 'Email has been sent, kindly activate your account (^_^ )' });

                  });

                  req.flash(
                    'success_msg',
                    'You are now registered and can login ^_^'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
  }
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/chatpage/berymoChat',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});
module.exports = router;