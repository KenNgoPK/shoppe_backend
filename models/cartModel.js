const db = require('../config/db')

class CartModel{
    static async getCartProducts(userId){
        try {
            const sql = `SELECT c.ProductId, p.ProductName, p.Price, c.Quantity FROM CART_DETAIL c INNER JOIN PRODUCTS p ON c.ProductId = p.ProductId INNER JOIN CART ca ON c.CartId = ca.CartId WHERE ca.UserId = ?`
            const rows = db.execute(sql, [userId])
            return rows
        } catch (error) {
            throw error
        }
    }
}

module.exports = CartModel
