const bcrypt = require('bcrypt')
const db = require('../config/db')

class User {
    static async createUser(UserId, UserName, Password) {
        const saltRounds = 10
        const hashPassword = await bcrypt.hash(Password, saltRounds)


        const sql = `INSERT INTO Users (UserId, UserName, Password)
            VALUES (?, ?, ?)
        `

        const [rows] = await db.execute(sql, [UserId, UserName, hashPassword])

        // Gán role mặc định là viewer
        const sqlAssignRole = 'INSERT INTO User_Role (UserId, RoleId) VALUES (?, ?)'
        await db.query(sqlAssignRole, [UserId, '3'])
        return rows

    }

    static async getUserRoles(UserId) {
        const sql = `
            SELECT r.RoleName, p.PermissionName 
            FROM UserRole ur
            JOIN Role r ON ur.RoleId = r.RoleId
            JOIN RolePermission rp ON r.RoleId = rp.RoleId
            JOIN Permission p ON rp.PermissionId = p.PermissionId
            WHERE ur.UserId = ?
        `
        const [rows] = await db.query(sql, [UserId]);
    
        return rows;
      }

    static async findUserById(UserId) {
        const sql = `
            SELECT UserId, UserName, Password
            FROM Users
            WHERE UserId = ?
        `
        const [rows] = await db.execute(sql, [UserId])
        return rows[0]
    }

    static async getAllUsers() {
        const sql = `
            SELECT UserId, UserName
            FROM Users
        `
        const [rows] = await db.query(sql)
        return rows
    }
    static async updateUser(Address, Phone, UserId){
        const sql = `UPDATE USERS SET Address = ?, Phone = ? WHERE UserId = ?`
        const [rows] = await db.query(sql, [Address, Phone, UserId])
        return rows
    }
}

module.exports = User