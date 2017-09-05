function newActivationCode(){
    const min = 1000;
    const max = 9999;
    return  Math.floor(Math.random() * (max - min) + min);
}

module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("Users", {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        phone:{
            type: Sequelize.STRING(15),
            allowNull: false,
            unique: true
        },
        activationCode: {
            field: "activation_code",
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        accessToken: {
            field: "access_token",
            type: Sequelize.STRING(100),
            allowNull: true,
            unique: true
        }
    }, {
        tableName: "users"
    });

    Users.associate = (models) => {
        Users.hasMany(models.Contacts);
        Users.hasMany(models.Emergencies);
    }

    /**
     * Insert the activation code and access token in user creation
     * @author Cassiano Vellames <c.vellames@outlook.com>
     */
    Users.beforeCreate((user) => {
        user.activationCode = newActivationCode();
    });
    
    //////// Personal methods ///////
    
    /**
    *   Renew the activation code
    *   @author Cassiano Vellames <c.vellames@outlook.com>
    */
    Users.updateActivationCode = (phoneNumber) => {
        const activationCode = newActivationCode();

        const update = { activationCode: activationCode };
        const condition = { where: { phone : phoneNumber } };

        return new Promise((resolve, reject) => {
            Users.update(update, condition).then(() => {
                resolve(activationCode)
            }).catch((err) => {
                reject(err)
            });
        })
    };

    return Users;
};
