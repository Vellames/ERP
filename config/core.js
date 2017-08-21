module.exports = {

    server: {
        PORT: process.env.PORT || 3000,
        getEnvironment : function(){
            return process.env.NODE_ENV.trim();
        }
    },

    uploader:{
        USER_PHOTOS_PATH: "public/users/photos/",
        ALLOWED_EXTENSIONS: [".png", ".jpg", ".jpeg"]
    },

    i18n:{
        DIRECTORY: '/i18n',
        DEFAULT_LANGUAGE: "ptbr",
        LOCALES:[
            'ptbr',
            'en'
        ]
    },

    plivo: {
        AUTH_ID: 'MAOGUYNWIWZJIXMZQYZW',
        AUTH_TOKEN: 'ZjY2MWViOTY3YzE3ZTc0YzA0MTllM2NiMGU1ZmQ0',
        SRC_NUMBER: "12345"
    },

    authorization: {
        "/api/user" : ["GET", "PATCH"],
        "/api/user/": ["POST"],
        "/api/user/activate" : ["POST"], 
        "/api/contact" : ["POST", "PUT", "DELETE"],
        "/api/contact/:contactId" : ["GET"],
        "/api/contacts" : ["GET"]
        
    }
}