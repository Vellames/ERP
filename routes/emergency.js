module.exports = function (app){
    var controller = app.controllers.emergency;

    app.route("/api/emergency")
        .post(controller.insert);

    app.post("/api/emergency/add_location", controller.addLocation);
    app.post("/api/emergency/update_status", controller.updateStatus);
}