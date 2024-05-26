const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require('../utils/catchAsync');
const Hotel = require('../models/hotel')
const Room = require("../models/room");
const validateRoomScema = require("../utils/ValidateRoom");
const { parse, add, format } = require("date-fns");



router.get("/new", WrapAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id)
    console.log(hotel)
    res.render("Rooms/new", { hotel });
}));


router.get("/", WrapAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate("Rooms");
    const rooms = hotel.Rooms;
    res.render("Hotels/rooms", rooms);

}));


router.post("/", validateRoomScema, WrapAsync(async (req, res) => {
    const room = req.body.room
    room.currentCounter = 0
    console.log(room)
    const Res = new Room(room)
    const hotel = await Hotel.findById(req.params.id).populate("Rooms");
    hotel.Rooms.push(Res);
    await Res.save();
    await hotel.save();
    req.flash('success', 'Successfully made a new room!');

    res.redirect(`/hotels/${hotel.id}/rooms/new`);
}));


router.get("/:RoomId", WrapAsync(async (req, res, next) => {
    console.log(req.params)
    const hotel = await Hotel.findById(req.params.id);
    const room = await Room.findById(req.params.RoomId);
    res.render("Rooms/show", { hotel, room });

}));


router.post("/:RoomId/calenderCheck", WrapAsync(async (req, res, next) => {
    console.log("--------------------------------");

    console.log(req.body)
    const inn = req.body.in;
    const out = req.body.out;
    const Roomid = req.params.RoomId;
    const id = req.params.id;
    const room = await Room.findById(Roomid);

    const checkInDate = new Date(inn);
    const checkOutDate = new Date(out);
    console.log("--------------------------------");

    const dates = [];
    for (let datee = add(checkInDate, { days: 1 }); datee <= add(checkOutDate, { days: 1 }); datee = add(datee, { days: 1 })) {
        dates.push(new Date(datee));
    }
    const illegall = []
    console.log(dates)
    console.log(illegall);

    for (let date of dates) {
        if (room.DateCounter.length > 0) {
            for (let datec of room.DateCounter) {
                if (datec.Date.getTime() === date.getTime()) {
                    if (datec.DateNumber >= room.max) {
                        illegall.push(date);
                    }
                }
            }
        }
    }

    console.log("------------")
    if (illegall.length > 0) {
        console.log(illegall);
        console.log("there is illegal")
        return res.json({ illegal: true, illegalDates: illegall });
    } else {
        console.log("sending");
        return res.json({ illegal: false });
    }
}));



router.get("/:RoomId/calender", WrapAsync(async (req, res, next) => {
    const inn = req.query.in
    const out = req.query.out
    const hotel = await Hotel.findById(req.params.id)
    const room = await Room.findById(req.params.RoomId);
    const deff = function daysBetween(date1, date2) {
        // Create Date objects
        const startDate = new Date(date1);
        const endDate = new Date(date2);

        // Set time components to midnight
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // Calculate the difference in milliseconds
        const differenceMs = endDate - startDate;

        // Convert back to days and return
        return differenceMs / (1000 * 60 * 60 * 24);
    };
    mydif = deff(inn, out);

    res.render("Rooms/checkOut", { room, hotel, inn, out, mydif });
}));



router.post("/:RoomId/calender", WrapAsync(async (req, res, next) => {
    console.log(req.body.body)
    console.log(req.body.Reservation);

    const inn = add(new Date(req.body.body.in), { days: 1 });
    const out = add(new Date(req.body.body.out), { days: 1 });
    const name = req.body.Reservation.Name
    const room = await Room.findById(req.params.RoomId);
    const hotel = await Hotel.findById(req.params.id);
    room.Reservations.push({
        id: name,
        Date: [inn, out]
    })
    const dates = []
    console.log(inn, out, name)
    for (let datee = inn; datee <= out; datee = add(datee, { days: 1 })) {
        dates.push(new Date(datee));
    }
    //if (datec.Date.getTime() === date.getTime())
    console.log(dates)
    if (room.DateCounter.length === 0) {
        for (let newDate of dates) {
            room.DateCounter.push({
                Date: newDate,
                DateNumber: 1
            })
        }
        return await room.save()
    }
    else {
        for (let date of dates) {
            const isPresent = room.DateCounter.some(dc => dc.Date.getTime() === date.getTime());
            if (isPresent) {
                const dateCounter = room.DateCounter.find(dc => dc.Date.getTime() === date.getTime());
                dateCounter.DateNumber++;
                console.log("-------------")
                console.log(date, isPresent)
                console.log("-------------")
            }
            else {
                room.DateCounter.push({
                    Date: date,
                    DateNumber: 1
                })
            }
            await room.save()
        }
        return await room.save()
    }
}));



router.delete("/:roomsId", WrapAsync(async (req, res) => {
    const { id, roomsId } = req.params
    await Hotel.findByIdAndUpdate(id, { $pull: { Rooms: roomsId } });
    await Room.findByIdAndDelete(roomsId)
    res.redirect(`/hotels/${id}`)
})
);


module.exports = router;