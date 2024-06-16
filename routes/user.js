const route = require('express').Router()
const UserController = require('../controllers/userController');

route.post('/register', UserController.register)
route.post('/login', UserController.login)
route.post('/sign-in', UserController.gSign)

module.exports = route