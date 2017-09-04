module.exports = function (app){
    const securityConfig = require("./../utils/security")(app);
    const controller = app.controllers.emergency;

    app.post("/api/emergency", securityConfig.checkAuthorization, controller.insert);
    app.get("/api/emergency/:emergencyId", controller.getOne);
    app.post("/api/emergency/add_location", securityConfig.checkAuthorization,  controller.addLocation);
    app.post("/api/emergency/update_status", securityConfig.checkAuthorization, controller.updateStatus);

}