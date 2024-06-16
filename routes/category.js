const route = require('express').Router()
const CategoryController = require('../controllers/categoryController');

route.get('/', CategoryController.getAll)
route.get('/:id', CategoryController.getById)
route.post('/', CategoryController.create)
route.put('/:id', CategoryController.update)
route.delete('/:id', CategoryController.delete)

module.exports = route