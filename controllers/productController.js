const ProductModel = require('../models/productModel')

exports.getAllProducts = async (req, res) => {
    try {
        let products
        const categoryId = req.query.categoryId
        if(categoryId){
            products = await ProductModel.getAllProducts(categoryId)
        }
        products = await ProductModel.getAllProducts(categoryId)
        return res.status(200).json({   
            status: "successed",
            message: "Get product successed",
            data: products
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "failed",
            message: "Get product failed",
            data: error
        })
    }
}

exports.addAllProducts = async(req, res) => { 
    try {
        const {productId, categoryId, productName, price} = req.body 
        const result = await ProductModel.addAllProducts(productId, categoryId, productName, price)
        return res.status(200).json({
            status: "successed",
            message: "Add product successed",
            data: result            
    })
    }catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Add products successed",
            data: null
        })
    }
}

exports.updateProduct = async(req, res) => {
    try {
        console.log(req.params)
        const {categoryId, productName, price} = req.body 
        const productId = req.params.productId
        const result = await ProductModel.updateProduct(categoryId, productName, price, productId)
        return res.status(200).json({
            status: "successed",
            message: "Update product successed",
            data: result            
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "failed",
            message: "Update product failed",
            data: error
        })
    }
}

exports.deleteProducts = async(req, res) => { 
    try {
        let products
        if(req.query.productId){
            products = await ProductModel.deleteProductsProducts(productId)
        }
        products = await ProductModel.deleteProductsProducts(productId)
        return res.status(200).json({
            status: "successed",
            message: "Add product successed",
            data: products
        })
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Add product failed",
            data: null
        })
    }
}







// sau khi làm model thì sẽ bỏ qua cái controllers này để export ra
