const express = require("express");
const path = require("path");
const mongoose=require("mongoose")
const methodOverride = require("method-override");
const Hotel=require('./models/hotel')


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

app.get("/", async (req, res) => {
  res.render('home')
});

app.get("/hotels", async (req, res) => {
  const hotels = await Hotel.find({})
  res.render("Hotels/index",{hotels});
});

app.get("/hotels/new", async (req, res) => {
 
  res.render("Hotels/new");
});

app.post("/hotels", async (req, res) => {
  const body = req.body.hotel;
  body.rooms = [];
  const hotel = await new Hotel(body);
  hotel.save();
  res.redirect(`/hotels/${hotel.id}`);
});

app.get("/hotels/:id", async (req, res) => {
  const id=req.params.id
  const hotel = await Hotel.findById(id)
  res.render("Hotels/show",{hotel});

})


app.get("/hotels/:id/edit", async (req, res) => {
  const id = req.params.id
  const hotel= await Hotel.findById(id)
  
  res.render("Hotels/edit", { hotel });
});

app.put("/hotels/:id",async (req, res) => {
  console.log(req.params.id)
  const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { ...req.body.hotel,
});
  res.redirect(`/hotels/${req.params.id}`);

})


app.delete("/hotels/:id", async (req, res) => {
  console.log(`${req.params.id} deleted`);
  await Hotel.findByIdAndDelete(req.params.id)
  res.redirect(`/hotels`);

});
app.listen(3000, () => {
  console.log("listening on port 3000");
});
