const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const fs = require('fs')
const UserModel = require('../models/userModel')
const AccessKeyModel = require('../models/accessKeyModel')
const RefreshKeyModel = require('../models/refreshKeyModel')
const { createKeyPairs } = require('../utils/createKeyPairs')

exports.register = async (req, res) => {
    try {
        const { UserId, UserName, Password } = req.body
        await UserModel.createUser(UserId, UserName, Password)
        return res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: null
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'User create failed',
            data: error
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { UserId, Password } = req.body
        const foundUser = await UserModel.findUserById(UserId)
        if (!foundUser || !(await bcrypt.compare(Password, foundUser.Password))) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid credentials',
                data: null
            })
        }

        const userId = foundUser.UserId

        const data = {
            userId: foundUser.UserId,
            userName: foundUser.UserName
        }

        const { privateKey: accessPrivateKey, publicKey: accessPublicKey } = createKeyPairs()
        const { privateKey: refreshPrivateKey, publicKey: refreshPublicKey } = createKeyPairs()


        await AccessKeyModel.createAccessKey(userId, accessPublicKey)
        await RefreshKeyModel.createRefreshKey(userId, refreshPublicKey)

        const accessToken = jwt.sign(data, accessPrivateKey, {
            algorithm: 'RS256',
            expiresIn: '30m'
        })

        const refreshToken = jwt.sign(data, refreshPrivateKey, {
            algorithm: 'RS256',
            expiresIn: '7d'
        })
        return res.status(200).json({
            status: 'success',
            message: 'Login successfully',
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        })


    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Login failed',
            data: error
        })
    }
}


exports.refreshToken = async (req, res) => {

    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized',
                data: null
            })
        }

        const userRefreshToken = authHeader.split(" ")[1]

        const userId = req.body.userId

        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized',
                data: null
            })
        }

        const foundRefreshKey = await RefreshKeyModel.findRefreshKeyByUserId(userId)

        if (!foundRefreshKey) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized',
                data: null
            })
        }

        const publicKey = foundRefreshKey.RefreshPublicKey

        const decoded = jwt.verify(userRefreshToken, publicKey)
        
        const payload = {
            userId: decoded.userId,
            userName: decoded.userName
        }

        const { privateKey: accessPrivateKey, publicKey: accessPublicKey } = createKeyPairs()
        const { privateKey: refreshPrivateKey, publicKey: refreshPublicKey } = createKeyPairs()

        await AccessKeyModel.createAccessKey(userId, accessPublicKey)
        await RefreshKeyModel.createRefreshKey(userId, refreshPublicKey)

        const accessToken = jwt.sign(payload, accessPrivateKey, {
            algorithm: 'RS256',
            expiresIn: '1h'
        })

        const refreshToken = jwt.sign(payload, refreshPrivateKey, {
            algorithm: 'RS256',
            expiresIn: '7d'
        })

        return res.status(200).json({
            status: 'success',
            message: 'Refresh Token Successfully',
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Refresh Token Failed',
            data: error
        })
    }
}

exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - No token provided',
            })
        }

        const token = authHeader.split(' ')[1]
        
        // Lấy public key từ DB để verify token
        const foundUser = await UserModel.findUserByToken(token)
        if (!foundUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token',
            })
        }

        const AccessPublicKey = await AccessKeyModel.getAccessKeyByUserId(foundUser.UserID)
        if (!AccessPublicKey) {
            return res.status(401).json({
                status: 'error',
                message: 'Token is no longer valid',
            })
        }

        // Giải mã token để lấy userId
        const decoded = jwt.verify(token, accessPublicKey, { algorithms: ['RS256'] })
        const UserId = decoded.UserId

        // Xóa accessKey và refreshKey khỏi database
        await AccessKeyModel.deleteAccessKeyByUserId(UserId)
        await RefreshKeyModel.deleteRefreshKeyByUserId(UserId)

        return res.status(200).json({
            status: 'success',
            message: 'Logout Successfully',
        })

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Logout Failed',
            error: error.message 
        })
    }
}
exports.updateUser = async (req, res) => {
    try {
        const {Address, Phone} = req.body
        const {UserId} = req.params
        await UserModel.updateUser(Address, Phone, UserId)
        return res.status(200).json({
            status: 'success',
            message: 'Update Successfully',
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Update Failed',
            error: error.message 
        })
    }


}
