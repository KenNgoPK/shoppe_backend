const express = require('express')
const mysql = require('mysql2/promise')
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Shoppe',
    connectionLimit: 100,
    queueLimit: 0,
    // 0 là ko giới hạn
    waitForConnections: true
})

const app = express()
app.use(express.json())
app.listen(5001, () => {
    console.log('Sever đang listening at port 5001')
})
// Xem tất cả sản phẩm
// app.get('/api/products', (req, res) => {
//     const sql = 'SELECT ProductID, CategoryId, ProductName, Price FROM PRODUCTS'
//     connection.query(sql, (err, result) => {
//         if(err){
//             return res.status(400).json({
//                 message: 'Get Products Fail',
//                 err: err
//             })
//         }
//         return res.status(200).json({
//             message: 'Get Products Success',
//             products: result
//         })
//     })
// })
app.get('/api/products', async (req, res) => {
    try {
        const ProductId = req.query.ProductId
        const sql = 'SELECT ProductID, CategoryId, ProductName, Price FROM PRODUCTS WHERE ProductId = ?'
        const [rows] = await connection.execute(sql, [ProductId])
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'see products fails',
            error: error
        })
    }
})

//Thêm 1 cái SP mới
app.post('/api/products', async (req, res) =>{
    try {
        const {ProductId, CategoryId, ProductName, Price} = req.body
        const sql = `INSERT INTO PRODUCTS (ProductId, CategoryId, ProductName, Price) 
                    VALUES (?, ?, ?, ?)`
        const [rows] = await connection.execute(sql,[ProductId, CategoryId, ProductName, Price])
        return res.status(200).json({
            message: 'add products succes',
            productId: rows.insertId
        })
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        return res.status(500).json({
            message: 'Thêm sản phẩm thất bại!',
            error: error.message
        });
    }
});
//Sửa SP 
// app.put('/api/products/:id', (req, res) => {
//     const ProductId = req.params.id
//     // thường liên quan đến id là sài params
//     const {CategoryId, ProductName, Price} = req.body
//     const sql = `UPDATE PRODUCTS SET CategoryId = '${CategoryId}', ProductName = '${ProductName}', Price = ${Price} WHERE ProductID = '${ProductId}'`
//     connection.query(sql, (err, result) => {
//         if(err){
//             return res.status(400).json({
//                 message: "Update Product Failed",
//                 err: err 
//             })
//         }
//         return res.status(200).json({
//             message: 'Update Product Successed',
//             products: result
//         })
//     })

// })
app.put('/api/products', async (req, res) =>{
    try {
        const ProductId = req.query.ProductId
        const {CategoryId, ProductName, Price} = req.body
        const sql = `UPDATE PRODUCTS 
        SET CategoryId = ?, ProductName = ?, Price = ? 
        WHERE ProductID = ?`
        const [rows] = await connection.execute(sql, [CategoryId, ProductName, Price, ProductId])
        return res.status(200).json({
            message: 'Cập nhật sản phẩm thành công!'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'update Products fails',
            error: error
        })
    }
})

//xoá 1 SP
// app.delete('/api/products/:id', (req, res) => {
//     const ProductId = req.params.id
//     // Kiểm tra đầu vào 
//     // if(!ProductID) return res.json({
//     //     message: 'ProductID Is Required'
//     // })
//     const sql = `DELETE FROM PRODUCTS WHERE ProductId = '${ProductId}'`
//     connection.query(sql, (err, result) => {
//         if(err){
//             return res.status(400).json({
//                 message: "Delete Product Failed",
//                 err: err 
//             })
//         }
//         return res.status(200).json({
//             message: 'Delete Product Successed',
//             products: result
//         })
//     })
// })
app.delete('/api/products',async (req, res) => {
    try {
        const ProductId = req.query.ProductId
        const sql = `DELETE FROM PRODUCTS WHERE ProductId = ?`
        const [rows] = await connection.execute(sql, [ProductId])
        return res.status(200).json({
            message: 'delete product succes'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'delete products fails'
        })
    }
})





// viết các api crud của category
// done Dbears

//làm lại cái post trả theo từng cái

//Lấy danh sách sản phẩm trong giỏ hàng của 1 userId

app.get('/api/productsInCart', async (req, res) => {
    try {
        const userId = req.query.userId 
        // const categoryId = req.query.categoryId
        const sql = 'SELECT c.ProductId, p.ProductName, p.Price, c.Quantity FROM CART_DETAIL c INNER JOIN PRODUCTS p ON c.ProductId = p.ProductId INNER JOIN CART ca ON c.CartId = ca.CartId WHERE ca.UserId = ?'
        const [rows] = await connection.execute(sql, [userId])
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'get product fail',
            error: error
        })
    }
})

//Lấy danh sách sản phẩm trong thuộc 1 categoryId
app.get('/api/productInCategory', async (req, res) => {
    try {
        const CategoryId = req.query.CategoryId
        if(CategoryId === undefined){
            // return res.status(400).json({
            //     message: 'u need to add CategoryId'
            // })
            const err = new Error('u need to add CategoryId')
            err.statusCode = 400
            throw err
        }
        const sql = 'SELECT ProductId, ProductName FROM PRODUCTS WHERE CategoryId = ?;'
        const [rows] = await connection.execute(sql, [CategoryId])
        return res.status(200).json(rows)
    } catch (error) {
        if (error.statusCode === 400){
            return res.status(400).json({
                message: error.message
            })
        }
        return res.status(500).json({
            message: 'get product fail',
            error: error
        })
    }
})
//Lấy danh sách sản phẩm dựa trên rating
app.get('/api/productInRating', async (req, res) => {
    try {
        const { rating, chooseOption } = req.body
        let sql
        let params = [rating]
        if (chooseOption === 1) {
            sql = `SELECT ProductId, ProductName, Price, Rating, Stock
                   FROM PRODUCTS
                   WHERE Rating >= ?
                   ORDER BY Rating DESC;`
        } else {
            sql = `SELECT ProductId, ProductName, Price, Rating, Stock
                   FROM PRODUCTS
                   WHERE Rating <= ?
                   ORDER BY Rating DESC;`
        }
        const [rows] = await connection.execute(sql, params)
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json(error)
    }
})
//Lấy danh sách sản phẩm dựa trên price (min, max)
app.get('/api/productInMinMax', async (req, res) => {
    try {
        const { min, max } = req.query
        const sql = `SELECT ProductId, ProductName, Price, Rating, Stock
                     FROM PRODUCTS
                     WHERE Price BETWEEN ? AND ?`
        const [rows] = await connection.execute(sql, [min, max])
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// API để lấy sản phẩm và sắp xếp theo giá hoặc rating
// Chưa active
app.get('/api/productsArrange', async (req, res) => {
    try {
        const { sortBy, order } = req.query
        const sql = `SELECT ProductId, ProductName, Price, Rating, Stock
                     FROM PRODUCTS
                     ORDER BY ${sortBy} ${order}`
        const [rows] = connection.execute(sql, [sortBy, order])
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json(error);
    }
})


//Lấy tổng tiền sản phẩm của 1 giỏ hàng của 1 userId
app.get('/api/productInTotalInCart', async (req, res) => {
    try {
        const UserId = req.query.UserId
        const sql = `SELECT SUM(p.Price * c.Quantity) AS amount
                     FROM CART_DETAIL c
                     INNER JOIN PRODUCTS p ON c.ProductId = p.ProductId
                     INNER JOIN CART ca ON c.CartId = ca.CartId
                     WHERE ca.UserId = ?;`
        const [rows] = await connection.execute(sql, [UserId])
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json(error)
    }
})







// học lại javascipt hàm sử lí bất động bộ callback asyn promise