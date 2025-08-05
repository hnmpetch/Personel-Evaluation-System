const { Sequelize } = require('sequelize');
require('dotenv').config();

db_host = process.env.DB_HOST;
db_name = process.env.DB_USERNAME;
db_pass = process.env.DB_PASS;


const sequelize = new Sequelize('pes', 'root', '', {
    host: db_host,
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => console.log("[DB] Connect to database success. \nUsing host : " + db_host))
    .catch((err) => console.log("[DB] Fail to connect to database, Error: " + err));


module.exports = {
    sequelize
}