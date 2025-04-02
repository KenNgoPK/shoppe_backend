const express = require('express')
const verifyAccessToken = require('../middlewares/verifyAccessToken')
const userController = require('../controllers/userController')

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.patch('/:UserId', verifyAccessToken, userController.updateUser)

module.exports = router