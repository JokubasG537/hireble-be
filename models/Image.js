const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Image', imageSchema)
