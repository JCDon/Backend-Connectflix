const express = require("express")
const bcrypt = require('bcrypt')
let db = require("../models");
// const router = express.Router();
const isAuthenticated = require(`../config/middleware/isAuthenticated`);
const passport = require(`../config/passport`);
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authenticateMe = (req)=>{
    let token = false;

    if(!req.headers){
        token=false
    }
    else if(!req.headers.authorization) {
        token=false;
    }
    else {
        token = req.headers.authorization.split(" ")[1];
    }
    let data = false;
    if(token){
        data = jwt.verify(token,"catscatscats",(err,data)=>{
            if(err) {
                return false;
            } else {
                return data
            }
        })
    }
    return data;
}




module.exports = function (app, sequelize) {
  // Signup Route
    app.post("/api/signup", function (req, res) {
        db.User.create(req.body
            // username: req.body.username,
            // password: req.body.password,
            // email: req.body.email,
            // first_name: req.body.first_name,
            // last_name: req.body.last_name
        ).then(newUser=>{
          const token = jwt.sign({

          })
            res.json(newUser)
        
        }).catch(err=>{
            console.log(err);
            res.status(500).json(err)
        })
    });
    
    // Login Route
    app.post("/api/login", (req, res) => {
      console.log("hitting login");
      db.User.findOne({
        where: {
          username: req.body.username
        }
      }).then(userData => {
        if(!userData.password){
          res.status(404).send("No such user exists!")
        }
        // if (!userData) {
        //   req.session.destroy()
        //   res.status(404).send("No such user exists!")
        // } else {
        //   console.log(`${req.body.password}, ${userData.password}`);
          
         else if (bcrypt.compareSync(req.body.password, userData.password)) {
           const token = jwt.sign({
            username: userData.username,
            id: userData.id
          }, "connectflix",
          {
            expiresIn: "2h"
          })
            // req.session.user = {
            //   id: userData.id,
            //   username: userData.username,
            //   first_name: userData.first_name,
            //   last_name: userData.last_name,
            // }
            return res.json({userData, token})
          } else {
            // req.session.destroy()
            return res.status(403).send("Wrong password")
          }
        // }
      }).catch(err => {
        res.status(500).json(err)
      });
    });

    app.get("/secretclub", (req, res)=>{
      let token = false;
      if(!req.headers){
        token=false
      }
      else if(!req.headers.authorization){
        token=false
      }
      else {
        token = req.headers.authorization.split(" ")[1]
      }
      if(!token){
        res.status(403).send("log in first")
      }
      else {
        const data = jwt.verify(token, "connectflix", (err, data)=>{
          if(err){
            return false
          } else {
            return data
          }
        })
        if(data){
          res.send("You're in " + data.username)
        } else {
          res.status(403).send("Authorization failed")
        }
      }
    })

    // Likes route to record which movies are liked by user
    app.post("/api/likes", function (req, res) {
        db.Likes.create({
          UserId: req.session.user.id,
          title: req.body.title,
          poster: req.body.poster,
          imdb: req.body.imdb,
          synopsis: req.body.synopsis
        }).then(data=>{
            res.json(data)
        
        }).catch(err=>{
            console.log(err);
            res.status(500).json(err)
        })
    });


    app.put("/api/addFriend", (req, res) => {
        // find the logged in user
        db.User.findOne({
          where: {
            id: req.session.user.id
          }
        }).then(dbUser => {
          // add the targeted user as an association
          dbUser.addAssociate(req.body.FriendId)
          res.json(dbUser)
        }).catch(err => {
          console.log(err.message);
          res.status(500).send(err.message)
        })
    })
}