let db = require("../models");

module.exports = function(app) {
    
    app.get("/api/login", function(req, res){
        console.log("login route");
    })
}