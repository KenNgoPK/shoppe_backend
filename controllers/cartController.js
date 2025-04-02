const CartModel = require('../models/cartModel')

exports.getCartProducts = async(req, res) => {
    try {
        const {userId} = req.query
        const result = await CartModel.getCartProducts(userIdId);
        return res.status(200).json({
            status: "successed",
            message: "Get product successed",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Get cart failed",
            data: null
        })
    }
}
