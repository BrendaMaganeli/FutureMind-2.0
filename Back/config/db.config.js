const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'nozomi.proxy.rlwy.net',
    port: 33546,
    user: 'root',
    password: 'iiKsgqutnDNKXicApVVxBVGHYuYiiXzB',
    database: 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;