const route = require('express').Router()
const TransactionController = require('../controllers/transactionController');

route.get('/', TransactionController.getAll)
route.get('/:id', TransactionController.getById)
route.post('/', TransactionController.create)
route.put('/:id', TransactionController.update)
route.delete('/:id', TransactionController.delete)

module.exports = route