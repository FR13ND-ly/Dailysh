const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: {
        type: String,
        required: "Username can't be empty",
        unique: true
    },
    password: {
        type: String,
        required: "Password can't be empty"
    },
    saltSecret: String
})

module.exports = model('User', schema)