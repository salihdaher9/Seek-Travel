const express = require("express");
const router = express.Router();
const WrapAsync = require('../utils/catchAsync');
const ValidateHotelSchema = require("../utils/VlaidateMiddlewear"); //hotel schema validation Joi middleware 
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Hotel = require('../models/hotel')

router.get("/", async (req, res) => {
    const hotels = await Hotel.find({}).populate("Reviews");
    res.render("Hotels/index", { hotels });
});


router.get("/new", isLoggedIn, WrapAsync(async (req, res) => {
    res.render("Hotels/new");
}));


router.post("/", isLoggedIn, ValidateHotelSchema, WrapAsync(async (req, res, next) => {

    const body = req.body.hotel;
    const hotel = new Hotel(body);
    hotel.Owner = req.user._id;
    await hotel.save();
    req.flash('success', 'Successfully made a new hotel!');
    console.log(`${hotel.name} Hotel saved`);
    res.redirect(`/hotels/${hotel.id}`);

}));


router.get("/:id", WrapAsync(async (req, res, next) => {
    const hotel = await Hotel.findById(req.params.id).populate("Reviews").populate('Rooms').populate('Owner');
    if (!hotel) {
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }
    console.log(hotel)

    res.render("Hotels/show", { hotel });

}));


router.get("/:id/edit", isLoggedIn, WrapAsync(async (req, res) => {
    const id = req.params.id;
    const hotel = await Hotel.findById(id);
    if (!hotel) {
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }

    res.render("Hotels/edit", { hotel });
})
);


router.put("/:id", isLoggedIn, ValidateHotelSchema, WrapAsync(async (req, res, next) => {
    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { ...req.body.hotel, });
    console.log(`${updatedHotel.name} updated`);
    req.flash('success', 'Successfully updated hotel!');
    res.redirect(`/hotels/${req.params.id}`);
}));


router.delete("/:id", isLoggedIn, WrapAsync(async (req, res) => {
    console.log(`${req.params.id} deleted`);
    await Hotel.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted hotel!');

    res.redirect(`/hotels`);
})
);


module.exports = router;