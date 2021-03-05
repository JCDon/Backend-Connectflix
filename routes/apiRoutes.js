const express = require("express")
const bcrypt = require('bcrypt')
let db = require("../models");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticateMe = (req) => {
  let token = false;

  if (!req.headers) {
    token = false
  }
  else if (!req.headers.authorization) {
    token = false;
  }
  else {
    token = req.headers.authorization.split(" ")[1];
  }
  let data = false;
  if (token) {
    data = jwt.verify(token, "connectflix", (err, data) => {
      if (err) {
        return false;
      } else {
        return data
      }
    })
  }
  return data;
}




module.exports = function (app, sequelize) {
  // GET route for retrieving all users from USER table
  app.get("/api/users", (req, res) => {
    db.User.findAll({
      include: [{
        model: db.User,
        as: 'Friend'
      }]
    }).then(dbUser => {
      const userData = authenticateMe(req);
      // console.log(userData);
      if (userData) {
        // find the current logged in user
        const foundUser = dbUser.find(user => user.id === userData.id);
        // searches the found user and builds an array from their associations
        const friendArr = foundUser.Friend.map(e => e.UserFriend.FriendId)
        // maps across all users to add the isConnected boolean
        const usersFriendData = dbUser.map(obj => {
          const usersFriendObj = obj.toJSON();
          // if the user id is inside the array, then add true/false to the object
          if (friendArr.includes(usersFriendObj.id)) {
            usersFriendObj.isConnected = true;
          } else {
            usersFriendObj.isConnected = false;
          }
          return usersFriendObj
        })
        res.json(usersFriendData);
      } else {
        // if there is no logged in user, return all data with no connected info
        // should not display a button to connect/disconnect unless logged in
        // res.status(403).send("login first man")
        res.json(dbUser)
      }
    })
    // .catch(err => {
    //   console.log(err.message);
    //   res.status(500).send(err.message);
    // });
  });


  // Signup Route
  app.post("/api/signup", function (req, res) {
    // console.log("req.body", req.body);
    db.User.create(req.body
    ).then(newUser => {
      console.log("req.body", req.body);
      const token = jwt.sign({
        username: newUser.username,
        id: newUser.id
      }, "connectflix",
        {
          expiresIn: "5h"
        })
      return res.json({ user: newUser, token })

    }).catch(err => {
      console.log(err);
      res.status(500).json(err)
    })
  });

  // Login Route
  app.post("/api/login", (req, res) => {
    console.log("hitting login");
    // console.log(req.body);

    db.User.findOne({
      where: {
        username: req.body.username
      },
      // include: [db.Likes]
    }).then(userData => {
      // console.log("userdata ", userData);
      if (!userData.password) {
        res.status(404).send("No such user exists!")
      }
      else if (bcrypt.compareSync(req.body.password, userData.password)) {

        const token = jwt.sign({
          username: userData.username,
          id: userData.id
        }, "connectflix",
          {
            expiresIn: "5h"
          })
        // console.log("token ", token);
        return res.json({ userData, token })
      } else {
        // req.session.destroy()
        return res.status(403).send("Wrong password")
      }
      // }
    })
    // .catch(err => {
    //   res.status(500).json(err)
    // });
  });


  // Likes route to record which movies are liked by user
  app.post("/api/likes", async function (req, res) {
    // console.log("hitting likes");
    // console.log("req ", req.body);
    let userData = authenticateMe(req);
    // console.log(userData);
    if (!userData) {
      res.status(403).send("login first man");
    } else {
      const likedMovie = await db.Likes.create({
        UserId: userData.id,
        title: req.body.title,
        poster: req.body.poster,
        imdb: req.body.imdb,
        synopsis: req.body.synopsis
      })
      console.log(likedMovie);
      const userFriendLikes = await db.User.findAll({
          where: {
            id: userData.id,
          },
          attributes: ["username"],
            include: [{model: db.User, as: "Friend",
            attributes: ["username"],
            include: [{model: db.Likes, 
              attributes: ["title"]
            }]
          }]
        })
        console.log(userFriendLikes);
        // current user's list of friends and which movies they liked. Loop through userFriendLikes to find if a movie in array matches likedMovie
        for (let i = 0; i < userFriendLikes[0].Friend[0].Likes.length; i++) {
          if(likedMovie.title===userFriendLikes[0].Friend[0].Likes[i].title){
            res.json(true)
          }
        }
        res.json(false)
    }
  });
  


// add user in database as association "friend"

  app.put("/api/addFriend", (req, res) => {
    console.log("hitting addFriend");
    console.log(req.body);


    // find the logged in user
    let userData = authenticateMe(req);
    console.log("userData ", userData);
    if (!userData) {
      res.status(403).send("login first man");
    } else {
      db.User.findOne({
        where: {
          id: userData.id
        },
      }).then(dbUser => {
        console.log("dbUser ", dbUser);

        // add the targeted user as an association

        dbUser.addFriend(req.body.friendId)
        res.json(dbUser)
      }).catch(err => {
        console.log(err.message);
        res.status(500).send(err.message)
      })
    }
  })

  
  app.get("/secretclub", (req, res) => {
    let token = false;
    if (!req.headers) {
      token = false
    }
    else if (!req.headers.authorization) {
      token = false
    }
    else {
      token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
      res.status(403).send("log in first")
    }
    else {
      const data = jwt.verify(token, "connectflix", (err, data) => {
        if (err) {
          return false
        } else {
          return data
        }
      })
      if (data) {
        res.send("You're in " + data.username)
      } else {
        res.status(403).send("Authorization failed")
      }
    }
  })

}
  
