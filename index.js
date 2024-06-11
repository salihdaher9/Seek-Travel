if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()

}


const express = require("express");
const path = require("path");
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require("method-override");
const ExpressError = require('./utils/ExpressError');
const bodyParser = require("body-parser");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
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

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(bodyParser.json());

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session)
  res.locals.user = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})




app.use('/', userRoutes);
app.use('/hotels', hotels);
app.use("/hotels/:id/reviews", reviews);
app.use("/hotels/:id/rooms", rooms);


app.get('/', (req, res) => {
  res.render('home')
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log("listening on port 3000");
});