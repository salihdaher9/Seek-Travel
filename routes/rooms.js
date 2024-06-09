const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require('../utils/catchAsync');
const rooms = require('../controllers/rooms')
const validateRoomScema = require("../utils/ValidateRoom");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const { isLoggedIn } = require("../utils/Authorizationmiddleware");

router.get("/new", WrapAsync(rooms.renderNewRoom));

router.get("/", WrapAsync(rooms.index));

router.post("/", upload.array('room[images]'),validateRoomScema, WrapAsync(rooms.creatRoom));

router.get("/:RoomId", WrapAsync(rooms.showRoom));

router.post("/:RoomId/calenderCheck",WrapAsync(rooms.calenderCheck));

router.get("/:RoomId/calender", isLoggedIn,WrapAsync(rooms.renderToCheckOut));

router.post("/:RoomId/calender",isLoggedIn, WrapAsync(rooms.creatReservations));

router.delete("/:roomsId", WrapAsync(rooms.deleteRoom));

module.exports = router;