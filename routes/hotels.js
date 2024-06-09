const express = require("express");
const router = express.Router();
const hotels = require('../controllers/hotels');
const WrapAsync = require('../utils/catchAsync');
const ValidateHotelSchema = require("../utils/VlaidateMiddlewear"); //hotel schema validation Joi middleware 
const { isLoggedIn } = require('../utils/Authorizationmiddleware');
const { isOwner } = require("../utils/Authorizationmiddleware");
const multer=require('multer');
const {storage}=require('../cloudinary')
const upload = multer({storage})


router
  .route("/")
  .get(hotels.index)
  .post(isLoggedIn,upload.array('image'), ValidateHotelSchema, WrapAsync(hotels.createHotelasync));
  


router.get("/new", isLoggedIn, WrapAsync(hotels.renderNewForm));

router.post("/", isLoggedIn, ValidateHotelSchema, WrapAsync(hotels.createHotelasync));


router.get("/:id", WrapAsync(hotels.showHotel));

router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync(hotels.renderEditForm));

router.put("/:id", isLoggedIn, isOwner,upload.array('image'),ValidateHotelSchema, WrapAsync(hotels.updateHotel));

router.delete("/:id", isLoggedIn, isOwner, WrapAsync(hotels.deleteHotel));

module.exports = router;