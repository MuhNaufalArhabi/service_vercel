const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPass = (pass) => {
    return bcrypt.hashSync(pass, 10)
}

const comparePass = (pass, hash) => {
    return bcrypt.compareSync(pass, hash)
}

const encode = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET)
}

const verifyToken = (payload) => {
    return jwt.verify(payload, process.env.JWT_SECRET)
}

const convertDate = (date) => {
    return new Date(`'${date}'`).toLocaleDateString('us-US', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' }) 
}



module.exports = {
    hashPass,
    comparePass,
    encode,
    verifyToken,
    convertDate
}