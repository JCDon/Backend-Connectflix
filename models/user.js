const bcrypt = require("bcrypt")
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
  };
  User.associate = function(models) {
    // Associating User with Dislikes
    // When an User is deleted, also delete any associated Dislikes
    User.hasMany(models.Dislikes, {
      onDelete: "cascade"
    });
  };
  User.associate = function(models) {
    // Associating User with Friends
    // When an User is deleted, also delete any associated Friends
    User.hasMany(models.Friends, {
      onDelete: "cascade"
    });
  };

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  User.addHook(`beforeSave`, user => {
    const rounds = 10;
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(rounds),
      null
    );
  });

  return User;
};
