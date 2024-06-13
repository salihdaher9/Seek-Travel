const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users')
const { storeReturnTo } = require("../utils/Authorizationmiddleware");
const { isLoggedIn } = require('../utils/Authorizationmiddleware');


router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin);

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get("/logout", users.logout);

router.get('/cart', isLoggedIn, users.renderCart);

module.exports = router;