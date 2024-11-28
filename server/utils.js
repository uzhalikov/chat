const { hash, verify } = require('argon2')

exports.cleanString = (str) => str.trim().toLowerCase()
exports.encodePassword = (text) => {
    return hash(text)
}
exports.checkCode = async(oldData, userData) => {
    return await verify(oldData, userData)
}
exports.runAsync = async(userData, func) => {
    return await func(userData)
}
exports.createDate = (time) => {
    const current = new Date()
    current.setMinutes(current.getMinutes() + Number(time))
    return current.toISOString()
}