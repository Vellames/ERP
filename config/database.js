module.exports = {
    production : {
        database: "safeapp",
        username: "root",
        password: "root",
        params: {
            logging: true,
            host: "localhost",
            dialect: "mysql",
            define: {
                underscored: true
            }
        }
    },
    test : {
        database: "safeapp_test",
        username: "root",
        password: "root",
        params: {
            logging: false,
            host: "localhost",
            dialect: "mysql",
            define: {
                underscored: true
            }
        }
    },
    ci : {
        database: "xtnih0ydn0ola6ju",
        username: "k4iy6n9ko492m6fp",
        password: "hbgg09wcom3dafze",
        params: {
            logging: false,
            host: "op2hpcwcbxb1t4z9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
            dialect: "mysql",
            define: {
                underscored: true
            }
        }
    }
};