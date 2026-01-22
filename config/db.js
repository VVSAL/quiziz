const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQLDATABASE || "ujian_sekolah",
    port: process.env.MYSQLPORT || 3306
});

db.connect(err => {
    if (err) {
        console.error("DB ERROR:", err);
        return;
    }
    console.log("MySQL Connected");
});

module.exports = db;
