const express = require("express");
const router = express.Router();
// import constroller
const {register, activateAccount} = require("../routers/users");

router.post('/register', register);
router.post('/login', activateAccount)

module.exports = router;