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

  return User;
};
