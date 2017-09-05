/**
 * Routes for Contacts
 * @author Cassiano Vellames
 */

module.exports = function(app){
    const securityConfig = require("./../utils/security")(app);
    const returnUtils = require("./../utils/return")(app);
    const controller = app.controllers.contact;
        
    app.route("/api/contact")
        .post(securityConfig.checkAuthorization, controller.insert)
        .put(securityConfig.checkAuthorization, controller.update)
        .delete(securityConfig.checkAuthorization, controller.remove);
    app.get("/api/contact/:contactId", securityConfig.checkAuthorization, controller.getOne);
    app.get("/api/contacts", securityConfig.checkAuthorization, controller.getByUser);        
};