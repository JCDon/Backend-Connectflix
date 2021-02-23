module.exports = function(sequelize, DataTypes) {
    var Groups = sequelize.define("Groups", {
      group_name: DataTypes.STRING
    });

    return Groups;
};