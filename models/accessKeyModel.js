const db = require('../config/db')

class AccessKeyModel {
    static async createAccessKey(UserId, AccessPublicKey) {
        const sql = `INSERT INTO AccessPublicKey (UserId, AccessPublicKey) VALUES (?, ?)`
        const [rows] = await db.execute(sql, [UserId, AccessPublicKey])
        return rows
    }

    static async findAccessKeyByUserId(UserId) {
        const sql = `
            SELECT UserId, AccessPublicKey
            FROM AccessPublicKey
            WHERE UserId = ?
            ORDER BY Id DESC
            LIMIT 1
            `
        const [rows] = await db.execute(sql, [UserId])
        return rows[0]
    }

    static async deleteAccessKeyByUserId(UserId) {
        const sql = `
            DELETE FROM AccessPublicKey
            WHERE UserId = ?
            `
        const [rows] = await db.execute(sql, [UserId])
        return rows[0]
    }
}

module.exports = AccessKeyModel