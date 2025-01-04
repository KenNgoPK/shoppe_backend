const express = require('express')
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Shoppe'
})

connection.connect(err => {
    if(err) console.log(err)
    console.log('Connected to the database')
})

const app = express()
app.use(express.json())
//Xem tất cả sản phẩm
app.get('/api/products', (req, res) => {
    const sql = 'SELECT ProductID, CategoryId, ProductName, Price FROM PRODUCTS'
    connection.query(sql, (err, result) => {
        if(err){
            return res.status(400).json({
                message: 'Get Products Fail',
                err: err
            })
        }
        return res.status(200).json({
            message: 'Get Products Success',
            products: result
        })
    })
})
//Thêm 1 cái SP mới
app.post('/api/products', (req, res) => {
    const {ProductId, CategoryId, ProductName, Price} = req.body
    if(!ProductId || !CategoryId || !ProductName || !Price) return res.status(400).json({
        message: 'ProductId, CategoryId, ProductName, Price Are Required '
    })
    const sql = `INSERT INTO PRODUCTS(ProductId, CategoryId, ProductName, Price) VALUES ('${ProductId}', '${CategoryId}', '${ProductName}', ${Price} )`
    //tương tự action bôi đen xong chạy trong dbear
    connection.query(sql, (err, result) => {
        if(err){
            return res.status(400).json({
                message: "Add Products Fail",
                err: err 
            })
        }
        return res.status(201).json({
            message: 'Add Products Success',
            products: result
        })
    })
})
//Sửa SP 
app.put('/api/products/:id', (req, res) => {
    const ProductId = req.params.id
    // thường liên quan đến id là sài params
    const {CategoryId, ProductName, Price} = req.body
    const sql = `UPDATE PRODUCTS SET CategoryId = '${CategoryId}', ProductName = '${ProductName}', Price = ${Price} WHERE ProductID = '${ProductID}'`
    connection.query(sql, (err, result) => {
        if(err){
            return res.status(400).json({
                message: "Update Product Failed",
                err: err 
            })
        }
        return res.status(200).json({
            message: 'Update Product Successed',
            products: result
        })
    })

})
//xoá 1 SP
app.delete('/api/products/:id', (req, res) => {
    const ProductId = req.params.id
    // Kiểm tra đầu vào 
    // if(!ProductID) return res.json({
    //     message: 'ProductID Is Required'
    // })
    const sql = `DELETE FROM PRODUCTS WHERE ProductId = '${ProductId}'`
    connection.query(sql, (err, result) => {
        if(err){
            return res.status(400).json({
                message: "Delete Product Failed",
                err: err 
            })
        }
        return res.status(200).json({
            message: 'Delete Product Successed',
            products: result
        })
    })
})


app.listen(5001, () => {
    console.log('Sever đang listening at port 5001')
})


// viết các api crud của category
// done Dbears

//làm lại cái post trả theo từng cái