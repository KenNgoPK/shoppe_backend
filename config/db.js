const mysql = require('mysql2/promise')
// nhập thư viện MySQL dành cho Node.js
// promise giúp ta use async/awai thay vì dùng call back
const dotenv = require('dotenv')
// nhập thư viện dotenv
dotenv.config()
// gọi hàm config của dotenv để dùng file .env
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 100,// số lượng connection max
    queueLimit: 0, // không giới hạn hàng chờ
    // waitForConnection: true // cho phép chờ
})

module.exports = db
