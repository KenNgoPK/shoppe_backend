const express = require('express')
const userRouter = require('./routes/userRouter')
const app = express()
app.use(express.json())
const productRoutes = require('./routes/productRouter') 

app.use('/api/V1/products', productRoutes)
app.use('/api/v1/users', userRouter)
app.listen(5001, () => {
    console.log('Sever đang listening at port 5001')
})



