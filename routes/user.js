/**
 * Routes for User
 * @author Cassiano Vellames
 */

const multiparty = require("connect-multiparty");

module.exports = function(app){
    const securityConfig = require("./../utils/security")(app);
    const controller = app.controllers.user;
    
    app.route("/api/user")
        .post(securityConfig.checkAuthorization, multiparty(), controller.updatePhoto)
        .put(controller.insert)
        .patch(securityConfig.checkAuthorization, controller.update)
        .get(securityConfig.checkAuthorization, controller.get);
    app.post("/api/user/activate", controller.checkActivationCode)
};