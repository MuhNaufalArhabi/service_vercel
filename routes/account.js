const route = require('express').Router()
const AccountController = require('../controllers/accountController');

route.get('/', AccountController.getAll)
route.get('/:id', AccountController.getById)
route.post('/', AccountController.create)
route.put('/:id', AccountController.update)
route.delete('/:id', AccountController.delete)

module.exports = route