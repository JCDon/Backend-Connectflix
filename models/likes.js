module.exports = function(sequelize, DataTypes) {
  var Likes = sequelize.define("Post", {
    movie_title: DataTypes.STRING,
    movie_genre: DataTypes.STRING
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
