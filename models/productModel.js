const db = require('../config/db')

//làm của cái nào thì đặt tên cái model của nó vào
class ProductModel{
    static async getAllProducts(categoryId){
        try {
            const sql = `SELECT ProductID, CategoryId, ProductName, Price FROM PRODUCTS`
            const [rows] = await db.execute(sql)
            let filteredProducts = [...rows]
            if(categoryId){
                filteredProducts = filteredProducts.filter((product) => {
                    return product.CategoryId === categoryId
                })
            }
            return filteredProducts
        } catch (error) {
            throw error
        }
    }   //bất kì một api nào thì cũng phải tạo 1 cái statics mới 
    static async addAllProducts(productId, categoryId, productName, price){
        try {
            const sql = ` INSERT INTO PRODUCTS (ProductId, CategoryId, ProductName, Price) 
                        VALUES (?, ?, ?, ?)`
            const values = [productId, categoryId, productName, price]
            const rows = db.execute(sql, values)
            return rows
        } catch (error) {
            throw error
        }
    }

    static async updateProduct(categoryId, productName, price, productId){
        try {
            console.log({
                productId, categoryId, productName, price
            })
            const sql = `UPDATE PRODUCTS 
        SET CategoryId = ?, ProductName = ?, Price = ? 
        WHERE ProductId = ?`
            const values = [categoryId, productName, price, productId]
            const rows = db.execute(sql, values)
            return rows
        } catch (error) {
            throw error
        }

    }
    static async deleteProducts(productId){
        try {
            const sql = `DELETE FROM PRODUCTS WHERE ProductId = ?`
            const rows = db.execute(sql, [productId])
            return rows
        } catch (error) {
            throw error            
        }
    }
}

module.exports = ProductModel