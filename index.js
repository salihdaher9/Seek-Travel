const express = require("express");
const path = require("path");
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override");
const Hotel = require('./models/hotel')
const Room = require("./models/room");
const Review = require("./models/review");
const WrapAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const ValidateHotelSchema = require("./utils/VlaidateMiddlewear"); //hotel schema validation Joi middleware 
const validateReviewsScema = require("./utils/ValidateReview");    //review schema validation Joi middleware
const validateRoomScema = require("./utils/ValidateRoom");    //review schema validation Joi middleware
const { parse, add, format } = require("date-fns");

mongoose.connect("mongodb://0.0.0.0:27017/Hotels_project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to db");
});

const app = express();
app.use(express.static("public"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.get("/hotels", async (req, res) => {
  const hotels = await Hotel.find({});
  res.render("Hotels/index", { hotels });
});

app.get("/hotels/new", WrapAsync(async (req, res) => {
  res.render("Hotels/new");
}));

app.get("/hotels/:id/rooms/new", WrapAsync(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
  console.log(hotel)
  res.render("Rooms/new", { hotel });
}));

app.get("/hotels/:id/rooms/new", WrapAsync(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
  console.log(hotel)
  res.render("Rooms/new", { hotel });
}));


app.post("/hotels/:id/rooms", validateRoomScema, WrapAsync(async (req, res) => {
  const room = req.body.room
  room.currentCounter = 0
  room.calender = [[]]
  console.log(room)
  const Res = new Room(room)
  const hotel = await Hotel.findById(req.params.id).populate("Rooms");
  hotel.Rooms.push(Res);
  await Res.save();
  await hotel.save();
  res.redirect(`/hotels/${hotel.id}/rooms/new`);
}));


app.post("/hotels", ValidateHotelSchema, WrapAsync(async (req, res, next) => {

  const body = req.body.hotel;
  const hotel = new Hotel(body);
  await hotel.save();
  console.log(`${hotel.name} Hotel saved`);
  res.redirect(`/hotels/${hotel.id}`);

}));
app.get("/hotels/:id/rooms/:RoomId", WrapAsync(async (req, res, next) => {
  console.log(req.params)
  const hotel = await Hotel.findById(req.params.id);
  const room = await Room.findById(req.params.RoomId);
  res.render("Rooms/show", { hotel, room });

}))
app.post("/hotels/:id/rooms/:roomId/calender",WrapAsync(async (req, res, next) => {
    const inn = req.body.body.in;
    const out = req.body.body.out;
    const Roomid = req.params.roomId;
    const id = req.params.id;
    const room = await Room.findById(Roomid);
    const hotel=await Hotel.findById(id);
    const checkInDate = new Date(inn);
    const checkOutDate = new Date(out);
    const dates = [];
    for (let datee = add(checkInDate, { days: 1 });datee <= add(checkOutDate, { days: 1 });datee = add(datee, { days: 1 })) {
      dates.push(new Date(datee));
    }
    console.log(dates);
    room.Reservations.push({
      id: "Name",
      Date: [add(checkInDate, { days: 1 }), add(checkOutDate, { days : 1 })]
    });  
    // Iterate over the dates
    for (let date of dates) {
      if (room.DateCounter.length !== 0) {
        // DateCounter is not empty
        let dateFound = false;
        for (let counter of room.DateCounter) {
          // Check if the date already exists
          if (counter.Date.getTime() === date.getTime()) {
            if(counter.DateNumber==room.max){
              console.log("room full")
              dateFound = true;
              break
            }
            else{
            counter.DateNumber += 1;
            dateFound = true;
            break;
            }

          }
        }
        if (!dateFound) {
          // Date not found, add a new entry
          room.DateCounter.push({
            Date: date,
            DateNumber: 1,
          });
 
        }
      } 
        else {
        // DateCounter is empty, add a new entry
        
        room.DateCounter.push({
          Date: date,
          DateNumber: 1,
        });
      }
    }

    await room.save();
    const deff = function daysBetween(date1,date2 ) {
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
    mydif=deff(inn,out)
    console.log(mydif);
    res.render("Rooms/checkOut", { room, hotel, inn, out, mydif });
  })
);


app.get("/hotels/:id", WrapAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id).populate("Reviews").populate('Rooms');
  if (!hotel) {
    throw new Error("error getting hotel")
  }
  console.log(hotel)
  res.render("Hotels/show", { hotel });

}))


app.get("/hotels/:id/edit", WrapAsync(async (req, res) => {
  const id = req.params.id;
  const hotel = await Hotel.findById(id);

  res.render("Hotels/edit", { hotel });
})
);

app.put("/hotels/:id", ValidateHotelSchema, WrapAsync(async (req, res, next) => {
  const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { ...req.body.hotel, });
  console.log(`${updatedHotel.name} updated`);
  res.redirect(`/hotels/${req.params.id}`);
}));


app.delete("/hotels/:id", WrapAsync(async (req, res) => {
  console.log(`${req.params.id} deleted`);
  await Hotel.findByIdAndDelete(req.params.id);
  res.redirect(`/hotels`);
})
);

app.delete("/hotels/:id/rooms/:roomsId", WrapAsync(async (req, res) => {
  const { id, roomsId } = req.params
  await Hotel.findByIdAndUpdate(id, { $pull: { Rooms: roomsId } });
  await Room.findByIdAndDelete(roomsId)
  res.redirect(`/hotels/${id}`)
})
);




app.post("/hotels/:id/reviews", validateReviewsScema, WrapAsync(async (req, res) => {
  const review = new Review(req.body.review);
  id = req.params.id;
  const hotel = await Hotel.findById(id).populate("Reviews");
  hotel.Reviews.push(review)
  await review.save();
  await hotel.save()
  res.redirect(`/hotels/${id}`);
}));


app.get("/hotels/:id/rooms", WrapAsync(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).populate("Rooms");
  const rooms = hotel.Rooms;
  res.render("Hotels/rooms", rooms);

}));

app.delete('/hotels/:id/reviews/:reviewId', WrapAsync(async (req, res, next) => {
  const { id, reviewId } = req.params
  await Hotel.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/hotels/${id}`)

}));

app.all('*', (req, res, next) => {
  next(new ExpressError("Something went wrong", 404));

})


app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error", { message, statusCode });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
