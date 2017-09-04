/**
 * Routes for User
 * @author Cassiano Vellames
 */

const multiparty = require("connect-multiparty");
var i =0;
module.exports = function(app){
    const securityConfig = require("./../utils/security")(app);
    var controller = app.controllers.user;
    
    app.route("/api/user")
        .post(multiparty(), controller.updatePhoto)
        .put(controller.insert)
        .patch(controller.update)
        .get(controller.get);
    app.post("/api/user/activate", controller.checkActivationCode)
    
    app.get("/", function(req,res){
        res.json({"Hi" : "Aloha!!!!!!!!!"})
        console.log("/ " + ++i);
    });
};