/**
 * Contact Controller
 * @author Cassiano Vellames <c.vellames@outlook.com>
 */
module.exports = function(app){
    
    const sequelize = app.db.sequelize;
    const Contacts = app.db.models.Contacts;
    const securityConfig = require("./../config/security")(app);
    const returnUtils = require("./../utils/return")(app);
    
    return {
        
        /**
         * Get all contacts of an user
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        getByUser: function(req,res){
            Contacts.findAll({where : {
                user_id: req.userInfo.id 
            }}).then(function(contacts){
                res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(null, contacts));
            }).catch(function(){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
            });
        },
        
        /**
         * Get one contact of user
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        getOne: function(req, res){
            Contacts.findOne({where : {
                id: req.params.contactId,
                user_id: req.userInfo.id
            }}).then(function(contact){
                if(contact === null){
                    const msg = returnUtils.getI18nMessage("CONTACT_NOT_FOUND", req.headers.locale);
                    res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                } else {
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(null, contact));
                }
            }).catch(function(){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
            });
        },
        
        /**
         * Insert a contact in database
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        insert: function(req,res){
            // Check not null params
            if(req.body.name == null || req.body.phone == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM", req.headers.locale);
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }
            
            // Check if the contact have the same number of user
            if(req.body.phone == req.userInfo.phone){
                const msg = returnUtils.getI18nMessage("INVALID_CONTACT", req.headers.locale);
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }
            
            // Check if contact already exists
            Contacts.count({where: {
                user_id: req.userInfo.id,
                phone: req.body.phone
            }}).then(function(count){
                if(count == 0){
                    Contacts.create({
                        name: req.body.name,
                        phone: req.body.phone,
                        user_id: req.userInfo.id
                    }).then(function(contact){
                        app.plivo.sendNewContactInformation(req.body.phone, req.userInfo.name);
                        const msg = returnUtils.getI18nMessage("CONTACT_INSERTED", req.headers.locale);
                        res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg, contact));
                    }).catch(function(err){
                        res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
                    });
                } else {
                    const msg = returnUtils.getI18nMessage("CONTACT_EXISTS", req.headers.locale);
                    res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                }
            }).catch(function(){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
            });
              
        },
        
        /**
         * Update a contact
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        update: function(req,res){
            // Check not null params
            if(req.body.name == null || req.body.phone == null || req.body.id == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM", req.headers.locale);
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }
            
            // Check if the contact have the same number of user
            if(req.body.phone == req.userInfo.phone){
                const msg = returnUtils.getI18nMessage("INVALID_CONTACT", req.headers.locale);
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }
            
            // Check if contact already exists
            Contacts.count({where: {
                user_id: req.userInfo.id,
                phone: req.body.phone
            }}).then(function(count){
                if(count == 0){
                    Contacts.update({
                        name: req.body.name,
                        phone: req.body.phone
                    }, { where : {
                        id: req.body.id,
                        user_id: req.userInfo.id
                    }}).then(function(count){
                        if(count == 1){
                            app.plivo.sendNewContactInformation(req.body.phone, req.userInfo.name);
                            const msg = returnUtils.getI18nMessage("CONTACT_UPDATED", req.headers.locale);
                            res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg));
                        } else {
                            res.status(returnUtils.FORBIDDEN_REQUEST).json(returnUtils.forbiddenRequest(req.headers.locale));
                        }
                    }).catch(function(err){
                        res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
                    });
                } else {
                    const msg = returnUtils.getI18nMessage("CONTACT_EXISTS", req.headers.locale);
                    res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                }
            }).catch(function(){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
            });
        },
        
        /**
         * Delete an user
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        remove: function(req,res){
            if(req.body.id == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM", req.headers.locale);
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }
            
            Contacts.destroy({where:{
                id: req.body.id,
                user_id: req.userInfo.id
            }}).then(function(count){
                if(count === 1){
                    const msg = returnUtils.getI18nMessage("CONTACT_DELETED", req.headers.locale);
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg));
                } else {
                    res.status(returnUtils.FORBIDDEN_REQUEST).json(returnUtils.forbiddenRequest(req.headers.locale));
                }
            }).catch(function(){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError(req.headers.locale));
            });
        },
    };
};