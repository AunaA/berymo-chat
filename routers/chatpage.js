const express = require('express');
const router = express.Router();


//Berymo Page
router.get('/berymoChat',(req, res) => {
    res.render('berymoChat', {
        user: req.user
    });
});

//MAİNCHAT Page
router.get('/berymoChat/chat',(req, res) => {
    res.render('chat', {
        user: req.user
    });
});

module.exports = router;