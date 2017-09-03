module.exports = function(sequelize, Sequelize){
    const Contacts = sequelize.define("Contacts", {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        phone:{
            type: Sequelize.STRING(15),
            allowNull: false
        }
    }, {
        tableName: "contacts"
    });
    
    Contacts.associate = (models) => {
        Contacts.belongsTo(models.Users, {foreignKey: {allowNull: false}});
    }

    return Contacts;
};
