module.exports = function(sequelize, Sequelize){
    const Emergencies = sequelize.define("Emergencies", {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: Sequelize.ENUM(100),
            allowNull: false,
            values: ["IN_PROGRESS", "SOLVED", "CANCELED", "EXPIRED"]
        }
    }, {
        tableName: "emergencies",
        classMethods: {
            associate: function(models){
                Emergencies.belongsTo(models.EmergencyTypes, {foreignKey: {allowNull: false}});
                Emergencies.belongsTo(models.Users, {foreignKey: {allowNull: false}});
                Emergencies.hasMany(models.EmergenciesLocales);
            }
        }
    });

    /**
     * Get an emergency from database
     * @param emergencyId Id of emergency
     * @param callback Return callback
     * @author Cassiano Vellames <c.vellames@outlook.com>
     */
    Emergencies.getEmergency = function(emergencyId, callback){
        const EmergenciesLocales = sequelize.models.EmergenciesLocales;
        const EmergencyTypes = sequelize.models.EmergencyTypes;

        const params = {
            where : { 
                id: emergencyId
            }, 
            attributes: [
                "id", "status", "created_at", "updated_at", "user_id"
            ],
            include: [
                {model: EmergenciesLocales, attributes: ["id", "latitude", "longitude", "created_at", "updated_at"]}, 
                {model: EmergencyTypes}
            ]
        }

        Emergencies.findOne(params).then(function(emergency){
            callback(emergency);
        });
    }

    return Emergencies;
};
