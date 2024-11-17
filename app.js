var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth/auth');
const exphbs = require("express-handlebars");
var app = express();
const mongoose = require("mongoose");


app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // Use an environment variable for production
    resave: false, // Prevent session being saved back to the session store if unmodified
    saveUninitialized: false, // Only save sessions that are modified
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookies
    },
  }));
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null; // Pass user session data to views
  next();
});
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views", "layouts"), // Directory for layouts
    partialsDir: path.join(__dirname, "views", "partials"), // Directory for partials
    defaultLayout: "layout", // Default layout file
  })
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// .env
require("dotenv").config();
// CORS
const cors = require("cors");
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);



// MongoDB connection string
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/vehicle";

// Connect to MongoDB
mongoose.connect(mongoURI);

const db = mongoose.connection;

// Log connection status
db.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
