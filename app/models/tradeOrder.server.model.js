/**
 * Created by 晖莹 on 2017/4/25.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TradeOrderSchema = new Schema({
    created: {
        type: Date,
        default: Date.now,
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    receiver: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: String, // 待处理：pending 同意交易：agree 取消交易：cancel 交易结束：finished
        default: 'pending'
    },
    offer_or_get: {
        type: String, // 出售物品：sell 求购信息：seek
    },
    product: {
        type: Schema.ObjectId,
        ref: 'Product'
    },
    creator_message: {
        type: String,
    },
    receiver_message: {
        type: String,
    }
});
mongoose.model('TradeOrder', TradeOrderSchema);