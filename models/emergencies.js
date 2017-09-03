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
        tableName: "emergencies"
    });

    Emergencies.associate = (models) => {
        Emergencies.belongsTo(models.EmergencyTypes, {foreignKey: {allowNull: false}});
        Emergencies.belongsTo(models.Users, {foreignKey: {allowNull: false}});
        Emergencies.hasMany(models.EmergenciesLocales);
    }

    /**
     * Get an emergency from database
     * @param emergencyId Id of emergency
     * @param successCallback Return callback success
     * @param failCallback return callback fail
     * @author Cassiano Vellames <c.vellames@outlook.com>
     */
    Emergencies.getEmergency = function(emergencyId, successCallback, failCallback){
        const EmergenciesLocales = sequelize.models.EmergenciesLocales;
        const EmergencyTypes = sequelize.models.EmergencyTypes;
        const Users = sequelize.models.Users;

        const params = {
            where : { 
                id: emergencyId
            }, 
            attributes: [
                "id", "status", "created_at", "updated_at"
            ],
            include: [
                {model: EmergenciesLocales, attributes: ["id", "latitude", "longitude", "created_at", "updated_at"]}, 
                {model: EmergencyTypes},
                {model: Users, attributes: ["id", "name", "phone", "created_at", "updated_at"]}
            ]
        }

        Emergencies.findOne(params).then(function(emergency){
            successCallback(emergency);
        }).catch(function(err){
            failCallback(err);
        });
    }

    /**
     * Checks if user is owner of emergency
     * @param emergencyId Id of emergency
     * @param userId Id of user
     * @author Cassiano Vellames <c.vellames@outlook.com>
     */
    Emergencies.userIsOwner = async (emergencyId, userId) => {
        const emergencyCount = await Emergencies.count(
            {
                where: {
                    id: emergencyId,
                    user_id: userId,
                }
            });
        return emergencyCount === 1;  
    }

    return Emergencies;
};
