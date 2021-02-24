module.exports = function(sequelize, DataTypes) {
    var Dislikes = sequelize.define("Dislikes", {
      movie_title: DataTypes.STRING,
      movie_genre: DataTypes.STRING
    });
  
    Dislikes.associate = function(models) {
      // We're saying that a Dislikes should belong to an User
      // A Dislike can't be created without an User due to the foreign key constraint
      Dislikes.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Dislikes;
  };