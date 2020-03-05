require('dotenv/config');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const createError = require("http-errors");

const app = express();

/*ROUTES START*/

// The only required route for the calls to mongo API
// TODO: need to split file into diff files
// const bless = require('./routes/bless');

// For validation routes
const adminRegValPath = path.join(__dirname, 'routes', 'API', 'adminRegVal');
const adminRegistrationvalidation = require(adminRegValPath);

const premisesLogValPath = path.join(__dirname, 'routes', 'API', 'premisesLogVal');
const premisesLoginvalidation = require(premisesLogValPath);
/*ROUTES END*/
/*CORS START*/

// Allow inbound traffic from origin URL
const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
/*CORS END*/
/*ERROR HANDLING START*/

// use to create errs 
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  //render err stack in terminal
  console.log(err.stack)
  // render the error page
  res.status(err.status || 500).json({ error: err.message, status: err.status })
});

// development error handler
// will print stacktrace in page
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
/*ERROR HANDLING END*/
/*MIDDLEWARE START*/

// Indicate the middleware that Express should use
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
// Passport config
const passportPath = path.join(__dirname, 'config', 'passport');
require(passportPath)(passport);

// DB Config
// DB var for non heroku use
// const db = require("./config/mongoCon.js").mongoURI;

// DB var for heroku use
const db = process.env.MONGODB_URL;

// test Connect to MongoDB
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
/*MIDDLEWARE END*/
/*ROUTES START*/

// headers for cors
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Test get route from server
app.get('/', function (req, res, next) {
  const testObject = {
    "AppName": "VMSA",
    "Version": 1.0
  }
  res.send(JSON.stringify(testObject));
});

// Defines a single route for test Restful API
//app.use('/bless', bless);

// Validation routes
app.use("/API/adminRegVal", adminRegistrationvalidation);
app.use("/API/premisesLogVal", premisesLoginvalidation);

/*ROUTES END*/
/*EXTRA OPTIONS START*/



// For any other routes, set the status to 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Sets port info
const port = process.env.PORT || 8000;

// Start listening on port
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
/*EXTRA OPTIONS END*/
