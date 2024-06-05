const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const validateReviewsScema = require("../utils/ValidateReview");    //review schema validation Joi middleware
const { isLoggedIn } = require("../utils/Authorizationmiddleware");
const { isReviewOwner } = require("../utils/Authorizationmiddleware");


router.post("/", isLoggedIn, validateReviewsScema, WrapAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewOwner, WrapAsync(reviews.deleteReview));

module.exports = router;