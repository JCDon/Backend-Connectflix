module.exports = function(sequelize, DataTypes) {
    var Friends = sequelize.define("Friends", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING
    });

    return Friends;
};
