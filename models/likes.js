module.exports = function(sequelize, DataTypes) {
  var Likes = sequelize.define("Likes", {
    title: DataTypes.STRING,
    poster: DataTypes.STRING,
    imdb: DataTypes.DECIMAL(10, 2),
    synopsis: DataTypes.STRING
  });

  Likes.associate = function(models) {
    // We're saying that a Likes should belong to an User
    // A Like can't be created without an User due to the foreign key constraint
    Likes.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Likes;
};
