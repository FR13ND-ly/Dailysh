const { Schema, model } = require('mongoose')

const schema = new Schema({
    userId: {
        type: String,
        requiered: "User Id can't be empty"
    },
    text: {
        type: String
    },
    repeat: {
        type: Number,
        default: 1
    },
    repeatDone: {
        type: Number,
        default: 0
    },
    repeatWeek: {
        type: [String],
        default: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    },
    col: {
        type: Number,
        default: 1
    },
    position: {
        type: Number
    },
    lastUpdated: {
        type: Date,
        default: Date.now()
    },
    disabled: {
        type: Boolean,
        default: false
    }
    
})

module.exports = model('Task', schema)