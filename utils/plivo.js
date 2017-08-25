/**
 * SMS functions
 * @param app Express aplication
 * @returns {{send: send, sendActivationCode: sendActivationCode}}
 */
module.exports = function(app){
    const plivo = require('plivo');
    const returnUtils = require("./return")(app);
    
    return {
        /**
         * Default method to send sms
         * Only in production environment
         * @author Cassiano Vellames <c.vellames@outlook.com<
         * @param dst Number destiny
         * @param txt Text to send
         */
        send: function(dst, txt){

            if(app.core.server.getEnvironment() != "production"){
                return;
            }

            var p = plivo.RestAPI({
              authId: app.core.plivo.AUTH_ID,
              authToken: app.core.plivo.AUTH_TOKEN
            });

            var params = {
                'src': app.core.plivo.SRC_NUMBER,
                'dst' : dst,
                'text' : txt
            };
            p.send_message(params, function (status, response) {
                console.log('Status: ', status);
                console.log('API Response:\n', response);

                if(status != 202){
                    throw response.error;
                }
            });
        },

        /**
         * Send an sms with the activation code to number
         * @author Cassiano Vellames <c.vellames@outlook.com>
         * @param dst Number destiny
         * @param activationCode Activation code
         */
        sendActivationCode: function(dst, activationCode){
            const plivoMsg = returnUtils.getI18nMessage("PLIVO_ACTIVATION_CODE", dst, true) + activationCode;
            this.send(dst, plivoMsg);
        },
        
        /**
         * Send a sms to contact added by user
         * @param dst Number destiny
         * @param username name of user
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        sendNewContactInformation: function(dst, username){
            const plivoMsg = username + " " + returnUtils.getI18nMessage("PLIVO_NEW_CONTACT", dst, true);
            this.send(dst, plivoMsg);
        },

        /**
         * Send an emergency sms
         * @param dst Number destiny
         * @param username username that are sending the message
         * @param url Emergency url for web access
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        sendEmergency: function(dst, username, url){
            const plivoMsg = username + " " + returnUtils.getI18nMessage("PLIVO_NEW_EMERGENCY", dst, true);
            this.send(dst, plivoMsg);
        }
    };
};