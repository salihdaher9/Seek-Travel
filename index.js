const express = require("express");
const path = require("path");
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override");
const ExpressError = require('./utils/ExpressError');
const bodyParser = require("body-parser");
const hotels = require('./routes/hotels');
const rooms = require('./routes/rooms');
const reviews = require('./routes/reviews');


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
app.use(bodyParser.json());


app.use('/hotels', hotels);
app.use("/hotels/:id/reviews", reviews);
app.use("/hotels/:id/rooms", rooms);


app.all('*', (req, res, next) => {
  next(new ExpressError("Something went wrong", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error", { message, statusCode });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});