/**
 * Start the application
 * @author Cassiano Vellames <c.vellames@outlook.com
 */

// Loading modules
const bodyParser = require("body-parser");
const express = require("express");
const expressLoad = require("express-load");
const i18n = require("i18n");
const cluster = require("cluster");

// My Modules
const returnUtils = require("./utils/return")(app);

// Init express
var app = express();

// Insert configs and utils in application
app.core = require("./config/core");
app.plivo = require("./utils/plivo")(app);

// Config i18n
i18n.configure({
    locales: app.core.i18n.LOCALES,
    directory: __dirname + app.core.i18n.DIRECTORY,
    defaultLocale: app.core.i18n.DEFAULT_LANGUAGE
});
app.i18n = i18n;

// Config body-parser
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// Middware for authorization routes
const securityConfig = require("./config/security")(app);
app.use(function(req,res,next){
    if(app.core.authorization[req.path].indexOf(req.method) >= 0){
        securityConfig.checkAuthorization(req, res, function(){
            next();
        });
    } else {
        next();
    }
});

// Config loads
expressLoad("db.js").
then("controllers").
then("routes").
into(app);

// Make public the users photo
app.use("/users/photos", express.static("public/users/photos"));


// Sync database and start up node server
app.db.sequelize.sync({force:false}).done(function(){
    app.listen(app.core.server.PORT, function(){
        const initialLoad = require("./config/initial_load")(app);
        initialLoad.emergencyTypes();
        app.emit("serverStarted");

        if(app.core.server.getEnvironment() === "dev"){
            console.log("App running in port " + app.core.server.PORT);
        }

        if(app.core.server.getEnvironment() !== "ci"){
            console.log("Environment: " + app.core.server.getEnvironment());
        }
    });
});

module.exports = app;