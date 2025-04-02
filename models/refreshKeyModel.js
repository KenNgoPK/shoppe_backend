const db = require('../config/db')

class RefreshKeyModel {
    static async createRefreshKey(UserId, RefreshPublicKey) {
        const sql = `INSERT INTO RefreshPublicKey (UserId, RefreshPublicKey) VALUES (?, ?)`
        const [rows] = await db.execute(sql, [UserId, RefreshPublicKey])
        return rows
    }
    static async findRefreshKeyByUserId(UserId) {
        const sql = `
            SELECT UserId, RefreshPublicKey
            FROM RefreshPublicKey
            WHERE UserId = ?
            ORDER BY ID DESC
            LIMIT 1
            `
        const [rows] = await db.execute(sql, [UserId])
        return rows[0]
    }
    static async deleteRefreshKeyByUserId(UserId) {
        const sql = `
            DELETE FROM RefreshPublicKey
            WHERE UserId = ?
            `
        const [rows] = await db.execute(sql, [UserId])
        return rows[0]
    }
}

module.exports = RefreshKeyModel