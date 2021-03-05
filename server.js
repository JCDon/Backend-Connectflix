// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
// const passport = require(`./config/passport`);
// const session = require(`express-session`);
var cors = require('cors')

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()) 

// Static directory
app.use(express.static("public"));
// app.use(
//   session({ secret: `secret password`, resave: true, saveUninitialized: true })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
// =============================================================
require("./routes/apiRoutes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
