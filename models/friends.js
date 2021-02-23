module.exports = function(sequelize, DataTypes) {
    var Friends = sequelize.define("Friends", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING
    });

    Friends.associate = function(models) {
        // We're saying that a Friends should belong to an User
        // A Friend can't be created without an User due to the foreign key constraint
        Friends.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };

    return Friends;
};
