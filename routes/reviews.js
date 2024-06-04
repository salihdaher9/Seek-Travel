const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require('../utils/catchAsync');
const Hotel = require('../models/hotel')
const Review = require("../models/review");
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const validateReviewsScema = require("../utils/ValidateReview");    //review schema validation Joi middleware
const { isLoggedIn } = require("../utils/Authorizationmiddleware");
const { isReviewOwner } = require("../utils/Authorizationmiddleware");



router.post("/", isLoggedIn, validateReviewsScema, WrapAsync(reviews.createReview));


router.delete('/:reviewId', isLoggedIn, isReviewOwner, WrapAsync(reviews.deleteReview));


module.exports = router;