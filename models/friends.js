module.exports = function(sequelize, DataTypes) {
    var Friends = sequelize.define("Post", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING
    });

    return Friends;
};
