const express = require("express");
const router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt')
// BULK CREATE USERS ON PAGE LOAD? ON BUTTON CLICK?
// GET route for retrieving all users from USER table
router.get("/api/users", (req, res) => {
  db.User.findAll({
    include: [{
      model: db.User,
      as: 'Friend'
    }]
  }).then(dbUser => {
    if (req.session.user) {
      // find the current logged in user
      const foundUser = dbUser.find(user => user.id === req.session.user.id);
      // searches the found user and builds an array from their associations
      const assocArr = foundUser.Associate.map(e => e.UserAssociate.AssociateId)
      // maps across all users to add the isConnected boolean
      const usersAssocData = dbUser.map(obj => {
        const usersAssocObj = obj.toJSON();
        // if the user id is inside the array, then add true/false to the object
        if (assocArr.includes(usersAssocObj.id)) {
          usersAssocObj.isConnected = true;
        } else {
          usersAssocObj.isConnected = false;
        }
        return usersAssocObj
      })
      res.json(usersAssocData);
    } else {
      // if there is no logged in user, return all data with no connected info
      // should not display a button to connect/disconnect unless logged in
      res.json(dbUser)
    }
  }).catch(err => {
    console.log(err.message);
    res.status(500).send(err.message);
  });
});