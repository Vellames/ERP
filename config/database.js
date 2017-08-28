module.exports = {
    production : {
        database: "h3bgywklct7byvpr",
        username: "amikutzlx34z19vw",
        password: "fofks62ebl9wxvh9",
        params: {
            logging: true,
            host: "jsk3f4rbvp8ayd7w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
            dialect: "mysql",
            define: {
                underscored: true
            }
        }
    },
    dev : {
        database: "safeapp",
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
    artillery : {
        database: "safeapp_artillery",
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