const mysql = require("mysql2/promise");

let pool;

function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: process.env.MYSQLDATABASE,
            port: process.env.MYSQLPORT,
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0
        });
    }
    return pool;
}

module.exports = getPool;
