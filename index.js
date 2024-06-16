if (process.env.NODE_ENV !== 'production'){
    require("dotenv").config()
}
const express = require('express');
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors');
const route  = require('./routes');
const err = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

app.use(cors({origin: '*'}))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hai vercel')
})

app.use(route)
app.use(err)

app.listen(port, () => {
    console.log('running on port '+ port )
})

module.exports = app