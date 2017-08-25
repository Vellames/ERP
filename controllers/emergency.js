module.exports = function(app){

    const sequelize = app.db.sequelize;
    const Emergencies = app.db.models.Emergencies;
    const EmergenciesLocales = app.db.models.EmergenciesLocales;
    const returnUtils = require("./../utils/return")(app);

    return {
        /**
         * Inserts a new emergency in database
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        insert : function(req, res){

            // Object to return
            var emergencyId = {};

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
                    }, {transaction: t})
                });
            }).then(function(result){

                Emergencies.getEmergency(emergencyId, function(emergency){
                    const msg = returnUtils.getI18nMessage("EMERGENCY_INSERTED", req.headers.locale);
                    res.status(returnUtils.OK_REQUEST).json(returnUtils.requestCompleted(msg, emergency));
                })

            }).catch(function(err){
                res.status(returnUtils.INTERNAL_SERVER_ERROR).json(returnUtils.internalServerError());
            });

        }
    }
}