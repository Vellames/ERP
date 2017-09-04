/**
 * Authorization methods
 * @param app Express application
 * @returns {{leftPadding: string, rightPadding: string, checkAuthorization: checkAuthorization}}
 */
module.exports = function(app){
    const returnUtils = require("./../utils/return")(app);
    
    return {
        /**
        *   Padding for use in accesToken generator
        */
        leftPadding: "@%#$Hdsfhfd#¨#$_346234347+#$&hf",
        
        /**
        *   Padding for use in accesToken generator
        */
        rightPadding: "¨%&#$hfdsh34¨$#¨246!¨#@$¨#$ge",
        
        /**
        *   Checks if the hash sent by the endpoint is valid
        *   @author Cassiano Vellames <c.vellames@outlook.com>
        */
        checkAuthorization: function(req, res, next){
            const User = app.db.models.Users;

            const authorization = req.headers.authorization;
            const locale = req.headers.locale;

            User.findAndCountAll({where : {
                accessToken: authorization
            }}).then(function(result){
                if(result.count === 0){
                    res.status(returnUtils.FORBIDDEN_REQUEST).json(returnUtils.forbiddenRequest(locale));
                } else {
                    req.userInfo = result.rows[0];
                    next();
                }
            });
        }
    }
    
}