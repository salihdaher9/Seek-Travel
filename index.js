const express = require("express");
const path = require("path");
const mongoose=require("mongoose")
const methodOverride = require("method-override");
const Hotel=require('./models/hotel')
const Room = require("./models/room");

const WrapAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const ValidateHotelSchema = require("./utils/VlaidateMiddlewear"); //schema validation Joi middleware 

mongoose.connect("mongodb://localhost:27017/Hotels_project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db=mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to db");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"));


app.get("/hotels", async (req, res ) => {
  const hotels = await Hotel.find({});
  res.render("Hotels/index", { hotels });
});

app.get("/hotels/new", WrapAsync(async (req, res) => {
  res.render("Hotels/new");
}));

app.post("/hotels",ValidateHotelSchema,WrapAsync(async (req, res, next) => {
   
    const body = req.body.hotel;
    const hotel =  new Hotel(body);
    await hotel.save();
    console.log(`${hotel.name} Hotel saved`);
    res.redirect(`/hotels/${hotel.id}`);    

}));

app.get("/hotels/:id", WrapAsync(async (req, res,next) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
      throw new Error("error getting hotel")
  }
  res.render("Hotels/show",{hotel});

}))


app.get("/hotels/:id/edit",WrapAsync(async (req, res) => {
    const id = req.params.id;
    const hotel = await Hotel.findById(id);

    res.render("Hotels/edit", { hotel });
  })
);

app.put("/hotels/:id",ValidateHotelSchema,WrapAsync(async (req, res,next) => {
      const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, {...req.body.hotel,});
      console.log(`${updatedHotel.name} updated`);
      res.redirect(`/hotels/${req.params.id}`);
}));


app.delete("/hotels/:id",WrapAsync(async (req, res) => {
    console.log(`${req.params.id} deleted`);
    await Hotel.findByIdAndDelete(req.params.id);
    res.redirect(`/hotels`);
  })
);


app.all('*',(req,res,next) => {
      next(new ExpressError("Something went wrong", 404));

})


app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error", { message, statusCode });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
