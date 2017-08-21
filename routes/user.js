/**
 * Routes for User
 * @author Cassiano Vellames
 */

const multiparty = require("connect-multiparty");

module.exports = function(app){
    const securityConfig = require("./../config/security")(app);
    var controller = app.controllers.user;
    
    app.route("/api/user")
        .put(controller.insert)
        .patch(controller.update)
        .get(controller.get);


    app.post("/api/user", multiparty(), function(req,res){
        securityConfig.checkAuthorization(req, res, function(){
            controller.updatePhoto(req,res);
        })
    });

    app.route("/api/user/activate").
        post(controller.checkActivationCode);
    
    app.get("/", function(req,res){
        res.json({"Hi" : "Aloha!!!!!!!!!"})
    });

    
};