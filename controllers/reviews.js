const Hotel = require('../models/hotel')
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    const review = new Review(req.body.review);
    id = req.params.id;
    review.Owner = req.user._id;
    const hotel = await Hotel.findById(id).populate("Reviews");
    hotel.Reviews.push(review)
    await review.save();
    await hotel.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/hotels/${id}`);
}



module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params
    await Hotel.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/hotels/${id}`)

}