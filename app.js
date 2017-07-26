/**
 * Start the application
 * @author Cassiano Vellames <c.vellames@outlook.com
 */

// Loading modules
var bodyParser = require("body-parser");
var express = require("express");
var expressLoad = require("express-load");

// My Modules
const returnUtils = require("./utils/return")();

// Init express
var app = express();

// Config body-parser
app.use(bodyParser.json());
app.use(function(err,req,res,next){
    //Check errors in JSON
    if(err.stack){
        res.status(returnUtils.BAD_REQUEST).json(returnUtils.invalidJSON());
    } else {
        delete req.body.id;
        next();
    }
});

// Config loads
expressLoad("db.js").
then("controllers").
then("routes").
into(app);

// Sync database and start up node server
app.db.sequelize.sync({force:false}).done(function(){
    app.listen(3000, function(){
        const initialLoad = require("./config/initial_load")(app);
        initialLoad.emergencyTypes();

        console.log("App running in port 3000");
    });
});