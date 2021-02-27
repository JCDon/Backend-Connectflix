const express = require("express")
const bcrypt = require('bcrypt')
let db = require("../models");
// const router = express.Router();
const isAuthenticated = require(`../config/middleware/isAuthenticated`);
const passport = require(`../config/passport`);
const User = require("../models/user");


module.exports = function (app, sequelize) {

    app.post("/api/signup", function (req, res) {
        db.User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name
        }).then(data=>{
            res.json(data)
        
        }).catch(err=>{
            console.log(err);
            res.status(500).json(err)
        })
    });
    app.post("/api/login", (req, res) => {
        console.log("hitting login");
        db.User.findOne({
          where: {
            username: req.body.username
          }
        }).then(userData => {
          if (!userData) {
            req.session.destroy()
            res.status(404).send("No such user exists!")
          } else {
            if (bcrypt.compareSync(req.body.password, userData.password)) {
              req.session.user = {
                // id: userData.id,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
              }
              res.json(userData)
            } else {
              req.session.destroy()
              res.status(401).send("Wrong password")
            }
          }
        }).catch(err => {
          res.status(500).json(err)
        });
      });
}