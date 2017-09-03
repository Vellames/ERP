module.exports = function(sequelize, Sequelize){
    const EmergenciesLocales = sequelize.define("EmergenciesLocales", {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        latitude: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        longitude: {
            type: Sequelize.DOUBLE,
            allowNull: false
        }
    }, {
        tableName: "emergencies_locales",
    });

    EmergenciesLocales.associate = (models) => {
        EmergenciesLocales.belongsTo(models.Emergencies, {foreignKey: {allowNull: false}});
    }

    return EmergenciesLocales;
};
