module.exports = function (app){
    var controller = app.controllers.emergency;

    app.route("/api/emergency")
        .post(controller.insert);
}