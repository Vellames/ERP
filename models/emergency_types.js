module.exports = function(sequelize, Sequelize){
    const EmergencyTypes = sequelize.define("EmergencyTypes", {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        }
    }, {
        tableName: "emergency_types",
    });

    EmergencyTypes.associate = (models) => {
        EmergencyTypes.hasMany(models.Emergencies);
    }

    return EmergencyTypes;
};
