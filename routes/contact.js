/**
 * Routes for Contacts
 * @author Cassiano Vellames
 */

const apis = require("../config/core");

module.exports = function(app){
    var controller = app.controllers.contact;
    const securityConfig = require("./../config/security")(app);
    const returnUtils = require("./../utils/return")(app);
        
    app.route("/api/contact")
        .post(controller.insert)
        .put(controller.update)
        .delete(controller.remove);

    app.get("/api/contact/:contactId", function(req, res){
        controller.getOne(req,res);    
    });

    app.get("/api/contacts", function(req,res){
        controller.getByUser(req,res);   
    });
        
     
};