module.exports = function (app){
    var controller = app.controllers.emergency;

    app.post("/api/emergency", controller.insert);
    app.get("/api/emergency/:emergencyId", controller.getOne);
    app.post("/api/emergency/add_location", controller.addLocation);
    app.post("/api/emergency/update_status", controller.updateStatus);

}