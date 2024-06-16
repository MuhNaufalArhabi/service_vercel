const route = require('express').Router();
const auth = require('../middlewares/auth');
const user = require('./user');
const account = require('./account');
const category = require('./category');
const transaction = require('./transaction');
const rekap = require('./rekap');

route.get('/api', (req, res) => {
    res.status(200).json('connected')
})
route.use('/users', user)
route.use(auth)
route.use('/accounts', account)
route.use('/categories', category)
route.use('/transaction', transaction)
route.use('/rekap', rekap)

module.exports = route