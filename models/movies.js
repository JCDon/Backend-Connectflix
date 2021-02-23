module.exports = function(sequelize, Datatypes) {
    var Movies = sequelize.define("Movies", {
        title: Datatypes.STRING,
        year: Datatypes.INTEGER,
        description: Datatypes.STRING
    })
}