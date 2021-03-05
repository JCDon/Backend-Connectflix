const bcrypt = require("bcrypt")
// const UserFriend = require("./UserFriend")
// console.log(UserFriend);
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Giving the User model a name of type STRING
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING
  });

  User.associate = function(models) {
    // Associating User with Likes
    // When an User is deleted, also delete any associated Likes
    User.hasMany(models.Likes, {
      onDelete: "cascade"
    });
    User.belongsToMany(models.User,
       { 
         as: 'Friend', 
         through: "UserFriend" 
        }
        );
    // User.belongsToMany(models.User,
    //    { 
    //      as: 'User_Friend',
    //      through: "UserFriend" 
    //     }
    //     );
  };
  // utilize bcrypt to encrypt password
  User.beforeCreate(user => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  })


  // User.prototype.validPassword = function(password) {
  //   return bcrypt.compareSync(password, this.password);
  // };
  // User.addHook(`beforeSave`, user => {
  //   const rounds = 10;
  //   user.password = bcrypt.hashSync(
  //     user.password,
  //     bcrypt.genSaltSync(rounds),
  //     null
  //   );
  // });

  return User;
};
