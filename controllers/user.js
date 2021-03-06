/**
 * User Controller
 * @author Cassiano Vellames <c.vellames@outlook.com>
 */
module.exports = function(app){

    const fs = require("fs");
    const bcrypt = require("bcrypt");
    const sequelize = app.db.sequelize;
    const Users = app.db.models.Users;
    const securityConfig = require("./../utils/security")(app);
    const returnUtils = require("./../utils/return")(app);
    const uploader = require("./../utils/uploader")(app);
    
    return {
        
        /**
        * Get the basic information of user
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        get: async (req,res) => {
            try{
                const user = await Users.findOne({ where: {
                    accessToken : req.headers.authorization
                }});
                res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(null, user))
            } catch (err) {
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
            }
        },
        
        /**
        * Insert a new user in database or resend the activation code
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        insert: async (req,res) => {
            if(req.body.phone == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM");
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }

            try {
                const userCount = await Users.count({where : {phone : req.body.phone}});
                if(userCount === 1){
                    Users.updateActivationCode(req.body.phone).then((activationCode => {
                        app.plivo.sendActivationCode(req.body.phone, activationCode);
                        const msg = returnUtils.getI18nMessage("ACTIVATION_CODE_RESENT");
                        res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg));
                    })).catch(() => {
                        res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
                    })
                } else {
                    const user = await Users.create({phone: req.body.phone});
                    app.plivo.sendActivationCode(req.body.phone, user.activationCode);
                    user.activationCode = null;
                    const msg = returnUtils.getI18nMessage("USER_INSERTED", req.body.phone, true);
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg, user));
                }
            } catch (err) {
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
            }
        },
        
        /**
         * Update an user
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        update: async (req,res) => {
            if(req.body.name == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM", req.headers.locale);
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            };

            try{
                const usersUpdated = await Users.update({name: req.body.name},{where: {
                    accessToken : req.headers.authorization
                }});
                
                if(usersUpdated == 1){
                    const msg = returnUtils.getI18nMessage("USER_UPDATED", req.headers.locale);
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg));
                } else {
                    res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
                }
            } catch (err) {
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
            } 
        },

        /**
         * Insert a new photo of user
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        updatePhoto: function(req,res){
             uploader.upload(req ,res, uploader.USER_PHOTO_UPLOAD, function(err){
                if(err){
                    res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(err));
                } else {
                    const msg = returnUtils.getI18nMessage("PHOTO_UPDATED", req.headers.locale);
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg));
                }
            });
        },
        
        /**
        * Check the activation code and active the account if the code are correct]
        * @author Cassiano Vellames <c.vellames@outlook.com>
        */
        checkActivationCode: function(req,res){

            if(req.body.phone == null || req.body.activationCode == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM");
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }
            
            var hashToken;
            var transactionFinished = false;
            sequelize.transaction(function(t){
                return Users.findOne({
                    where : {
                        phone: req.body.phone,
                        activationCode: req.body.activationCode
                    },
                    attributes: ["id", "activationCode"]
                },{transaction : t}).then(function(user){
                    if(user === null){
                        const msg = returnUtils.getI18nMessage("ACTIVATION_CODE_DOES_NOT_MATCH");
                        res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                        transactionFinished = true;
                        return;
                    }

                    const plainToken = securityConfig.leftPadding + user.id + securityConfig.rightPadding
                    const salts = 10;
                    hashToken = bcrypt.hashSync(plainToken, salts);

                    return user.updateAttributes({
                        activationCode: null,
                        accessToken : hashToken
                    }, {transaction: t})
                })
            }).then(function(result){
                if(!transactionFinished){
                    const msg = returnUtils.getI18nMessage("USER_ACTIVATED");
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg, {accessToken : hashToken}));
                }
            }).catch(function(err){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
            });


        }
    }
};