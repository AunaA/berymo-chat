const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../routers/users');

// Welcome Page
router.get('/',(req, res) => res.render('welcomepage'));

// BerymoChat
router.get('/berymoChat', (req, res) =>
  res.render('berymoChat', {
    user: req.user
  })
  
);

module.exports = router;