module.exports = function(app){

    const sequelize = app.db.sequelize;
    const Emergencies = app.db.models.Emergencies;
    const EmergenciesLocales = app.db.models.EmergenciesLocales;
    const Contacts = app.db.models.Contacts;
    const returnUtils = require("./../utils/return")(app);

    return {
        /**
         * Inserts a new emergency in database
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        insert : (req, res) => {

            // Check not null params
            if(req.body.emergencyTypeId == null || req.body.lat == null || req.body.lng == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM", req.headers.locale);
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }

            // Object to return
            var emergencyId = {};
            var successEmergencySent = failEmergencySent = [];

            sequelize.transaction(function(t){
                // Creates the emergency
                return Emergencies.create({
                    status: "IN_PROGRESS",
                    emergency_type_id: req.body.emergencyTypeId,
                    user_id: req.userInfo.id
                }, {transaction: t}).then(function(emergency){
                    emergencyId = emergency.id;

                    // So, creates the locale of emergency
                    return EmergenciesLocales.create({
                        latitude: req.body.lat,
                        longitude: req.body.lng,
                        emergency_id: emergencyId
                    }, {transaction: t}).then(function(){
                        
                        // Finds all contacts to send the sms
                        return Contacts.findAll({where : {
                            user_id: req.userInfo.id 
                        }, transaction : t}).then(function(contacts){
                            contacts.forEach(function(contact){
                                app.plivo.sendEmergency(contact.phone, req.userInfo.name, "nao tem url ainda :)", function(err){
                                    if(err){
                                        failEmergencySent.push(contact);
                                    } else {
                                        successEmergencySent.push(contact);
                                    }
                                });
                            });
                            if(successEmergencySent.length === 0){
                                //throw new Error("No messages are sent");
                            }
                        })
                    });
                    
                });
            }).then(function(result){
                // Sent the emergency object to endpoint
                Emergencies.getEmergency(emergencyId, function(emergency){
                    const msg = returnUtils.getI18nMessage("EMERGENCY_INSERTED", req.headers.locale);
                    const returnObj = {emergency, successEmergencySent, failEmergencySent};
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg, returnObj));
                });
            }).catch(function(err){
                console.log(err);
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
            });

        },

        /**
         * Inserts a new location of emergency
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        addLocation: async (req, res) => {

            // Check not null params
            if(req.body.id == null || req.body.lat == null || req.body.lng == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM", req.headers.locale);
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }

            // Checks if emergency belongs to user
            if(! await Emergencies.userIsOwner(req.body.id, req.userInfo.id)){
                const msg = returnUtils.getI18nMessage("EMERGENCY_USER_IS_NOT_OWNER", req.headers.locale);
                res.status(returnUtils.FORBIDDEN_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }

            EmergenciesLocales.create({
                latitude: req.body.lat,
                longitude: req.body.lng,
                emergency_id: req.body.id
            }).then(function(emergencyLocation){
                // Sent the emergency object to endpoint
                Emergencies.getEmergency(req.body.id, function(emergency){
                    const msg = returnUtils.getI18nMessage("EMERGENCY_LOCATION_INSERTED", req.headers.locale);
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg, emergency));
                });
            }).catch(function(err){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
            });
        },

        /**
         * Changes the status of an emergency
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        updateStatus: (req, res) => {
            // Check not null params
            if(req.body.id == null || req.body.status == null){
                const msg = returnUtils.getI18nMessage("MISSING_PARAM", req.headers.locale);
                res.status(returnUtils.BAD_REQUEST).json(returnUtils.requestFailed(msg));
                return;
            }

            Emergencies.update({
                status: req.body.status.toUpperCase()
            }, {
                where: {
                    id: req.body.id,
                    user_id: req.userInfo.id,
                }
            }).then(() => {
                const msg = returnUtils.getI18nMessage("EMERGENCY_STATUS_UPDATED", req.headers.locale);
                res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg));
            }).catch((err) => { console.log(err);
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
            })
        }
    }
}