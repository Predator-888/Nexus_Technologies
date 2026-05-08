const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    university: {
        type: String,
        required: true,
        trim: true
    },
    domain: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'PENDING'
    },
    razorpayOrderId: {
        type: String,
        index: true // For quick lookups from webhooks
    },
    razorpayPaymentId: {
        type: String
    },
    offerLetterUrl: {
        type: String
    },
    certificateUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Intern', internSchema);
