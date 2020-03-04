require('dotenv/config');
const path = require('path')
const express = require("express");
const logger = require('morgan');
const cors = require('cors');
const getIP = require('external-ip')();
// const createError = require("http-errors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// var favicon = require('serve-favicon');
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");

/*ROUTES START*/

// The only required route for the calls to mongo API
// TODO: need to split file into diff files
// const bless = require('./routes/bless');

// For validation routes
const adminRegistrationvalidation = require("./routes/API/adminRegVal");
const premisesLoginvalidation = require("./routes/API/premisesLogVal");
/*ROUTES END*/
/*CORS START*/
let publicIP; // IP address of the server running app

getIP(function (err, ip) {
  // Stores the IP address of server running app
  if (err) {
    console.log("Failed to retrieve IP address: " + err.message);
    throw err;
  }
  console.log("VMSA running on " + ip + ":" + config.expressPort);
  publicIP = ip;
});
getIP()
//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: `${publicIP}` || 'http://localhost:3000',
    credentials: true,
    enablePreflight: true
  })
);
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
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// DB Config
const db = require("./config/mongoCon.js").mongoURI;

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

// Test get route from server
app.get('/', function (req, res, next) {
  const testObject = {
    "AppName": "VMSA",
    "Version": 1.0
  }
  res.json(testObject);
});

// Defines a single route for test Restful API
//app.use('/bless', bless);

// Validation routes
app.use("/API/adminRegVal", adminRegistrationvalidation);
app.use("/API/premisesLogVal", premisesLoginvalidation);

/*ROUTES END*/
/*EXTRA OPTIONS START*/

// serves static files from this folder
// production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname = 'dist/index.html'));
  })
  // development mode
} else {
  app.use(express.static(path.join(__dirname, 'src')))

}


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
