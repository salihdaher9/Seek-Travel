const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require('../utils/catchAsync');
const Hotel = require('../models/hotel')
const Review = require("../models/review");
const validateReviewsScema = require("../utils/ValidateReview");    //review schema validation Joi middleware



router.post("/", validateReviewsScema, WrapAsync(async (req, res) => {
    const review = new Review(req.body.review);
    id = req.params.id;
    const hotel = await Hotel.findById(id).populate("Reviews");
    hotel.Reviews.push(review)
    await review.save();
    await hotel.save()
    res.redirect(`/hotels/${id}`);
}));


router.delete('/:reviewId', WrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params
    await Hotel.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/hotels/${id}`)

}));


module.exports = router;