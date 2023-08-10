const mongoose = require('mongoose');
const withdrawalSchema = new mongoose.Schema({
    withdrawal_id: {
        type: String,
        required: false,
    },
    userId:{
        type: String,
        required: true,
        ref: 'users'
    },
    request_amount: {
        type: Number,
        required: false,
        default:0
    },
    total_amount: {
        type: Number,
        required: false,
        default:0
    },
    current_amount: {
        type: Number,
        required: false,
        default:0
    },
    admin_commission: {
        type: Number,
        required: false,
        default:0
    },
    admin_payto_vendor: {
        type: Number,
        required: false,
        default:0
    },
    description:{
        type: String,
        required: false,
    },
    payout_date:{
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

// withdrawalSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 }); 

module.exports = mongoose.model('withdrawal', withdrawalSchema);