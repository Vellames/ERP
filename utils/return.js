/**
 * Return pattern for application
 * @returns {{OK_REQUEST: number, BAD_REQUEST: number, FORBIDDEN_REQUEST: number, INTERNAL_SERVER_ERROR: number, invalidJSON: ({status, message, content}|*), internalServerError: ({status, message, content}|*), forbiddenRequest: ({status, message, content}|*), requestCompleted: requestCompleted, requestFailed: requestFailed}}
 */
module.exports = function(app){

    function getResponseJSON(message, content){
        return {
            message: message,
            content: content === undefined ? null : content
        }
    }

    /**
     *
     * @author Cassiano Vellames <c.vellames@outlook.com>
     * @param info Phone Number or locale
     * @param i18nKey Key to get i18n
     * @param isNumber If is number, the function verify the first 3 digits to choose a language
     * @returns {string} Returns the value of key passed in right locale
     */
    function getI18nMessage(i18nKey, info,  isNumber){
        var locale = null;
        if(isNumber){
            try{
                switch(info.substr(0,3)){
                    case "+55":
                        locale = "ptbr";
                        break;
                    default:
                        locale = "en";
                        break;
                }
            } catch (err) {
                locale = app.core.i18n.DEFAULT_LANGUAGE;
            }
        } else {
            // If locale is null or if is a invalid locale, set the default language
            locale = info == null || app.core.i18n.LOCALES.indexOf(info) == -1 ? app.core.i18n.DEFAULT_LANGUAGE : info;
        }

        app.i18n.setLocale(locale);
        return app.i18n.__(i18nKey);
    }

    return {

        OK_REQUEST: 200,
        BAD_REQUEST : 400,
        FORBIDDEN_REQUEST: 403,
        INTERNAL_SERVER_ERROR: 500,

        invalidJSON : function(locale){
            return getResponseJSON(getI18nMessage("INVALID_JSON", locale), null);
        },

        internalServerError: function(locale){
            return getResponseJSON(getI18nMessage("INTERNAL_SERVER_ERROR", locale), null);
        },

        forbiddenRequest: function(locale){
            return getResponseJSON(getI18nMessage("FORBIDDEN_REQUEST", locale) , null);
        },

        requestCompleted : function(msg, content){
            return getResponseJSON(msg, content)
        },

        requestFailed: function(msg, content){
            return getResponseJSON(msg, content)
        },

        getI18nMessage : function(i18nKey, info,  isNumber){
            return getI18nMessage(i18nKey, info, isNumber);
        }

    }

}